#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <math.h>
#include <ctype.h>

#ifdef __APPLE__
#include <OpenGL/gl.h>
#else
#include <GL/gl.h>
#endif

#ifndef F_PI
#define F_PI		((float)(3.14159))
#define F_2_PI		((float)(2.f*F_PI))
#define F_PI_2		((float)(F_PI/2.f))
#endif

FILE* file_norm_pointer;
FILE* file_vertex_pointer;

int counter = 0;
float vertices[2][3];
float normals[2][3];

// Note delete last two rows from text file so file is divisible by three!
// Draws cone with top and bottom
inline
void
_DrawConeLatLng_tb( int ilat, int ilng, int numlats, int numlngs, float radbot, float radtop, float height, float translate)
{
	float t = (float)ilat / (float)(numlats-1);
	float y = t * height + translate;
	float rad = t * radtop + ( 1.f - t ) * radbot;
	float lng = -F_PI  +  2.f * F_PI * (float)ilng / (float)(numlngs-1);
	float x =  cosf( lng );
	float z = -sinf( lng );
	float s = (float)ilng / (float)(numlngs-1);
	// glTexCoord2f( s, t );
	float n[3] = { height*x, radbot - radtop, height*z };

	double mag = sqrt(n[0]* n[0] + n[1]*n[1] + n[2]*n[2]);

	double nx = n[0]/mag;
	double ny = n[1]/mag;
	double nz = n[2]/mag;
	
	fprintf(file_norm_pointer, "[%f, %f, %f],\n", nx, ny, nz);	
	fprintf(file_vertex_pointer, "[%f, %f, %f],\n", x * rad, y, z * rad);	
}


// Draws cone without top/bottom, hollow tube
inline
void
_DrawConeLatLng( int ilat, int ilng, int numlats, int numlngs, float radbot, float radtop, float height, float translate)
{
	float t = (float)ilat / (float)(numlats-1);
	float y = t * height + translate;
	float rad = t * radtop + ( 1.f - t ) * radbot;
	float lng = -F_PI  +  2.f * F_PI * (float)ilng / (float)(numlngs-1);
	float x =  cosf( lng );
	float z = -sinf( lng );
	float s = (float)ilng / (float)(numlngs-1);
	// glTexCoord2f( s, t );
	float n[3] = { height*x, radbot - radtop, height*z };

	double mag = sqrt(n[0]* n[0] + n[1]*n[1] + n[2]*n[2]);

	double nx = n[0]/mag;
	double ny = n[1]/mag;
	double nz = n[2]/mag;
	
	fprintf(file_norm_pointer, "[%f, %f, %f],\n", nx, ny, nz);	
	fprintf(file_vertex_pointer, "[%f, %f, %f],\n", x * rad, y, z * rad);

	/*if (counter == 0) {
	fprintf(file_norm_pointer, "[%f, %f, %f],\n", nx, ny, nz);	
	fprintf(file_vertex_pointer, "[%f, %f, %f],\n", x * rad, y, z * rad);	
	counter += 1;
	}

	if (counter == 1) {
		vertices[0][0] = x * rad;
		vertices[0][1] = y;
		vertices[0][2] = z * rad;
		normals[0][0] = nx;
		normals[0][1] = ny;
		normals[0][2] = nz;

		fprintf(file_norm_pointer, "[%f, %f, %f],\n", nx, ny, nz);
		fprintf(file_vertex_pointer, "[%f, %f, %f],\n", x * rad, y, z * rad);
		counter += 1;
	}

	if (counter == 2) {
		vertices[1][0] = x * rad;
		vertices[1][1] = y;
		vertices[1][2] = z * rad;

		normals[1][0] = nx;
		normals[1][1] = ny;
		normals[1][2] = nz;

		fprintf(file_norm_pointer, "[%f, %f, %f],\n", nx, ny, nz);
		fprintf(file_vertex_pointer, "[%f, %f, %f],\n", x * rad, y, z * rad);
		counter += 1;
	}
	
	if (counter == 3) {
		// Print previous two points
		fprintf(file_norm_pointer, "[%f, %f, %f],\n", normals[0][0], normals[0][1], normals[0][2]);
		fprintf(file_vertex_pointer, "[%f, %f, %f],\n", vertices[0][0], vertices[0][1], vertices[0][2]);

		fprintf(file_norm_pointer, "[%f, %f, %f],\n", normals[1][0], normals[1][1], normals[1][2]);
		fprintf(file_vertex_pointer, "[%f, %f, %f],\n", vertices[1][0], vertices[1][1], vertices[1][2]);

		// Move lastest vertex and normal to first row in vertices and normals matrix
		vertices[0][0] = vertices[1][0];
		vertices[0][1] = vertices[1][1];
		vertices[0][2] = vertices[1][2];

		normals[0][0] = normals[1][0];
		normals[0][1] = normals[1][1];
		normals[0][2] = normals[1][2];

		counter -= 1;

	}*/
	
}


