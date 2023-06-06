export interface ModelData {
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

export class Model {
    private _modelData: ModelData

    constructor(modelData: ModelData) {
        this._modelData = modelData
    }

    // eventually update this to have uv coords as well (or other things like bump maps etc...)
    public get vertexBufferData(): number[] {
        const bufferData = []
        for (let i = 0; i < this._modelData.vertices.length; i += 3) {
            bufferData.push(
                this._modelData.vertices[i],
                this._modelData.vertices[i + 1],
                this._modelData.vertices[i + 2],
                this._modelData.normals[i],
                this._modelData.normals[i + 1],
                this._modelData.normals[i + 2],
            )
        }

        return bufferData
    }
    
    public get vertices(): number[] {
        return this._modelData.vertices
    }

    public get normals(): number[] {
        return this._modelData.normals
    }

    public get textureCoords(): number[] {
        return this._modelData.textureCoords
    }

    public get indices(): number[] {
        return this._modelData.indices
    }
}