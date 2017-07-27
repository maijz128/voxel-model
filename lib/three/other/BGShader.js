/**
 * @author zz85 / https://github.com/zz85
 *
 * Based on "A Practical Analytic Model for Daylight"
 * aka The Preetham Model, the de facto standard analytic skydome model
 * http://www.cs.utah.edu/~shirley/papers/sunsky/sunsky.pdf
 *
 * First implemented by Simon Wallner
 * http://www.simonwallner.at/projects/atmospheric-scattering
 *
 * Improved by Martin Upitis
 * http://blenderartists.org/forum/showthread.php?245954-preethams-sky-impementation-HDR
 *
 * Three.js integration by zz85 http://twitter.com/blurspline
 */

THREE.ShaderLib[ 'bg' ] = {

    uniforms: {

        luminance:	 { type: "f", value: 1 },
        turbidity:	 { type: "f", value: 2 },
        reileigh:	 { type: "f", value: 1 },
        background: {type:"c", value: new THREE.Color(0x000000)},
        foreground: {type:"c", value: new THREE.Color(0xFFFFFF)},
        width:	 { type: "f", value: 1 },
        height:	 { type: "f", value: 1 },
        mieCoefficient:	 { type: "f", value: 0.005 },
        mieDirectionalG: { type: "f", value: 0.8 },
        sunPosition: 	 { type: "v3", value: new THREE.Vector3() }

    },

    vertexShader: [

        "varying vec3 vWorldPosition;",

        "void main() {",

        "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
        "vWorldPosition = worldPosition.xyz;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

        "}",

    ].join( "\n" ),

    fragmentShader: [

        "varying vec3 vWorldPosition;",
        "uniform float width;",
        "uniform float height;",
        "uniform vec3 background;",
        "uniform vec3 foreground;",


        "void main() ",
        "{",

        "float a = (abs(vWorldPosition.x/((width/height)*9000.0)));",
        "float b = (abs(vWorldPosition.y/9000.0));",
        "float a2 =a*a;",
        "float b2 =b*b;",
        "float r = (1.0-(1.0-a2*a2) *(1.0-b2*b2));",
        "gl_FragColor.rgb = foreground * (1.0-r) + background * r;",
        "gl_FragColor.a = 1.0;",
        "}",

    ].join( "\n" )

};

THREE.BG = function () {

    var bgShader = THREE.ShaderLib[ "bg" ];
    var bgUniforms = THREE.UniformsUtils.clone( bgShader.uniforms );

    var	bgMat = new THREE.ShaderMaterial( {
        fragmentShader: bgShader.fragmentShader,
        vertexShader: bgShader.vertexShader,
        uniforms: bgUniforms,
        side: THREE.BackSide
    } );
    var bgGeo = new THREE.BoxGeometry( 100000, 100000, 100000 );
    var bgMesh = new THREE.Mesh( bgGeo, bgMat );


    // Expose variables
    this.mesh = bgMesh;
    this.uniforms = bgUniforms;

};