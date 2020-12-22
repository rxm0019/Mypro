/**
 * 出库管理-添加出库物料
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/31
 */
var stockOutCommonList = avalon.define({
    $id: "stockOutCommonList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    stockList:[],//库存明细列表
    selectList:[],//已选择的物料
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        getStockList();
        initSearch(); //初始化搜索框
        avalon.scan();
    });
});

//查询库存明细
function getStockList(field){
    if(field==undefined){
        field={};
    }
    field.type = GetQueryString("type");
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.pharmacy + "/stoWarehouseOutMain/"+GetQueryString("type")+"/stockList.do", // ajax的url必须加上getRootPath()方法
        data:field,
        dataType: "json",
        done:function(data){
            //过滤已选择得到数据
            var list = parent.getSelectList();
            $.each(list, function (i, items) {
                $.each(data, function (index, item) {
                    if(index<data.length){
                        if(item.materielType==items.materielType && item.materielNo==items.materielNo && item.houseName==items.houseName
                            && item.batchNo==items.batchNo){
                            data.splice(index,1);
                        }
                    }
                });
            });
            stockOutCommonList.stockList=data;
            getList();
        }
    });
}

/**
 * 初始化搜索框
 */
function initSearch(){
    if(GetQueryString("type") !== '2'){
        _initSearch({
            elem: '#stoStockInfoList_search' //指定搜索框表单的元素选择器（推荐id选择器）
            ,filter:'stoStockInfoList_search'  //指定的lay-filter
            ,conds:[
                {field: 'materielType', title: '物料类别：', type: 'select', data: getSysDictByCode("materielType", true)}
                ,{field: 'materielNo', title: '编码或名称：',type:'input'}
                ,{field: 'specifications', title: '规格：',type:'input'}
            ]
            ,done:function(filter,data){
                //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
                //...
            }
            ,search:function(data){
                //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
                var field = data.field;
                getStockList(field);
            }
        });
    }else{
        _initSearch({
            elem: '#stoStockInfoList_search' //指定搜索框表单的元素选择器（推荐id选择器）
            ,filter:'stoStockInfoList_search'  //指定的lay-filter
            ,conds:[
                {field: 'materielType', title: '物料类别：', type: 'select', data: getSysDictByCode("materielType", true)}
                ,{field: 'materielNo', title: '编码或名称：',type:'input'}
                ,{field: 'specifications', title: '规格：',type:'input'}
                ,{field: 'bussOrderNo', title: '采购单编号：',type:'input'}
            ]
            ,done:function(filter,data){
                //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
                //...
            }
            ,search:function(data){
                //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
                var field = data.field;
                getStockList(field);
            }
        });
    }
}

/**
 * 库存明细列表渲染
 */
function getList() {
    var param = {
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#stoStockInfoList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'stoStockInfoList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full', //table的高度，页面最大高度减去差值
            data: stockOutCommonList.stockList,
            page:false,
            limit: Number.MAX_VALUE, // 数据表格默认全部显示
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'bussOrderNo', title: '采购单编号',align:'center',minWidth:140,
                    hide:GetQueryString("type") !== '2'}
                ,{field: 'materielType', title: '物料类别',align:'center',width:80
                    ,templet: function(d){
                        return getSysDictName("materielType",d.materielType);
                    }}
                ,{field: 'materielNo', title: '物料编码',align:'center',width:120}
                ,{field: 'materielName', title: '物料名称',align:'left'}
                ,{field: 'stockCount', title: '可用数量',align:'right',width:80}
                ,{field: 'specifications', title: '规格',align:'center',width:100}
                ,{field: 'houseName', title: '仓库',align:'center',width:150}
                ,{field: 'batchNo', title: '批次号',align:'center',width:150}
                ,{field: 'manufactor', title: '厂家',align:'left'}
            ]],
        }
    });
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(stockOutCommonList_submit)', function(data){
        //通过表单验证后
        var table = layui.table; //获取layui的table模块
        var checkStatus = table.checkStatus('stoStockInfoList_table'); //test即为基础参数id对应的值
        var data = checkStatus.data; //获取选中行的数据
        if(data.length==0){
            warningToast("请至少选择一条数据");
            return false;
        }else{
            var ids=data;
        }
        typeof $callback === 'function' && $callback(ids); //返回一个回调事件
    });
    $("#stockOutCommonList_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(ids){
        //调用父页面方法传回数据
        parent.getAddList(ids);
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });
}


