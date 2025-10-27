const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let cw = canvas.width, ch = canvas.height;
let player = {x:cw/2-24, y:ch-64, w:48, h:48, speed:5, vx:0};
let keys = {};
let obstacles = [];
let items = [];
let score = 0;
let high = localStorage.getItem('simpleEvadeHigh') || 0;
document.getElementById('high').textContent = high;

function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function isCollide(a,b){ return !(a.x+a.w<b.x || a.x>b.x+b.w || a.y+a.h<b.y || a.y>b.y+b.h); }

function spawnObstacle(){
  const size = randInt(24,80);
  obstacles.push({x:randInt(20,cw-20-size), y:-size, w:size, h:size, speed:2+Math.random()*2});
}

function spawnItem(){
  const size = 30;
  items.push({x:randInt(20,cw-20-size), y:-size, w:size, h:size, speed:2});
}

function update(){
  player.vx = keys['ArrowLeft']||keys['a'] ? -player.speed : keys['ArrowRight']||keys['d'] ? player.speed : 0;
  player.x = Math.max(0, Math.min(cw-player.w, player.x+player.vx));

  if(Math.random()<0.02) spawnObstacle();
  if(Math.random()<0.01) spawnItem();

  for(let i=obstacles.length-1;i>=0;i--){
    const ob = obstacles[i]; ob.y += ob.speed;
    if(ob.y>ch+50){ obstacles.splice(i,1); score++; document.getElementById('score').textContent = score; }
    if(isCollide(player,ob)) gameOver();
  }

  for(let i=items.length-1;i>=0;i--){
    const it = items[i]; it.y+=it.speed;
    if(it.y>ch+50) items.splice(i,1);
    if(isCollide(player,it)){ score+=5; document.getElementById('score').textContent=score; items.splice(i,1); }
  }
}

function render(){
  ctx.clearRect(0,0,cw,ch);
  ctx.fillStyle='#021628'; ctx.fillRect(0,0,cw,ch);

  ctx.fillStyle='#fff'; ctx.fillRect(player.x,player.y,player.w,player.h);
  obstacles.forEach(ob=>{ ctx.fillStyle='red'; ctx.fillRect(ob.x,ob.y,ob.w,ob.h); });
  items.forEach(it=>{ ctx.fillStyle='yellow'; ctx.beginPath(); ctx.arc(it.x+it.w/2,it.y+it.h/2,it.w/2,0,Math.PI*2); ctx.fill(); });
}

function loop(){ update(); render(); requestAnimationFrame(loop); }

function gameOver(){
  alert('ゲームオーバー！スコア: '+score);
  if(score>high){ high=score; localStorage.setItem('simpleEvadeHigh',high); document.getElementById('high').textContent=high; }
  reset();
}

function reset(){ obstacles=[]; items=[]; score=0; document.getElementById('score').textContent=score; player.x=cw/2-24; }

window.addEventListener('keydown',e=>keys[e.key]=true);
window.addEventListener('keyup',e=>keys[e.key]=false);
document.getElementById('restartBtn').addEventListener('click', reset);
loop();
