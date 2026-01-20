function DrawVectorNeg( ) 
{
    NumPoints = NumPoints_neg;
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBufferId_neg );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(VertexArray_neg), gl.STATIC_DRAW );
	gl.vertexAttribPointer( vLoc_neg, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vLoc_neg );

	gl.bindBuffer( gl.ARRAY_BUFFER, normBufferId_neg );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(NormArray_neg), gl.STATIC_DRAW );
	gl.vertexAttribPointer( nLoc_neg, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( nLoc_neg );

    gl.drawArrays( gl.TRIANGLES, 0, NumPoints );
}