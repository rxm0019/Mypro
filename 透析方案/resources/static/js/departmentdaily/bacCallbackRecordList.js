/**
 * bacCallbackRecordList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * @author Chauncey
 * @date 2020/08/17
 * @description 回访记录查询页面。
 * @version 1.0
 */
var bacCallbackRecordList = avalon.define({
    $id: "bacCallbackRecordList",
    baseFuncInfo: baseFuncInfo//底层基本方法
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
        elem: '#bacCallbackRecordList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacCallbackRecordList_search'  //指定的lay-filter
        ,conds:[
            {field: 'callbackDate', title: '回访日期：',type:'date'},
            {field: 'sickId', title: '患者：',type:'input'}
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
            table.reload('bacCallbackRecordList_table',{
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
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#bacCallbackRecordList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacCallbackRecordList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/bacCallbackRecord/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'sickId', title: '病历号',align:'center',width:130}
                ,{field: 'patientName', title: '姓名',align:'center',width:100}
                ,{field: 'gender', title: '性别',align:'center',width:60
                    ,templet: function(d){
                    return getSysDictName("Sex",d.gender)
                    }}
                ,{field: 'age', title: '年龄',align:'center',width:60}
                ,{field: 'sumDialysis', title: '治疗次数',align:'center',width:100}
                ,{field: 'dialysisTotalTrequency', title: '透析总频次',align:'center',width:100
                    ,templet: function(d){
                        //返回数据字典的名称
                        return getSysDictName("DialysisFrequency",d.dialysisTotalTrequency);
                    }}
                ,{field: 'callbackDate', title: '回访日期',align:'center',align:'center',width:120
                    ,templet: function(d){
                    return util.toDateString(d.callbackDate,"yyyy-MM-dd");
                }}
                ,{field: 'callbackRecord', title: '回访记录'}
                ,{field: 'callbackUser', title: '回访者',align:'center',width:100}
                ,{field: 'evaluate', title: '评价总结'}
                ,{field: 'verifyUser', title: '查对者',align:'center',width:100}
                ,{fixed: 'right',title: '操作',width: 180, align:'center'
                    ,toolbar: '#bacCallbackRecordList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit' || layEvent === "detail"){ //编辑
                //do something
                if(isNotEmpty(data.callbackRecordId)){
                    saveOrEdit(data.callbackRecordId,layEvent);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.callbackRecordId)){
                        var ids=[];
                        ids.push(data.callbackRecordId);
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
function saveOrEdit(id,layEvent){
    var readonly = false;
    var url="";
    var title="";
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server+"/departmentdaily/bacCallbackRecordEdit";
    }else{  //编辑
        if(layEvent === "edit"){
            title = "编辑";
        }else {
            title = "详情";
            readonly = true;
        }
        url=$.config.server+"/departmentdaily/bacCallbackRecordEdit?id="+id+ "&layEvent=" + layEvent;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:494, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:591,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        readonly:readonly,
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
                    table.reload('bacCallbackRecordList_table'); //重新刷新table
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
        url: $.config.services.logistics + "/bacCallbackRecord/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('bacCallbackRecordList_table'); //重新刷新table
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
    var checkStatus = table.checkStatus('bacCallbackRecordList_table');
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
                ids.push(item.callbackRecordId);
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
        url: $.config.services.logistics + "/bacCallbackRecord/export.do",
        data: getSearchParam(),
        fileName: '回访记录列表.xlsx'
    });
}

/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var searchParam = layui.form.val("bacCallbackRecordList_search");
    return $.extend({
        callbackDate: '',
        sickId: ''
    }, searchParam)
}

