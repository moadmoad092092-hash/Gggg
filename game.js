import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const loading = document.querySelector('#loading');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8bd8ff);
scene.fog = new THREE.Fog(0x8bd8ff, 32, 105);

const camera = new THREE.PerspectiveCamera(65, innerWidth/innerHeight, 0.1, 250);
const renderer = new THREE.WebGLRenderer({antialias:true, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.querySelector('#game').prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xdff6ff, 0x31435b, 2.0));
const sun = new THREE.DirectionalLight(0xffffff, 2.1);
sun.position.set(-12,24,12); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024);
sun.shadow.camera.left=-35; sun.shadow.camera.right=35; sun.shadow.camera.top=35; sun.shadow.camera.bottom=-35;
scene.add(sun);

const mats = {
 grass:new THREE.MeshStandardMaterial({color:0x2dce8b,roughness:.9}),
 platform:new THREE.MeshStandardMaterial({color:0x1a2c44,roughness:.65}),
 edge:new THREE.MeshStandardMaterial({color:0x43e5ff,emissive:0x0b7aab,emissiveIntensity:.8}),
 orange:new THREE.MeshStandardMaterial({color:0xffa43b,emissive:0x7c3000,emissiveIntensity:.25}),
 pink:new THREE.MeshStandardMaterial({color:0xff4f9a,emissive:0x760b42,emissiveIntensity:.25}),
 white:new THREE.MeshStandardMaterial({color:0xf0f7ff,roughness:.5}),
 dark:new THREE.MeshStandardMaterial({color:0x182133,roughness:.8}),
 skin:new THREE.MeshStandardMaterial({color:0xffc49a}),
 shirt:new THREE.MeshStandardMaterial({color:0x111b2e,roughness:.6}),
 glow:new THREE.MeshStandardMaterial({color:0x40eaff,emissive:0x08aaff,emissiveIntensity:2}),
};
const boxGeo = new THREE.BoxGeometry(1,1,1);
function box(name,x,y,z,w,h,d,mat,opts={}) {
 const mesh=new THREE.Mesh(boxGeo,mat); mesh.name=name; mesh.position.set(x,y,z); mesh.scale.set(w,h,d);
 mesh.castShadow=true; mesh.receiveShadow=true; scene.add(mesh); return mesh;
}
// Floating island base and decorative scenery
box('island',0,-1.1,-7,15,2,22,mats.grass);
for(let i=0;i<18;i++){
 const x=(Math.random()-.5)*13, z=-17+Math.random()*20;
 const rock=box('rock',x,-2.35,z,.6+Math.random(),.8+Math.random()*1.4,.7,mats.platform);
 rock.rotation.y=Math.random()*Math.PI;
}
const platforms=[];
function platform(x,y,z,w,d,mat=mats.platform,checkpoint=false){
 const p=box('platform',x,y,z,w,.55,d,mat); p.userData={x,y,z,w,d,checkpoint}; platforms.push(p);
 // glowing rim just above the platform
 box('rim',x,y+.29,z,w+.04,.07,d+.04,checkpoint?mats.glow:mats.edge);
 return p;
}
platform(0,0,1,6,6,mats.platform,true);
platform(0,.4,-5,3.2,3,mats.platform,true);
platform(3,.9,-10,2.8,2.8,mats.orange,true);
platform(-.2,1.35,-14.7,2.5,2.5,mats.platform,true);
platform(-3,1.9,-19,3,2.8,mats.pink,true);
platform(0,2.35,-23.5,4.5,4,mats.platform,true);

// Floating blocks and moving-looking decorative hoops
for(let i=0;i<7;i++){
 const ring=new THREE.Mesh(new THREE.TorusGeometry(1.1,.09,8,24),mats.edge);
 ring.position.set((i%2?3.5:-3.5),1.4+i*.15,-4-i*2.5); ring.rotation.x=Math.PI/2; scene.add(ring);
}
for(let i=0;i<12;i++){
 const cloud=new THREE.Mesh(new THREE.DodecahedronGeometry(1.3+Math.random()*1.5,0),new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.72,roughness:1}));
 cloud.position.set((Math.random()-.5)*65,12+Math.random()*14,-35-Math.random()*45); cloud.scale.y=.45; scene.add(cloud);
}
// Finish arch and beacon
box('finish-left',-1.7,3.6,-25.4,.35,3.2,.35,mats.glow);
box('finish-right',1.7,3.6,-25.4,.35,3.2,.35,mats.glow);
box('finish-top',0,5.2,-25.4,3.7,.35,.35,mats.glow);
const beacon=new THREE.Mesh(new THREE.CylinderGeometry(.05,.55,2,12),mats.glow); beacon.position.set(0,3.5,-25.4); scene.add(beacon);

