/**
 * eduDataBaseEdit.jsp的js文件，包括查询，编辑操作
 */
var eduDataBaseEdit = avalon.define({
    $id: "eduDataBaseEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    dictType:$.dictType,
    ieditor:'',//富文本序号
    eduBaseId:'',//实体id
    allThemeType:[],//字典主题类型数据
    deleteFileIds: [], // 删除的文件ID列表
    withDeleteFile: true,
    layeditFiles:[],//富文本的文件附件图片
    layeditDelFiles:[],//富文本删除的文件附件图片
});

layui.use(['index','layedit'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var form=layui.form;
        //所有的入口事件写在这里...
        eduDataBaseEdit.eduBaseId = GetQueryString("id");  //接收变量
        //获取字典数据
        eduDataBaseEdit.allThemeType = getSysDictMap($.dictType.ThemeType);
        initEdit();
        //获取实体信息
        getInfo(eduDataBaseEdit.eduBaseId,function(data){
            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            var htmlTheme ='<option value=""></option>';
            $.each(eduDataBaseEdit.allThemeType,function(i,item){
                if(data.eduBaseType == item.dictBizCode){
                    htmlTheme+='<option value="'+item.value+'">'+item.name+'</option>';
                }
            });
            $("select[name='themeType']").html(htmlTheme);

            form.val('eduDataBaseEdit_form', data);
            /**
             * 设置编辑器内容
             * @param {[type]} index 编辑器索引
             * @param {[type]} content 要设置的内容
             * @param {[type]} flag 是否追加模式
             */
            var layedit = layui.layedit;
            if(isNotEmpty(data.eduBaseContent)){
                layedit.setContent(eduDataBaseEdit.ieditor, data.eduBaseContent, false);
            }

            initUpload(data.eduImages);

        });
        //监控下拉
        filterSelect();
        avalon.scan();
    });
});


/**
 * 监控下拉选项
 */
function filterSelect() {
    //监控教育类型，联动主题类型
    var form=layui.form;
    form.on('select(eduBaseType)', function(data){
        if(isNotEmpty(data.value)){
            //清空数据，重新绑定值
            form.val('eduDataBaseEdit_form', {"themeType":""});
            var htmlTheme ='<option value=""></option>';
            $.each(eduDataBaseEdit.allThemeType,function(i,item){
                if(data.value == item.dictBizCode){
                    htmlTheme+='<option value="'+item.value+'">'+item.name+'</option>';
                }
            });
            $("select[name='themeType']").html(htmlTheme);

            debugger
            //刷新表单渲染
            form.render();
        }
    });
}

/**
 * 初始化富文本
 */
