/**
 * 维护保养记录
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/13
 */
var bacServiceRecordList = avalon.define({
    $id: "bacServiceRecordList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    serviceType:"0"
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        laydate.render({
            elem: '#yearServiceDate_begin'
            ,type: 'date'
            ,trigger: 'click'
        });
        laydate.render({
            elem: '#yearServiceDate_end'
            ,type: 'date'
            ,trigger: 'click'
        });
        initSearch(); //初始化维护检查记录搜索框
        getRecordList();  //查询维护记录列表
        avalon.scan();
    });
    //监听tab切换
    element = layui.element;
    element.on('tab(docDemoTabBrief)', function(data){
        if(data.index == 0){
            //维修记录
            bacServiceRecordList.serviceType = "0";
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('bacServiceRecordList_table',{
                where:field
            });
        }else{
            //年检记录
            bacServiceRecordList.serviceType = "1";
            getYearRecordList();  //查询年检记录列表
        }
    });
});
/**
 * 初始化搜索框
 */
function initSearch(){
    //维修记录
    _initSearch({
        elem: '#bacServiceRecordList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacServiceRecordList_search'  //指定的lay-filter
        ,conds:[
            ,{field: 'serviceDate', title: '维护日期:',type:'date_range'
                ,trigger: 'click'}
            ,{field: 'deviceType', title: '设备类型：',type:'select'
                ,data:getSysDictByCode("deviceType",true)}
            ,{field: 'servicePlanType', title: '维护类型：',type:'select'
                ,data:getSysDictByCode("MaintenanceType",true)}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('bacServiceRecordList_table',{
                where:field
            });
        }
    });
}
/**
 * 查询列表事件
 */
function getRecordList() {
    var param = {
        serviceType:bacServiceRecordList.serviceType,
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#bacServiceRecordList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacServiceRecordList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/bacServiceRecord/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'deviceId', title: '设备编码',align:'center',width:110}
                ,{field: 'deviceType', title: '设备类型',align:'center',width:110
                    ,templet: function(d){
                        return getSysDictName("deviceType",d.deviceType);
                    }}
                ,{field: 'deviceName', title: '设备名称',align:'center'}
                ,{field: 'factory', title: '生产厂家',align:'center'}
                ,{field: 'serialNo', title: '品牌型号',align:'center'}
                ,{field: 'enabledDate', title: '启用日期',align:'center',width:110
                    , templet: function (d) {
                        if (isNotEmpty(d.enabledDate)) {
                            return util.toDateString(d.enabledDate, "yyyy-MM-dd");
                        } else {
                            return "";
                        }
                    }}
                ,{field: 'servicePlanType', title: '维护类型',align:'center',width:100
                    ,templet: function(d){
                        return getSysDictName("MaintenanceType",d.servicePlanType);
                    }}
                , {
                    field: 'serviceDate', title: '维护日期', align: 'center',width:110
                    , templet: function (d) {
                        if (isNotEmpty(d.serviceDate)) {
                            return util.toDateString(d.serviceDate, "yyyy-MM-dd");
                        } else {
                            return "";
                        }
                    }
                }
                 ,{field: 'accendant', title: '保养人',align:'center',width:100}
                ,{fixed: 'right',title: '操作', align:'center'
                    ,toolbar: '#bacServiceRecordList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit' || layEvent === 'detail'){ //编辑
                //do something
                if(isNotEmpty(data.serviceRecordId)){
                    saveOrEdit(data.serviceRecordId,data.deviceType,layEvent);
                }
            }else if(layEvent === 'delete'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.serviceRecordId)){
                        var ids=[];
                        ids.push(data.serviceRecordId);
                        del(ids);
                    }
                });
            }
        }
    });
}

/**
 * 查询列表事件
 */
