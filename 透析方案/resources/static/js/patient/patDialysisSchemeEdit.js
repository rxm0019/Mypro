/**
 * 透析方案--模板
 * @author care
 * @date 2020-08-12
 * @version 1.0
 */
var patDialysisSchemeEdit = avalon.define({
    $id: "patDialysisSchemeEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    anticoagulantUnit: $.constant.AnticoagulantUnit,//抗凝剂单位
    consDialysisMode: $.constant.DialysisMode,
    isShowScheme: true,//透析处方信息显示或隐藏
    schemeUserId: '',//用户ID
    makerName: [],//获取到的当前角色
    roleId: baseFuncInfo.userInfoData.roleid,//角色ID
    dialysisSchemeId: '',
    add: '',
    addUnit: '',//追加单位
    isLayEvent: false,
});

layui.use(['index', 'layedit', 'laydate'], function () {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , laydate = layui.laydate;
    laydate.render({
        elem: '#schemeDate'
        , type: 'date'
        , trigger: 'click'
        , value: new Date()
    });
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        // 初始化表单
        initFormVerify();
        getTemplateList();  //查询列表
        getMakerInfo();
        avalon.scan();
    });
});

//校验透析处方信息表单提交
layui.use(['form', 'layedit', 'laydate'], function () {
    var form = layui.form
        , laydate = layui.laydate;
    laydate.render({
        elem: '#schemeDate'
        , type: 'date'
        , trigger: 'click'
        , value: new Date()
    });
    //首推剂量的单位
    form.on('select(dosageFirstUnit)', function (obj) {
        var code = getSysDictBizCode("AnticoagulantUnit", obj.value)
        if (code === patDialysisSchemeEdit.anticoagulantUnit.MG) {
            patDialysisSchemeEdit.addUnit = code;
        } else if (code === patDialysisSchemeEdit.anticoagulantUnit.ML) {
            patDialysisSchemeEdit.addUnit = code;
        } else if (code === patDialysisSchemeEdit.anticoagulantUnit.U) {
            patDialysisSchemeEdit.addUnit = code;
        } else if (code === patDialysisSchemeEdit.anticoagulantUnit.IU) {
            patDialysisSchemeEdit.addUnit = code
        }
    })
    //透析方式下拉选取
    form.on('select(dialysisMode)', function (obj) {
        if (isNotEmpty(obj.value)) {
            var code = getSysDictBizCode("DialysisMode", obj.value);
            isDialysisModeShow(code)
        }

    });
    //初始透析处方只读状态
    setPrescripReadOnly(true);
    //监听提交
    form.on('submit(updatePatDialysisSchemeEdit_form)', function (data) {
        var data = data.field;
        if (patDialysisSchemeEdit.add = "add") {
            //当点击添加按钮时清空id
            patDialysisSchemeEdit.dialysisSchemeId = "";
        }
        saveOrEdit(data);
        return false;
    });
    avalon.scan();
});

/**
 * 初始化表单验证方法
 */
function initFormVerify() {
    layui.form.verify({
        // 字段必填校验
        fieldRequired: function(value, item) {
            var target = $(item);
            var fieldName = target.attr("data-field-name") || "";
            if (isEmpty(value.trim())) {
                return fieldName + "不能为空";
            }
        },
        // 字段数值范围校验
        fieldNotInRange: function(value, item) {
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
                return fieldName + "只能输入" + minValue +"~" + maxValue + "的值";
            }
        }
    });
}
/**
 * 透析处方信息设置读写状态
 */
function setPrescripReadOnly(status) {
    var readForm = layui.$('[lay-filter="patDialysisSchemeEdit_form"]')
    readForm.find('input,textarea').prop('readonly', status);
    readForm.find('select').prop('disabled', status);
    $("input[name='schemeDate']").attr("disabled", status);
    layui.form.render();
}

/**
 * 透析处方信息修改按钮切换
 */
function updateSchemeEditOrEdit() {
    var dialysisSchemeId = patDialysisSchemeEdit.dialysisSchemeId
    if (dialysisSchemeId === "") {
        warningToast("请点击要修改的数据行");
        return false;
    } else {
        getDialysisPrescriptInfor(dialysisSchemeId);
        setPrescripReadOnly(false);
        patDialysisSchemeEdit.isShowScheme = false;
        patDialysisSchemeEdit.add = "";
        $("#dialysisMode").attr("disabled", "disabled");
        form.render('select');
    }
}

/**
 * 透析处方信息添加按钮切换
 */
