function DrawGaussSphere( ) 
{
    NumPoints = NumPoints_g;
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferId_g );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(VertexArray_g), gl.STATIC_DRAW );
	gl.vertexAttribPointer( vLoc_g, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vLoc_g );

	gl.bindBuffer( gl.ARRAY_BUFFER, texBufferId_g);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(TexArray_g), gl.STATIC_DRAW );
	gl.vertexAttribPointer( tLoc_g, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( tLoc_g );

	gl.bindBuffer( gl.ARRAY_BUFFER, normBufferId_g );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(NormArray_g), gl.STATIC_DRAW );
	gl.vertexAttribPointer( nLoc_g, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( nLoc_g );

    gl.drawArrays( gl.TRIANGLES, 0, NumPoints );
	
}