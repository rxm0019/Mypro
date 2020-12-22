/**
 * 出库管理的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/31
 */
var stoWarehouseOutMainList = avalon.define({
    $id: "stoWarehouseOutMainList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    //出库类型：0-销售出库，1-领料出库，2-采购退货出库，3-报损出库，4-盘亏出库，5-调拨出库，6-其他出库
    type:GetQueryString("type"),
    sale: '0' == GetQueryString("type"), // 销售出库
    pick: '1' == GetQueryString("type"), // 领料出库
    purchase: '2' == GetQueryString("type"), // 采购退货出库
    reportLoss: '3' == GetQueryString("type"), // 报损出库
    inventoryLoss: '4' == GetQueryString("type"), // 盘亏出库
    allocation: '5' == GetQueryString("type"), // 调拨出库
    other: '6' == GetQueryString("type"), // 其他出库
    //出库状态
    statusListSelect:[
        {"name":"全部","value":""}
        ,{"name":"待出库","value":"0"}
        ,{"name":"已出库","value":"1"}
        ,{"name":"已关闭","value":"2"}],
    status:'0',//出库状态为待出库
    isNumber:'',//是否自动编号
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList();  //查询列表
        isAutoNumber();//是否自动编号(当前中心)
        avalon.scan();
    });
});
/**
 * 初始化搜索框
 */
function initSearch(){
    var thisConds =[];
    //销售出库
    if(stoWarehouseOutMainList.sale==true){
        thisConds=[
            {field: 'orderOutNo', title: '出库单编号：',type:'input'}
            ,{field: 'patientRecordNo', title: '病历号：',type:'input'}
            ,{field: 'patientName', title: '患者姓名：',type:'input'}
            ,{field: 'status', title: '出库状态',type:'select',data:stoWarehouseOutMainList.statusListSelect}
            ,{field: 'updateTime', title: '出库日期：',type:'date_range'}
        ]
    }else{
        thisConds=[
            {field: 'orderOutNo', title: '出库单编号：',type:'input'}
            ,{field: 'status', title: '出库状态',type:'select',data:stoWarehouseOutMainList.statusListSelect}
            ,{field: 'updateTime', title: '出库日期：',type:'date_range'}
        ]
    }
    _initSearch({
        elem: '#stoWarehouseOutMainList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'stoWarehouseOutMainList_search'  //指定的lay-filter
        ,conds:thisConds
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            field.type = stoWarehouseOutMainList.type;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('stoWarehouseOutMainList_table',{
                where:field
            });
        }
    });
}
/**
 * 查询列表事件
 */
