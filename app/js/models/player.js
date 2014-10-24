/**
 * Creates a new PlayerCharacter object ready to add to the scene.
 * @constructor
 * @classdesc A wrapper for the various mesh objects that comprise the player
 *     character model and its associated logic. Extends {@link external THREE:Object3D}.
 * @params Creation parameters
 */
var PlayerCharacter = function () {
  THREE.Object3D.call(this);
  this.level = 0;
  this.layers = [];
  this.baseRing = new THREE.Mesh(new THREE.RingGeometry3D(15, 13, 5, 36, 2, 3), randomMaterial('r'));
  this.baseRingSplit = new THREE.Mesh(new THREE.RingGeometry3D(15, 13, 5, 36, 2, 3, 0, 16*Math.PI/9), randomMaterial('r'));
  this.layers[0] = new THREE.Object3D();
  this.layers[0].add(this.baseRing);
  this.layers[1] = new THREE.Mesh(new THREE.RingGeometry3D(20, 18, 6, 36, 2, 3, 0, 14*Math.PI/9), new randomMaterial('r'));
  this.layers[2] = new THREE.Mesh(new THREE.RingGeometry3D(25, 23, 4, 42, 2, 3, 0, 4*Math.PI/9), new randomMaterial('r'));
  this.layers[3] = new THREE.Mesh(new THREE.RingGeometry3D(30, 28, 8, 56, 2, 3, 0, 10*Math.PI/9), new randomMaterial('r'));
  this.layers[4] = new THREE.Mesh(new THREE.RingGeometry3D(35, 33, 5, 62, 2, 3, 0, 8*Math.PI/9), new randomMaterial('r'));
  this.layers[5] = new THREE.RingArray(38);
  this.layers[6] = new THREE.RingArray(45);
  this.layers[7] = new THREE.RingArray(52);
  this.layers[7].rotation = 2*Math.PI/13;
  this.add(this.layers[0]);
};

PlayerCharacter.prototype = Object.create(THREE.Object3D.prototype);
PlayerCharacter.prototype.constructor = PlayerCharacter;

PlayerCharacter.prototype.levelUp = function(){
  this.level++;
  if (this.level === 1){
    this.layers[0].remove(this.baseRing);
    this.layers[0].add(this.baseRingSplit);
    this.add(this.layers[1]);
    return this.level;
  }
  if (this.level < 5){
    this.add(this.layers[this.level]);
    return this.level;
  }
  if (this.level === 5){
    this.add(this.layers[5]);
    this.layers[5].add(new THREE.Mesh(new THREE.BoxGeometry(2,2,2,2,2,2), randomMaterial('g')));
    return this.level;
  }
  if (this.level < 25){
    this.layers[5].add(new THREE.Mesh(new THREE.BoxGeometry(2,2,2,2,2,2), randomMaterial('g')));
    return this.level;
  }
  if (this.level === 25){
    this.add(this.layers[6]);
    this.layers[6].add(new THREE.Mesh(new THREE.BoxGeometry(8,2,4,4,2,3), randomMaterial('b')));
    return this.level;
  }
  if (this.level < 38){
    this.layers[6].add(new THREE.Mesh(new THREE.BoxGeometry(8,2,4,4,2,3), randomMaterial('b')));
    return this.level
  }
  if (this.level === 38){
    this.add(this.layers[7]);
    this.layers[7].add(new THREE.Mesh(new THREE.BoxGeometry(4,8,2,4,3,2), randomMaterial()));
    return this.level;
  }
  if (this.level < 51){
    this.layers[7].add(new THREE.Mesh(new THREE.BoxGeometry(4,8,2,4,3,2), randomMaterial()));
    return this.level;
  }
};

PlayerCharacter.prototype.levelDown = function(){
  this.level--;
  if (this.level > 37){
    this.layers[7].remove(this.layers[7].children[this.layers[7].children.length - 1]);
    return this.level;
  }
  if (this.level === 37){
    this.layers[7].remove(this.layers[7].children[this.layers[7].children.length - 1]);
    this.remove(this.layers[7]);
    return this.level;
  }
  if (this.level > 24){
    this.layers[6].remove(this.layers[6].children[this.layers[6].children.length - 1]);
    return this.level;
  }
  if (this.level === 24){
    this.layers[6].remove(this.layers[6].children[this.layers[6].children.length - 1]);
    this.remove(this.layers[6]);
    return this.level;
  }
  if (this.level > 4){
    this.layers[5].remove(this.layers[5].children[this.layers[5].children.length - 1]);
    return this.level;
  }
  if (this.level === 4){
    this.layers[5].remove(this.layers[5].children[this.layers[5].children.length - 1]);
    this.remove(this.layers[5]);
    return this.level;
  }
  if (this.level > 0){
    this.remove(this.layers[this.level + 1]);
    return this.level
  }
  if (this.level === 0){
    this.layers[0].remove(this.baseRingSplit);
    this.layers[0].add(this.baseRing);
    this.remove(this.layers[1]);
    return this.level;
  }
  if (this.level < 0){
    this.remove(this.layers[0]);
    alert('Game over');
  }
};

PlayerCharacter.prototype.animate = function(){
  this.layers[0].rotation.z -= 0.01;
  this.layers[1].rotation.z += 0.03;
  this.layers[2].rotation.z -= 0.02;
  this.layers[3].rotation.z += 0.015;
  this.layers[4].rotation.z -= 0.04;
  this.layers[5].rotation.z += 0.05;
  this.layers[6].rotation.z -= 0.005;
  this.layers[7].rotation.z -= 0.005;
};

PlayerCharacter.prototype.effectiveRadius = function(){
  if (this.level < 5) return this.layers[this.level].parameters.outerRadius;
  if (this.level < 25) return this.layers[5].radius + 1;
  if (this.level < 38) return this.layers[6].radius + 4;
  if (this.level < 51) return this.layers[7].radius + 4;
};


var randomMaterial = function(color){
  var r = [0xFF4911, 0xE8260C, 0xFF0000, 0xE80C63, 0xFF0DCE];
  var g = [0x11FF7E, 0x0CE83E, 0x00FF00, 0x49E80C, 0x95FF0D];
  var b = [0x7911FF, 0x3C0CE8, 0x0000FF, 0x0C3BE8, 0x0D74FF];
  if (color === 'r'){
    color = r[Math.floor(Math.random() * r.length)];
  } else if (color === 'g'){
    color = g[Math.floor(Math.random() * g.length)];
  } else if (color === 'b'){
    color = b[Math.floor(Math.random() * b.length)];
  } else {
    color = [r,g,b][Math.floor(Math.random() * 3)][Math.floor(Math.random() * 5)];
  }
  var mat = new THREE.MeshLambertMaterial({color: color, transparent: true, opacity: 0.5});
  mat.castShadow = true;
  mat.receiveShadow = true;

  return mat;
};



