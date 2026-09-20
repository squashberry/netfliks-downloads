const CONFIG_URL="./config.json";

const directFallback="https://github.com/squashberry/netfliks-downloads/releases/download/v1.0.0/NetfliksSetup.exe";
const androidFallback="https://github.com/squashberry/netfliks-downloads/releases/download/v1.0.0/Netfliks-Android.apk";

let windowsDownloadUrl=directFallback;
let androidDownloadUrl=androidFallback;

document.querySelector("#year").textContent=new Date().getFullYear();

const cursor=document.querySelector(".cursor-glow");
window.addEventListener("pointermove",e=>{
  if(cursor){
    cursor.style.left=e.clientX+"px";
    cursor.style.top=e.clientY+"px";
  }
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting)e.target.classList.add("visible")
  });
},{threshold:.12});

document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const scene=document.querySelector("#deviceScene");
if(scene){
  scene.addEventListener("pointermove",e=>{
    const r=scene.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    const device=scene.querySelector(".device");
    device.style.transform=`rotateY(${x*-24-8}deg) rotateX(${y*-12+5}deg) rotateZ(1deg)`;
  });

  scene.addEventListener("pointerleave",()=>{
    scene.querySelector(".device").style.transform="rotateY(-16deg) rotateX(8deg) rotateZ(1deg)"
  });
}

async function loadConfig(){
  try{
    const r=await fetch(CONFIG_URL+"?t="+Date.now(),{cache:"no-store"});
    if(!r.ok)throw new Error("Config unavailable");

    const c=await r.json();

    windowsDownloadUrl=c.windowsDownloadUrl||c.downloadUrl||directFallback;
    androidDownloadUrl=c.androidDownloadUrl||androidFallback;

    if(c.appName){
      document.title=c.appName+" — Stream without friction";
    }

    const androidLinks=[
      document.querySelector("#androidDownload"),
      document.querySelector("#chooseAndroid")
    ];

    androidLinks.forEach(el=>{
      if(el)el.href=androidDownloadUrl;
    });
  }catch(e){
    console.warn("Using fallback download URLs",e);
  }
}

loadConfig();

const downloadChooser=document.getElementById("downloadChooser");
const downloadChooserClose=document.getElementById("downloadChooserClose");
const downloadChooserCancel=document.getElementById("downloadChooserCancel");
const downloadChooserBackdrop=downloadChooser?.querySelector(".download-chooser-backdrop");
const chooseWindows=document.getElementById("chooseWindows");
const chooseAndroid=document.getElementById("chooseAndroid");

const installGuide=document.getElementById("installGuide");
const installGuideContinue=document.getElementById("installGuideContinue");
const installGuideClose=document.getElementById("installGuideClose");
const installGuideCancel=document.getElementById("installGuideCancel");
const installGuideBackdrop=installGuide?.querySelector(".install-guide-backdrop");

const androidInstallGuide=document.getElementById("androidInstallGuide");
const androidInstallGuideContinue=document.getElementById("androidInstallGuideContinue");
const androidInstallGuideClose=document.getElementById("androidInstallGuideClose");
const androidInstallGuideCancel=document.getElementById("androidInstallGuideCancel");
const androidInstallGuideBackdrop=androidInstallGuide?.querySelector(".install-guide-backdrop");

function openModal(modal){
  if(!modal)return;
  modal.hidden=false;
  modal.setAttribute("aria-hidden","false");
  document.body.classList.add("install-guide-open");

  requestAnimationFrame(()=>{
    modal.classList.add("visible");
  });
}

function closeModal(modal){
  if(!modal)return;
  modal.classList.remove("visible");
  modal.setAttribute("aria-hidden","true");

  setTimeout(()=>{
    if(modal)modal.hidden=true;
  },240);

  if(
    (!downloadChooser||!downloadChooser.classList.contains("visible")) &&
    (!installGuide||!installGuide.classList.contains("visible")) &&
    (!androidInstallGuide||!androidInstallGuide.classList.contains("visible"))
  ){
    document.body.classList.remove("install-guide-open");
  }
}

function openDownloadChooser(){
  openModal(downloadChooser);
  downloadChooserClose?.focus();
}

function openWindowsGuide(){
  const help=document.getElementById("windowsInstallHelp");
  const toggle=document.getElementById("windowsTroubleToggle");

  if(help){
    help.hidden=true;
  }

  if(toggle){
    toggle.setAttribute("aria-expanded","false");
    const label=toggle.querySelector("span");
    if(label)label.textContent="Show solutions";
  }

  if(installGuideContinue){
    installGuideContinue.href=windowsDownloadUrl;
  }

  closeModal(downloadChooser);
  setTimeout(()=>{
    openModal(installGuide);
    installGuideClose?.focus();
  },180);
}

