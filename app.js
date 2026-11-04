const $=id=>document.getElementById(id);
// Intervalos orientativos; variam entre fontes, épocas e interpretações.
const tempi=[
 ['Larghissimo',20,24,'Extremamente lento'],
 ['Grave',25,45,'Lento e solene'],
 ['Largo',40,60,'Largo, amplo'],
 ['Lento',45,60,'Lentamente'],
 ['Larghetto',60,66,'Um pouco mais vivo'],
 ['Adagio',66,76,'Devagar, com expressão'],
 ['Adagietto',72,76,'Um pouco mais vivo que Adagio'],
 ['Andante',76,108,'Ao passo'],
 ['Andantino',80,108,'Ao passo, ligeiramente mais vivo'],
 ['Andante moderato',92,112,'Ao passo, com moderação'],
 ['Moderato',108,120,'Com moderação'],
 ['Allegretto',112,120,'Moderadamente vivo e ligeiro'],
 ['Allegro moderato',116,120,'Vivo, com moderação'],
 ['Allegro',120,168,'Vivo e animado'],
 ['Vivace',168,176,'Vivo e enérgico'],
 ['Vivacissimo',172,176,'Muito vivo e enérgico'],
 ['Allegrissimo / Allegro vivace',172,176,'Muito rápido e vivo'],
 ['Presto',168,200,'Muito rápido'],
 ['Prestissimo',200,208,'O mais rápido possível']
];
const tapOption=new Option('Tap Tempo','tap');tapOption.disabled=true;tapOption.hidden=true;$('tempo').add(tapOption);
const manualOption=new Option('144 BPM','manual');manualOption.disabled=true;manualOption.hidden=true;$('tempo').add(manualOption);
tempi.forEach(([name,min,max],i)=>$('tempo').add(new Option(`${name} · ${min}–${max} BPM`,i)));$('tempo').value=tempi.findIndex(t=>t[0]==='Allegro');
let bpm=144,dotted=false,sound='wood',ctx,running=false,timer,nextTime=0,phase=0,drawTimers=[],taps=[];
function config(){const [n,d]=$('meter').value.split('/').map(Number);const unit=4/d;const figure=Number($('note').value)*(dotted?1.5:1);const pulse=$('group').value==='division'?unit:figure;return {n,d,unit,figure,pulse,bar:n*unit};}
const scaleMarks=[40,42,44,46,48,50,52,54,56,58,60,63,66,69,72,76,80,84,88,92,96,100,104,108,112,116,120,126,132,138,144,152,160,168,176,184,192,200,208];
function scaleY(value){
 const v=Math.max(40,Math.min(208,value));
 let i=scaleMarks.findIndex(mark=>mark>=v);
 const index=i===0?0:(i-1)+(v-scaleMarks[i-1])/(scaleMarks[i]-scaleMarks[i-1]);
 return 64+index/(scaleMarks.length-1)*186;
}
function weightOffset(value){return scaleY(value)-142;}

