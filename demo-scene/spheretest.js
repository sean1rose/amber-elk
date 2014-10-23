// creating the scene. 
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMapEnabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var scene = new THREE.Scene();

// setting a cube to show the origin
var makeCubeAtOrigin = function(){
  var cubeGeometry = new THREE.BoxGeometry(3,5,1);
  var cubeMaterial = new THREE.MeshBasicMaterial( { color: 'blue' } );
  var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
  scene.add( cube );
  cube.position.set(0,0,0)
}();

// var ambientLight = new THREE.AmbientLight(000080);
// scene.add(ambientLight);


// setting the player
var createPlayer = function(innerRadius, outerRadius, x, y, z){
  x ? x = x : x = 0;
  y ? y = y : y = 0;
  z ? z = z : z = 200;
  var innerRadius = innerRadius || 10;
  var outerRadius = outerRadius || 15;
  var geometry = new THREE.RingGeometry(innerRadius, outerRadius, 18);
  var material = new THREE.MeshLambertMaterial({color: 0xD1FF00, transparent: true, opacity: 0.9});
  var player = new THREE.Mesh(geometry, material);
  player.radius = outerRadius;
  player.position.set(0,0,200);
  return player
}
var player = createPlayer(10, 15);
scene.add( player );

// //lighting
var light = new THREE.DirectionalLight(000080, 000080, 0.99);
light.position.set(-900,900,230);
light.intensity = .1;
scene.add(light);

var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.intensity = .7
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

var playerLight = new THREE.SpotLight( 0xffffff );
playerLight.position.set( 50, 90, 1000 );
scene.add( playerLight );


/*var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 50, 90, 200 );
spotLight.castShadow = true;

spotLight.shadowCameraVisible = true;
var d = 200;

spotLight.shadowCameraLeft = -d;
spotLight.shadowCameraRight = d;
spotLight.shadowCameraTop = d;
spotLight.shadowCameraBottom = -d;

spotLight.shadowMapWidth = 512;
spotLight.shadowMapHeight = 512;
spotLight.shadowCameraNear = 1;
spotLight.shadowCameraFar = 4000;
// spotLight.shadowCameraFov = 30;
scene.add( spotLight );*/

//setting the ground
var floor;
var geometry = new THREE.BoxGeometry( 900, 10, 100000 );
var material = new THREE.MeshLambertMaterial( {color: 0x0FF00} );
floor = new THREE.Mesh( geometry, material );
floor.position.set(0, -100, -300)
floor.receiveShadow = true;
scene.add( floor );

//setting the camera
var camera = new THREE.PerspectiveCamera (50, window.innerWidth / window.innerHeight, 5, 2800);
camera.position.set(player.position.x, 50, player.position.z*2);
camera.lookAt(scene.position);

var random = function(){ return Math.random() * 100 -50;}

// particle settings
var particleCount = 300;
var particles = new THREE.Geometry();

// defining random (x,y,z) and vx, vy, returning particle
var makeParticle = function(particle){
  var px = (Math.random() * window.innerWidth) - (window.innerWidth / 2);
  var py = (Math.random() * window.innerHeight) - (window.innerHeight / 2);
  var pz = -500;
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
  return particle;
};

for (var p = 0; p < particleCount; p++){
  particles.vertices.push(makeParticle());
}
var particleMaterial = new THREE.ParticleBasicMaterial({color: 0xffffff, size: 2, blending: THREE.AdditiveBlending, transparent: true});
var particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
particleSystem.sortParticles = true;
scene.add(particleSystem);

var sphereCount = 20;
var Sphere = function(min, max) {
  var sx = .15*((Math.random() * window.innerWidth) - (window.innerWidth / 2));
  var sy = .15*((Math.random() * window.innerHeight) - (window.innerHeight / 2));
  var sz = (Math.random() * player.position.z) - player.position.z;  
  var r = Math.random()*max;
  var edge1 = Math.random()*5 + 5;
  var edge2 = Math.random()*5 + 5;
  sphere = new THREE.Mesh(new THREE.SphereGeometry(r, edge1, edge2), new THREE.MeshLambertMaterial({color: 0x0aeedf}));
  sphere.overdraw = true;
  scene.add(sphere);
  sphere.position.set(sx, sy, sz);
  sphere.radius = r;
  return sphere;
}
var makeSpheres = function(){
  var spheres = [];
	for (var i = 0; i<sphereCount; i++){
		spheres.push(new Sphere(3, 10))
	}
  return spheres
}
var spheres = makeSpheres();

// calculate distance between player and enemy
var findDistance = function(obj1, obj2) {
  var dx = obj1.position.x - obj2.position.x;
  var dy = obj1.position.y - obj2.position.y;
  return Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2))
}

var checkCollision = function(s){
  if( spheres[s].position.z > (player.position.z - spheres[s].radius) && spheres[s].position.z < (player.position.z + spheres[s].radius) ){ //check each enemy's position against the players position
    // console.log(spheres[s].position.z)
  // console.log(player.position.z)
    var d = findDistance(player, spheres[s])
    if(d < player.radius){
      console.log('Player radius ++!!!!')
      console.log
    }
  }
}

var update = function(){
  var timer = Date.now() * 0.0002;
  particleSystem.rotation.z += 0.001;
  particleSystem.geometry.__dirtyVertices = true;
  for (var s = 0; s < spheres.length; s++) {
    checkCollision(s);
  	if( spheres[s].position.z > player.position.z+75) {
  		spheres[s].position.z = -750;
  	}
  	spheres[s].position.z += 2;
  };
  renderer.render(scene, camera);
  requestAnimationFrame(update);
};

update();