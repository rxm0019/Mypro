/**
 * 采购申请的js文件，包括列表查询、编辑、增加、删除等操作
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
            ,{field: 'createBy', title: '申请人：', type: 'input'}
            ,{field: 'createTime', title: '申请日期：', type: 'date'}
            ,{field: 'requisitionStatus', title: '状态：', type: 'select', data: getSysDictByCode("purchaseBudgetStatus", true)}
        ]
        , done: function (filter, data) {}
        , search: function (data) {
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
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
        flag: 'budget' // 采购预算列表筛选数据标识
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    var form = layui.form;
    _layuiTable({
        elem: '#purRequisitionList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'purRequisitionList_table', //必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-145', //table的高度，页面最大高度减去差值
            url: $.config.services.pharmacy + "/purRequisition/list.do",
            where: param,
            cols: [[ //表头
                {
                    templet: "#checkAll",
                    title: "<input type='checkbox' name='checkAll' lay-skin='primary' lay-filter='checkAll'> ",
                    width: 48,
                    fixed: 'left'
                }
                ,{type: 'numbers', title: '序号', width: 60}  //序号
                ,{field: 'requisitionNo', title: '申请单号', align: 'center'}
                ,{field: 'createByText', title: '申请人员', align: 'center', width: 200}
                ,{
                    field: 'createTime', title: '申请日期', align: 'center', width: 200, templet: function (d) {
                        return util.toDateString(d.createTime, "yyyy-MM-dd");
                    }
                }
                ,{field: 'requisitionStatusText', title: '状态', align: 'center', width: 200}
                ,{fixed: 'right', title: '操作', width: 240, align: 'left', toolbar: '#purRequisitionList_bar'}
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
            if (layEvent === 'edit' || layEvent === 'detail') { // 编辑或详情
                if (isNotEmpty(data.requisitionId)) {
                    addAndOpen(data.requisitionId, layEvent, (layEvent === 'edit' ? false : true), data.requisitionNo);
                }
            } else if (layEvent === 'delete') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.requisitionId)) {
                        var ids = [];
                        ids.push(data.requisitionId);
                        del(ids);
                    }
                });
            } else if (layEvent === 'submit') { // 提交
                layer.confirm('确定提交所选记录吗？', function (index) {
                    layer.close(index);
                    if (isNotEmpty(data.requisitionId)) {
                        submit(data.requisitionId, data.requisitionNo);
                    }
                });
            } else if (layEvent === 'seeReason') { // 查看原因
                if (isNotEmpty(data.requisitionNo)) {
                    seeReason(data.requisitionNo, true, layEvent, data.requisitionId);
                }
            }
        }
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
            openEditPage('编辑', requisitionId, 'edit', false, requisitionNo);
        }
    });
}

/**
 * 新增一条采购申请记录，并进入编辑页面
 */
function addAndOpen(id, layEvent, readonly, requisitionNo) {
    if (isEmpty(id)) {  //id为空,新增操作
        // 1、保存一条采购申请主表记录
        _ajax({
            type: "POST",
            url: $.config.services.pharmacy + "/purRequisition/savePurRequisition.do",
            data: {},
            loading: false,  //是否ajax启用等待旋转框，默认是true
            dataType: "json",
            done: function (data) {
                layui.table.reload('purRequisitionList_table'); //重新刷新table

                // 2、打开编辑页面
                if (isNotEmpty(data)) {
                    openEditPage('新增', data[0], 'add', false, data[1]);
                }
            }
        });
    } else {  // 编辑或详情
        openEditPage((layEvent === 'edit' ? '编辑' : '详情'), id, layEvent, readonly, requisitionNo);
    }
}

/**
 * 打开编辑或详情页面
 * @param title
 * @param id
 */
function openEditPage(title, id, layEvent, readonly, requisitionNo) {
    _layerOpen({
        url: $.config.server + '/purchase/purRequisitionEdit?id=' + id + "&layEvent=" + layEvent + "&requisitionNo=" + requisitionNo,
        width: 1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 860,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        readonly: readonly, // true：查看 | false：编辑
        done: function (index, iframeWin) {
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('purRequisitionList_table'); //重新刷新table
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
function del(ids) {
    var param = {
        "ids": ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/purRequisition/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('purRequisitionList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel() {
    var ids = [];
    $.each($("input[name='checkOne']:checked"), function (i, obj) {
        ids[i] = $(this).attr("data-id");
    });

    if (ids.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确定删除所选记录吗？', function (index) {
            layer.close(index);
            del(Array.from(new Set(ids)));
        });
    }
}

/**
 * 提交事件
 * @param ids
 */
function submit(requisitionId, requisitionNo) {
    var param = {
        requisitionId: requisitionId,
        requisitionNo: requisitionNo
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/purRequisition/submit.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("提交成功");
            var table = layui.table; //获取layui的table模块
            table.reload('purRequisitionList_table'); //重新刷新table
        }
    });
}

/**
 * 导出Excel
 */
function exportExcel() {
    var ids = [];
    $.each($("input[name='checkOne']:checked"), function (i, obj) {
        ids[i] = $(this).attr("data-no") + '@' + $(this).attr("data-type");
    });

    if (Array.from(new Set(ids)).length != 1) {
        warningToast("只能选择一条记录进行导出");
        return false;
    } else {
        var requisitionNo = ids[0].split('@')[0];
        var budgetType = ids[0].split('@')[1];
        var typeName = budgetType === '0' ? '有物料编号' : '无物料编号';

        _downloadFile({
            url: $.config.services.pharmacy + '/purBudgetInfo/export.do',
            data: {
                budgetType: budgetType,
                requisitionNo: requisitionNo
            },
            fileName: '预算列表_' + typeName + '_' + requisitionNo + '.xlsx'
        });
    }
}