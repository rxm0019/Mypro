/**
 * 采购申请的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * @author: Sinjar
 * @version: 1.0
 * @date: 2020/08/24
 */
var purRequisitionList = avalon.define({
    $id: "purRequisitionList",
    baseFuncInfo: baseFuncInfo//底层基本方法
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
        elem: '#purRequisitionList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'purRequisitionList_search'  //指定的lay-filter
        , conds: [
            {field: 'requisitionNo', title: '申请单号：', type: 'input'}
            , {field: 'createBy', title: '申请人：', type: 'input'}
            , {field: 'createTime', title: '申请日期：', type: 'date'}
            , {
                field: 'requisitionStatus',
                title: '状态：',
                type: 'select',
                data: getSysDictByCode("purchaseApplyStatus", true)
            }
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
            table.reload('purRequisitionList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getList() {
    var param = {
        flag: 'apply' // 采购申请列表筛选数据标识
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    var form = layui.form;
    _layuiTable({
        elem: '#purRequisitionList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'purRequisitionList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-145', //table的高度，页面最大高度减去差值
            url: $.config.services.pharmacy + "/purRequisition/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {
                    templet: "#checkAll",
                    title: "<input type='checkbox' name='checkAll' lay-skin='primary' lay-filter='checkAll'> ",
                    width: 48,
                    fixed: 'left'
                }
                ,{type: 'numbers', title: '序号', width: 60}  //序号
                , {field: 'requisitionNo', title: '申请单号', align: 'center'}
                , {field: 'createByText', title: '申请人员', align: 'center', width: 150}
                , {
                    field: 'createTime', title: '申请日期', align: 'center', width: 200
                    , templet: function (d) {
                        return util.toDateString(d.createTime, "yyyy-MM-dd");
                    }
                }
                , {field: 'requisitionStatusText', title: '状态', align: 'center', width: 200}
                , {
                    fixed: 'right',
                    title: '操作',
                    width: 300,
                    align: 'center',
                    toolbar: '#purRequisitionList_bar'
                }
            ]]
            ,done: function (res, curr, count) {
                // 全选、全不选
                form.on("checkbox(checkAll)", function () {
                    var status = $(this).prop("checked");
                    $.each($("input[name='checkOne']"), function () {
                        $(this).prop("checked", status);
                    });
                    form.render();
                });
            }
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'detail' || layEvent === 'approval') { // 详情或核准
                if (isNotEmpty(data.requisitionId)) {
                    detailOrApproval(data.requisitionId, layEvent, true, data.requisitionNo);
                }
            } else if (layEvent === 'generate') { // 生成
                layer.confirm('确定将所选记录生成采购订单吗？', function (index) {
                    layer.close(index);
                    if (isNotEmpty(data.requisitionId)) {
                        generate(data.requisitionId, data.requisitionNo);
                    }
                });
            } else if (layEvent === 'reject') { // 退回
                if (isNotEmpty(data.requisitionNo)) {
                    reject(data.requisitionNo, layEvent, data.requisitionId);
                }
            }else if (layEvent == "edit"){
                if (isNotEmpty(data.requisitionId)) {
                    applyEdit(data.requisitionId);
                }
            }else if (layEvent == "submit"){
                if (isNotEmpty(data.requisitionId) && isNotEmpty(data.requisitionNo) ) {
                    applySubmit(data.requisitionId,data.requisitionNo);
                }
            }else if (layEvent == "seeReason"){
                if (isNotEmpty(data.requisitionNo)) {
                    seeReason(data.requisitionNo, true, layEvent, data.requisitionId);
                }
            }
        }
    });
}

/**
 * 详情或单条记录核准
 * @param id 采购申请主键ID
 * @param layEvent 监听的按钮事件
 * @param readonly 是否已只读模式打开弹窗
 * @param requisitionNo 采购申请单号
 */
