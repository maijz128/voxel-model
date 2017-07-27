/**
 * Auther: MaiJZ
 * Date: 2017/7/24
 * Github: https://github.com/maijz128
 */

declare let THREE: any;
declare let StupidMesh: any;
declare let CulledMesh: any;
declare let GreedyMesh: any;
declare let MonotoneMesh: any;
declare let ThreeColorCache: any;


//import * as THREE from "three";


class VoxelJS {
    scene: any;
    meshersName = null;
    geometry = null;
    surfacemesh = null;
    wiremesh = null;

    private _voxelsData = null;
    // 网格化处理器
    private _meshers = null;

    private _showfacets = true;
    private _showedges = true;

    constructor(scene) {
        this.scene = scene;

        // 默认网格化为普通
        this.changeMesher(VoxelJS.MESHERS.Greedy);
    }


    /**
     * 网格化的方式：{
 * Stupid: 普通, Culled: 剔除一部分,
 * Greedy: 贪婪(Face少), Monotone: 单调(Vertex少)}
     * @type {{Stupid: StupidMesh, Culled: CulledMesh, Greedy, Monotone}}
     */
    private static readonly _MESHERS = {
        'Stupid': StupidMesh,
        'Culled': CulledMesh,
        'Greedy': GreedyMesh,
        'Monotone': MonotoneMesh,
    };
    static readonly MESHERS = {
        'Stupid': 'Stupid',
        'Culled': 'Culled',
        'Greedy': 'Greedy',
        'Monotone': 'Monotone',
    };

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
    static  makeVoxels(l, h, func) {
        let width = h[0] - l[0],
            height = h[1] - l[1],
            length = h[2] - l[2];
        // 尺寸
        let dims = [width, height, length];
        // voxel 数组；值为color，当值为0时,表示为没有/不显示
        let voxels = new Int32Array(dims[0] * dims[1] * dims[2]);

        let n = 0;
        for (let z = l[2]; z < h[2]; ++z)
            for (let y = l[1]; y < h[1]; ++y)
                for (let x = l[0]; x < h[0]; ++x, ++n) {
                    // 获得颜色
                    voxels[n] = func(x, y, z);
                }

        return {voxels: voxels, dims: dims};
    }

    changeMesher(mesherName) {
        let name = VoxelJS.MESHERS[mesherName];
        if (name) {
            this.meshersName = name;
            this._meshers = VoxelJS._MESHERS[name];
            this.updateMesh();
        }
        return name;
    }

    /**
     * 是否显示边框
     * @param visible
     * @return visible
     */
    showedges(visible) {
        const self = this;
        if (visible !== undefined) {
            self._showedges = visible;
            self.wiremesh.visible = visible;
        }

        return self._showedges;
    }

    /**
     * 是否显示Mesh的Faces
     * @param visible
     * @return visible
     */
    showfacets(visible) {
        const self = this;
        if (visible !== undefined) {
            self._showfacets = visible;
            self.surfacemesh.visible = visible;
        }

        return self._showfacets;
    }

    verticeCount() {
        if (this.geometry) {
            return this.geometry.vertices.length;
        } else {
            return 0;
        }
    }

    faceCount() {
        if (this.geometry) {
            return this.geometry.faces.length;
        } else {
            return 0;
        }
    }

    updateMesh() {
        const self = this;


        let data = self._voxelsData;

        let meshers = self._meshers;

        if (data && meshers) {

            self.scene.remove(self.geometry);
            self.scene.remove(self.surfacemesh);
            self.scene.remove(self.wiremesh);

            let geometry, surfacemesh, wiremesh;
            geometry = new THREE.Geometry();


            // 优化处理网格
            let result = meshers(data.voxels, data.dims);


            geometry.vertices.length = 0;
            geometry.faces.length = 0;


            for (let i = 0; i < result.vertices.length; ++i) {
                let q = result.vertices[i];
                geometry.vertices.push(new THREE.Vector3(q[0], q[1], q[2]));
            }

            let fColor;
            let face;
            for (let i = 0; i < result.faces.length; ++i) {
                let qFace = result.faces[i];


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
                // qFace 包含3个顶点Nub，和1个颜色
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

                let bb = geometry.boundingBox;


                //Create surface mesh
                let material = new THREE.MeshPhongMaterial(
                    {vertexColors: THREE.VertexColors}
                );


                surfacemesh = new THREE.Mesh(geometry, material);
                surfacemesh.doubleSided = false;

                let wirematerial = new THREE.MeshBasicMaterial({
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

    }

    setVoxelData(voxelData) {
        if (voxelData) {
            if (voxelData.hasOwnProperty("voxels") &&
                voxelData.hasOwnProperty("dims")) {

                this._voxelsData = voxelData;
                this.updateMesh();
            }
        }
    }

}



