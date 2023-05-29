<template>
 <div></div>  
</template>

<script setup>
import * as THREE from 'three'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import FireWork from './utils/firework'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
const scene=new THREE.Scene()
const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
camera.position.set(0,10,10)
const renderer=new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)
const controls=new OrbitControls(camera,renderer.domElement)
controls.enableDamping=true 
const helper=new THREE.AxesHelper(5)
scene.add(helper)

const rgbeLoader=new RGBELoader()
rgbeLoader.loadAsync('./hdr/sky10.hdr').then((texture)=>{
  console.log(texture)
  texture.mapping=THREE.EquirectangularReflectionMapping
  scene.environment=texture
  scene.background=texture
})
//管理烟花
let fireworks=[]
let createFireworks=()=>{
  let color=`hsl(${Math.floor(Math.random()*360)},100%,80%)`
  let position={
    x:(Math.random()-0.5)*40,
    z:(Math.random()-0.5)*40,
    y:7+Math.random()*25 
  }
  const firework=new FireWork(color,position)
  firework.addScene(scene,camera)
  fireworks.push(firework)
}

window.addEventListener('click',createFireworks)



function animate(){
  renderer.render(scene,camera)
  controls.update()
  fireworks.forEach((item)=>{
    item.update()
  })
  requestAnimationFrame(animate)
}
animate()
</script>

<style>
*{
  margin:0;
  padding:0;
}
canvas{
  width:100vw;
  height: 100vh;
  position: fixed;
  top:0;
  left:0;
}
</style>
