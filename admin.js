const PASSCODE_SHA256 = "2d21ad9fe7f7fd3e4b6672e030bceb3a43d757f0645c2947af754663186e3c28";
const AUTH_KEY = "netfliks_admin_unlocked";
const ids=["siteUrl","paymentEnabled","price","currency","paymentUrl","latestVersion","minimumVersion","forceUpdate","announcement","announcementEnabled"];
const fields=Object.fromEntries(ids.map(id=>[id,document.getElementById(id)]));
const gate=document.getElementById("loginGate"), app=document.getElementById("adminApp");
const form=document.getElementById("loginForm"), input=document.getElementById("passcode"), error=document.getElementById("loginError");
const toggle=document.getElementById("togglePass");

async function digest(value){
  const bytes=new TextEncoder().encode(value);
  const hash=await crypto.subtle.digest("SHA-256",bytes);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,"0")).join("");
}
function unlock(){gate.hidden=true;app.hidden=false;sessionStorage.setItem(AUTH_KEY,"1")}
function lock(){sessionStorage.removeItem(AUTH_KEY);app.hidden=true;gate.hidden=false;input.value="";error.textContent="";setTimeout(()=>input.focus(),50)}
if(sessionStorage.getItem(AUTH_KEY)==="1") unlock();
form.addEventListener("submit",async e=>{
  e.preventDefault();
  if(await digest(input.value)===PASSCODE_SHA256){error.textContent="";unlock()}
  else{error.textContent="Incorrect passcode.";input.select()}
});
toggle.addEventListener("click",()=>{const show=input.type==="text";input.type=show?"password":"text";toggle.textContent=show?"Show":"Hide"});
document.getElementById("lock").addEventListener("click",lock);
document.getElementById("preview").onclick=()=>{
  const config={
    appName:"Netfliks",siteUrl:fields.siteUrl.value.trim(),
    paymentEnabled:fields.paymentEnabled.value==="true",price:Number(fields.price.value||0),
    currency:fields.currency.value.trim()||"GMD",paymentUrl:fields.paymentUrl.value.trim(),
    activationVerifyUrl:"",activationStatusUrl:"",
    latestVersion:fields.latestVersion.value.trim(),minimumVersion:fields.minimumVersion.value.trim(),
    forceUpdate:fields.forceUpdate.value==="true",
    downloadUrl:"https://github.com/squashberry/netfliks-downloads/releases/latest/download/Netfliks.exe",
    announcementEnabled:fields.announcementEnabled.value==="true",announcement:fields.announcement.value.trim()
  };
  const out=document.getElementById("output");out.style.display="block";out.textContent=JSON.stringify(config,null,2);
};