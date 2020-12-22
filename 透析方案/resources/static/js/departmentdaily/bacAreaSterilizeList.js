/**
 * 区域消毒bacAreaSterilizeList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * @author Chauncey
 * @date 2020/08/20
 * @description 区域消毒查询。
 * @version 1.0
 */
var bacAreaSterilizeList = avalon.define({
    $id: "bacAreaSterilizeList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    serializerType:getSysDictByCode("regionDisinfectType",false)[0].value,//消毒类别
    serializerTypeName:getSysDictByCode("sterilizeDeviceType",false)[0].name//消毒机名
});
layui.use(['index'], function() {
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
function initSearch(){
    _initSearch({
        elem: '#bacAreaSterilizeList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacAreaSterilizeList_search'  //指定的lay-filter
        ,conds:[
            {field: 'sterilizeDate', title: '消毒日期：',type:'date_range'}
            ,{field: 'sterilizeType', title: '消毒类型：',type:'select'
                ,data:getSysDictByCode("regionDisinfectType",false)}
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
            bacAreaSterilizeList.serializerTypeName = getSysDictName("sterilizeDeviceType",field.sterilizeType);
            table.reload('bacAreaSterilizeList_table',{
                where:field
            });
            $("[data-field='sterilizeType']>div>span").text(bacAreaSterilizeList.serializerTypeName);
        }
    });
}



/**
 * 查询列表事件
 */
function getList() {
    var param = {
        "sterilizeType":bacAreaSterilizeList.serializerType
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#bacAreaSterilizeList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacAreaSterilizeList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/bacAreaSterilize/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type:'checkbox',rowspan:2}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 ,rowspan:2}  //序号
                ,{field: 'areaName', title: '消毒区域',align:'center',rowspan:2}
                ,{field: 'sterilizeType',title:bacAreaSterilizeList.serializerTypeName,align:'center',colspan:2}
                ,{field: 'startSterilizeTime', title: '消毒开始时间',align:'center',rowspan:2
                    ,templet: function(d){
                    console.log(d);
                    if(d.startSterilizeTime !=null && d.startSterilizeTime!=""){
                        return util.toDateString(d.startSterilizeTime,'HH:mm:ss');
                    }else {
                        return "";
                    }
                }}
                ,{field: 'endSterilizeTime', title: '消毒结束时间',align:'center',rowspan:2
                    ,templet: function(d){
                    if(d.endSterilizeTime !=null && d.endSterilizeTime!=""){
                        return util.toDateString(d.endSterilizeTime,'HH:mm:ss');
                    }else{
                        return "";
                    }
                }}
                ,{field: 'sterilizeUser', title: '消毒人',align:'center',rowspan:2}
                ,{field: 'sterilizeDate', title: '消毒日期',align:'center',rowspan:2
                    ,templet: function(d){
                    return d.sterilizeDate == null ? "" : util.toDateString(d.sterilizeDate,"yyyy-MM-dd");
                }}

                ,{field: 'remarks', title: '备注',rowspan:2}
                ,{fixed: 'right',title: '操作',width: 180, align:'center',rowspan:2
                    ,toolbar: '#bacAreaSterilizeList_bar'}
            ],[
                    {field: 'bacDevices',title: '设备编号',align:'center',templet: function(d){
                        return  randerDevices(d.bacDevices,"code");
                    }}
                    ,{field: 'bacDevices',title: '设备名称',align:'center',templet: function(d){
                        return  randerDevices(d.bacDevices,"name");
                    }}
              ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            //获得当前行数据
            var data = obj.data;
            //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var layEvent = obj.event;
            //获得当前行 tr 的DOM对象
            var tr = obj.tr;
            //编辑
            if(layEvent === 'edit'|| layEvent === 'detail'){ //编辑和详情
                //do something
                if(isNotEmpty(data.areaSterilizeId)){
                    saveOrEdit(data.areaSterilizeId,layEvent);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.areaSterilizeId)){
                        var ids=[];
                        ids.push(data.areaSterilizeId);
                        del(ids);
                    }
                });
            }
        }
    });
}

function randerDevices(devices,resultType){
    if(devices != null && devices.length == 0){
        return "";
    }
    templetHtml = "";
    for (var index in devices){
        if(index != 0){
            templetHtml+="<div style='margin:0;padding:5px 15px;width: 100%; min-height: 28px; border-top: 1px solid #e6e6e6'>"
        }else{
            templetHtml+="<div style='margin:0;padding:5px 15px;width: 100%; border:none'>"
        }
        if(resultType === 'name'){
            templetHtml += devices[index].deviceName;
        }else{
            templetHtml+= devices[index].codeNo;
        }
        templetHtml+="</div>"
    }
    templetHtml += ""
    return templetHtml
}

/**
 * 获取单个实体
 */
function saveOrEdit(id,layEvent){
    var url="";
    var title="";
    var readonly = false;
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server+"/departmentdaily/bacAreaSterilizeEdit";
    }else{  //编辑
        if(layEvent === "edit"){
            title = "编辑";
        }else {
            title = "详情";
            readonly = true;
        }
        url=$.config.server+"/departmentdaily/bacAreaSterilizeEdit?id="+id+ "&layEvent=" + layEvent;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:500, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:620,  //弹框自定义的高度，方法会自动判断是否超过高度
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
                    table.reload('bacAreaSterilizeList_table'); //重新刷新table
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
        url: $.config.services.logistics + "/bacAreaSterilize/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('bacAreaSterilizeList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    //获取layui的table模块
    var table = layui.table;
    //test即为基础参数id对应的值
    var checkStatus = table.checkStatus('bacAreaSterilizeList_table');
    //获取选中行的数据
    var data=checkStatus.data;
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.areaSterilizeId);
            });
            del(ids);
        });
    }
}

/**
 * 导出excel
 */
function onExportExcel() {
    _downloadFile({
        url: $.config.services.logistics + "/bacAreaSterilize/export.do",
        data: getSearchParam(),
        fileName: '区域消毒列表.xlsx'
    });
}

/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var searchParam = layui.form.val("bacAreaSterilizeList_search");
    debugger;
    return $.extend({
        sterilizeDate: '',
        sterilizeType: bacAreaSterilizeList.serializerType,//消毒类型
        serializerTypeName:bacAreaSterilizeList.serializerTypeName//消毒机名称
    }, searchParam)
}

