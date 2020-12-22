/**
 * bacInfectTrainEdit.jsp的js文件，包括查询，编辑操作
 * @author Chauncey
 * @date 2020/08/27
 * @description 感控培训编辑页面。
 * @version 1.0
 */
var uploadFileObj;
var bacInfectTrainEdit = avalon.define({
    $id: "bacInfectTrainEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    comperes: [], //主持人下拉列表
    designers: [], //制定人下拉列表
    joinUsers: [], //计划参加人员
    currentUser:baseFuncInfo.userInfoData.userid, //当前登录者ID
    readonly:{readonly: false}, //只读
    disabled: {disabled: false}, //禁用
    fileUrl:"",//上传文件的目录
    fileTitle:"",//上传的文件名字
    mimeType:"",//上传的文件类型
    contentData:"",
    editIndex:"",
    deleteFileIds: [], // 删除的文件ID列表
    withDeleteFile: true,
    layeditFiles:[],//富文本的文件附件图片
    layeditDelFiles:[],//富文本删除的文件附件图片
});

layui.use(['index','formSelects','layedit'],function(){
    /*var layedit = layui.layedit;
    bacInfectTrainEdit.editIndex = layedit.build('content'); //建立编辑器*/
    initEdit();
    //获取计划参加人员
    getJoinUserList();
    //获取主持人列表
    getCompereList();
    //获取制定人列表
    getDesignerList();
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var form=layui.form;
        var laydate=layui.laydate;
        laydate.render({
            elem: '#planDate'
            ,type: 'date'
        });
        var id=GetQueryString("id");  //接收变量
        // 接收变量layEvent
        bacInfectTrainEdit.layEvent = GetQueryString("layEvent");
        if (bacInfectTrainEdit.layEvent === 'detail') {
            bacInfectTrainEdit.readonly = {readonly: true};
            bacInfectTrainEdit.disabled = {disabled:true};
            layui.formSelects.disabled();
            $('input[type="select"]').prop('disabled', true);
        }
        //判断是否是新增页面，如果是，就自动带出当前登陆者，填入支持人和制定人
        if(id==null){
            var currentUserArr = [];
            currentUserArr.push(bacInfectTrainEdit.currentUser);
            layui.formSelects.value('compere',currentUserArr); //多选下拉框赋值
            layui.formSelects.value('designer',currentUserArr); //多选下拉框赋值
        }
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            form.val('bacInfectTrainEdit_form', data);
            /**
             * 设置编辑器内容
             * @param {[type]} index 编辑器索引
             * @param {[type]} content 要设置的内容
             * @param {[type]} flag 是否追加模式
             */
            var layedit = layui.layedit;
            layedit.setContent(bacInfectTrainEdit.editIndex, data.content, false);

            if(isNotEmpty(data.joinUser)){
                layui.formSelects.value('joinUser',data.joinUser.split(',')); //多选下拉框赋值
            }
            if(isNotEmpty(data.compere)){
                var compereArr = [];
                compereArr.push(data.compere);
                layui.formSelects.value('compere',compereArr); //多选下拉框赋值
            }
            if(isNotEmpty(data.designer)){
                var designerArr = [];
                designerArr.push(data.compere);
                layui.formSelects.value('designer',designerArr); //多选下拉框赋值
            }
            bacInfectTrainEdit.contentData = data.content;
            if (isNotEmpty(data.infectTrainId)) {
                // initFileUpload(data.therapyFiles);
            }
        });
        //fileUpload();
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
            url: $.config.services.logistics + '/bacInfectTrain/uploadFileContent.do',
            accept: 'image',
            acceptMime: 'image/*',
            method: 'post',
            exts: 'jpg|png|gif|bmp|jpeg',
            size: '10240',
            done: function(data){
                bacInfectTrainEdit.layeditFiles.push(data.data);
            }
        }
        , uploadVideo: {
            url: $.config.services.logistics + '/bacInfectTrain/uploadFileContent.do',
            accept: 'video',
            acceptMime: 'video/*',
            method: 'post',
            exts: 'mp4|flv|avi|rm|rmvb',
            size: '20480',
            done: function(data){
                bacInfectTrainEdit.layeditFiles.push(data.data);
            }
        }
        , uploadFiles: {
            url: $.config.services.logistics + '/bacInfectTrain/uploadFileContent.do',
            accept: 'file',
            method: 'post',
            acceptMime: 'file/*',
            size: '20480',
            done: function(data){
                bacInfectTrainEdit.layeditFiles.push(data.data);
            }
        }

        //右键删除图片/视频时的回调参数，post到后台删除服务器文件等操作，
        //传递参数：
        //图片： imgpath --图片路径
        //视频： filepath --视频路径 imgpath --封面路径
        , calldel: {
            url: $.config.services.logistics + '/bacInfectTrain/deleteFile.do',
            done: function (res) {
                var data = JSON.parse(res);
                var filepath =data.data.filepath;
                var imgpath = data.data.imgpath;
                if(isNotEmpty(filepath)){
                    bacInfectTrainEdit.layeditDelFiles.push(filepath);
                }
                if(isNotEmpty(imgpath)){
                    bacInfectTrainEdit.layeditDelFiles.push(imgpath);
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
    bacInfectTrainEdit.editIndex = layedit.build('content');
}

/**
 * 获取主持人列表
 */
function getCompereList(){
    var param ={
    }
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.logistics + "/bacInfectTrain/getUserLists.do",
        data:param,
        dataType: "json",
        async:false,
        done:function(data){
            bacInfectTrainEdit.comperes = data;
            var form=layui.form; //调用layui的form模块
            form.render();
            layui.formSelects.render();
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}

/**
 * 获取制定人列表
 */
function getDesignerList(){
    var param ={
    }
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.logistics + "/bacInfectTrain/getUserLists.do",
        data:param,
        dataType: "json",
        async:false,
        done:function(data){
            bacInfectTrainEdit.designers = data;
            var form=layui.form; //调用layui的form模块
            form.render();
            layui.formSelects.render();
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}

/**
 * 获取计划参加人员列表
 */
function getJoinUserList(){
    var param ={
    }
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.logistics + "/bacInfectTrain/getUserLists.do",
        data:param,
        dataType: "json",
        async:false,
        done:function(data){
            bacInfectTrainEdit.joinUsers = data;
            var form=layui.form; //调用layui的form模块
            form.render();
            layui.formSelects.render();
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
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
            "infectTrainId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/bacInfectTrain/getInfo.do",
            data:param,
            dataType: "json",
            async:false,
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.planDate=util.toDateString(data.planDate,"yyyy-MM-dd");
                form.val('bacInfectTrainEdit_form', data);
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
    form.on('submit(bacInfectTrainEdit_submit)', function(data){

        var field = data.field; //获取提交的字段
        console.log(field,'----')
        //通过表单验证后
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacInfectTrainEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    layui.layedit.sync(bacInfectTrainEdit.editIndex);
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field;//表单的元素
        //跳转的URL
        var url = '';

        param.layeditFiles = JSON.stringify(bacInfectTrainEdit.layeditFiles);
        param.layeditDelFiles = bacInfectTrainEdit.layeditDelFiles.toString();

        if (param.infectTrainId.length == 0) {//新增
            layer.confirm('是否加入资料库？', {
                btn: ['是','否'] //按钮
            }, function(index){
                layer.close(index);
                param.addToAstrictInfect ="1";
                url = $.config.services.logistics + "/bacInfectTrain/save.do";
                submitData(url,param,$callback);
            }, function(index){
                layer.close(index);
                param.addToAstrictInfect ="0";
                url = $.config.services.logistics + "/bacInfectTrain/save.do";
                submitData(url,param,$callback);
            });
        } else {
            url = $.config.services.logistics + "/bacInfectTrain/edit.do";
            submitData(url,param,$callback);
        }
    });
}

function submitData(url,param,$callback){
    //可以继续添加需要上传的参数
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: url,
        data:param,
        dataType: "json",
        done:function(data){
            //typeof $callback === 'function' && $callback(data); //返回一个回调事件
            //返回的主键不为空  则把上传图片记录入库
            var saveSuccess = true;
            if (isNotEmpty(data.infectTrainId)) {
                if (isNotEmpty(bacInfectTrainEdit.fileUrl)) {
                    saveSuccess = uploadFileRecord(data.infectTrainId);
                }
            }
            if (saveSuccess) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        }
    });
}

/**
 * 获取资料库
 */
function knowledgeBase(){
    var title="资料库";
    var url=$.config.server+"/departmentdaily/bacAstrictInfectDetailList";
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:900, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:680,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin){
            layer.close(index); //如果设定了yes回调，需进行手工关闭
            var contentvalue = iframeWin.save(
                function (val) {
                    //$("#content").val(val);
                    //layui.layedit.setContent(bacInfectTrainEdit.editIndex,val,false);
                }
            );
        }
    });
}

