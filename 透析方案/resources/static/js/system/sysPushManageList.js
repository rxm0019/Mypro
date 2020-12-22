/**
 * 推送执行设置列表
 * @author: hhc
 * @version: 1.0
 * @date: 2020/9/17
 */
var sysPushManageList = avalon.define({
    $id: "sysPushManageList",
    baseFuncInfo: baseFuncInfo,  //底层基本方法
    pushType: 'sys_dict'
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
        elem: '#sysPushManageList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'sysPushManageList_search'  //指定的lay-filter
        , conds: [
            {field: 'pushType', title: '推送类型：', type: 'select', data: getSysDictByCode("PushType", false),search: true}
            , {field: 'pushTime', title: '日期：', type: 'date_range'}
            , {field: 'pushCode', title: '编码：', type: 'input'}
            , {field: 'pushName', title: '名称：', type: 'input'}
        ]
        , done: function (filter, data) {
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        , search: function (data) {
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            sysPushManageList.pushType = field.pushType;
            if (isNotEmpty(field.pushTime_end) && field.pushTime_begin > field.pushTime_end) {
                warningToast('开始日期不能大于结束日期');
                return false;
            }
            getList(field);
        }
    });
}

/**
 * 查询列表事件
 */
function getList(field) {
    var param = {
        pushType: getSysDictByCode("PushType", false)[0].value
    };
    if(isNotEmpty(field)){
        param = $.extend(param,field);
    }
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#sysPushManageList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'sysPushManageList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.platform + "/sysPushManage/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}  //开启编辑框
                // ,{type: 'numbers', title: '序号',width:60 }  //序号
                , {
                    field: 'pushType', title: '推送类型', align: "center",
                    templet: function (d) {
                        return getSysDictName('PushType', d.pushType);
                    }
                }
                , {field: 'pushCode', title: '编码', align: "left"}
                , {field: 'pushName', title: '名称', align: "left"}
                , {
                    field: 'supplierName', title: '供应商', align: "left",
                    hide:sysPushManageList.pushType !== 'bas_materiel_supplier_r'
                }
                , {
                    field: 'salesPrice', title: '销售价格', align: "right",
                    hide: sysPushManageList.pushType !== 'pur_sales_price'
                }
                , {
                    field: 'price', title: '采购价格', align: "right",
                    hide: sysPushManageList.pushType !== 'bas_materiel_supplier_r'
                }
                , {
                    field: 'updateTime', title: '修改日期', align: "center",
                    templet: function (d) {
                        return util.toDateString(d.updateTime, "yyyy-MM-dd HH:mm");
                    }
                }
                , {
                    fixed: 'right', title: '操作', width: 140, align: 'center'
                    , toolbar: '#sysPushManageList_bar'
                }
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'set') { //设置推送医院
                //do something
                if (isNotEmpty(data.id)) {  //扩展字段的id,用来存当前记录的ID
                    var ids = [];
                    var pushType = data.pushType;
                    var pushName = data.pushName.split(",");   //分割成数组
                    var pushCode = data.pushCode.split(",");
                    ids.push(data.id);
                    setting(ids, pushType, pushName, pushCode);
                    // saveOrEdit(data.id);

                }
            } else if (layEvent === 'pushHistory') { //查看推送历史
                getPushHistory(data.id);
            }
        }
    });
}

/**
 * 获取推送历史
 */

function getPushHistory(id) {
    var url = $.config.server + "/system/sysPushHistoryList?id=" + id;
    var title = "推送历史";
    _layerOpen({
        url: url,
        readonly: true,
        width: 800,
        height: 532,
        title: title,
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    //successToast("保存成功", 500);
                    var table = layui.table; //获取layui的table模块
                    //table.reload('sysPushManageList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }

    });

}

/**
 * 设置
 * @param ids
 * @param pushType
 * @param pushName
 * @param pushCode
 */
function setting(ids, pushType, pushName, pushCode) {

    var param = {
        "ids": ids,
        "pushType": pushType,
        "pushCode": pushCode,
        "pushName": pushName
    }
    var uuid = guid();
    var url = $.config.server + "/system/sysPushManageEdit?uuid=" + uuid;
    window.sessionStorage.setItem(uuid, JSON.stringify(param));
    var title = "设置";
    _layerOpen({
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 800, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 580,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    //successToast("保存成功", 500);
                    var table = layui.table; //获取layui的table模块
                    table.reload('sysPushManageList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });

}

/**
 * 查询结果设置
 */
function batchSetting() {

    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('sysPushManageList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    }
    var ids = [];
    var pushNames = [];
    var pushCodes = [];
    var pushType = data[0].pushType;
    $.each(data, function (i, item) {
        ids.push(item.id);
        pushNames.push(item.pushName);
        pushCodes.push(item.pushCode);
    });
    setting(ids, pushType, pushNames, pushCodes);
}



