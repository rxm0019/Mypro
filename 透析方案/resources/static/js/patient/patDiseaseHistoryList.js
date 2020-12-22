/**
 * 患者管理--病情记录--病史
 * @author Care
 * @date 2020-09-02
 * @version 1.0
 */
var patDiseaseHistoryList = avalon.define({
    $id: "patDiseaseHistoryList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    isShow: true,
    templateType: $.constant.medicalHistoryTemplateType,
    readonly: {readonly: false}, // 文本框设置只读
    disabled: {disabled: false},
    diseaseHistoryId: "",//病史ID
    patientId: GetQueryString("patientId"),//患者ID
    makerName: [],//获取到的当前角色
    recordUserId: '',//当前记录人
    add: '',//添加標記
    patDiseaseHistory: null,//病史信息
    serverTime: new Date(),//服务器时间
    userName: '',//登录者
    /**
     * 跳转至模板导入页面
     */
    importTemp: function (templateType) {
        var url = "";
        var title = "";
        title = "从模板导入";
        url = $.config.server + "/backstage/bacContentTemplateList?templateType=" + templateType;
        //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
        _layerOpen({
            openInParent: true,
            url: url,  //弹框自定义的url，会默认采取type=2
            width: 1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
            height: 700,  //弹框自定义的高度，方法会自动判断是否超过高度
            title: title, //弹框标题
            btn: ["导入", "取消"],
            // readonly: true,   //true - 查看详情  false - 编辑
            done: function (index, iframeWin, layer) {
                /**
                 * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
                 * 利用iframeWin可以执行弹框的方法，比如save方法
                 */
                var ids = iframeWin.save(
                    //成功保存之后的操作，刷新页面
                    function success(date) {
                        medicalHistoryFill(date)
                        successToast("导入成功");
                        var table = layui.table; //获取layui的table模块
                        table.reload('patDiseaseHistoryEdit_form'); //重新刷新table
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                    }
                );
            }
        });
    },
    /**
     * 获取模板内容
     */
    getTempCont: function (templateType) {//按钮点击方法
        var patientComplaint = $("#patientComplaint").val();
        var presentHistory = $("#presentHistory").val();
        var cardioVascularHistory = $("#cardioVascularHistory").val();
        var hypertensionHistory = $("#hypertensionHistory").val();
        var brainVascularHistory = $("#brainVascularHistory").val();
        var diabetesHistory = $("#diabetesHistory").val();
        var hepatitisHistory = $("#hepatitisHistory").val();
        var otherHistory = $("#otherHistory").val();
        var familyHistory = $("#familyHistory").val();
        var allergicHistory = $("#allergicHistory").val();
        var marriageHistory = $("#marriageHistory").val();
        var menstrualHistory = $("#menstrualHistory").val();
        if (templateType == patDiseaseHistoryList.templateType.PATIENTCOMPLAINT && patientComplaint != "") {
            return exportTemp(templateType, patientComplaint);//跳转页面
        } else if (templateType == patDiseaseHistoryList.templateType.PRESENTHISTORY && presentHistory != "") {
            return exportTemp(templateType, presentHistory);//跳转页面
        } else if (templateType == patDiseaseHistoryList.templateType.CARDIOVASCULARDISEASESHISTORY && cardioVascularHistory != "") {
            return exportTemp(templateType, cardioVascularHistory);//跳转页面
        } else if (templateType == patDiseaseHistoryList.templateType.HYPERTENSIONHISTORY && hypertensionHistory != "") {
            return exportTemp(templateType, hypertensionHistory);//跳转页面
        } else if (templateType == patDiseaseHistoryList.templateType.BRAINVASCULARHISTORY && brainVascularHistory != "") {
            return exportTemp(templateType, brainVascularHistory);//跳转页面
        } else if (templateType == patDiseaseHistoryList.templateType.DIABETESHISTORY && diabetesHistory != "") {
            return exportTemp(templateType, diabetesHistory);//跳转页面
        } else if (templateType == patDiseaseHistoryList.templateType.HEPATITISHISTORY && hepatitisHistory != "") {
            return exportTemp(templateType, hepatitisHistory);//跳转页面
        } else if (templateType == patDiseaseHistoryList.templateType.OTHERHISTORY && otherHistory != "") {
            return exportTemp(templateType, otherHistory);//跳转页面
        } else if (templateType == patDiseaseHistoryList.templateType.FAMILYHISTORY && familyHistory != "") {
            return exportTemp(templateType, familyHistory);//跳转页面
        } else if (templateType == patDiseaseHistoryList.templateType.ALLERGICHISTORY && allergicHistory != "") {
            return exportTemp(templateType, allergicHistory);//跳转页面
        } else if (templateType == patDiseaseHistoryList.templateType.MARRIAGEHISTORY && marriageHistory != "") {
            return exportTemp(templateType, marriageHistory);//跳转页面
        } else if (templateType == patDiseaseHistoryList.templateType.MENSTRUALHISTORY && menstrualHistory != "") {
            return exportTemp(templateType, menstrualHistory);//跳转页面
        } else {
            return warningToast("请填写模板内容");
        }
    }
});
layui.use(['index', 'laydate', 'formSelects'], function () {
    var laydate = layui.laydate;
    var formSelects = layui.formSelects;
    laydate.render({
        elem: '#recordDate1'
        , type: 'date'
        , trigger: 'click'
        , value: new Date()
    });
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        // getMakerInfo(patDiseaseHistoryList.roleId);
        //所有的入口事件写在这里...
        var patientcomplaint = patDiseaseHistoryList.templateType.PATIENTCOMPLAINT;

        initSearch(); //初始化搜索框
        getList(patDiseaseHistoryList.patientId);  //查询列表
        getMakerInfo();
        avalon.scan();
        // 更新外部iframe高度
        if (window.parent.onAppBodyResize) {
            window.parent.onAppBodyResize();
        }
    })
    var form = layui.form;
    form.verify({
        requireds: function (value, item) {
            var allergicDrugStatus = $('#allergicDrugStatus').val();
            if (allergicDrugStatus === 'Y' && isEmpty(value)) {
                return "请选择过敏药物";
            }
        }
    });
    layui.form.on('select(allergicDrugStatus)', function (obj) { // 过敏药物状态
        if(obj.value === 'Y'){
            layui.formSelects.undisabled("allergicDrugDetails");

        } else{
            layui.formSelects.disabled("allergicDrugDetails");
            formSelects.value('allergicDrugDetails', []);//要选中的值
        }
        form.render('select');
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#patDiseaseHistoryList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'patDiseaseHistoryList_search'  //指定的lay-filter
        , conds: [
            {field: 'recordDate', title: '记录日期:', type: 'date_range'}
        ]
        , done: function (filter, data) {
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        , search: function (data) {
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('patDiseaseHistoryList_table', {
                where: field
            });
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
        elem: '#patDiseaseHistoryList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patDiseaseHistoryList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            url: $.config.services.dialysis + "/patDiseaseHistory/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {
                    field: 'recordDate', title: '记录日期', align: 'center', width: 178
                    , templet: function (d) {
                        return util.toDateString(d.recordDate, "yyyy-MM-dd");
                    }
                }
                , {field: 'recordName', title: '记录人', align: 'center'}
            ]],
            done: function (obj) {
                //渲染下拉多选 过敏药物编辑
                var formSelects=layui.formSelects; //调用layui的form模块
                var arr = baseFuncInfo.getSysDictByCode('AllergicDrug');
                formSelects.data('allergicDrug', 'local', {
                    arr:arr
                });
                if (obj.bizData != null && obj.bizData.length > 0) {
                    //取出第一笔数据
                    var data = obj.bizData[0];
                    //透析处方初始表单赋值
                    // getInfo(data)
                    getDiseaseHistoryLineInfor(data.diseaseHistoryId)
                }
            }
        }
    });
    //监听行单击事件（双击事件为：rowDouble）
    table.on('row(patDiseaseHistoryList_table)', function (obj) {
        var data = obj.data;
        if (data != null) {
            patDiseaseHistoryList.diseaseHistoryId = data.diseaseHistoryId;
            getDiseaseHistoryLineInfor(data.diseaseHistoryId);
        }
        //标注选中样式
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
    });
}

