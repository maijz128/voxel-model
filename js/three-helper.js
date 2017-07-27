/**
 * Auther: MaiJZ
 * Date: 2017/7/24
 * Github: https://github.com/maijz128
 */

const ThreeColorCache = new function () {
    const self = this;
    self.colors = {};

    self.get = function (color) {
        var color_name = color.toString();
        var threeColor = self.colors[color_name];

        if (!threeColor) {
            threeColor = new THREE.Color(color);
            self.colors[color_name] = threeColor;
        }
        return threeColor;
    };

    self.clear = function () {
        self.colors = {};
    };
};


function ThreeHelper(elContainer, width, height) {
    if (!Detector.webgl) Detector.addGetWebGLMessage();
    width = width || window.innerWidth;
    height = height || window.innerHeight;

    const self = this;

    self._cache = {
        geometry: {
            "size_1x1x1": new THREE.BoxGeometry(1, 1, 1)
        },
        material: {
            //  "color": THREE.Color
        },
        color: {
            //  "color": THREE.Color

            get: function (color) {
                var color_name = color.toString();
                var threeColor = self._cache.color[color_name];
                if (!threeColor) {
                    threeColor = new THREE.Color(color);
                    self._cache.color[color_name] = threeColor;
                }
                return threeColor;
            }
        }
    };
    self._BufferGeometry = new function () {
        const MAX_CUBE = 200000;
        const DEFAULT_CUBE_COUNT = 2000;
        this.models = {};

        this.geometry = null;
        this.positions = null;
        this.normals = null;
        this.colors = null;

        this.init = function () {
            this.geometry = new THREE.BufferGeometry();
            this.positions = new Float32Array(MAX_CUBE * 3 * 3);
            this.normals = new Float32Array(MAX_CUBE * 3 * 3);
            this.colors = new Float32Array(MAX_CUBE * 3 * 3);


            var material = new THREE.MeshPhongMaterial({
                color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
                side: THREE.DoubleSide, vertexColors: THREE.VertexColors
            });

        };


        this.addModel = function (name, opt) {
            opt = self._FormatOpt(opt);

            var model = {
                name: name,
                positions: null,
                normals: null,
                colors: null,

                cubes: {}
            };

            var color = self._cache.color.get(opt.color);
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
                opacity: 0,
                transparent: true,
                polygonOffset: true,
                polygonOffsetFactor: 1, // positive value pushes polygon further away
                polygonOffsetUnits: 1,

                shininess: 250,
                side: THREE.DoubleSide, vertexColors: THREE.VertexColors,
            });

            var mesh = new THREE.Mesh(geometry, material);
            self.scene.add(mesh);


            model.positions = positions;
            model.normals = normals;
            model.colors = colors;
            this.models[name] = model;
            return model;
        };

        /**
         *
         * @param id "x_float_y_float_z_float"
         */
        this.addCube = function (name) {

        };
    };

    self.clock = new THREE.Clock();

//  SCENE
    {
        var scene = new THREE.Scene();
        // scene.fog = new THREE.Fog(0xffffff, 1, 5000);
        // scene.fog.color.setHSL(0.6, 0, 1);
        //雾效（0xcccccc：颜色；2000：近平面；3500：远平面）
        // 近平面要大于camera的近平面，远平面要小于camera的远平面
        scene.fog = new THREE.Fog(0xcccccc, 2000, 3500);


        self.scene = scene;
    }

//  Camera
    {
        var camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 0;

        camera.rotation.x = 0;
        camera.rotation.y = 0;
        camera.rotation.z = 0;
        // self.camera.rotateX(-84);
        // self.camera.rotateY(0.56);
        // self.camera.rotateZ(83);

        camera.lookAt(new THREE.Vector3(0, 8, 0));

        self.camera = camera;
    }


//  RENDERER
    {
        var renderer;
        if (Detector.webgl) {
            renderer = new THREE.WebGLRenderer({
                antialias: true,       //是否开启反锯齿
                preserveDrawingBuffer: true, //是否保存绘图缓冲, 用于截图
                precision: "highp",    //着色精度选择
                // alpha: true,           //是否可以设置背景色透明
            });
        } else {
            renderer = new THREE.CanvasRenderer();
        }

        renderer.setSize(width, height);
        //设置canvas背景色(clearColor)和背景色透明度（clearAlpha）
        renderer.setClearColor(0x000000, 1);
        //允许阴影映射，渲染阴影需要大量的资源，因此我们需要告诉渲染器我们需要阴影
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        renderer.shadowMap.renderReverseSided = false;
        renderer.shadowMapSoft = true;  // 实现软阴影的效果

        elContainer.appendChild(renderer.domElement);
        self.renderer = renderer;

        renderer.gammaInput = true;
        renderer.gammaOutput = true;
    }


