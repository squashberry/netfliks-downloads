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


// ============================================================
// 100-MOVIE CINEMATIC SHOWCASE
// ============================================================
const MOVIE_CATALOG=[{"id":1,"category":"Korean Action","title":"Train to Busan"},{"id":2,"category":"Korean Action","title":"The Man from Nowhere"},{"id":3,"category":"Korean Action","title":"The Villainess"},{"id":4,"category":"Korean Action","title":"I Saw the Devil"},{"id":5,"category":"Korean Action","title":"The Outlaws"},{"id":6,"category":"Korean Action","title":"The Roundup"},{"id":7,"category":"Korean Action","title":"The Roundup: No Way Out"},{"id":8,"category":"Korean Action","title":"Veteran"},{"id":9,"category":"Korean Action","title":"Veteran 2"},{"id":10,"category":"Korean Action","title":"A Hard Day"},{"id":11,"category":"Korean Action","title":"The Suspect"},{"id":12,"category":"Korean Action","title":"New World"},{"id":13,"category":"Korean Action","title":"A Bittersweet Life"},{"id":14,"category":"Korean Action","title":"The Berlin File"},{"id":15,"category":"Korean Action","title":"The Age of Shadows"},{"id":16,"category":"Korean Action","title":"The Battleship Island"},{"id":17,"category":"Korean Action","title":"Smugglers"},{"id":18,"category":"Korean Action","title":"The Witch: Part 1. The Subversion"},{"id":19,"category":"Korean Action","title":"The Witch: Part 2. The Other One"},{"id":20,"category":"Korean Action","title":"Kill Boksoon"},{"id":21,"category":"American Action","title":"John Wick"},{"id":22,"category":"American Action","title":"John Wick: Chapter 2"},{"id":23,"category":"American Action","title":"John Wick: Chapter 3 – Parabellum"},{"id":24,"category":"American Action","title":"John Wick: Chapter 4"},{"id":25,"category":"American Action","title":"Die Hard"},{"id":26,"category":"American Action","title":"Die Hard 2"},{"id":27,"category":"American Action","title":"Mission: Impossible – Fallout"},{"id":28,"category":"American Action","title":"Mission: Impossible – Ghost Protocol"},{"id":29,"category":"American Action","title":"Top Gun: Maverick"},{"id":30,"category":"American Action","title":"The Equalizer"},{"id":31,"category":"American Action","title":"The Equalizer 2"},{"id":32,"category":"American Action","title":"The Equalizer 3"},{"id":33,"category":"American Action","title":"Nobody"},{"id":34,"category":"American Action","title":"Extraction"},{"id":35,"category":"American Action","title":"Extraction 2"},{"id":36,"category":"American Action","title":"The Gray Man"},{"id":37,"category":"American Action","title":"Bullet Train"},{"id":38,"category":"American Action","title":"Wrath of Man"},{"id":39,"category":"American Action","title":"Sicario"},{"id":40,"category":"American Action","title":"Edge of Tomorrow"},{"id":41,"category":"UK Action","title":"Skyfall"},{"id":42,"category":"UK Action","title":"Casino Royale"},{"id":43,"category":"UK Action","title":"Spectre"},{"id":44,"category":"UK Action","title":"No Time to Die"},{"id":45,"category":"UK Action","title":"Kingsman: The Secret Service"},{"id":46,"category":"UK Action","title":"Kingsman: The Golden Circle"},{"id":47,"category":"UK Action","title":"The King's Man"},{"id":48,"category":"UK Action","title":"The Gentlemen"},{"id":49,"category":"UK Action","title":"Lock, Stock and Two Smoking Barrels"},{"id":50,"category":"UK Action","title":"Snatch"},{"id":51,"category":"UK Action","title":"The Italian Job"},{"id":52,"category":"UK Action","title":"Sherlock Holmes"},{"id":53,"category":"UK Action","title":"Sherlock Holmes: A Game of Shadows"},{"id":54,"category":"UK Action","title":"The Bank Job"},{"id":55,"category":"UK Action","title":"The Sweeney"},{"id":56,"category":"UK Action","title":"Avengement"},{"id":57,"category":"UK Action","title":"Dredd"},{"id":58,"category":"UK Action","title":"V for Vendetta"},{"id":59,"category":"UK Action","title":"Layer Cake"},{"id":60,"category":"UK Action","title":"The Transporter"},{"id":61,"category":"Indian Action","title":"RRR"},{"id":62,"category":"Indian Action","title":"Jawan"},{"id":63,"category":"Indian Action","title":"Pathaan"},{"id":64,"category":"Indian Action","title":"War"},{"id":65,"category":"Indian Action","title":"Tiger Zinda Hai"},{"id":66,"category":"Indian Action","title":"Tiger 3"},{"id":67,"category":"Indian Action","title":"Vikram"},{"id":68,"category":"Indian Action","title":"Kaithi"},{"id":69,"category":"Indian Action","title":"Leo"},{"id":70,"category":"Indian Action","title":"Master"},{"id":71,"category":"Indian Action","title":"KGF: Chapter 1"},{"id":72,"category":"Indian Action","title":"KGF: Chapter 2"},{"id":73,"category":"Indian Action","title":"Salaar: Part 1 – Ceasefire"},{"id":74,"category":"Indian Action","title":"Pushpa: The Rise"},{"id":75,"category":"Indian Action","title":"Pushpa 2: The Rule"},{"id":76,"category":"Indian Action","title":"Beast"},{"id":77,"category":"Indian Action","title":"Thuppakki"},{"id":78,"category":"Indian Action","title":"Thani Oruvan"},{"id":79,"category":"Indian Action","title":"Baahubali: The Beginning"},{"id":80,"category":"Indian Action","title":"Baahubali 2: The Conclusion"},{"id":81,"category":"Global Action","title":"The Raid: Redemption"},{"id":82,"category":"Global Action","title":"The Raid 2"},{"id":83,"category":"Global Action","title":"The Night Comes for Us"},{"id":84,"category":"Global Action","title":"Headshot"},{"id":85,"category":"Global Action","title":"Ong-Bak: The Thai Warrior"},{"id":86,"category":"Global Action","title":"Ip Man"},{"id":87,"category":"Global Action","title":"Ip Man 2"},{"id":88,"category":"Global Action","title":"Crouching Tiger, Hidden Dragon"},{"id":89,"category":"Global Action","title":"Hero"},{"id":90,"category":"Global Action","title":"Police Story"},{"id":91,"category":"Global Action","title":"Project A"},{"id":92,"category":"Global Action","title":"Infernal Affairs"},{"id":93,"category":"Global Action","title":"Wolf Warrior 2"},{"id":94,"category":"Global Action","title":"Furie"},{"id":95,"category":"Global Action","title":"The Killer"},{"id":96,"category":"Global Action","title":"Hard Boiled"},{"id":97,"category":"Global Action","title":"Flash Point"},{"id":98,"category":"Global Action","title":"SPL: Sha Po Lang"},{"id":99,"category":"Global Action","title":"The Protector"},{"id":100,"category":"Global Action","title":"13 Assassins"}];

