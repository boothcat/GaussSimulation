function DrawOuterShell( ) 
{
    NumPoints = NumPoints_outer;
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferId_outer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(VertexArray_outer), gl.STATIC_DRAW );
	gl.vertexAttribPointer( vLoc_outer, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vLoc_outer );

	gl.bindBuffer( gl.ARRAY_BUFFER, texBufferId_outer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(TexArray_outer), gl.STATIC_DRAW );
	gl.vertexAttribPointer( tLoc_outer, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( tLoc_outer );

	gl.bindBuffer( gl.ARRAY_BUFFER, normBufferId_outer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(NormArray_outer), gl.STATIC_DRAW );
	gl.vertexAttribPointer( nLoc_outer, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( nLoc_outer );

    gl.drawArrays( gl.TRIANGLES, 0, NumPoints );
}