// Controls
    {
        // var trackballControls = new THREE.TrackballControls(self.camera);
        // trackballControls.rotateSpeed = 1.0;
        // trackballControls.zoomSpeed = 1.2;
        // trackballControls.panSpeed = 0.8;
        // trackballControls.noZoom = false;
        // trackballControls.noPan = false;
        // trackballControls.staticMoving = true;
        // trackballControls.dynamicDampingFactor = 0.3;
        // trackballControls.keys = [65, 83, 68];
        // trackballControls.addEventListener('change', render);
        //
        // self.trackballControls = trackballControls;

        // var transformControls = null;
        //
        // transformControls = new THREE.TransformControls(self.camera, self.renderer.domElement);
        // transformControls.addEventListener('change', render);
        //
        // self.scene.add(transformControls);
        // self.transformControls = transformControls;
        //
        // this.transformControls.attach(cube);


        // controls need to be added *after* main logic,
        // otherwise controls.enabled doesn't work.

        var controls = new THREE.EditorControls(camera, elContainer.dom);
        controls.addEventListener('change', function () {

            //transformControls.update();
            //signals.cameraChanged.dispatch( camera );

        });
    }


//  LIGHTS
    {
        var HSL = {x: 0.5, y: 0.5, z: 0.5};
        var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3);
        // hemiLight.color.setHSL(HSL.x, HSL.y, HSL.z);
        // hemiLight.groundColor.setHSL(0.095, -60, 0.75);
        hemiLight.position.set(-90, -500, 0);
        scene.add(hemiLight);


        {
            var dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
            // dirLight.color.setHSL(0.1, 1, 0.95);
            dirLight.position.set(100, -100, 100);
            // dirLight.position.multiplyScalar(50);
            scene.add(dirLight);
            dirLight.castShadow = true;
            dirLight.shadow.mapSize.width = 512;
            dirLight.shadow.mapSize.height = 512;
            var d = 100;
            dirLight.shadow.camera.left = -d;
            dirLight.shadow.camera.right = d;
            dirLight.shadow.camera.top = d;
            dirLight.shadow.camera.bottom = -d;
            dirLight.shadow.camera.far = 3500;
            dirLight.shadow.camera.near = 0.1;
            // dirLight.shadow.bias = -0.0001;

        }


        self.lights = [];
        self.lights.push(hemiLight);
        self.lights.push(dirLight);
    }

// GROUND
    {

        var color = "#99ccff"; // "rgb(153, 204, 255)";
        var groundGeo = new THREE.PlaneBufferGeometry(100, 100);
        var groundMat = new THREE.MeshPhongMaterial({
            color: color, specular: 0x050505});
        var ground = new THREE.Mesh(groundGeo, groundMat);
        ground.receiveShadow = true;    // 接收阴影
        // ground.rotation.x = -Math.PI / 2;

        ground.rotation.x = 0;
        ground.rotation.y = 0;
        ground.rotation.z = 0;
        ground.position.x = 0;
        ground.position.y = 0;
        ground.position.z = -0.5;

        //self.scene.add(ground);

    }


// window resize
    {

        window.addEventListener('resize', onWindowResize, false);
        function onWindowResize() {
            self.camera.aspect = window.innerWidth / window.innerHeight;
            self.camera.updateProjectionMatrix();
            self.renderer.setSize(window.innerWidth, window.innerHeight);

            render();
        }

    }

// STATS
    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = "";
    stats.domElement.style.bottom = '0px';
    document.body.appendChild(stats.domElement);


    {

        self._animates = [];
        function animate() {
            requestAnimationFrame(animate);

            {
                self._animates.forEach(function (func) {
                    func()
                });
                stats.update();
                // self.trackballControls.update();
            }

            render();
        }

        self._animates_low = [];
        setInterval(function () {
            self._animates_low.forEach(function (func) {
                func();
            });
        }, 1000 / 4);

        function render() {
            self.renderer.render(self.scene, self.camera);
        }

        render();
        animate();

    }
}
ThreeHelper.prototype.addAnimateFunc = function (func) {
    if (func) {
        this._animates.push(func);
    }
};
ThreeHelper.prototype.addLowAnimateFunc = function (func) {
    if (func) {
        this._animates_low.push(func);
    }
};


