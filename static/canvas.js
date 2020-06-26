let scene
let camera
let renderer
let raycaster
let raycaster2

let pivotOrigin
let sceneObjects = []

var mouse = new THREE.Vector2();
var mousePoints = new THREE.Vector2();
var INTERSECTED;
var INTERSECTEDFACE;
var INTERSECTEDPOINT;

var POINT_COLOR_1 = 0x36daff;
var POINT_COLOR_2 = 0x99ecff;

let rotate = false;

let myCube

var CENTER = [0.0, 0.0, 0.0];
var SIZE = 1;
var SPACING = SIZE/20;

var canvasDiv = $("cubeDiv");
var canvas;

// Plane Properties
var plane_width = 30;
var plane_height = 10;
var plane_width_segs = 1;
var plane_height_segs = 1;
var plane_color = 0xFAF4E5;
var plane_position = {x: 0, y: -2.5, z: 0};

// Lights
var light_am_color = 0xB2B2B2;
var light_spot_color = 0xDDDDDD;
var light_spot_intensity = 0.25;
var light_spot_position = {x: -5, y: 5, z: 5}
var light_spot_position2 = {x: 1, y: 17, z: 20,}
var light_spot_camera_near = 0.5;

$(document).ready(function(){
      init();
})

function init() {
	scene = new THREE.Scene()
	scene.background = new THREE.Color( 0xFAF4E5 );

	pivotOrigin = new THREE.Group();
	pivotOrigin.position.set(0.0,0.0,0.0);

	raycaster = new THREE.Raycaster();
	raycaster2 = new THREE.Raycaster();

	renderer = new THREE.WebGLRenderer({canvas: document.querySelector("canvas")});
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	canvas = renderer.domElement;

	camera = new THREE.PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
	camera.position.y = 0.7
	camera.position.z = 5

	// {
	// 	const color = 0xFFFFFF;
	// 	const intensity = 1;
	// 	const light = new THREE.DirectionalLight(color, intensity);
	// 	light.position.set(-1, 2, 4);
	// 	scene.add(light);
	// }
	// {
	// 	const color = 0xFFFFFF;
	// 	const intensity = 0.75;
	// 	const light = new THREE.AmbientLight(color, intensity);
	// 	// light.position.set(-1, 2, 4);
	// 	scene.add(light);
	// }

	// Add abbient light
	var am_light = new THREE.AmbientLight(light_am_color); // soft white light
	scene.add(am_light);

	// Add directional light
	var spot_light = new THREE.SpotLight(light_spot_color, light_spot_intensity);
	spot_light.position.set(light_spot_position.x, light_spot_position.y, light_spot_position.z);
	spot_light.target = scene;
	spot_light.castShadow = true;
	spot_light.receiveShadow = false;
	spot_light.shadowCameraNear	= light_spot_camera_near;		
	scene.add(spot_light);


	// Add directional light
	var spot_light2 = new THREE.SpotLight(light_spot_color, light_spot_intensity);
	spot_light2.position.set(light_spot_position2.x, light_spot_position2.y, light_spot_position2.z);
	spot_light2.target = scene;
	spot_light2.castShadow = true;
	spot_light2.receiveShadow = false;
	spot_light2.shadowCameraNear	= light_spot_camera_near;		
	scene.add(spot_light2);


	// Add the ground plane
	var plane_geometry = new THREE.PlaneGeometry(plane_width, plane_height, plane_width_segs, plane_height_segs);
	var plane_material = new THREE.MeshLambertMaterial({color: plane_color});
	var plane_mesh = new THREE.Mesh(plane_geometry, plane_material);
	plane_mesh.position.set(plane_position.x, plane_position.y, plane_position.z);
	plane_mesh.receiveShadow = true;
	plane_mesh.rotation.x = -Math.PI/4;
	scene.add(plane_mesh);

	document.body.appendChild(renderer.domElement)

	document.addEventListener("mousedown", mouseDown, false);
	document.addEventListener("mouseup", mouseUp, false);
	document.addEventListener("mouseout", mouseUp, false);
	document.addEventListener("mousemove", mouseMove, false);

	document.addEventListener('keydown', (e) => {
		if (!canRotate)
			return;
		// let key = e.key.toUpperCase();
	  	if (e.keyCode == 32 && !drag) rotate = true;

		showPoints()

	});
	document.addEventListener('keyup', (e) => {
		if (!canRotate)
			return;
		// let key = e.key.toUpperCase();
	  	if (e.keyCode == 32) rotate = false;

	});

	myCube = new Cube(cubeOrientation);

	addRubiksCube()
	animationLoop()
}

