/**
 * 转归记录－编辑
 * @author care
 * @date 2020-08-24
 * @version 1.0
 */
var patOutInRecordEdit = avalon.define({
    $id: "patOutInRecordEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    isShowReason: true,//显示或隐藏转归原因
    patientId: '',//患者id
    doctorReadOnly: true,
    nurseReadOnly: true,
    operateReadOnly: true,
    otherReadOnly: false,
    dictOutInTypeY: [],
    dictOutInTypeN: [],
});

layui.use(['index', 'laydate'], function () {
    /**
     * 设置不同角色填写不同备注栏位
     */
    var userType = baseFuncInfo.userInfoData.userType;
    var doctor = $.constant.userType.doctor;
    var nurse = $.constant.userType.nurse;
    var manager = $.constant.userType.manager;
    if (userType === doctor) {//医生
        patOutInRecordEdit.doctorReadOnly = false;
    } else if (userType === nurse) {//护士
        patOutInRecordEdit.nurseReadOnly = false;
    } else if (manager === manager) {//行政人员
        patOutInRecordEdit.operateReadOnly = false;
    }
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate = layui.laydate;
        laydate.render({
            elem: '#outInDatetime'
            , type: 'date'
            , format: 'yyyy-MM-dd'
            , value: new Date()
            , trigger: 'click'
        });
        var paintName = GetQueryString("paintName");  //接收变量
        var patientRecordNo = GetQueryString("patientRecordNo");  //接收变量
        var id = GetQueryString("id");  //接收变量
        patOutInRecordEdit.patientId = GetQueryString("patientId");  //接收变量
        getOutInType();
        // 初始化表单
        initFormVerify();
        //获取实体信息
        getInfo(id, function (data) {
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
            if (paintName != 'null') {
                $("#paintName").val(paintName);
            }
            if (patientRecordNo != 'null') {
                $("#patientRecordNo").val(patientRecordNo);
            }
            //赋值转归类型
            if (data.outInType == "0") {
                patOutInRecordEdit.isShowReason = true;
                // getOutInType();
            }
            if (data.outInType == "1") {
                patOutInRecordEdit.isShowReason = false;
                // getOutInType();
            }
            layui.form.render();
        });

    });
    var form = layui.form;
    form.on('radio(outInType)', function (data) {
        if (data.value == "0") {
            patOutInRecordEdit.isShowReason = true;
            // getOutInType();
        }
        if (data.value == "1") {
            patOutInRecordEdit.isShowReason = false;
            // getOutInType();
        }
        layui.form.render();
    });

    avalon.scan();
});

/**
 * 初始化表单验证方法
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

function getOutInType(){
    var dictOutInType = getSysDictMap("OutcomeType");
    var codeY = $.constant.YesOrNo.YES;
    var codeN = $.constant.YesOrNo.NO;
    var dictOutInTypeY = [];
    var dictOutInTypeN = [];
    $.each(dictOutInType, function (index, item) {
        if (item.dictBizCode === codeY) {
            dictOutInTypeY.push(item)
        }
        if (item.dictBizCode === codeN) {
            dictOutInTypeN.push(item)
        }
    })
    patOutInRecordEdit.dictOutInTypeY = dictOutInTypeY;
    patOutInRecordEdit.dictOutInTypeN = dictOutInTypeN;
    debugger
}

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(id, $callback) {
    if (isEmpty(id)) {
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    } else {
        //编辑
        var param = {
            "outInId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patOutInRecord/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util = layui.util;
                data.outInDatetime = util.toDateString(data.outInDatetime, "yyyy-MM-dd");
                data.createTime = util.toDateString(data.createTime, "yyyy-MM-dd");
                data.updateTime = util.toDateString(data.updateTime, "yyyy-MM-dd");
                if (data.outInType == "0") {
                    patOutInRecordEdit.isShowReason = true;
                }
                if (data.outInType == "1") {
                    patOutInRecordEdit.isShowReason = false;
                }
                form.val('patOutInRecordEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(patOutInRecordEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#patOutInRecordEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function saveFateRecord($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        var url = '';
        //成功验证后
        var param = field; //表单的元素
        param.patientId = patOutInRecordEdit.patientId;
        if (isEmpty(param.outInId)) {
            url = $.config.services.dialysis + "/patOutInRecord/add.do";
        } else {
            url = $.config.services.dialysis + "/patOutInRecord/edit.do";
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            loading: true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



