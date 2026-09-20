const CONFIG_URL="./config.json";
const directFallback="https://github.com/squashberry/netfliks-downloads/releases/download/v1.0.0/NetfliksSetup.exe";

document.querySelector("#year").textContent=new Date().getFullYear();

const cursor=document.querySelector(".cursor-glow");
window.addEventListener("pointermove",e=>{cursor.style.left=e.clientX+"px";cursor.style.top=e.clientY+"px"});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const scene=document.querySelector("#deviceScene");
if(scene){
  scene.addEventListener("pointermove",e=>{
    const r=scene.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    const device=scene.querySelector(".device");
    device.style.transform=`rotateY(${x*-24-8}deg) rotateX(${y*-12+5}deg) rotateZ(1deg)`;
  });
  scene.addEventListener("pointerleave",()=>scene.querySelector(".device").style.transform="rotateY(-16deg) rotateX(8deg) rotateZ(1deg)");
}

async function loadConfig(){
  try{
    const r=await fetch(CONFIG_URL+"?t="+Date.now(),{cache:"no-store"});
    if(!r.ok)throw new Error("Config unavailable");
    const c=await r.json();
    const url=c.downloadUrl||directFallback;
    ["heroDownload","windowsDownload"].forEach(id=>{const el=document.getElementById(id);if(el)el.href=url});
    if(c.appName)document.title=c.appName+" — Stream without friction";
  }catch(e){
    console.warn("Using fallback download URL",e);
  }
}
loadConfig();