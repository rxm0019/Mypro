/**
 * 编辑病症监测
 * @author Care
 * @date 2020-09-20
 * @version 1.0
 */
var diaUnusualRecordEdit = avalon.define({
    $id: "diaUnusualRecordEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    roleId: baseFuncInfo.userInfoData.roleid,//角色ID
    patientId: '',//患者Ｉｄ
    dialysisDate: '',
});

layui.use(['index', 'formSelects'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
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
        // diaUnusualRecordEdit.dialysisDate = GetQueryString("dialysisDate");  //接收变量

        diaUnusualRecordEdit.patientId = GetQueryString("patientId");  //接收变量
        if (diaRecordId != 'null') {
            $("#diaRecordId").val(diaRecordId);
        }
        if (patientId != 'null') {
            $("#patientId").val(diaUnusualRecordEdit.patientId);
        }

        initForm();
        initFormVerify();
        //获取实体信息
        getInfo(id, function (data) {
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });

        avalon.scan();
    });
});

function initForm() {
    // 点击处理详情时显示下拉列表，点击其他范围时隐藏下拉列表
    $(document).click(function(){
        $("#diaUnusualRecordEdit_form dl[xid='handleDetailOptions']").hide();
    });
    $("#diaUnusualRecordEdit_form input[name='handleDetails']").on("click", function (e) {
        e.stopPropagation();
        $("#diaUnusualRecordEdit_form dl[xid='handleDetailOptions']").show();
    });
    // 处理详情选项改变时，拼接处理详情内容
    layui.formSelects.on('handleDetailOptions', function (id, vals, val, isAdd, isDisabled) {
        setTimeout(function () {
            var handleDetailOptions = layui.form.val("diaUnusualRecordEdit_form").handleDetailOptions || "";
            var handleDetailValues = handleDetailOptions.split(",");
            var handleDetailsDict = getSysDictMap($.dictType.HandleDetails);
            var handleDetailDescs = [];
            $.each(handleDetailValues, function (index, item) {
                if (handleDetailsDict[item]) {
                    handleDetailDescs.push(handleDetailsDict[item].name);
                }
            });

            layui.form.val("diaUnusualRecordEdit_form", {
                handleDetails: handleDetailDescs.join("；")
            });
        }, 100)
    });
}

/**
 * 初始化表单验证方法
 */
function initFormVerify() {
    layui.form.verify({
        // 床位必填校验
        monitorTimeRequired: function (value, item) {
            if (isEmpty(value.trim())) {
                return "监测日期不能为空";
            }
        },
        unusualDetailsRequired: function (value, item) {
            if (isEmpty(value.trim())) {
                return "病症及体征不能为空";
            }
        },
        handleDetailsRequired: function (value, item) {
            if (isEmpty(value.trim())) {
                return "处理详情不能为空";
            }
        }
    })
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
            "unusualRecordId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/diaUnusualRecord/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var unusualDetailsArr = data.unusualDetails.split(",");
                layui.formSelects.value('unusualDetails', unusualDetailsArr, true);
                data.monitorTime = layui.util.toDateString(data.monitorTime, "HH:mm");
                form.val('diaUnusualRecordEdit_form', data);
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
    var util = layui.util;
    var form = layui.form; //调用layui的form模块
    form.on('submit(diaUnusualRecordEdit_submit)', function (data) {
        // util.toDateString(diaUnusualRecordEdit.dialysisDate,"yyyy-MM-dd");
        //  data.field.dialysisDate=diaUnusualRecordEdit.dialysisDate
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#diaUnusualRecordEdit_submit").trigger('click');
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
        if (isEmpty(param.unusualRecordId)) {
            url = $.config.services.dialysis + "/diaUnusualRecord/add.do";
        } else {
            var url = $.config.services.dialysis + "/diaUnusualRecord/edit.do";
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