function addSchemeEditOrEdit() {
    $("#dialysisSchemeId").val("");
    patDialysisSchemeEdit.dialysisMode = "";//添加时清空透析方式
    $("#patDialysisSchemeEdit_form")[0].reset();
    patDialysisSchemeEdit.isShowScheme = false;
    setPrescripReadOnly(false);
    patDialysisSchemeEdit.add = "add";
    getMakerInfo();
    layui.laydate.render({
        elem: '#schemeDate'
        , type: 'date'
        , trigger: 'click'
        , value: new Date()
    });
    layui.form.render();
}

/**
 * 获取透析处方信息
 */
function getDialysisPrescriptInfor(dialysisSchemeId, $callback) {
    var url = "";
    if (isNotEmpty(dialysisSchemeId)) {
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patDialysisScheme/getDialysisPrescriptInfor.do",
            data: {dialysisSchemeId: dialysisSchemeId},
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                var util = layui.util;
                data.schemeDate = util.toDateString(data.schemeDate, "yyyy-MM-dd");
                var userId = baseFuncInfo.userInfoData.userid;
                patDialysisSchemeEdit.schemeUserId = userId;
                patDialysisSchemeEdit.addUnit = getSysDictName("AnticoagulantUnit", data.dosageFirstUnit);//追加单位回显
                if (isNotEmpty(data.dialysisMode)) {
                    var code = getSysDictBizCode("DialysisMode", data.dialysisMode);
                    isDialysisModeShow(code);
                }
                form.val('patDialysisSchemeEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });

    }
}

/**
 * 保存透析处方信息
 */
function saveOrEdit(data) {
    var url = "";
    if (isNotEmpty(data)) {
        if (isEmpty(data.dialysisSchemeId)) {  //id为空,新增操作
            url = $.config.services.dialysis + "/patDialysisScheme/templateSave.do";
        } else {  //编辑
            url = $.config.services.dialysis + "/patDialysisScheme/templateEdit.do";
        }
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data: data,
            dataType: "json",
            done: function (data) {
                if (data == 1) {
                    patDialysisSchemeEdit.isShowScheme = true;//切换至透析基础信息
                    successToast("保存成功");
                    setPrescripReadOnly(true);
                    var table = layui.table; //获取layui的table模块
                    table.reload('patDialysisSchemeEdit_table'); //重新刷新table
                } else {
                    patDialysisSchemeEdit.isShowScheme = true;//切换至透析基础信息
                    errorToast("保存失败！");
                    setPrescripReadOnly(true);
                    var table = layui.table; //获取layui的table模块
                    table.reload('patDialysisSchemeEdit_table'); //重新刷新table
                }
            }
        });
    }
}

/**
 * 透析处方取消按钮
 */
function cancelSchemeEdit_form() {
    setPrescripReadOnly(true);
    patDialysisSchemeEdit.isShowScheme = true;//切换至透析处方信息
    getDialysisPrescriptInfor(patDialysisSchemeEdit.dialysisSchemeId);
}

/**
 * 获取制定人信息
 */
function getMakerInfo() {
    _ajax({
        type: "POST",
        loading: true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getDoctorRoleList.do",
        data: {},
        dataType: "json",
        done: function (data) {
            var form = layui.form; //调用layui的form模块
            patDialysisSchemeEdit.makerName = data;
            var doctorId = '';
            data.forEach(function (item, i) {
                if (item.id == baseFuncInfo.userInfoData.userid) {
                    doctorId = item.id;
                }
            })
            if (isEmpty(patDialysisSchemeEdit.schemeUserId)) {
                $('#schemeUserId').val(doctorId);
            }
            form.render();
        }
    });
}

/**
 * 查询列表事件
 */
