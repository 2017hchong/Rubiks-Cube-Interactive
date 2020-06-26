
var cubeRotation = 0.0;
var myCube;

var rotateSpeed = 20;

var animateId = null;
var canvas = null;

$(document).ready(function(){
      main();
})


$(document).ready(function(){
  $("#testX0").click(function(){
    if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateLeft, rotateSpeed);
    }
  })
})
$(document).ready(function(){
  $("#testY1").click(function(){
    if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateTop, rotateSpeed);
    }
  })
})

$(document).ready(function(){
  $("#testFront").click(function(){
    if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateFront, rotateSpeed);
    }
  })
})

$(document).ready(function(){
  $("#testRight").click(function(){
    if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateRight, rotateSpeed);
    }
  })
})

$(document).ready(function(){
  $("#testBottom").click(function(){
    if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateBottom, rotateSpeed);
    }
  })
})

$(document).ready(function(){
  $("#testBack").click(function(){
    if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateBack, rotateSpeed);
    }
  })
})

/*=================== Animations ===================*/

function animateLeft(){
  if(myCube.animating)
    myCube.animateLeft(10);
  else{
    myCube.resetRotation();
    myCube.rotateLeft();
    clearInterval(animateId);
    animateId = null;
  }
}

function animateTop(){
  if(myCube.animating)
    myCube.animateTop(10);
  else{
    myCube.resetRotation();
    myCube.rotateTop();
    clearInterval(animateId);
    animateId = null;
  }
}

function animateFront(){
  if(myCube.animating)
    myCube.animateFront(10);
  else{
    myCube.resetRotation();
    myCube.rotateFront();
    clearInterval(animateId);
    animateId = null;
  }
}

function animateRight(){
  if(myCube.animating)
    myCube.animateRight(10);
  else{
    myCube.resetRotation();
    myCube.rotateRight();
    clearInterval(animateId);
    animateId = null;
  }
}

function animateBottom(){
  if(myCube.animating)
    myCube.animateBottom(10);
  else{
    myCube.resetRotation();
    myCube.rotateBottom();
    clearInterval(animateId);
    animateId = null;
  }
}

function animateBack(){
  if(myCube.animating)
    myCube.animateBack(10);
  else{
    myCube.resetRotation();
    myCube.rotateBack();
    clearInterval(animateId);
    animateId = null;
  }
}