//初始表单赋值
function getInfo(data) {
    patDiseaseHistoryList.readonly = {readonly: true};
    patDiseaseHistoryList.disabled = {disabled: 'disabled'};
    //表单初始赋值
    var form = layui.form; //调用layui的form模块
    //初始化表单元素,日期时间选择器
    var util = layui.util;
    patDiseaseHistoryList.diseaseHistoryId = data.diseaseHistoryId;
    data.recordDate = util.toDateString(data.recordDate, "yyyy-MM-dd");
    $("#recordUserId").val(patDiseaseHistoryList.recordUserId);
    // 过敏药物
    var allergicDrugDetails =data.allergicDrugDetails;
    var allergicDrugDetailsList = [];
    var formSelects=layui.formSelects; //调用layui的form模块
    if(isNotEmpty(allergicDrugDetails)){
        allergicDrugDetailsList = allergicDrugDetails.split(",");
    }
    formSelects.value('allergicDrug', allergicDrugDetailsList);//要选中的值
    form.val('patDiseaseHistory_form', data);
};

/**
 * 取消按钮切换模式
 */
function cancel() {
    patDiseaseHistoryList.isShow = true;
    getDiseaseHistoryLineInfor(patDiseaseHistoryList.diseaseHistoryId);
    var form = layui.form;
    form.render('select');
}

