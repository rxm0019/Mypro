/**
 * 透析方案
 * @author care
 * @date 2020-08-12
 * @version 1.0
 */
var patDialysisSchemeList = avalon.define({
    $id: "patDialysisSchemeList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    anticoagulantUnit: $.constant.AnticoagulantUnit,//抗凝剂单位
    consDialysisMode: $.constant.DialysisMode,
    patPatientInfo: null,//患者透析基础信息
    baseInfoReadOnly: true,// 透析基础表单只读状态
    formReadOnly: true, // 透析处方表单只读状态
    makerName: [],//获取到的当前角色
    isShow: true,//透析基础信息显示或隐藏
    isShowScheme: true,//透析处方信息显示或隐藏
    patientId: GetQueryString("patientId"),//患者ID
    schemeUserId: '',//用户ID
    roleId: baseFuncInfo.userInfoData.roleid,//角色ID
    dialysisSchemeId: '',//ID
    dryWeight: '', //干体重
    add: '',//透析处方添加标记
    dialysisMode: '', //透析方式
    addUnit: '',//追加单位
    chartShow: true,//干体重图表
    dateArr: [],
    numArr: [],
    isLayEvent: false,//启用、停用时控制状态
});
layui.use(['index', 'layedit', 'laydate'], function () {
    var form = layui.form
        , laydate = layui.laydate;
    laydate.render({
        elem: '#schemeDate'
        , type: 'date'
        , trigger: 'click'
        , value: new Date()
    });
    //透析方式下拉选取
    form.on('select(dialysisMode)', function (obj) {
        if (isNotEmpty(obj.value)) {
            patDialysisSchemeList.dialysisMode = obj.value;
            var code = getSysDictBizCode("DialysisMode", obj.value);
            isDialysisModeShow(code)
        }
    });
    //首推剂量的单位
    form.on('select(dosageFirstUnit)', function (obj) {
        var code = getSysDictBizCode("AnticoagulantUnit", obj.value)
        patDialysisSchemeList.addUnit = code;

    })

    //监听提交
    form.on('submit(updatePatDialysisSchemeEdit_form)', function (data) {

        var data = data.field;
        if (patDialysisSchemeList.add == "add") {
            //当点击添加按钮时清空id
            data.dialysisSchemeId = "";
            data.patientId = patDialysisSchemeList.patientId;
        } else {
            data.dialysisSchemeId = patDialysisSchemeList.dialysisSchemeId;
            data.patientId = patDialysisSchemeList.patientId;
        }
        saveOrEdit(data);
        return false;
    });
    // 透析处方 - 干体重图表：鼠标移入时显示上一次的透析病情，鼠标移除时隐藏
    $("#iconDryWeightChart").mouseover(function () {
        var targetOffset = $(this).offset();
        $("#patientDryWeightChart").css("top", (targetOffset.top - 95) + "px");
        $("#patientDryWeightChart").css("right", (targetOffset.right - 10) + "px");
        $("#patientDryWeightChart").removeClass("layui-hide");
    });
    $("#iconDryWeightChart").mouseout(function () {
        $("#patientDryWeightChart").addClass("layui-hide");
    });
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        // 初始化表单
        initFormVerify();
        //所有的入口事件写在这里...
        getDialysisBasicInfor(patDialysisSchemeList.patientId); //获取透析基础信息
        // initSearch(); //初始化搜索框
        getList(patDialysisSchemeList.patientId);  //查询列表
        getMakerInfo();
        avalon.scan();
    });
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


/**
 * 透析基础修改按钮切换
 */
function update_info() {
    setBaseInfoFormReadonly(false);
    patDialysisSchemeList.isShow = false;
}

/**
 * 透析基础取消按钮
 */
function cancelScheme_Info() {
    patDialysisSchemeList.isShow = true;//切换至透析基础信息
    setBaseInfoFormReadonly(true);
}

/**
 * 获取透析基础信息
 */
