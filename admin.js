const ids=["siteUrl","paymentEnabled","price","currency","paymentUrl","latestVersion","minimumVersion","forceUpdate","announcement","announcementEnabled"];
const fields=Object.fromEntries(ids.map(id=>[id,document.getElementById(id)]));
document.getElementById("preview").onclick=()=>{
  const config={
    appName:"Netfliks",
    siteUrl:fields.siteUrl.value,
    paymentEnabled:fields.paymentEnabled.value==="true",
    price:Number(fields.price.value||0),
    currency:fields.currency.value||"GMD",
    paymentUrl:fields.paymentUrl.value,
    activationVerifyUrl:"",
    activationStatusUrl:"",
    latestVersion:fields.latestVersion.value,
    minimumVersion:fields.minimumVersion.value,
    forceUpdate:fields.forceUpdate.value==="true",
    downloadUrl:"https://github.com/squashberry/netfliks-downloads/releases/latest/download/Netfliks.exe",
    announcementEnabled:fields.announcementEnabled.value==="true",
    announcement:fields.announcement.value
  };
  const out=document.getElementById("output");out.style.display="block";out.textContent=JSON.stringify(config,null,2);
};