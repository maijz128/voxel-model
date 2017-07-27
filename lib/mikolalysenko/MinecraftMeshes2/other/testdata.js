function createTestData() {
    var result = {};

    // Cube geometry
    //
    //   4+--------+7
    //   /|       /|
    // 5+--------+6|
    //  | |      | |
    //  |0+------|-+3
    //  |/       |/
    // 1+--------+2
    //
    // 坐标从0顶点开始
    // X轴 - width   = 1->2
    // Y轴 - height  = 2->6
    // Z轴 - length  = 2->3
    function makeVoxels(l, h, func) {
        var width = h[0] - l[0],
            height = h[1] - l[1],
            length = h[2] - l[2];
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

        return {voxels: voxels, dims: dims};
    }

    var colorTab = [
        0xff0000,
        0x00ff00,
        0x0000ff,
        0xff00ff,
        0xffff00,
        0x00ffff,
        0x000001,
        0xffffff
    ];
    var colorTab_SHOW = [
        "#ff0000",
        "#00ff00",
        "#0000ff",
        "#ff00ff",
        "#ffff00",
        "#00ffff",
        "#000001",
        "#ffffff"
    ];


    result["TestBuild"] = function () {
        return makeVoxels([0, 0, 0], [4, 6, 8],
            function (x, y, z) {
                if (x === 1 && y === 0 && z === 0) {
                    return 0;
                }
                return Math.random() * 0xffffff;
            });
    };


    function _NxNxN(n, colorIndex) {
        return makeVoxels([0, 0, 0], [n, n, n], function () {
            return colorTab[colorIndex];
        });
    }

    for (var i = 1, c = 0; i <= 16; i <<= 1, ++c) {
        result[i + 'x' + i + 'x' + i] = new function () {
            const n = i, colorIndex = c;
            return _NxNxN(n, colorIndex);
        };
    }

    result['Sphere'] = function () {
        return makeVoxels([-16, -16, -16], [16, 16, 16], function (i, j, k) {
            return i * i + j * j + k * k <= 16 * 16 ? 0x113344 : 0;
        });
    };

    result['I-Shape'] = function () {
        return makeVoxels([0, -1, -1], [1, 2, 2], function (i, j, k) {
            if ((j === -1 && k === 0) ||
                (j === 1 && k === 0)) {
                return 0;
            }
            return 1;
        });
    };

    result['Tiny Button'] = function () {
        return makeVoxels([-1, -1, -1], [1, 2, 2], function (i, j, k) {
            if (i === 0) {
                return (j === 0 && k === 0) ? 0xff0000 : 0;
            }
            return 1;
        });
    };


    result['Noise'] = function () {
        return makeVoxels([0, 0, 0], [16, 16, 16], function (i, j, k) {
            return Math.random() < 0.1 ? Math.random() * 0xffffff : 0;
        });
    };

    result['Dense Noise'] = function () {
        return makeVoxels([0, 0, 0], [16, 16, 16], function (i, j, k) {
            return Math.round(Math.random() * 0xffffff);
        });
    };

    result['16 Color Noise'] = function () {
        return makeVoxels([0, 0, 0], [16, 16, 16], function (i, j, k) {
            return Math.random() < 0.1 ? colorTab[Math.floor(Math.random() * colorTab.length)] : 0;
        });
    };

    result['Hole'] = function () {
        return makeVoxels([0, 0, 0], [16, 16, 1], function (i, j, k) {
            return Math.abs(i - 7) > 3 || Math.abs(j - 7) > 3 ? 1 : 0;
        });
    };

    result['Boss'] = function () {
        return makeVoxels([0, 0, 0], [16, 16, 4], function (i, j, k) {
            if (k === 0) {
                return 0x0000ff;
            } else if (Math.abs(i - 4) < 2 && Math.abs(j - 5) < 2 && k < 2) {
                return 0x00ff00;
            } else if (10 <= i && i < 14 && 2 <= j && j < 15) {
                return 0xff0000;
            }
            return 0;
        });
    };

    result['T-Shape'] = function () {
        return makeVoxels([0, 0, 0], [16, 16, 3], function (i, j, k) {
            return (( 6 <= i && i < 10 && 2 <= j && j < 13) ||
            ( 2 <= i && i < 14 && 8 <= j && j < 13)) ? 0xcc00dd : 0;
        });
    };

    result['HollowCube'] = function () {
        return makeVoxels([0, 0, 0], [16, 16, 16], function (i, j, k) {
            if (i < 1) {
                return 0xff0000;
            } else if (i >= 15) {
                return 0x00ffff;
            } else if (j < 1) {
                return 0x00ff00;
            } else if (j >= 15) {
                return 0xff00ff;
            } else if (k < 1) {
                return 0x0000ff;
            } else if (k >= 15) {
                return 0xffff00;
            } else {
                return 0;
            }
        });
    };


    result['Clover'] = function () {
        return makeVoxels([0, 0, 0], [17, 17, 1], function (i, j, k) {
            if (i === 0 && Math.abs(j - 8) <= 2) {
                return 0;
            } else if (i === 16 && Math.abs(j - 8) <= 2) {
                return 0;
            } else if (j === 0 && Math.abs(i - 8) <= 2) {
                return 0;
            } else if (j === 16 && Math.abs(i - 8) <= 2) {
                return 0;
            } else {
                return 0x10de60;
            }
        });
    };

    result['Triangle'] = function () {
        return makeVoxels([0, 0, 0], [17, 17, 1], function (i, j, k) {
            return (i < j) ? 0xff00ff : 0;
        });
    };


    result['Saw'] = function () {
        return makeVoxels([0, 0, 0], [17, 3, 1], function (i, j, k) {
            if (j > 0 || !!(i & 1)) {
                return 0x00ffff;
            }
            return 0;
        });
    };

    result['4Dots'] = function () {
        return makeVoxels([0, 0, 0], [7, 7, 1], function (i, j, k) {
            if ((i === 2 && j === 1) ||
                (i === 5 && j === 2) ||
                (i === 1 && j === 4) ||
                (i === 4 && j === 5)) {
                return 0x00ff;
            }
            return 0xeedd00;
        });
    };

    result['Checker'] = function () {
        return makeVoxels([0, 0, 0], [8, 8, 8], function (i, j, k) {
            return !!((i + j + k) & 1) ? (((i ^ j ^ k) & 2) ? 1 : 0xffffff) : 0;
        });
    };


    result["Matt's Example"] = function () {
        return makeVoxels([0, 0, 0], [4, 5, 1], function (i, j, k) {
            if ((i === 1 && j === 1) ||
                (i === 2 && j === 3)) {
                return 0xee5533;
            }
            return 0x128844;
        });
    };

    result['Benchmark (SLOW!)'] = function () {
        return makeVoxels([-32, -32, -32], [33, 33, 33], function (x, y, z) {
            var s = 2.0 * Math.PI / 32.0;
            return Math.sin(s * x) + Math.sin(s * y) + Math.sin(s * z) < 0 ? 1 : 0;
        });
    };

    result['Hill'] = function () {
        return makeVoxels([-16, 0, -16], [16, 16, 16], function (i, j, k) {
            return j <= 16 * Math.exp(-(i * i + k * k) / 64) ? 0x118822 : 0;
        });
    };

    result['Valley'] = function () {
        return makeVoxels([0, 0, 0], [32, 32, 32], function (i, j, k) {
            return j <= (i * i + k * k) * 31 / (32 * 32 * 2) + 1 ? 0x118822 : 0;
        });
    };

    result['Hilly Terrain'] = function () {
        return makeVoxels([0, 0, 0], [32, 32, 32], function (i, j, k) {
            var h0 = 3.0 * Math.sin(Math.PI * i / 12.0 - Math.PI * k * 0.1) + 27;
            if (j > h0 + 1) {
                return 0;
            }
            if (h0 <= j) {
                return 0x23dd31;
            }
            var h1 = 2.0 * Math.sin(Math.PI * i * 0.25 - Math.PI * k * 0.3) + 20;
            if (h1 <= j) {
                return 0x964B00;
            }
            if (2 < j) {
                return Math.random() < 0.1 ? 0x222222 : 0xaaaaaa;
            }
            return 0xff0000;
        });
    };


    result['Empty'] = {voxels: [], dims: [0, 0, 0]};

    return result;
}
