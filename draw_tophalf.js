function DrawTopHalf( ) 
{
    NumPoints = NumPoints_top;
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferId_top );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(VertexArray_top), gl.STATIC_DRAW );
	gl.vertexAttribPointer( vLoc_top, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vLoc_top );

	gl.bindBuffer( gl.ARRAY_BUFFER, texBufferId_top);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(TexArray_top), gl.STATIC_DRAW );
	gl.vertexAttribPointer( tLoc_top, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( tLoc_top );

	gl.bindBuffer( gl.ARRAY_BUFFER, normBufferId_top );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(NormArray_top), gl.STATIC_DRAW );
	gl.vertexAttribPointer( nLoc_top, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( nLoc_top );

    gl.drawArrays( gl.TRIANGLES, 0, NumPoints );
}