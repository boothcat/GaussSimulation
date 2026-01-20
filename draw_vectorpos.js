function DrawVectorPos( ) 
{
    NumPoints = NumPoints_pos;
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferId_pos );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(VertexArray_pos), gl.STATIC_DRAW );
	gl.vertexAttribPointer( vLoc_pos, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vLoc_pos );

	gl.bindBuffer( gl.ARRAY_BUFFER, normBufferId_pos );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(NormArray_pos), gl.STATIC_DRAW );
	gl.vertexAttribPointer( nLoc_pos, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( nLoc_pos );

    gl.drawArrays( gl.TRIANGLES, 0, NumPoints );
}