/**
 * 添加处方明细列表窗口
 * @author: anders
 * @version: 1.0
 * @date: 2020-09-15
 */
var addPrescriptionList = avalon.define({
    $id: "addPrescriptionList",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,dataList: [{"name": "药品", "value": "1"}, {"name": "耗材", "value": "2"}, {"name": "诊疗", "value": "3"},{"name":"检验","value":"4"}]
    ,diaRecordId: ''   //透析记录id
    ,type: '1'         //物料类型，1-药品 2-耗材  3-诊疗  4-检验
    ,prescriptionId: '' // 处方笺id
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        addPrescriptionList.diaRecordId = GetQueryString('diaRecordId');
        var prescriptionId = GetQueryString('prescriptionId');
        addPrescriptionList.prescriptionId = isNotEmpty(prescriptionId) ? prescriptionId : '';

        initSearch(); //初始化搜索框
        getList();
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#addPrescriptionList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'addPrescriptionList_search'  //指定的lay-filter
        , conds: [
            {field: 'type', type: 'radio',value:"1", data: addPrescriptionList.dataList},
            {field: 'materielNo', title: '编码或名称：', type: 'input'}
        ]
        , done: function (filter, data) {
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
            monitorTypeRadio();
        }
        , search: function (data) {

            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            addPrescriptionList.type = field.type;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('addPrescriptionList_table', {
                where: field
            });
        }
    });
}

/**
 * 单选按钮监听事件
 */
function monitorTypeRadio() {
    var form = layui.form;
    form.on('radio(type)', function(data){
        var value = data.value;//被点击的radio的value值
        addPrescriptionList.type = value;
        var param = {
            type: value,
            materielNo: $("input[name='materielNo']").val()
        }
        var table = layui.table; //获取layui的table模块
        //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
        table.reload('addPrescriptionList_table', {
            where: param
        });
    });
}

/**
 * 查询列表事件
 */
function getList() {
    var url = $.config.services.dialysis + "/diaPrescriptionItem/getRecipeList.do";
    var param = {                       //透析管理--处方明细添加
        type: '1',
        diaRecordId: addPrescriptionList.diaRecordId
    };
    if (isNotEmpty(addPrescriptionList.prescriptionId)) {   //门诊收费--处方明细添加
        param = {
            type: '1',
            prescriptionId: addPrescriptionList.prescriptionId
        }
        url = $.config.services.dialysis + "/diaOutpatientItem/getRecipeList.do";
    }
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#addPrescriptionList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'addPrescriptionList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-70', //table的高度，页面最大高度减去差值
            url: url, // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}  //开启修改框
                ,{field: 'materielNo', title: '编码', align: 'center'}
                ,{field: 'materielName', title: '名称',width:300}
                ,{field: 'specifications', title: '规格',align:'center'}
                ,{field: 'stockCount', title: '库存',align:'center'}
                ,{field: 'manufactor', title: '厂家', width:300}
                ,{field: 'useNumber', title: '*数量',align:'center'
                    ,templet:function (d) {
                        var id = 'useNumber_' + d.materielNo;
                        var html = '<input type="text" name="useNumber" id="' + id + '" autocomplete="off" lay-verify="number" class="useNumber layui-input" maxlength="9" style="width:100%;height: 28px">'
                        return html;
                    }}
            ]]
            ,done: function (res) {
                if (res.bizData) {
                    $(".useNumber").each(function (i) {
                        var inputId = "#useNumber_" + res.bizData[i].materielNo;
                        $(inputId).on("input", function (obj) {
                            var index = $(inputId).parents('tr').attr('data-index');
                            res.bizData[index].useNumber = obj.delegateTarget.value;
                        })
                    });

                    //没有库存的物料，禁用勾选
                    $.each(res.bizData, function (i, item) {
                        if ((addPrescriptionList.type==='1' || addPrescriptionList.type === '2') && item.stockCount <= 0) {
                            var index = res.bizData[i]['LAY_TABLE_INDEX'];
                            $(".layui-table tr[data-index="+index+"] input[name='layTableCheckbox']").prop('disabled',true);
                            $(".layui-table tr[data-index="+index+"] input[name='layTableCheckbox']").next().addClass('layui-btn-disabled');
                            $('.layui-table tr[data-index='+index+'] input[name="layTableCheckbox"]').prop('name', 'eee');
                        }
                    })
                }

            }
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
    var table = layui.table;
    var checkStatus = table.checkStatus('addPrescriptionList_table');
    var data = checkStatus.data;

    //全选会把禁用的数据也选上，这里要先把禁用的移除
    if (data.length > 0) {
         for (var i = data.length - 1; i >= 0; i--) {
             var item = data[i];
            if ((addPrescriptionList.type === '1' || addPrescriptionList.type === '2') && item.stockCount <= 0) {  //把库存不足的药品和耗材移除
                data.splice(i, 1);    //删除下标为i的元素  删除长度为1
            }
        }
    }

    if (data.length <= 0) {
        warningToast('至少选择一笔数据');
        return false;
    }
    var list = [];

    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (isEmpty(item.useNumber)) {
            warningToast('所选数据的数量不能为空');
            return false;
        }

        if(isNotEmpty(item.useNumber) && !(/(^[1-9]\d*$)/.test(item.useNumber))) {
            var error = [
                '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite><br>' + ("数量只能录入大于零的整数")
            ].join('');
            errorToast(error);
            return false;
        }

        var node = {};
        node.diaRecordId = addPrescriptionList.diaRecordId;          //透析记录id  透析管理--处方明细添加
        node.prescriptionId = addPrescriptionList.prescriptionId;   //处方笺id   门诊收费--处方明细添加
        // node.sourceType = 'Manual';
        node.materielNo = item.materielNo;
        node.useNumber = item.useNumber;
        node.type = addPrescriptionList.type;
        list.push(node);
    }
    //成功验证后
    var url = $.config.services.dialysis + "/diaPrescriptionItem/add.do";
    if (isNotEmpty(addPrescriptionList.prescriptionId)) {
        url = $.config.services.dialysis + '/diaOutpatientItem/add.do';
    }
    //可以继续添加需要上传的参数
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: url,
        data: JSON.stringify(list),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        done: function (data) {
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}