/**
 * 添加按钮切换为编辑模式
 */
function add(id, layEvent, readonly) {
    patDiseaseHistoryList.add = "add";
    patDiseaseHistoryList.isShow = false;
    // getMakerInfo(patDiseaseHistoryList.roleId);
    var formSelects=layui.formSelects; //调用layui的form模块
    var arr = baseFuncInfo.getSysDictByCode('AllergicDrug');
    formSelects.data('allergicDrugDetails', 'local', {
        arr:arr
    });
    var form = layui.form; //高版本建议把括号去掉，有的低版本，需要加()
    form.render();
    layui.laydate.render(
        {
            elem: '#recordDate'
            , type: 'date'
            , trigger: 'click'
            , value: new Date()
        });
}

/**
 * 修改切换
 */
function update_info() {
    var diseaseHistoryId = patDiseaseHistoryList.diseaseHistoryId
    if (diseaseHistoryId == '') {
        warningToast("请选中要修改的记录行");
    } else {
        getDiseaseHistoryLineInfor(diseaseHistoryId);
        patDiseaseHistoryList.add = "";
        patDiseaseHistoryList.isShow = false;
        layui.laydate.render(
            {
                elem: '#recordDate'
                , type: 'date'
                , trigger: 'click'
                , value: new Date()
            });
    }

}

/**
 * 保存或修改
 */
function saveOrEdit() {
    verify_form(function (data) {
        //成功验证后
        var param = data; //表单的元素
        var url;
        if (patDiseaseHistoryList.add == "add") {
            data.diseaseHistoryId = "";
            url = $.config.services.dialysis + "/patDiseaseHistory/save.do";
        }
        if (isNotEmpty(data.diseaseHistoryId)) {
            url = $.config.services.dialysis + "/patDiseaseHistory/edit.do";
        }
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                if (data == 1) {
                    patDiseaseHistoryList.isShow = true;
                    successToast("保存成功");
                    getDiseaseHistoryLineInfor(patDiseaseHistoryList.diseaseHistoryId);
                    var table = layui.table;
                    table.reload('patDiseaseHistoryList_table');
                } else {
                    patDiseaseHistoryList.isShow = true;
                    errorToast("保存失败！");
                    var table = layui.table; //获取layui的table模块
                    table.reload('patDiseaseHistoryList_table'); //重新刷新table
                }
            }
        });
    })
}

/**
 * 获取病史单条信息
 */
function getDiseaseHistoryLineInfor(diseaseHistoryId) {
    var url = "";
    if (isNotEmpty(diseaseHistoryId)) {
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patDiseaseHistory/getInfo.do",
            data: {diseaseHistoryId: diseaseHistoryId},
            dataType: "json",
            success: function(res) {
                patDiseaseHistoryList.serverTime = new Date(res.ts);
            },
            done: function (data) {
                patDiseaseHistoryList.readonly = {readonly: true};
                patDiseaseHistoryList.disabled = {disabled: 'disabled'};
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                var util = layui.util;
                data.birthday=util.toDateString(data.birthday,"yyyy-MM-dd");
                data.age = getUserAge(patDiseaseHistoryList.serverTime, data.birthday);
                // data.userName = patDiseaseHistoryList.userName;
                data.recordDate = util.toDateString(data.recordDate, "yyyy-MM-dd");
                //过敏药物赋值
                var allergicDrugDetails =data.allergicDrugDetails;
                var formSelects=layui.formSelects; //调用layui的form模块
                var arr = baseFuncInfo.getSysDictByCode('AllergicDrug');
                formSelects.data('allergicDrug', 'local', {
                    arr:arr
                });
                formSelects.data('allergicDrugDetails', 'local', {
                    arr:arr
                });
                if(isNotEmpty(allergicDrugDetails)){
                    var allergicDrugDetailsList = allergicDrugDetails.split(",");
                    formSelects.value('allergicDrug', allergicDrugDetailsList);//详情赋值
                    formSelects.value('allergicDrugDetails', allergicDrugDetailsList);//要选中的值
                }
                if(isNotEmpty(data.allergicDrugStatus) && data.allergicDrugStatus !== 'Y'){
                    layui.formSelects.disabled("allergicDrugDetails");
                }
                patDiseaseHistoryList.patDiseaseHistory = data;
                form.val('patDiseaseHistoryEdit_form', data)
                form.val('patDiseaseHistory_form', data);

            }
        });

    }
}

/**
 * 获取当前登录者
 */
