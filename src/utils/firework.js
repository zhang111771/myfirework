import * as THREE from 'three'
import vertexShader from '../shander/vertexShader.glsl'
import fragmentShader from '../shander/fragmentShader.glsl'
import fwVertex from '../shander/fwVertex.glsl'
import fwFragment from '../shander/fwFragment.glsl'
export default class FireWorks{
  constructor(color,to,from={x:0,y:0,z:0}){
    this.color=new THREE.Color(color)
    console.log('创建烟花',color,from)
    //创建烟花发射的球点
    this.startGeometry=new THREE.BufferGeometry()
    const startPositionArray=new Float32Array(3)
    startPositionArray[0]=from.x
    startPositionArray[1]=from.y
    startPositionArray[2]=from.z
     
    const astepArray=new Float32Array(3)
    astepArray[0]=to.x-from.x
    astepArray[1]=to.y-from.y
    astepArray[2]=to.z-from.z


    this.startGeometry.setAttribute('position',new THREE.BufferAttribute(startPositionArray,3))
    this.startGeometry.setAttribute('aStep',new THREE.BufferAttribute(astepArray,3))

    this.startMaterial=new THREE.ShaderMaterial({
      vertexShader:vertexShader,
      fragmentShader:fragmentShader,
      transparent:true,
      blending:THREE.AdditiveBlending,
      depthWrite:false,
      uniforms:{
        uTime:{
          value:0
        },
        uSize:{
          value:20
        },
        uColor:{
          value:this.color
        }
      }
    })
    this.startPoint=new THREE.Points(this.startGeometry,this.startMaterial)
    this.clock=new THREE.Clock()

    this.fireworkGeometry=new THREE.BufferGeometry()
    this.fireworksCount=180+Math.floor(Math.random()*180)
    let positionFireworksArray=new Float32Array(this.fireworksCount*3)
    const scaleFireArray=new Float32Array(this.fireworksCount)
    const directionArray=new Float32Array(this.fireworksCount*3)
    for(let i=0;i<this.fireworksCount;i++){
      positionFireworksArray[i*3+0]=to.x
      positionFireworksArray[i*3+1]=to.y
      positionFireworksArray[i*3+2]=to.z
      //设置烟花所有粒子初始化大小
      scaleFireArray[i]=Math.random()
      //设置发射的角度
      let theta=Math.random()*2*Math.PI
      let beta=Math.random()*2*Math.PI
      let r=Math.random()
      directionArray[i*3+0]=r*Math.sin(theta)+r*Math.sin(beta)
      directionArray[i*3+1]=r*Math.cos(theta)+r*Math.cos(beta)
      directionArray[i*3+2]=r*Math.sin(theta)+r*Math.cos(beta)

    }
    this.fireworkGeometry.setAttribute('position',new THREE.BufferAttribute(positionFireworksArray,3))
    this.fireworkGeometry.setAttribute('aScale',new THREE.BufferAttribute(scaleFireArray,1))
    this.fireworkGeometry.setAttribute('aRandom',new THREE.BufferAttribute(directionArray,3))
    this.fireworksMaterial=new THREE.ShaderMaterial({
      vertexShader:fwVertex,
      fragmentShader:fwFragment,
      transparent:true,
      depthWrite:false,
      blending:THREE.AdditiveBlending,
      uniforms:{
        uTime:{
          value:0
        },
        uSize:{
          value:0
        },
        uColor:{
          value:this.color
        }
      }
    })
    this.fireworks=new THREE.Points(this.fireworkGeometry,this.fireworksMaterial)


   
  }
  addScene(scene,camera){
    scene.add(this.startPoint)
    scene.add( this.fireworks)
    this.scene=scene
  }
  update(){
    const elapsedTime=this.clock.getElapsedTime()
    if(elapsedTime<1){
      this.startMaterial.uniforms.uTime.value=elapsedTime

    }else{
      const time=elapsedTime-1
      this.startMaterial.uniforms.uSize.value=0
    
      this.scene.remove(this.startPoint)
      this.startGeometry.dispose()
      this.startMaterial.dispose()
      this.fireworksMaterial.uniforms.uSize.value=20
      this.fireworksMaterial.uniforms.uTime.value=time
      if(time>5){
     
        this.scene.remove(this.fireworks)
        this.fireworkGeometry.dispose()
        this.fireworksMaterial.dispose()
       
      }
    }

    // console.log( this.startMaterial.uniforms.uTime.value)
  }
}