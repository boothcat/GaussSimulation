function DrawGrid( ) 
{
    NumPoints = NumPoints_grid;
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferId_grid );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(VertexArray_grid), gl.STATIC_DRAW );
	gl.vertexAttribPointer( vLoc_grid, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vLoc_grid );

	gl.bindBuffer( gl.ARRAY_BUFFER, normBufferId_grid );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(NormArray_grid), gl.STATIC_DRAW );
	gl.vertexAttribPointer( nLoc_grid, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( nLoc_grid );

    gl.drawArrays( gl.TRIANGLES, 0, NumPoints );
}