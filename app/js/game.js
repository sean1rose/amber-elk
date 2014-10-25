// mouse controls
document.onmousemove = function (e) {mousePos(e);};
var mouseX = 0;
var mouseY = 0;
function mousePos (e) {
	mouseX = e.pageX; 
	mouseY = e.pageY;
	player.position.set((mouseX-window.innerWidth/2)*.25, .25*(-(mouseY-window.innerHeight/2)), player.position.z)
	return true;
}

// creating the scene. 
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapEnabled = true;
document.body.appendChild(renderer.domElement);
var scene = new THREE.Scene();

// setting the player
var player = new PlayerCharacter();
scene.add(player);
player.position.set(0,0,500);

//setting the camera
var camera = new THREE.PerspectiveCamera (35, window.innerWidth / window.innerHeight, 5, 5000);
camera.position.set(player.position.x, player.position.y, player.position.z*1.7);
camera.lookAt(scene.position);

// background particle settings
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
  }
  return particle;
};

for (var p = 0; p < particleCount; p++){
  particles.vertices.push(makeParticle());
}
var particleMaterial = new THREE.ParticleBasicMaterial({color: 0xffffff, size: 2, blending: THREE.AdditiveBlending, transparent: true});
var particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
particleSystem.sortParticles = true;
scene.add(particleSystem);

// creating targets
var Cube = function(hexColor, edgeLength) {
  var x = .15*((Math.random() * window.innerWidth) - (window.innerWidth / 2));
  var y = .15*((Math.random() * window.innerHeight) - (window.innerHeight / 2));
  var z = Math.random() * camera.position.z - 1000;  
  var e = edgeLength || Math.random()*2 + 1.5;
  cube = new THREE.Mesh(new THREE.BoxGeometry(e, e, e), new THREE.MeshLambertMaterial({ color : hexColor || 0x2BF149 }) );
  cube.radius = e;
  cube.overdraw = true;
  scene.add( cube );
  cube.position.set(x, y, z);
  cube.castShadow = true;
  return cube;
}
var cubeCount = 15;
var makeCubes = function(){
  var cubes = [];
	for (var i = 0; i<cubeCount; i++){
  	cubes.push(new Cube(0x2BF149)) // green
	}
  return cubes
}
var cubes = makeCubes();

// creating enemies
var enemyCount = 7;
var makeEnemies = function(){
  var enemies = [];
  for( var i = 0; i < enemyCount; i++ ){
    var x = new Cube(0x50D8F4, 10); //blue
    enemies.push(x)
  }
  return enemies;
}
var enemies = makeEnemies();
console.log(enemies)

// setting the floor
var floor = new THREE.Mesh(new THREE.BoxGeometry(800, 3, 3000), new THREE.MeshLambertMaterial({ color : 0x91FF9E }) );
floor.position.set(0, -150, -500);
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
floorLight.target = player;
floorLight.position.set(0, 500, player.position.z);
scene.add( floorLight );

// collision logic
var checkCollision = function(obj) { // returns boolean
  var dx = player.position.x - obj.position.x;
  var dy = player.position.y - obj.position.y;
  var distance = Math.sqrt( Math.pow(dx, 2) + Math.pow(dy, 2) );
  if (distance < 15 && obj.active !== false) { //COLLISION with target
    obj.active = false;
    return true;
  } else {
    return false
  }
}

var collision = function(obj){
  console.log('collision');
  cubes.push( new Cube() );
  scene.remove(obj);
  player.levelUp();
}

// update functions
var updateTargets = function(){
  for (var s = 0; s < cubes.length; s++) {
    if( cubes[s].position.z > (player.position.z - cubes[s].radius) && cubes[s].position.z < (player.position.z + cubes[s].radius)) {
      if( checkCollision(cubes[s]) ){
        collision(cubes[s]);
      }
    }
    if( cubes[s].position.z > player.position.z+(camera.position.z - player.position.z)/4) {
      cubes[s].position.z = -710;
      cubes[s].position.x = .15*((Math.random() * window.innerWidth) - (window.innerWidth / 2));
      cubes[s].position.y = .15*((Math.random() * window.innerWidth) - (window.innerWidth / 2));
    }

    cubes[s].position.z += Math.random()+2;
  };
}
var updateEnemies = function(){
  for (var e = 0; e < enemyCount; e++){
    if( enemies[e].position.z > (player.position.z - enemies[e].radius) && enemies[e].position.z < (player.position.z + enemies[e].radius)) {
      if( checkCollision(enemies[e]) ){
        player.levelDown();
        console.log('Level Down!')
      }
    }
    if( enemies[e].position.z > player.position.z+(camera.position.z - player.position.z)/4) {
      enemies[e].position.z = -710;
      enemies[e].position.x = .15*((Math.random() * window.innerWidth) - (window.innerWidth / 2));
      enemies[e].position.y = .15*((Math.random() * window.innerWidth) - (window.innerWidth / 2));
      enemies[e].active = true;
    }
    enemies[e].position.z += 3;
    enemies[e].rotation.y += Math.random()*.02;
    enemies[e].rotation.x += Math.random()*.02;
  }
}

// general animation update
var update = function(){
  particleSystem.rotation.z += 0.001;
  particleSystem.geometry.__dirtyVertices = true;
  updateTargets();
  updateEnemies();

  player.animate();
  renderer.render(scene, camera);
  requestAnimationFrame(update);
};

update();