void
OsuCone( float radBot, float radTop, float height, int slices, int stacks, float translate)
{
	// sanity check:
	radBot = (float)fabs( (double)radBot );
	radTop = (float)fabs( (double)radTop );
	slices =  abs( slices );
	stacks =  abs( stacks );
	if( slices < 4 )	slices = 4;
	if( stacks < 4 )	stacks = 4;

	/*// gracefully handle degenerate case:

	if( radBot == 0.  &&  radTop == 0. )
	{
		glBegin( GL_LINES );
			glTexCoord2f( 0., 0. );
			glNormal3f( 0., -1., 0. );
			glVertex3f( 0., 0., 0. );

			glTexCoord2f( 0., 1. );
			glNormal3f( 0., 1., 0. );
			glVertex3f( 0., height, 0. );
		glEnd( );
		return;
	}*/

	int numLngs = slices;
	int numLats = stacks;
	float trans = translate;

	// draw the bottom circle:

	if( radBot != 0. )
	{
		for( int ilng = numLngs-1; ilng >= 0; ilng-- )
		{
			_DrawConeLatLng_tb( 0, ilng+1, numLats, numLngs, radBot, radTop, height, trans );
			_DrawConeLatLng_tb( 0, ilng+0, numLats, numLngs, radBot, radTop, height, trans );

			float s = (float)ilng / (float)(numLngs-1);
			//glTexCoord2f( s, 0. );
			fprintf(file_norm_pointer, "[0., -1., 0.],\n");
			fprintf(file_vertex_pointer, "[0., %f, 0.],\n", trans);
		}
	}


	// draw the top circle:

	if( radTop != 0. )
	{
		for( int ilng = 0; ilng < numLngs-1; ilng++ )
		{
			float s = (float)ilng / (float)(numLngs-1);
			//glTexCoord2f( s, 1. );
			fprintf(file_norm_pointer, "[0., -1., 0.],\n");
			fprintf(file_vertex_pointer, "[%f, %f, %f],\n", 0., height + trans, 0.);

			_DrawConeLatLng_tb( numLats-1, ilng+0, numLats, numLngs, radBot, radTop, height, trans );
			_DrawConeLatLng_tb( numLats-1, ilng+1, numLats, numLngs, radBot, radTop, height, trans );
		}
	}

	// draw the sides:

	for( int ilat = 0; ilat < numLats-1; ilat++ )
	{
		_DrawConeLatLng( ilat+0, 0, numLats, numLngs, radBot, radTop, height, trans);
		_DrawConeLatLng( ilat+1, 0, numLats, numLngs, radBot, radTop, height, trans );

		for( int ilng = 1; ilng < numLngs; ilng++ )
		{
			_DrawConeLatLng( ilat+0, ilng, numLats, numLngs, radBot, radTop, height, trans);
			_DrawConeLatLng( ilat+1, ilng, numLats, numLngs, radBot, radTop, height, trans);
		}
	}
}


int main() {
	file_norm_pointer = fopen("norm.txt", "w");
	file_vertex_pointer = fopen("vertex.txt", "w");

	if (file_norm_pointer == NULL) {
		printf("Error opening norm file");
	
	}

	if (file_vertex_pointer == NULL) {
		printf("Error opening vertex file");
	}
	

	// Translate last paramter set to 0 for vector shaft
	OsuCone(0.025, 0.025, 1, 15, 15, 0);
	//OsuCone(0.08, 0.001, 0.2, 5, 5, 0.9);
	OsuCone(0.001, 0.08, 0.2, 5, 5, -0.04);
	fclose(file_norm_pointer);
	fclose(file_vertex_pointer);
	return 0;
}

