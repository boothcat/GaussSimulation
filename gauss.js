var canvas;
var gl;

var ShellProgram;
var VectorProgram;
var GaussProgram;
var MapProgram;

var MouseDown = false;
var LastMouseX;
var LastMouseY;
var Left, Middle, Right;
var Perspective;
var NowView = 0;
var SaveScale = 1.25;
var SaveScaleGauss = 0.;

// Matrix global variables
var MvMatrix = mat4.create( );
var PMatrix  = mat4.create( );
var ModelMatrix = mat4.create( );
var NormalMatrix = mat4.create( );
var vectorNormalMatrix = mat4.create( );
var gaussNormalMatrix = mat4.create ( );
var TransMatrix = mat4.create( );
var RotMatrix = mat4.create( ); 
var ScaleMatrix = mat4.create ( );

// For sphere shaders
var MvLoc;
var PLoc;
var TLoc;
var NLoc;

// For vector shaders
var MvLocv;
var PLocv;
var NLocv;
var transLocv;
var rotLocv;

// For gauss shaders
var MvLocg;
var PLocg;
var TLocg;
var NLocg;
var scaleLocg;

// For Map shaders
var MvLocm;
var PLocm;
var TLocm;
var NLocm;

// Lighting global variables
var uKaLocation;
var uKdLocation;
var uShininess;

var uKaLocationv;
var uKdLocationv;
var uShininessv;

var uKaLocationg;
var uKdLocationg;
var uShininessg;

var uKaLocationm;
var uKdLocationm;
var uShininessm;

// Texture Global Variables
var InnerMetalTexture
var OuterMetalTexture;
var GaussTexture;

// Array global variables
// Outer Shell
var NumPoints_outer;
var VertexArray_outer;
var TexArray_outer;
var NormArray_outer;

var vertexBufferId_outer;
var texBufferId_outer;
var normBufferId_outer;

var vLoc_outer;
var tLoc_outer;
var nLoc_outer;

// Inner Shell
var NumPoints_inner;
var VertexArray_inner;
var TexArray_inner;
var NormArray_inner;

var vertexBufferId_inner;
var texBufferId_inner;
var normBufferId_inner;

var vLoc_inner;
var tLoc_inner;
var nLoc_inner;

// Bottom Half Shell
var NumPoints_bottom;
var VertexArray_bottom;
var TexArray_bottom;
var NormArray_bottom;

var vertexBufferId_bottom;
var texBufferId_bottom;
var normBufferId_bottom;

var vLoc_bottom;
var tLoc_bottom;
var nLoc_bottom;

// Top Half Shell
var NumPoints_top;
var VertexArray_top;
var TexArray_top;
var NormArray_top;

var vertexBufferId_top;
var texBufferId_top;
var normBufferId_top;

var vLoc_top;
var tLoc_top;
var nLoc_top;

// Positive Vector
var NumPoints_pos;
var VertexArray_pos;
var NormArray_pos;

var vertexBufferId_pos;
var normBufferId_pos;

var vLoc_pos;
var nLoc_pos;

// Negative Vector
var NumPoints_neg;
var VertexArray_neg;
var NormArray_neg;

var vertexBufferId_neg;
var normBufferId_neg;

var vLoc_neg;
var nLoc_neg;

// Gauss Sphere
var NumPoints_g;
var VertexArray_g;
var NormArray_g;

var vertexBufferId_g;
var texBufferId_g;
var normBufferId_g;

var vLoc_g;
var tLoc_g;
var nLoc_g;

// Grid
var NumPoints_grid;
var VertexArray_grid;
var NormArray_grid;

var vertexBufferId_grid;
var normBufferId_grid;

var vLoc_grid;
var nLoc_grid;

var NumPoints;

// Charge and Electric Field and Physics variables
var chargeLocation;
var chargeLocationv;
var outerChargeLocation;
var innerChargeLocation;

var innerCharge = 0;
var outerCharge = 0;
var EVector;
var PI = Math.PI;

var surfaceArea=0;
var enclosedCharge=0;
var electricField =0;
var electricPotential=0;

window.onload = InitGraphics;	// function to call first


