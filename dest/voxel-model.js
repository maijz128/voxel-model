/**
 * Auther: MaiJZ
 * Date: 2017/7/22
 * Github: https://github.com/maijz128
 */
var VoxModel = (function () {
    /**
     * @param voxBuffer
     */
    function VoxModel(voxBuffer) {
        this.id = ""; //  Default: "VOX "
        this.version = 0; //  Default: 150
        this.byteLength = 0;
        var self = this;
        //self._voxBuffer = voxBuffer;
        self.byteLength = voxBuffer.byteLength;
        try {
            self.id = VoxToolkit.buffer2String({ buffer: voxBuffer, begin: 0, end: 4 });
            self.version = VoxToolkit.buffer2Int({ buffer: voxBuffer, begin: 4, end: 8 });
            self.MAIN = new VoxChunk(voxBuffer.slice(8));
        }
        catch (err) {
            console.error(err);
        }
    }
    VoxModel.prototype._Palette = function () {
        var RGBA = this.MAIN["RGBA"];
        if (RGBA) {
            return RGBA.palette;
        }
        else {
            return VoxModel.default_palette;
        }
    };
    ;
    VoxModel.prototype.getPalette_strHexRGBA = function (index) {
        var palette = this._Palette();
        var numColor = palette[index];
        var strColor = numColor.toString(16);
        strColor = strColor.split("").reverse().join(""); //  反转
        return strColor;
    };
    ;
    VoxModel.prototype.getPalette_Hex = function (index) {
        var color = this.getPalette_strHexRGBA(index);
        color = color.slice(0, 6); // 去掉透明度
        return parseInt(color, 16);
    };
    ;
    return VoxModel;
}());
// Default Palette : if chunk 'RGBA' is absent
VoxModel.default_palette = [
    0x00000000, 0xffffffff, 0xffccffff, 0xff99ffff, 0xff66ffff, 0xff33ffff, 0xff00ffff, 0xffffccff, 0xffccccff, 0xff99ccff, 0xff66ccff, 0xff33ccff, 0xff00ccff, 0xffff99ff, 0xffcc99ff, 0xff9999ff,
    0xff6699ff, 0xff3399ff, 0xff0099ff, 0xffff66ff, 0xffcc66ff, 0xff9966ff, 0xff6666ff, 0xff3366ff, 0xff0066ff, 0xffff33ff, 0xffcc33ff, 0xff9933ff, 0xff6633ff, 0xff3333ff, 0xff0033ff, 0xffff00ff,
    0xffcc00ff, 0xff9900ff, 0xff6600ff, 0xff3300ff, 0xff0000ff, 0xffffffcc, 0xffccffcc, 0xff99ffcc, 0xff66ffcc, 0xff33ffcc, 0xff00ffcc, 0xffffcccc, 0xffcccccc, 0xff99cccc, 0xff66cccc, 0xff33cccc,
    0xff00cccc, 0xffff99cc, 0xffcc99cc, 0xff9999cc, 0xff6699cc, 0xff3399cc, 0xff0099cc, 0xffff66cc, 0xffcc66cc, 0xff9966cc, 0xff6666cc, 0xff3366cc, 0xff0066cc, 0xffff33cc, 0xffcc33cc, 0xff9933cc,
    0xff6633cc, 0xff3333cc, 0xff0033cc, 0xffff00cc, 0xffcc00cc, 0xff9900cc, 0xff6600cc, 0xff3300cc, 0xff0000cc, 0xffffff99, 0xffccff99, 0xff99ff99, 0xff66ff99, 0xff33ff99, 0xff00ff99, 0xffffcc99,
    0xffcccc99, 0xff99cc99, 0xff66cc99, 0xff33cc99, 0xff00cc99, 0xffff9999, 0xffcc9999, 0xff999999, 0xff669999, 0xff339999, 0xff009999, 0xffff6699, 0xffcc6699, 0xff996699, 0xff666699, 0xff336699,
    0xff006699, 0xffff3399, 0xffcc3399, 0xff993399, 0xff663399, 0xff333399, 0xff003399, 0xffff0099, 0xffcc0099, 0xff990099, 0xff660099, 0xff330099, 0xff000099, 0xffffff66, 0xffccff66, 0xff99ff66,
    0xff66ff66, 0xff33ff66, 0xff00ff66, 0xffffcc66, 0xffcccc66, 0xff99cc66, 0xff66cc66, 0xff33cc66, 0xff00cc66, 0xffff9966, 0xffcc9966, 0xff999966, 0xff669966, 0xff339966, 0xff009966, 0xffff6666,
    0xffcc6666, 0xff996666, 0xff666666, 0xff336666, 0xff006666, 0xffff3366, 0xffcc3366, 0xff993366, 0xff663366, 0xff333366, 0xff003366, 0xffff0066, 0xffcc0066, 0xff990066, 0xff660066, 0xff330066,
    0xff000066, 0xffffff33, 0xffccff33, 0xff99ff33, 0xff66ff33, 0xff33ff33, 0xff00ff33, 0xffffcc33, 0xffcccc33, 0xff99cc33, 0xff66cc33, 0xff33cc33, 0xff00cc33, 0xffff9933, 0xffcc9933, 0xff999933,
    0xff669933, 0xff339933, 0xff009933, 0xffff6633, 0xffcc6633, 0xff996633, 0xff666633, 0xff336633, 0xff006633, 0xffff3333, 0xffcc3333, 0xff993333, 0xff663333, 0xff333333, 0xff003333, 0xffff0033,
    0xffcc0033, 0xff990033, 0xff660033, 0xff330033, 0xff000033, 0xffffff00, 0xffccff00, 0xff99ff00, 0xff66ff00, 0xff33ff00, 0xff00ff00, 0xffffcc00, 0xffcccc00, 0xff99cc00, 0xff66cc00, 0xff33cc00,
    0xff00cc00, 0xffff9900, 0xffcc9900, 0xff999900, 0xff669900, 0xff339900, 0xff009900, 0xffff6600, 0xffcc6600, 0xff996600, 0xff666600, 0xff336600, 0xff006600, 0xffff3300, 0xffcc3300, 0xff993300,
    0xff663300, 0xff333300, 0xff003300, 0xffff0000, 0xffcc0000, 0xff990000, 0xff660000, 0xff330000, 0xff0000ee, 0xff0000dd, 0xff0000bb, 0xff0000aa, 0xff000088, 0xff000077, 0xff000055, 0xff000044,
    0xff000022, 0xff000011, 0xff00ee00, 0xff00dd00, 0xff00bb00, 0xff00aa00, 0xff008800, 0xff007700, 0xff005500, 0xff004400, 0xff002200, 0xff001100, 0xffee0000, 0xffdd0000, 0xffbb0000, 0xffaa0000,
    0xff880000, 0xff770000, 0xff550000, 0xff440000, 0xff220000, 0xff110000, 0xffeeeeee, 0xffdddddd, 0xffbbbbbb, 0xffaaaaaa, 0xff888888, 0xff777777, 0xff555555, 0xff444444, 0xff222222, 0xff111111
];
/**
 Chunk Structure
 -------------------------------------------------------------------------------
 # Bytes  | Type       | Value
 -------------------------------------------------------------------------------
 1x4      | char       | chunk id
 4        | int        | num bytes of chunk content (N)
 4        | int        | num bytes of children chunks (M)
 N        |            | chunk content
 M        |            | children chunks
 -------------------------------------------------------------------------------
 *
 */
