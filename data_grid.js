function InitGridData(){
    VertexArray_grid = [];
    NormArray_grid = [];
    
    var x_length = 10.;
    var x0 = -x_length/2.;
    var numx = 500.;
    var dx = x_length/numx
    var z_length = 10.;
    var z0 = -z_length/2.;
    var numz = 500.;
    var dz = z_length/numz
    var counter = 0;

    for( let i = 0; i < numz; i++ ){
        let vertices = [];
        for( let j = 0; j < numx; j++ ){
            let x1 = x0 + dx*j;
            let y1 = 0;
            let z1 = z0 + dz*(i+1);
    
            let nx = 0;
            let ny = 1;
            let nz = 0;
        
            let x2 = x0 + dx*j;
            let y2 = 0;
            let z2 = z0 + dz*(i+0);

            if (counter === 0) { 
                vertices.push([x1, y1, z1]);
                vertices.push([x2, y2, z2]);
                counter += 1;
            }

            if (counter === 1) {
                NormArray_grid.push([nx, ny, nz])
                NormArray_grid.push([nx, ny, nz])
                NormArray_grid.push([nx, ny, nz])

                VertexArray_grid.push([vertices[0][0], vertices[0][1], vertices[0][2]])
                VertexArray_grid.push([vertices[1][0], vertices[1][1], vertices[1][2]])
                VertexArray_grid.push([x1, y1, z1])

                NormArray_grid.push([nx, ny, nz])
                NormArray_grid.push([nx, ny, nz])
                NormArray_grid.push([nx, ny, nz])

                VertexArray_grid.push([x1, y1, z1])
                VertexArray_grid.push([vertices[1][0], vertices[1][1], vertices[1][2]])
                VertexArray_grid.push([x2, y2, z2])

                if (j == numx-1){
                    counter = 0;
                } else {
                    vertices[0] = [x1, y1, z1]
                    vertices[1] = [x2, y2, z2]
    
                }       
            }
        }
    }
    NumPoints_grid = VertexArray_grid.length
    vertexBufferId_grid = gl.createBuffer( );
	vLoc_grid = gl.getAttribLocation( MapProgram, "aVertex" );

	normBufferId_grid = gl.createBuffer( );
	nLoc_grid = gl.getAttribLocation( MapProgram, "aNormal" );

}   