/**
 * 使用手册-编辑
 * @author: Gerald
 * @version: 1.0
 * @date: 2020/10/07
 */
var uploadFileObj;
var sysUserManualEdit = avalon.define({
    $id: "sysUserManualEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    readonly: {readonly: false} ,// 设置只读
    editIndex:"", //富文本序号
    ieditor:'',//富文本序号
    allThemeType:[],//字典主题类型数据
    deleteFileIds: [], // 删除的附件ID列表
    withDeleteFile: true,
    layeditFiles:[],//富文本的文件附件图片
    layeditDelFiles:[],//富文本删除的文件附件图片
});

layui.use(['index','layedit'],function(){
    initEdit();
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id=GetQueryString("id");  //接收变量
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        //详情设置只读属性
        if (layEvent === 'detail') {
            sysUserManualEdit.readonly = {readonly: true};
            $('input[type="radio"]').prop('disabled', true);
            $('#uploadFile').css('display', 'none');    //隐藏上传按钮
        }
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            initFileUpload(data.files);
            initEdit();
        });

        avalon.scan();
    });
});

/**
 * 上传附件
 */
function initFileUpload(fileDatas) {
    fileDatas = fileDatas || [];
    uploadFileObj = _layuiUploadFile({
        elem: '#uploadFile'
        , url: $.config.services.system + '/sysUserManual/uploadAnnex.do'
        , accept: 'file'
        , method: 'post'
        , multiple: true
        , number: 9
        , done: function (res) {
            //...上传成功后的事件
        }
        , showFileDiv: "#fileShowDiv"
        , fileDatas: fileDatas
        , withDelete: sysUserManualEdit.withDeleteFile
        , deleteItemCallack: function (deleteItemData, deleteItemObj) {
            if (isEmpty(deleteItemData.fileId) && isNotEmpty(deleteItemData.filePath)) {
                // 未保存文件记录的文件直接删除
                var deleteSuccess = baseFuncInfo.onDeleteTempFile(deleteItemData.filePath);
                if (deleteSuccess) {
                    deleteItemObj.remove();
                }
            } else {
                // 已保存记录的文件先记录删除文件记录ID，保存是进行逻辑删除
                sysUserManualEdit.deleteFileIds.push(deleteItemData.fileId);
                deleteItemObj.remove();
            }
        }
    });
}

/**
 * 初始化富文本
 */
function initEdit() {
    var layedit = layui.layedit;
    layedit.set({
        uploadImage: {
            url: $.config.services.system + '/sysUserManual/uploadFile.do',
            accept: 'image',
            acceptMime: 'image/*',
            method: 'post',
            exts: 'jpg|png|gif|bmp|jpeg',
            size: '10240',
            done: function(data){
                sysUserManualEdit.layeditFiles.push(data.data);
            }
        }
        , uploadVideo: {
            url: $.config.services.system + '/sysUserManual/uploadFile.do',
            accept: 'video',
            acceptMime: 'video/*',
            method: 'post',
            exts: 'mp4|flv|avi|rm|rmvb',
            size: '20480',
            done: function(data){
                sysUserManualEdit.layeditFiles.push(data.data);
            }
        }
        , uploadFiles: {
            url: $.config.services.system + '/sysUserManual/uploadFile.do',
            accept: 'file',
            method: 'post',
            acceptMime: 'file/*',
            size: '20480',
            done: function(data){
                sysUserManualEdit.layeditFiles.push(data.data);
            }
        }

        //右键删除图片/视频时的回调参数，post到后台删除服务器文件等操作，
        //传递参数：
        //图片： imgpath --图片路径
        //视频： filepath --视频路径 imgpath --封面路径
        , calldel: {
            url: $.config.services.system + '/sysUserManual/deleteFile.do',
            done: function (res) {
                var data = JSON.parse(res);
                var filepath =data.data.filepath;
                var imgpath = data.data.imgpath;
                if(isNotEmpty(filepath)){
                    sysUserManualEdit.layeditDelFiles.push(filepath);
                }
                if(isNotEmpty(imgpath)){
                    sysUserManualEdit.layeditDelFiles.push(imgpath);
                }
            }
        }

        //开发者模式 --默认为false
        , devmode: true
        ,autoSync:true //自动同步到textarea文本域设置，默认为false
        //插入代码设置
        , codeConfig: {
            hide: true,  //是否显示编码语言选择框
            default: 'javascript' //hide为true时的默认语言格式
        }
        , tool: ['html','undo','redo' ,'code', 'strong', 'italic', 'underline', 'del','addhr' ,'|', 'fontFomatt','fontfamily','fontSize'
            , 'colorpicker', 'fontBackColor', 'face', '|', 'left', 'center', 'right', '|', 'link', 'unlink','image','images', 'image_alt'
            , 'attachment', 'video' ,'anchors' , '|', 'table','customlink','fullScreen','preview']
        , height: 500

    });
    sysUserManualEdit.editIndex = layedit.build('remarks');//content

}

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getInfo(id,$callback){
    if(isEmpty(id)){
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    }else{
        //编辑
        var param={
            "manualId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.system+"/sysUserManual/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                form.val('sysUserManualEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件

            }
        });
    }
}
/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(sysUserManualEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#sysUserManualEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    layui.layedit.sync(sysUserManualEdit.editIndex);

    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field; //表单的元素
        param.layeditFiles = JSON.stringify(sysUserManualEdit.layeditFiles);
        param.layeditDelFiles = sysUserManualEdit.layeditDelFiles.toString();
        var url = '';
        if (param.manualId.length == 0) {
            url = $.config.services.system+"/sysUserManual/add.do";
        } else {
            url = $.config.services.system+"/sysUserManual/edit.do";
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url:  url,
            data:param,
            dataType: "json",
            done:function(data){
                //返回的主键不为空  则把上传图片记录入库
                var saveSuccess = true;
                if (isNotEmpty(data.manualId)) {
                    saveSuccess = uploadFileRecord(data.manualId);
                }
                if (saveSuccess) {
                    parent.setManunalId(data.manualId);
                    typeof $callback === 'function' && $callback(data); //返回一个回调事件
                }
            }
        });
    });
}
/**
 * 文件上传记录入库
 */
function uploadFileRecord(id) {
    // 获取待添加的文件列表
    var addFiles = [];
    var itemsData = uploadFileObj.config.getItemsData();
    $.each(itemsData, function (index, item) {
        if (isEmpty(item.fileId)) {
            addFiles.push(item);
        }
    });

    var saveSuccess = false;
    var param = {
        objectId: id,
        addFiles: addFiles,
        deleteFileIds: sysUserManualEdit.deleteFileIds
    };

    if (addFiles.length == 0 && sysUserManualEdit.deleteFileIds.length == 0) {  //没有上传和删除文件
        return true;
    }

    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + '/sysUserManual/saveFile.do',
        data: JSON.stringify(param),
        dataType: "json",
        contentType: "application/json; charset=utf-8", //此设置后台可接受复杂参数，后台接收需要@RequestBody标签
        async: false,
        done: function(data) {
            saveSuccess = true;
        }
    });
    return saveSuccess;
}



