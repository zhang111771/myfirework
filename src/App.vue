<template>
 <div></div>  
</template>

<script setup>
import * as THREE from 'three'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import FireWork from './utils/firework'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
const scene=new THREE.Scene()
const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
camera.position.set(0,10,10)
const renderer=new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)

renderer.shadowMap.enabled=true
document.body.appendChild(renderer.domElement)
const controls=new OrbitControls(camera,renderer.domElement)
controls.enableDamping=true 
const helper=new THREE.AxesHelper(5)
scene.add(helper)


const baseUniform={
  uTime:{
    value:0
  }
}
const rgbeLoader=new RGBELoader()

rgbeLoader.loadAsync('./hdr/sky10.hdr').then((texture)=>{

  texture.mapping=THREE.EquirectangularReflectionMapping
  scene.environment=texture
  scene.background=texture
})
const planeGeometry=new THREE.PlaneGeometry(15,15)
const planeMaterial=new THREE.MeshStandardMaterial({
  color:0xffffff
})
const plane=new THREE.Mesh(planeGeometry,planeMaterial)
plane.position.set(0,0,-5)
plane.castShadow=true
plane.receiveShadow=true
scene.add(plane)

const directionLight=new THREE.DirectionalLight(0xffffff,1)
directionLight.castShadow=true
directionLight.position.set(0,0,200)
scene.add(directionLight)
const gltfLoader=new GLTFLoader()
const textureLoader=new THREE.TextureLoader()
const texture=textureLoader.load('./model/LeePerrySmith/Map-COL.jpg')
const normalMaterial=textureLoader.load('./model/LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg')
const personMaterial=new THREE.MeshStandardMaterial({

  map:texture,
  normalMap:normalMaterial
})

personMaterial.onBeforeCompile=(shader)=>{
  console.log(shader.vertexShader)
  shader.uniforms.uTime=baseUniform.uTime
  shader.vertexShader=shader.vertexShader.replace('#include <common>',
    
    `
    #include <common>
    mat2 rotate2d(float _angle){
        return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
                    
    }
    uniform float uTime;
    `
    )
    shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>',    
    `
    #include <beginnormal_vertex>
      float angle=sin(position.y+uTime)*0.5;
     mat2 rotateMatrix=rotate2d(angle);
     objectNormal.xz=rotateMatrix*objectNormal.xz;
    `
    )
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',
    
    `
    #include <begin_vertex>

     transformed.xz=rotateMatrix*transformed.xz;
    `
    )
  

}


const depthMaterial=new THREE.MeshDepthMaterial({
  depthPacking:THREE.RGBADepthPacking
})
depthMaterial.onBeforeCompile=(shader)=>{
  shader.uniforms.uTime=baseUniform.uTime
  shader.vertexShader=shader.vertexShader.replace('#include <common>',
    
    `
    #include <common>
    mat2 rotate2d(float _angle){
        return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
                    
    }
    uniform float uTime;
    `
    )
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',
    
    `
    #include <begin_vertex>
      float angle=sin(position.y+uTime)*0.5;
    mat2 rotateMatrix=rotate2d(angle);
     transformed.xz=rotateMatrix*transformed.xz;
    `
    )
}
gltfLoader.load('./model/LeePerrySmith/LeePerrySmith.glb',(gltf)=>{

  const mesh=gltf.scene.children[0]
  mesh.castShadow=true
  mesh.material=personMaterial
  //设定自定义的胜读材质
  mesh.customDepthMaterial=depthMaterial
  scene.add(mesh)
})


let clock=new THREE.Clock()

function animate(){
  renderer.render(scene,camera)
  controls.update()
 

  baseUniform.uTime.value=clock.getElapsedTime()
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
