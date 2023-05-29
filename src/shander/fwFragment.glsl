uniform vec3 uColor;
void main(){
   float distanceToPoint=distance(gl_PointCoord,vec2(0.5));
  float strength=1.0-distanceToPoint*2.0;
  gl_FragColor=vec4(uColor.rgb,strength);
}