function render(){$('sliding-weight').setAttribute('transform',`translate(0 ${weightOffset(bpm)})`);$('scale-limit').textContent=bpm<40?'Menos de 40 BPM':bpm>208?'Mais de 208 BPM':'';const isTap=$('tempo').value==='tap';const isManual=$('tempo').value==='manual';manualOption.textContent=`${bpm} BPM`;const t=isTap?['Tap Tempo',20,300,'Tap Tempo']:isManual?['Manual',20,300,'Tempo manual']:tempi[$('tempo').value];$('bpm').value=bpm;$('speed').min=t[1];$('speed').max=t[2];$('speed').value=bpm;$('low').textContent=t[1]+' BPM';$('high').textContent=t[2]+' BPM';$('mood').textContent=t[3];$('rangeName').textContent=isManual?'Tempo manual':isTap?'Tap Tempo':bpm<t[1]||bpm>t[2]?'Tempo personalizado':'Intervalo de referência';const c=config();const names={'4':'semibreve','2':'mínima','1':'semínima','0.5':'colcheia','0.25':'semicolcheia'};const count=c.bar/c.pulse;$('conversion').textContent=`${names[$('note').value]}${dotted?' com ponto':''} = ${bpm} BPM · ♩ = ${+(bpm*c.figure).toFixed(1)} BPM. ${$('group').value==='division'?`${+(bpm*c.figure/c.unit).toFixed(1)} cliques/min`:`${bpm} cliques/min`} · ${+count.toFixed(2)} cliques por compasso.`;$('beats').replaceChildren(...Array.from({length:c.n},()=>{let el=document.createElement('span');el.className='beat';return el}));$('stage').style.setProperty('--period',60/(bpm*c.figure/c.pulse)+'s');}
function resetClock(){phase=0;if(running){clearInterval(timer);drawTimers.forEach(clearTimeout);drawTimers=[];nextTime=ctx.currentTime+.06;timer=setInterval(schedule,25);schedule();}}
function setBpm(v){bpm=Math.max(20,Math.min(300,Math.round(Number(v)||144)));render();}
// Reutiliza a mesma excitação: cada clique de madeira tem a mesma energia.
let woodBuffer;
function woodNoise(){
 if(!woodBuffer){
  woodBuffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.065),ctx.sampleRate);
  const data=woodBuffer.getChannelData(0);
  let seed=1729;
  for(let i=0;i<data.length;i++){
   seed=(Math.imul(seed,1664525)+1013904223)>>>0;
   data[i]=seed/2147483648-1;
  }
 }
 return woodBuffer;
}
function click(time,strong){
 const gain=ctx.createGain();gain.connect(ctx.destination);
 const vol=Number($('volume').value)*(strong?1:.65);
 gain.gain.setValueAtTime(.0001,time);
 gain.gain.exponentialRampToValueAtTime(Math.max(.0001,vol*.45),time+.002);
 gain.gain.exponentialRampToValueAtTime(.0001,time+(sound==='metal'?.16:.055));
 if(sound==='wood'){
  const src=ctx.createBufferSource();src.buffer=woodNoise();
  const filter=ctx.createBiquadFilter();filter.type='bandpass';
  filter.frequency.value=strong?1500:1000;filter.Q.value=5;
  src.connect(filter);filter.connect(gain);src.start(time);src.stop(time+.07);
 }else{
  const osc=ctx.createOscillator();osc.type=sound==='metal'?'triangle':'sine';
  osc.frequency.setValueAtTime(sound==='metal'?(strong?2400:1800):(strong?1400:950),time);
  osc.connect(gain);osc.start(time);osc.stop(time+.18);
 }
}
function schedule(){const c=config();const interval=60/bpm*c.pulse/c.figure;while(nextTime<ctx.currentTime+.12){const p=phase;const isStart=p<.00001;click(nextTime,isStart&&$('accent').checked);const delay=Math.max(0,(nextTime-ctx.currentTime)*1000);drawTimers.push(setTimeout(()=>{if(!running)return;[...$('beats').children].forEach((e,i)=>e.classList.toggle('on',i===Math.min(c.n-1,Math.floor(p/c.unit))));},delay));if(drawTimers.length>100)drawTimers=drawTimers.slice(-30);nextTime+=interval;phase=(phase+c.pulse)%c.bar;if(phase<1e-8)phase=0;}}
async function toggle(){if(running){running=false;clearInterval(timer);drawTimers.forEach(clearTimeout);drawTimers=[];$('stage').setAttribute('aria-pressed','false');$('stage').setAttribute('aria-label','Iniciar metrónomo');$('play-hint').textContent='Toque no metrónomo para iniciar';$('stage').classList.remove('running');[...$('beats').children].forEach(e=>e.classList.remove('on'));return;}ctx??=new (window.AudioContext||window.webkitAudioContext)();await ctx.resume();running=true;$('stage').setAttribute('aria-pressed','true');$('stage').setAttribute('aria-label','Parar metrónomo');$('play-hint').textContent='Toque no metrónomo para parar';$('stage').classList.add('running');resetClock();}
$('tempo').onchange=()=>{const t=tempi[$('tempo').value];if(!t)return;taps=[];setBpm((t[1]+t[2])/2)};function manualBpm(value){$('tempo').value='manual';taps=[];setBpm(value);}$('bpm').oninput=e=>{const value=Number(e.target.value);if(e.target.value!==''&&Number.isInteger(value)&&value>=20&&value<=300)manualBpm(value);};$('bpm').onchange=e=>manualBpm(e.target.value);$('speed').oninput=e=>setBpm(e.target.value);$('minus').onclick=()=>setBpm(bpm-1);$('plus').onclick=()=>setBpm(bpm+1);
['meter','note','group'].forEach(id=>$(id).onchange=()=>{render();resetClock()});$('dot').onclick=()=>{dotted=!dotted;$('dot').classList.toggle('selected',dotted);$('dot').setAttribute('aria-pressed',dotted);render();resetClock()};document.querySelectorAll('.sound').forEach(btn=>btn.onclick=()=>{sound=btn.dataset.sound;document.querySelectorAll('.sound').forEach(b=>{b.classList.toggle('selected',b===btn);b.setAttribute('aria-pressed',b===btn)})});$('stage').onclick=toggle;
$('tap').onclick=()=>{$('tempo').value='tap';render();let now=performance.now();if(taps.length&&now-taps.at(-1)>2500)taps=[];taps.push(now);taps=taps.slice(-6);if(taps.length>1)setBpm(60000/((taps.at(-1)-taps[0])/(taps.length-1)))};
document.addEventListener('keydown',e=>{if(e.code==='Space'&&!['INPUT','SELECT','BUTTON','TEXTAREA'].includes(e.target.tagName)){e.preventDefault();toggle()}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)toggle()});
scaleMarks.forEach((value,i)=>{
 const y=scaleY(value);
 const line=document.createElementNS('http://www.w3.org/2000/svg','path');
 line.setAttribute('d',`M143 ${y}H157`);$('ticks').append(line);
 const text=document.createElementNS('http://www.w3.org/2000/svg','text');
 const left=i%2===0;text.setAttribute('x',left?139:161);text.setAttribute('text-anchor',left?'end':'start');
 text.setAttribute('y',y+2.4);text.setAttribute('font-size',6.7);text.setAttribute('fill','#596350');text.setAttribute('stroke','none');text.textContent=value;$('ticks').append(text);
});render();
