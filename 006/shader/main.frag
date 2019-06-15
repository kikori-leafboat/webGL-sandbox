precision mediump float;
varying vec4 vColor;
varying float time;

void main(){
    gl_FragColor = vec4(vColor.x + sin(time), vColor.y, vColor.z, vColor.w);
}

