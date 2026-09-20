const API_URL = "https://netfliks-api.netfliks.workers.dev";
const AUTH_KEY = "netfliks_admin_token";

const ids = [
  "siteUrl",
  "paymentEnabled",
  "price",
  "currency",
  "paymentUrl",
  "latestVersion",
  "minimumVersion",
  "forceUpdate",
  "announcement",
  "announcementEnabled"
];

const fields = Object.fromEntries(
  ids.map((id) => [id, document.getElementById(id)])
);

const gate = document.getElementById("loginGate");
const app = document.getElementById("adminApp");
const form = document.getElementById("loginForm");
const input = document.getElementById("passcode");
const error = document.getElementById("loginError");
const toggle = document.getElementById("togglePass");
const saveButton = document.getElementById("save");
const previewButton = document.getElementById("preview");
const output = document.getElementById("output");
const lockButton = document.getElementById("lock");

function setError(message = "") {
  error.textContent = message;
}

function setOutput(value, visible = true) {
  output.style.display = visible ? "block" : "none";
  output.textContent = value;
}

function unlock() {
  gate.hidden = true;
  app.hidden = false;
  saveButton.disabled = false;
}

function lock() {
  sessionStorage.removeItem(AUTH_KEY);
  saveButton.disabled = true;
  app.hidden = true;
  gate.hidden = false;
  input.value = "";
  setError("");
  setOutput("", false);
  setTimeout(() => input.focus(), 50);
}

function getToken() {
  return sessionStorage.getItem(AUTH_KEY);
}

function buildConfig() {
  return {
    appName: "Netfliks",
    siteUrl: fields.siteUrl.value.trim(),
    paymentEnabled: fields.paymentEnabled.value === "true",
    price: Number(fields.price.value || 0),
    currency: fields.currency.value.trim() || "GMD",
    paymentUrl: fields.paymentUrl.value.trim(),
    latestVersion: fields.latestVersion.value.trim(),
    minimumVersion: fields.minimumVersion.value.trim(),
    forceUpdate: fields.forceUpdate.value === "true",
    downloadUrl:
      "https://github.com/squashberry/netfliks-downloads/releases/latest/download/Netfliks.exe",
    announcementEnabled:
      fields.announcementEnabled.value === "true",
    announcement: fields.announcement.value.trim()
  };
}

function applyConfig(config) {
  fields.siteUrl.value = config.siteUrl ?? "";
  fields.paymentEnabled.value = String(Boolean(config.paymentEnabled));
  fields.price.value = config.price ?? 150;
  fields.currency.value = config.currency ?? "GMD";
  fields.paymentUrl.value = config.paymentUrl ?? "";
  fields.latestVersion.value = config.latestVersion ?? "1.0.0";
  fields.minimumVersion.value = config.minimumVersion ?? "1.0.0";
  fields.forceUpdate.value = String(Boolean(config.forceUpdate));
  fields.announcement.value = config.announcement ?? "";
  fields.announcementEnabled.value =
    String(Boolean(config.announcementEnabled));
}

async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({
    success: false,
    error: "The server returned an invalid response."
  }));

  if (!response.ok || data.success === false) {
    const message = data.error || `Request failed (${response.status})`;
    const errorObject = new Error(message);
    errorObject.status = response.status;
    throw errorObject;
  }

  return data;
}

async function loadConfig() {
  try {
    const data = await api("/admin/config", { method: "GET" });
    applyConfig(data.config);
    setOutput(
      JSON.stringify(
        {
          success: true,
          message: "Live configuration loaded from Cloudflare D1.",
          config: data.config
        },
        null,
        2
      )
    );
  } catch (err) {
    if (err.status === 401) {
      lock();
      setError("Your admin session expired. Please unlock again.");
      return;
    }

    setOutput(`Could not load configuration: ${err.message}`);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setError("");

  const password = input.value;

  if (!password) {
    setError("Enter the administrator passcode.");
    return;
  }

  const button = form.querySelector(".login-button");
  const originalText = button.innerHTML;

  try {
    button.disabled = true;
    button.innerHTML = "Connecting…";

    const response = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success || !result?.token) {
      throw new Error(result?.error || "Could not sign in.");
    }

    sessionStorage.setItem(AUTH_KEY, result.token);
    input.value = "";
    unlock();
    await loadConfig();
  } catch (err) {
    setError(err.message || "Could not sign in.");
    input.select();
  } finally {
    button.disabled = false;
    button.innerHTML = originalText;
  }
});

toggle.addEventListener("click", () => {
  const showing = input.type === "text";
  input.type = showing ? "password" : "text";
  toggle.textContent = showing ? "Show" : "Hide";
});

lockButton.addEventListener("click", async () => {
  const token = getToken();

  try {
    if (token) {
      await fetch(`${API_URL}/admin/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  } catch (_) {
    // Local logout still proceeds even if the network is unavailable.
  }

  lock();
});

saveButton.addEventListener("click", async () => {
  try {
    saveButton.disabled = true;
    saveButton.textContent = "Saving…";

    const data = await api("/admin/config", {
      method: "POST",
      body: JSON.stringify(buildConfig())
    });

    applyConfig(data.config);

    setOutput(
      JSON.stringify(
        {
          success: true,
          message: "Saved successfully to Cloudflare D1.",
          config: data.config
        },
        null,
        2
      )
    );
  } catch (err) {
    if (err.status === 401) {
      lock();
      setError("Your admin session expired. Please unlock again.");
      return;
    }

    setOutput(`Save failed: ${err.message}`);
  } finally {
    if (!gate.hidden) {
      saveButton.disabled = true;
    } else {
      saveButton.disabled = false;
    }

    saveButton.textContent = "Save changes";
  }
});

previewButton.addEventListener("click", () => {
  setOutput(JSON.stringify(buildConfig(), null, 2));
});

if (getToken()) {
  unlock();
  loadConfig();
} else {
  lock();
}
