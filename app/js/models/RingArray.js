/**
 * Created by tom on 10/21/14.
 */

/**
 * Creates a new RingArray with the specified radius.
 * @param radius
 * @constructor
 * @augments THREE.Object3D
 * @classdesc A self-balancing ring-shaped array of THREE.Object3D or THREE.Mesh objects.
 */
THREE.RingArray = function(radius){
  THREE.Object3D.call(this);
  this.radius = radius;
};

THREE.RingArray.prototype = Object.create(THREE.Object3D.prototype);
THREE.RingArray.prototype.constructor = THREE.RingArray;

/**
 * Rebalance the array; used internally, no need to call directly
 */
THREE.RingArray.prototype.rebalance = function(){
  for (var i = 0; i < this.children.length; i++){
    this.children[i].position.set(this.radius * Math.cos(i * 2 * Math.PI / this.children.length), this.radius * Math.sin(i * 2 * Math.PI / this.children.length), 0);
  }
};

/**
 * Add an object or objects to the ring array
 * @param {(...THREE.Object3D | ...THREE.Mesh | THREE.Object3D[] | THREE.Mesh[])} obj
 */
THREE.RingArray.prototype.add = function(obj){
  if (arguments.length > 1) {
    THREE.Object3D.prototype.add.apply(this, arguments);
  } else if (Array.isArray(obj)){
    THREE.Object3D.prototype.add.apply(this, obj);
  } else {
    THREE.Object3D.prototype.add.call(this, obj);
  }
  this.rebalance();
};
//
THREE.RingArray.prototype.remove = function(obj){
  if (arguments.length > 1) {
    THREE.Object3D.prototype.remove.apply(this, arguments);
  } else if (Array.isArray(obj)){
    THREE.Object3D.prototype.remove.apply(this, obj);
  } else {
    THREE.Object3D.prototype.remove.call(this, obj);
  }
  this.rebalance();
};