function getTemplateList() {
    var param = {};
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#patDialysisSchemeEdit_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patDialysisSchemeEdit_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            // height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patDialysisScheme/templateList.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {type: 'numbers', title: '序号', width: 60}  //序号
                , {
                    field: 'dialysisMode', title: '透析方式', align: 'center', sortField: 'pds_.dialysis_mode'
                    , templet: function (d) {
                        return getSysDictName("DialysisMode", d.dialysisMode);
                    }
                }
                , {
                    field: 'dialysisFrequency', title: '透析频次', align: 'center', sortField: 'pds_.dialysis_frequency'
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
                    field: 'schemeDate', title: '制定时间', align: 'center', sortField: 'pds_.scheme_date'
                    , templet: function (d) {
                        return util.toDateString(d.schemeDate, "yyyy-MM-dd");
                    }
                }
                , {
                    fixed: 'right', title: '操作', align: 'center', width: 150
                    , toolbar: '#patDialysisSchemeEdit_bar'
                }
            ]]
        },
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            if (layEvent === 'enable') { // 启用  停用
                patDialysisSchemeEdit.isLayEvent = true;
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
                        patDialysisSchemeEdit.isLayEvent = false;
                    },
                    btn1: function (index) {
                        patDialysisSchemeEdit.isLayEvent = false;
                        layer.close(index);
                        //向服务端发送删除指令
                        if (isNotEmpty(data.dialysisSchemeId)) {
                            enableTemplate(data.dialysisSchemeId, data.dataStatus);
                        }
                    },
                    btn2: function (index, layero) {
                        patDialysisSchemeEdit.isLayEvent = false;
                        layer.close(index);
                    }
                });
            }
        }
    });
    //监听行单击事件（双击事件为：rowDouble）
    table.on('row(patDialysisSchemeEdit_table)', function (obj) {
        if (patDialysisSchemeEdit.isLayEvent) {
            return false;
        }
        var data = obj.data;
        if (data != null) {
            patDialysisSchemeEdit.dialysisSchemeId = data.dialysisSchemeId;
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
function enableTemplate(id, status) {

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
        url: $.config.services.dialysis + "/patDialysisScheme/templateEnable.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast(msg);
            var table = layui.table; //获取layui的table模块
            table.reload('patDialysisSchemeEdit_table'); //重新刷新table
        }
    });
}

/**
 * 删除事件
 * @param ids
 */
function del() {
    var ids = [];
    var id = patDialysisSchemeEdit.dialysisSchemeId
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
                    patDialysisSchemeEdit.dialysisSchemeId = "";//删除成功之后置空透析方案id
                    $("#patDialysisSchemeEdit_form")[0].reset();//清空form表单
                    setPrescripReadOnly(true);
                    var table = layui.table; //获取layui的table模块
                    table.reload('patDialysisSchemeEdit_table'); //重新刷新table
                }
            });
        });

    }
}

/**
 * 根据透析方式显示或隐藏对应的栏位
 * @param code
 */
function isDialysisModeShow(code) {
    if (code === patDialysisSchemeEdit.consDialysisMode.HD) {//透析方式为HD
        $("#replacementFluidAll").addClass("layui-hide");//置换液模块
        $("#irrigatorShow").addClass("layui-hide");//灌流器
        $("#hemofilterShow").addClass("layui-hide"); //血滤器
        $("#dialyzerShow").removeClass("layui-hide"); //透析器
        $("#substituteMode").val("");
        $("#replacementFluidTotal").val("");
        $("#replacementFluidFlowRate").val("");
        $("#irrigator").val("");//灌流器
        $("#filter").val("");//血滤器
    } else if (code === patDialysisSchemeEdit.consDialysisMode.HDF) {//HDF
        $("#replacementFluidAll").removeClass("layui-hide");//置换液模块
        $("#irrigatorShow").addClass("layui-hide");//灌流器
        $("#hemofilterShow").addClass("layui-hide"); //血滤器
        $("#dialyzerShow").removeClass("layui-hide"); //透析器
        $("#irrigator").val("");//灌流器
        $("#filter").val("");//血滤器
    } else if (code === patDialysisSchemeEdit.consDialysisMode.HP) {//HP
        $("#replacementFluidAll").removeClass("layui-hide");//置换液模块
        $("#irrigatorShow").removeClass("layui-hide");//灌流器
        $("#hemofilterShow").addClass("layui-hide"); //血滤器
        $("#dialyzerShow").addClass("layui-hide"); //透析器
        $("#filter").val("");//血滤器
        $("#dialyzer").val("");//透析器
    } else if (code === patDialysisSchemeEdit.consDialysisMode.HDHP) {//HD+HP
        $("#replacementFluidAll").addClass("layui-hide");//置换液模块
        $("#hemofilterShow").addClass("layui-hide"); //血滤器
        $("#irrigatorShow").removeClass("layui-hide");//灌流器
        $("#dialyzerShow").removeClass("layui-hide"); //透析器
        $("#substituteMode").val("");
        $("#replacementFluidTotal").val("");
        $("#replacementFluidFlowRate").val("");
        $("#filter").val("");//血滤器
    } else {
        $("#replacementFluidAll").removeClass("layui-hide");//置换液模块
        $("#hemofilterShow").removeClass("layui-hide"); //血滤器
        $("#irrigatorShow").removeClass("layui-hide");//灌流器
        $("#dialyzerShow").removeClass("layui-hide"); //透析器
    }
    layui.form.render();
}

//关闭弹窗
function cancelBtn() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}



