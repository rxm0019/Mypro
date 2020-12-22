/**
 * 透析管理－－病程记录
 * @author Care
 * @date 2020-09-14
 * @version 1.0
 */
var diaRecordEdit = avalon.define({
    $id: "diaRecordEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    diaRecordId: '',//透析记录
    templateType: $.constant.medicalHistoryTemplateType,//模板类型
    moreShow: true,
    courseRecord: '',//病程内容
    patientId: '',//患者ｉｄ
    isShow: false,
    formReadonly: false,//归档后只读
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        diaRecordEdit.diaRecordId = GetQueryString("diaRecordId");  //接收变量
        diaRecordEdit.patientId = GetQueryString("patientId");  //接收变量
        diaRecordEdit.formReadonly = GetQueryString("readonly") == "Y";

        if (diaRecordEdit.diaRecordId != 'null') {
            $("#diaRecordId").val(diaRecordEdit.diaRecordId);
            getCourseRecord(diaRecordEdit.diaRecordId);
        }
        //字段校验
        initFormVerify();
        initForm()
        getMore();
        avalon.scan();
    });
});

/**
 * 表单字段校验
 */
function initFormVerify() {
    layui.form.verify({
        // 字段必填校验
        fieldRequired: function (value, item) {
            var target = $(item);
            var fieldName = target.attr("data-field-name") || "";
            if (isEmpty(value.trim())) {
                return fieldName + "不能为空";
            }
        }
    })
}

/**
 * 初始化表单
 */
function initForm() {
// 病程记录 - 更多：鼠标移入时显示上一次的病程记录，鼠标移除时隐藏
    $("#getMore").mouseover(function () {
        var targetOffset = $(this).offset();
        $("#moreLast").css("top", (targetOffset.top - 10) + "px");
        $("#moreLast").css("right", (targetOffset.right - 10) + "px");
        $("#moreLast").removeClass("layui-hide");
        diaRecordEdit.isShow = false;
    });

    $("#getMore").mouseout(function () {
        setTimeout(function () {
            if(diaRecordEdit.isShow == false){
                $("#moreLast").addClass("layui-hide");
            }
        }, 1000);
        diaRecordEdit.isShow = false;
    });

    $("#moreLast").mouseover(function () {
        diaRecordEdit.isShow = true;
        $("#moreLast").removeClass("layui-hide");
    });

    $("#moreLast").mouseout(function () {
        diaRecordEdit.isShow = false;
        $("#moreLast").addClass("layui-hide");
    });
}

/**
 * 病程內容- 提取模板
 */
function onImportCourseRecordTemplate() {
    baseFuncInfo.onImportFromContentTemplate("提取模板", diaRecordEdit.templateType.PROGRESSCONTENT, function (data) {
        layui.form.val("diaRecordEdit_form", {courseRecord: data.templateContent});
        successToast("导入成功");
    });
}

/**
 * 病程內容- 保存模板
 */
function onSaveCourseRecordTemplate() {
    var courseRecordContent = layui.form.val("diaRecordEdit_form").courseRecord;
    if (isEmpty(courseRecordContent)) {
        return warningToast("请填写病程內容");
    } else {
        baseFuncInfo.onExportContentTemplate("保存模板", diaRecordEdit.templateType.PROGRESSCONTENT, courseRecordContent, function (templateConten) {
            successToast("保存成功");
        });
    }
}
/**
 * 获取病程记录
 */
function getCourseRecord(diaRecordId) {
    var param = {
        "diaRecordId": diaRecordId
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/diaRecord/getDiaRecord.do",
        data: param,
        dataType: "json",
        done: function (data) {
            if (isNotEmpty(data)) {
                    if(isNotEmpty(data.courseRecord)){
                        window.parent.showTabBadgeDot(false);
                        //表单初始赋值
                        var form = layui.form; //调用layui的form模块
                        form.val('diaRecordEdit_form', data);
                    }else {
                        window.parent.showTabBadgeDot(true);
                    }

            }
        }
    });

}

/**
 * 获取上一笔病程记录
 */
function getMore() {
    var param = {
        patientId: diaRecordEdit.patientId,
        diaRecordId: diaRecordEdit.diaRecordId
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/diaRecord/getLastTime.do",
        data: param,
        dataType: "json",
        done: function (data) {
            if (isEmpty(data)) {
                // diaRecordEdit.courseRecord = "该患者还未有上次记录";
                return false;
            }
            if (isNotEmpty(data)) {
                diaRecordEdit.courseRecord = data.courseRecord
                diaRecordEdit.moreShow = false;
            }
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
    form.on('submit(diaRecordEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段

        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#diaRecordEdit_submit").trigger('click');
}

function saveCourseRecord($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        var param = field; //表单的元素
        param.patientId = diaRecordEdit.patientId;
        var url = "";
        if (isNotEmpty(diaRecordEdit.diaRecordId)) {
            url = $.config.services.dialysis + "/diaRecord/saveCourseRecord.do";
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                successToast("修改成功");
                setTimeout(function () {
                    // 刷新当前透析记录状态
                    if (window.parent.onRefreshRecordOption) { window.parent.onRefreshRecordOption(); }
                    window.location.reload();
                }, 1000);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



