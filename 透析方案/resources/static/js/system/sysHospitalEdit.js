/**
 * 中心管理编辑
 * @author: Care
 * @version: 1.0
 * @date: 2020/08/12
 */
var sysHospitalEdit = avalon.define({
    $id: "sysHospitalEdit",
    baseFuncInfo: baseFuncInfo, // 底层基本方法
    readonly: false,
    dataStatusOptions: [],
    superiorOptions: {
        platforms: [], // 平台（一级）
        group: [] // 集团（二级）
    }
});

layui.use(['index'], function () {
    avalon.ready(function () {
        // 获取URL参数
        var hospitalId = GetQueryString("hospitalId");
        var readonly = GetQueryString("readonly");

        // 更新页面参数
        sysHospitalEdit.readonly = (readonly == "Y");
        sysHospitalEdit.dataStatusOptions = baseFuncInfo.getSysDictByCode($.dictType.sysStatus);

        //初始化表单元素,日期时间选择器
        var laydate = layui.laydate;
        laydate.render({elem: '#openingDate', type: 'date', trigger: 'click', value: new Date()});

        var form = layui.form;
        // 自定义表单校验
        form.verify({
            superior: function (value) {
                // 新增时，必须选择上级
                var superior = ($("#superior").val() || "");
                if (isEmpty(hospitalId) && isEmpty(superior)) {
                    return '请选择上级！';
                }
            },
            hospitalNo: function (value) {
                value = value || "";
                var superior = ($("#superior").val() || "");
                if (superior.length == 1 && /^\d{4}$/.test(value) == false) {
                    return '请输入4位以数字编码的中心代码！';
                } else if (superior.length == 4 && /^\d{7}$/.test(value) == false) {
                    return '请输入7位以数字编码的中心代码！';
                }
            },
            days: function (value){
                if (value == "") {
                    return;
                }
                if (!(/^\d+$/).test(value)) {
                    return '只能填数字，且数值为整数';
                }
                if (value > 999) {
                    return '请输入三位以内的数值';
                }
            }
        });

        // 获取实体信息
        getInfo(hospitalId, function (data) {
            // 获取上级选项
            getSuperiorOptions();

            //初始化表单元素,日期时间选择器
            var util = layui.util;
            data.openingDate = util.toDateString(data.openingDate, "yyyy-MM-dd");
            //表单初始赋值
            layui.form.val('sysHospitalEdit_form', data);
        });
    });

    avalon.scan();
});

/**
 * 获取实体
 * @param hospitalId
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(hospitalId, $callback) {
    if (isEmpty(hospitalId)) {
        //新增
        $("#superior").attr("disabled", false);
        $("#hospitalNo").attr("readonly", false);
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    } else {
        //编辑
        var param = {
            "hospitalId": hospitalId
        };
        _ajax({
            type: "POST",
            url: $.config.services.system + "/sysHospital/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

/**
 * 获取上级选项
 */
function getSuperiorOptions() {
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysHospital/listSuperior.do",
        data: {},  //必须字符串后台才能接收list,
        dataType: "json",
        async: false,
        done: function (data) {
            sysHospitalEdit.superiorOptions.platforms.clear();
            sysHospitalEdit.superiorOptions.group.clear();
            $.each(data, function (index, item) {
                if (isNotEmpty(item.superior)) {
                    // 有上级，加入平台（一级）列表
                    sysHospitalEdit.superiorOptions.group.push(item);
                } else {
                    // 有上级，加入集团（二级）列表
                    sysHospitalEdit.superiorOptions.platforms.push(item);
                }
            });
        }
    });
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
/**
 * 保存中心信息
 * @param $callback
 */
function onHospitalSave($callback) {  //菜单保存操作
    //对表单验证
    verifyForm(function (field) {
        debugger
        //成功验证后
        var param = field; //表单的元素
        //可以继续添加需要上传的参数
        var url = $.config.services.system + "/sysHospital/edit.do";
        if (isEmpty(param.hospitalId)) {
            url = $.config.services.system + "/sysHospital/add.do";
        }
        _ajax({
            type: "POST",
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}

/**
 * 验证表单
 * @param $callback
 */
function verifyForm($callback) {
    // 监听提交,先定义个隐藏的按钮
    var form = layui.form; // 调用layui的form模块
    form.on('submit(sysHospitalEdit_submit)', function(data) {
        // 通过表单验证后
        var field = data.field; // 获取提交的字段
        typeof $callback === 'function' && $callback(field); // 返回一个回调事件
    });
    $("#sysHospitalEdit_submit").trigger('click');
}


