/**
 * patPageFrontList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 */
var patPageFrontList = avalon.define({
    $id: "patPageFrontList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId: ""
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id = GetQueryString("patientId");  //接收变量
        patPageFrontList.patientId = id
        initSearch(); //初始化搜索框
        getList();  //查询列表
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#patPageFrontList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'patPageFrontList_search'  //指定的lay-filter
        , conds: [
            {field: 'patientId', title: '患者ID', type: 'input'}
            , {field: 'adjustType', title: '调整种类', type: 'input'}
            , {field: 'adjustValue', title: '调整值', type: 'input'}
            , {field: 'adjustDate', title: '调整日期', type: 'date'}
            , {field: 'createBy', title: '创建人员', type: 'input'}
            , {field: 'createTime', title: '创建时间', type: 'date'}
            , {field: 'updateBy', title: '修改人员', type: 'input'}
            , {field: 'updateTime', title: '修改时间', type: 'date'}
            , {field: 'dataStatus', title: '数据状态', type: 'input'}
            , {field: 'dataSync', title: '数据同步状态', type: 'input'}
            , {field: 'hospitalNo', title: '医院代码', type: 'input'}
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
            table.reload('patPageFrontList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getList() {
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#patPageFrontList_dryWeight', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patPageFrontList_dryWeight', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'auto', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patPageFront/list.do", // ajax的url必须加上getRootPath()方法
            where: {'patientId': patPageFrontList.patientId, 'adjustType': 'DryWeight'}, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {field: 'adjustValue', title: '体重(kg)'}
                , {
                    field: 'adjustDate', title: '调整日期', ortField: 'adjustType',
                    templet: function (d) {
                        return util.toDateString(d.adjustDate, "yyyy-MM-dd");
                    }
                }
                , {fixed: 'right', title: '操作', align: 'center', toolbar: '#patPageFrontBar', width: 300}
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'update') { //编辑
                //do something
                if (isNotEmpty(data.pageFrontId)) {
                    saveOrEdit(data.pageFrontId, 'DryWeight');
                }
            } else if (layEvent === 'delete') { //删除
                layer.confirm('确认删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.pageFrontId)) {
                        var ids = [];
                        ids.push(data.pageFrontId);
                        del(ids, 'DryWeight');
                    }
                });
            }
        }
    });
    _layuiTable({
        elem: '#patPageFrontList_vascularRoad', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patPageFrontList_vascularRoad', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'auto', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patPageFront/list.do", // ajax的url必须加上getRootPath()方法
            page: false,
            where: {'patientId': patPageFrontList.patientId, 'adjustType': 'VascularRoad'}, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'adjustValue', title: '名称'}
                , {
                    field: 'adjustDate', title: '调整日期',
                    templet: function (d) {
                        return util.toDateString(d.adjustDate, "yyyy-MM-dd");
                    }
                }
                , {fixed: 'right', title: '操作', align: 'center', toolbar: '#patPageFrontBar', width: 300}
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'update') { //编辑
                //do something
                if (isNotEmpty(data.pageFrontId)) {
                    saveOrEdit(data.pageFrontId, 'VascularRoad');
                }
            } else if (layEvent === 'delete') { //删除
                layer.confirm('确认删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.pageFrontId)) {
                        var ids = [];
                        ids.push(data.pageFrontId);
                        del(ids, 'VascularRoad');
                    }
                });
            }
        }
    });
    _layuiTable({
        elem: '#patPageFrontList_anticoagulant', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patPageFrontList_anticoagulant', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'auto', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patPageFront/list.do", // ajax的url必须加上getRootPath()方法
            page: false,
            where: {'patientId': patPageFrontList.patientId, 'adjustType': 'Anticoagulant'},//接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'adjustValue', title: '种类'}
                , {
                    field: 'adjustDate', title: '调整日期',
                    templet: function (d) {
                        return util.toDateString(d.adjustDate, "yyyy-MM-dd");
                    }
                }
                , {fixed: 'right', title: '操作', align: 'center', toolbar: '#patPageFrontBar', width: 300}
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'update') { //编辑
                //do something
                if (isNotEmpty(data.pageFrontId)) {
                    saveOrEdit(data.pageFrontId, 'Anticoagulant');
                }
            } else if (layEvent === 'delete') { //删除
                layer.confirm('确认删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.pageFrontId)) {
                        var ids = [];
                        ids.push(data.pageFrontId);
                        del(ids, 'Anticoagulant');
                    }
                });
            }
        }
    });
    _layuiTable({
        elem: '#patPageFrontList_infectious', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patPageFrontList_infectious', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'auto', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patPageFront/list.do", // ajax的url必须加上getRootPath()方法
            page: false,
            where: {'patientId': patPageFrontList.patientId, 'adjustType': 'Infectious'},//接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'adjustValue', title: '名称'}
                , {
                    field: 'adjustDate', title: '调整日期',
                    templet: function (d) {
                        return util.toDateString(d.adjustDate, "yyyy-MM-dd");
                    }
                }
                , {fixed: 'right', title: '操作', align: 'center', toolbar: '#patPageFrontBar', width: 300}
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'update') { //编辑
                //do something
                if (isNotEmpty(data.pageFrontId)) {
                    saveOrEdit(data.pageFrontId, 'Infectious');
                }
            } else if (layEvent === 'delete') { //删除
                layer.confirm('确认删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.pageFrontId)) {
                        var ids = [];
                        ids.push(data.pageFrontId);
                        del(ids, 'Infectious');
                    }
                });
            }
        }
    });
    _layuiTable({
        elem: '#patPageFrontList_tumour', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patPageFrontList_tumour', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'auto', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patPageFront/list.do", // ajax的url必须加上getRootPath()方法
            page: false,
            where: {'patientId': patPageFrontList.patientId, 'adjustType': 'Tumour'}, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'adjustValue', title: '名称'}
                , {
                    field: 'adjustDate', title: '调整日期',
                    templet: function (d) {
                        return util.toDateString(d.adjustDate, "yyyy-MM-dd");
                    }
                }
                , {fixed: 'right', title: '操作', align: 'center', toolbar: '#patPageFrontBar', width: 300}
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'update') { //编辑
                //do something
                if (isNotEmpty(data.pageFrontId)) {
                    saveOrEdit(data.pageFrontId, 'Tumour');
                }
            } else if (layEvent === 'delete') { //删除
                layer.confirm('确认删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.pageFrontId)) {
                        var ids = [];
                        ids.push(data.pageFrontId);
                        del(ids, 'Tumour');
                    }
                });
            }
        }
    });
    _layuiTable({
        elem: '#patPageFrontList_allergy', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patPageFrontList_allergy', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'auto', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patPageFront/list.do", // ajax的url必须加上getRootPath()方法
            page: false,
            where: {'patientId': patPageFrontList.patientId, 'adjustType': 'Allergy'}, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'adjustValue', title: '药物名称'}
                , {
                    field: 'adjustDate', title: '调整日期',
                    templet: function (d) {
                        return util.toDateString(d.adjustDate, "yyyy-MM-dd");
                    }
                }
                , {fixed: 'right', title: '操作', align: 'center', toolbar: '#patPageFrontBar', width: 300}
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'update') { //编辑
                //do something
                if (isNotEmpty(data.pageFrontId)) {
                    saveOrEdit(data.pageFrontId, 'Allergy');
                }
            } else if (layEvent === 'delete') { //删除
                layer.confirm('确认删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.pageFrontId)) {
                        var ids = [];
                        ids.push(data.pageFrontId);
                        del(ids, 'Allergy');
                    }
                });
            }
        }
    });
    _layuiTable({
        elem: '#patPageFrontList_dialysisFrequency', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patPageFrontList_dialysisFrequency', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'auto', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patPageFront/list.do", // ajax的url必须加上getRootPath()方法
            page: false,
            where: {'patientId': patPageFrontList.patientId, 'adjustType': 'DialysisFrequency'}, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'adjustValue', title: '治疗频率'}
                , {
                    field: 'adjustDate', title: '调整日期',
                    templet: function (d) {
                        return util.toDateString(d.adjustDate, "yyyy-MM-dd");
                    }
                }
                , {fixed: 'right', title: '操作', align: 'center', toolbar: '#patPageFrontBar', width: 300}
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'update') { //编辑
                //do something
                if (isNotEmpty(data.pageFrontId)) {
                    saveOrEdit(data.pageFrontId, 'DialysisFrequency');
                }
            } else if (layEvent === 'delete') { //删除
                layer.confirm('确认删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.pageFrontId)) {
                        var ids = [];
                        ids.push(data.pageFrontId);
                        del(ids, 'DialysisFrequency');
                    }
                });
            }
        }
    });
    _layuiTable({
        elem: '#patPageFrontList_dialysisMode', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patPageFrontList_dialysisMode', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'auto', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patPageFront/list.do", // ajax的url必须加上getRootPath()方法
            page: false,
            where: {'patientId': patPageFrontList.patientId, 'adjustType': 'DialysisMode'}, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'adjustValue', title: '治疗方式'}
                , {
                    field: 'adjustDate', title: '调整日期',
                    templet: function (d) {
                        return util.toDateString(d.adjustDate, "yyyy-MM-dd");
                    }
                }
                , {fixed: 'right', title: '操作', align: 'center', toolbar: '#patPageFrontBar', width: 300}
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'update') { //编辑
                //do something
                if (isNotEmpty(data.pageFrontId)) {
                    saveOrEdit(data.pageFrontId, 'DialysisMode');
                }
            } else if (layEvent === 'delete') { //删除
                layer.confirm('确认删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.pageFrontId)) {
                        var ids = [];
                        ids.push(data.pageFrontId);
                        del(ids, 'DialysisMode');
                    }
                });
            }
        }
    });
    _layuiTable({
        elem: '#patPageFrontList_concentrationCa', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patPageFrontList_concentrationCa', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'auto', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patPageFront/list.do", // ajax的url必须加上getRootPath()方法
            page: false,
            where: {'patientId': patPageFrontList.patientId, 'adjustType': 'ConcentrationCa'}, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'adjustValue', title: '透析液钙浓度'}
                , {
                    field: 'adjustDate', title: '调整日期',
                    templet: function (d) {
                        return util.toDateString(d.adjustDate, "yyyy-MM-dd");
                    }
                }
                , {fixed: 'right', title: '操作', align: 'center', toolbar: '#patPageFrontBar', width: 300}
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'update') { //编辑
                //do something
                if (isNotEmpty(data.pageFrontId)) {
                    saveOrEdit(data.pageFrontId, 'ConcentrationCa');
                }
            } else if (layEvent === 'delete') { //删除
                layer.confirm('确认删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.pageFrontId)) {
                        var ids = [];
                        ids.push(data.pageFrontId);
                        del(ids, 'ConcentrationCa');
                    }
                });
            }
        }
    });
}