function InitGraphics( )
{
	canvas = document.getElementById( "gl-canvas" );
	
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl )
	{
		alert( "WebGL isn't available" );
	}

	canvas.onmousedown   = HandleMouseDown;
	document.onmouseup   = HandleMouseUp;
	document.onmousemove = HandleMouseMove;


	// set globals:

	Perspective = true;
	mat4.identity( ModelMatrix );


	//  load shaders:
	ShellProgram = InitShaders( gl, "shell-vertex-shader", "shell-fragment-shader" );
	VectorProgram = InitShaders( gl, "vector-vertex-shader", "vector-fragment-shader");
	GaussProgram = InitShaders(gl, "gauss-vertex-shader", "gauss-fragment-shader");
	MapProgram = InitShaders(gl, "map-vertex-shader", "map-fragment-shader");

	// For Shell Shaders
	MvLoc = gl.getUniformLocation( ShellProgram, "uModelViewMatrix" );
	CheckError( "mvLoc " );
	PLoc  = gl.getUniformLocation( ShellProgram, "uProjectionMatrix" );
	CheckError( "PLoc " );
	TLoc  = gl.getUniformLocation( ShellProgram, "uTexture" );
	CheckError( "TLoc " );
	NLoc = gl.getUniformLocation(ShellProgram, "uNormalMatrix");
	CheckError("NLoc");

	// Set up location for uCharge variable in shader
	chargeLocation = gl.getUniformLocation(ShellProgram, "uCharge");

	// Set up lighting for Shell Shaders
	uKaLocation = gl.getUniformLocation(ShellProgram, "uKa");
	uKdLocation = gl.getUniformLocation(ShellProgram, "uKd");
	uShininess = gl.getUniformLocation(ShellProgram, "uShininess");
	
	// Vector variable locations for shaders
	MvLocv = gl.getUniformLocation( VectorProgram, "uModelViewMatrix" );
	CheckError( "MvLocv " );
	PLocv  = gl.getUniformLocation( VectorProgram, "uProjectionMatrix" );
	CheckError( "PLocv " );
	NLocv = gl.getUniformLocation(VectorProgram, "uNormalMatrix");
	CheckError("NLocv");
	transLocv = gl.getUniformLocation(VectorProgram, "uTransMatrix");
	rotLocv = gl.getUniformLocation(VectorProgram, "uRotateMatrix");

	chargeLocationv = gl.getUniformLocation(VectorProgram, "uCharge");


	// Set up lighting for Vertex Shaders
	uKaLocationv = gl.getUniformLocation(VectorProgram, "uKa");
	uKdLocationv = gl.getUniformLocation(VectorProgram, "uKd");
	uShininessv = gl.getUniformLocation(VectorProgram, "uShininess");

	// Gauss variable locations for shaders
	MvLocg = gl.getUniformLocation( GaussProgram, "uModelViewMatrix" );
	CheckError( "MvLocg " );
	PLocg  = gl.getUniformLocation( GaussProgram, "uProjectionMatrix" );
	CheckError( "PLocg " );
	NLocg = gl.getUniformLocation(GaussProgram, "uNormalMatrix");
	CheckError("NLocg");
	TLocg  = gl.getUniformLocation( GaussProgram, "uTexture" );
	CheckError( "TLocg " );
	scaleLocg = gl.getUniformLocation(GaussProgram, "uScaleMatrix");
	CheckError("scaleLocg");

	// Set up lighting for Gauss Shaders
	uKaLocationg = gl.getUniformLocation(GaussProgram, "uKa");
	uKdLocationg = gl.getUniformLocation(GaussProgram, "uKd");
	uShininessg = gl.getUniformLocation(GaussProgram, "uShininess");

	// Map variable locations for shaders
	MvLocm = gl.getUniformLocation( MapProgram, "uModelViewMatrix" );
	CheckError( "MvLocm " );
	PLocm  = gl.getUniformLocation( MapProgram, "uProjectionMatrix" );
	CheckError( "PLocm " );
	NLocm = gl.getUniformLocation(MapProgram, "uNormalMatrix");
	CheckError("NLocm");

	outerChargeLocation = gl.getUniformLocation(MapProgram, "uOuterCharge");
	innerChargeLocation = gl.getUniformLocation(MapProgram, "uInnerCharge");


	// Set up lighting for Map Shaders
	uKaLocationm = gl.getUniformLocation(MapProgram, "uKa");
	uKdLocationm = gl.getUniformLocation(MapProgram, "uKd");
	uShininessm = gl.getUniformLocation(MapProgram, "uShininess");


	// setup the texture:

	InnerMetalTexture = gl.createTexture( );
	InnerMetalTexture.image = new Image( );
	InnerMetalTexture.image.onload = function( )
		{
			HandleLoadedTexture( InnerMetalTexture );
		}

	InnerMetalTexture.image.src = "metal_bright.png";
	CheckError( "Texture src " );
	
	OuterMetalTexture = gl.createTexture( );
	OuterMetalTexture.image = new Image( );
	OuterMetalTexture.image.onload = function( )
		{
			HandleLoadedTexture( OuterMetalTexture );
		}

	OuterMetalTexture.image.src = "metal_surface.png";
	CheckError( "Texture src " );

	GaussTexture = gl.createTexture( );
	GaussTexture.image = new Image( );
	GaussTexture.image.onload = function( )
		{
			HandleLoadedTexture( GaussTexture );
		}

	GaussTexture.image.src = "yellow_glass.png";
	CheckError( "Texture src " );

	// Set up arrays
	InitOuterShellData();
	InitInnerShellData();
	InitBottomHalfData();
	InitTopHalfData();
	InitVectorDataPos();
	InitVectorDataNeg();
	InitGridData();
	InitGaussSphereData();

	// setup ui:

	var b1 = document.getElementById( "InnerButton" );
	b1.addEventListener( "click", function( ) { NowView =  0; Display(); }, false );

	var b2 = document.getElementById( "OuterButton" )
	b2.addEventListener( "click", function( ) { NowView = 1; Display(); }, false );

	var b3 = document.getElementById( "ExplodedButton" )
	b3.addEventListener( "click", function( ) { NowView = 2; Display(); }, false );

	var b4 = document.getElementById( "PotentialMap" )
	b4.addEventListener( "click", function( ) { NowView = 3; Display(); }, false );

	$( "#innerSpinner" ).spinner({
		min: -4,
		max: 4,
		step: 1,
	}).val(0);

	$( "#innerSpinner" ).on( "spin", function( event, ui ) {
		innerCharge = ui.value;
		Display();	
	});

	
	$( "#outerSpinner" ).spinner({
		min: -4,
		max: 4,
		step: 1,
	}).val(0);

	$( "#outerSpinner" ).on( "spin", function( event, ui ) {
		outerCharge = ui.value;
		Display();	
	});


	$(document).on('change', 'input[type="checkbox"]', function() {
    if ($(this).is(':checked')) {
      EVector = 1;
	  Display();
    } else {
      EVector = 0;
	  Display();
    }
  });

  $(function() {
  $("#gaussSlider").slider({
    slide: function(event, ui) {
		radius = ui.value/10
      $("#gaussSlider-value").text(radius.toFixed(3));
    }
  });
});


	Animate( );
}