function vertexShader() {
  return `
    uniform vec3 uColorArray1;
    uniform vec3 uColorArray2;

    varying vec4 vColor;
    varying vec3 vNormal;
    varying vec4 fragPos;

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
      if(index == 2) return (vec4(0.835,  0.063,  0.063,  1.0)); //red
      if(index == 3) return (vec4(.2745, .725, .584,  1.0)); //green
      if(index == 4) return (vec4(.992, .8, .31,  1.0)); //yellow
      if(index == 5) return (vec4(0.25,  0.063,  0.835,  1.0)); //blue
      if(index == 6) return (vec4(.847,  0.0627,  .6,  1.0)); //purple

      return (vec4(0.5, 0.2, 0.7, 1.0));
    }

    void main(void) {
      fragPos = modelMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * viewMatrix * fragPos;

      vNormal = normalize(normalMatrix * normal);

      if (normal == vec3(0.0,1.0,0.0)){ //top face
        vColor = getColor(int(uColorArray1.x));
      }
      else if (normal == vec3(-1.0,0.0,0.0)){ //Left face
        vColor = getColor(int(uColorArray1.y));
      }
      else if (normal == vec3(0.0,0.0,1.0)){ //front face
        vColor = getColor(int(uColorArray1.z));
      }
      else if (normal == vec3(1.0,0.0,0.0)){ //right face
        vColor = getColor(int(uColorArray2.x));
      }
      else if (normal == vec3(0.0,-1.0,0.0)){ //bottom face
        vColor = getColor(int(uColorArray2.y));
      }
      else if (normal == vec3(0.0,0.0,-1.0)){ //back face
        vColor = getColor(int(uColorArray2.z));
      }
      else
        vColor = vec4(0, 0.9, 0.4, 0);
    }
  `
}

function fragmentShader() {
	return `
    varying vec4 vColor;
    varying vec4 fragPos;
    varying vec3 vNormal;

    void main(void) {

		vec3 u_LightPos = vec3(-5, 5, 5);
		vec3 lightColor = vec3(1, 1, 1);
		
		// Will be used for attenuation.
		float distance = length(u_LightPos - fragPos.xyz);

		// Get a lighting direction vector from the light to the vertex.
		vec3 lightVector = normalize(u_LightPos - fragPos.xyz);

		// Calculate the dot product of the light vector and vertex normal. If the normal and light vector are
		// pointing in the same direction then it will get max illumination.
		float diffuse = max(dot(vNormal, lightVector), 0.0);

		vec3 ambient = 0.65 * lightColor;

		// Add attenuation.
		// diffuse = diffuse * (1.0 / (1.0 + (0.5 * distance * distance)));

		// Multiply the color by the diffuse illumination level to get final output color.
		gl_FragColor = vec4(vColor.rgb * (diffuse*lightColor + ambient), vColor.a);
    }
  `;
}

function addRubiksCube(){
	for (var i = 0; i < 2; i++){
		for (var j = 0; j < 2; j++){
			for (var k = 0; k < 2; k++){
				addCube(
					i, j, k,
					[
					  CENTER[0] + (i*2-1)*(SIZE/2 + SPACING),
					  CENTER[1] + (j*2-1)*(SIZE/2 + SPACING),
					  CENTER[2] + (k*2-1)*(SIZE/2 + SPACING)
					],
					myCube.getColorsCube(i,j,k),
					myCube.getRotation(i,j,k)
				);
			}
		}
	}
	scene.add(pivotOrigin)
}