function getMakerInfo() {
    _ajax({
        type: "POST",
        loading: true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getDoctorRoleList.do",
        dataType: "json",
        done: function (data) {
            var form = layui.form; //调用layui的form模块
            var doctorId = '';
            data.forEach(function (item, i) {
                if (item.id == baseFuncInfo.userInfoData.userid) {
                    doctorId = item.id;
                }
            })
            if (isEmpty(patDiseaseHistoryList.recordUserId)) {
                $('#recordUserId').val(doctorId);
                $('#recordUserId1').val(doctorId);
            }
            var form = layui.form;
            form.render('select');
            patDiseaseHistoryList.makerName = data;
        }
    });
}


/**
 * 跳转至模板导出页面
 */
function exportTemp(templateType, content) {

    var url = "";
    var title = "";
    var uuid = guid();
    title = "导出到模板";
    sessionStorage.setItem(uuid, content);
    url = $.config.server + "/backstage/bacContentTemplateEdit?templateType=" + templateType + "&uuid=" + uuid;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 500, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 400,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        btn: ["保存", "取消"],
        // readonly: true,   //true - 查看详情  false - 编辑
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success(date) {
                    medicalHistoryFill(date)
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('patDiseaseHistoryEdit_form'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 病史填充
 */
function medicalHistoryFill(date) {
    if (date.templateType === patDiseaseHistoryList.templateType.PATIENTCOMPLAINT) {
        $("#patientComplaint").val(date.templateContent)
    }
    if (date.templateType === patDiseaseHistoryList.templateType.PRESENTHISTORY) {
        $("#presentHistory").val(date.templateContent)
    }
    if (date.templateType === patDiseaseHistoryList.templateType.CARDIOVASCULARDISEASESHISTORY) {
        $("#cardioVascularHistory").val(date.templateContent)
    }
    if (date.templateType === patDiseaseHistoryList.templateType.HYPERTENSIONHISTORY) {
        $("#hypertensionHistory").val(date.templateContent)
    }
    if (date.templateType === patDiseaseHistoryList.templateType.BRAINVASCULARHISTORY) {
        $("#brainVascularHistory").val(date.templateContent)
    }
    if (date.templateType === patDiseaseHistoryList.templateType.DIABETESHISTORY) {
        $("#diabetesHistory").val(date.templateContent)
    }
    if (date.templateType === patDiseaseHistoryList.templateType.HEPATITISHISTORY) {
        $("#hepatitisHistory").val(date.templateContent)
    }
    if (date.templateType === patDiseaseHistoryList.templateType.OTHERHISTORY) {
        $("#otherHistory").val(date.templateContent)
    }
    if (date.templateType === patDiseaseHistoryList.templateType.FAMILYHISTORY) {
        $("#familyHistory").val(date.templateContent)
    }
    if (date.templateType === patDiseaseHistoryList.templateType.ALLERGICHISTORY) {
        $("#allergicHistory").val(date.templateContent)
    }
    if (date.templateType === patDiseaseHistoryList.templateType.MARRIAGEHISTORY) {
        $("#marriageHistory").val(date.templateContent)
    }
    if (date.templateType === patDiseaseHistoryList.templateType.MENSTRUALHISTORY) {
        $("#menstrualHistory").val(date.templateContent)
    }
}

/**
 * 点击打印事件
 */
function onPrint() {
    var uuid = guid();
    sessionStorage.setItem(uuid, JSON.stringify(patDiseaseHistoryList.patDiseaseHistory));
    _layerOpen({
        openInParent: true,
        url: $.config.server + "/patient/patDiseaseHistoryPrint?uuid=" + uuid,
        width: 960, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 840,  // 弹框自定义的高度，方法会自动判断是否超过高度
        title: "打印患者病史信息", // 弹框标题
        btn: ["打印", "取消"],
        done: function (index, iframeWin,layer) {
            var ids = iframeWin.onPrint();
        }
    });
}

/**
 * 删除事件
 * @param ids
 */
function del(ids) {
    var ids = [];
    var id = patDiseaseHistoryList.diseaseHistoryId;
    if (id === "") {
        warningToast("请点击要删除的数据行");
        return false;
    } else {
        ids.push(id)
        var param = {
            "ids": ids
        };
        layer.confirm('确定删除所选记录吗？', function (index) {
            _ajax({
                type: "POST",
                url: $.config.services.dialysis + "/patDiseaseHistory/delete.do",
                data: param,  //必须字符串后台才能接收list,
                //loading:false,  //是否ajax启用等待旋转框，默认是true
                dataType: "json",
                done: function (data) {
                    successToast("删除成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('patDiseaseHistoryList_table'); //重新刷新table
                }
            });
        })
    }
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(patDiseaseHistoryEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        field.patientId = patDiseaseHistoryList.patientId;
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#patDiseaseHistoryEdit_submit").trigger('click');
}