/*
*
 * 获取单个实体
 */
function saveOrEdit(id, adjustTypeTemp) {
    var adjustType = "";
    var tableName = "";
    switch (adjustTypeTemp) {
        case 'DryWeight':
            adjustType = "DryWeight";
            tableName = "patPageFrontList_dryWeight";
            break;
        case 'VascularRoad':
            adjustType = "VascularRoad"
            tableName = "patPageFrontList_vascularRoad";
            break;
        case 'Anticoagulant':
            adjustType = "Anticoagulant"
            tableName = "patPageFrontList_anticoagulant";
            break;
        case 'Infectious':
            adjustType = "Infectious"
            tableName = "patPageFrontList_infectious";
            break;
        case 'Tumour':
            adjustType = "Tumour"
            tableName = "patPageFrontList_tumour";
            break;
        case 'Allergy':
            adjustType = "Allergy"
            tableName = "patPageFrontList_allergy";
            break;
        case 'DialysisFrequency':
            adjustType = "DialysisFrequency"
            tableName = "patPageFrontList_dialysisFrequency";
            break;
        case 'DialysisMode':
            adjustType = "DialysisMode"
            tableName = "patPageFrontList_dialysisMode";
            break;
        case 'ConcentrationCa':
            adjustType = "ConcentrationCa"
            tableName = "patPageFrontList_concentrationCa";
            break;
    }
    var url = "";
    var title = "";
    if (isEmpty(id)) {  //id为空,新增操作
        if(adjustType==='DryWeight')
        {
            //    干体重
            title = "新增";
            url = $.config.server + "/patient/patPageFrontEditDryWeight?adjustType=" + adjustType + "&patientId=" + patPageFrontList.patientId;
        }
        else {
            title = "新增";
            url = $.config.server + "/patient/patPageFrontEdit?adjustType=" + adjustType + "&patientId=" + patPageFrontList.patientId;
        }

    } else {  //编辑
        if(adjustType==='DryWeight')
        {
        //    干体重
            title = "编辑";
            url = $.config.server + "/patient/patPageFrontEditDryWeight?id=" + id;
        }
        else {
            title = "编辑";
            url = $.config.server + "/patient/patPageFrontEdit?id=" + id;
        }

    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 500,  //弹框自定义的高度，方法会自动判断是否超过高度
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
                    var table = layui.table; //获取layui的table模块
                    table.reload(tableName); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 删除事件
 * @param ids
 */
function del(ids, adjustTypeTemp) {
    var adjustType = "";
    var tableName = "";
    switch (adjustTypeTemp) {
        case 'DryWeight':
            tableName = "patPageFrontList_dryWeight";
            break;
        case 'VascularRoad':
            tableName = "patPageFrontList_vascularRoad";
            break;
        case 'Anticoagulant':
            tableName = "patPageFrontList_anticoagulant";
            break;
        case 'Infectious':
            tableName = "patPageFrontList_infectious";
            break;
        case 'Tumour':
            tableName = "patPageFrontList_tumour";
            break;
        case 'Allergy':
            tableName = "patPageFrontList_allergy";
            break;
        case 'DialysisFrequency':
            tableName = "patPageFrontList_dialysisFrequency";
            break;
        case 'DialysisMode':
            tableName = "patPageFrontList_dialysisMode";
            break;
        case 'ConcentrationCa':
            tableName = "patPageFrontList_concentrationCa";
            break;
    }
    var param = {
        "ids": ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patPageFront/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload(tableName); //重新刷新table
        }
    });
}