// Blocky avatar, built from separate pieces
const player=new THREE.Group(); scene.add(player);
function part(parent,x,y,z,w,h,d,mat){const m=new THREE.Mesh(boxGeo,mat);m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
part(player,0,1.25,0,.78,.85,.42,mats.shirt);
part(player,0,1.95,0,.62,.62,.6,mats.skin);
part(player,0,2.29,0,.66,.18,.63,mats.dark);
part(player,-.36,1.25,0,.22,.75,.25,mats.shirt);
part(player,.36,1.25,0,.22,.75,.25,mats.shirt);
const legL=part(player,-.2,.48,0,.27,.72,.3,mats.dark);
const legR=part(player,.2,.48,0,.27,.72,.3,mats.dark);
const armL=part(player,-.57,1.3,0,.2,.72,.22,mats.skin);
const armR=part(player,.57,1.3,0,.2,.72,.22,mats.skin);
const eyeMat=new THREE.MeshStandardMaterial({color:0x172235});
part(player,-.15,2.02,.305,.07,.09,.025,eyeMat); part(player,.15,2.02,.305,.07,.09,.025,eyeMat);

const state={pos:new THREE.Vector3(0,.35,1),vel:new THREE.Vector3(),grounded:false,yaw:0,pitch:.22,camDist:7,keys:{},joystickX:0,joystickY:0,dragging:false,lastX:0,lastY:0,started:performance.now(),won:false,checkpoints:0};
player.position.copy(state.pos);
const ui={timer:document.querySelector('#timer'),checkpoint:document.querySelector('#checkpoint'),toast:document.querySelector('#toast'),win:document.querySelector('#win')};
let toastTimer;
function toast(s){ui.toast.textContent=s;ui.toast.style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>ui.toast.style.display='none',1800);}
function reset(){state.pos.set(0,.35,1);state.vel.set(0,0,0);state.yaw=0;state.pitch=.22;state.won=false;state.started=performance.now();state.checkpoints=0;player.position.copy(state.pos);ui.win.classList.add('hidden');ui.checkpoint.textContent='0 / 5';toast('انطلق! وصل إلى البوابة الزرقاء');}
document.querySelector('#reset').addEventListener('click',reset);
document.querySelector('#play-again').addEventListener('click',reset);
window.addEventListener('keydown',e=>{state.keys[e.code]=true;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();});
window.addEventListener('keyup',e=>state.keys[e.code]=false);
function jump(){if(state.grounded&&!state.won){state.vel.y=8.3;state.grounded=false;}}
document.querySelector('#jump').addEventListener('pointerdown',e=>{e.preventDefault();jump();});

// Virtual joystick: touch or mouse
const joy=document.querySelector('#joystick'), stick=document.querySelector('#stick');
let joyPointer=null;
function joyMove(e){const r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const max=34,len=Math.hypot(dx,dy);if(len>max){dx=dx/len*max;dy=dy/len*max;}state.joystickX=dx/max;state.joystickY=dy/max;stick.style.transform=`translate(${dx}px,${dy}px)`;}
joy.addEventListener('pointerdown',e=>{e.preventDefault();joyPointer=e.pointerId;joy.setPointerCapture(e.pointerId);joyMove(e);});
joy.addEventListener('pointermove',e=>{if(e.pointerId===joyPointer)joyMove(e);});
function joyEnd(e){if(e.pointerId!==joyPointer)return;joyPointer=null;state.joystickX=state.joystickY=0;stick.style.transform='translate(0,0)';}
joy.addEventListener('pointerup',joyEnd);joy.addEventListener('pointercancel',joyEnd);