ThreeHelper.prototype._FormatOpt = function (opt) {
    const self = this;
    return {
        x: opt.x || 0, y: opt.y || 0, z: opt.z || 0,
        width: opt.width || 1, height: opt.height || 1, depth: opt.depth || 1,
        color: opt.color || Math.random() * 0xffffff,
        parent: opt.parent || self.scene,
    };
};

/**
 * @param opt { x: int, y: int, z: int,
 *              width: int, height: int, depth: int
 *              color: color, parent: obj}
 * @returns {Raycaster.params.Mesh|*|Mesh}
 */
ThreeHelper.prototype.addCube = function (opt) {
    opt = this._FormatOpt(opt);

    var color_name = opt.color.toString();

    var color = this._cache.color[color_name];
    if (!color) {
        color = new THREE.Color(opt.color);
        this._cache.color[color_name] = color;
    }

    var geometry;
    if (opt.width === 1 && opt.height === 1 && opt.depth === 1) {
        geometry = this._cache.geometry.size_1x1x1;
    } else {
        geometry = new THREE.BoxGeometry(opt.width, opt.height, opt.depth);
    }
    // for (var i = 0; i < geometry.faces.length; i += 2) {
    //     geometry.faces[i].color = color;
    //     geometry.faces[i + 1].color = color;
    //
    //     //var hex = Math.random() * 0xffffffff;
    //     // geometry.faces[i].color.setHex(hex);
    //     // geometry.faces[i + 1].color.setHex(hex);
    // }


    var material = this._cache.material[color_name];
    if (!material) {
        material = new THREE.MeshPhongMaterial({
            color: color,
            // vertexColors: THREE.FaceColors,
            // overdraw: 1,

            //-BEGIN MeshPhongMaterial
            specular: color, // 材质的光亮程度及其高光部分的颜色
            shininess: 1024,    // 高光部分的亮度，默认值为30.
            skinning: true,
            shading: THREE.FlatShading,

            //-END MeshPhongMaterial

            //-BEGIN MeshLambertMaterial
            // 材质的自发光颜色，可以用来表现光源的颜色，并不是一种光源，而是一种不受光照影响的颜色。
            // emissive: 0x000000,

            //-END MeshLambertMaterial
        });
        this._cache.material[color_name] = material;
    }

    var cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true; //需要阴影，方块进行投射阴影
    // cube.receiveShadow = true;  //平面进行接受阴影

    opt.parent.add(cube);
    cube.position.set(opt.x, opt.y, opt.z);
    return cube;
};
/**
 * @param opt { x: int, y: int, z: int,
 *              width: int, height: int, depth: int
 *              color: color, parent: obj}
 * @returns {Raycaster.params.Mesh|*|Mesh}
 */
ThreeHelper.prototype.addCube_Wireframe = function (opt) {
    opt = this._FormatOpt(opt);

    var color = new THREE.Color(opt.color);

    var geometry = new THREE.BoxGeometry(
        opt.width, opt.height, opt.depth, 8, 8, 8);

    var material = new THREE.MeshBasicMaterial({
        color: color,
        opacity: 0,
        transparent: true,
        polygonOffset: true,
        polygonOffsetFactor: 1, // positive value pushes polygon further away
        polygonOffsetUnits: 1
    });


    var cube = new THREE.Mesh(geometry, material);
    opt.parent.add(cube);
    cube.position.set(opt.x, opt.y, opt.z);

    this.appendEdgesWireframe(cube, opt.color);

    return cube;
};

ThreeHelper.prototype.appendEdgesWireframe = function (mesh, color, linewidth) {
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
 * @param hex 例如:"23ff45"
 * @param opacity 透明度
 * @returns {string}
 */
function hexToRgba(hex, opacity) {
    hex = hex.replace("0x", "");
    opacity = opacity || parseInt("0x" + hex.slice(6, 8));

    return "rgba(" +
        parseInt("0x" + hex.slice(0, 2)) + "," +
        parseInt("0x" + hex.slice(2, 4)) + "," +
        parseInt("0x" + hex.slice(4, 6)) + "," +
        opacity + ")";
}