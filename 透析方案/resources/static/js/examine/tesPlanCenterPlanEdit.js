/**
 * tesPlanCenterPlanEdit.jsp的js文件，包括查询，编辑操作
 */
/* 检验计划检验 中心计划编辑添加js
* @Author wahmh
* @Date 2020-10-7
* */
var tesPlanCenterPlanEdit = avalon.define({
    $id: "tesPlanCenterPlanEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId: '',//当前患者id
    disabled: {disabled: true},//设置患者姓名为只读
    tesPlanId: '',//检验计划ID
    disabled: {disabled: false}//编辑时设置检验项目为不可编辑

});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var patientId = GetQueryString("patientId");  //接收变量
        var tesPlanId = GetQueryString("tesPlanId");
        var orderMainId = GetQueryString("orderMainId");
        tesPlanCenterPlanEdit.patientId = patientId;
        tesPlanCenterPlanEdit.tesPlanId = tesPlanId;
        //获取实体信息
        getInfo(tesPlanId, patientId, orderMainId);
        avalon.scan();
    });
});

/*
* 获取中心检验项目 添加
* */
function getCenterInspectionList($callback) {
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/tesPlan/getCenterInspectionList.do",
        dataType: "json",
        done: function (data) {

            //    新增操作
            for (var i = 0; i < data.length; i++) {
                var html = " <option value=" + data[i].orderMainId + ">" + data[i].orderName + "</option>"
                $("#orderMainId").append(html)
            }
            typeof $callback === 'function' && $callback({}); //返回一个回调事件
        }
    });
}

/*
* 获取中心检验项目 编辑  单个实体信息
* */
function getCenterInspectionEdit(orderMainId, $callback) {
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/tesPlan/getCenterInspectionEdit.do",
        data: {"orderMainId": orderMainId},
        dataType: "json",
        done: function (data) {
            //  获取检验项目信息 填充下拉框
            var html = " <option selected value=" + data.orderMainId + ">" + data.orderName + "</option>"
            $("#orderMainId").append(html)

            tesPlanCenterPlanEdit.disabled = {disabled: true};

            typeof $callback === 'function' && $callback({}); //返回一个回调事件
        }
    });
}

/*
* 获取检验频次
* */
/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(id, patientId, orderMainId) {
    if (isEmpty(id)) {
        //新增
        //获取下拉框 检验频次的额数据
        var checkBosList = getSysDictByCode("TestFrequency", false);
        for (var i = 0; i < checkBosList.length; i++) {
            var html = " <option value=" + checkBosList[i].dictBizCode + ">" + checkBosList[i].name + "</option>"
            $("#testTimes").append(html)
        }
        //获取下拉框 检验项目的额数据
        getCenterInspectionList(function () {
            var form = layui.form;
            form.render();
        });
    } else {
        //编辑
        $("#testPlanId").val(id)
        var param = {
            "tesPlanId": id, "orderMainId": orderMainId
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/tesPlan/getTestCenterPlanInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //获取下拉框 检验频次的额数据
                var checkBosList = getSysDictByCode("TestFrequency", false);
                for (var i = 0; i < checkBosList.length; i++) {
                    var html = "";
                    if (checkBosList[i].dictBizCode === data.testTimes) {
                        html = " <option selected value=" + checkBosList[i].dictBizCode + ">" + checkBosList[i].name + "</option>"
                    } else {
                        html = " <option value=" + checkBosList[i].dictBizCode + ">" + checkBosList[i].name + "</option>"
                    }

                    $("#testTimes").append(html)
                    tesPlanCenterPlanEdit.disabled = {disabled: true};
                }
                //获取下拉框 检验项目的额据
                getCenterInspectionEdit(data.orderMainId, function () {
                    var form = layui.form;
                    form.render();
                });
                $("#dataStatus").val(data.dataStatus)
                if (data.dataStatus === '0') {
                    $("#dataStatus").attr("checked", "checked")
                }
                $("#remarks").val(data.remarks)
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
    form.on('submit(tesPlanCenterPlanEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        //判断选中那个状态
        if (!field.hasOwnProperty("dataStatus")) {
            field["dataStatus"] = '1';//停用状态
        } else {
            //    启用状态
            field.dataStatus = '0';
        }
        field['planType'] = '1' //个人计划
        field["testPlanId"] = tesPlanCenterPlanEdit.tesPlanId
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#tesPlanCenterPlanEdit_submit").trigger('click');
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
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/tesPlan/centerPlanAdd.do",
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



