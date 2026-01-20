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

FILE* file_tex_pointer;
FILE* file_norm_pointer;
FILE* file_vertex_pointer;
FILE* file_color_pointer;


inline
void
DrawSphLatLng( float radius, float lat, float lng )
{
	// lat is in radians between -F_PI_2 and +F_PI_2
	// lng is in radians between -F_PI and +F_PI
	float xz =  cosf(lat);
	float x = xz * sinf(lng);
	float y = sinf(lat);
	float z = xz * cosf(lng);
	float nx = x;		// for a *sphere only*, the normal is the unitized position
	float ny = y;		// for a *sphere only*, the normal is the unitized position
	float nz = z;		// for a *sphere only*, the normal is the unitized position
	float s = ( lng + F_PI )   / F_2_PI;
	float t = ( lat + F_PI_2 ) / F_PI;
	double mag = sqrt(nx*nx + ny*ny + nz * nz);

	fprintf(file_tex_pointer, "[%f, %f],\n", s, t);
	
	fprintf(file_norm_pointer, "[%f, %f, %f],\n", nx/mag, ny/mag, nz/mag);
		
	fprintf(file_vertex_pointer, "[%f, %f, %f],\n", x * radius, y * radius, z * radius);

	if (y > .5) {
		fprintf(file_color_pointer, "[1, 0, 0],\n");
	}
	else if (y > 0.25) {
		fprintf(file_color_pointer, "[0, 0, 1],\n");
	}
	else if ( y >= 0) {
		fprintf(file_color_pointer, "[0, 1, 1],\n");
	}
	else if (y > -0.25) {
		fprintf(file_color_pointer, "[0, 1, 0],\n");
	}
	else if (y > -0.5) {
		fprintf(file_color_pointer, "[1, 1, 0],\n");
	}

	else if (y >= -1.0) {
		fprintf(file_color_pointer, "[1, 0, 0],\n");
	}

}

	
void
OsuSphere( float radius, int slices, int stacks )
{

	// sanity check:
	radius = (float)fabs(radius);
	if( slices < 4 )		slices = 4;
	if( stacks < 4 )		stacks = 4;


	// south pole:
	{
		int istack = 0;
		float north = -F_PI_2 + F_PI * (float)(istack + 1) / (float)stacks;
		float south = -F_PI_2 + F_PI * (float)(istack + 0) / (float)stacks;
		for (int islice = 0; islice < slices; islice++)
		{
			float west = -F_PI + F_2_PI * (float)(islice + 0) / (float)slices;
			float east = -F_PI + F_2_PI * (float)(islice + 1) / (float)slices;

			DrawSphLatLng( radius, south, .5f * (east + west));
			DrawSphLatLng( radius, north, east);
			DrawSphLatLng( radius, north, west);
		}
	}

	// north pole:
	{
		int istack = stacks - 1;
		float north = -F_PI_2 + F_PI * (float)(istack + 1) / (float)stacks;
		float south = -F_PI_2 + F_PI * (float)(istack + 0) / (float)stacks;
		for (int islice = 0; islice < slices; islice++)
		{
			float west = -F_PI + F_2_PI * (float)(islice + 0) / (float)slices;
			float east = -F_PI + F_2_PI * (float)(islice + 1) / (float)slices;

			DrawSphLatLng( radius, north, .5f*(east + west));
			DrawSphLatLng( radius, south, west);
			DrawSphLatLng( radius, south, east);
		}
	}

	// all the bands in between:
	for (int istack = 1; istack < stacks-1; istack++)
	{
		float north = -F_PI_2 + F_PI * (float)(istack + 1) / (float)stacks;
		float south = -F_PI_2 + F_PI * (float)(istack + 0) / (float)stacks;
		for (int islice = 0; islice < slices; islice++)
		{
			float west = -F_PI + F_2_PI * (float)(islice + 0) / (float)slices;
			float east = -F_PI + F_2_PI * (float)(islice + 1) / (float)slices;

			DrawSphLatLng( radius, north, west);
			DrawSphLatLng( radius, south, west);
			DrawSphLatLng( radius, north, east);

			DrawSphLatLng( radius, north, east);
			DrawSphLatLng( radius, south, west);
			DrawSphLatLng( radius, south, east);
		}
	}
}



int main() {
	file_tex_pointer = fopen("tex.txt", "w");
	file_norm_pointer = fopen("norm.txt", "w");
	file_vertex_pointer = fopen("vertex.txt", "w");
	file_color_pointer = fopen("color.txt", "w");

	if (file_tex_pointer == NULL) {
		printf("Error opening tex file");
		
	}

	if (file_norm_pointer == NULL) {
		printf("Error opening norm file");
	
	}

	if (file_vertex_pointer == NULL) {
		printf("Error opening vertex file");
	}
	
	OsuSphere(1, 20, 20);
	fclose(file_tex_pointer);
	fclose(file_norm_pointer);
	fclose(file_vertex_pointer);
	fclose(file_color_pointer);
	return 0;
}

