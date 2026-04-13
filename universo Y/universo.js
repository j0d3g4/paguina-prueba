const canvas = document.getElementById("space")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let stars=[]
let shootingStars=[]
let particles=[]

/* ESTRELLAS */

for(let i=0;i<600;i++){

stars.push({

x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2,
color:`hsl(${Math.random()*360},100%,80%)`

})

}

/* ESTRELLAS FUGACES */

for(let i=0;i<15;i++){

shootingStars.push({

x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
vx:-8-Math.random()*6,
vy:4+Math.random()*3,
color:`hsl(${Math.random()*360},100%,70%)`

})

}

/* ASTEROIDE */

let meteor={

x:-900,
y:-400,
vx:12,
vy:7,
size:120,
angle:0,
active:false

}

/* AGUJERO NEGRO */

let blackhole={

x:canvas.width/2,
y:canvas.height/2,
radius:0,
active:false

}

/* EXPLOSION */

function supernova(x,y){

for(let i=0;i<2000;i++){

particles.push({

x:x,
y:y,
vx:(Math.random()-0.5)*30,
vy:(Math.random()-0.5)*30,
life:200

})

}

}

/* DIBUJO */

function draw(){

ctx.fillStyle="black"
ctx.fillRect(0,0,canvas.width,canvas.height)

/* ESTRELLAS */

stars.forEach(s=>{

ctx.fillStyle=s.color

ctx.beginPath()
ctx.arc(s.x,s.y,s.size,0,Math.PI*2)
ctx.fill()

})

/* ESTRELLAS FUGACES */

shootingStars.forEach(s=>{

s.x+=s.vx
s.y+=s.vy

ctx.strokeStyle=s.color
ctx.lineWidth=2

ctx.beginPath()
ctx.moveTo(s.x,s.y)
ctx.lineTo(s.x+40,s.y-20)
ctx.stroke()

if(s.x<-100){

s.x=canvas.width+100
s.y=Math.random()*canvas.height

}

})

/* ASTEROIDE */

if(meteor.active){

meteor.x+=meteor.vx
meteor.y+=meteor.vy
meteor.angle+=0.03

ctx.save()

ctx.translate(meteor.x,meteor.y)
ctx.rotate(meteor.angle)

let grad=ctx.createRadialGradient(0,0,20,0,0,meteor.size)

grad.addColorStop(0,"#aaa")
grad.addColorStop(1,"#333")

ctx.fillStyle=grad

ctx.beginPath()

for(let i=0;i<10;i++){

let ang=i*Math.PI/5
let r=meteor.size+Math.random()*20

ctx.lineTo(Math.cos(ang)*r,Math.sin(ang)*r)

}

ctx.closePath()
ctx.fill()

ctx.restore()

/* COLA DE PLASMA */

ctx.strokeStyle="orange"
ctx.lineWidth=8

ctx.beginPath()
ctx.moveTo(meteor.x-350,meteor.y-200)
ctx.lineTo(meteor.x,meteor.y)
ctx.stroke()

if(meteor.x>canvas.width/2){

meteor.active=false

supernova(meteor.x,meteor.y)

setTimeout(()=>{

blackhole.active=true

},3000)

}

}

/* PARTICULAS */

particles.forEach(p=>{

p.x+=p.vx
p.y+=p.vy
p.life--

ctx.fillStyle="orange"

ctx.beginPath()
ctx.arc(p.x,p.y,2,0,Math.PI*2)
ctx.fill()

})

particles=particles.filter(p=>p.life>0)

/* AGUJERO NEGRO */

if(blackhole.active){

blackhole.radius+=2

ctx.fillStyle="black"

ctx.beginPath()
ctx.arc(blackhole.x,blackhole.y,blackhole.radius,0,Math.PI*2)
ctx.fill()

/* TEXTO DEFORMADO */

let error=document.getElementById("error")

let dx=0
let dy=0

let dist=blackhole.radius/800

error.style.transform=
`translate(-50%,-50%) scale(${1-dist}) skew(${dist*30}deg,${dist*20}deg)`

if(blackhole.radius>1600){

location.href="pagina3.html"

}

}

requestAnimationFrame(draw)

}

draw()

/* MENSAJES */

setTimeout(()=>{
document.getElementById("l1").style.opacity=1
},1000)

setTimeout(()=>{
document.getElementById("l2").style.opacity=1
},4000)

setTimeout(()=>{
document.getElementById("l3").style.opacity=1
},7000)

setTimeout(()=>{
meteor.active=true
},10000)

setTimeout(()=>{

document.getElementById("mensaje").style.opacity=0

setTimeout(()=>{

let e=document.getElementById("error")

e.classList.add("show")

},2000)

},16000)