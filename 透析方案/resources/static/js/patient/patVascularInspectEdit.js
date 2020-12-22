/**
 * 辅助检查
 * @author anders
 * @date 2020-08-13
 * @version 1.0
 */
var uploadImgObj;
var patVascularInspectEdit = avalon.define({
    $id: "patVascularInspectEdit",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,readonly: {readonly: false} // 文本框设置只读
    ,disabled: {disabled: false}
    ,doctorMakers: []       //检查人  医生角色
    ,patientId: ''   //患者id
    ,id: ''
    ,deleteFileIds: [] // 删除的文件ID列表
    ,withDeleteFile: true
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        laydate.render({
            elem: '#inspectDate'
            ,type: 'date'
            ,trigger: 'click'
            ,value: new Date()
        });
        makers();
        var id=GetQueryString("id");  //接收变量
        patVascularInspectEdit.id = id;
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        patVascularInspectEdit.patientId = GetQueryString('patientId');  //患者id
        if (layEvent === 'detail') {
            patVascularInspectEdit.readonly = {readonly: true};
            patVascularInspectEdit.disabled = {disabled: 'disabled'};
            patVascularInspectEdit.withDeleteFile = false;
            $('#uploadImg').css('display', 'none');   //隐藏添加图片按钮
        }
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
            initUpload(data.inspectImages);
        });
        avalon.scan();
    });
});
//图片上传
function initUpload(fileDatas) {
    fileDatas = fileDatas || [];
    uploadImgObj = _layuiUploadImg({
        elem: '#uploadImg'
        , url: $.config.services.dialysis + '/patVascularInspect/uploadImage.do'
        , accept: 'images'
        , method: 'post'
        , multiple: true
        , number: 5
        , acceptMime: 'image/*'
        , done: function (res) {
            //...上传成功后的事件
        }
        , showFileDiv: "#showImgDiv"
        , fileDatas: fileDatas
        , withDelete: patVascularInspectEdit.withDeleteFile
        , deleteItemCallack: function (deleteItemData, deleteItemObj) {
            if (isEmpty(deleteItemData.fileId) && isNotEmpty(deleteItemData.filePath)) {
                // 未保存文件记录的文件直接删除
                var deleteSuccess = baseFuncInfo.onDeleteTempFile(deleteItemData.filePath);
                if (deleteSuccess) {
                    deleteItemObj.remove();
                }
            } else {
                // 已保存记录的文件先记录删除文件记录ID，保存是进行逻辑删除
                patVascularInspectEdit.deleteFileIds.push(deleteItemData.fileId);
                deleteItemObj.remove();
            }
        }
    });
}

/**
 * 获取检查人（医生角色）
 */
function makers() {
    _ajax({
        type: "POST",
        loading: false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getDoctorRoleList.do",
        dataType: "json",
        async: false,
        done: function (data) {
            patVascularInspectEdit.doctorMakers=data;
            var doctorId = '';
            data.forEach(function (item, i) {
                if (item.id == baseFuncInfo.userInfoData.userid) {
                    doctorId = item.id;
                }
            })
            if (isEmpty(patVascularInspectEdit.id)) {
                $('#inspectUserId').val(doctorId);
            }
            var form = layui.form;
            form.render('select');
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
            "vascularInspectId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis+"/patVascularInspect/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.inspectDate=util.toDateString(data.inspectDate,"yyyy-MM-dd");
                form.val('patVascularInspectEdit_form', data);
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
    form.on('submit(patVascularInspectEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#patVascularInspectEdit_submit").trigger('click');
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
        var url = $.config.services.dialysis+"/patVascularInspect/edit.do";
        if (isEmpty(param.vascularInspectId)) {
            param.patientId = patVascularInspectEdit.patientId;
            url = $.config.services.dialysis+"/patVascularInspect/save.do";
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data:param,
            dataType: "json",
            done:function(data){
                //返回的主键不为空  则把上传图片记录入库
                var saveSuccess = true;
                if (isNotEmpty(data.vascularInspectId)) {
                    saveSuccess = uploadImgRecord(data.vascularInspectId);
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
        deleteFileIds: patVascularInspectEdit.deleteFileIds
    };

    if (addFiles.length == 0 && patVascularInspectEdit.deleteFileIds.length == 0) {  //没有上传和删除文件
        return true;
    }

    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + '/patVascularInspect/saveImage.do',
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
