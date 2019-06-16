attribute vec3 position;
attribute vec4 color;
uniform vec4 globalColor;
uniform float iTime;
varying vec4 vColor;
varying float time;
void main(){
    vColor = color * globalColor;
    time = iTime;

    gl_Position = vec4(position.x * sin(iTime + 0.5), position.y * sin(iTime + 0.5), position.z, 1.0);
}

