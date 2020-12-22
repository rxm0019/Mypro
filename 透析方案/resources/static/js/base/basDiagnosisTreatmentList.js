/**
 * 诊疗项目
 * @author: Rain
 * @version: 1.0
 * @date: 2020/08/14
 */
var basDiagnosisTreatmentList = avalon.define({
    $id: "basDiagnosisTreatmentList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
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
        elem: '#basDiagnosisTreatmentList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'basDiagnosisTreatmentList_search'  //指定的lay-filter
        , conds: [
            {field: 'itemNo', title: '诊疗项目编码：', type: 'input'}
            , {field: 'itemName', title: '诊疗项目名称：', type: 'input'}
            , {field: 'dataStatus', title: '状态：', type: 'select', data: getSysDictByCode("sys_status", true)}
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
            table.reload('basDiagnosisTreatmentList_table', {
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
        elem: '#basDiagnosisTreatmentList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'basDiagnosisTreatmentList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-125', //table的高度，页面最大高度减去差值
            url: $.config.services.platform + "/basDiagnosisTreatment/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}  //开启修改框
                , {type: 'numbers', title: '序号', width: 60}  //序号
                , {
                    field: 'itemNo',
                    title: '诊疗项目编码',
                    align: 'center',
                    sortField: 'bdt_.item_no',
                    width: 200
                }
                , {field: 'itemName', title: '诊疗项目名称', align: 'center'}
                , {field: 'specifications', title: '诊疗项目规格',align: 'center'}
                , {field: 'basicUnit', title: '基本单位',align: 'center',
                 templet: function (d) {
                    return getSysDictName("baseUnit",d.basicUnit);
                 }
                }
                , {
                    field: 'dataStatus', title: '状态', align: 'center', width: 120
                    , templet: function (d) {
                        if (d.dataStatus !== null) {
                            if (d.dataStatus == '0') {
                                return "启用";
                            } else {
                                return "停用";
                            }
                        } else {
                            return "";
                        }

                    }
                }
                , {
                    fixed: 'right', title: '操作', width: 200, align: 'center'
                    , toolbar: '#basDiagnosisTreatmentList_bar'
                }
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'edit' || layEvent === 'detail') { // 修改 or 详情
                //do something
                if (isNotEmpty(data.diagnosisTreatmentId)) {
                    saveOrEdit(data.diagnosisTreatmentId, layEvent, (layEvent === 'edit' ? false : true));
                }
            } else if (layEvent === 'del') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.diagnosisTreatmentId)) {
                        var ids = [];
                        ids.push(data.diagnosisTreatmentId);
                        del(ids);
                    }
                });
            }
        }
    });
}


/**
 * 获取单个实体
 */
function saveOrEdit(id, layEvent, readonly) {
    var url = "";
    var title = "";
    if (isEmpty(id)) {  //id为空,新增操作
        title = "新增";
        url = $.config.server + "/base/basDiagnosisTreatmentEdit";
        //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
        _layerOpen({
            url: url,  //弹框自定义的url，会默认采取type=2
            width: 900, //弹框自定义的宽度，方法会自动判断是否超过宽度
            height: 620,  //弹框自定义的高度，方法会自动判断是否超过高度
            title: title, //弹框标题
            readonly: readonly, // true：查看 | false：编辑
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
                        table.reload('basDiagnosisTreatmentList_table'); //重新刷新table
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                    }
                );
            }
        });
    } else {  //修改
        if (layEvent === "edit") {
            title = "编辑";
        } else if (layEvent === "detail") {
            title = "详情";
        }
        url = $.config.server + "/base/basDiagnosisTreatmentEdit?id=" + id + "&layEvent=" + layEvent;
        //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
        _layerOpen({
            url: url,  //弹框自定义的url，会默认采取type=2
            width: 900, //弹框自定义的宽度，方法会自动判断是否超过宽度
            height: 620,  //弹框自定义的高度，方法会自动判断是否超过高度
            title: title, //弹框标题
            readonly: readonly, // true：查看 | false：编辑
            done: function (index, iframeWin) {
                /**
                 * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
                 * 利用iframeWin可以执行弹框的方法，比如save方法
                 */
                var ids = iframeWin.edit(
                    //成功保存之后的操作，刷新页面
                    function success() {
                        successToast("保存成功");
                        var table = layui.table; //获取layui的table模块
                        table.reload('basDiagnosisTreatmentList_table'); //重新刷新table
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                    }
                );
            }
        });
    }

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
        url: $.config.services.platform + "/basDiagnosisTreatment/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('basDiagnosisTreatmentList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('basDiagnosisTreatmentList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确定删除所选记录吗？', function (index) {
            layer.close(index);
            var ids = [];
            $.each(data, function (i, item) {
                ids.push(item.diagnosisTreatmentId);
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
        url: $.config.services.platform + "/basDiagnosisTreatment/export.do",
        data: getSearchParam(),
        fileName: '诊疗项目.xlsx'
    });
}

/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var searchParam = layui.form.val("basDiagnosisTreatmentList_search");
    return $.extend({
        itemNo: '',
        itemName: '',
        specifications: '',
        basicUnit: ''
    }, searchParam)
}

/**
 * 导入成功之后刷新页面
 */
function refresh() {
    layui.table.reload('basDiagnosisTreatmentList_table');
}