const movieCarousel=document.querySelector("#movieCarousel");
const heroMovieImage=document.querySelector("#heroMovieImage");
const heroMovieTitle=document.querySelector("#heroMovieTitle");
const heroMovieCategory=document.querySelector("#heroMovieCategory");
const heroMovieStatus=document.querySelector("#heroMovieStatus");
const deviceMovie=document.querySelector("#deviceMovie");
const deviceMovieImage=document.querySelector("#deviceMovieImage");
const deviceMovieTitle=document.querySelector("#deviceMovieTitle");
const deviceMovieCategory=document.querySelector("#deviceMovieCategory");

const movieImages=new Map();

function normalizeMovieTitle(value){
  return String(value||"")
    .toLowerCase()
    .replace(/[–—]/g,"-")
    .replace(/[’']/g,"")
    .replace(/[^a-z0-9]+/g," ")
    .trim();
}

function movieFallback(index){
  return "https://loremflickr.com/1600/900/cinema,movie?lock="+(index+1);
}

function movieDescription(category){
  if(category==="Korean Action")return "K-action favorite · high-impact nights";
  if(category==="American Action")return "American action · big-screen energy";
  if(category==="UK Action")return "British action · sharp, stylish and tense";
  if(category==="Indian Action")return "Indian action · spectacle, speed and scale";
  return "Global action · world cinema in motion";
}

async function loadMovieImages(){
  const titles=MOVIE_CATALOG.map(movie=>movie.title);
  const chunks=[];
  for(let i=0;i<titles.length;i+=50)chunks.push(titles.slice(i,i+50));

  for(const chunk of chunks){
    try{
      const url=new URL("https://en.wikipedia.org/w/api.php");
      url.searchParams.set("action","query");
      url.searchParams.set("prop","pageimages");
      url.searchParams.set("piprop","thumbnail");
      url.searchParams.set("pithumbsize","1400");
      url.searchParams.set("format","json");
      url.searchParams.set("origin","*");
      url.searchParams.set("redirects","1");
      url.searchParams.set("titles",chunk.join("|"));

      const response=await fetch(url.toString(),{cache:"force-cache"});
      if(!response.ok)continue;

      const data=await response.json();
      Object.values(data?.query?.pages||{}).forEach(page=>{
        const source=page?.thumbnail?.source;
        if(source){
          movieImages.set(normalizeMovieTitle(page.title),source);
        }
      });
    }catch(error){
      console.warn("Movie image batch unavailable",error);
    }
  }

  renderMovieCarousel();
  setRandomHero(true);
}

function imageForMovie(movie){
  return movieImages.get(normalizeMovieTitle(movie.title))||movieFallback(movie.id-1);
}

function renderMovieCarousel(){
  if(!movieCarousel)return;

  movieCarousel.innerHTML="";
  const fragment=document.createDocumentFragment();

  MOVIE_CATALOG.forEach(movie=>{
    const article=document.createElement("article");
    article.className="movie-card";
    article.dataset.category=movie.category;

    const image=document.createElement("img");
    image.src=imageForMovie(movie);
    image.alt=movie.title+" artwork";
    image.loading="lazy";
    image.decoding="async";

    const overlay=document.createElement("div");
    overlay.className="movie-card-overlay";

    const copy=document.createElement("div");
    copy.className="movie-card-copy";
    copy.innerHTML=
      "<small>"+movie.category.toUpperCase()+"</small>"+
      "<h3>"+movie.title+"</h3>"+
      "<p>"+movieDescription(movie.category)+"</p>";

    article.append(image,overlay,copy);
    fragment.appendChild(article);
  });

  movieCarousel.appendChild(fragment);
  wireMovieCardImages();
}

function wireMovieCardImages(){
  if(!movieCarousel)return;
  movieCarousel.querySelectorAll(".movie-card img").forEach(img=>{
    img.addEventListener("error",()=>{
      const next=movieFallback(Math.floor(Math.random()*1000));
      if(img.src!==next)img.src=next;
    },{once:true});
  });
}

let currentMovieIndex=-1;

function setHeroMovie(movie,index){
  if(!movie)return;

  currentMovieIndex=index;

  const source=imageForMovie(movie);

  [heroMovieImage,deviceMovieImage].forEach(image=>{
    if(image){
      image.classList.add("is-changing");
      setTimeout(()=>image.classList.remove("is-changing"),420);
    }
  });

  if(heroMovieImage){
    heroMovieImage.src=source;
    heroMovieImage.alt=movie.title+" artwork";
  }

  if(heroMovieTitle)heroMovieTitle.textContent=movie.title;
  if(heroMovieCategory)heroMovieCategory.textContent=movie.category.toUpperCase();
  if(heroMovieStatus)heroMovieStatus.textContent="NOW SHOWING · "+(index+1)+"/"+MOVIE_CATALOG.length;

  if(deviceMovieImage){
    deviceMovieImage.style.backgroundImage='url("'+source.replace(/"/g,'\"')+'")';
  }

  if(deviceMovieTitle)deviceMovieTitle.textContent=movie.title;
  if(deviceMovieCategory)deviceMovieCategory.textContent=movie.category.toUpperCase();

  if(movieCarousel){
    const card=movieCarousel.querySelectorAll(".movie-card")[index];
    card?.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"});
  }
}

function randomMovieIndex(){
  if(MOVIE_CATALOG.length<2)return 0;
  let next;
  do{
    next=Math.floor(Math.random()*MOVIE_CATALOG.length);
  }while(next===currentMovieIndex);
  return next;
}

function setRandomHero(force=false){
  if(!force&&document.visibilityState!=="visible")return;
  const index=randomMovieIndex();
  setHeroMovie(MOVIE_CATALOG[index],index);
}

setInterval(()=>setRandomHero(false),6500);

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
        movieCarousel.scrollLeft+
        Math.min(movieCarousel.clientWidth*.72,420);

      if(
        next>=
        movieCarousel.scrollWidth-
        movieCarousel.clientWidth-
        12
      ){
        movieCarousel.scrollTo({left:0,behavior:"smooth"});
      }else{
        movieCarousel.scrollTo({left:next,behavior:"smooth"});
      }
    },3600);
  };

  movieCarousel.addEventListener("mouseenter",()=>clearInterval(carouselTimer));
  movieCarousel.addEventListener("mouseleave",startCarousel);
  startCarousel();
}

loadMovieImages();
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
