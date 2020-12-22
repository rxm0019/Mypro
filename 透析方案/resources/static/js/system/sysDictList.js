/**
 * 字典类别管理
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/13
 */
var sysDictList = avalon.define({
    $id: "sysDictList",
    baseFuncInfo: baseFuncInfo//底层基本方法
});

layui.use(['index'], function() {
    avalon.ready(function () {
        // 初始化搜索框
        initSearch();
        // 查询列表
        getDictList();
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#sysDictList_search', //指定搜索框表单的元素选择器（推荐id选择器）
        filter: 'sysDictList_search',  //指定的lay-filter
        conds: [
            { field: 'dictName', title: '类别名称：', type: 'input' },
            { field: 'dictType', title: '类别代码：', type: 'input' }
        ],
        search: function (data) {
            var field = data.field;
            layui.table.reload('sysDictList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getDictList() {
    var param = {};
    _layuiTable({
        elem: '#sysDictList_table',
        filter: 'sysDictList_table',
        // 执行渲染table配置
        render: {
            height: 'full-180',
            url: $.config.services.system + "/sysDict/list.do",
            where: param,
            cols: [[ //表头
                { fixed: 'left', type: 'checkbox' },  // 开启编辑框
                { type: 'numbers', title: '序号', width: 60 },  // 序号
                {
                    field: 'dictName', title: '类别名称', align: 'center', minWidth: 100,
                    templet: function(row){
                        if (baseFuncInfo.authorityTag('sysDictList#addDictData')) {
                            var layHref = $.config.server + "/system/sysDictDataList?dictId=" + row.id + "&dictType=" + row.dictType + "&dictName=" + row.dictName;
                            var layText = "字典数据-" + row.dictName;
                            return '<a style="color: dodgerblue;" lay-href="' + layHref + '" lay-text="' + layText + '">' + row.dictName + '</a>';
                        } else {
                            return row.dictName;
                        }
                    }
                },
                { field: 'dictType', title: '类别代码', align: 'center' },
                { field: 'dictDesc', title: '备注', align: 'left', minWidth: 200 },
                { fixed: 'right', title: '操作', align: 'center', toolbar: '#sysDictList_bar' }
            ]]
        },
        // 监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; // 获得当前行数据
            var layEvent = obj.event; // 获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; // 获得当前行 tr 的DOM对象
            if (isNotEmpty(data.id)) {
                if (layEvent === 'detail') { //详情
                    onDictDetail(data.id);
                } else if (layEvent === 'edit') { //编辑
                    onDictEdit(data.id);
                } else if (layEvent === 'delete') { //删除
                    layer.confirm('确定删除所选数据吗？', function (index) {
                        layer.close(index);
                        var dictIds = [data.id];
                        onDictDelete(dictIds);
                    });
                }
            }
        }
    });
}

/**
 * 字典类别：打开弹窗，可查看字典类别详情
 * @param dictId
 */
function onDictDetail(dictId) {
    var title = "详情";
    var url = $.config.server + "/system/sysDictEdit?id=" + dictId + "&readonly=Y";
    openDictEditWin(title, url, true);
}

/**
 * 字典类别：打开弹窗，可添加字典类别
 * @returns {boolean}
 */
function onDictAdd() {
    var title = "新增";
    var url = $.config.server + "/system/sysDictEdit";
    openDictEditWin(title, url, false);
}

/**
 * 字典类别：打开弹窗，可编辑字典类别
 * @param dictId
 */
function onDictEdit(dictId) {
    var title = "编辑";
    var url = $.config.server + "/system/sysDictEdit?id=" + dictId;
    openDictEditWin(title, url, false);
}

/**
 * 字典类别：批量删除
 */
function onDictBatchDelete() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('sysDictList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条数据");
        return false;
    } else {
        layer.confirm('确定删除所选数据吗？', function (index) {
            layer.close(index);
            var dictIds = [];
            $.each(data, function (i, item) {
                dictIds.push(item.id);
            });
            onDictDelete(dictIds);
        });
    }
}

/**
 * 字典类别：删除
 * @param dictIds
 */
function onDictDelete(dictIds) {
    var param = {
        "dictIds": dictIds
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysDict/delete.do",
        data: param,
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            layui.table.reload('sysDictList_table'); //重新刷新table
        }
    });
}

/**
 * 打开字典类别编辑弹窗
 * @param title
 * @param url
 * @param readonly
 */
function openDictEditWin(title, url, readonly) {
    _layerOpen({
        url: url,  // 弹框自定义的url，会默认采取type=2
        width: 400, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 380,  // 弹框自定义的高度，方法会自动判断是否超过高度
        readonly: readonly,  // 弹框自定义参数，用于是否只能查看,默认是false，true代表只能查看,done事件不执行
        title: title, // 弹框标题
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.onDictSave(
                // 成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    layui.table.reload('sysDictList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}
