/**
 * Created by tom on 10/16/14.
 */

/**
 * Creates a new 3D ring geometry.
 * @param {Object} params An object containing the parameters
 * @param {number} [params.outerRadius=50] Outer radius; r_outer > 0
 * @param {number} [params.innerRadius=25] Inner radius r_outer > r_inner > 0;
 * @param {number} [params.height=10] Ring Height; h > 0
 * @param {number} [params.thetaSegments=8] Theta segments; n_θ > 2; must be an integer
 * @param {number} [params.phiSegments=8] Phi segments; n_φ > 0; must be an integer
 * @param {number} [params.heightSegments=3] Height segments; n_h > 0; must be an integer
 * @param {number} [params.thetaStart=0] Angle of start of first theta segment; 0 ≤ θ < 2π
 * @param {number} [params.thetaLength=2.Math.PI] Arc length of the ring; 0 ≤ l_θ < 2π
 * @constructor
 * @augments THREE.Geometry
 * @classdesc Geometry object for a 3D ring.
 */
THREE.RingGeometry3D = function (params) {

  /**
   * Creates a new vector from provided parameters
   * @param x
   * @param y
   * @param z
   * @returns {THREE.Vector3}
   */
  var nVector = function (x, y, z) {
    return new THREE.Vector3(x, y, z);
  };

  /**
   * Adds faces for ends of ring
   * @param zNormal
   */
  var endFaces = function () {
    var thetaIndex, phiIndex, heightIndex;
    var v1, v2, v3, v4;
    var endSize = (params.thetaSegments + (closed ? 0 : 1)) * (params.phiSegments + 1);
    var midSize = (params.thetaSegments + (closed ? 0 : 1)) * 2 + (closed ? 0 : (2 * (params.phiSegments - 1)));
    var offset = endSize + midSize * (params.heightSegments - 1);

    for (heightIndex = 0; heightIndex <= params.heightSegments; heightIndex += params.heightSegments) {
      for (phiIndex = 0; phiIndex < params.phiSegments; phiIndex++) {
        for (thetaIndex = 0; thetaIndex < params.thetaSegments; thetaIndex++) {
          v1 = (heightIndex === 0 ? 0 : offset) + thetaIndex + phiIndex * (params.thetaSegments + (closed ? 0 : 1));
          v2 = v1 + (params.thetaSegments + (closed ? 0 : 1));
          v3 = (heightIndex === 0 ? 0 : offset) + (closed ? (thetaIndex + 1) % params.thetaSegments : thetaIndex + 1) + phiIndex * (params.thetaSegments + (closed ? 0 : 1));
          v4 = v3 + (params.thetaSegments + (closed ? 0 : 1));
          if (heightIndex === 0) {
            this.faces.push(new THREE.Face3(v1, v3, v4, [nVector(0, 0, 1), nVector(0, 0, 1), nVector(0, 0, 1)]));
            this.faceVertexUvs[0].push([uvs[v1].clone(), uvs[v3].clone(), uvs[v4].clone()]);
            this.faces.push(new THREE.Face3(v4, v2, v1, [nVector(0,0,1),nVector(0,0,1),nVector(0,0,1)]));
            this.faceVertexUvs[0].push([uvs[v4].clone(), uvs[v2].clone(), uvs[v1].clone()]);
          } else {
            this.faces.push(new THREE.Face3(v1, v2, v4, [nVector(0, 0, 1), nVector(0, 0, 1), nVector(0, 0, 1)]));
            this.faceVertexUvs[0].push([uvs[v1].clone(), uvs[v2].clone(), uvs[v4].clone()]);
            this.faces.push(new THREE.Face3(v4, v3, v1, [nVector(0,0,1),nVector(0,0,1),nVector(0,0,1)]));
            this.faceVertexUvs[0].push([uvs[v4].clone(), uvs[v3].clone(), uvs[v1].clone()]);
          }
        }
      }
    }
  }.bind(this);

  var getWalls = function(){
    var ret = {};
    var i = -1;
    for (var heightIndex = 0; heightIndex <= params.heightSegments; heightIndex++){
      for (var phiIndex = 0; phiIndex <= params.phiSegments; phiIndex++){
        for (var thetaIndex = 0; thetaIndex < params.thetaSegments + (closed ? 0 : 1); thetaIndex++) {
          if (heightIndex === 0 || heightIndex === params.heightSegments
            || phiIndex === 0 || phiIndex === params.phiSegments
            || ((!closed) && heightIndex !== 0
            && heightIndex !== params.heightSegments && ( thetaIndex === 0 || thetaIndex === params.thetaSegments))) {
            i++;
          }
          if (heightIndex === 0) {
            ret.bottom ? ret.bottom.push(i) : ret.bottom = [i];
          }
          if (heightIndex === params.heightSegments){
            ret.top ? ret.top.push(i) : ret.top = [i];
          }
          if (phiIndex === 0) {
            ret.inner ? ret.inner.push(i) : ret.inner = [i];
          }
          if (phiIndex === params.phiSegments){
            ret.outer ? ret.outer.push(i) : ret.outer = [i];
          }
          if (!closed){
            if (thetaIndex === 0){
              ret.start ? ret.start.push(i) : ret.start = [i];
            }
            if (thetaIndex === params.thetaSegments){
              ret.end ? ret.end.push(i) : ret.end = [i]
            }
          }
        }
      }
    }
    return ret;
  };


  var wallFaces = function () {

    var inner = getWalls().inner;
    var thetaIndex;
    for (var i = 0; i < inner.length - (params.thetaSegments + (closed ? 0 : 1)); i++){
      for (var thetaIndex = 0; thetaIndex < params.thetaSegments + (closed ? 0 : 1); thetaIndex++) {
        v1 = inner[i];
        v2 = inner[i + params.thetaSegments + (closed ? 0 : 1)];
        v3 = inner[closed ? (i + 1) % params.thetaSegments : i + 1];
        v4 = inner[closed ? (i + 1) % params.thetaSegments + params.thetaSegments : i + 2 + params.thetaSegments];
      }
    }


    var na, nb, thetaIndex, phiIndex, heightIndex, phiBase, phiComponent, offset, nextOffset;
    var v1, v2, v3, v4, n1, n2, n3, n4;
    for (thetaIndex = 0; thetaIndex < params.thetaSegments + (closed ? 0 : 1); thetaIndex++) {
      na = this.vertices[thetaIndex].clone();
      nb = this.vertices[closed ? (thetaIndex + 1) % params.thetaSegments : thetaIndex + 1];
      for (phiIndex = 0; phiIndex <= params.phiSegments; phiIndex += params.phiSegments) {
        if (phiIndex === 0 || phiIndex === params.phiSegments) {
          phiBase = (params.thetaSegments + (closed ? 0 : 1)) * (params.phiSegments + 1);
          phiComponent = phiIndex * (params.thetaSegments + (closed ? 0 : 1));
          for (heightIndex = 0; heightIndex < params.heightSegments; heightIndex++) {
            offset = (heightIndex > 0 ? phiBase : 0) + phiComponent + (heightIndex * (phiIndex - 1)) + (heightIndex * (params.thetaSegments + (closed ? 0 : 1)));
            nextOffset = (heightIndex + 1 > 0 ? phiBase : 0) + phiComponent + ((heightIndex + 1) * (phiIndex - 1)) + ((heightIndex + 1) * (params.thetaSegments + (closed ? 0 : 1)));
            v1 = offset + thetaIndex;
            v2 = offset + (closed ? (thetaIndex + 1) % params.thetaSegments : thetaIndex + 1);
            v3 = nextOffset + thetaIndex;
            v4 = nextOffset + (closed ? (thetaIndex + 1) % params.thetaSegments : thetaIndex + 1);
            n1 = na.clone();
            n2 = nb.clone();
            n3 = na.clone();
            n4 = nb.clone();
            if (phiIndex === 0) {
              this.faces.push(new THREE.Face3(v1, v2, v3, [n1, n2, n3]));
              this.faceVertexUvs[0].push([uvs[v1].clone(), uvs[v2].clone(), uvs[v3].clone()]);
              this.faces.push(new THREE.Face3(v2, v3, v4, [n2, n3, n4]));
              this.faceVertexUvs[0].push([uvs[v2].clone(), uvs[v3].clone(), uvs[v4].clone()]);
            } else {
              this.faces.push(new THREE.Face3(v3, v2, v1, [n3, n2, n1]));
              this.faceVertexUvs[0].push([uvs[v3].clone(), uvs[v2].clone(), uvs[v1].clone()]);
              this.faces.push(new THREE.Face3(v4, v3, v2, [n4, n3, n2]));
              this.faceVertexUvs[0].push([uvs[v4].clone(), uvs[v3].clone(), uvs[v2].clone()]);

            }
          }
        }
      }
    }
  }.bind(this);

  THREE.Geometry.call(this);
  _.defaults(params, {
    innerRadius: 25,
    outerRadius: 50,
    height: 10,
    thetaSegments: 8,
    phiSegments: 8,
    heightSegments: 3,
    thetaStart: 0,
    thetaLength: Math.PI * 2
  });
  params.innerRadius = Math.max(0.001, params.innerRadius);
  params.innerRadius = Math.min(params.outerRadius - 0.001, params.innerRadius);
  params.thetaSegments = Math.max(3, params.thetaSegments);
  params.phiSegments = Math.max(1, params.phiSegments);
  params.heightSegments = Math.max(1, params.heightSegments);
  params.thetaStart %= 2 * Math.PI;
  params.thetaLength = Math.min(Math.PI * 2, params.thetaLength);
  this.parameters = _.clone(params);

  var closed = params.thetaLength === Math.PI * 2;

  var uvs = [];

  // make vertices
  var heightIndex, phiIndex, thetaIndex;
  var heightStart = -(params.height / 2);
  var heightStep = params.height / params.heightSegments;
  var phiStep = (params.outerRadius - params.innerRadius) / params.phiSegments;
  var thetaStep = params.thetaLength / params.thetaSegments;
  for (heightIndex = 0; heightIndex <= params.heightSegments; heightIndex++) {
    for (phiIndex = 0; phiIndex <= params.phiSegments; phiIndex++) {
      for (thetaIndex = 0; thetaIndex < params.thetaSegments + (closed ? 0 : 1); thetaIndex++) {
        if (heightIndex === 0 || heightIndex === params.heightSegments
          || phiIndex === 0 || phiIndex === params.phiSegments
          || ((!closed) && heightIndex !== 0
          && heightIndex !== params.heightSegments && ( thetaIndex === 0 || thetaIndex === params.thetaSegments))) {
          var vertex = new THREE.Vector3();
          var segment = params.thetaStart + (thetaIndex * thetaStep);
          vertex.x = (params.innerRadius + (phiIndex * phiStep)) * Math.cos(segment);
          vertex.y = (params.innerRadius + (phiIndex * phiStep)) * Math.sin(segment);
          vertex.z = heightStart + (heightIndex * heightStep);
          this.vertices.push(vertex);
          uvs.push(new THREE.Vector2((vertex.x / params.outerRadius + 1) / 2, (vertex.y / params.outerRadius + 1) / 2));
        }
      }
    }
  }


  // add back faces
  endFaces(-1);

  // add front faces
  endFaces(1);

  // add inner faces
  wallFaces();


  /*

   inner faces: [0 ... thetaSegments], [thetaSegments * phiSegments ...

   */
  this.computeFaceNormals()


};

THREE.RingGeometry3D.prototype = Object.create(THREE.Geometry.prototype);