function getDialysisBasicInfor(patientId) {
    var url = "";
    if (isNotEmpty(patientId)) {
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patDialysisScheme/getDialysisBasicInfor.do",
            data: {patientId: patientId},
            dataType: "json",
            done: function (data) {
                var patPatientInfo = data.patPatientInfo;
                var lastDryWeightList = data.lastDryWeightList;
                if (patPatientInfo) {
                    var form = layui.form; //调用layui的form模块
                    form.val('patDialysisScheme_Info_form', patPatientInfo);
                }
                initDryWeightHistoryChart(lastDryWeightList);
                // patDialysisSchemeList.patPatientInfo = patPatientInfo;
            }
        });
    }
}

/**
 * 设置透析基础表单是否只读
 * @param formReadonly true / false
 */
function setBaseInfoFormReadonly(formReadonly) {
    patDialysisSchemeList.baseInfoReadOnly = formReadonly;
    layui.form.render('select');
}

/**
 * 设置透析处方表单是否只读
 * @param formReadonly true / false
 */
function setFormReadonly(formReadonly) {
    patDialysisSchemeList.formReadOnly = formReadonly;
    layui.form.render('select');
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(patDialysisScheme_Info_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#patDialysisScheme_Info_submit").trigger('click');
}

/**
 * 透析基础信息--调整备注弹框并保存信息
 */
function saveDialysisScheme_Info() {
    verify_form(function (field) {
        var uuid = guid();
        sessionStorage.setItem(uuid, JSON.stringify(field));
        var url = "";
        var title = "";
        title = "调整透析基础信息确认";
        url = $.config.server + "/patient/patDialysisBaseRemarkEdit?uuid=" + uuid;
        //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
        _layerOpen({
            url: url,  //弹框自定义的url，会默认采取type=2
            width: 400, //弹框自定义的宽度，方法会自动判断是否超过宽度
            height: 300,  //弹框自定义的高度，方法会自动判断是否超过高度
            title: title, //弹框标题
            done: function (index, iframeWin) {
                /**
                 * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
                 * 利用iframeWin可以执行弹框的方法，比如save方法
                 */
                var ids = iframeWin.save(
                    //成功保存之后的操作，刷新页面
                    function success() {
                        successToast("保存成功");
                        patDialysisSchemeList.isShow = true;
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                        setTimeout(function () {
                            window.location.reload();
                        }, 500);
                    });
            }
        });
    });
}

/**
 * 初始化干体重历史信息图表
 * @param lastDryWeightList
 */
function initDryWeightHistoryChart(lastDryWeightList) {
    // 获取图表数据
    var statisticalDateArr = [];
    var dryWeightArr = [];
    if (lastDryWeightList && lastDryWeightList.length > 0) {
        $.each(lastDryWeightList, function (index, item) {
            statisticalDateArr.push(layui.util.toDateString(item.statisticalDate, "yyyy-MM-dd\nHH:mm"));
            dryWeightArr.push(item.dryWeight);
        });
    }

    // 初始化图表
    var targetItem = document.getElementById("patientDryWeightChart");
    var echartObj = echarts.init(targetItem);
    echartObj.setOption({
        title: {
            text: '透析方案干体重调整记录（最近10次）',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: statisticalDateArr,
            name: '调整日期'
        },
        yAxis: {
            type: 'value',
            name: '调整值'
        },
        grid: {
            top: '60',
            left: '30',
            right: '80',
            bottom: '10',
            containLabel: true
        },
        series: [{
            data: dryWeightArr,
            type: 'line',
            itemStyle: {normal: {label: {show: true}}}   //每个顶点显示数值
        }]
    }, true);

    // 盒子大小改变时，重设图表大小
    $(targetItem).resize(function () {
        echartObj.resize();
    });
}

/**
 * 透析处方信息修改按钮切换
 */
function updateSchemeEditOrEdit() {
    var dialysisSchemeId = patDialysisSchemeList.dialysisSchemeId;
    if (dialysisSchemeId === "") {
        warningToast("请点击要修改的数据行");
        return false;
    } else {
        getDialysisPrescriptInfor(dialysisSchemeId);
        patDialysisSchemeList.add = "";
        patDialysisSchemeList.isShowScheme = false;
        // $("#dialysisMode").attr("disabled", "disabled");
        layui.form.render('select');
    }
}


/**
 * 透析处方信息添加按钮切换
 */
function addSchemeEditOrEdit() {
    patDialysisSchemeList.dialysisMode = "";//添加时清空透析方式
    patDialysisSchemeList.isShowScheme = false;
    setFormReadonly(false);

    // patDialysisSchemeList.add = "add";//添加标记
    // getMakerInfo(baseFuncInfo.userInfoData.roleid);
    // layui.laydate.render({
    //     elem: '#schemeDate'
    //     , type: 'date'
    //     , trigger: 'click'
    //     , value: new Date()
    // });
    // layui.form.render();
}

/**
 * 获取透析处方信息
 */
function getDialysisPrescriptInfor(dialysisSchemeId) {
    var url = "";
    if (isNotEmpty(dialysisSchemeId)) {
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patDialysisScheme/getDialysisPrescriptInfor.do",
            data: {dialysisSchemeId: dialysisSchemeId},
            dataType: "json",
            done: function (data) {
                patDialysisSchemeList.addUnit = '';

                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                var util = layui.util;
                data.schemeDate = util.toDateString(data.schemeDate, "yyyy-MM-dd");
                var userId = baseFuncInfo.userInfoData.userid;
                patDialysisSchemeList.schemeUserId = userId;
                patDialysisSchemeList.addUnit = getSysDictName("AnticoagulantUnit", data.dosageFirstUnit);//追加单位回显
                if (isNotEmpty(data.dialysisMode)) {
                    var code = getSysDictBizCode("DialysisMode", data.dialysisMode);
                    isDialysisModeShow(code);
                }
                form.val('patDialysisSchemeEdit_form', data);
            }
        });
    }
}

