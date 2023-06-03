
export interface Model {
    vertices: number[]
    indices: number[]
}

export const CubeModel: Model = {
    vertices: [
        -0.5, 0.5, 0.5,     // 0
        -0.5, 0.5, -0.5,    // 1
        0.5,  0.5,  0.5,    // 2
        0.5,  0.5,  -0.5,   // 3
        0.5, -0.5, 0.5,     // 4 
        0.5, -0.5, -0.5,    // 5
        -0.5, -0.5, 0.5,    // 6
        -0.5,  -0.5, -0.5   // 7
      ],
      indices: [
        // Front
        0, 1, 2,
        1, 2, 3,

        // Right
        2, 3, 4,
        3, 4, 5,

        // Back
        4, 5, 6,
        5, 6, 7,

        // Top
        0, 2, 4,
        0, 4, 6,

        // Left
        0, 1, 7,
        0, 7, 6,

        // Bottom
        1, 3, 5,
        1, 5, 7
      ],
}