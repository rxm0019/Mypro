/**
 * 字典数据管理
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/13
 */
var sysDictDataList = avalon.define({
    $id: "sysDictDataList",
    baseFuncInfo: baseFuncInfo, //底层基本方法
    showDictDesc: ""
});

layui.use(['index'], function() {
    avalon.ready(function () {
        // 获取URL参数
        var dictId = GetQueryString("dictId");
        var dictType = GetQueryString("dictType");
        var dictName = GetQueryString("dictName");

        // 更新页面参数
        if (dictName) {
            sysDictDataList.showDictDesc = "数据字典 - " + dictName + "（" + dictType + "）";
        }

        // 初始化搜索框
        initSearch(dictId);

        getDictDataList(dictId);  //查询列表
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch(dictId) {
    var dictOptions = getDictOptions();
    _initSearch({
        elem: '#sysDictDataList_search', //指定搜索框表单的元素选择器（推荐id选择器）
        filter: 'sysDictDataList_search',  //指定的lay-filter
        conds: [
            { field: 'dictId', title: '字典类别：', type: 'select', data: dictOptions, value: dictId, search: true },
            { field: 'dictDataName', title: '标签名：', type: 'input' },
            { field: 'dictDataValue', title: '数据值：', type: 'input' }
        ],
        search: function (data) {
            var field = data.field;
            layui.table.reload('sysDictDataList_table', {
                where: field
            });
        }
    });
}

/**
 * 获取字典类别
 * @returns {{name: string, value: string}[]}
 */
function getDictOptions() {
    var dictOptions = [{name: "全部", value: ""}];
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system +"/sysDict/listDict.do",
        dataType: "json",
        async: false,
        done: function(data) {
            if (data) {
                $.each(data, function (index, item) {
                    dictOptions.push({name: item.dictName + "（" + item.dictType + "）", value: item.id});
                });
            }
        }
    });
    return dictOptions;
}

/**
 * 查询列表事件
 */
function getDictDataList(dictId) {
    var param = {
        dictId: dictId
    };
    _layuiTable({
        elem: '#sysDictDataList_table',
        filter: 'sysDictDataList_table',
        // 执行渲染table配置
        render: {
            height: 'full-180',
            url: $.config.services.system + "/sysDictData/list.do",
            where: param,
            cols: [[ //表头
                { fixed: 'left', type: 'checkbox' },  // 开启编辑框
                { type: 'numbers', title: '序号', width: 60 },  // 序号
                {
                    field: 'dictType', title: '字典类别', align: 'center', minWidth: 150,
                    templet: function(row) {
                        var desc = (row.sysDict) ? row.sysDict.dictName + "（" + row.sysDict.dictType + "）" : "";
                        return desc;
                    }
                },
                { field: 'dictDataName', title: '标签名', align: 'left', minWidth: 100 },
                { field: 'dictDataShortName', title: '标签名简称', align: 'center', minWidth: 100 },
                { field: 'dictDataValue', title: '数据值', align: 'center', minWidth: 50 },
                { field: 'dictBizCode', title: '业务代码', align: 'center', minWidth: 50 },
                { field: 'dictDataDefaultValue', title: '默认值', align: 'center', minWidth: 50 },
                { field: 'dictDataIncrement', title: '增量', align: 'center', minWidth: 50 },
                { field: 'dictDataCopy', title: '复制', align: 'center', minWidth: 50 },
                { field: 'dictDataDesc', title: '备注', align: 'left', minWidth: 200 },
                { fixed: 'right', title: '操作', align: 'center', toolbar: '#sysDictDataList_bar' }
            ]]
        },
        // 监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; // 获得当前行数据
            var layEvent = obj.event; // 获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; // 获得当前行 tr 的DOM对象
            if (isNotEmpty(data.id)) {
                if (layEvent === 'detail') { //详情
                    onDictDataDetail(data.id);
                } else if (layEvent === 'edit') { //编辑
                    onDictDataEdit(data.id);
                } else if (layEvent === 'delete') { //删除
                    layer.confirm('确定删除所选数据吗？', function (index) {
                        layer.close(index);
                        var dictDataIds = [data.id];
                        onDictDataDelete(dictDataIds);
                    });
                }
            }
        }
    });
}

/**
 * 字典数据：打开弹窗，可查看字典数据详情
 * @param dictDataId
 */
function onDictDataDetail(dictDataId) {
    var title = "详情";
    var url = $.config.server + "/system/sysDictDataEdit?id=" + dictDataId + "&readonly=Y";
    openDictDataEditWin(title, url, true);
}

/**
 * 字典数据：打开弹窗，可添加字典数据
 * @returns {boolean}
 */
function onDictDataAdd() {
    var dictId = layui.form.val('sysDictDataList_search').dictId;

    var title = "新增";
    var url = $.config.server + "/system/sysDictDataEdit?addDictId=" + dictId;
    openDictDataEditWin(title, url, false);
}

/**
 * 字典数据：打开弹窗，可编辑字典数据
 * @param dictDataId
 */
function onDictDataEdit(dictDataId) {
    var title = "编辑";
    var url = $.config.server + "/system/sysDictDataEdit?id=" + dictDataId;
    openDictDataEditWin(title, url, false);
}

/**
 * 字典数据：批量删除
 */
function onDictDataBatchDelete() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('sysDictDataList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条数据");
        return false;
    } else {
        layer.confirm('确定删除所选数据吗？', function (index) {
            layer.close(index);
            var dictDataIds = [];
            $.each(data, function (i, item) {
                dictDataIds.push(item.id);
            });
            onDictDataDelete(dictDataIds);
        });
    }
}

/**
 * 字典数据：删除
 * @param dictDataIds
 */
function onDictDataDelete(dictDataIds) {
    var param = {
        "dictDataIds": dictDataIds
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysDictData/delete.do",
        data: param,
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            layui.table.reload('sysDictDataList_table'); //重新刷新table
        }
    });
}

/**
 * 打开字典数据编辑弹窗
 * @param title
 * @param url
 * @param readonly
 */
function openDictDataEditWin(title, url, readonly) {
    _layerOpen({
        url: url,  // 弹框自定义的url，会默认采取type=2
        width: 800, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 400,  // 弹框自定义的高度，方法会自动判断是否超过高度
        readonly: readonly,  // 弹框自定义参数，用于是否只能查看,默认是false，true代表只能查看,done事件不执行
        title: title, // 弹框标题
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.onDictDataSave(
                // 成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    layui.table.reload('sysDictDataList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}