var VoxChunk = (function () {
    /**
     * @param buffer
     */
    function VoxChunk(buffer) {
        this.id = "";
        this.contentSize = 0;
        this.childrenSize = 0;
        this.content = null;
        this.children = null;
        this.byteLength = 0;
        var self = this;
        try {
            var iter = {
                begin: 0, end: 0,
                next: function () {
                    this.begin = this.end;
                    this.end = this.begin + 4;
                }
            };
            iter.next();
            self.id = VoxToolkit.buffer2String({ buffer: buffer, begin: iter.begin, end: iter.end });
            iter.next();
            self.contentSize = VoxToolkit.buffer2Int({ buffer: buffer, begin: iter.begin, end: iter.end });
            iter.next();
            self.childrenSize = VoxToolkit.buffer2Int({ buffer: buffer, begin: iter.begin, end: iter.end });
            if (self.contentSize > 0) {
                iter.begin = iter.end; // 12
                iter.end = iter.begin + self.contentSize;
                self.content = buffer.slice(iter.begin, iter.end);
            }
            if (self.childrenSize > 0) {
                iter.begin = iter.end; // 12 + self.contentSize;
                iter.end = iter.begin + self.childrenSize;
                var childrenBuf = buffer.slice(iter.begin, iter.end);
                self._Children(childrenBuf);
            }
            self.byteLength = iter.end;
            voxChunkHandler(self);
        }
        catch (err) {
            console.error(err);
        }
    }
    VoxChunk.prototype._Children = function (childrenBuf) {
        if (childrenBuf.byteLength <= 0)
            return;
        var self = this;
        self.children = [];
        var begin = 0;
        var buf = childrenBuf;
        while (begin < buf.byteLength) {
            var chunk = new VoxChunk(buf);
            self.children.push(chunk);
            begin = chunk.byteLength;
            buf = buf.slice(begin);
        }
    };
    return VoxChunk;
}());
function voxChunkHandler(chunk) {
    var ID_LIST = {
        MAIN: "MAIN", PACK: "PACK",
        SIZE: "SIZE", XYZI: "XYZI",
        RGBA: "RGBA", MATT: "MATT"
    };
    var handlerList = {
        MAIN: function (chunk) {
            chunk.PACK = null;
            chunk.RGBA = null;
            //  Chunk 'SIZE' and Chunk 'XYZI': {SIZE: VoxChunk, XYZI: VoxChunk}
            chunk.models = [];
            chunk.materials = []; //   Chunk 'MATT'
            for (var i = 0; i < chunk.children.length; i++) {
                var item = chunk.children[i];
                switch (item.id) {
                    case ID_LIST.PACK:
                        chunk.PACK = item;
                        break;
                    case ID_LIST.SIZE:
                        chunk.models.push({ SIZE: item, XYZI: null });
                        break;
                    case ID_LIST.XYZI:
                        var lastItem = chunk.models[chunk.models.length - 1];
                        lastItem.XYZI = item;
                        break;
                    case ID_LIST.RGBA:
                        chunk.RGBA = item;
                        break;
                    case ID_LIST.MATT:
                        chunk.materials.push(item);
                        break;
                }
            }
        },
        PACK: function (chunk) {
            chunk.numModels = VoxToolkit.buffer2Int({ buffer: chunk.content, begin: 0, end: 4 });
        },
        SIZE: function (chunk) {
            chunk.x = VoxToolkit.buffer2Int({ buffer: chunk.content, begin: 0, end: 4 });
            chunk.y = VoxToolkit.buffer2Int({ buffer: chunk.content, begin: 4, end: 8 });
            chunk.z = VoxToolkit.buffer2Int({ buffer: chunk.content, begin: 8, end: 12 });
            chunk.content = null;
        },
        XYZI: function (chunk) {
            var begin = 0, end = 4;
            chunk.numVoxels = VoxToolkit.buffer2Int({ buffer: chunk.content, begin: begin, end: end });
            //  item -> (x, y, z, colorIndex) : 1 byte for each component
            chunk.voxels = [];
            var XYZI_value;
            for (var i = 0; i < chunk.numVoxels; i++) {
                begin = end;
                end = begin + 4;
                // XYZI_value = VoxToolkit.buffer2Int(
                //     {buffer: chunk.content, begin: begin, end: end});
                XYZI_value = VoxToolkit.buffer2Uint8Arr({ buffer: chunk.content, begin: begin, end: end });
                chunk.voxels.push(XYZI_value);
            }
            chunk.content = null;
        },
        RGBA: function (chunk) {
            // Item -> (R, G, B, A) : 1 byte for each component
            chunk.palette = new Array(256);
            // color [0-254] are mapped to palette index [1-255]
            chunk.palette[0] = 0;
            var begin = 0, end = 4;
            for (var i = 0; i <= 254; i++) {
                var item = void 0;
                item = VoxToolkit.buffer2Int({ buffer: chunk.content, begin: begin, end: end });
                chunk.palette[i + 1] = item;
                begin = end;
                end = begin + 4;
            }
            chunk.content = null;
        },
        MATT: function (chunk) {
            var iter = {
                begin: 0, end: 0,
                next: function () {
                    this.begin = this.end;
                    this.end = this.begin + 4;
                }
            };
            iter.next();
            chunk.m_ID = VoxToolkit.buffer2Int({ buffer: chunk.content, begin: iter.begin, end: iter.end });
            iter.next();
            chunk.m_Type = VoxToolkit.buffer2Int({ buffer: chunk.content, begin: iter.begin, end: iter.end });
            iter.next();
            chunk.m_Weight = VoxToolkit.buffer2Float({ buffer: chunk.content, begin: iter.begin, end: iter.end });
            iter.next();
            chunk.m_Bits = VoxToolkit.buffer2Int({ buffer: chunk.content, begin: iter.begin, end: iter.end });
            chunk.m_Values = [];
            var valueCount = (chunk.contentSize - iter.end) / 4;
            for (var i = 0; i < valueCount; i++) {
                iter.next();
                var item = VoxToolkit.buffer2Float({ buffer: chunk.content, begin: iter.begin, end: iter.end });
                chunk.m_Values.push(item);
            }
            chunk.content = null;
        }
    };
    if (chunk.constructor === VoxChunk) {
        var func = handlerList[chunk.id];
        if (func) {
            func(chunk);
        }
        else {
            console.group("没有匹配的Chunk: " + chunk.id);
            console.info(chunk);
            console.groupEnd();
        }
    }
    return chunk;
}
var VoxToolkit = (function () {
    function VoxToolkit() {
    }
    VoxToolkit.buffer2String = function (options) {
        var result = "";
        try {
            var buf = options.buffer.slice(options.begin, options.end);
            result = String.fromCharCode.apply(null, new Uint8Array(buf));
        }
        catch (err) {
            console.error(err);
        }
        return result;
    };
    VoxToolkit.buffer2Int = function (options) {
        var result = 0;
        try {
            // let buf = options.buffer.slice(options.begin, options.end);
            var dataView = new DataView(options.buffer, options.begin, options.end - options.begin);
            result = dataView.getUint32(0, VoxToolkit.littleEndian);
        }
        catch (err) {
            console.error(err);
        }
        return result;
    };
    VoxToolkit.buffer2Float = function (options) {
        var result;
        try {
            var dataView = new DataView(options.buffer, options.begin, options.end - options.begin);
            result = dataView.getFloat32(0, VoxToolkit.littleEndian);
        }
        catch (err) {
            console.error(err);
        }
        return result;
    };
    VoxToolkit.buffer2Uint8Arr = function (options) {
        var result;
        try {
            var buf = options.buffer.slice(options.begin, options.end);
            result = new Uint8Array(buf);
        }
        catch (err) {
            console.error(err);
        }
        return result;
    };
    return VoxToolkit;
}());
// 判断计算机的字节序?小端字节序:大端字节序
VoxToolkit.littleEndian = function () {
    var buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true);
    return new Int16Array(buffer)[0] === 256;
}();
//# sourceMappingURL=voxel-model.js.map