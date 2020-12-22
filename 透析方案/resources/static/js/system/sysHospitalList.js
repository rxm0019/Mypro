/**
 * 中心管理列表
 * @author: Care
 * @version: 1.0
 * @date: 2020/08/12
 */
var sysHospitalList = avalon.define({
    $id: "sysHospitalList",
    baseFuncInfo: baseFuncInfo//底层基本方法
});
layui.use(['index'], function() {
    avalon.ready(function () {
        // 初始化搜索框
        initSearch();
        // 查询列表
        getHospitalList();

        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#sysHospitalList_search', //指定搜索框表单的元素选择器（推荐id选择器）
        filter: 'sysHospitalList_search',  //指定的lay-filter
        conds: [
            { field: 'hospitalNo', title: '中心代码：', type: 'input' },
            { field: 'hospitalName', title: '中心名称：', type: 'input' }
        ],
        search: function (data) {
            var field = data.field;
            layui.table.reload('sysHospitalList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getHospitalList() {
    var param = {};
    _layuiTable({
        elem: '#sysHospitalList_table',
        filter: 'sysHospitalList_table',
        // 执行渲染table配置
        render: {
            height: 'full-180',
            url: $.config.services.system + "/sysHospital/list.do",
            where: param,
            cols: [[ //表头
                { fixed: 'left', type: 'checkbox' },  // 开启编辑框
                { type: 'numbers', title: '序号', width: 60 },  // 序号
                { field: 'hospitalNo', title: '中心代码', align: 'center', minWidth: 100 },
                { field: 'hospitalName', title: '中心名称', align: 'center', minWidth: 100 },
                { field: 'superioName', title: '上级', align: 'center', minWidth: 100 },
                { field: 'tel', title: '电话', align: 'center', minWidth: 100 },
                {
                    field: 'dataStatus', title: '状态', align: 'center', width: 80,
                    templet: function (row) {
                        return getSysDictName($.dictType.sysStatus, row.dataStatus);
                    }
                },
                { fixed: 'right', title: '操作', align: 'center', toolbar: '#sysHospitalList_bar', width: 285 }
            ]],
            done: function (res, curr, count) {
                // 当前登录中心不能（在批量删除中）被删除
                var loginHospitalNo = baseFuncInfo.userInfoData.loginHospitalNo;
                $.each(res.bizData, function (index, rowData) {
                    if (loginHospitalNo == rowData.hospitalNo) {
                        $("div[lay-id='sysHospitalList_table'] .layui-table-body tr[data-index=" + index + "]")
                            .find("input[name='layTableCheckbox']").attr("disabled", 'disabled').removeAttr("checked");
                    }
                });
                layui.form.render('checkbox');

                // 表格禁用的复选框，在全选时移除选中样式
                layui.table.on('checkbox(sysHospitalList_table)', function(obj) {
                    $("div[lay-id='sysHospitalList_table'] .layui-checkbox-disbaled").removeClass("layui-form-checked");
                });
            }
        },
        // 监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; // 获得当前行数据
            var layEvent = obj.event; // 获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; // 获得当前行 tr 的DOM对象
            if (isNotEmpty(data.hospitalId)) {
                if (layEvent === 'detail') { //详情
                    onHospitalDetail(data.hospitalId);
                }else if (layEvent === 'print') { //处方笺打印
                    onHospitalPrint(data.hospitalId);
                } else if (layEvent === 'edit') { //编辑
                    onHospitalEdit(data.hospitalId);
                } else if (layEvent === 'delete') { //删除
                    layer.confirm('确定删除所选数据吗？', function (index) {
                        layer.close(index);
                        var hospitalId = [data.hospitalId];
                        onHospitalDelete(hospitalId);
                    });
                }
            }
        }
    });
}

/**
 * 中心：打开弹窗，可查看中心详情
 * @param keyId
 */
function onHospitalDetail(hospitalId) {
    var title = "详情";
    var url = $.config.server + "/system/sysHospitalEdit?hospitalId=" + hospitalId + "&readonly=Y";
    openHospitalEditWin(title, url, true);
}

/**
 * 中心：打开弹窗，可打印处方笺
 * @param hospitalId
 */
function onHospitalPrint(hospitalId){
    var title = "处方笺打印模板";
    var url = $.config.server + "/system/sysHospitalPrint?hospitalId=" + hospitalId;
    openHospitalEditWin(title, url, false);
}

/**
 * 中心：打开弹窗，可添加中心
 * @returns {boolean}
 */
function onHospitalAdd() {
    var title = "新增";
    var url = $.config.server + "/system/sysHospitalEdit";
    openHospitalEditWin(title, url, false);
}

/**
 * 中心：打开弹窗，可编辑中心
 * @param roleId
 */
function onHospitalEdit(hospitalId) {
    var title = "编辑";
    var url = $.config.server + "/system/sysHospitalEdit?hospitalId=" + hospitalId;
    openHospitalEditWin(title, url, false);
}

/**
 * 中心：批量删除
 */
function onHospitalBatchDelete() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('sysHospitalList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条数据");
        return false;
    } else {
        layer.confirm('确定删除所选数据吗？', function (index) {
            layer.close(index);
            var hospitalIds = [];
            $.each(data, function (i, item) {
                hospitalIds.push(item.hospitalId);
            });
            onHospitalDelete(hospitalIds);
        });
    }
}

/**
 * 中心：删除
 * @param hospitalIds
 */
function onHospitalDelete(hospitalIds) {
    var param = {
        "hospitalIds": hospitalIds
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysHospital/delete.do",
        data: param,
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            layui.table.reload('sysHospitalList_table'); //重新刷新table
        }
    });
}

/**
 * 打开中心编辑弹窗
 * @param title
 * @param url
 * @param readonly
 */
function openHospitalEditWin(title, url, readonly) {
    _layerOpen({
        url: url,  // 弹框自定义的url，会默认采取type=2
        width: 900, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 500,  // 弹框自定义的高度，方法会自动判断是否超过高度
        readonly: readonly,  // 弹框自定义参数，用于是否只能查看,默认是false，true代表只能查看,done事件不执行
        title: title, // 弹框标题
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.onHospitalSave(
                // 成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    layui.table.reload('sysHospitalList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}
