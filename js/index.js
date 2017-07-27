/**
 * Auther: MaiJZ
 * Date: 2017/7/22
 * Github: https://github.com/maijz128
 */


var VOX_URL_LIST = [
    "vox/chr_knight.vox",
    "vox/chr_old.vox",
    "vox/chr_rain.vox",
    "vox/chr_sword.vox",
    "vox/doom.vox",
    "vox/ephtracy",
    "vox/menger.vox",
    "vox/monu1.vox",
    "vox/monu10.vox",
    "vox/monu9.vox",
    "vox/nature.vox",
    "vox/shelf.vox",
    "vox/teapot.vox",
    "vox/anim/T-Rex.vox",
    "vox/anim/deer.vox",
    "vox/anim/horse.vox",
    "vox/chr/chr_fox.vox",
    "vox/chr/chr_gumi.vox",
    "vox/chr/chr_man.vox",
    "vox/chr/chr_poem.vox",
];


var _g;
if (_g === undefined) _g = {};

window.onload = function () {
    // var voxURL = voxURL_list[parseInt(Math.random() * voxURL_list.length)];
    var voxURL = VOX_URL_LIST[2];


    fetchVoxBuffer(voxURL).then(function (voxBuffer) {
        var vox = new VoxModel(voxBuffer);
        console.info(vox);
        testThree(vox);
    });
};

function fetchVoxBuffer(voxURL) {
    return fetch(voxURL).then(function (response) {
        if (response.ok) {
            return response.arrayBuffer();
        } else {
            console.error('Network response was not ok.');
        }
    });
}
function fetchVox(voxURL, func) {
    fetchVoxBuffer(voxURL).then(function (voxBuffer) {
        var vox = new VoxModel(voxBuffer);
        if (typeof (func) === "function") {
            func(vox);
        }
    });
}


function testThree(vox) {
    var elContainer = document.getElementById("voxel-container");

    _g.voxelViewer = new VoxelViewer(vox, elContainer);

    // UI
    {
        var cubeRanderer = _g.voxelViewer.cubeRenderer;
        var treeHelper = _g.voxelViewer.threeHelper;
        var voxelJS = _g.voxelViewer.voxelJS;

        // 是否显示Face
        var el_showfacets = document.getElementById("showfacets");
        el_showfacets.checked = true;
        el_showfacets.addEventListener('click', function () {
            voxelJS.showfacets(el_showfacets.checked);
        }, false);

        // 是否显示边框
        var el_showedges = document.getElementById("showedges");
        el_showedges.checked = true;
        el_showedges.addEventListener('click', function () {
            voxelJS.showedges(el_showedges.checked);
        }, false);
        el_showedges.click();

        // 网格化方式选择器
        var _el_mesher = document.getElementById("mesher");
        for (var alg in VoxelJS.MESHERS) {
            _el_mesher.add(new Option(alg, alg), null);
        }
        _el_mesher.onchange = function () {
            voxelJS.changeMesher(_el_mesher.value);
        };
        treeHelper.addLowAnimateFunc(function () {
            updateSelectValue(_el_mesher, voxelJS.meshersName);
        });


        // 顶点数和Face数
        var el_vertcount = document.getElementById("vertcount");
        var el_facecount = document.getElementById("facecount");
        treeHelper.addLowAnimateFunc(function () {
            el_vertcount.value = voxelJS.verticeCount();
            el_facecount.value = voxelJS.faceCount();
        });


        // VoxModel 选择器
        var el_VoxDataSource = document.getElementById("datasource_vox");
        VOX_URL_LIST.forEach(function (voxURL) {
            var name = voxURL.slice(4);
            var opt = new Option(name, voxURL);
            el_VoxDataSource.add(opt, null);
        });
        el_VoxDataSource.onchange = function () {
            var voxURL = el_VoxDataSource.value;
            var cubeRanderer = _g.voxelViewer.cubeRenderer;
            fetchVox(voxURL, function (vox) {
                cubeRanderer.setVox(vox);
            });
        };


        // testdata.js

        var _testdata = createTestData();

        var _el_datasource = document.getElementById("datasource");
        for (var id in _testdata) {
           _el_datasource.add(new Option(id, id), null);
        }
       _el_datasource.onchange = function () {
            // 获得Voxel数据
            var data = _testdata[_el_datasource.value];
            if (typeof(data) === "function") {
                data = data();
            }

            voxelJS.setVoxelData(data);
        };
    }

}

function updateSelectValue(elSelect, newValue) {
    if (newValue === elSelect.value)  return -1;

    for (var i = 0; i < elSelect.options.length; i++) {
        if (elSelect.options[i].text === newValue) {
            elSelect.selectedIndex = i;
            return i;
        }
    }
    return -1;
}