function addCube(i, j, k, position, colors, rotation) {
  let uniforms = {
        uColorArray1: {type: 'vec3', value: [colors[0], colors[1], colors[2]]},
        uColorArray2: {type: 'vec3', value: [colors[3], colors[4], colors[5]]}
    }

  let geometry = new THREE.BoxGeometry(SIZE, SIZE, SIZE)
  let material =  new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: fragmentShader(),
    vertexShader: vertexShader(),
  })

  let mesh = new THREE.Mesh(geometry, material)

  mesh.position.x = position[0]
  mesh.position.y = position[1]
  mesh.position.z = position[2]

  mesh.name = i + 2*j + 4*k;
  mesh.castShadow = true;
  mesh.receiveShadow = false;

  //add rotation markers
  let pointGeometry = new THREE.SphereGeometry(SIZE/2, 8, 8)
  let pointMaterial = new THREE.MeshLambertMaterial( { color: POINT_COLOR_1} );

  let point1 = new THREE.Mesh(pointGeometry, pointMaterial);
  point1.position.x = position[0] + (i*2-1)*SIZE*2/3
  point1.position.y = position[1]
  point1.position.z = position[2]
  point1.name = "point0"
  point1.visible = false;

  pointMaterial = new THREE.MeshLambertMaterial( { color: POINT_COLOR_1} );
  let point2 = new THREE.Mesh(pointGeometry, pointMaterial);
  point2.position.x = position[0] 
  point2.position.y = position[1] + (j*2-1)*SIZE*2/3
  point2.position.z = position[2]
  point2.name = "point1"
  point2.visible = false;

  pointMaterial = new THREE.MeshLambertMaterial( { color: POINT_COLOR_1} );
  let point3 = new THREE.Mesh(pointGeometry, pointMaterial);
  point3.position.x = position[0] 
  point3.position.y = position[1]
  point3.position.z = position[2] + (k*2-1)*SIZE*2/3
  point3.name = "point2"
  point3.visible = false;

  let cube = new THREE.Group();
  cube.position.set(0.0,0.0,0.0);

  cube.rotation.x = rotation[0];
  cube.rotation.y = rotation[1];
  cube.rotation.z = rotation[2];

  cube.name = i + 2*j + 4*k;
  cube.add(mesh);

  cube.add(point1)
  cube.add(point2)
  cube.add(point3)

  pivotOrigin.add(cube);
  console.log(mesh)

  sceneObjects.push(mesh)
}

function redrawCubes(){
	for (var i = 0; i < 2; i++){
		for (var j = 0; j < 2; j++){
			for (var k = 0; k < 2; k++){
				redrawCube(
					i + 2*j + 4*k,
					myCube.getColorsCube(i,j,k),
					myCube.getRotation(i,j,k)
				);
			}
		}
	}
}

function redrawCube(id, colors, rotation) {
	let uniforms = {
	    uColorArray1: {type: 'vec3', value: [colors[0], colors[1], colors[2]]},
	    uColorArray2: {type: 'vec3', value: [colors[3], colors[4], colors[5]]}
    }

    for(let object of sceneObjects){
    	if(object.name == id){
    		object.material.uniforms.uColorArray1 = {type: 'vec3', value: [colors[0], colors[1], colors[2]]};
    		object.material.uniforms.uColorArray2 = {type: 'vec3', value: [colors[3], colors[4], colors[5]]};
    	}
    }

    let cube = pivotOrigin.getObjectByName(id)

	cube.rotation.x = rotation[0];
	cube.rotation.y = rotation[1];
	cube.rotation.z = rotation[2];
}

var animationRequest;
function animationLoop() {

	resizeCanvasToDisplaySize();

	if(isHomePage)
		animateHomePage()

	redrawCubes()
	render()

	animationRequest = requestAnimationFrame(animationLoop)
}

