
var lights = [];
var meshes = [];
var geometries = [];
var materials = [];
var i;

var render = function() {
  renderer.render(scene, camera);
};

var animate = function(){
  requestAnimationFrame(animate);
  meshes[0].rotation.z += 0.02;
  meshes[1].rotation.z += 0.03;
  meshes[2].rotation.z += 0.05;
  ring.rotation.z += 0.07;
  render();
};

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMapEnabled = true;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera (90, window.innerWidth / window.innerHeight, 5, 1300);
var controls = new THREE.OrbitControls(camera);
var floorGeometry = new THREE.PlaneGeometry(500,500,10,10);
var floorMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
var ring = new THREE.RingArray(25,true);
floor.receiveShadow = true;
floor.position.set(0,0,-10);


geometries.push(new THREE.RingGeometry3D(20,18,2,60,2,3,0,2*Math.PI *0.8));
geometries.push(new THREE.RingGeometry3D(15,13,2,45,2,3,2*Math.PI*0.4, 2*Math.PI*0.15));
geometries.push(new THREE.RingGeometry3D(10,8,2,30,2,3,2*Math.PI*0.6, 2*Math.PI*0.45));

var cubes = [];
for (i = 0; i < 10; i++){
  cubes.push(new THREE.Mesh(new THREE.CubeGeometry(2,2,2,2,2,2), new THREE.MeshPhongMaterial({color: 0x00ff00})));
  cubes[i].castShadow = true;
  cubes[i].receiveShadow = true;
}


for (i = 0; i < geometries.length; i++){
  materials.push(new THREE.MeshPhongMaterial({color: 0xff0000}));
  meshes.push(new THREE.Mesh(geometries[i], materials[i]));
  meshes[i].castShadow = true;
  meshes[i].receiveShadow = true;
}

lights.push(new THREE.SpotLight(0xffffff,1,300,45,1));
lights.push(new THREE.SpotLight(0xffffff,1,300,45,1));
lights.push(new THREE.SpotLight(0xffffff,1,300,45,1));
for (i = 0; i < lights.length; i++){
  lights[i].castShadow = true;
  lights[i].shadowDarkness = 0.5;
}
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.set(0,0,100);
camera.lookAt(scene.position);
lights[0].position.set(-100,100,100);
lights[1].position.set(100,100,100);
lights[2].position.set(100,-100,100);
//lights[3].position.set(-100,-100,100);
controls.addEventListener('change', render);
scene.add(floor);
scene.add(ring);
for (i = 0; i < meshes.length; i++){
  scene.add(meshes[i]);
}
for (i = 0; i < lights.length; i++){
  scene.add(lights[i]);
}



render();
animate();

