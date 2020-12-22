/**
 * 检查项维护
 * @author: Freya
 * @version: 1.0
 * @date: 2020/09/23
 */
var bacExamineItemsList = avalon.define({
    $id: "bacExamineItemsList",
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
        elem: '#bacExamineItemsList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacExamineItemsList_search'  //指定的lay-filter
        ,conds:[
            {field: 'testMainId',type:'select', title: '检验总类：'
                ,data:getTestMainList()}
            ,{field: 'examineItemsName', title: '检查项名称：',type:'input'}
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
            table.reload('bacExamineItemsList_table',{
                where:field
            });
        }
    });
}

//获取检验总类列表
function getTestMainList() {
    var dicts=[];
    dicts.push({value:"",name:"全部"});
    var param = {
    };
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/basTestMain/getLists.do",
        data:param,
        dataType: "json",
        async:false,
        done: function(data){
            if(data != null && data.length>0){
                for(var i=0;i<data.length;i++){
                    dicts.push({value:data[i].testMainId,name:data[i].testName});
                }
            }
        }
    });
    return dicts;
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
        elem: '#bacExamineItemsList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacExamineItemsList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.platform + "/bacExamineItems/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'testMainName', title: '检验总类', align:'center'}
                ,{field: 'examineItemsNo', title: '检查项编码', align:'center'}
                ,{field: 'examineItemsName', title: '检查项名称', align:'center'}
                ,{field: 'referenceRange', title: '参考范围', align:'center'}
                ,{field: 'unit', title: '单位', align:'center'
                    ,templet: function(d){
                        return getSysDictName("ExamineItemUnit",d.unit);
                    }}
                ,{field: 'dataStatus', title: '数据状态', align:'center'
                    ,templet: function(d){
                        return getSysDictName("sys_status",d.dataStatus);
                    }}
                ,{fixed: 'right',title: '操作',width: 180, align:'center'
                    ,toolbar: '#bacExamineItemsList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit' || layEvent === 'detail'){ //编辑
                //do something
                if(isNotEmpty(data.examineItemsId)){
                    saveOrEdit(data.examineItemsId,layEvent);
                }
            }else if(layEvent === 'delete'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.examineItemsId)){
                        var ids=[];
                        ids.push(data.examineItemsId);
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
    var url="";
    var title="";
    var readonly = false;
    if(isEmpty(id)){  //id为空,新增操作
        title = "新增";
        url = $.config.server+"/backstage/bacExamineItemsEdit";
    }else{ //编辑、查看详情
        if(layEvent === "edit"){
            title = "编辑";
        }else {
            title = "详情";
            readonly = true;
        }
        url = $.config.server+"/backstage/bacExamineItemsEdit?id="+id+"&layEvent=" + layEvent;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:900, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:600,  //弹框自定义的高度，方法会自动判断是否超过高度
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
                    table.reload('bacExamineItemsList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

function basTestMainList() {
    var title = "检验总类";
    var url = $.config.server+"/backstage/basTestMainList";
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url,
        width: 800, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 650,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        btn: [], // btnType=0时设置才生效
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('stoWarehouseOutMainDetailList_table'); //重新刷新table
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
        url: $.config.services.platform + "/bacExamineItems/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('bacExamineItemsList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('bacExamineItemsList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.examineItemsId);
            });
            del(ids);
        });
    }
}

