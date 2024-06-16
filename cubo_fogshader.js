let img, sh, font, size, depth, fogSlider;
let fogColor = [0.5, 0.5, 0.5 , 1.0];
//let fogAmount = 0.5;
let fogNear = 0.0;
let fogFar = 40.0;

function preload() {
    img = loadImage("https://webglfundamentals.org/webgl/resources/f-texture.png");
    font = loadFont('PSansReg.ttf'); 
}

function setup() {
    createCanvas(600, 400, WEBGL);
    sh = createShader(vert, frag);
    noStroke();
    
    fogNearSlider = createSlider(0, 40, 0.0, 0.01);
    fogNearSlider.position(110, 12);
    fogNearSlider.size(100);
    fogFarSlider = createSlider(0, 40, 40.0, 0.01);
    fogFarSlider.position(110, 32);
    fogFarSlider.size(100);
    
    textFont(font);   
}

function draw() {
    background(127);
    fill(0);
    textSize(16);

    text("Fog Near Slider", -width/2 + 5,-height/2 + 25);
    text(fogNear.toFixed(2), -80, -height/2 +25 );
    text("Fog Far Slider", -width/2 + 5,-height/2 + 50);
    text(fogFar.toFixed(2), -80 , -height/2 +50 );
    //orbitControl();
    rotateY(-PI/5);
    
    fogNear = fogNearSlider.value();
    fogFar = fogFarSlider.value();
    
    
    shader(sh);
    sh.setUniform("sTexture", img);
    sh.setUniform("ufogColor", fogColor);
    //sh.setUniform("ufogAmount", fogAmount);
    sh.setUniform("ufogNear", fogNear);
    sh.setUniform("ufogFar", fogFar);
    //texture(img);
    translate(-width/6 ,0,600);
    //box(100); 
    
    for (let i = 0; i < 40; i++) {
        push();
        size = 100 *(1 - i / 40); //cubos se hacen pequeños
        depth = i * -200; //distancia cubos
        
        translate(0, 0, depth);
        rotateY(frameCount * 0.01);
        rotateX(frameCount * 0.01);
        
        box(size);
        pop();
    }
    
}

////////////////////////////////////////////////////////////////////////////////////////////////////

const vert = `
precision mediump float;

attribute vec3 aPosition;
attribute vec2 aTexCoord;//Coord UV de entrada

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTexCoord;//Coord UV de salida
varying float vfogDepth; 


void main() {
    vTexCoord = aTexCoord;
    //gl_Position = uProjectionMatrix * aPosition;
    
    gl_Position = uProjectionMatrix * 
    uModelViewMatrix * 
    vec4(aPosition, 1.0);
    
    vfogDepth = -(uModelViewMatrix * vec4(aPosition, 1.0)).z;
}

`;


const frag = `
precision mediump float;

uniform sampler2D sTexture;
uniform vec4 ufogColor;
//uniform float ufogAmount;
uniform float ufogNear;
uniform float ufogFar;


varying vec2 vTexCoord;//Coord UV de entrada
varying float vfogDepth;


void main() {
  
  //vec3 col = texture2D(sTexture, vTexCoord).rgb;
  vec4 col = texture2D(sTexture, vTexCoord);
  float fogAmount = smoothstep(ufogNear * 200.0, ufogFar * 100.0, vfogDepth);
  
  //gl_FragColor = vec4(col, 1.0);
  gl_FragColor = mix(col, ufogColor, fogAmount);
 
}

`;
