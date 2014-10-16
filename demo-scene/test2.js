






var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera (90, window.innerWidth / window.innerHeight, 5, 1300);
camera.position.set(0,0,200);
camera.lookAt(scene.position);

var geometry = new THREE.RingGeometry(10, 15, 32);
var material = new THREE.MeshLambertMaterial({color: 0xff0000, transparent: true, opacity: 0.5});
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
mesh.position.set(0,0,100);

var particleCount = 300;
var particles = new THREE.Geometry();

var makeCubeAtOrigin = function(){
  var cubeGeometry = new THREE.BoxGeometry(3,5,1);
  var cubeMaterial = new THREE.MeshBasicMaterial( { color: 'blue' } );
  var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
  scene.add( cube );
  cube.position.set(0,0,0)
}();
// makeCubeAtOrigin();

var makeParticle = function(particle){
  var px = (Math.random() * window.innerWidth) - (window.innerWidth / 2);
  var py = (Math.random() * window.innerHeight) - (window.innerHeight / 2);
  var pz = -200;
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
    particle.velocity = new THREE.Vector3(vx, vy, vz);
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

var light = new THREE.HemisphereLight(0xfcfcfc, 0xfcfcfc, 0.99);
light.position.set(0,0,230);
scene.add(light);

var update = function(){
  particleSystem.rotation.z += 0.005;
  var pCount = particleCount;
  while (pCount--){
    var particle = particles.vertices[pCount];
    if (particle.z > camera.position.z || particle.y > window.innerHeight/2 || particle.y < -window.innerHeight/2 || particle.x > window.innerWidth/2 || particle.x < -window.innerWidth/2){
      makeParticle(particle);
    }
    particle.add(particle.velocity);
  }
  particleSystem.geometry.__dirtyVertices = true;
  renderer.render(scene, camera);
  requestAnimationFrame(update);
};

update();