/**
 * Auther: MaiJZ
 * Date: 2017/7/22
 * Github: https://github.com/maijz128
 */


/**
 *
 * @param opt { x: int, y: int, z: int,
 *              width: int, height: int, depth: int
 *              color: color, parent: obj}
 * @constructor
 */
function Model_SIZE_XYZI(scene, opt) {
    const self = this;
    const DEFAULT_CUBE_COUNT = 2000;

    this.scene = scene;
    this.mesh = null;
    this.cubes = {};

    this.geometry = null;
    this.positions = null;
    this.normals = null;
    this.colors = null;

    // init
    {
        opt = self._FormatOpt(opt);

        var color = ThreeColorCache.get(opt.color);

        var geometry = new THREE.BufferGeometry();

        var positions = new Float32Array(DEFAULT_CUBE_COUNT * 3 * 3);
        var normals = new Float32Array(DEFAULT_CUBE_COUNT * 3 * 3);
        var colors = new Float32Array(DEFAULT_CUBE_COUNT * 3 * 3);


        function disposeArray() {
            this.array = null;
        }

        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3).onUpload(disposeArray));
        geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3).onUpload(disposeArray));
        geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).onUpload(disposeArray));

        geometry.computeBoundingSphere();

        var material = new THREE.MeshPhongMaterial({
            color: color,
            // opacity: 0,
            // transparent: true,
            // polygonOffset: true,
            // polygonOffsetFactor: 1, // positive value pushes polygon further away
            // polygonOffsetUnits: 1,

            shininess: 250,
            side: THREE.DoubleSide, vertexColors: THREE.VertexColors,
        });

        var mesh = new THREE.Mesh(geometry, material);
        // self.appendEdgesWireframe(mesh, 0x124566);
        opt.parent.add(mesh);


        self.mesh = mesh;
        self.positions = positions;
        self.normals = normals;
        self.colors = colors;

    }

    self.addCube({});

}
Model_SIZE_XYZI.prototype._FormatOpt = function (opt) {
    const self = this;
    return {
        x: opt.x || 0, y: opt.y || 0, z: opt.z || 0,
        width: opt.width || 1, height: opt.height || 1, depth: opt.depth || 1,
        color: opt.color || Math.random() * 0xffffff,
        parent: opt.parent || self.scene,
    };
};
Model_SIZE_XYZI.prototype.appendEdgesWireframe = function (mesh, color, linewidth) {
    color = color || 0xeeeeee;
    linewidth = linewidth || 8;
    var eGeometry = new THREE.EdgesGeometry(mesh.geometry);
    var eMaterial = new THREE.LineBasicMaterial({color: color, linewidth: linewidth});
    var edges = new THREE.LineSegments(eGeometry, eMaterial);
    mesh.add(edges);
    return edges;
};
/**
 *
 * @param opt { x: int, y: int, z: int,
 *              width: int, height: int, depth: int
 *              color: color, parent: obj}
 * @constructor
 */
