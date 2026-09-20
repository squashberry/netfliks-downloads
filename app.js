const CONFIG_URL = "./config.json";

async function loadConfig(){
  try{
    const response = await fetch(CONFIG_URL + "?t=" + Date.now(), {cache:"no-store"});
    if(!response.ok) throw new Error("Config request failed");
    const config = await response.json();

    document.querySelector("#version").textContent = config.latestVersion || "—";
    document.querySelector("#access").textContent = config.paymentEnabled ? "Paid access" : "Free access";

    const button = document.querySelector("#downloadButton");
    if(config.downloadUrl) button.href = config.downloadUrl;

    if(config.announcementEnabled && config.announcement){
      const box = document.querySelector("#announcement");
      box.textContent = config.announcement;
      box.classList.remove("hidden");
    }
  }catch(error){
    document.querySelector("#version").textContent = "Unavailable";
    document.querySelector("#access").textContent = "Check back shortly";
    console.error(error);
  }
}

document.querySelector("#year").textContent = new Date().getFullYear();
loadConfig();