function getList() {
    var param = {
        type:stoWarehouseOutMainList.type
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    var thisCols =[[]];
    //销售出库
    if(stoWarehouseOutMainList.sale==true){
        thisCols= [[ //表头
            {fixed: 'left',type:'checkbox'}  //开启编辑框
            ,{type: 'numbers', title: '序号',width:60 }  //序号
            ,{field: 'orderOutNo', title: '出库单编号', align:'center'}
            ,{field: 'patientRecordNo', title: '病历号', align:'center'}
            ,{field: 'patientName', title: '患者姓名', align:'center'}
            , {
                field: 'warehouseOutDate', title: '出库日期', align: 'center'
                ,templet: function(d){
                    if (isNotEmpty(d.warehouseOutDate)) {
                        return util.toDateString(d.warehouseOutDate, "yyyy-MM-dd");
                    } else {
                        return "";
                    }

                }}
            ,{field: 'status', title: '出库状态', align:'center'
                ,templet: function(d){
                    return stoWarehouseOutMainList.statusListSelect.filter(x=>x.value==d.status)[0].name;
                }}
            ,{fixed: 'right',title: '操作',width: 200, align:'left'
                ,toolbar: '#stoWarehouseOutMainList_bar'}
        ]]
    }else if(stoWarehouseOutMainList.inventoryLoss==true){//盘亏出库
        thisCols= [[ //表头
            {fixed: 'left',type:'checkbox'}  //开启编辑框
            ,{type: 'numbers', title: '序号',width:60 }  //序号
            ,{field: 'orderOutNo', title: '出库单编号', align:'center'}
            ,{field: 'bussOrderNo', title: '盘点单编号', align:'center'}
            ,{field: 'remarks', title: '摘要'}
            ,{field: 'warehouseOutDate', title: '出库日期', align:'center'
                ,templet: function(d){
                    if (isNotEmpty(d.warehouseOutDate)) {
                        return util.toDateString(d.warehouseOutDate,"yyyy-MM-dd");
                    } else {
                        return "";
                    }

                }}
            ,{field: 'createName', title: '操作人', align:'center'}
            ,{field: 'status', title: '出库状态', align:'center'
                ,templet: function(d){
                    return stoWarehouseOutMainList.statusListSelect.filter(x=>x.value==d.status)[0].name;
                }}
            ,{fixed: 'right',title: '操作',width: 200, align:'left'
                ,toolbar: '#stoWarehouseOutMainList_bar'}
        ]]
    }else{
        thisCols= [[ //表头
            {fixed: 'left',type:'checkbox'}  //开启编辑框
            ,{type: 'numbers', title: '序号',width:60 }  //序号
            ,{field: 'orderOutNo', title: '出库单编号', align:'center'}
            ,{field: 'remarks', title: '摘要'}
            ,{field: 'warehouseOutDate', title: '出库日期', align:'center'
                ,templet: function(d){
                    if (isNotEmpty(d.warehouseOutDate)) {
                        return util.toDateString(d.warehouseOutDate,"yyyy-MM-dd");
                    } else {
                        return "";
                    }

                }}
            ,{field: 'createName', title: '操作人', align:'center'}
            ,{field: 'status', title: '出库状态', align:'center'
                ,templet: function(d){
                    return stoWarehouseOutMainList.statusListSelect.filter(x=>x.value==d.status)[0].name;
                }}
            ,{fixed: 'right',title: '操作',width: 200, align:'left'
                ,toolbar: '#stoWarehouseOutMainList_bar'}
        ]]
    }
    _layuiTable({
        elem: '#stoWarehouseOutMainList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'stoWarehouseOutMainList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-200', //table的高度，页面最大高度减去差值
            url: $.config.services.pharmacy + "/stoWarehouseOutMain/"+stoWarehouseOutMainList.type+"/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols:thisCols
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit' || layEvent === 'detail'){ //编辑
                if(isNotEmpty(data.warehouseOutMainId)){
                    saveOrEdit(data.warehouseOutMainId,data.status,layEvent,data.createName);
                }
            }else if(layEvent === 'delete'){ //关闭
                if(isNotEmpty(data.warehouseOutMainId)){
                    close(data.warehouseOutMainId);
                }
            }else if(layEvent === 'checkOut'){ //审批出库
                layer.confirm('确定要审批出库吗？', function(index){
                    layer.close(index);
                    if(isNotEmpty(data.warehouseOutMainId)){
                        var ids=[];
                        ids.push(data.warehouseOutMainId);
                        checkOut(ids);
                    }
                });
            } else if (layEvent === 'deAudit') { // 反审核
                if (isNotEmpty(data.orderOutNo)) {
                    layer.confirm('确定反审核 <span style="color: blue;">' + data.orderOutNo + '</span> 的出库记录吗？', function (index) {
                        layer.close(index);
                        deAudit(data.orderOutNo, stoWarehouseOutMainList.type, data.bussOrderNo);
                    });
                } else {
                    layer.alert('获取入库单编号失败');
                }
            }
        }
    });
}
/**
 * 是否自动编号(当前中心)
 */
