/**
 * bacAstrictInfectEdit.jsp的js文件，包括查询，编辑操作
 * @author Chauncey
 * @date 2020/08/25
 * @description 感控制度编辑页面。
 * @version 1.0
 */
var bacAstrictInfectEdit = avalon.define({
    $id: "bacAstrictInfectEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    editIndex:"",//富文本序号
    layeditFiles:[],//富文本的文件附件图片
    layeditDelFiles:[],//富文本删除的文件附件图片
});

layui.use(['index','layedit'],function(){
    /*layui.use('layedit', function(){
        var layedit = layui.layedit;
        bacAstrictInfectEdit.editIndex = layedit.build('content'); //建立编辑器

    });*/
    initEdit();
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var form=layui.form;
        //所有的入口事件写在这里...
        var id=GetQueryString("id");  //接收变量
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            form.val('bacAstrictInfectEdit_form', data);
            /**
             * 设置编辑器内容
             * @param {[type]} index 编辑器索引
             * @param {[type]} content 要设置的内容
             * @param {[type]} flag 是否追加模式
             */
            var layedit = layui.layedit;
            layedit.setContent(bacAstrictInfectEdit.editIndex, data.content, false);
        });
        avalon.scan();
    });
});

/**
 * 初始化富文本
 */
function initEdit() {
    var layedit = layui.layedit;
    layedit.set({
        //暴露layupload参数设置接口 --详细查看layupload参数说明
        uploadImage: {
            url: $.config.services.logistics + '/bacAstrictInfect/uploadFile.do',
            accept: 'image',
            acceptMime: 'image/*',
            method: 'post',
            exts: 'jpg|png|gif|bmp|jpeg',
            size: '10240',
            done: function(data){
                bacAstrictInfectEdit.layeditFiles.push(data.data);
            }
        }
        , uploadVideo: {
            url: $.config.services.logistics + '/bacAstrictInfect/uploadFile.do',
            accept: 'video',
            acceptMime: 'video/*',
            method: 'post',
            exts: 'mp4|flv|avi|rm|rmvb',
            size: '20480',
            done: function(data){
                bacAstrictInfectEdit.layeditFiles.push(data.data);
            }
        }
        , uploadFiles: {
            url: $.config.services.logistics + '/bacAstrictInfect/uploadFile.do',
            accept: 'file',
            method: 'post',
            acceptMime: 'file/*',
            size: '20480',
            done: function(data){
                bacAstrictInfectEdit.layeditFiles.push(data.data);
            }
        }

        //右键删除图片/视频时的回调参数，post到后台删除服务器文件等操作，
        //传递参数：
        //图片： imgpath --图片路径
        //视频： filepath --视频路径 imgpath --封面路径
        , calldel: {
            url: $.config.services.logistics + '/bacAstrictInfect/deleteFile.do',
            done: function (res) {
                var data = JSON.parse(res);
                var filepath =data.data.filepath;
                var imgpath = data.data.imgpath;
                if(isNotEmpty(filepath)){
                    bacAstrictInfectEdit.layeditDelFiles.push(filepath);
                }
                if(isNotEmpty(imgpath)){
                    bacAstrictInfectEdit.layeditDelFiles.push(imgpath);
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
    bacAstrictInfectEdit.editIndex = layedit.build('content');
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
            "astrictInfectId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/bacAstrictInfect/getInfo.do",
            data:param,
            dataType: "json",
            async:false,
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                form.val('bacAstrictInfectEdit_form', data);
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
    form.on('submit(bacAstrictInfectEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacAstrictInfectEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    layui.layedit.sync(bacAstrictInfectEdit.editIndex);
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field; //表单的元素
        var url = '';

        param.layeditFiles = JSON.stringify(bacAstrictInfectEdit.layeditFiles);
        param.layeditDelFiles = bacAstrictInfectEdit.layeditDelFiles.toString();

        if (param.astrictInfectId.length == 0) {
            url = $.config.services.logistics + "/bacAstrictInfect/save.do"
        } else {
            url = $.config.services.logistics + "/bacAstrictInfect/edit.do"
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}