Model_SIZE_XYZI.prototype.addCube = function (opt) {
    const self = this;
    opt = self._FormatOpt(opt);
    opt.parent = self.mesh;

    var cube = {
        name: null,
    };

    cube.name = "_x_" + opt.x + "_y_" + opt.y + "_z_" + opt.z;


    var positions = self.positions;
    var normals = self.normals;
    var colors = self.colors;

    var color = new THREE.Color();

    var n = 800, n2 = n / 2;  // triangles spread in the cube
    var d = 12, d2 = d / 2; // individual triangle size

    var pA = new THREE.Vector3();
    var pB = new THREE.Vector3();
    var pC = new THREE.Vector3();

    var cb = new THREE.Vector3();
    var ab = new THREE.Vector3();

    for (var i = 0; i < positions.length; i += 9) {

        // positions

        var x = Math.random() * n - n2;
        var y = Math.random() * n - n2;
        var z = Math.random() * n - n2;

        var ax = x + Math.random() * d - d2;
        var ay = y + Math.random() * d - d2;
        var az = z + Math.random() * d - d2;

        var bx = x + Math.random() * d - d2;
        var by = y + Math.random() * d - d2;
        var bz = z + Math.random() * d - d2;

        var cx = x + Math.random() * d - d2;
        var cy = y + Math.random() * d - d2;
        var cz = z + Math.random() * d - d2;

        positions[i] = ax;
        positions[i + 1] = ay;
        positions[i + 2] = az;

        positions[i + 3] = bx;
        positions[i + 4] = by;
        positions[i + 5] = bz;

        positions[i + 6] = cx;
        positions[i + 7] = cy;
        positions[i + 8] = cz;

        // flat face normals

        pA.set(ax, ay, az);
        pB.set(bx, by, bz);
        pC.set(cx, cy, cz);

        cb.subVectors(pC, pB);
        ab.subVectors(pA, pB);
        cb.cross(ab);

        cb.normalize();

        var nx = cb.x;
        var ny = cb.y;
        var nz = cb.z;

        normals[i] = nx;
        normals[i + 1] = ny;
        normals[i + 2] = nz;

        normals[i + 3] = nx;
        normals[i + 4] = ny;
        normals[i + 5] = nz;

        normals[i + 6] = nx;
        normals[i + 7] = ny;
        normals[i + 8] = nz;

        // colors

        var vx = ( x / n ) + 0.5;
        var vy = ( y / n ) + 0.5;
        var vz = ( z / n ) + 0.5;

        color.setRGB(vx, vy, vz);

        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;

        colors[i + 3] = color.r;
        colors[i + 4] = color.g;
        colors[i + 5] = color.b;

        colors[i + 6] = color.r;
        colors[i + 7] = color.g;
        colors[i + 8] = color.b;

    }

};


function VoxelViewer(vox, elContainer, width, height) {
    const self = this;

    self.threeHelper = new ThreeHelper(elContainer, width, height);
    self.scene = self.threeHelper.scene;
    self.voxelJS = new VoxelJS(self.scene);
    self.cubeRenderer = new CubeRenderer(self.scene, self.voxelJS);

    self._vox = null;

    {

        function jsVox() {
            var color;
            var models = vox.MAIN.models;


            for (var i = 0; i < models.length; i++) {
                var model = models[i];
                var SIZE = model.SIZE;
                var voxels = model.XYZI.voxels;

                var wireframeCube;
                var wx, wy, wz;
                {
                    wx = 0;// SIZE.x / 2;
                    wy = 0;//SIZE.y / 2;
                    wz = SIZE.z / 2;

                    wireframeCube = self.threeHelper.addCube_Wireframe({
                        width: SIZE.x, height: SIZE.y, depth: SIZE.z,
                        x: wx, y: wy, z: wz, color: 0x777777,
                    });
                }


                var vx, vy, vz;
                for (var j = 0; j < voxels.length; j++) {
                    var voxel_Uint8Arr = voxels[j];

                    color = vox.getPalette_strHex(voxel_Uint8Arr[3]);
                    color = hexToRgba(color);
                    // console.log("%c" + color, "color: " + hexToRgba(color));

                    // 转为局部坐标
                    {
                        //1.转为中心坐标系
                        vx = voxel_Uint8Arr[0] + 0.5; //- parseInt(SIZE.x / 2);
                        vy = voxel_Uint8Arr[1] + 0.5; //- parseInt(SIZE.y / 2);
                        vz = voxel_Uint8Arr[2] + 0.5; // - parseInt(SIZE.z / 2);
                        vx -= SIZE.x / 2;
                        vy -= SIZE.y / 2;
                        vz -= SIZE.z / 2;

                        // 微调半个单位
                        // vx += 0.5;
                        // vy += 0.5;
                        // vz += 0.5;
                    }


                    self.threeHelper.addCube({
                        parent: wireframeCube, color: color,
                        x: vx, y: vy, z: vz,
                    });
                }
            }
        }

        setTimeout(function () {
            // jsVox();
        }, 25);
    }


    // init
    {
        self.threeHelper.camera.position.x = 0;
        self.threeHelper.camera.position.y = -50;
        self.threeHelper.camera.position.z = 0;

        self.threeHelper.scene.background = new THREE.Color("rgb(68, 68, 68)");

        self.setVox(vox);

    }

}
VoxelViewer.prototype._animate = function () {
    const self = this;

    // self.cube.rotation.x += 0.1;
    // self.cube.rotation.y += 0.1;
};
VoxelViewer.prototype.setVox = function (vox) {
    if (vox) {
        this._vox = vox;
        this.cubeRenderer.setVox(vox);
    }
};
