/**
 * Auther: MaiJZ
 * Date: 2017/7/24
 * Github: https://github.com/maijz128
 */
// import {VoxelJS} from "./voxel";
var CubeRenderer = (function () {
    function CubeRenderer(scene, voxelJS) {
        this.scene = scene;
        this.voxelJS = voxelJS;
    }
    CubeRenderer.prototype.addCube = function (x, y, z, color) {
        this.addCubes([{ x: x, y: y, z: z, color: color }]);
    };
    ;
    /**
     * @param cubes [{x, y, z, color}]
     */
    CubeRenderer.prototype.addCubes = function (cubes) {
    };
    ;
    CubeRenderer.prototype.reomveCube = function (x, y, z) {
        this.removeCubes([{ x: x, y: y, z: z }]);
    };
    ;
    /**
     * @param cubes [{x, y, z}]
     */
    CubeRenderer.prototype.removeCubes = function (cubes) {
    };
    ;
    CubeRenderer.prototype.setVox = function (vox) {
        if (!vox)
            return null;
        var self = this;
        var models = vox.MAIN.models;
        var _loop_1 = function (i) {
            var model = models[i];
            var SIZE = model.SIZE;
            var voxels = model.XYZI.voxels;
            var MODEL_VOXELS = {
                voxels: {},
                buildKey: function (x, y, z) {
                    return "_X_" + x + "_Y_" + y + "_Z_" + z;
                },
                add: function (x, y, z, color) {
                    var vKey = this.buildKey(x, y, z);
                    this.voxels[vKey] = color;
                },
                getColor: function (x, y, z) {
                    var vKey = this.buildKey(x, y, z);
                    return this.voxels[vKey];
                }
            };
            var vx = void 0, vy = void 0, vz = void 0;
            for (var j = 0; j < voxels.length; j++) {
                var voxel_Uint8Arr = voxels[j];
                var color = vox.getPalette_Hex(voxel_Uint8Arr[3]);
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
            var _makeVoxels_func = function (x, y, z) {
                var NULL_CUBE = 0;
                var color = MODEL_VOXELS.getColor(x, y, z);
                if (color) {
                    return color;
                }
                else {
                    return NULL_CUBE;
                }
            };
            var voxelData = VoxelJS.makeVoxels([0, 0, 0], [SIZE.x, SIZE.y, SIZE.z], _makeVoxels_func);
            self.voxelJS.setVoxelData(voxelData);
        };
        for (var i = 0; i < models.length; i++) {
            _loop_1(i);
        }
    };
    ;
    return CubeRenderer;
}());
//# sourceMappingURL=cube-renderer.js.map