/**
 * 保存透析处方信息
 */
function saveOrEdit(data) {
    var url = "";
    if (isEmpty(data.dialysisSchemeId)) {  //id为空,新增操作
        url = $.config.services.dialysis + "/patDialysisScheme/save.do";
    } else {  //编辑
        url = $.config.services.dialysis + "/patDialysisScheme/edit.do";
    }
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: url,
        data: data,
        dataType: "json",
        done: function (data) {
            if (data == 1) {
                patDialysisSchemeList.isShowScheme = true;//切换至透析基础信息
                successToast("保存成功");
                var table = layui.table; //获取layui的table模块
                table.reload('patDialysisSchemeList_table'); //重新刷新table
            } else {
                patDialysisSchemeList.isShowScheme = true;//切换至透析基础信息
                errorToast("保存失败！");
                var table = layui.table; //获取layui的table模块
                table.reload('patDialysisSchemeList_table'); //重新刷新table
            }
        }
    });
}

/**
 * 透析处方取消按钮
 */
function cancelSchemeEdit_form() {
    patDialysisSchemeList.isShowScheme = true;//切换至透析基础信息
    getDialysisPrescriptInfor(patDialysisSchemeList.dialysisSchemeId);
}

/**
 * 获取制定人信息
 */
function getMakerInfo() {
    _ajax({
        type: "POST",
        loading: true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getDoctorRoleList.do",
        dataType: "json",
        done: function (data) {
            var form = layui.form; //调用layui的form模块
            patDialysisSchemeList.makerName = data;
            var doctorId = '';
            data.forEach(function (item, i) {
                if (item.id == baseFuncInfo.userInfoData.userid) {
                    doctorId = item.id;
                }
            })
            if (isEmpty(patDialysisSchemeList.schemeUserId)) {
                $('#schemeUserId').val(doctorId);
            }
            form.render();
        }
    });

}

/**
 * 查询列表事件
 */
