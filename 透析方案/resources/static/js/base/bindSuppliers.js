/**
 * 供应商管理
 * @author: Rain
 * @version: 1.0
 * @date: 2020/08/10
 */
var basSupplierManagementList = avalon.define({
    $id: "basSupplierManagementList",
    baseFuncInfo: baseFuncInfo, //底层基本方法
    flag: GetQueryString("flag") // 添加采购订单时URL传值
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
        elem: '#basSupplierManagementInsertList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'basSupplierManagementInsertList_search'  //指定的lay-filter
        , conds: [
            {field: 'supplierCode', title: '供应商编码：', type: 'input'}
            , {field: 'supplierName', title: '供应商名称：', type: 'input'}
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
            table.reload('basSupplierManagementList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getList() {
    var drugInfoId = GetQueryString("drugInfoId");
    var consumableInfoId = GetQueryString("consumableInfoId");
    var url = '';
    if (isNotEmpty(drugInfoId) && drugInfoId != 'null') {
        url = $.config.services.platform + '/basDrugInfo/getBindSupplierList.do';
    } else if (isNotEmpty(consumableInfoId) && consumableInfoId != 'null') {
        url = $.config.services.platform + '/basConsumableInfo/getBindSupplierList.do';
    } else {
        if (basSupplierManagementList.flag === 'addPO') {
            url = $.config.services.pharmacy + '/purOrderMain/getSupplierList.do';
        }
    }

    var param = {
        drugInfoId: drugInfoId,
        consumableInfoId: consumableInfoId,
        dataStatus: GetQueryString("dataStatus")
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#basSupplierManagementList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'basSupplierManagementList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-88', //table的高度，页面最大高度减去差值
            url: url,
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}  //开启修改框
                , {type: 'numbers', title: '序号', width: 60}  //序号
                , {field: 'supplierCode', title: '供应商编码', align: 'center', sortField: 'bsm_.supplier_code', width: 200}
                , {field: 'supplierName', title: '供应商名称', align: 'left', sortField: 'bsm_.supplier_name', width: 200}
                , {field: 'supplierAddress', title: '供应商地址',align: 'left', sortField: 'bsm_.supplier_address'}
                , {field: 'contacts', title: '联系人',align: 'center', sortField: 'bsm_.contacts'}
                , {field: 'phoneNumber', title: '电话',align: 'center', sortField: 'bsm_.phone_number'}
            ]]
        }
    });
}

/**
 * 保存数据，并关闭当前窗口
 * @param $callback
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_logic(function (field) {
        var drugInfoId = GetQueryString("drugInfoId");
        var consumableInfoId = GetQueryString("consumableInfoId");
        var url = '';
        if (isNotEmpty(drugInfoId) && drugInfoId != 'null') {
            url = $.config.services.platform + '/basDrugInfo/insertMaterielSupplierRel.do';
        } else if (isNotEmpty(consumableInfoId) && consumableInfoId != 'null') {
            url = $.config.services.platform + '/basConsumableInfo/insertMaterielSupplierRel.do';
        } else {
            if (basSupplierManagementList.flag === 'addPO') {
                url = $.config.services.pharmacy + '/purOrderMain/saveOrEdit.do';
                field.supplierInfoId = field.ids[0]; // 添加供应商ID
            }
        }
        
        //成功验证后
        var param = field;
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
    }, basSupplierManagementList.flag);
}

/**
 * 逻辑验证
 * @param $callback
 * @param flag
 */
function verify_logic($callback, flag) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(basSupplierManagementInsert_submit)', function (data) {
        //通过表单验证后
        var table = layui.table; //获取layui的table模块
        var checkStatus = table.checkStatus('basSupplierManagementList_table'); //test即为基础参数id对应的值
        var data = checkStatus.data; //获取选中行的数据
        var ids = [];
        if (flag === 'addPO') {
            if (data.length == 0) {
                warningToast("请选择一个供应商");
                return false;
            } else if (data.length > 1) {
                warningToast("只能选择一个供应商");
                return false;
            } else {
                $.each(data, function (i, item) {
                    ids.push(item.supplierId);
                });
            }
        } else {
            if (data.length == 0) {
                warningToast("请至少选择一条记录");
                return false;
            } else {
                $.each(data, function (i, item) {
                    ids.push(item.supplierId);
                });
            }
        }

        var field = {
            ids: ids,
            drugInfoId: GetQueryString("drugInfoId"),
            materielNo: GetQueryString("materielNo"),
            consumableInfoId: GetQueryString("consumableInfoId")
        };
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#basSupplierManagementInsert_submit").trigger('click');
}