var THETA = -Math.PI/4;
var PHI = Math.PI/8;
function render() {

	if (!drag) {

		// if(!rotate){
		// 	/*=====Handle Mouse Rotation=====*/
		// 	dX *= AMORTIZATION, dY *=AMORTIZATION;
		// 	THETA+=dX, PHI+=dY;
		// }

		// find intersections
		raycaster.setFromCamera( mouse, camera );

		var intersects = raycaster.intersectObjects( sceneObjects );
		
		var scale = 1.05;
		var scaleM = new THREE.Matrix4();
		scaleM=scaleM.makeScale(scale, scale, scale);

		var scaleMInv = new THREE.Matrix4();
		scaleMInv = scaleMInv.makeScale(1/scale, 1/scale, 1/scale);

		if ( intersects.length > 0 ) {
			if ( INTERSECTEDFACE != intersects[ 0 ].face ) {
				if ( INTERSECTED ){
					INTERSECTED.applyMatrix4(scaleMInv);
					resetPoints()
				}

				INTERSECTED = intersects[ 0 ].object;
				INTERSECTED.applyMatrix4(scaleM);

				INTERSECTEDFACE = intersects[0].face;
				if(rotate)
					showPoints()
			}
		} else {
			if ( INTERSECTED ) 
				INTERSECTED.applyMatrix4(scaleMInv);
			INTERSECTED = null;
			INTERSECTEDFACE = null;
			resetPoints()
		}
	}
	else{
		// console.log("NOT DRAGGING")
		findPointIntersect()
	}
	if(isHomePage){
		pivotOrigin.rotation.x = PHI;
		pivotOrigin.rotation.y = THETA;
	}

	renderer.render( scene, camera );

}

// function onWindowResize() {
// 	camera.aspect = window.innerWidth / window.innerHeight;
// 	camera.updateProjectionMatrix();

// 	renderer.setSize( window.innerWidth, window.innerHeight );
// }

function resizeCanvasToDisplaySize() {
  const canvas = renderer.domElement;
  // look up the size the canvas is being displayed
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // adjust displayBuffer size to match
  if (canvas.width !== width || canvas.height !== height) {
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // update any render target sizes here
  }
}

/*================= Mouse events ======================*/

var isInteractive = true;
var canRotate = true;

var AMORTIZATION = 0.75;
var drag = false;
var old_x, old_y;
var dX = 0, dY = 0;

var mouseDown = function(e) {
	if(!isInteractive)
		return;
	drag = true;
	old_x = e.pageX, old_y = e.pageY;
	e.preventDefault();
	return false;
};

var mouseUp = function(e){
	if(!isInteractive)
		return;
	
	drag = false;

	console.log("MOUES UP")
	rotateAtPoint();

};

var previousMousePosition = {
    x: 0,
    y: 0
};

var mouseMove = function(e) {
	if(!isInteractive){
		mouse.x = 10;
		mouse.y = 10;
		return;
	}

	var deltaMove = {
        x: e.offsetX-previousMousePosition.x,
        y: e.offsetY-previousMousePosition.y
    };

  	if (drag){ //rotation
		dX = (e.pageX-old_x)*2*Math.PI/canvas.clientWidth ,
		dY = (e.pageY-old_y)*2*Math.PI/canvas.clientHeight ;

		if(!rotate){
			// THETA+= dX;
			// PHI+=dY;
			var deltaRotationQuaternion = new THREE.Quaternion()
	            .setFromEuler(new THREE.Euler(
	                dY,
	                dX,
	                0,
	                'XYZ'
	            ));
        
			pivotOrigin.quaternion.multiplyQuaternions(deltaRotationQuaternion, pivotOrigin.quaternion);
		
		}
		
		old_x = e.pageX, old_y = e.pageY;

		
	}
	previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    };

	var rect = canvas.getBoundingClientRect();

	mouse.x = ( (event.clientX - rect.left) / canvas.clientWidth ) * 2 - 1;
	mouse.y = - ( (event.clientY - rect.top)  / canvas.clientHeight ) * 2 + 1;
		
	
	e.preventDefault();
};

function findPointIntersect(){
	//check if ray intersects with either sphere
	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( currVisiblePoints, true);

	if ( intersects.length > 0 ) {
		if ( INTERSECTEDPOINT != intersects[ 0 ].object ) {
			if ( INTERSECTEDPOINT ) INTERSECTEDPOINT.material.emissive.setHex( INTERSECTEDPOINT.currentHex );

			INTERSECTEDPOINT = intersects[ 0 ].object;
			INTERSECTEDPOINT.currentHex = INTERSECTEDPOINT.material.emissive.getHex();
			INTERSECTEDPOINT.material.emissive.setHex( 0xff0000 );
		}
	} else {
		if ( INTERSECTEDPOINT ) INTERSECTEDPOINT.material.emissive.setHex( INTERSECTEDPOINT.currentHex );
		INTERSECTEDPOINT = null;
	}

}

var isHomePage = false;
var time = 0;
function animateHomePage(){
	time += 0.01;
	THETA += 0.05*Math.cos(time)*Math.cos(time);
}

