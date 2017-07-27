/**
 * Auther: MaiJZ
 * Date: 2017/7/24
 * Github: https://github.com/maijz128
 */
//import * as THREE from "three";
var VoxelJS = (function () {
    function VoxelJS(scene) {
        this.meshersName = null;
        this.geometry = null;
        this.surfacemesh = null;
        this.wiremesh = null;
        this._voxelsData = null;
        // 网格化处理器
        this._meshers = null;
        this._showfacets = true;
        this._showedges = true;
        this.scene = scene;
        // 默认网格化为普通
        this.changeMesher(VoxelJS.MESHERS.Greedy);
    }
    /**
     *  Cube geometry
     *   4+--------+7
     *   /|       /|
     * 5+--------+6|
     *  | |      | |
     *  |0+------|-+3
     *  |/       |/
     * 1+--------+2
     *
     * 坐标从0顶点开始
     * X轴 - width   = 1->2
     * Y轴 - height  = 2->6
     * Z轴 - length  = 2->3
     *
     * @param l     [minX, minY, minZ]
     * @param h     [maxX, maxY, maxZ]
     * @param func  function(x, y, z){return color || 0;}
     */
    VoxelJS.makeVoxels = function (l, h, func) {
        var width = h[0] - l[0], height = h[1] - l[1], length = h[2] - l[2];
        // 尺寸
        var dims = [width, height, length];
        // voxel 数组；值为color，当值为0时,表示为没有/不显示
        var voxels = new Int32Array(dims[0] * dims[1] * dims[2]);
        var n = 0;
        for (var z = l[2]; z < h[2]; ++z)
            for (var y = l[1]; y < h[1]; ++y)
                for (var x = l[0]; x < h[0]; ++x, ++n) {
                    // 获得颜色
                    voxels[n] = func(x, y, z);
                }
        return { voxels: voxels, dims: dims };
    };
    VoxelJS.prototype.changeMesher = function (mesherName) {
        var name = VoxelJS.MESHERS[mesherName];
        if (name) {
            this.meshersName = name;
            this._meshers = VoxelJS._MESHERS[name];
            this.updateMesh();
        }
        return name;
    };
    /**
     * 是否显示边框
     * @param visible
     * @return visible
     */
    VoxelJS.prototype.showedges = function (visible) {
        var self = this;
        if (visible !== undefined) {
            self._showedges = visible;
            self.wiremesh.visible = visible;
        }
        return self._showedges;
    };
    /**
     * 是否显示Mesh的Faces
     * @param visible
     * @return visible
     */
    VoxelJS.prototype.showfacets = function (visible) {
        var self = this;
        if (visible !== undefined) {
            self._showfacets = visible;
            self.surfacemesh.visible = visible;
        }
        return self._showfacets;
    };
    VoxelJS.prototype.verticeCount = function () {
        if (this.geometry) {
            return this.geometry.vertices.length;
        }
        else {
            return 0;
        }
    };
    VoxelJS.prototype.faceCount = function () {
        if (this.geometry) {
            return this.geometry.faces.length;
        }
        else {
            return 0;
        }
    };
    VoxelJS.prototype.updateMesh = function () {
        var self = this;
        var data = self._voxelsData;
        var meshers = self._meshers;
        if (data && meshers) {
            self.scene.remove(self.geometry);
            self.scene.remove(self.surfacemesh);
            self.scene.remove(self.wiremesh);
            var geometry = void 0, surfacemesh = void 0, wiremesh = void 0;
            geometry = new THREE.Geometry();
            // 优化处理网格
            var result = meshers(data.voxels, data.dims);
            geometry.vertices.length = 0;
            geometry.faces.length = 0;
            for (var i = 0; i < result.vertices.length; ++i) {
                var q = result.vertices[i];
                geometry.vertices.push(new THREE.Vector3(q[0], q[1], q[2]));
            }
            var fColor = void 0;
            var face = void 0;
            for (var i = 0; i < result.faces.length; ++i) {
                var qFace = result.faces[i];
                // qFace 包含4个顶点Nub，和1个颜色
                if (qFace.length === 5) {
                    fColor = ThreeColorCache.get(qFace[4]);
                    face = new THREE.Face3(qFace[0], qFace[1], qFace[2]);
                    face.color = fColor;
                    face.vertexColors = [face.color, face.color, face.color];
                    geometry.faces.push(face);
                    face = new THREE.Face3(qFace[2], qFace[3], qFace[0]);
                    face.color = fColor;
                    face.vertexColors = [face.color, face.color, face.color];
                    geometry.faces.push(face);
                }
                else if (qFace.length === 4) {
                    fColor = ThreeColorCache.get(qFace[3]);
                    face = new THREE.Face3(qFace[0], qFace[1], qFace[2]);
                    face.color = fColor;
                    face.vertexColors = [face.color, face.color, face.color];
                    geometry.faces.push(face);
                }
            }
            {
                geometry.computeFaceNormals();
                geometry.verticesNeedUpdate = true;
                geometry.elementsNeedUpdate = true;
                geometry.normalsNeedUpdate = true;
                geometry.computeBoundingBox();
                geometry.computeBoundingSphere();
                var bb = geometry.boundingBox;
                //Create surface mesh
                var material = new THREE.MeshPhongMaterial({ vertexColors: THREE.VertexColors });
                surfacemesh = new THREE.Mesh(geometry, material);
                surfacemesh.doubleSided = false;
                var wirematerial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    wireframe: true
                });
                wiremesh = new THREE.Mesh(geometry, wirematerial);
                wiremesh.doubleSided = true;
                wiremesh.position.x = surfacemesh.position.x = -(bb.max.x + bb.min.x) / 2.0;
                wiremesh.position.y = surfacemesh.position.y = -(bb.max.y + bb.min.y) / 2.0;
                wiremesh.position.z = surfacemesh.position.z = -(bb.max.z + bb.min.z) / 2.0;
                self.scene.add(surfacemesh);
                self.scene.add(wiremesh);
            }
            surfacemesh.visible = self._showfacets;
            wiremesh.visible = self._showedges;
            self.geometry = geometry;
            self.surfacemesh = surfacemesh;
            self.wiremesh = wiremesh;
        }
    };
    VoxelJS.prototype.setVoxelData = function (voxelData) {
        if (voxelData) {
            if (voxelData.hasOwnProperty("voxels") &&
                voxelData.hasOwnProperty("dims")) {
                this._voxelsData = voxelData;
                this.updateMesh();
            }
        }
    };
    return VoxelJS;
}());
/**
 * 网格化的方式：{
* Stupid: 普通, Culled: 剔除一部分,
* Greedy: 贪婪(Face少), Monotone: 单调(Vertex少)}
 * @type {{Stupid: StupidMesh, Culled: CulledMesh, Greedy, Monotone}}
 */
VoxelJS._MESHERS = {
    'Stupid': StupidMesh,
    'Culled': CulledMesh,
    'Greedy': GreedyMesh,
    'Monotone': MonotoneMesh,
};
VoxelJS.MESHERS = {
    'Stupid': 'Stupid',
    'Culled': 'Culled',
    'Greedy': 'Greedy',
    'Monotone': 'Monotone',
};
//# sourceMappingURL=voxel.js.map