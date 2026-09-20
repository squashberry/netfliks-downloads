const API_URL="https://netfliks-api.netfliks.workers.dev";
const AUTH_KEY="netfliks_admin_token";
const ids=["siteUrl","paymentEnabled","price","currency","paymentUrl","latestVersion","minimumVersion","forceUpdate","announcement","announcementEnabled","announcementActionEnabled","announcementActionType","announcementButtonText","announcementActionUrl","announcementActionText","announcementQuestion","announcementYesText","announcementNoText"];
const fields=Object.fromEntries(ids.map(id=>[id,document.getElementById(id)]));
const gate=document.getElementById("loginGate"),app=document.getElementById("adminApp"),form=document.getElementById("loginForm"),input=document.getElementById("passcode"),error=document.getElementById("loginError"),toggle=document.getElementById("togglePass"),saveButton=document.getElementById("save"),previewButton=document.getElementById("preview"),output=document.getElementById("output"),lockButton=document.getElementById("lock");
const statsError=document.getElementById("statsError");

function token(){return sessionStorage.getItem(AUTH_KEY)}
function setError(v=""){error.textContent=v}
function setOutput(v,show=true){output.style.display=show?"block":"none";output.textContent=v}
function unlock(){gate.hidden=true;app.hidden=false}
function lock(){sessionStorage.removeItem(AUTH_KEY);app.hidden=true;gate.hidden=false;input.value="";setError("");setTimeout(()=>input.focus(),40)}
function api(path,options={}){const headers=new Headers(options.headers||{});headers.set("Content-Type","application/json");const t=token();if(t)headers.set("Authorization",`Bearer ${t}`);return fetch(`${API_URL}${path}`,{...options,headers}).then(async r=>{const d=await r.json().catch(()=>({success:false,error:"Invalid server response."}));if(!r.ok||d.success===false){const e=new Error(d.error||`Request failed (${r.status})`);e.status=r.status;throw e}return d})}
function configFromForm(){return{appName:"Netfliks",siteUrl:fields.siteUrl.value.trim(),paymentEnabled:fields.paymentEnabled.value==="true",price:Number(fields.price.value||0),currency:fields.currency.value.trim()||"GMD",paymentUrl:fields.paymentUrl.value.trim(),latestVersion:fields.latestVersion.value.trim(),minimumVersion:fields.minimumVersion.value.trim(),forceUpdate:fields.forceUpdate.value==="true",downloadUrl:"https://github.com/squashberry/netfliks-downloads/releases/latest/download/NetfliksSetup.exe",announcementEnabled:fields.announcementEnabled.value==="true",announcement:fields.announcement.value.trim(),announcementActionEnabled:fields.announcementActionEnabled.value==="true",announcementActionType:fields.announcementActionType.value,announcementButtonText:fields.announcementButtonText.value.trim(),announcementActionUrl:fields.announcementActionUrl.value.trim(),announcementActionText:fields.announcementActionText.value.trim(),announcementQuestion:fields.announcementQuestion.value.trim(),announcementYesText:fields.announcementYesText.value.trim(),announcementNoText:fields.announcementNoText.value.trim()}}
function applyConfig(c){fields.siteUrl.value=c.siteUrl||"";fields.paymentEnabled.value=String(Boolean(c.paymentEnabled));fields.price.value=c.price??150;fields.currency.value=c.currency||"GMD";fields.paymentUrl.value=c.paymentUrl||"";fields.latestVersion.value=c.latestVersion||"1.0.0";fields.minimumVersion.value=c.minimumVersion||"1.0.0";fields.forceUpdate.value=String(Boolean(c.forceUpdate));fields.announcement.value=c.announcement||"";fields.announcementEnabled.value=String(Boolean(c.announcementEnabled));fields.announcementActionEnabled.value=String(Boolean(c.announcementActionEnabled));fields.announcementActionType.value=c.announcementActionType||"none";fields.announcementButtonText.value=c.announcementButtonText||"Take action";fields.announcementActionUrl.value=c.announcementActionUrl||"";fields.announcementActionText.value=c.announcementActionText||"";fields.announcementQuestion.value=c.announcementQuestion||"";fields.announcementYesText.value=c.announcementYesText||"YES";fields.announcementNoText.value=c.announcementNoText||"NO";updateAnnouncementActionFields()}
function updateAnnouncementActionFields(){
  const enabled = fields.announcementActionEnabled.value === "true";
  const type = fields.announcementActionType.value;

  const ids = [
    "actionButtonTextField",
    "actionLinkField",
    "actionTextField",
    "actionQuestionField",
    "actionNoneHint"
  ];

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  });

  if (!enabled || type === "none") {
    const hint = document.getElementById("actionNoneHint");
    if (hint) hint.hidden = false;
    return;
  }

  if (type === "share") {
    document.getElementById("actionButtonTextField").hidden = false;
    document.getElementById("actionLinkField").hidden = false;
    document.getElementById("actionTextField").hidden = false;
    return;
  }

  if (type === "open_link") {
    document.getElementById("actionButtonTextField").hidden = false;
    document.getElementById("actionLinkField").hidden = false;
    return;
  }

  if (type === "copy_text") {
    document.getElementById("actionButtonTextField").hidden = false;
    document.getElementById("actionTextField").hidden = false;
    return;
  }

  if (type === "copy_link") {
    document.getElementById("actionButtonTextField").hidden = false;
    document.getElementById("actionLinkField").hidden = false;
    return;
  }

  if (type === "download") {
    document.getElementById("actionButtonTextField").hidden = false;
    return;
  }

  if (type === "yes_no") {
    document.getElementById("actionQuestionField").hidden = false;
  }
}

