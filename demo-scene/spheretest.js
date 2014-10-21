// creating the scene. 
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var scene = new THREE.Scene();

// setting the player
var geometry = new THREE.RingGeometry(10, 15, 18);
var material = new THREE.MeshLambertMaterial({color: 0xff0000, transparent: true, opacity: 0.9});
var player = new THREE.Mesh(geometry, material);
scene.add(player);
player.position.set(0,0,500);


// setting a cube to show the origin
var makeCubeAtOrigin = function(){
  var cubeGeometry = new THREE.BoxGeometry(3,5,1);
  var cubeMaterial = new THREE.MeshBasicMaterial( { color: 'blue' } );
  var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
  scene.add( cube );
  cube.position.set(0,0,0)
}();

//setting the camera
var camera = new THREE.PerspectiveCamera (50, window.innerWidth / window.innerHeight, 5, 1000);
camera.position.set(player.position.x, player.position.y, player.position.z*1.3);
camera.lookAt(scene.position);




var sphereCount = 20;
var random = function(){ return Math.random() * 100 -50;}

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
  return particle;
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

var Sphere = function() {
  var sx = .15*((Math.random() * window.innerWidth) - (window.innerWidth / 2));
  var sy = .15*((Math.random() * window.innerHeight) - (window.innerHeight / 2));
  var sz = Math.random() * 500 - 1000;  
  var r = Math.random()*2 + 1.5;
  var edge1 = Math.random()*5 + 5;
  var edge2 = Math.random()*5 + 5;
  sphere = new THREE.Mesh(new THREE.SphereGeometry(r, edge1, edge2), new THREE.MeshNormalMaterial());
  sphere.overdraw = true;
  scene.add(sphere);
  sphere.position.set(sx, sy, sz)
  return sphere;
}
var makeSpheres = function(){
  var spheres = [];
	for (var i = 0; i<sphereCount; i++){
		spheres.push(new Sphere())
	}
  return spheres
}
var spheres = makeSpheres();

var ambientLight = new THREE.AmbientLight(000080);
scene.add(ambientLight);

// var light = new THREE.HemisphereLight(000080, 000080, 0.99);
// light.position.set(0,0,230);
// scene.add(light);


var update = function(){
  particleSystem.rotation.z += 0.001;
  // particleSystemNeon.rotation.z += 0.8;
  var pCount = particleCount
  // while (pCount--){
  //   var particle = particles.vertices[pCount];
  //   if (particle.z > camera.position.z || particle.y > window.innerHeight/2 || particle.y < -window.innerHeight/2 || particle.x > window.innerWidth/2 || particle.x < -window.innerWidth/2){
  //     makeParticle(particle);
  //   }
  //   particle.add(particle.velocity);
  // }
  particleSystem.geometry.__dirtyVertices = true;
  for (var s = 0; s < spheres.length; s++) {
  	if( spheres[s].position.z > camera.position.z) {
  		spheres[s].position.z = -710;
  	}
  	spheres[s].position.z += 2;
  };
  renderer.render(scene, camera);
  requestAnimationFrame(update);
};

update();