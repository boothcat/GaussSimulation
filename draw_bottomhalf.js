function DrawBottomHalf( ) 
{
    NumPoints = NumPoints_bottom;
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferId_bottom );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(VertexArray_bottom), gl.STATIC_DRAW );
	gl.vertexAttribPointer( vLoc_bottom, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vLoc_bottom );

	gl.bindBuffer( gl.ARRAY_BUFFER, texBufferId_bottom);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(TexArray_bottom), gl.STATIC_DRAW );
	gl.vertexAttribPointer( tLoc_bottom, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( tLoc_bottom );

	gl.bindBuffer( gl.ARRAY_BUFFER, normBufferId_bottom );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(NormArray_bottom), gl.STATIC_DRAW );
	gl.vertexAttribPointer( nLoc_bottom, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( nLoc_bottom );

    gl.drawArrays( gl.TRIANGLES, 0, NumPoints );
}