function isAutoNumber() {
    _ajax({
        type: "POST",
        data: {},
        loading: false,
        url: $.config.services.system + "/sysHospital/hospitalList.do",
        dataType: "json",
        async: false,
        done: function (data) {
            stoWarehouseOutMainList.isNumber = data.isNumber;
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(id,status,layEvent,createName){
    var url="";
    var title="";
    var readonly = false;
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server+"/stock/stoWarehouseOutMainEdit?type="+stoWarehouseOutMainList.type+"&flag=1&isNumber="+stoWarehouseOutMainList.isNumber;//flag为手动添加标识
    }else{
        if(layEvent=="edit"){
            title="编辑";
        }else{
            title="详情";
            readonly = true;
        }
        url=$.config.server+"/stock/stoWarehouseOutMainEdit?id="+id+"&type="+stoWarehouseOutMainList.type+"&status="+status+"&layEvent="+layEvent+"&createName="+createName+"&isNumber="+stoWarehouseOutMainList.isNumber;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:860,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        readonly:readonly,//只读
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('stoWarehouseOutMainList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 反审核
 * @param orderOutNo 出库单编号
 * @param warehousingType 出库类型
 * @param bussOrderNo 业务单据编号
 */
function deAudit(orderOutNo, warehousingType, bussOrderNo) {
    var param = {
        dataSource: $.constant.DeAuditDataSource.OUT, // 出库
        type: $.constant.DeAuditDataSource.OUT + warehousingType, // 反审核类型
        orderNo: orderOutNo, // 单据编号
        bussOrderNo: bussOrderNo // 业务单据编号
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/stoWarehouseOutMain/deAudit.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("反审核成功");
            var table = layui.table; //获取layui的table模块
            table.reload('stoWarehouseOutMainList_table'); //重新刷新table
        }
    });
}

/**
 * 关闭出库单
 */
function close(id){
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:$.config.server+"/stock/closeWarehouseOutReason?id="+id+"&type="+stoWarehouseOutMainList.type,
        width:400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:300,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:"关闭", //弹框标题
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("关闭成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('stoWarehouseOutMainList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 批量审批出库
 */
function batchOut(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('stoWarehouseOutMainList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        var ids=[];
        $.each(data,function(i,item){
            //状态为待出库的出库单才能审批出库，避免将已出库或已关闭的出库单再次出库
            if(item.status==stoWarehouseOutMainList.status){
                ids.push(item.warehouseOutMainId);
            }
        });
        if(ids.length==0){
            warningToast("请选择出库状态为待出库的出库单");
            return false;
        }else{
            layer.confirm('确定将所选记录审批出库吗？', function(index){
                layer.close(index);
                checkOut(ids);
            });
        }
    }
}
/**
 * 审批出库
 * @param ids
 */
function checkOut(ids){
    var param={
        "ids":ids,
        type:stoWarehouseOutMainList.type
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/stoWarehouseOutMain/"+stoWarehouseOutMainList.type+"/checkOut.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("审批出库成功");
            var table = layui.table; //获取layui的table模块
            table.reload('stoWarehouseOutMainList_table'); //重新刷新table
        }
    });
}
/**
 * 导出excel
 */
function exportExcel() {
    var fileName = '';
    if(stoWarehouseOutMainList.sale==true){
        fileName = '销售出库列表.xlsx';
    }else if(stoWarehouseOutMainList.pick==true){
        fileName = '领料出库列表.xlsx';
    }else if(stoWarehouseOutMainList.purchase==true){
        fileName = '采购退货出库列表.xlsx';
    }else if(stoWarehouseOutMainList.reportLoss==true){
        fileName = '报损出库列表.xlsx';
    }else if(stoWarehouseOutMainList.inventoryLoss==true){
        fileName = '盘亏出库列表.xlsx';
    }else if(stoWarehouseOutMainList.allocation==true){
        fileName = '调拨出库列表.xlsx';
    }else if(stoWarehouseOutMainList.other==true) {
        fileName = '其他出库列表.xlsx';
    }
    _downloadFile({
        url: $.config.services.pharmacy + "/stoWarehouseOutMain/"+stoWarehouseOutMainList.type+"/export.do",
        data: getSearchParam(),
        fileName: fileName
    });
}
/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('stoWarehouseOutMainList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    var ids=[];
    //判断是否勾选全选，全选按查询条件查询，否则按所选id查询
    $("input:checkbox[name='layTableCheckbox']").each(function () {
        if(this.checked == true){
            ids=[];
        }else{
            $.each(data,function(i,item){
                ids.push(item.warehouseOutMainId);
            });
        }
    });
    var searchParam = layui.form.val("stoWarehouseOutMainList_search");
    searchParam.ids = ids;
    return $.extend({
        orderOutNo: '',
        patientRecordNo: '',
        patientName: '',
        status: '',
        updateTime_begin: '',
        updateTime_end: '',
        type:stoWarehouseOutMainList.type,
        ids:[],
    }, searchParam)
}