function detailOrApproval(id, layEvent, readonly, requisitionNo) {
    var title = layEvent === 'detail' ? '详情' : '核准';
    var btnType = layEvent === 'detail' ? 1 : 0;

    _layerOpen({
        url: $.config.server + '/purchase/purRequisitionEdit?id=' + id + "&layEvent=" + layEvent + "&requisitionNo=" + requisitionNo,
        width: 1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 860,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        readonly: readonly, // true：查看 | false：编辑
        btnFlag: 'approvalAndReject',
        btnType: btnType, // 0：采用自定义 | 1：不采用
        btnArr: ['核准', '退回'], // btnType=0时设置才生效
        done: function (index, iframeWin) {
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("核准成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('purRequisitionList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        },
        yes: function (index, iframeWin) {
            if (btnType !== 1) { // 详情下不做任何逻辑处理，此处做核准逻辑
                approval(id, requisitionNo);
            }
        },
        btn2: function (index, iframeWin) {
            reject(requisitionNo, 'reject', id);
        }
    });
}

/**
 * 退回采购申请单
 * @param requisitionNo
 */
function reject(requisitionNo, layEvent, requisitionId) {
    _layerOpen({
        url: $.config.server + '/purchase/purRejectEdit?requisitionNo=' + requisitionNo + '&layEvent=' + layEvent + '&requisitionId=' + requisitionId,
        width: 800, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 425,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: '退回', //弹框标题
        done: function (index, iframeWin) {
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("退回成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('purRequisitionList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 核准采购申请单
 * @param id 采购申请主键ID
 */
function approval(id, requisitionNo) {
    var param = {
        requisitionId: id,
        requisitionNo: requisitionNo,
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/purRequisition/approval.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("已核准");
            var table = layui.table; //获取layui的table模块
            table.reload('purRequisitionList_table'); //重新刷新table
        }
    });
}

/**
 * 批量核准
 * @returns {boolean}
 */
function batchApproval() {
    var flag = false;
    var nos = '';
    var ids = [];
    $.each($("input[name='checkOne']:checked"), function (i, obj) {
        if ($(this).attr("data-status") === '3') {
            flag = true;
            nos += '@' + $(this).attr("data-no") + '';
            return true;
        }

        ids.push($(this).attr("data-id") + ';' + $(this).attr("data-no"));
    });

    if (flag) {
        var tmp = [];
        nos = nos.substring(1, nos.length);
        var arr = nos.split('@');
        for (var i = 0; i < arr.length; i++) {
            tmp.push(arr[i]);
        }

        layer.alert('采购申请单：' + Array.from(new Set(tmp)) + ' 已经核准');
        return false;
    }

    if (ids.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确定核准所选记录吗？', function (index) {
            layer.close(index);

            _ajax({
                type: "POST",
                url: $.config.services.pharmacy + "/purRequisition/batchApproval.do",
                data: { ids: Array.from(new Set(ids)) },  //必须字符串后台才能接收list,
                //loading:false,  //是否ajax启用等待旋转框，默认是true
                dataType: "json",
                done: function (data) {
                    successToast("已核准");
                    var table = layui.table; //获取layui的table模块
                    table.reload('purRequisitionList_table'); //重新刷新table
                }
            });
        });
    }
}

/**
 * 生成采购订单
 * @param requisitionId
 * @param requisitionNo
 */
function generate(requisitionId, requisitionNo) {
    var param = {
        requisitionId: requisitionId,
        requisitionNo: requisitionNo,
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/purRequisition/generate.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("生成成功");
            var table = layui.table; //获取layui的table模块
            table.reload('purRequisitionList_table'); //重新刷新table
        }
    });
}

/**
 * 批量生成采购订单
 */
function batchGenerate() {
    var flag = false;
    var nos = '';
    var ids = [];
    $.each($("input[name='checkOne']:checked"), function (i, obj) {
        if ($(this).attr("data-status") === '1') {
            flag = true;
            nos += '@' + $(this).attr("data-no") + '';
            return true;
        }

        ids.push($(this).attr("data-id") + ';' + $(this).attr("data-no"));
    });

    if (flag) {
        var tmp = [];
        nos = nos.substring(1, nos.length);
        var arr = nos.split('@');
        for (var i = 0; i < arr.length; i++) {
            tmp.push(arr[i]);
        }

        layer.alert('申请单号：' + Array.from(new Set(tmp)) + ' 未核准');
        return false;
    }

    if (ids.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确定生成所选记录吗？', function (index) {
            layer.close(index);

            _ajax({
                type: "POST",
                url: $.config.services.pharmacy + "/purRequisition/batchGenerate.do",
                data: { ids: Array.from(new Set(ids)) },  //必须字符串后台才能接收list,
                //loading:false,  //是否ajax启用等待旋转框，默认是true
                dataType: "json",
                done: function (data) {
                    successToast("已生成");
                    var table = layui.table; //获取layui的table模块
                    table.reload('purRequisitionList_table'); //重新刷新table
                }
            });
        });
    }
}