// Drag anywhere outside controls to rotate camera
renderer.domElement.addEventListener('pointerdown',e=>{state.dragging=true;state.lastX=e.clientX;state.lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);});
renderer.domElement.addEventListener('pointermove',e=>{if(!state.dragging)return;const dx=e.clientX-state.lastX,dy=e.clientY-state.lastY;state.lastX=e.clientX;state.lastY=e.clientY;state.yaw-=dx*.006;state.pitch=Math.max(-.15,Math.min(.75,state.pitch+dy*.004));});
renderer.domElement.addEventListener('pointerup',()=>state.dragging=false);
renderer.domElement.addEventListener('pointercancel',()=>state.dragging=false);

const clock=new THREE.Clock();
const forward=new THREE.Vector3(),right=new THREE.Vector3(),move=new THREE.Vector3();
function update(dt){
 if(!state.won){
  let ix=state.joystickX, iz=state.joystickY;
  if(state.keys.KeyA||state.keys.ArrowLeft)ix-=1;
  if(state.keys.KeyD||state.keys.ArrowRight)ix+=1;
  if(state.keys.KeyW||state.keys.ArrowUp)iz-=1;
  if(state.keys.KeyS||state.keys.ArrowDown)iz+=1;
  if(state.keys.Space){jump();state.keys.Space=false;}
  const mag=Math.hypot(ix,iz);if(mag>1){ix/=mag;iz/=mag;}
  forward.set(-Math.sin(state.yaw),0,-Math.cos(state.yaw));
  right.set(Math.cos(state.yaw),0,-Math.sin(state.yaw));
  move.set(0,0,0).addScaledVector(right,ix).addScaledVector(forward,-iz);
  if(move.lengthSq()>.001){move.normalize();state.pos.x+=move.x*5.6*dt;state.pos.z+=move.z*5.6*dt;player.rotation.y=Math.atan2(move.x,move.z);}
  state.vel.y-=19*dt;state.pos.y+=state.vel.y*dt;state.grounded=false;
  const px=state.pos.x,pz=state.pos.z;
  for(const p of platforms){const u=p.userData;const top=u.y+.275;
   if(px>u.x-u.w/2-.22&&px<u.x+u.w/2+.22&&pz>u.z-u.d/2-.22&&pz<u.z+u.d/2+.22&&state.vel.y<=0&&state.pos.y<=top+.02&&state.pos.y>=top-.7){
    state.pos.y=top;state.vel.y=0;state.grounded=true;
   }
  }
  if(state.pos.y < -7){state.pos.set(0,.35,1);state.vel.set(0,0,0);toast('سقطت! حاول القفز في الوقت المناسب');}
  // progress based on reaching successive course sections
  const progress=Math.max(0,Math.min(5,Math.floor(Math.max(0,1-state.pos.z)/5.1)));
  if(progress>state.checkpoints){state.checkpoints=progress;ui.checkpoint.textContent=`${progress} / 5`;if(progress>0)toast('نقطة تقدم جديدة!');}
  if(state.pos.z < -24 && state.pos.y>1.3){state.won=true;ui.win.classList.remove('hidden');}
 }
 player.position.copy(state.pos);
 // Camera stays behind avatar, rotates with touch drag like a third-person game
 const target=new THREE.Vector3(state.pos.x,state.pos.y+1.35,state.pos.z);
 const dist=state.camDist, cp=Math.cos(state.pitch),sp=Math.sin(state.pitch);
 const offset=new THREE.Vector3(Math.sin(state.yaw)*dist*cp, (2.0+sp*dist), Math.cos(state.yaw)*dist*cp);
 camera.position.copy(target).add(offset);camera.lookAt(target);
 const elapsed=Math.floor((performance.now()-state.started)/1000);
 ui.timer.textContent=String(Math.floor(elapsed/60)).padStart(2,'0')+':'+String(elapsed%60).padStart(2,'0');
 beacon.rotation.y+=dt*.9;
}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.035);update(dt);renderer.render(scene,camera);}
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));});
loading.style.display='none';toast('اسحب الشاشة لتدوير الكاميرا');animate();
