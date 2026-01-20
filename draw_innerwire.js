function DrawInnerWire( ) 
{
    NumPoints = NumPoints_inner;
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferId_inner );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(VertexArray_inner), gl.STATIC_DRAW );
	gl.vertexAttribPointer( vLoc_inner, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vLoc_inner );

	gl.bindBuffer( gl.ARRAY_BUFFER, texBufferId_inner);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(TexArray_inner), gl.STATIC_DRAW );
	gl.vertexAttribPointer( tLoc_inner, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( tLoc_inner );

	gl.bindBuffer( gl.ARRAY_BUFFER, normBufferId_inner );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(NormArray_inner), gl.STATIC_DRAW );
	gl.vertexAttribPointer( nLoc_inner, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( nLoc_inner );

    gl.drawArrays( gl.LINES, 0, NumPoints );
	
}