function getList(patientId) {
    var param = {
        "patientId": patientId
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#patDialysisSchemeList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patDialysisSchemeList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            // height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patDialysisScheme/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {type: 'numbers', title: '序号', width: 60}  //序号
                , {
                    field: 'dialysisMode', title: '透析方式', align: 'center'
                    , templet: function (d) {
                        return getSysDictName("DialysisMode", d.dialysisMode);
                    }
                }
                , {
                    field: 'dialysisFrequency', title: '透析频次', align: 'center'
                    , templet: function (d) {
                        return getSysDictName("DialysisFrequency", d.dialysisFrequency);
                    }
                }
                , {field: 'makerName', title: '制定人', align: 'center'}
                ,
                {
                    field: 'dataStatus', title: '状态', align: 'center',
                    templet: function (d) {
                        return d.dataStatus === '0' ? '启用' : '停用';
                    }
                }
                , {
                    field: 'schemeDate', title: '制定时间', align: 'center'
                    , templet: function (d) {
                        return util.toDateString(d.schemeDate, "yyyy-MM-dd");
                    }
                }
                , {
                    fixed: 'right', title: '操作', align: 'center', width: 150
                    , toolbar: '#patDialysisSchemeList_bar'
                }
            ]],
        },
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            if (layEvent === 'enable') { // 启用  停用

                patDialysisSchemeList.isLayEvent = true;
                var title = '';
                if (data.dataStatus === '0') {
                    title = '确定停用此透析方案吗？';
                } else {
                    title = '确定启用此透析方案吗？';
                }
                layer.confirm(title, {
                    title: "信息",
                    btn: ['确定', '取消'],
                    cancel: function () {
                        patDialysisSchemeList.isLayEvent = false;
                    },
                    btn1: function (index) {
                        patDialysisSchemeList.isLayEvent = false;
                        layer.close(index);
                        //向服务端发送删除指令
                        if (isNotEmpty(data.dialysisSchemeId)) {
                            enable(data.dialysisSchemeId, data.dataStatus);
                        }
                    },
                    btn2: function (index, layero) {
                        patDialysisSchemeList.isLayEvent = false;
                        layer.close(index);
                    }
                });
            }
        }
    });
    //监听行单击事件（双击事件为：rowDouble）
    table.on('row(patDialysisSchemeList_table)', function (obj) {
        if (patDialysisSchemeList.isLayEvent) {
            return false;
        }
        var data = obj.data;
        if (data != null) {
            patDialysisSchemeList.dialysisSchemeId = data.dialysisSchemeId;
            getDialysisPrescriptInfor(data.dialysisSchemeId);
        }
        //标注选中样式
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
    });
}

/**
 * 启用停用排程
 * @param ids
 */
function enable(id, status) {

    var msg = '';
    var dataStatus = '';
    if (status === '0') {
        msg = '停用成功';
        dataStatus = '1';
    } else {
        msg = '启用成功';
        dataStatus = '0';
    }
    var param = {
        "dialysisSchemeId": id,
        "dataStatus": dataStatus
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patDialysisScheme/enable.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast(msg);
            var table = layui.table; //获取layui的table模块
            table.reload('patDialysisSchemeList_table'); //重新刷新table
        }
    });
}

/**
 * 删除事件
 * @param ids
 */
function del() {
    var ids = [];
    var id = patDialysisSchemeList.dialysisSchemeId
    if (id === "") {
        warningToast("请点击要删除的数据行");
        return false;
    } else {
        ids.push(id)
        var param = {
            "ids": ids
        };
        layer.confirm('确定删除所选记录吗？', function (index) {
            layer.close(index);
            _ajax({
                type: "POST",
                url: $.config.services.dialysis + "/patDialysisScheme/delete.do",
                data: param,  //必须字符串后台才能接收list,
                loading: false,  //是否ajax启用等待旋转框，默认是true
                dataType: "json",
                done: function (data) {
                    successToast("删除成功");
                    patDialysisSchemeList.dialysisSchemeId = "";//删除成功之后置空透析方案id
                    var table = layui.table; //获取layui的table模块
                    table.reload('patDialysisSchemeList_table'); //重新刷新table
                }
            });
        });
    }
}

/**
 * 模板管理
 */
function templateManage(data) {
    var url = "";
    var title = "";
    if (isEmpty(data)) {  //id为空,新增操作
        title = "透析方案模板管理";
        url = $.config.server + "/patient/patDialysisSchemeEdit";
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 1600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 1000,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        btn: [],
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('patDialysisSchemeList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
                , data);
        }
    });
}

/**
 * 模板导入
 */