function rotateAtPoint(){
	if(INTERSECTEDPOINT == null || INTERSECTED == null)
		return;

	var normal = INTERSECTEDFACE.normal;
	var pointName = INTERSECTEDPOINT.name;
	if(INTERSECTED.name == 0){
		if(normal.x != 0){
			if(pointName == "point1") rotateBackNeg()
			if(pointName == "point2") rotateBottom()
		}
		if(normal.y != 0){
			if(pointName == "point0") rotateBack()
			if(pointName == "point2") rotateLeftNeg()
		}
		if(normal.z != 0){
			if(pointName == "point0") rotateBottomNeg()
			if(pointName == "point1") rotateLeft()
		}
	}
	if(INTERSECTED.name == 1){
		if(normal.x != 0){
			if(pointName == "point1") rotateBack()
			if(pointName == "point2") rotateBottomNeg()
		}
		if(normal.y != 0){
			if(pointName == "point0") rotateBackNeg()
			if(pointName == "point2") rotateRight()
		}
		if(normal.z != 0){
			if(pointName == "point0") rotateBottom()
			if(pointName == "point1") rotateRightNeg()
		}
	}
	if(INTERSECTED.name == 2){
		if(normal.x != 0){
			if(pointName == "point1") rotateBack()
			if(pointName == "point2") rotateTopNeg()
		}
		if(normal.y != 0){
			if(pointName == "point0") rotateBackNeg()
			if(pointName == "point2") rotateLeft()
		}
		if(normal.z != 0){
			if(pointName == "point0") rotateTop()
			if(pointName == "point1") rotateLeftNeg()
		}
	}
	if(INTERSECTED.name == 3){
		if(normal.x != 0){
			if(pointName == "point1") rotateBackNeg()
			if(pointName == "point2") rotateTop()
		}
		if(normal.y != 0){
			if(pointName == "point0") rotateBack()
			if(pointName == "point2") rotateRightNeg()
		}
		if(normal.z != 0){
			if(pointName == "point0") rotateTopNeg()
			if(pointName == "point1") rotateRight()
		}
	}

	if(INTERSECTED.name == 4){
		if(normal.x != 0){
			if(pointName == "point1") rotateFront()
			if(pointName == "point2") rotateBottomNeg()
		}
		if(normal.y != 0){
			if(pointName == "point0") rotateFrontNeg()
			if(pointName == "point2") rotateLeft()
		}
		if(normal.z != 0){
			if(pointName == "point0") rotateBottom()
			if(pointName == "point1") rotateLeftNeg()
		}
	}
	if(INTERSECTED.name == 5){
		if(normal.x != 0){
			if(pointName == "point1") rotateFrontNeg()
			if(pointName == "point2") rotateBottom()
		}
		if(normal.y != 0){
			if(pointName == "point0") rotateFront()
			if(pointName == "point2") rotateRightNeg()
		}
		if(normal.z != 0){
			if(pointName == "point0") rotateBottomNeg()
			if(pointName == "point1") rotateRight()
		}
	}
	if(INTERSECTED.name == 6){
		if(normal.x != 0){
			if(pointName == "point1") rotateFrontNeg()
			if(pointName == "point2") rotateTop()
		}
		if(normal.y != 0){
			if(pointName == "point0") rotateFront()
			if(pointName == "point2") rotateLeftNeg()
		}
		if(normal.z != 0){
			if(pointName == "point0") rotateTopNeg()
			if(pointName == "point1") rotateLeft()
		}
	}
	if(INTERSECTED.name == 7){
		if(normal.x != 0){
			if(pointName == "point1") rotateFront()
			if(pointName == "point2") rotateTopNeg()
		}
		if(normal.y != 0){
			if(pointName == "point0") rotateFrontNeg()
			if(pointName == "point2") rotateRight()
		}
		if(normal.z != 0){
			if(pointName == "point0") rotateTop()
			if(pointName == "point1") rotateRightNeg()
		}
	}

	setTimeout(checkSolved, rotateSpeed*20+1)
}