/*=================== WebGL Drawings ===================*/
function main() {
  myCube = new Cube();
  canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    canvas.addEventListener("mouseout", mouseUp, false);
    canvas.addEventListener("mousemove", mouseMove, false);

  const vsSource = `
    precision highp float;
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    // attribute vec4 aVertexColor;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;

    uniform vec3 uColorArray1;
    uniform vec3 uColorArray2;

    varying lowp vec4 vColor;
    varying lowp vec4 vNormal;
    varying lowp vec4 fragPos;

    vec4 getColor(in int index){

      vec4 white = vec4(1.0,  1.0,  1.0,  1.0);
      vec4 red = vec4(1.0,  0.0,  0.0,  1.0);
      vec4 green = vec4(0.0,  1.0,  0.0,  1.0);
      vec4 blue = vec4(0.0,  0.0,  1.0,  1.0);
      vec4 yellow = vec4(1.0,  1.0,  0.0,  1.0);
      vec4 purple = vec4(1.0,  0.0,  1.0,  1.0);
      vec4 black = vec4(0.0, 0.0, 0.0, 1.0);

      if(index == 0) return (vec4(0.0, 0.0, 0.0, 1.0)); //black
      if(index == 1) return (vec4(1.0,  1.0,  1.0,  1.0)); //white
      if(index == 2) return (vec4(1.0,  0.0,  0.0,  1.0)); //red
      if(index == 3) return (vec4(0.0,  1.0,  0.0,  1.0)); //green
      if(index == 4) return (vec4(1.0,  1.0,  0.0,  1.0)); //yellow
      if(index == 5) return (vec4(0.0,  0.0,  1.0,  1.0)); //blue
      if(index == 6) return (vec4(1.0,  0.0,  1.0,  1.0)); //purple

      return (vec4(0.5, 0.2, 0.7, 1.0));
    }

    void main(void) {
      fragPos = uModelMatrix * aVertexPosition;
      gl_Position = uProjectionMatrix * uViewMatrix * fragPos;

      vNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      if (aVertexNormal == vec3(0.0,1.0,0.0)){ //top face
        vColor = getColor(int(uColorArray1.x));
      }
      else if (aVertexNormal == vec3(-1.0,0.0,0.0)){ //Left face
        vColor = getColor(int(uColorArray1.y));
      }
      else if (aVertexNormal == vec3(0.0,0.0,1.0)){ //front face
        vColor = getColor(int(uColorArray1.z));
      }
      else if (aVertexNormal == vec3(1.0,0.0,0.0)){ //right face
        vColor = getColor(int(uColorArray2.x));
      }
      else if (aVertexNormal == vec3(0.0,-1.0,0.0)){ //bottom face
        vColor = getColor(int(uColorArray2.y));
      }
      else if (aVertexNormal == vec3(0.0,0.0,-1.0)){ //back face
        vColor = getColor(int(uColorArray2.z));
      }
      else
        vColor = vec4(0, 0.9, 0.4, 0);
    }
  `;

  // Fragment shader program
  const fsSource = `
    precision highp float;
    varying vec4 vColor;
    varying vec4 fragPos;
    varying vec4 vNormal;

    void main(void) {
      // Apply lighting effect

      vec3 lightColor = vec3(1, 1, 1);
      vec3 lightPos = vec3(5, 5, 5);

      vec3 ambient = 0.45 * lightColor;
      vec3 lightDir = normalize(lightPos - fragPos.xyz);

      float directional = max(dot(vNormal.xyz, lightDir), 0.0);
      vec3 vLighting = ambient + (lightColor * directional);

      gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVertexNormal, aTextureCoord,
  // and look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      // vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelMatrix: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
      viewMatrix: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
      uColorArray1: gl.getUniformLocation(shaderProgram, 'uColorArray1'),
      uColorArray2: gl.getUniformLocation(shaderProgram, 'uColorArray2'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl);

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, buffers, deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
function initBuffers(gl) {

  // Create a buffer for the cube's vertex positions.

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the cube.

  const positions = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Set up the normals for the vertices, so that we can compute lighting.

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  const vertexNormals = [
    // Front
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

    // Back
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

    // Top
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

    // Bottom
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

    // Right
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    // Left
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
                gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.
  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];

  // Now send the element array to GL
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    normal: normalBuffer,
    // color: colorBuffer,
    indices: indexBuffer,
  };
}

var THETA = 0;
var PHI = 0;

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, deltaTime) {
  gl.clearColor(0.6, 0.2, 0.2, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.
  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  const camPosition = [0,0,-3];

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  const viewMatrix = mat4.create();
  mat4.translate(viewMatrix,
                viewMatrix,
                camPosition);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the normals from
  // the normal buffer into the vertexNormal attribute.
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexNormal);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.viewMatrix,
      false,
      viewMatrix);

  /*=====Handle Mouse Rotation=====*/
  if (!drag) {
    dX *= AMORTIZATION, dY *=AMORTIZATION;
    THETA+=dX, PHI+=dY;
  }
  
  var CENTER = [0.0, 0.0, 0.0];
  var SIZE = 0.2;
  var SPACING = SIZE/20;
  var colorArray = [1, 2, 3, 4, 5, 6];
  for (var i = 0; i < 2; i++){
    for (var j = 0; j < 2; j++){
      for (var k = 0; k < 2; k++){
        drawCube(gl, programInfo, 
        [
          CENTER[0] + (i*2-1)*(SIZE + SPACING),
          CENTER[1] + (j*2-1)*(SIZE + SPACING),
          CENTER[2] + (k*2-1)*(SIZE + SPACING)
        ], 
        SIZE, projectionMatrix, 
        myCube.getColorsCube(i, j, k), 
        myCube.getRotation(i,j,k));
      }
    }
  }

  // Update the rotation for the next draw
  cubeRotation += deltaTime;
}

function drawCube(gl, programInfo, position, size, 
  projectionMatrix, colorArray, myCubeRotation){
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.     


  //Mouse movement rotations
  mat4.rotate(modelMatrix,  // destination matrix
              modelMatrix,  // matrix to rotate
              PHI,     // amount to rotate in radians
              [1, 0, 0]); 
  mat4.rotate(modelMatrix,  // destination matrix
              modelMatrix,  // matrix to rotate
              THETA,     // amount to rotate in radians
              [0, 1, 0]); 


  mat4.rotate(modelMatrix,  // destination matrix
              modelMatrix,  // matrix to rotate
              myCubeRotation[0],     // amount to rotate in radians
              [1.0, 0, 0]);
  mat4.rotate(modelMatrix,  // destination matrix
              modelMatrix,  // matrix to rotate
              myCubeRotation[1],     // amount to rotate in radians
              [0, 1, 0]); 
  mat4.rotate(modelMatrix,  // destination matrix
              modelMatrix,  // matrix to rotate
              myCubeRotation[2],     // amount to rotate in radians
              [0, 0, 1]); 

  mat4.translate(modelMatrix,     // destination matrix
                 modelMatrix,     // matrix to translate
                 position);  // amount to translate
  mat4.scale(modelMatrix,     // destination matrix
                 modelMatrix,     // matrix to translate
                 [size, size, size]);  // amount to scale

  

  const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelMatrix);
  mat4.transpose(normalMatrix, normalMatrix);

  var colorArray1 = [colorArray[0], colorArray[1], colorArray[2]];
  // console.log(colorArray1)
  var colorArray2 = [colorArray[3], colorArray[4], colorArray[5]];
  // console.log(colorArray2)
  // Set the shader uniforms
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelMatrix,
      false,
      modelMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.normalMatrix,
      false,
      normalMatrix);
  gl.uniform3fv(
      programInfo.uniformLocations.uColorArray1,
      colorArray1
      );
  gl.uniform3fv(
      programInfo.uniformLocations.uColorArray2,
      colorArray2
      );

  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/*================= Mouse events ======================*/

var AMORTIZATION = 0.75;
var drag = false;
var old_x, old_y;
var dX = 0, dY = 0;

var mouseDown = function(e) {
  drag = true;
  old_x = e.pageX, old_y = e.pageY;
  e.preventDefault();
  return false;
};

var mouseUp = function(e){
  drag = false;
};

var mouseMove = function(e) {
  if (!drag) return false;
  dX = (e.pageX-old_x)*2*Math.PI/canvas.width,
  dY = (e.pageY-old_y)*2*Math.PI/canvas.height;
  THETA+= dX;
  PHI+=dY;
  old_x = e.pageX, old_y = e.pageY;
  e.preventDefault();
};


