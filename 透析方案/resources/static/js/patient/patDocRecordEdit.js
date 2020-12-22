/**
 * patDocRecordEdit.jsp的js文件，包括查询，编辑操作
 * 文书上传记录编辑 js
 * @Author wahmh
 * @Date 2020-9-28
 * @Version 1.0
 * */
var uploadFileObj;;
var patDocRecordEdit = avalon.define({
    $id: "patDocRecordEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    disabled: {disabled: true},//设置控件是否只读
    patientId: '',//患者id
    recordId: '',//文书上传记录ID
    deleteFileId:''
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate = layui.laydate;
        laydate.render({
            elem: '#signDatetime'
            , type: 'date'
            , format: 'yyyy-MM-dd'
            , trigger: 'click'
            , value: new Date()
        });
        var id = GetQueryString("id");//当前文书上传记录的id
        var patientId = GetQueryString('patientId');
        patDocRecordEdit.patientId = patientId;
        $("#patientId").val(patientId)
        patDocRecordEdit.recordId = id;
        //获取实体信息
        getInfo(id, patientId, function (data) {
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
            var arr;
            if (JSON.stringify(data) !== '{}') {
                arr = [{filePath: data.imageSrc, fileTitle: data.fileTitle,fileId:data.fileId}];
            }
            initUpload(arr);
        });
        avalon.scan();
    });
});
//文件上传
function initUpload(fileDatas) {
    fileDatas = fileDatas || [];
    uploadFileObj = _layuiUploadFile({
        elem: '#uploadFile'
        , url: $.config.services.dialysis + '/patDocRecord/uploadFile.do'
        , accept: 'file'
        , method: 'post'
        , multiple: true
        , number: 1
        , acceptMime: 'image/*,application/pdf'
        , done: function (res) {
            $("#image").val(res.bizData.filePath)
            $("#fileTitle").val(res.bizData.fileTitle)
            $("#mimeType").val(res.bizData.mimeType)
        }
        , showFileDiv: "#fileShowDiv"
        , fileDatas: fileDatas
        , withDelete:true
        , deleteItemCallack: function (deleteItemData, deleteItemObj) {
            if (isEmpty(deleteItemData.fileId) && isNotEmpty(deleteItemData.filePath)) {
                // 未保存文件记录的文件直接删除
                var deleteSuccess = baseFuncInfo.onDeleteTempFile(deleteItemData.filePath);
                if (deleteSuccess) {
                    deleteItemObj.remove();
                }
            } else {
                // // 已保存记录的文件先记录删除文件记录ID，保存是进行逻辑删除
                patDocRecordEdit.deleteFileId=deleteItemData.fileId;
                $("#image").val("")
                $("#fileTitle").val("")
                $("#mimeType").val("")
                deleteItemObj.remove();
            }
        }
    });
}
/**
 * 获取实体
 * @param id 文书上传记录id
 * @param patientId
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(id, patientId, $callback) {
    getPatientInfo(patientId, function (patientInfo) {
        //    给当前表单赋值（当前患者姓名和病历号）
        $("#patientName").val(patientInfo.patientName)
        $("#patientRecordNo").val(patientInfo.medrec);
    })
    if (isNotEmpty(id)) {
        //编辑
        var param = {
            "recordId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patDocRecord/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util = layui.util;
                data.signDatetime = util.toDateString(data.signDatetime, "yyyy-MM-dd");
                form.val('patDocRecordEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    } else {
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    }

}

/*
* 获取当前患者的信息
* @Param patientId 当前患者的ID
* @Param $callback 回调函数
* */
function getPatientInfo(patientId, $callback) {
    var patientInfo = {};
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/patDocRecord/getPatientInfo.do",
        data: {'patientId': patientId},
        dataType: "json",
        done: function (data) {
            patientInfo['patientName'] = data.patientName
            patientInfo['medrec'] = data.patientRecordNo
            typeof $callback === 'function' && $callback(patientInfo); //返回一个回调事件
        }
    });
}
/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(patDocRecordEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#patDocRecordEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        var param = field; //表单的元素
        //添加要删除的图片的id
        param["deleteFileId"]=patDocRecordEdit.deleteFileId;
        var url = "";
        if (isNotEmpty(patDocRecordEdit.recordId)) {
            //    编辑
            url = $.config.services.dialysis + "/patDocRecord/edit.do";
        } else {
            //    新增
            url = $.config.services.dialysis + "/patDocRecord/add.do";
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



