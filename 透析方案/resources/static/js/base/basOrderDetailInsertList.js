/**
 * 新增明细列表窗口
 * @author: Rain
 * @version: 1.0
 * @date: 2020/08/21
 */
var basOrderDetailInsertList = avalon.define({
    $id: "basOrderDetailInsertList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    conds: [
        {field: 'materielNo', title: '编码或名称：', type: 'input'},
        {field: 'specifications', title: '规格：', type: 'input'},
        {
            title: '医嘱类别：',
            type: 'input',
            readonly: true,
            value: baseFuncInfo.getSysDictName('OrderType', GetQueryString("orderType"))
        }
    ]
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var orderType = GetQueryString("orderType");
        //当医嘱类别为药疗和检验时的搜索框
        if (orderType === "1" || orderType === "3") {
            getList(orderType);
        } else { //当医嘱类别不为药疗和检验时的搜索框
            basOrderDetailInsertList.conds = [
                {
                    field: 'type',
                    type: 'radio',
                    value: "1",
                    data: [{"name": "药品", "value": "1"}, {"name": "耗材", "value": "0"}, {"name": "诊疗", "value": "2"}]
                },
                {field: 'materielNo', title: '编码或名称：', type: 'input'},
                {
                    title: '医嘱类别：',
                    type: 'input',
                    readonly: true,
                    value: baseFuncInfo.getSysDictName('OrderType', orderType)
                }
            ];
            getList("1");
        }
        initSearch(); //初始化搜索框
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#basOrderDetailInsertList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'basOrderDetailInsertList_search'  //指定的lay-filter
        , conds: basOrderDetailInsertList.conds
        , done: function (filter, data) {
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        , search: function (data) {

            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('basOrderDetailInsertList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getList(type) {
    var id = GetQueryString("id")
    var param = {
        "orderMainId": id,
        "type": type
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#basOrderDetailInsertList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'basOrderDetailInsertList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-125', //table的高度，页面最大高度减去差值
            url: $.config.services.platform + "/basOrderMain/findList.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}  //开启修改框
                , {type: 'numbers', title: '序号', width: 60}  //序号
                , {field: 'materielNo', title: '编码', align: 'center', sortField: 'bsm_.materiel_no'}
                , {field: 'materielName', title: '名称', sortField: 'bsm_.materiel_no'}
                , {field: 'specifications', title: '规格', align: 'center', sortField: 'bsm_.specifications'}
                , {field: 'manufactor', title: '厂家', sortField: 'bsm_.manufactor'}
            ]]
        }
    });
}


/**
 * 关闭弹窗
 * @param supplierId
 * @param drugInfoIds
 * @param $callback
 */
function save($callback) {  //菜单保存操作

    //对表单验证
    verify_form(function (field) {
        //成功验证后
        var param = field
        var url = $.config.services.platform + "/basOrderMain/insert.do";
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}


/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {

    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(basOrderDetailInsert_submit)', function (data) {
        //通过表单验证后
        var table = layui.table; //获取layui的table模块
        var checkStatus = table.checkStatus('basOrderDetailInsertList_table'); //test即为基础参数id对应的值
        var data = checkStatus.data; //获取选中行的数据
        var typeList = [];
        var materielNoList = [];
        var orderType = GetQueryString("orderType");
        if (data.length == 0) {
            warningToast("请选择一条记录");
            return false;
        } else if (orderType === "1" && data.length > 1) {
            warningToast("只能选择一条记录");
            return false;
        } else {
            $.each(data, function (i, item) {
                typeList.push(item.type);
                materielNoList.push(item.materielNo);
            });
        }
        var id = GetQueryString("id");
        var orderType = GetQueryString("orderType");
        var field = {
            "materielNoList": materielNoList,
            "orderMainId": id,
            "typeList": typeList,
            "orderType":orderType
        };

        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#basOrderDetailInsert_submit").trigger('click');
}

