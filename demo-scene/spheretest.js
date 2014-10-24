// creating the scene. 
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapEnabled = true;
document.body.appendChild(renderer.domElement);
var scene = new THREE.Scene();

// setting the player
var geometry = new THREE.RingGeometry(10, 15, 18);
var material = new THREE.MeshLambertMaterial({color: 0x1BC32F, transparent: true, opacity: 0.9});
var player = new THREE.Mesh(geometry, material);
player.radius = 15;
scene.add(player);
player.position.set(0,0,500);


// setting a cube to show the origin
var makeCubeAtOrigin = function(){
  var oCubeGeometry = new THREE.BoxGeometry(3,5,1);
  var oCubeMaterial = new THREE.MeshLambertMaterial( { color: 0xEC752A } );
  var oCube = new THREE.Mesh( oCubeGeometry, oCubeMaterial );
  scene.add( oCube );
  oCube.position.set(0,0,0)
}();

//setting the camera
var camera = new THREE.PerspectiveCamera (35, window.innerWidth / window.innerHeight, 5, 5000);
camera.position.set(player.position.x, player.position.y, player.position.z*1.7);
camera.lookAt(scene.position);

var cubeCount = 20;

// particle settings
var particleCount = 300;
var particles = new THREE.Geometry();

var makeParticle = function(particle){
  var px = (Math.random() * window.innerWidth) - (window.innerWidth / 2);
  var py = (Math.random() * window.innerHeight) - (window.innerHeight / 2);
  var pz = 0;
  var vx = Math.random();
  var vy = Math.random();
  var vz = 4 + Math.random();
  if (particle){
    particle.x = px;
    particle.y = py;
    particle.z = pz;
    particle.velocity.x = vx;
    particle.velocity.y = vy;
    particle.velocity.z = vz;
  } else {
    particle = new THREE.Vector3(px, py, pz);
    // particle.velocity = new THREE.Vector3(vx, vy, vz);
  }
  return particle; //background star elements
};

for (var p = 0; p < particleCount; p++){
  particles.vertices.push(makeParticle());
}
var particleMaterial = new THREE.ParticleBasicMaterial({color: 0xffffff, size: 2, blending: THREE.AdditiveBlending, transparent: true});
var particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
// var particleSystemNeon = new THREE.ParticleSystem(particles, particleMaterial);
particleSystem.sortParticles = true;
scene.add(particleSystem);
// scene.add(particleSystemNeon);

var Cube = function(hexColor) {
  var sx = .15*((Math.random() * window.innerWidth) - (window.innerWidth / 2));
  var sy = .15*((Math.random() * window.innerHeight) - (window.innerHeight / 2));
  var sz = Math.random() * camera.position.z - 1000;  
  var r = Math.random()*2 + 1.5;
  cube = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshLambertMaterial({ color : hexColor }) );
  cube.radius = r
  cube.overdraw = true;
  scene.add( cube );
  cube.position.set(sx, sy, sz);
  cube.castShadow = true;
  return cube;
}
var makeCubes = function(){
  var cubes = [];
	for (var i = 0; i<cubeCount; i++){
    if(i < cubeCount/2){
  		cubes.push(new Cube(0x2BF149)) // green
    } else {
      cubes.push(new Cube(0x50D8F4)) // blue
    }

	}
  return cubes
}
var cubes = makeCubes();

// floor
var floor = new THREE.Mesh(new THREE.BoxGeometry(400, 3, 3000), new THREE.MeshLambertMaterial({ color : 0x361379 }) );
floor.position.set(0, -300, -500);
floor.receiveShadow = true;
scene.add( floor )

//lighting
var light = new THREE.HemisphereLight(0xEC752A, 0x505AF4, 0.9);
scene.add(light);

var floorLight = new THREE.SpotLight(0xF4F6B1); // bright yellow/white
floorLight.castShadow = true;
floorLight.shadowDarkness = 0.5;
floorLight.shadowMapWidth = 1024;
floorLight.shadowMapHeight = 1024;
floorLight.shadowCameraNear = 1;
floorLight.shadowCameraFar = 1000;
floorLight.target = floor;
floorLight.position.set(0, 500, (player.position.z / 2) );
var floorLightHelper = new THREE.SpotLightHelper( floorLight, 10 )
scene.add( floorLight );
scene.add(floorLightHelper);

var checkCollision = function(s) {
  var dx = player.position.x - cubes[s].position.x;
  var dy = player.position.y - cubes[s].position.y;
  var distance = Math.sqrt( Math.pow(dx, 2) + Math.pow(dy, 2) );
  console.log(distance, player.radius)
  if (distance < player.radius && cubes[s].active !== false) {
    console.log('collision');
    cubes[s].active = false;
  }
}

// var ambientLight = new THREE.AmbientLight(000080);
// scene.add(ambientLight);

var update = function(){
  particleSystem.rotation.z += 0.001;
  particleSystem.geometry.__dirtyVertices = true;
  for (var s = 0; s < cubes.length; s++) {
    if( cubes[s].position.z > (player.position.z - cubes[s].radius) && cubes[s].position.z < (player.position.z + cubes[s].radius)) {
      checkCollision(s)
    }
  	if( cubes[s].position.z > player.position.z+(camera.position.z - player.position.z)/2) {
  		cubes[s].position.z = -710;
      cubes[s].position.x = .15*((Math.random() * window.innerWidth) - (window.innerWidth / 2));
      cubes[s].position.y = .15*((Math.random() * window.innerWidth) - (window.innerWidth / 2));
  	}
  	cubes[s].position.z += 2;
  };
  renderer.render(scene, camera);
  requestAnimationFrame(update);
};

update();