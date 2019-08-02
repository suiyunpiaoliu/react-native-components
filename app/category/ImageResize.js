function base64ToArrayBuffer(base64) {
    base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '').substring(0, 70);
    var binary = window.atob(base64);
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
    }
    return buffer;
}
// 步骤二，Unicode码转字符串
// ArrayBuffer对象 Unicode码转字符串
function getStringFromCharCode(dataView, start, length) {
    var str = '';
    var i;
    for (i = start, length += start; i < length; i++) {
        str += String.fromCharCode(dataView.getUint8(i));
    }
    return str;
}

// 步骤三，获取jpg图片的exif的角度（在ios体现最明显）
function getOrientation(base64) {
    let arrayBuffer = base64ToArrayBuffer(base64)
    var dataView = new DataView(arrayBuffer);
    var length = dataView.byteLength;
    var orientation;
    var exifIDCode;
    var tiffOffset;
    var firstIFDOffset;
    var littleEndian;
    var endianness;
    var app1Start;
    var ifdStart;
    var offset;
    var i;
    // Only handle JPEG image (start by 0xFFD8)
    if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
        offset = 2;
        while (offset < length) {
            if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
                app1Start = offset;
                break;
            }
            offset++;
        }
    }
    if (app1Start) {
        exifIDCode = app1Start + 4;
        tiffOffset = app1Start + 10;
        if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
            endianness = dataView.getUint16(tiffOffset);
            littleEndian = endianness === 0x4949;

            if (littleEndian || endianness === 0x4D4D /* bigEndian */ ) {
                if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
                    firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

                    if (firstIFDOffset >= 0x00000008) {
                        ifdStart = tiffOffset + firstIFDOffset;
                    }
                }
            }
        }
    }
    if (ifdStart) {
        length = dataView.getUint16(ifdStart, littleEndian);

        for (i = 0; i < length; i++) {
            offset = ifdStart + i * 12 + 2;
            if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */ ) {

                // 8 is the offset of the current tag's value
                offset += 8;

                // Get the original orientation value
                orientation = dataView.getUint16(offset, littleEndian);

                // Override the orientation with its default value for Safari (#120)
                let isSafari = window.navigator.userAgent.toLowerCase().indexOf('safrari') != -1
                if (isSafari) {
                    dataView.setUint16(offset, 1, littleEndian);
                }
                break;
            }
        }
    }
    return orientation;
}

function compress(img) {
    var a = navigator.userAgent;
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');
    //瓦片canvas
    let tCanvas = document.createElement("canvas");
    let tctx = tCanvas.getContext("2d");
    let initSize = img.src.length;
    let width = img.width;
    let height = img.height;
    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    let ratio;
    if ((ratio = width * height / 2000000) > 1) {
        console.log("大于400万像素")
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
    } else {
        ratio = 1;
    }

    canvas.width = width;
    canvas.height = height;
    //        铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //如果图片像素大于100万则使用瓦片绘制
    let count;
    if ((count = width * height / 100000) > 1) {
        console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        console.log(nw);
        console.log(nh);
        tCanvas.width = nw;
        tCanvas.height = nh;

        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                let image = new Image();
                image.src = img.src;
                tctx.drawImage(image, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                rotateImg(image,canvas);
            }
        }
    } else {
        let image = new Image();
        image.src = img.src;
        ctx.drawImage(image, 0, 0, width, height);
        rotateImg(image,canvas);
    }
    //进行最小压缩
    let ndata = canvas.toDataURL('image/jpeg', 0.3);
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

    return ndata;
}
function rotateImg(img, canvas) {
    let height = img.height;
    let width = img.width;
    let orientation = getOrientation(img.src)
    let ctx = canvas.getContext('2d');
    orientation = 8
    switch (orientation) {
        case 1: //0
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
        case 3: //180
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(180*Math.PI/180);
            ctx.drawImage(img, -width, -height);
            break;
        case 6://90
            canvas.width = height ;
            canvas.height = width;
            ctx.rotate(-90*Math.PI/180);
            ctx.drawImage(img, -width, 0);
            break;
        case 8://-90
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(90*Math.PI/180);
            ctx.drawImage(img, -0, -height);
            break;
    }
}