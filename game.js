'use strict';
const canvas=document.querySelector('#scene'),ctx=canvas.getContext('2d');
const jumpButton=document.querySelector('#jump'),message=document.querySelector('#message');
let started=false,score=0,jumping=false,jumpAt=0,splashAt=-2000,sound=false,audio;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const names=['George','Suzy','Rebecca'];
function ellipse(x,y,rx,ry,color,stroke){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=4;ctx.stroke()}}
function line(points,color,width=4){ctx.beginPath();ctx.moveTo(...points[0]);for(const p of points.slice(1))ctx.lineTo(...p);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()}
function character(x,y,scale,type='Peppa'){
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
 const pig=type==='Peppa'||type==='George',pink=pig?'#f6a6cc':'#fffcf0',edge=pig?'#d773a1':'#b8aab5';
 line([[-17,-4],[-17,18]],edge);line([[15,-4],[15,18]],edge);
 ctx.fillStyle=pig?'#ffd544':'#40384e';ctx.fillRect(-27,13,23,13);ctx.fillRect(5,13,23,13);
 line([[-35,-65],[-58,-46]],edge);line([[34,-65],[58,-47]],edge);
 ctx.beginPath();ctx.moveTo(-20,-99);ctx.quadraticCurveTo(-39,-77,-41,3);ctx.lineTo(41,3);ctx.quadraticCurveTo(36,-81,15,-99);ctx.closePath();ctx.fillStyle=type==='Peppa'?'#ed4e66':type==='George'?'#55a5e4':type==='Suzy'?'#f39bcd':'#ad71da';ctx.fill();ctx.strokeStyle=edge;ctx.lineWidth=4;ctx.stroke();
 ellipse(-14,-155,type==='Rebecca'?10:8,type==='Rebecca'?36:18,pink,edge);ellipse(11,-158,8,type==='Rebecca'?35:17,pink,edge);
 ellipse(0,-120,39,38,pink,edge);if(pig){ellipse(34,-130,25,18,pink,edge);ellipse(44,-134,3,4,'#cf6095');ellipse(32,-134,3,4,'#cf6095')}
 ellipse(-8,-136,8,9,'white');ellipse(14,-139,8,9,'white');ellipse(-6,-136,3,4,'#353146');ellipse(16,-139,3,4,'#353146');ellipse(-18,-113,11,8,'#f17cb2');
 ctx.beginPath();ctx.arc(6,-118,15,.2,2);ctx.strokeStyle='#bb4f7c';ctx.lineWidth=3;ctx.stroke();ctx.restore();
}
function star(x,y,size,color){ctx.save();ctx.translate(x,y);ctx.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?size*.45:size;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.restore()}
function draw(now){
 const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#a8e2f4';ctx.fillRect(0,0,w,h);
 ellipse(813,87,43,43,'#ffe16b');for(let i=0;i<12;i++){const a=i*Math.PI/6;line([[813+Math.cos(a)*54,87+Math.sin(a)*54],[813+Math.cos(a)*63,87+Math.sin(a)*63]],'#ffe16b',5)}
 [[110,105],[460,72],[700,156]].forEach(([x,y])=>{ellipse(x,y,55,19,'#fffdf4');ellipse(x-22,y-10,23,24,'#fffdf4');ellipse(x+17,y-17,29,27,'#fffdf4')});
 ellipse(210,420,420,180,'#8ccf76');ellipse(800,437,490,190,'#a2d97d');ctx.fillStyle='#8bca6a';ctx.fillRect(0,414,960,126);
 ctx.fillStyle='#f9d276';ctx.fillRect(62,260,111,100);ctx.beginPath();ctx.moveTo(48,260);ctx.lineTo(116,197);ctx.lineTo(187,260);ctx.fillStyle='#ed7675';ctx.fill();ctx.fillStyle='#8fcde0';ctx.fillRect(78,275,28,30);ctx.fillRect(130,275,28,30);ctx.fillStyle='#c27c67';ctx.fillRect(104,320,30,40);
 for(let i=0;i<12;i++){let x=36+i*81,y=454+(i%3)*29;line([[x,y],[x,y-15]],'#508f53',2);ellipse(x,y-17,6,5,i%2?'#fff8d3':'#f9a2c2');ellipse(x,y-17,2,2,'#f7ce47')}
 ellipse(451,455,132,31,'#966748');ellipse(455,451,107,19,'#b78659');ellipse(419,443,43,5,'#cd9c70');
 const t=jumping?Math.min((now-jumpAt)/(reduced?280:850),1):0;let lift=jumping?Math.sin(t*Math.PI)*(reduced?25:135):0;
 ellipse(428,440,43-lift*.08,10,'#718e5080');character(427,414-lift,1.08);
 for(let i=0;i<Math.floor(score/2);i++){character(637+i*105,418,.65,names[i]);ctx.fillStyle='#34435a';ctx.font='bold 20px Trebuchet MS';ctx.textAlign='center';ctx.fillText(names[i],637+i*105,465)}
 if(jumping&&t>=1){jumping=false;score++;splashAt=now;update();tone();}
 const age=(now-splashAt)/900;if(age>=0&&age<1&&!reduced){for(let i=0;i<12;i++){const a=i/12*Math.PI*2;ellipse(440+Math.cos(a)*age*160,435-Math.sin(Math.abs(a))*age*100+age*age*40,5*(1-age)+2,9*(1-age)+2,'#966748')}star(435,300-age*75,24*(1-age)+8,'#ffcf38')}
 requestAnimationFrame(draw);
}
function tone(){if(!sound)return;try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();audio.resume();[523,659,784].forEach((freq,i)=>{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.09;o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(.08,t);g.gain.exponentialRampToValueAtTime(.001,t+.22);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.23)})}catch{sound=false;document.querySelector('#sound').textContent='♪ Son indisponible'}}
function update(){document.querySelector('#stars').textContent=Array.from({length:6},(_,i)=>i<score?'★':'☆').join(' ');document.querySelector('#stars').setAttribute('aria-label',score+' étoiles sur 6');document.querySelector('#friends').textContent='Amis retrouvés : '+Math.floor(score/2)+' / 3';document.querySelector('#fill').style.width=score/6*100+'%';document.querySelector('#progress').setAttribute('aria-valuenow',score);jumpButton.disabled=false;
 if(score===6){message.textContent='Bravo, Ghita ! Tous les amis sont là !';document.querySelector('#win').hidden=false;jumpButton.textContent='Rejouer ↻';document.querySelector('#hint').textContent='Une autre petite aventure ?'}else{message.textContent=score%2===0?'Coucou '+names[score/2-1]+' ! Encore une flaque ?':'Plouf ! Une étoile pour toi, Ghita !';jumpButton.textContent='Sauter ! 💦'}
}
function act(){if(jumping)return;if(score===6){score=0;document.querySelector('#win').hidden=true;update();started=false}if(!started){started=true;message.textContent='Appuie pour sauter dans la flaque !';jumpButton.textContent='Sauter ! 💦';document.querySelector('#hint').textContent='Touche le bouton · ou appuie sur Espace ou ↑';return}jumping=true;jumpAt=performance.now();jumpButton.disabled=true;message.textContent='Hop… dans la flaque !'}
jumpButton.addEventListener('click',act);canvas.addEventListener('click',act);window.addEventListener('keydown',e=>{if((e.code==='Space'||e.code==='ArrowUp')&&!e.repeat&&e.target!==document.querySelector('#sound')){e.preventDefault();act()}});document.querySelector('#sound').addEventListener('click',()=>{sound=!sound;document.querySelector('#sound').setAttribute('aria-pressed',sound);document.querySelector('#sound').textContent='♪ Son : '+(sound?'oui':'non');if(sound)tone()});requestAnimationFrame(draw);
