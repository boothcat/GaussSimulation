#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <math.h>
#include <ctype.h>


int main(){

FILE* file_tex_pointer;
FILE* file_norm_pointer;
FILE* file_vertex_pointer;
FILE* file_color_pointer;

// Thin Plate
float x_length = 10;           		// length of the x side of the grid
float  x0 = (-x_length/2.);		// where one side starts
int numx =	100;			        // how many points in x
float dx =	( x_length/(float)numx );	// change in x between the points
float z_length = 10;
float z0 = (-z_length/2);
int numz = 100;
float dz = (z_length/(float)numz);

file_tex_pointer = fopen("tex.txt", "w");
file_norm_pointer = fopen("norm.txt", "w");
file_vertex_pointer = fopen("vertex.txt", "w");

int counter = 0;
float vertices[4][3];

// glNormal3f( 0., 1., 0. );
for( int i = 0; i < numz; i++ ){
    for( int j = 0; j < numx; j++ ){
        float x1 = x0 + dx*(float)j;
        float y1 = 0;
        float z1 = z0 + dz*(float)(i+1);

        float nx = 0;
        float ny = 1;
        float nz = 0;
        //glTexCoord2f(dx*float(j)/x_length, dz*float(i+1)/z_length);
        
        float x2 = x0 + dx*(float)j;
        float y2 = 0;
        float z2 = z0 + dz*(float)(i+0);



        if (counter == 0) { 
            vertices[0][0] = x1;
            vertices[0][1] = y1;
            vertices[0][2] = z1;

            vertices[1][0] = x2;
            vertices[1][1] = y2;
            vertices[1][2] = z2;
            counter += 1;
        }

        if (counter == 1) {
            fprintf(file_norm_pointer, "[%f, %f, %f],\n", nx, ny, nz);
            fprintf(file_norm_pointer, "[%f, %f, %f],\n", nx, ny, nz);
            fprintf(file_norm_pointer, "[%f, %f, %f],\n", nx, ny, nz);

	        fprintf(file_vertex_pointer, "[%f, %f, %f],\n", vertices[0][0], vertices[0][1], vertices[0][2]);
            fprintf(file_vertex_pointer, "[%f, %f, %f],\n", vertices[1][0], vertices[1][1], vertices[1][2]);
            fprintf(file_vertex_pointer, "[%f, %f, %f],\n", x1, y1, z1);

            fprintf(file_norm_pointer, "[%f, %f, %f],\n", nx, ny, nz);
            fprintf(file_norm_pointer, "[%f, %f, %f],\n", nx, ny, nz);
            fprintf(file_norm_pointer, "[%f, %f, %f],\n", nx, ny, nz);

            fprintf(file_vertex_pointer, "[%f, %f, %f],\n", x1, y1, z1); 
            fprintf(file_vertex_pointer, "[%f, %f, %f],\n", vertices[1][0], vertices[1][1], vertices[1][2]);
            fprintf(file_vertex_pointer, "[%f, %f, %f],\n", x2, y2, z2);

            if (j == numx-1){
                counter = 0;
            } else {
                vertices[0][0] = x1;
                vertices[0][1] = y1;
                vertices[0][2] = z1;

                vertices[1][0] = x2;
                vertices[1][1] = y2;
                vertices[1][2] = z2;

            }
        }        
    }
}

}