/**
 * 导出Excel
 * @returns {boolean}
 */
function exportExcel() {
    var ids = [];
    $.each($("input[name='checkOne']:checked"), function (i, obj) {
        ids[i] = $(this).attr("data-no");
    });

    if (Array.from(new Set(ids)).length === 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        var requisitionNos = Array.from(new Set(ids));
        var nos = '';
        for (var i = 0; i < requisitionNos.length; i++) {
            nos += '@' + requisitionNos[i];
        }
        nos = nos.substring(1);

        _downloadFile({
            url: $.config.services.pharmacy + '/purRequisition/export.do',
            data: {
                budgetType: $.constant.BudgetType.WITH_MATERIAL_CODE, // 导出预算类型为有物料编码的数据
                requisitionNo: nos
            },
            fileName: '采购申请_' + nos.replace('@', '_') + '.xlsx'
        });
    }
}


/**
 * 添加采购申请
 * @param layEvent 监听的按钮事件
 * @param readonly 是否已只读模式打开弹窗
 */
function applySave() {
    _layerOpen({
        url: $.config.server + '/purchase/purApplyEdit?layEvent=add',
        width: 1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 860,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: "添加", //弹框标题
        done: function (index, iframeWin) {
            debugger;
            iframeWin.save(
                function success() {
                    successToast('保存成功!');
                    layui.table.reload('purRequisitionList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}


/**
 * 编辑采购申请详情
 * @param layEvent 监听的按钮事件
 * @param readonly 是否已只读模式打开弹窗
 */
function applyEdit(id) {
    _layerOpen({
        url: $.config.server + '/purchase/purApplyEdit?layEvent=edit&id='+id,
        width: 1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 860,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: "编辑", //弹框标题
        done: function (index, iframeWin) {
            iframeWin.save(
                function success() {
                    successToast('保存成功!');
                    layui.table.reload('purRequisitionList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 提交采购申请详情
 * @param layEvent 监听的按钮事件
 * @param readonly 是否已只读模式打开弹窗
 */

function applySubmit(id,no) {

    layer.confirm('确定提交所选记录吗？', function (index) {
        layer.close(index);

        _ajax({
            type: "POST",
            url: $.config.services.pharmacy + "/purRequisition/applySubmit.do",
            data: { requisitionId: id ,requisitionNo:no},  //必须字符串后台才能接收list,
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            dataType: "json",
            done: function (data) {
                successToast("提交成功！");
                var table = layui.table; //获取layui的table模块
                table.reload('purRequisitionList_table'); //重新刷新table
            }
        });
    });

}

/**
 * 查看退回原因
 * @param requisitionNo
 * @param readonly
 */
function seeReason(requisitionNo, readonly, layEvent, requisitionId) {
    _layerOpen({
        url: $.config.server + '/purchase/purRejectEdit?requisitionNo=' + requisitionNo + '&layEvent=' + layEvent,
        width: 800, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 425,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: '查看', //弹框标题
        readonly: readonly, // true：查看 | false：编辑
        btnFlag: 'seeReasonAndHandle',
        btnType: 0, // 0：采用自定义 | 1：不采用
        btnArr: ['确定', '立即处理'], // btnType=0时设置才生效
        yes: function (index, iframeWin) {
            layer.close(index);
        },
        btn2: function (index, iframeWin) {
            // 进入编辑页面
            applyEdit(requisitionId);
        }
    });
}



