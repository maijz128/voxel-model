/**
 * Auther: MaiJZ
 * Date: 2017/7/24
 * Github: https://github.com/maijz128
 */

// import {VoxelJS} from "./voxel";


class CubeRenderer {

    public scene: any;
    public voxelJS: any;

    constructor(scene, voxelJS) {
        this.scene = scene;
        this.voxelJS = voxelJS;
    }

    addCube(x, y, z, color) {
        this.addCubes([{x: x, y: y, z: z, color: color}]);
    };

    /**
     * @param cubes [{x, y, z, color}]
     */
    addCubes(cubes) {

    };

    reomveCube(x, y, z) {
        this.removeCubes([{x: x, y: y, z: z}]);
    };

    /**
     * @param cubes [{x, y, z}]
     */
    removeCubes(cubes) {

    };

    setVox(vox: any) {
        if (!vox) return null;

        const self = this;
        let models = vox.MAIN.models;

        for (let i = 0; i < models.length; i++) {
            let model = models[i];
            let SIZE = model.SIZE;
            let voxels = model.XYZI.voxels;


            let MODEL_VOXELS = {
                voxels: {},
                buildKey: function (x, y, z) {
                    return "_X_" + x + "_Y_" + y + "_Z_" + z;
                },
                add: function (x, y, z, color) {
                    let vKey = this.buildKey(x, y, z);
                    this.voxels[vKey] = color;
                },
                getColor: function (x, y, z) {
                    let vKey = this.buildKey(x, y, z);
                    return this.voxels[vKey];
                }
            };

            let vx, vy, vz;
            for (let j = 0; j < voxels.length; j++) {
                let voxel_Uint8Arr = voxels[j];

                let color = vox.getPalette_Hex(voxel_Uint8Arr[3]);
                // color = hexToRgba(color);
                // console.log("%c" + color, "color: " + color);

                // 转为局部坐标
                {
                    vx = voxel_Uint8Arr[0];
                    vy = voxel_Uint8Arr[1];
                    vz = voxel_Uint8Arr[2];

                    //1.转为中心坐标系

                    // vx -= SIZE.x / 2;
                    // vy -= SIZE.y / 2;
                    // vz -= SIZE.z / 2;

                    // 微调半个单位
                    // vx += 0.5;
                    // vy += 0.5;
                    // vz += 0.5;
                }

                MODEL_VOXELS.add(vx, vy, vz, color);
            }

            let _makeVoxels_func = function (x, y, z) {
                const NULL_CUBE = 0;
                let color = MODEL_VOXELS.getColor(x, y, z);
                if (color) {
                    return color;
                } else {
                    return NULL_CUBE;
                }
            };

            let voxelData = VoxelJS.makeVoxels(
                [0, 0, 0], [SIZE.x, SIZE.y, SIZE.z], _makeVoxels_func);

            self.voxelJS.setVoxelData(voxelData);
        }

    };


}
