"use strict";

if (!Detector.webgl) {
	Detector.addGetWebGLMessage();
}

var container;
var scaleattb = 0.5;//Set the scale of the model

var camera, controls, scene, renderer;
var lighting, ambient, keyLight, fillLight, backLight;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var meshes = {0:"death.obj", 1:"Gauntlets.obj", 2:"boot.obj", 3:"jetpack.obj", 4:"spacestation.obj"};
var meshNames = {0:"Linear Death", 1:"Kinetic Gauntlets", 2:"Anti-Grav Boots", 3:"Jetpack", 4:"Space-Station"};
var numMeshes = 4;
var meshIndex = 0;

document.getElementById("p1").innerHTML = meshNames[0];

init();
animate();

function recreateScene()
{
	/* Scene */

	scene = new THREE.Scene();
	lighting = true;

	ambient = new THREE.AmbientLight(0xffffff, 1.0);
	scene.add(ambient);

	keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
	keyLight.position.set(-100, 0, 100);

	fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
	fillLight.position.set(100, 0, 100);

	backLight = new THREE.DirectionalLight(0xffffff, 1.0);
	backLight.position.set(100, 0, -100).normalize();

	/* Model */

	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setBaseUrl('../3dviewer/assets/');
	mtlLoader.setPath('../3dviewer/assets/');
	//mtlLoader.load('female-croupier-2013-03-26.mtl', function (materials) {
	mtlLoader.load('death.mtl', function (materials) {

		materials.preload();

		//materials.materials.default.map.magFilter = THREE.NearestFilter;
		//materials.materials.default.map.minFilter = THREE.LinearFilter;

		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('../3dviewer/assets/');
		//objLoader.load('death.obj', function (object) {
		objLoader.load(meshes[meshIndex], function (object) {

			object.scale.x = scaleattb;
			object.scale.y = scaleattb;
			object.scale.z = scaleattb;
			scene.add(object);

		});

	});
}

function init() {

	container = document.createElement('div');
	document.body.appendChild(container);

	/* Camera */

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.z = 100;

	recreateScene();

	/* Renderer */

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));

	container.appendChild(renderer.domElement);

	/* Controls */

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = false;

	/* Events */

	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('keydown', onKeyboardEvent, false);

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function onKeyboardEvent(e) {

	//console.log("KEYCODE:", e.code);
	if (e.code === 'ArrowUp')
	{
		/*console.log("UP");
		console.log("Mesh Index:", meshIndex);*/
		if(meshIndex < numMeshes-1)
		{
			meshIndex+=1;
			document.getElementById("p1").innerHTML = meshNames[meshIndex];
			console.log("Current Mesh:", meshNames[meshIndex]);
			recreateScene();
		}
	}
	if (e.code === 'ArrowDown')
	{
		/*console.log("DOWN");
		console.log("Mesh Index:", meshIndex);*/
		if(meshIndex > 0)
		{
			meshIndex-=1;
			document.getElementById("p1").innerHTML = meshNames[meshIndex];
			console.log("Current Mesh:", meshNames[meshIndex]);
			recreateScene();
		}
	}
	if (e.code === 'KeyL')
	{

		lighting = !lighting;

		/*if (lighting) {

			ambient.intensity = 0.25;
			scene.add(keyLight);
			scene.add(fillLight);
			scene.add(backLight);

		} else {

			ambient.intensity = 1.0;
			scene.remove(keyLight);
			scene.remove(fillLight);
			scene.remove(backLight);

		}*/

	}

}

function animate() {

	requestAnimationFrame(animate);

	controls.update();

	render();

}

function render() {

	ambient.intensity = 0.25;
	scene.add(keyLight);
	scene.add(fillLight);
	scene.add(backLight);
	renderer.render(scene, camera);

}