function checkSolved(){
	console.log(currStep)
	if(currStep == -1){
		if(myCube.solved()!=-1){
			initSolvedSequence();
		}
	}

	if(currStep == 1)
		if(myCube.whiteSolved()!=-1)
			initSolvedSequence();
	if(currStep == 2){
		console.log(myCube.step2Solved())
		if(myCube.step2Solved()!=-1){
			console.log("SOLVED!")
			initSolvedSequence();
		}
	}
	if(currStep == 3){
		if(myCube.solved()!=-1){
			initSolvedSequence();
		}
	}
		
}

var currCube = null;
var currVisiblePoints = []
function showPoints(){
	if(currCube != null)
		return;

	if(INTERSECTED == null)
		return;

	for(let tmp of pivotOrigin.children){
		if(tmp.name == INTERSECTED.name)
			currCube = tmp;
	}

	var normal = INTERSECTEDFACE.normal;

	if(normal.x != 0){
		currVisiblePoints.push(currCube.getObjectByName("point1"))
		currVisiblePoints.push(currCube.getObjectByName("point2"))

	}
	if(normal.y != 0){
		currVisiblePoints.push(currCube.getObjectByName("point0"))
		currVisiblePoints.push(currCube.getObjectByName("point2"))
	}
	if(normal.z != 0){
		currVisiblePoints.push(currCube.getObjectByName("point1"))
		currVisiblePoints.push(currCube.getObjectByName("point0"))
	}

	for(let obj of currVisiblePoints)
		obj.visible = true;
}

function resetPoints(){
	if(currCube == null)
		return

	currCube.getObjectByName("point0").visible = false;
	currCube.getObjectByName("point1").visible = false;
	currCube.getObjectByName("point2").visible = false;
	currCube = null;
	currVisiblePoints = [];
}


/*=========================================================*/
var rotateSpeed = 20;

var animateId = null;

function shuffleNoAnimation(){
	for(var x = 0; x < 30; x++){
		var ran = Math.floor(Math.random()*12);
		if(ran == 0){
		    myCube.rotateLeft();
		    myCube.rotateLeft();
		    myCube.rotateLeft();
		}
		if(ran == 1)
		    myCube.rotateLeft();
		if(ran == 2){
		    myCube.rotateRight();
		    myCube.rotateRight();
		    myCube.rotateRight();
		}
		if(ran == 3)
		    myCube.rotateRight();
		if(ran == 4){
		    myCube.rotateTop();
		    myCube.rotateTop();
		    myCube.rotateTop();
		}
		if(ran == 5)
		    myCube.rotateTop();
		if(ran == 6){
		    myCube.rotateBottom();
		    myCube.rotateBottom();
		    myCube.rotateBottom();
		}
		if(ran == 7)
		    myCube.rotateBottom();
		if(ran == 8){
		    myCube.rotateBack();
		    myCube.rotateBack();
		    myCube.rotateBack();
		}
		if(ran == 9)
		    myCube.rotateBack();
		if(ran == 10){
		    myCube.rotateFront();
		    myCube.rotateFront();
		    myCube.rotateFront();
		}
		if(ran == 11)
		    myCube.rotateFront();
	}
}

function shuffle(){
	rotateSpeed = 7;
	for(var x = 0; x < 30; x++){
		var ran = Math.floor(Math.random()*12);
		var off = x*rotateSpeed*20+1

		if(ran == 0)
			setTimeout(rotateLeft, off);
		if(ran == 1)
			setTimeout(rotateLeftNeg, off);
		if(ran == 2)
			setTimeout(rotateRight, off);
		if(ran == 3)
			setTimeout(rotateRightNeg, off);
		if(ran == 4)
			setTimeout(rotateTop, off);
		if(ran == 5)
			setTimeout(rotateTopNeg, off);
		if(ran == 6)
			setTimeout(rotateBottom, off);
		if(ran == 7)
			setTimeout(rotateBottomNeg, off);
		if(ran == 8)
			setTimeout(rotateBack, off);
		if(ran == 9)
			setTimeout(rotateBackNeg, off);
		if(ran == 10)
			setTimeout(rotateFront, off);
		if(ran == 11)
			setTimeout(rotateFrontNeg, off);
	}

	setTimeout(resetRotateSpeed, x*rotateSpeed*20+1)
}

function resetRotateSpeed(){
	rotateSpeed = 20;
}

