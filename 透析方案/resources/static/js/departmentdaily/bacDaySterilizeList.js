/**
 * bacDaySterilizeList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * @author carl
 * @date 2020/08/11
 * @description 用于展示每日消毒记录。
 * @version 1.0
 */
var bacDaySterilizeList = avalon.define({
    $id: "bacDaySterilizeList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    areaSterilizeSelect:[
        {"name":"全部","value":""}
        ,{"name":"清洁区","value":"cleanRoom"}
        ,{"name":"半清洁区","value":"halfCleanRoom"}
        ,{"name":"污染区","value":"pollutionRoom"}
        ,{"name":"病历车","value":"MedicalRecordCar"}],
    areaSterilizeSelected:"",
    areaNameSelect:[]
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList();  //查询列表
        var form = layui.form;
        form.on('select(areaSterilize)',function(data){
            bacDaySterilizeList.areaSterilizeSelected = data.value;
            bacDaySterilizeList.areaNameSelect = baseFuncInfo.getSysDictByCode(data.value,true);

            var areaNameOption = '';
            for(var index in bacDaySterilizeList.areaNameSelect){
                areaNameOption += '<option value='+bacDaySterilizeList.areaNameSelect[index].value+
                    '>' + bacDaySterilizeList.areaNameSelect[index].name + '</option>'
            }
            $("[name='areaName']").html(areaNameOption);
            form.render('select');
        })
        avalon.scan();
    });
});

function findAreaSterilize(value){
    for(var key in bacDaySterilizeList.areaSterilizeSelect){
        if(bacDaySterilizeList.areaSterilizeSelect[key].value === value ){
            return bacDaySterilizeList.areaSterilizeSelect[key].name
        }
    }
}

/**
 * 初始化搜索框
 */
function initSearch(){
     var areaSterilizeTemplet =
         '<select name="areaSterilize" ms-duplex="areaSterilizeSelected" lay-filter="areaSterilize">';
         for(var index in bacDaySterilizeList.areaSterilizeSelect){
             areaSterilizeTemplet += '<option value='+bacDaySterilizeList.areaSterilizeSelect[index].value+
                 '>' + bacDaySterilizeList.areaSterilizeSelect[index].name + '</option>'
         }
         areaSterilizeTemplet +='</select>';
    _initSearch({
        elem: '#bacDaySterilizeList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacDaySterilizeList_search'  //指定的lay-filter
        ,conds:[
            {field: 'sterilizeDate', title: '消毒日期：',type:'date_range'}
            ,{field: 'areaSterilize', title: '类型：',type:'select',templet:areaSterilizeTemplet}
            ,{field: 'areaName', title: '名称：',type:'select'}
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
            table.reload('bacDaySterilizeList_table',{
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
        elem: '#bacDaySterilizeList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacDaySterilizeList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/bacDaySterilize/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号

                ,{field: 'areaSterilize', title: '类型'
                    ,templet: function(d){
                    //返回数据字典的名称
                    return findAreaSterilize(d.areaSterilize);
                }}

                ,{field: 'areaName', title: '名称'
                    ,templet: function(d){
                    //返回数据字典的名称
                    return getSysDictName(d.areaSterilize,d.areaName);
                }}
                ,{field: 'described', title: '描述'}

                ,{field: 'sterilizeMethod', title: '消毒方式'
                    ,templet: function(d){
                    //返回数据字典的名称
                    return getSysDictName("sterilizeMethod",d.sterilizeMethod);
                }}
                ,{field: 'sterilizeUser', title: '消毒人'}
                ,{field: 'sterilizeDate', title: '消毒日期',align:'center'
                    ,templet: function(d){
                    return util.toDateString(d.sterilizeDate,"yyyy-MM-dd");
                }}
                ,{fixed: 'right',title: '操作', align:'center'
                    ,toolbar: '#bacDaySterilizeList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'detail'){ //查看
                if(isNotEmpty(data.daySterilizeId)){
                    saveOrEdit(data.daySterilizeId,true);
                }
                //do somehing
            }else if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.daySterilizeId)){
                    saveOrEdit(data.daySterilizeId,false);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.daySterilizeId)){
                        var ids=[];
                        ids.push(data.daySterilizeId);
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
function saveOrEdit(id,readonly){
    if(readonly == null || typeof readonly == "undefined"){
        readonly = false;
    }
    var url="";
    var title="";
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server+"/departmentdaily/bacDaySterilizeEdit";
    }else{  //编辑

        title= readonly ?"详情":"编辑";
        url=$.config.server+"/departmentdaily/bacDaySterilizeEdit?id=" + id + "&readonly="+readonly;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:450,  //弹框自定义的高度，方法会自动判断是否超过高度
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
                    successToast("保存成功",500);
                    var table = layui.table; //获取layui的table模块
                    table.reload('bacDaySterilizeList_table'); //重新刷新table
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
        url: $.config.services.logistics+"/bacDaySterilize/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功",500);
            var table = layui.table; //获取layui的table模块
            table.reload('bacDaySterilizeList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('bacDaySterilizeList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.daySterilizeId);
            });
            del(ids);
        });
    }
}


/**
 * 导出excel
 */
function exportExcel() {
    _downloadFile({
        url: $.config.services.logistics + "/bacDaySterilize/export.do",
        data: getSearchParam(),
        fileName: '每日消毒.xlsx'
    });
}
/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var searchParam = layui.form.val("bacDaySterilizeList_search");

    return $.extend({
        sterilizeDate: "",
    }, searchParam)
}