/**
 * 文件上传
 */
function initFileUpload(fileDatas) {
    fileDatas = fileDatas || [];
    uploadFileObj = _layuiUploadFile({
        elem: '#uploadFile'
        , url: $.config.services.logistics + '/bacInfectTrain/uploadFile.do'
        , accept: 'file'
        , method: 'post'
        , multiple: true
        , number: 5
        , done: function (res) {
            //只有 response 的 code 一切正常才执行 done
            if (res.rtnCode == RtnCode.OK.code) {
                //正常返回
                //设置多文件上传的数量 by Chauncey
                var strA = $('#uploadFile').prev().val();
                var str = strA.split(",");
                if(str.length == 5){
                    warningToast("最多上传5个文件",1000);
                } else {
                    if (isNotEmpty(res.bizData)) {
                        bacInfectTrainEdit.fileUrl = res.bizData.filePath;
                        bacInfectTrainEdit.fileTitle = res.bizData.fileTitle;
                        bacInfectTrainEdit.mimeType = res.bizData.mimeType;
                        fileShow(res.bizData.filePath,res.bizData.fileTitle);
                    }
                }
            } else {
                // 请求错误处理
                requestErrorHandle(res);
            }
        }
        , fileDatas: fileDatas
    });
}

/**
 * 文件上传记录入库
 */