function rotateLeft(){
	if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateLeft, rotateSpeed);
    }
}

function rotateLeftNeg(){
	if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateLeftNeg, rotateSpeed);
    }
}

function rotateTop(){
	if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateTop, rotateSpeed);
    }
}

function rotateTopNeg(){
	if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateTopNeg, rotateSpeed);
    }
}

function rotateFront(){
	if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateFront, rotateSpeed);
    }
}

function rotateFrontNeg(){
	if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateFrontNeg, rotateSpeed);
    }
}

function rotateRight(){
	if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateRight, rotateSpeed);
    }
}

function rotateRightNeg(){
	if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateRightNeg, rotateSpeed);
    }
}

function rotateBottom(){
	if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateBottom, rotateSpeed);
    }
}

function rotateBottomNeg(){
	if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateBottomNeg, rotateSpeed);
    }
}

function rotateBack(){
	if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateBack, rotateSpeed);
    }
}

function rotateBackNeg(){
	if(animateId == null){
      myCube.animating = true;
      animateId = setInterval(animateBackNeg, rotateSpeed);
    }
}

/*=================== Animation Helpers ===================*/

function animateLeft(){
  if(myCube.animating)
    myCube.animateLeft(10, 1);
  else{
    myCube.resetRotation();
    myCube.rotateLeft();
    clearInterval(animateId);
    animateId = null;
  }
}

function animateLeftNeg(){
  if(myCube.animating)
    myCube.animateLeft(10, -1);
  else{
    myCube.resetRotation();
    myCube.rotateLeft();
    myCube.rotateLeft();
    myCube.rotateLeft();
    clearInterval(animateId);
    animateId = null;
  }
}

function animateTop(){
  if(myCube.animating)
    myCube.animateTop(10, 1);
  else{
    myCube.resetRotation();
    myCube.rotateTop();
    clearInterval(animateId);
    animateId = null;
  }
}

function animateTopNeg(){
  if(myCube.animating)
    myCube.animateTop(10, -1);
  else{
    myCube.resetRotation();
    myCube.rotateTop();
    myCube.rotateTop();
    myCube.rotateTop();
    clearInterval(animateId);
    animateId = null;
  }
}

function animateFront(){
  if(myCube.animating)
    myCube.animateFront(10,1);
  else{
    myCube.resetRotation();
    myCube.rotateFront();
    clearInterval(animateId);
    animateId = null;
  }
}

function animateFrontNeg(){
  if(myCube.animating)
    myCube.animateFront(10,-1);
  else{
    myCube.resetRotation();
    myCube.rotateFront();
    myCube.rotateFront();
    myCube.rotateFront();
    clearInterval(animateId);
    animateId = null;
  }
}

function animateRight(){
  if(myCube.animating)
    myCube.animateRight(10,1);
  else{
    myCube.resetRotation();
    myCube.rotateRight();
    clearInterval(animateId);
    animateId = null;
  }
}

function animateRightNeg(){
  if(myCube.animating)
    myCube.animateRight(10,-1);
  else{
    myCube.resetRotation();
    myCube.rotateRight();
    myCube.rotateRight();
    myCube.rotateRight();
    clearInterval(animateId);
    animateId = null;
  }
}

function animateBottom(){
  if(myCube.animating)
    myCube.animateBottom(10,1);
  else{
    myCube.resetRotation();
    myCube.rotateBottom();
    clearInterval(animateId);
    animateId = null;
  }
}

function animateBottomNeg(){
  if(myCube.animating)
    myCube.animateBottom(10,-1);
  else{
    myCube.resetRotation();
    myCube.rotateBottom();
    myCube.rotateBottom();
    myCube.rotateBottom();
    clearInterval(animateId);
    animateId = null;
  }
}

function animateBack(){
  if(myCube.animating)
    myCube.animateBack(10,1);
  else{
    myCube.resetRotation();
    myCube.rotateBack();
    clearInterval(animateId);
    animateId = null;
  }
}

function animateBackNeg(){
  if(myCube.animating)
    myCube.animateBack(10,-1);
  else{
    myCube.resetRotation();
    myCube.rotateBack();
    myCube.rotateBack();
    myCube.rotateBack();
    clearInterval(animateId);
    animateId = null;
  }
}



