// get params
function getParams() {
    var idx = document.URL.indexOf('?');
    var params = new Array();
    params["gem"] = '610921'
    params["capture"] = '0'
    if (idx != -1) {
	var pairs = document.URL.substring(idx+1, document.URL.length).split('&');
	for (var i=0; i<pairs.length; i++) {
	    var nameVal = pairs[i].split('=');
	    params[nameVal[0]] = nameVal[1];
	}
    } 
    return params;
}
var params = getParams();
var gem = params["gem"]
var capture_flag = params["capture"] == "1";

import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/controls/OrbitControls.js';
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const camera = new THREE.OrthographicCamera( 1,-1,-1,1, 1, 1000 );
if( capture_flag ) {
    camera.left = 1.5;
    camera.right = -1.5;
    camera.top = -1.5;
    camera.bottom = 1.5;
    camera.near = 1;
    camera.far = 1000;
    const ww = 1024*2;
    renderer.setSize(ww,ww);
} else {
    camera.left = 1.5*window.innerWidth / window.innerHeight;
    camera.right = -1.5*window.innerWidth / window.innerHeight;
    camera.top = -1.5;
    camera.bottom = 1.5;
    camera.near = 1;
    camera.far = 1000;
    //camera = new THREE.OrthographicCamera( window.innerWidth / window.innerHeight, -window.innerWidth / window.innerHeight, - 1,  1, 1, 1000 );
    renderer.setSize(window.innerWidth, window.innerHeight);
}

camera.position.set(0, 0, 10);

renderer.setPixelRatio( window.devicePixelRatio );
renderer.physicallyCorrectLights = true; // Use physically correct lighting
renderer.toneMapping = THREE.ACESFilmicToneMapping; // High-quality tone mapping
renderer.toneMappingExposure = 1; // Adjust exposure
renderer.outputEncoding = THREE.sRGBEncoding; // Enable sRGB color space

document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color(0xaaaaaa); 

//Controls
const controls = new OrbitControls(camera, renderer.domElement);


// light
const light = new THREE.AmbientLight( 0xffffff )//40 ); // soft white light
scene.add( light );

const lights = new Array();
var n = 20
for( var u = 0; u < n; u ++) {
    lights[u] = new THREE.DirectionalLight(0xffffff,1);//new THREE.Color(Math.random(),Math.random(),Math.random()), 1);
    var theta = Math.random()*Math.PI*2//*u/n
    var r = 2+10*Math.random()
    lights[u].position.set(r*Math.cos(2*Math.PI*u/n)*Math.sin(theta),
        		   r*Math.sin(2*Math.PI*u/n)*Math.sin(theta),
        		   r*Math.cos(theta)
        		  )
    scene.add(lights[u])
}


let model;
//       const diamondMaterial = new THREE.MeshPhysicalMaterial({
//     color: 0xffffff,         // Base color of the glass (white)
//     transparent: true,       // Enables transparency
//     opacity: 0.5,            // Adjust the opacity (0 is fully transparent, 1 is opaque)
//     roughness: 0,            // Smooth surface (0 is smooth, 1 is rough)
//     metalness: 0,            // Non-metallic (set close to 1 for metallic surfaces)
//     clearcoat: 1,            // Adds a shiny clear coat layer
//     clearcoatRoughness: 0,   // Clear coat roughness (0 is perfectly smooth)
//     transmission: 1,         // Simulates glass-like transparency
//     ior: 1.25,                // Index of Refraction (glass is around 1.5)
//     thickness: 1,          // Thickness of the material for transmission
//     specularIntensity: 1,    // Intensity of specular highlights
// 	  specularColor: 0xffffff, // Color of specular highlights
// 	      side: THREE.DoubleSide, // Renders both sides of each face

// });

// Diamond-like material
const diamondMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,          // Base color (white for diamond)
    transparent: true,        // Enables transparency
    opacity: 0.2,               // Fully transparent (set to < 1 for slight tint)
    roughness: 0,             // Perfectly smooth surface
    metalness: 0.2,           // Slightly metallic for sharper reflections
    clearcoat: 1,             // Adds a shiny clear coat layer
    clearcoatRoughness: 0,    // Perfectly smooth clear coat
    transmission: 1,          // Simulates glass-like transparency
    ior: 2.42,                // High Index of Refraction (diamond is ~2.42)
    thickness: 1,             // Thickness for refraction simulation
    specularIntensity: 1,     // Intense specular highlights
    specularColor: 0xffffff,  // Bright white highlights
    envMapIntensity: 2,       // Enhances environment reflections
    side: THREE.DoubleSide, // Renders both sides of each face
});

const redMaterial = diamondMaterial.clone();
redMaterial.color.set(0xff0000);
redMaterial.ior = 2.42;

const greenMaterial = diamondMaterial.clone();
greenMaterial.color.set(0x00ff00);
greenMaterial.ior = 2.4;

const blueMaterial = diamondMaterial.clone();
blueMaterial.color.set(0x0000ff);
blueMaterial.ior = 2.4;//38;

// Group layers together

fetch("assets/gem_"+gem+".json")

    .then(response => response.json())
    .then(data => {

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(data.vertices), 3));
	geometry.setIndex(data.faces);
	geometry.computeVertexNormals(); // Calculate normals for shading
	//model = new THREE.Mesh(geometry, material)
	//console.log()
	const color = new THREE.Color(data.color[0],data.color[1],data.color[2]);
	diamondMaterial.color.set(color)
	model = new THREE.Group();
	model.add(new THREE.Mesh(geometry, redMaterial));
	model.add(new THREE.Mesh(geometry, greenMaterial));
	model.add(new THREE.Mesh(geometry, blueMaterial));
	model.add(new THREE.Mesh(geometry, diamondMaterial));

	scene.add(model)

    })


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize CCapture
const capturer = new CCapture({
    format: 'jpg',
    framerate: 60,
    verbose: true,
    quality: 100,   // Max quality (only for JPEG/WebM)
    name:"gem_"+gem
});

let recording = false;
let frameCount = 0;
let totalFrames = 1800;

// Render loop
function animate() {

    // Rotate the model around the X-axis
    if (model) {
	
	if( capture_flag ) {
	    if (frameCount === 0) {
		// Start recording
		capturer.start();
	    }

	    // Stop recording after 5 seconds
	    if (frameCount >= totalFrames) {
		capturer.stop();
		capturer.save();
		return;
	    }
	}
        model.rotation.y += 2*Math.PI/1800; // Adjust rotation speed as needed
	//model2.rotation.y = model.rotation.y

	controls.update();
	renderer.render(scene, camera);
	if( capture_flag ) {
	    capturer.capture(renderer.domElement);
	}
	frameCount++;

    }

    requestAnimationFrame(animate);

}

animate();

// const start = async() => {
// 	  await mindarThree.start();
// 	  renderer.setAnimationLoop(() => {
// 	      if( model ) {
// 		  //model.rotation.x += 0.001;
// 		  model.rotation.y += 0.02;
// 	      }
// 	      renderer.render(scene, camera);
// 	  });
// }

// window.onload = () => {
// 	  document.body.requestFullscreen();
// 	  start();
// };

