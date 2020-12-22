/**
 * 文件上传示例
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/13
 */
var uploadImgObj;
var uploadFileObj;
var fileUpload = avalon.define({
    $id: "fileUpload"
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        initUploadImg();
        initUploadFile();
        avalon.scan();
    });
});

/**
 * 初始化图片上传控件
 */
function initUploadImg() {
    uploadImgObj = _layuiUploadImg({
        elem: '#uploadImg',
        url: $.config.services.system + '/system/uploadVascularInspectImage.do',
        accept: 'images',
        method: 'post',
        multiple: true,
        number: 5,
        data: {module: "InspectImage"},  //必须填，请求上传接口的额外参数。如：data: {id: 'xxx'}
        acceptMime: 'image/*',
        done: function (res) {
            //...上传成功后的事件
        },

        elem: '#uploadImg',
        showFileDiv: "#showImgDiv",
        fileDatas: [
            { fileId: "1", objectId: "", objectType: "", objectType: "", fileTag: "", fileTitle: "图片1", mimeType: "", filePath: $.config.server + "/static/images/login-banner-1.jpg", hospitalNo: "" },
            { fileId: "2", objectId: "", objectType: "", objectType: "", fileTag: "", fileTitle: "图片2", mimeType: "", filePath: $.config.server + "/static/images/backgrounds.jpg", hospitalNo: "" },
            { fileId: "3", objectId: "", objectType: "", objectType: "", fileTag: "", fileTitle: "图片3", mimeType: "", filePath: $.config.server + "/static/images/dryweight.jpg", hospitalNo: "" },
        ],
        withDelete: true,
        deleteItemCallack: function (deleteItemData, deleteItemObj) {
            if (isEmpty(deleteItemData.fileId) && isNotEmpty(deleteItemData.filePath)) {
                // 未保存文件记录的文件直接删除
                console.log("删除文件", deleteItemData.filePath);
                var deleteSuccess = onDeleteFile(deleteItemData.filePath);
                if (deleteSuccess) {
                    deleteItemObj.remove();
                }
            } else {
                // 已保存记录的文件先记录删除文件记录ID，保存是进行逻辑删除
                console.log("删除项", deleteItemData, deleteItemData.fileId);
                deleteItemObj.remove();
            }
        }
    });
}

/**
 * 保存上传图片
 */
function onSaveUploadImg() {
    var itemsData = uploadImgObj.config.getItemsData();
    $("#showUploadImg").html(JSON.stringify(itemsData));
}

/**
 * 初始化文件上传控件
 */
function initUploadFile() {
    uploadFileObj = _layuiUploadFile({
        elem: '#uploadFile',
        url: $.config.services.system + '/system/uploadVascularTherapyFile.do',
        accept: 'file',
        method: 'post',
        multiple: true,
        number: 5,
        data: {module: "InspectImage"},  //必须填，请求上传接口的额外参数。如：data: {id: 'xxx'}
        // acceptMime: 'image/*',
        done: function (res) {
            //...上传成功后的事件
        },

        showFileDiv: "#showFileDiv",
        fileDatas: [
            { fileId: "1", objectId: "", objectType: "", objectType: "", fileTag: "", fileTitle: "文件1文件1文件1文件1文件1文件1文件1文件1文件1文件1文件1文件1文件1文件1", mimeType: "", filePath: $.config.server + "/static/images/login-banner-1.jpg", hospitalNo: "" },
            { fileId: "2", objectId: "", objectType: "", objectType: "", fileTag: "", fileTitle: "文件2", mimeType: "", filePath: $.config.server + "/static/images/backgrounds.jpg", hospitalNo: "" },
            { fileId: "3", objectId: "", objectType: "", objectType: "", fileTag: "", fileTitle: "文件3", mimeType: "", filePath: $.config.server + "/static/images/dryweight.jpg", hospitalNo: "" },
        ],
        withDelete: true,
        deleteItemCallack: function (deleteItemData, deleteItemObj) {
            if (isEmpty(deleteItemData.fileId) && isNotEmpty(deleteItemData.filePath)) {
                // 未保存文件记录的文件直接删除
                console.log("删除文件", deleteItemData.filePath);
                var deleteSuccess = onDeleteFile(deleteItemData.filePath);
                if (deleteSuccess) {
                    deleteItemObj.remove();
                }
            } else {
                // 已保存记录的文件先记录删除文件记录ID，保存是进行逻辑删除
                console.log("删除项", deleteItemData, deleteItemData.fileId);
                deleteItemObj.remove();
            }
        }
    });
}

/**
 * 保存上传文件
 */
function onSaveUploadFile() {
    var itemsData = uploadFileObj.config.getItemsData();
    $("#showUploadFile").html(JSON.stringify(itemsData));
}


//图片上传
function initUpload(fileUrl) {
    var filePath = isEmpty(fileUrl) ? '' : fileUrl;
    _layuiUpload({
        elem: '#uploadImg'
        , showImgDiv: "#showImgDiv"  //自定义字段，可选，用来显示上传后的图片的div
        , showHttpPath: getHttpPath()  //自定义字段，可选，用于拼接显示图片的http映射路径，比如http:192.168.1.126:8081
        , showImgSrc: filePath  //自定义字段，可选，在div显示图片的src，通常用于编辑后的回显，相对路径，比如‘/upload/XXX/XXX.jpg’
        , url: $.config.services.system + '/system/uploadFile.do' //统一调用公用的系统方法
        , accept: 'images'
        , method: 'post'
        , multiple: true
        , number: 5
        , data: {module: "InspectImage"}  //必须填，请求上传接口的额外参数。如：data: {id: 'xxx'}
        , acceptMime: 'image/*'
        , done: function (res) {
            //...上传成功后的事件
        }
    });
}

function onDeleteFile(filePath) {
    var deleteSucess = false;
    _ajax({
        type: "POST",
        url: $.config.services.system + "/system/deleteFile.do",
        data: {filePath: filePath},
        dataType: "json",
        async: false,
        done: function(data) {
            successToast("删除文件成功");
            deleteSucess = true;
        }
    });
    return deleteSucess;
}



