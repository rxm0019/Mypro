/**
 * bacSecurityList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 *
 * @author Rain
 * @date 2020/09/01
 * @description 职业安全防护
 * @version 1.0
 */
var bacSecurityList = avalon.define({
    $id: "bacSecurityList",
    baseFuncInfo: baseFuncInfo//底层基本方法
    , employeeJob: [ //职业下拉选
        {name: "医师", value: "1"},
        {name: "护理人员", value: "2"},
        {name: "保洁人员", value: "3"},
        {name: "后勤人员", value: "4"},
        {name: "其他", value: "5"}
    ]
    , finalResult: [ //结论
        {name: "", value: ""},
        {name: "感染病毒", value: "1"},
        {name: "未感染病毒", value: "2"}
    ]
    , peopleRecordsList: []//人员下拉选
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList();  //查询列表
        getPeopleRecords();
        avalon.scan();
    });
});

/**
 * 获取人员管理下拉选
 */
function getPeopleRecords() {
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.logistics + "/bacSecurity/getPeopleRecords.do",
        data: {employeeName: ""},
        dataType: "json",
        done: function (data) {
            console.log("data", data)
            if (isNotEmpty(data)) {
                bacSecurityList.peopleRecordsList = data;
            }
        }
    });
}

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#bacSecurityList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'bacSecurityList_search'  //指定的lay-filter
        , conds: [
            {field: 'occurDate', title: '发生日期：', type: 'date_range'}
            , {field: 'employeeName', title: '姓名：', type: 'input'}
            , {
                field: 'finalResult', type: 'select', title: '结论：', data: bacSecurityList.finalResult
            } //加载数据字典
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
            table.reload('bacSecurityList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getList() {
    var param = {};
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#bacSecurityList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'bacSecurityList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/bacSecurity/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox',rowspan:2}  //开启编辑框
                ,{type: 'numbers', title: '序号', width: 60,rowspan:2,colspan:1}  //序号
                , {title: '基本情况', align: 'center', colspan: 6}
                , {title: '感染性疾病检查追踪结果', align: 'center', colspan: 9}

            ],[
                {
                    field: 'occurDate', title: '发生日期', align: 'center', width: 140
                    , templet: function (d) {
                        return util.toDateString(d.occurDate, "yyyy-MM-dd");
                    }
                }

                , {
                    field: 'employeeName', title: '姓名', align: 'center', width: 100
                    , templet: function (d) {
                        return getEmpLoyeeName(d.employeeName)
                    }
                }
                , {
                    field: 'employeeSex', title: '性别', align: 'center', width: 100
                    , templet: function (d) {
                        return getSysDictName("Sex", d.employeeSex);
                    }
                }
                , {field: 'employeeAge', title: '年龄',align: 'center', width: 100}
                ,{field:'workingYears',title:"工龄",align:"center",width:100}
                , {
                    field: 'employeeJob', title: '职业', align: 'center', width: 110
                    , templet: function (d) {
                        if (isNotEmpty(d.employeeJob)) {
                            return findJob(d.employeeJob);
                        }else{
                            return ""
                        }
                    }
                }
                ,{field: 'resultNow', title: '暴露后立即',align: 'center', width: 100}
                , {field: 'resultOne', title: '1个月后', align: 'center',width: 100}
                , {field: 'resultThree', title: '3个月后', align: 'center',width: 100}
                , {field: 'resultSix', title: '6个月后',align: 'center', width: 100}
                , {field: 'resultTwelve', title: '12个月后',align: 'center', width: 100}
                , {
                    field: 'finalResult', title: '结论',align: 'center', width: 100
                    , templet: function (d) {
                        return findFinalResult(d.finalResult);
                    }
                }
                , {field: 'writeUser', title: '填表人',align: 'center', width: 100}
                , {field: 'centerUser', title: '中心负责人',align: 'center', width: 100}
                , {
                    field: 'reportDate', title: '报告日期',align: 'center', align: 'center', width: 140
                    , templet: function (d) {
                        return util.toDateString(d.reportDate, "yyyy-MM-dd");
                    }
                }
                ,{
                    fixed: 'right', title: '操作', width:200, align: 'center',rowspan:2
                    , toolbar: '#bacSecurityList_bar'
                }
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'edit' || layEvent === 'detail') { //编辑
                //do something
                if (isNotEmpty(data.securityId)) {
                    saveOrEdit(data.securityId, layEvent, (layEvent === 'edit' ? false : true));
                }
            } else if (layEvent === 'del') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.securityId)) {
                        var ids = [];
                        ids.push(data.securityId);
                        del(ids);
                    }
                });
            }
        }
    });
}

/**
 * 获取人员名称
 */
function getEmpLoyeeName(id) {
    var data = "";
    if (isNotEmpty(id)) {
        for (var i in bacSecurityList.peopleRecordsList) {
            if (bacSecurityList.peopleRecordsList[i].peopleRecordsId == id) {
                data = bacSecurityList.peopleRecordsList[i].name
                break;
            }
        }
    }
    return data;
}

/**
 * 返回职业名称
 */

function findJob(value) {
    for (var key in bacSecurityList.employeeJob) {
        if (bacSecurityList.employeeJob[key].value === value) {
            return bacSecurityList.employeeJob[key].name
        }
    }
}

/**
 * 返回结论
 */
function findFinalResult(value) {
    for (var key in bacSecurityList.finalResult) {
        if (bacSecurityList.finalResult[key].value === value) {
            return bacSecurityList.finalResult[key].name
        }
    }
}
/**
 * 获取单个实体
 */
function saveOrEdit(id, layEvent, readonly) {
    var url = "";
    var title = "";
    var btn = ["打印", "取消"];
    if (isEmpty(id)) {  //id为空,新增操作
        title = "新增";
        url = $.config.server + "/departmentdaily/bacSecurityEdit";
        btn = ["确定", "取消"];
    } else {  //编辑
        if (layEvent === "edit") {
            title = "编辑";
            btn = ["确定", "取消"];
        } else if (layEvent === "detail") {
            title = "详情";
        }
        url = $.config.server + "/departmentdaily/bacSecurityEdit?id=" + id+"&layEvent="+layEvent;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 800,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        btn: btn,
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            if (layEvent === "detail") {
                var ids = iframeWin.onPrint();
            } else {
                var ids = iframeWin.save(
                    //成功保存之后的操作，刷新页面
                    function success() {
                        successToast("保存成功", 500);
                        var table = layui.table; //获取layui的table模块
                        table.reload('bacSecurityList_table'); //重新刷新table
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                    }
                );
            }

        }
    });
}

/**
 * 删除事件
 * @param ids
 */
function del(ids) {
    var param = {
        "ids": ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.logistics + "/bacSecurity/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功", 500);
            var table = layui.table; //获取layui的table模块
            table.reload('bacSecurityList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('bacSecurityList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确定删除所选记录吗？', function (index) {
            layer.close(index);
            var ids = [];
            $.each(data, function (i, item) {
                ids.push(item.securityId);
            });
            del(ids);
        });
    }
}

/**
 * 导出excel
 */
function onExportExcel() {
    _downloadFile({
        url: $.config.services.logistics + "/bacSecurity/export.do",
        data: layui.form.val("bacSecurityList_search"),
        fileName: '职业安全防护.xlsx'
    });
}