function Animate( )
{
	//var date = new Date( );
	//var time = date.getTime( );
	//var timeDiff = time - lastTime;
	//var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;

	requestAnimFrame( Animate );
	Display();
}


function Display()
{
	// Calculate physics variables to display
	PhysicsCalculations()

	// Set up background and canvas
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.enable( gl.DEPTH_TEST );

	// projection matrix:
	PMatrix = mat4.perspective(60., 1., 0.1, 100.0);

	// read the scaling slider:
	var s = $( "#slider" ).slider( "value" );
	if( s != SaveScale )
	{
		var newScaleMatrix = mat4.create( );
		mat4.identity( newScaleMatrix );
		var s2 = s / SaveScale;
		mat4.scale( newScaleMatrix, [ s2, s2, s2 ] );
		mat4.multiply( newScaleMatrix, ModelMatrix, ModelMatrix );
		SaveScale = s;
	}

	// modelview matrix:
	mat4.identity( MvMatrix );
	if (NowView ===3){
		let eye = [3, 5, 6];
		let center = [0, 0, 0];
		let up = [0, 1, 0];
		mat4.lookAt(eye, center, up, MvMatrix);
	}
	else {
		let eye = [3, -1, 6];
		let center = [0, 0, 0];
		let up = [0, 1, 0];
		mat4.lookAt(eye, center, up, MvMatrix);
	}
	mat4.multiply( MvMatrix, ModelMatrix );		// modeling

	// Transform Normals for non-transformed spheres
	mat4.inverse(ModelMatrix, NormalMatrix);           //Not sure if this should be ModelMatrix or MvMatrix?      
	mat4.transpose(NormalMatrix, NormalMatrix);

	// Use Shell Shader ShellProgram
	gl.useProgram(ShellProgram);

	// set shader variables
	gl.uniformMatrix4fv( MvLoc, false, MvMatrix );
	gl.uniformMatrix4fv( PLoc,  false, PMatrix );
	gl.uniformMatrix4fv( NLoc, false, NormalMatrix);

	// lighting variables
	gl.uniform1f(uKaLocation, 0.2);
	gl.uniform1f(uKdLocation, 0.4);
	gl.uniform1f(uShininess, 0.4);	
	
	// set up texture
	gl.activeTexture( gl.TEXTURE6 );
	gl.uniform1i( TLoc, 6 );

	if (NowView === 0) {
		// Draw Inner Shell
		gl.bindTexture( gl.TEXTURE_2D, InnerMetalTexture );
		gl.uniform1f(chargeLocation, innerCharge);
		DrawInnerShell( );
	}
	else if (NowView === 1) {
		// Draw Outer Shell
		gl.bindTexture( gl.TEXTURE_2D, OuterMetalTexture );
		gl.uniform1f(chargeLocation, outerCharge);
		DrawOuterShell( );
	}
	else if (NowView === 2) {
		// Outer Top and Bottom Shell
		gl.bindTexture( gl.TEXTURE_2D, OuterMetalTexture );
		gl.uniform1f(chargeLocation, outerCharge);
		DrawBottomHalf( );
		DrawTopHalf( );

		// Inner Shell
		gl.bindTexture( gl.TEXTURE_2D, InnerMetalTexture );
		gl.uniform1f(chargeLocation, innerCharge);
		DrawInnerShell( );
	}
	else if (NowView === 3) {

		// Draw Outer Wire Shell
		gl.bindTexture( gl.TEXTURE_2D, OuterMetalTexture );
		gl.uniform1f(chargeLocation, outerCharge);
		DrawOuterWire( );
		
		// Draw Inner Wire Shell
		gl.bindTexture( gl.TEXTURE_2D, InnerMetalTexture );
		gl.uniform1f(chargeLocation, innerCharge);
		DrawInnerWire( );

		gl.useProgram(MapProgram);
		gl.activeTexture(gl.TEXTURE0);

		gl.uniformMatrix4fv( MvLocm, false, MvMatrix );
		gl.uniformMatrix4fv( PLocm,  false, PMatrix );
		gl.uniformMatrix4fv(NLocm, false, NormalMatrix);
		gl.uniform1f(innerChargeLocation, innerCharge);
		gl.uniform1f(outerChargeLocation, outerCharge);

		// lighting variables
		gl.uniform1f(uKaLocationm, 0.2);
		gl.uniform1f(uKdLocationm, 0.4);
		gl.uniform1f(uShininessm, 0.4);	
		
		DrawGrid();
	}

	// Set up electric field vectors
	gl.useProgram(VectorProgram);
	gl.activeTexture(gl.TEXTURE0);
	
	gl.uniformMatrix4fv( MvLocv, false, MvMatrix );
	gl.uniformMatrix4fv( PLocv,  false, PMatrix );

	// lighting variables
	gl.uniform1f(uKaLocationv, 0.2);
	gl.uniform1f(uKdLocationv, 0.4);
	gl.uniform1f(uShininessv, 0.4);		

	// Draw Inner Vector Field
	if (EVector === 1 && innerCharge != 0 && innerCharge != undefined && NowView != 1)
	{
		let radius = 1;

		// Increase amount of electric field vectors as charge increases
		let inc = 0;
		if (Math.abs(innerCharge) === 4){
			inc = PI/6;
		}
		else if (Math.abs(innerCharge)=== 3){
			inc = PI/5;
		}
		else if (Math.abs(innerCharge) === 2) {
			inc = PI/4;
		}
		else {
			inc = PI/3;
		}

		let innerpoints = SphereVecField(radius, 2*PI, PI, inc);
		for (let num = 0; num < innerpoints.length; num++) {
			let vertex = innerpoints[num];
			let nx = vertex.i;
			let ny = vertex.j;
			let nz = vertex.k;
			let ang = vertex.rotation_ang

			if (nx === 0 && ny === 0 && nz === 0){
				continue;
			}

			let mag = Math.sqrt(nx * nx + ny * ny + nz * nz);
			mat4.identity(RotMatrix);
			mat4.rotate(RotMatrix, ang, [nz/mag, 0, -nx/mag]);
				
			mat4.identity(TransMatrix);
			mat4.translate(TransMatrix, [nx, ny, nz]);	
			
			// Set up normals
			let vectorModelMatrix = mat4.create();
			mat4.identity(vectorModelMatrix);
			mat4.identity(vectorNormalMatrix);
			mat4.multiply(RotMatrix, ModelMatrix, vectorModelMatrix);
			mat4.inverse(vectorModelMatrix, vectorNormalMatrix);
			mat4.transpose(vectorNormalMatrix, vectorNormalMatrix);

			gl.uniformMatrix4fv( transLocv, false, TransMatrix);
			gl.uniformMatrix4fv (rotLocv, false, RotMatrix);
			gl.uniformMatrix4fv(NLocv, false, vectorNormalMatrix);
			gl.uniform1f(chargeLocationv, innerCharge);

			if (innerCharge > 0){
				DrawVectorPos();
			} else {
				DrawVectorNeg();
			}
		}	
	}
	
	// Draw Outer Vector Field
	if (EVector === 1 && outerCharge != 0 && outerCharge != undefined && NowView != 0)
	{
		// adjust radius for exploded view
		let radius = 2;
		if (NowView === 2){
			radius = 2.8;
		}

		// Increase amount of electric field vectors as charge increases
		let inc = 0;
		if (Math.abs(outerCharge) === 4){
			inc = PI/6;
		}
		else if (Math.abs(outerCharge)=== 3){
			inc = PI/5;
		}
		else if (Math.abs(outerCharge) === 2) {
			inc = PI/4;
		}
		else {
			inc = PI/3;
		}

		let outerpoints = SphereVecField(radius, 2*PI, PI, inc);
		for (let num = 0; num < outerpoints.length; num++) {
			let vertex = outerpoints[num];
			let nx = vertex.i;
			let ny = vertex.j;
			let nz = vertex.k;
			let ang = vertex.rotation_ang

			if (nx === 0 && ny === 0 && nz === 0){
				continue;
			}

			let mag = Math.sqrt(nx * nx + ny * ny + nz * nz);
			mat4.identity(RotMatrix);
			mat4.rotate(RotMatrix, ang, [nz/mag, 0, -nx/mag]);
				
			mat4.identity(TransMatrix);
			mat4.translate(TransMatrix, [nx, ny, nz]);	

			// Set up normals
			let vectorModelMatrix = mat4.create();
			mat4.identity(vectorModelMatrix);
			mat4.identity(vectorNormalMatrix);
			mat4.multiply(RotMatrix, ModelMatrix, vectorModelMatrix);
			mat4.inverse(vectorModelMatrix, vectorNormalMatrix);
			mat4.transpose(vectorNormalMatrix, vectorNormalMatrix);

			gl.uniformMatrix4fv( transLocv, false, TransMatrix);
			gl.uniformMatrix4fv (rotLocv, false, RotMatrix);
			gl.uniformMatrix4fv(NLocv, false, vectorNormalMatrix);
			gl.uniform1f(chargeLocationv, outerCharge);

			if (outerCharge > 0){
				DrawVectorPos();
			} else {
				DrawVectorNeg();
			}
		}	
	}
	

	// Set up Gauss
	// Set up Gauss Sphere with texture
	gl.useProgram(GaussProgram);
	var scale_gauss = $( "#gaussSlider" ).slider( "value" );
	if( scale_gauss != SaveScaleGauss )
	{
		mat4.identity( ScaleMatrix );
		var scale_gauss2 = scale_gauss;
		mat4.scale( ScaleMatrix, [ scale_gauss2, scale_gauss2, scale_gauss2 ] );
		SaveScaleGauss = scale_gauss;
	}

	gl.activeTexture(gl.TEXTURE6)
	gl.uniform1i( TLocg, 6 );
	gl.bindTexture( gl.TEXTURE_2D, GaussTexture );
	

	// lighting variables
	gl.uniform1f(uKaLocationg, 0.2);
	gl.uniform1f(uKdLocationg, 0.4);
	gl.uniform1f(uShininessg, 0.4);	


	// Set up scaled normals
	let gaussModelMatrix = mat4.create();
	mat4.identity(gaussModelMatrix);
	mat4.identity(gaussNormalMatrix);
	mat4.multiply(ScaleMatrix, gaussModelMatrix, gaussModelMatrix);
	mat4.multiply(MvMatrix, gaussModelMatrix, gaussModelMatrix);
	mat4.inverse(gaussModelMatrix, gaussNormalMatrix);
	mat4.transpose(gaussNormalMatrix, gaussNormalMatrix);

	// Set up transparency
	gl.clearColor(0, 0, 0, 0);
	gl.depthMask(false);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	
	gl.uniformMatrix4fv( MvLocg, false, MvMatrix);
	gl.uniformMatrix4fv( PLocg,  false, PMatrix );
	gl.uniformMatrix4fv(NLocg, false, gaussNormalMatrix);
	gl.uniformMatrix4fv(scaleLocg, false, ScaleMatrix);

	DrawGaussSphere( );

	gl.disable(gl.BLEND);
	gl.depthMask(true);

}


