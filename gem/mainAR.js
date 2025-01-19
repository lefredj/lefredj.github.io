// tet params
function getParams() {
    var idx = document.URL.indexOf('?');
    var params = new Array();
    params["gem"] = '610921'
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

import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
const mindarThree = new MindARThree({
    container: document.querySelector("#container"),
    imageTargetSrc: "./assets/targets_"+gem+".mind",
    //test
    //imageTargetSrc: "./assets/targets_234.mind",
    filterMinCF: 0.0001,
    filterBeta: 0.001,
});
const {renderer, scene, camera} = mindarThree;
const anchor = mindarThree.addAnchor(0);

// lights
const light = new THREE.AmbientLight( 0xffffff )//40 ); // soft white light
anchor.group.add( light );


const lights = new Array();
var n = 20
for( var u = 0; u < n; u ++) {
    lights[u] = new THREE.DirectionalLight(0xffffff,1)
    var theta = Math.PI*2*u/n
    var r = 2+10*Math.random()
    lights[u].position.set(r*Math.cos(2*Math.PI*u/n)*Math.sin(theta),
        		   r*Math.sin(2*Math.PI*u/n)*Math.sin(theta),
        		   r*Math.cos(theta)
        		  )
    anchor.group.add(lights[u])
}



const bgGeometry = new THREE.PlaneGeometry(2, 2);
const bgMaterial = new THREE.MeshBasicMaterial( {color: 0xaaaaaa, side: THREE.DoubleSide} );
const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
anchor.group.add(bgMesh);

let model;

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
	model.position.set(0, 0, 1);
        model.scale.set(0.5, 0.5, 0.5); // Scale down by a factor of 0.5
	anchor.group.add(model)
    })
window.addEventListener('click', onclick, false);
function onclick(event) {
    let newloc = "https://lefredj.github.io/gem/gem.html?gem="+gem;
    window.location.replace(newloc);
}


const start = async() => {
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
	if( model ) {
	    model.rotation.y += 0.02;
	}
	renderer.render(scene, camera);
    });
}

window.onload = () => {
    document.body.requestFullscreen();
    start();
};



