import { quat, vec3 } from "gl-matrix";

/* 1[unit] = 1[in]
 * The Cube model is 1x1x1[unit] by default which we will say is equivalent to 1x1x1[in]
 * So a 16x16x16[in] box would need to have a scale of vec3(16, 16, 16)
 * however if the base (parent) was 48x48x10[in]
 * each box (child) scale will be effected by the parents scale
 * 
 * So a transformation will need to take place before the actual scale of the box is set to account for this
 * otherwise the scale of the parent will be multiplied by the scale of the box.
 * A simple division will need to take place prior to the box being set
 * 
 * Assume that the center of the pallet is 0,0
 */


const baseHeight = 8;

export interface Transform {
    position: vec3 // x, y, z
    rotation: quat
    scale: vec3    // length, height, width (x, y, z)
}

export const base: Transform = {
    position: vec3.fromValues(0, 0, 0),
    rotation: quat.create(),
    scale: vec3.fromValues(48, baseHeight, 48)
}

// stack of 16x16x16 boxes arranged 2 stacks of 4 boxes evenly with corners pinned to center
// vec3.fromValues(-boxUnit / 2, boxUnit / 2 + baseHeight, boxUnit / 2),
// *** adjust the height later when creating the Object3D's
const boxUnit = 16
const halfBoxUnit = boxUnit / 2
const artificialGap = 0.25
export const boxes4x2: Transform[] = [
    // First Tier
    {
        position: vec3.fromValues(-halfBoxUnit - artificialGap, 0, halfBoxUnit + artificialGap),
        rotation: quat.create(),
        scale: vec3.fromValues(boxUnit, boxUnit, boxUnit),
    },
    {
        position: vec3.fromValues(-halfBoxUnit - artificialGap, 0, -halfBoxUnit - artificialGap),
        rotation: quat.create(),
        scale: vec3.fromValues(boxUnit, boxUnit, boxUnit),
    },
    {
        position: vec3.fromValues(halfBoxUnit + artificialGap, 0, -halfBoxUnit - artificialGap),
        rotation: quat.create(),
        scale: vec3.fromValues(boxUnit, boxUnit, boxUnit),
    },
    {
        position: vec3.fromValues(halfBoxUnit + artificialGap, 0, halfBoxUnit + artificialGap),
        rotation: quat.create(),
        scale: vec3.fromValues(boxUnit, boxUnit, boxUnit),
    },
    // Second Tier
    {
        position: vec3.fromValues(-halfBoxUnit - artificialGap, boxUnit + artificialGap, halfBoxUnit + artificialGap),
        rotation: quat.create(),
        scale: vec3.fromValues(boxUnit, boxUnit, boxUnit),
    },
    {
        position: vec3.fromValues(-halfBoxUnit - artificialGap, boxUnit + artificialGap, -halfBoxUnit - artificialGap),
        rotation: quat.create(),
        scale: vec3.fromValues(boxUnit, boxUnit, boxUnit),
    },
    {
        position: vec3.fromValues(halfBoxUnit + artificialGap, boxUnit + artificialGap, -halfBoxUnit - artificialGap),
        rotation: quat.create(),
        scale: vec3.fromValues(boxUnit, boxUnit, boxUnit),
    },
    {
        position: vec3.fromValues(halfBoxUnit + artificialGap, boxUnit + artificialGap, halfBoxUnit + artificialGap),
        rotation: quat.create(),
        scale: vec3.fromValues(boxUnit, boxUnit, boxUnit),
    },
]