function setApiStatus(online){const el=document.getElementById("apiStatus");el.textContent=online?"API online":"API unavailable";el.previousElementSibling?.classList.toggle("offline",!online)}

async function loadConfig(){try{const d=await api("/admin/config");applyConfig(d.config);setApiStatus(true)}catch(e){setApiStatus(false);if(e.status===401){lock();setError("Your session expired.");}}}
async function saveConfig(){try{saveButton.disabled=true;saveButton.textContent="Saving…";const d=await api("/admin/config",{method:"POST",body:JSON.stringify(configFromForm())});applyConfig(d.config);document.getElementById("saveStatus").textContent="Saved to Cloudflare D1.";setTimeout(()=>document.getElementById("saveStatus").textContent="",3500)}catch(e){if(e.status===401){lock();setError("Your session expired. Please unlock again.");return}document.getElementById("saveStatus").textContent=`Save failed: ${e.message}`}finally{saveButton.disabled=false;saveButton.textContent="Save changes"}}

function svgWrap(body){return `<svg viewBox="0 0 700 250" preserveAspectRatio="none" aria-label="chart">${body}</svg>`}
function lineChart(points){if(!points.length)return"<div class='empty'>No activity data yet.</div>";const max=Math.max(1,...points.map(p=>p.value)),w=700,h=250,padX=12,padY=18,innerW=w-padX*2,innerH=h-padY*2;const xy=points.map((p,i)=>[padX+(innerW*(points.length===1?0.5:i/(points.length-1))),h-padY-(p.value/max)*innerH]);let grid="";for(let i=0;i<5;i++){const y=padY+i*(innerH/4);grid+=`<line class="gridline" x1="0" x2="700" y1="${y}" y2="${y}"/>`}const path=xy.map((a,i)=>(i?"L":"M")+a[0]+" "+a[1]).join(" ");const area=path+` L ${xy[xy.length-1][0]} ${h-padY} L ${xy[0][0]} ${h-padY} Z`;const dots=xy.map(a=>`<circle class="chart-dot" cx="${a[0]}" cy="${a[1]}" r="3.2"/>`).join("");const labels=points.filter((_,i)=>i===0||i===Math.floor(points.length/2)||i===points.length-1).map((p)=>{const i=points.indexOf(p),x=padX+innerW*(points.length===1?.5:i/(points.length-1));return`<text class="chart-label" x="${x}" y="245" text-anchor="middle">${p.day.slice(5)}</text>`}).join("");return svgWrap(grid+`<defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".14"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs><path class="chart-area" d="${area}"/><path class="chart-line" d="${path}"/>${dots}${labels}`) }
function barChart(points){if(!points.length)return"<div class='empty'>No new-user data yet.</div>";const max=Math.max(1,...points.map(p=>p.value)),w=700,h=250,padX=12,padY=18,gap=3,slot=(w-padX*2)/points.length,barW=Math.max(3,slot-gap);let bars="";points.forEach((p,i)=>{const x=padX+i*slot+gap/2,y=h-padY-(p.value/max)*(h-padY*2);const bh=h-padY-y;bars+=`<rect class="bar" x="${x}" y="${y}" width="${barW}" height="${Math.max(1,bh)}"/>`});const labels=points.filter((_,i)=>i===0||i===Math.floor(points.length/2)||i===points.length-1).map(p=>{const i=points.indexOf(p),x=padX+i*slot+slot/2;return`<text class="chart-label" x="${x}" y="245" text-anchor="middle">${p.day.slice(5)}</text>`}).join("");return svgWrap(labels+bars)}
function renderVersions(items){const el=document.getElementById("versionList");if(!items?.length){el.innerHTML="<div class='empty'>No device data yet.</div>";return}const total=items.reduce((n,x)=>n+x.count,0)||1;el.innerHTML=items.map(x=>`<div class="version-row"><span>${x.version}</span><div class="version-bar"><div class="version-fill" style="width:${(x.count/total)*100}%"></div></div><strong>${x.count}</strong></div>`).join("")}