function CheckError( msg )
{
    var error = gl.getError( );
    if(  error != 0 )
    {
        var errMsg = "OpenGL error: " + error.toString(16);

        if ( msg )
	{
		errMsg = msg + "\n" + errMsg;
	}
        alert( errMsg );
    }
}


function HandleLoadedTexture( texture )
{
	gl.bindTexture( gl.TEXTURE_2D, texture );
	gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST );
	gl.generateMipmap( gl.TEXTURE_2D );
	gl.bindTexture( gl.TEXTURE_2D, null );
	CheckError( "Loading texture " );
}


function HandleMouseDown( event )
{
	MouseDown = true;
	LastMouseX = event.clientX;
	LastMouseY = event.clientY;
	WhichButton( event );
}

function HandleMouseUp( event )
{
	MouseDown = false;
}

function HandleMouseMove( event )
{
	if( ! MouseDown )
	{
		return;
	}
	var newX = event.clientX;
	var newY = event.clientY;

	var deltaX = newX - LastMouseX;
	var deltaY = newY - LastMouseY;

	if( Left )
	{
		var newModelMatrix = mat4.create( );
		mat4.identity( newModelMatrix );
		mat4.rotate( newModelMatrix, degToRad(deltaX / 2.), [0, 1, 0] );
		mat4.rotate( newModelMatrix, degToRad(deltaY / 2.), [1, 0, 0] );
		mat4.multiply( newModelMatrix, ModelMatrix, ModelMatrix );
																									// Call to Display?
	}

	LastMouseX = newX;
	LastMouseY = newY;															
}


