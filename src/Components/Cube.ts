
export interface Model {
    /*
     * A continuous list of vertices in groups of three (x, y, z) representing
     * all of the corners of a model
     */
    vertices: number[]
    
    /*
     * A continuous list of normal unit vectors in groups of three (x, y, z) representing
     * the normal direction of a face specified by the indices array
     */
    normals: number[]
    
    /*
     * A continuous list of texture coordinates in groups of two (u, v) values ranging from 0 to 1 representing
     * where (0,0) represents the bottom-left corner of a texture (usually an image) and (1, 1) represents
     * the top-right corner of a texture
     */
    textureCoords: number[]
    
    /* 
     * A continuous list of indices that represent the order in which to iterate through the vertices, normals, and texture coordinates
     * each group of 3 numbers in the indices array represents one triangle face of the model
     */
    indices: number[]
}

/*
 * A model representing a simple cube 
 */
export const CubeModel: Model = {
    // use 36 vertices to represent the cube (makes texturing easier)
    vertices: [
        // Front face
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        // Back face
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, -0.5,
        // Left face
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5,
        // Right face
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        // Top face
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        // Bottom face
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
      ],
      normals: [
        // Front face
        0.0, 0.0, 0.5,
        0.0, 0.0, 0.5,
        0.0, 0.0, 0.5,
        0.0, 0.0, 0.5,
        // Back face
        0.0, 0.0, -0.5,
        0.0, 0.0, -0.5,
        0.0, 0.0, -0.5,
        0.0, 0.0, -0.5,
        // Left face
        -0.5, 0.0, 0.0,
        -0.5, 0.0, 0.0,
        -0.5, 0.0, 0.0,
        -0.5, 0.0, 0.0,
        // Right face
        0.5, 0.0, 0.0,
        0.5, 0.0, 0.0,
        0.5, 0.0, 0.0,
        0.5, 0.0, 0.0,
        // Top face
        0.0, 0.5, 0.0,
        0.0, 0.5, 0.0,
        0.0, 0.5, 0.0,
        0.0, 0.5, 0.0,
        // Bottom face
        0.0, -0.5, 0.0,
        0.0, -0.5, 0.0,
        0.0, -0.5, 0.0,
        0.0, -0.5, 0.0,
      ],
      textureCoords: [
        // Front face
        0.0, 0.0,
        0.5, 0.0,
        0.5, 0.5,
        0.0, 0.5,
        // Back face
        0.5, 0.0,
        0.0, 0.0,
        0.0, 0.5,
        0.5, 0.5,
        // Left face
        0.0, 0.0,
        0.5, 0.0,
        0.5, 0.5,
        0.0, 0.5,
        // Right face
        0.0, 0.0,
        0.5, 0.0,
        0.5, 0.5,
        0.0, 0.5,
        // Top face
        0.0, 0.0,
        0.5, 0.0,
        0.5, 0.5,
        0.0, 0.5,
        // Bottom face
        0.0, 0.0,
        0.5, 0.0,
        0.5, 0.5,
        0.0, 0.5,
      ],
      indices: [
        0, 1, 2,   0, 2, 3,     // Front face
        4, 5, 6,   4, 6, 7,     // Back face
        8, 9, 10,  8, 10, 11,   // Left face
        12, 13, 14, 12, 14, 15, // Right face
        16, 17, 18, 16, 18, 19, // Top face
        20, 21, 22, 20, 22, 23, // Bottom face
      ],
}