function initEdit() {
    var layedit = layui.layedit;
    layedit.set({
        //暴露layupload参数设置接口 --详细查看layupload参数说明
        uploadImage: {
            url: $.config.services.logistics + '/eduDataBase/uploadFile.do',
            accept: 'image',
            acceptMime: 'image/*',
            method: 'post',
            exts: 'jpg|png|gif|bmp|jpeg',
            size: '10240',
            done: function(data){
                eduDataBaseEdit.layeditFiles.push(data.data);
            }
        }
        , uploadVideo: {
            url: $.config.services.logistics + '/eduDataBase/uploadFile.do',
            accept: 'video',
            acceptMime: 'video/*',
            method: 'post',
            exts: 'mp4|flv|avi|rm|rmvb|mkv',
            size: '20480',
            done: function(data){
                eduDataBaseEdit.layeditFiles.push(data.data);
            }
        }
        , uploadFiles: {
            url: $.config.services.logistics + '/eduDataBase/uploadFile.do',
            accept: 'file',
            method: 'post',
            acceptMime: 'file/*',
            size: '20480',
            done: function(data){
                eduDataBaseEdit.layeditFiles.push(data.data);
            }
        }

        //右键删除图片/视频时的回调参数，post到后台删除服务器文件等操作，
        //传递参数：
        //图片： imgpath --图片路径
        //视频： filepath --视频路径 imgpath --封面路径
        , calldel: {
            url: $.config.services.logistics + '/eduDataBase/deleteFile.do',
            done: function (res) {
                var data = JSON.parse(res);
                var filepath =data.data.filepath;
                var imgpath = data.data.imgpath;
                if(isNotEmpty(filepath)){
                    eduDataBaseEdit.layeditDelFiles.push(filepath);
                }
                if(isNotEmpty(imgpath)){
                    eduDataBaseEdit.layeditDelFiles.push(imgpath);
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
        , fontFomatt:["tem"]  //自定义段落格式
        , tool: ['html','undo','redo' ,'code', 'strong', 'italic', 'underline', 'del','addhr' ,'|', 'fontFomatt','fontfamily','fontSize'
            , 'colorpicker', 'fontBackColor', 'face', '|', 'left', 'center', 'right', '|', 'link', 'unlink','image','images', 'image_alt'
            , 'attachment', 'video' ,'anchors' , '|', 'table','customlink','fullScreen','preview']
        , height: 500

    });
    eduDataBaseEdit.ieditor = layedit.build('eduBaseContent');
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
            "eduBaseId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/eduDataBase/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
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
    layui.layedit.sync(eduDataBaseEdit.ieditor);
    var form=layui.form; //调用layui的form模块
    form.on('submit(eduDataBaseEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#eduDataBaseEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field; //表单的元素
        var url = "";

        param.layeditFiles = JSON.stringify(eduDataBaseEdit.layeditFiles);
        param.layeditDelFiles = eduDataBaseEdit.layeditDelFiles.toString();

        //可以继续添加需要上传的参数
        if(isEmpty(eduDataBaseEdit.eduBaseId)){
            url = $.config.services.logistics + "/eduDataBase/save.do";
        }else{
            url = $.config.services.logistics + "/eduDataBase/edit.do";
        }
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data:param,
            dataType: "json",
            done:function(data){
                //返回的主键不为空  则把上传图片记录入库
                var saveSuccess = true;
                if (isNotEmpty(data.eduBaseId)) {
                    saveSuccess = uploadImgRecord(data.eduBaseId);
                }
                if (saveSuccess) {
                    typeof $callback === 'function' && $callback(data); //返回一个回调事件
                }
            }
        });
    });
}


/**
 * 图片上传记录入库
 */
function uploadImgRecord(id) {
    // 获取待添加的文件列表
    var addFiles = [];
    var itemsData = uploadImgObj.config.getItemsData();
    $.each(itemsData, function (index, item) {
        if (isEmpty(item.fileId)) {
            addFiles.push(item);
        }
    });
    var saveSuccess = false;
    var param = {
        objectId: id,
        addFiles: addFiles,
        deleteFileIds: eduDataBaseEdit.deleteFileIds
    };
    if (addFiles.length == 0 && eduDataBaseEdit.deleteFileIds.length == 0) {  //没有上传和删除文件
        return true;
    }
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.logistics + '/eduDataBase/saveImage.do',
        data:JSON.stringify(param),
        dataType: "json",
        contentType: "application/json; charset=utf-8", //此设置后台可接受复杂参数，后台接收需要@RequestBody标签
        async: false,
        done:function(data){
            saveSuccess = true;
            //返回的主键不为空  则把上传图片记录入库
        }
    });
    return saveSuccess;
}

//图片上传
function initUpload(fileDatas) {
    fileDatas = fileDatas || [];
    uploadImgObj = _layuiUploadImg({
        elem: '#uploadImg'
        , url: $.config.services.logistics + '/eduDataBase/uploadImage.do'
        , accept: 'images'
        , method: 'post'
        , multiple: true
        , number: 1
        , acceptMime: 'image/*'
        , done: function (res) {
            //...上传成功后的事件
        }
        , showFileDiv: "#showImgDiv"
        , fileDatas: fileDatas
        , withDelete: eduDataBaseEdit.withDeleteFile
        , deleteItemCallack: function (deleteItemData, deleteItemObj) {
            if (isEmpty(deleteItemData.fileId) && isNotEmpty(deleteItemData.filePath)) {
                // 未保存文件记录的文件直接删除
                var deleteSuccess = baseFuncInfo.onDeleteTempFile(deleteItemData.filePath);
                if (deleteSuccess) {
                    deleteItemObj.remove();
                }
            } else {
                // 已保存记录的文件先记录删除文件记录ID，保存是进行逻辑删除
                eduDataBaseEdit.deleteFileIds.push(deleteItemData.fileId);
                deleteItemObj.remove();
            }
        }
    });
}