function WhichButton( event )
{
	var b = event.button;
	//alert( "b = " + b );
	//var middle = Math.floor(b/4);
	//b %= 4;
	//var right = Math.floor(b/2);
	//var left = b%2;
	
	Left   = ( b == 0 );
	Middle = ( b == 1 );
	Right  = ( b == 2 );

	//alert( "left :" +  left + "right: " + right +  "middle: " +  middle );
	//return {'left' : left, 'right': right, 'middle': middle};
};


function PhysicsCalculations()
{
	let gaussRadius = $( "#gaussSlider" ).slider( "value" )/10;
	let outerRadius = 0.2
	let innerRadius = 0.1

	// Calculate area of Gaussian surface:
	surfaceArea = 4*Math.PI*gaussRadius*gaussRadius;

	// Calculate enclosed charge for hollow thin shells
	if (gaussRadius >= outerRadius) {
		enclosedCharge = outerCharge + innerCharge;
	}
    else if ((gaussRadius < outerRadius) & (gaussRadius >= innerRadius)) {
		 enclosedCharge = innerCharge;
	}
    else {
		enclosedCharge = 0; 
	}

	// Calculate electric field, 9 is from k constant, charges are nC
	if (gaussRadius != 0) {
		electricField = 9 * enclosedCharge/(gaussRadius * gaussRadius);
	}
    else {
		electricField = 0;
	}

	// Calculate Electric Potential
	if (gaussRadius === 0){
		electricPotential = 0;
	}
    else if (gaussRadius >= outerRadius){
		electricPotential = 9*enclosedCharge/gaussRadius;
	}
    else if (gaussRadius > innerRadius && gaussRadius < outerRadius) {
		 electricPotential = 9*innerCharge/gaussRadius + 9*outerCharge/outerRadius;
	} 
	else if (gaussRadius <= innerRadius){
		electricPotential = 9*innerCharge/innerRadius + 9*outerCharge/outerRadius;
	}
    
	// Display values
	document.getElementById("surfaceArea").innerHTML = "Surface Area (m\u00B2): " + surfaceArea.toFixed(2)
	document.getElementById("enclosedCharge").innerHTML = "Enclosed Charge (nC): " + enclosedCharge
	document.getElementById("electricField").innerHTML = "Electric Field (N/C): " + electricField.toFixed(0)
	document.getElementById("electricPotential").innerHTML = "Electric Potential (V): " + electricPotential.toFixed(1)
	
};