function getYearRecordList() {
    var param = {
        serviceType:bacServiceRecordList.serviceType,
        serviceDate_begin:$("input[name='yearServiceDate_begin']").val(),
        serviceDate_end:$("input[name='yearServiceDate_end']").val(),
        deviceId:$("input[name='deviceId']").val(),
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#bacServiceYearRecordList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacServiceYearRecordList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/bacServiceRecord/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'deviceId', title: '设备编号',align:'center',minwidth:110}
                ,{field: 'deviceType', title: '设备类型',align:'center',width:110
                    ,templet: function(d){
                        return getSysDictName("deviceType",d.deviceType);
                    }}
                ,{field: 'deviceName', title: '设备名称',align:'center'}
                ,{field: 'factory', title: '生产厂家',align:'center'}
                ,{field: 'serialNo', title: '品牌型号',align:'center'}
                ,{field: 'enabledDate', title: '启用日期',align:'center',width:110
                    , templet: function (d) {
                        return util.toDateString(d.enabledDate, "yyyy-MM-dd");
                    }}
                , {
                    field: 'serviceDate', title: '年检日期', align: 'center',width:110
                    , templet: function (d) {
                        return util.toDateString(d.serviceDate, "yyyy-MM-dd");
                    }
                }
                ,{field: 'accendant', title: '执行人',align:'center',width:100}
                ,{fixed: 'right',title: '操作', align:'center'
                    ,toolbar: '#bacServiceYearRecordList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit' || layEvent === 'detail'){ //编辑
                //do something
                if(isNotEmpty(data.serviceRecordId)){
                    saveOrEdit(data.serviceRecordId,data.deviceType,layEvent);
                }
            }else if(layEvent === 'delete'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.serviceRecordId)){
                        var ids=[];
                        ids.push(data.serviceRecordId);
                        del(ids);
                    }
                });
            }
        }
    });
}
/**
 * 获取单个实体
 */
function saveOrEdit(id,deviceType,layEvent){
    var url="";
    var title="";
    var readonly = false;
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server+"/synthetical/bacServiceRecordEdit?serviceType="+bacServiceRecordList.serviceType;
    }else{  //编辑
        if(layEvent === "edit"){
            title = "编辑";
        }else {
            title = "详情";
            readonly = true;
        }
        url=$.config.server+"/synthetical/bacServiceRecordEdit?id="+id+"&deviceType="+deviceType+"&layEvent=" + layEvent;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:820, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:500,  //弹框自定义的高度，方法会自动判断是否超过高度
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
                    if(bacServiceRecordList.serviceType == "0"){
                        table.reload('bacServiceRecordList_table'); //重新刷新table
                    }else{
                        table.reload('bacServiceYearRecordList_table'); //重新刷新table
                    }
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
function del(ids){
    var param={
        "ids":ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.logistics + "/bacServiceRecord/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            if(bacServiceRecordList.serviceType == "0"){
                table.reload('bacServiceRecordList_table'); //重新刷新table
            }else{
                table.reload('bacServiceYearRecordList_table'); //重新刷新table
            }
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('bacServiceRecordList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.serviceRecordId);
            });
            del(ids);
        });
    }
}

/**
 * 导出excel
 */
function exportRecordExcel() {
    _downloadFile({
        url: $.config.services.logistics + "/bacServiceRecord/export.do",
        data: getSearchParam(),
        fileName: '维修检查记录列表.xlsx'
    });
}

/**
 * 导出excel
 */
function exportYearRecordExcel() {
    _downloadFile({
        url: $.config.services.logistics + "/bacServiceRecord/export.do",
        data: getSearchParam(),
        fileName: '年检记录列表.xlsx'
    });
}

/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    if(bacServiceRecordList.serviceType=="0"){
        var searchParam = layui.form.val("bacServiceRecordList_search")
        return $.extend({
            serviceDate_begin: '',
            serviceDate_end: '',
            deviceType:'',
            servicePlanType:'',
            serviceType: '0'
        }, searchParam)
    }else{
        var searchParam = {
            serviceDate_begin:$("input[name='yearServiceDate_begin']").val(),
            serviceDate_end:$("input[name='yearServiceDate_end']").val(),
            deviceId:$("input[name='deviceId']").val(),
        };
        return $.extend({
            serviceDate_begin:'',
            serviceDate_end:'',
            deviceId:'',
            serviceType: '1'
        }, searchParam)
    }
}