function templateImport() {
    if (isEmpty(patDialysisSchemeList.dialysisMode)) {
        warningToast("请先选择透析方式！");
        return;
    } else {
        var url = "";
        var dialysisMode = patDialysisSchemeList.dialysisMode;
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patDialysisScheme/templateImport.do",
            data: {dialysisMode: dialysisMode},
            dataType: "json",
            success: function (res) {
                if (res.msg) {
                    errorToast(res.msg);
                    return;
                }
                if (res.bizData) {
                    if (res.bizData.dataStatus === "1") {
                        errorToast("该模板已停用");
                        return false;
                    }
                    if (isNotEmpty(res.bizData.dialysisMode)) {
                        var code = getSysDictBizCode("DialysisMode", res.bizData.dialysisMode);
                        isDialysisModeShow(code);
                    }

                    successToast("导入成功")
                    var form = layui.form; //调用layui的form模块
                    res.bizData.schemeDate = layui.util.toDateString(res.bizData.schemeDate, "yyyy-MM-dd");
                    form.val('patDialysisSchemeEdit_form', res.bizData);
                }
            },
        });
    }
}

/**
 * 根据透析方式显示或隐藏对应的栏位
 * @param code
 */
function isDialysisModeShow(code) {
    if (code === patDialysisSchemeList.consDialysisMode.HD) {//透析方式为HD
        $("#replacementFluidAll").addClass("layui-hide");//置换液模块
        $("#irrigatorShow").addClass("layui-hide");//灌流器
        $("#hemofilterShow").addClass("layui-hide"); //血滤器
        $("#dialyzerShow").removeClass("layui-hide"); //透析器
        $("#substituteMode").val("");
        $("#replacementFluidTotal").val("");
        $("#replacementFluidFlowRate").val("");
        $("#irrigator").val("");//灌流器
        $("#filter").val("");//血滤器
    } else if (code === patDialysisSchemeList.consDialysisMode.HDF) {//HDF
        $("#replacementFluidAll").removeClass("layui-hide");//置换液模块
        $("#irrigatorShow").addClass("layui-hide");//灌流器
        $("#hemofilterShow").addClass("layui-hide"); //血滤器
        $("#dialyzerShow").removeClass("layui-hide"); //透析器
        $("#irrigator").val("");//灌流器
        $("#filter").val("");//血滤器
    } else if (code === patDialysisSchemeList.consDialysisMode.HP) {//HP
        $("#replacementFluidAll").removeClass("layui-hide");//置换液模块
        $("#irrigatorShow").removeClass("layui-hide");//灌流器
        $("#hemofilterShow").addClass("layui-hide"); //血滤器
        $("#dialyzerShow").addClass("layui-hide"); //透析器
        $("#filter").val("");//血滤器
        $("#dialyzer").val("");//透析器
    } else if (code === patDialysisSchemeList.consDialysisMode.HDHP) {//HD+HP
        $("#replacementFluidAll").addClass("layui-hide");//置换液模块
        $("#hemofilterShow").addClass("layui-hide"); //血滤器
        $("#irrigatorShow").removeClass("layui-hide");//灌流器
        $("#dialyzerShow").removeClass("layui-hide"); //透析器
        $("#substituteMode").val("");
        $("#replacementFluidTotal").val("");
        $("#replacementFluidFlowRate").val("");
        $("#filter").val("");//血滤器
    } else if (code === patDialysisSchemeList.consDialysisMode.HF) {//HD+HP
        $("#replacementFluidAll").removeClass("layui-hide");//置换液模块
        $("#hemofilterShow").removeClass("layui-hide"); //血滤器
        $("#irrigatorShow").addClass("layui-hide");//灌流器
        $("#dialyzerShow").addClass("layui-hide"); //透析器
        $("#substituteMode").val("");
        $("#replacementFluidTotal").val("");
        $("#replacementFluidFlowRate").val("");
        $("#irrigator").val("");//灌流器
        $("#dialyzer").val("");//透析器
    } else {
        $("#replacementFluidAll").removeClass("layui-hide");//置换液模块
        $("#hemofilterShow").removeClass("layui-hide"); //血滤器
        $("#irrigatorShow").removeClass("layui-hide");//灌流器
        $("#dialyzerShow").removeClass("layui-hide"); //透析器
    }
    layui.form.render();
}