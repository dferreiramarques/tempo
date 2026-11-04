const settingsDialog=document.getElementById('settings-dialog');
document.getElementById('settings-open').onclick=()=>settingsDialog.showModal();
document.getElementById('settings-close').onclick=()=>settingsDialog.close();
let installPrompt;
const offlineDialog=document.getElementById('offline-dialog');
document.getElementById('offline').onclick=()=>{settingsDialog.close();offlineDialog.showModal();};
document.getElementById('close-offline').onclick=()=>offlineDialog.close();
window.addEventListener('beforeinstallprompt',event=>{
 event.preventDefault();installPrompt=event;document.getElementById('install').hidden=false;
});
document.getElementById('install').onclick=async()=>{
 if(!installPrompt)return;
 await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;document.getElementById('install').hidden=true;
};
window.addEventListener('appinstalled',()=>{document.getElementById('install').hidden=true;document.getElementById('install-help').textContent='O Tempo está instalado. Pode abri-lo pelo ícone no ecrã inicial.'});
if('serviceWorker' in navigator&&['https:','http:'].includes(location.protocol)){
 navigator.serviceWorker.register('./sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{
  document.getElementById('offline-status').textContent='Pronto para usar offline neste dispositivo. Os três sons estão incluídos.';
 }).catch(()=>{document.getElementById('offline-status').textContent='Não foi possível preparar a app offline. Pode descarregar a cópia HTML abaixo e tentar novamente quando tiver ligação.'});
}