async function loadStats(){try{statsError.textContent="";const d=await api("/admin/stats?days=30");const s=d.stats;document.getElementById("totalUsers").textContent=s.totalUsers;document.getElementById("onlineUsers").textContent=s.onlineUsers;document.getElementById("activatedUsers").textContent=s.activatedUsers;document.getElementById("newUsersToday").textContent=s.newUsersToday;document.getElementById("activeCodes").textContent=s.activeCodes;document.getElementById("expiredCodes").textContent=s.expiredCodes;document.getElementById("totalCodes").textContent=s.totalCodes;document.getElementById("activityChart").innerHTML=lineChart(s.dailyActiveUsers);document.getElementById("newUsersChart").innerHTML=barChart(s.dailyNewUsers);renderVersions(s.versions);setApiStatus(true)}catch(e){statsError.textContent=e.status===401?"Your session expired.":"Could not load statistics: "+e.message;if(e.status===401){lock();setError("Your session expired. Please unlock again.")}}}

document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".tab-panel").forEach(x=>x.classList.remove("active"));tab.classList.add("active");document.getElementById(tab.dataset.tab+"Tab").classList.add("active");if(tab.dataset.tab==="overview")loadStats()}));
form.addEventListener("submit",async e=>{e.preventDefault();setError("");const button=form.querySelector(".login-button");const old=button.innerHTML;try{button.disabled=true;button.innerHTML="Connecting…";const r=await fetch(`${API_URL}/admin/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:input.value})});const d=await r.json();if(!r.ok||!d.success)throw new Error(d.error||"Could not sign in.");sessionStorage.setItem(AUTH_KEY,d.token);input.value="";unlock();await Promise.all([loadConfig(),loadStats()])}catch(e){setError(e.message||"Could not sign in.");input.select()}finally{button.disabled=false;button.innerHTML=old}});
toggle.addEventListener("click",()=>{const showing=input.type==="text";input.type=showing?"password":"text";toggle.textContent=showing?"Show":"Hide"});
lockButton.addEventListener("click",async()=>{const t=token();try{if(t)await fetch(`${API_URL}/admin/logout`,{method:"POST",headers:{Authorization:`Bearer ${t}`}})}catch(_){}lock()});
saveButton.addEventListener("click",saveConfig);
previewButton.addEventListener("click",()=>setOutput(JSON.stringify(configFromForm(),null,2)));
document.getElementById("refreshStats").addEventListener("click",loadStats);

if(token()){unlock();Promise.all([loadConfig(),loadStats()])}else lock();
document.getElementById("announcementActionEnabled").addEventListener("change", updateAnnouncementActionFields);
document.getElementById("announcementActionType").addEventListener("change", updateAnnouncementActionFields);
updateAnnouncementActionFields();