function uploadFileRecord(id) {
    // 获取待添加的文件列表
    var addFiles = [];
    var fileArr = bacInfectTrainEdit.fileUrl.split(',');
    var fileTitleArr =  bacInfectTrainEdit.fileTitle.split(',');
    var mimeTypeArr =  bacInfectTrainEdit.mimeType.split(',');
    fileArr.forEach(function (item,index) {
        var file = {};
        file.filePath = item;
        file.fileTitle = fileTitleArr[index];
        file.mimeType = mimeTypeArr[index];
        addFiles.push(file);
    })


    /*var itemsData = uploadFileObj.config.getItemsData();
    $.each(itemsData, function (index, item) {
        if (isEmpty(item.fileId)) {
            addFiles.push(item);
        }
    });*/

    var saveSuccess = false;
    var param = {
        objectId: id,
        addFiles: addFiles,
        deleteFileIds: bacInfectTrainEdit.deleteFileIds
    };
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.logistics + '/bacInfectTrain/saveFile.do',
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

/**
 * 显示文件
 */
function fileShow(url,fileTitle) {
    if(url.indexOf(",")>-1){
        var urlArr=url.split(",");
        $.each(urlArr,function (i,item) {
            //获取文件名字  最后一个斜杆后的字符几位名字
            var index = item.lastIndexOf("\/");
            //var node = item.substring(index + 1, item.length);
            var node = fileTitle;
            var fileId=new Date().getTime()+Math.floor(Math.random()*9000+1000);
            var html = '<div><a style="width: 90%;display: inline-block;padding-top: 8px;color: #0099cc;" ' + ' href="'+getHttpPath()+item+'" download="'+node+'">' + node + '</a>' +
                '<i class="layui-icon" id="'+fileId+'" value="'+item+'"></i></div>';
            //$('#fileShowDiv').append(html);
            try{
                layui.layedit.setContent(bacInfectTrainEdit.editIndex,html+bacInfectTrainEdit.contentData,false);
            }catch{
            }
        });
    }else{
        var fileId=new Date().getTime()+Math.floor(Math.random()*9000+1000);
        var index = url.lastIndexOf("\/");
        //var node = url.substring(index + 1, url.length);
        var node = fileTitle;
        var html = '<div><a style="width: 90%;color:#0099cc;display: inline-block;padding-top: 8px;" ' + 'href="'+getHttpPath()+url+'" download="'+node+'">' + node + '</a>' +
            '<i class="layui-icon" id="'+fileId+'" value="'+url+'"></i></div>';
        //$('#fileShowDiv').append(html);
        try{
            layui.layedit.setContent(bacInfectTrainEdit.editIndex,html+bacInfectTrainEdit.contentData,false);
        }catch{
        }
    }
    //赋值
    var urls=$('#uploadFile').prev().val();
    urls=urls.replaceAll(url,"");
    urls=urls.replaceAll(",,",",");
    if(isNotEmpty(urls)){
        $('#uploadFile').prev().val(urls+","+url);
    }else{
        $('#uploadFile').prev().val(url);
    }
}