function openAndroidGuide(){
  const help=document.getElementById("androidInstallHelp");
  const toggle=document.getElementById("androidTroubleToggle");

  if(help){
    help.hidden=true;
  }

  if(toggle){
    toggle.setAttribute("aria-expanded","false");
    const label=toggle.querySelector("span");
    if(label)label.textContent="Show solutions";
  }

  if(androidInstallGuideContinue){
    androidInstallGuideContinue.href=androidDownloadUrl;
  }

  closeModal(downloadChooser);
  setTimeout(()=>{
    openModal(androidInstallGuide);
    androidInstallGuideClose?.focus();
  },180);
}

document.querySelectorAll(".download-trigger").forEach(link=>{
  link.addEventListener("click",e=>{
    e.preventDefault();
    openDownloadChooser();
  });
});

chooseWindows?.addEventListener("click",openWindowsGuide);

chooseAndroid?.addEventListener("click",e=>{
  e.preventDefault();
  openAndroidGuide();
});

document.querySelector("#androidDownload")?.addEventListener("click",e=>{
  e.preventDefault();
  openAndroidGuide();
});

installGuideContinue?.addEventListener("click",()=>{
  closeModal(installGuide);
});

downloadChooserClose?.addEventListener("click",()=>{
  closeModal(downloadChooser);
});

downloadChooserCancel?.addEventListener("click",()=>{
  closeModal(downloadChooser);
});

downloadChooserBackdrop?.addEventListener("click",()=>{
  closeModal(downloadChooser);
});

installGuideClose?.addEventListener("click",()=>{
  closeModal(installGuide);
});

installGuideCancel?.addEventListener("click",()=>{
  closeModal(installGuide);
});

installGuideBackdrop?.addEventListener("click",()=>{
  closeModal(installGuide);
});

androidInstallGuideContinue?.addEventListener("click",()=>{
  closeModal(androidInstallGuide);
});

androidInstallGuideClose?.addEventListener("click",()=>{
  closeModal(androidInstallGuide);
});

androidInstallGuideCancel?.addEventListener("click",()=>{
  closeModal(androidInstallGuide);
});

androidInstallGuideBackdrop?.addEventListener("click",()=>{
  closeModal(androidInstallGuide);
});


function setupTroubleToggle(toggleId, helpId){
  const toggle=document.getElementById(toggleId);
  const help=document.getElementById(helpId);

  if(!toggle||!help)return;

  toggle.addEventListener("click",()=>{
    const opening=help.hidden;

    help.hidden=!opening;
    toggle.setAttribute("aria-expanded",String(opening));

    const label=toggle.querySelector("span");
    if(label){
      label.textContent=opening?"Hide solutions":"Show solutions";
    }
  });
}

setupTroubleToggle("windowsTroubleToggle","windowsInstallHelp");
setupTroubleToggle("androidTroubleToggle","androidInstallHelp");

const movieCarousel=document.querySelector(".movie-carousel");

if(movieCarousel){
  let carouselTimer;

  const startCarousel=()=>{
    clearInterval(carouselTimer);

    carouselTimer=setInterval(()=>{
      if(
        document.visibilityState!=="visible" ||
        movieCarousel.matches(":hover")
      )return;

      const next=
        movieCarousel.scrollLeft +
        Math.min(
          movieCarousel.clientWidth*.72,
          420
        );

      if(
        next >=
        movieCarousel.scrollWidth-
        movieCarousel.clientWidth-
        12
      ){
        movieCarousel.scrollTo({
          left:0,
          behavior:"smooth"
        });
      }else{
        movieCarousel.scrollTo({
          left:next,
          behavior:"smooth"
        });
      }
    },4200);
  };

  movieCarousel.addEventListener("mouseenter",()=>{
    clearInterval(carouselTimer);
  });

  movieCarousel.addEventListener("mouseleave",()=>{
    startCarousel();
  });

  startCarousel();
}

document.addEventListener("keydown",e=>{
  if(e.key!=="Escape")return;

  if(downloadChooser?.classList.contains("visible")){
    closeModal(downloadChooser);
  }else if(installGuide?.classList.contains("visible")){
    closeModal(installGuide);
  }else if(androidInstallGuide?.classList.contains("visible")){
    closeModal(androidInstallGuide);
  }
});
