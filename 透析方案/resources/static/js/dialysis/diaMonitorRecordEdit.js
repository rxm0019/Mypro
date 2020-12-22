/**
 * 透析管理－－监测记录
 * @author Care
 * @date 2020-09-09
 * @version 1.0
 */

var diaMonitorRecordEdit = avalon.define({
    $id: "diaMonitorRecordEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    dosageFirstUnit: '',//肝素量单位
    readonly: {readonly: false}, // 文本框设置只读
    disabled: {disabled: false},
});

layui.use(['index', 'formSelects'], function () {
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate = layui.laydate;
        laydate.render({
            elem: '#monitorTime'
            , type: 'time'
            , format: 'HH:mm'
            , value: new Date()
        });
        var id = GetQueryString("id");  //接收变量
        var diaRecordId = GetQueryString("diaRecordId");  //接收变量
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        diaMonitorRecordEdit.dosageFirstUnit = GetQueryString("dosageFirstUnit");  //接收变量
        if (layEvent === 'detail') {
            diaMonitorRecordEdit.readonly = {readonly: true};
            diaMonitorRecordEdit.disabled = {disabled: 'disabled'};
            layui.formSelects.disabled('position');
        }
        if (layEvent === 'add') {

            getDefaultValue();
        }
        if (diaRecordId != 'null') {
            $("#diaRecordId").val(diaRecordId);
        }
        initFormVerify();
        initForm();
        //获取实体信息
        getInfo(id, function (data) {
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });
        avalon.scan();
    });
});

/**
 * 初始化表单验证方法
 */
function initFormVerify() {
    layui.form.verify({
        // 床位必填校验
        bedNumberIdRequired: function (value, item) {
            if (isEmpty(value.trim())) {
                return "床位不能为空";
            }
        },
        // 字段必填校验
        fieldRequired: function (value, item) {
            var target = $(item);
            var fieldName = target.attr("data-field-name") || "";
            if (isEmpty(value.trim())) {
                return fieldName + "不能为空";
            }
        },
        //动脉压校验
        arteryPressure: function (value, item) {
            var target = $(item);
            var fieldName = target.attr("data-field-name");
            var minValue = Number(target.attr("data-min-value")) || 0;
            var maxValue = Number(target.attr("data-max-value")) || 0;
            if (!(/^(\-|\+)?\d+(\.\d+)?$/).test(value.trim())) {
                return fieldName + "只能填数字，且小数不能超过两位";
            }
            // 判断输入是否是有效的数值
            if (value.trim() < minValue || value.trim() > maxValue) {
                return fieldName + "只能输入" + minValue + "~" + maxValue + "的值";
            }
        },
        // 字段数值范围校验
        fieldNotInRange: function (value, item) {
            var target = $(item);
            var fieldName = target.attr("data-field-name");
            var minValue = Number(target.attr("data-min-value")) || 0;
            var maxValue = Number(target.attr("data-max-value")) || 0;
            var isInteger = target.attr("data-integer") == "true";

            if (value.trim() === "") {
                return;
            }

            // 判断输入是否是数值
            if (isInteger) {
                if (!(/^\d+$/).test(value.trim())) {
                    return fieldName + "只能填数字，且数值为整数";
                }
            } else {
                if (!(/^\d+\.?\d{0,2}$/).test(value)) {
                    return fieldName + "只能填数字，且小数不能超过两位";
                }
            }

            // 判断输入是否是有效的数值
            if (value.trim() < minValue || value.trim() > maxValue) {
                return fieldName + "只能输入" + minValue + "~" + maxValue + "的值";
            }
        }
    });
}

function initForm() {
    // 【管路安全】与【管路位置】联动
    layui.form.on('select(linkSafe)', function (obj) {
        resetPositionShow(obj.value);
    })
}

function getDefaultValue() {
    var dicMap = getSysDictMap("MonitoringRecords");
    if (isNotEmpty(dicMap)) {
        var arr = dicMap.position.dictDataDefaultValue.split(",");
        console.log("dicMap", dicMap);
        layui.form.val("diaMonitorRecordEdit_form", {
            bloodFlow: dicMap.bloodFlow.dictDataDefaultValue,
            veinPressure: dicMap.veinPressure.dictDataDefaultValue,
            arteryPressure: dicMap.arteryPressure.dictDataDefaultValue,
            transmembrane: dicMap.transmembrane.dictDataDefaultValue,
            systolicPressure: dicMap.systolicPressure.dictDataDefaultValue,
            diastolicPressure: dicMap.diastolicPressure.dictDataDefaultValue,
            pulse: dicMap.pulse.dictDataDefaultValue,
            respire: dicMap.respire.dictDataDefaultValue,
            heparinValue: dicMap.heparinValue.dictDataDefaultValue,
            conductivity: dicMap.conductivity.dictDataDefaultValue,
            dialysateTemperature: dicMap.dialysateTemperature.dictDataDefaultValue,
            replacementFluidTotal: dicMap.replacementFluidTotal.dictDataDefaultValue,
            totalMoreDehydration: dicMap.totalMoreDehydration.dictDataDefaultValue,
            moreDehydrationRate: dicMap.moreDehydrationRate.dictDataDefaultValue,
            linkSafe: dicMap.linkSafe.dictDataDefaultValue,
            position: layui.formSelects.value("position", arr),
        });
    }

}

/**
 * 重置【管路位置】显示/隐藏：【管路安全】与【管路位置】联动
 * @param linkSafe
 */
function resetPositionShow(linkSafe) {
    var bizCode = getSysDictBizCode($.dictType.LinkSafe, linkSafe);
    if (bizCode == $.constant.YesOrNo.YES) {
        $(".form-item-position").removeClass("layui-hide");
    } else {
        layui.formSelects.value("position", []);
        $(".form-item-position").addClass("layui-hide");
    }
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
            "monitorRecordId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/diaMonitorRecord/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                if (isNotEmpty(data)) {
                    //表单初始赋值
                    var form = layui.form; //调用layui的form模块
                    //初始化表单元素,日期时间选择器
                    var util = layui.util;
                    data.monitorTime = util.toDateString(data.monitorTime, "HH:mm");
                    var arr = data.position.split(",");
                    layui.formSelects.value("position", arr);
                    form.val('diaMonitorRecordEdit_form', data);

                    // 重置【管路位置】显示/隐藏
                    resetPositionShow(data.linkSafe);

                    typeof $callback === 'function' && $callback(data); //返回一个回调事件
                }

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
    form.on('submit(diaMonitorRecordEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#diaMonitorRecordEdit_submit").trigger('click');
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
        var url = $.config.services.dialysis + "/diaMonitorRecord/edit.do";
        if (isEmpty(param.unusualRecordId)) {
            url = $.config.services.dialysis + "/diaMonitorRecord/add.do";
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                if (isNotEmpty(data)) {
                    successToast("保存成功")
                }
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



