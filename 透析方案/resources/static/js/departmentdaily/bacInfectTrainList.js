/**
 * bacDaySterilizeList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * @author Chauncey
 * @date 2020/08/27
 * @description 用于展示感控培训。
 * @version 1.0
 */
var bacInfectTrainList = avalon.define({
    $id: "bacInfectTrainList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    trainMethodSelect:[ //0-线上培训，1-口授
        {"name":"全部","value":""}
        ,{"name":"线上培训","value":0}
        ,{"name":"口授","value":1}],
    trainMethodSelected:"",//已选培训类别
    trainStatusSelect:[  //0-待培训，1-已培训
        {"name":"全部","value":""}
        ,{"name":"待培训","value":"0"}
        ,{"name":"已培训","value":"1"}],
    trainStatusSelected:"",//已选培训状态
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
    var trainMethodTemplet =
        '<select name="trainMethod" ms-duplex="trainMethodSelected" lay-filter="trainMethod">';
        for(var index in bacInfectTrainList.trainMethodSelect){
            trainMethodTemplet += '<option value='+bacInfectTrainList.trainMethodSelect[index].value+
                '>' + bacInfectTrainList.trainMethodSelect[index].name + '</option>'
        }
        trainMethodTemplet +='</select>';
    var trainStatusTemplet =
        '<select name="trainStatus" ms-duplex="trainStatusSelected" lay-filter="trainStatus">';
        for(var index in bacInfectTrainList.trainStatusSelect){
            trainStatusTemplet += '<option value='+bacInfectTrainList.trainStatusSelect[index].value+
                '>' + bacInfectTrainList.trainStatusSelect[index].name + '</option>'
        }
        trainStatusTemplet +='</select>';
    _initSearch({
        elem: '#bacInfectTrainList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacInfectTrainList_search'  //指定的lay-filter
        ,conds:[
            {field: 'planDate', title: '计划培训日期：',type:'date_range'}
            ,{field: 'trainMethod', title: '培训方式：',type:'select',templet:trainMethodTemplet}
            ,{field: 'trainStatus', title: '培训状态：',type:'select',templet:trainStatusTemplet}
            ,{field: 'planTheme', title: '培训主题：',type:'input'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
            $('input[name="planDate_begin"]').prop("readonly", true);
            $('input[name="planDate_end"]').prop("readonly", true);
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('bacInfectTrainList_table',{
                where:field
            });
        }
    });
}

//在Gridview中查询培训类别的名称
function findTrainMethod(value){
    for(var key in bacInfectTrainList.trainMethodSelect){
        if(bacInfectTrainList.trainMethodSelect[key].value === value ){
            return bacInfectTrainList.trainMethodSelect[key].name
        }
    }
}

//在Gridview中查询培训状态的名称
function findTrainStatus(value){
    for(var key in bacInfectTrainList.trainStatusSelect){
        if(bacInfectTrainList.trainStatusSelect[key].value === value ){
            return bacInfectTrainList.trainStatusSelect[key].name
        }
    }
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
        elem: '#bacInfectTrainList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacInfectTrainList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/bacInfectTrain/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'planDate', title: '计划培训日期',align:'center',width:150
                    ,templet: function(d){
                    return util.toDateString(d.planDate,"yyyy-MM-dd");
                }}
                ,{field: 'planTheme', title: '培训主题',width:200}
                ,{field: 'trainMethod', title: '培训方式',align:'center',width:100
                    ,templet: function(d){
                        //返回数据字典的名称
                        return findTrainMethod(d.trainMethod);
                }}
                ,{field: 'trainSite', title: '培训地点',width:250}
                ,{field: 'joinUser', title: '计划参加人员',width:250}
                ,{field: 'absenceUser', title: '缺勤人员',width:250}
                ,{field: 'department', title: '科室',align:'center',width:150
                    ,templet: function(d){
                        //返回数据字典的名称
                        return getSysDictName("Department",d.department);
                }}
                ,{field: 'compere', title: '主持人',align:'center',width:100}
                ,{field: 'designer', title: '制定人',align:'center',width:100}
                ,{fixed: 'right',field: 'trainStatus', title: '培训状态',align:'center',width:100
                    ,templet: function(d){
                        //返回培训状态的名称
                        return findTrainStatus(d.trainStatus);
                }}
                ,{fixed: 'right',title: '操作',width: 200, align:'center'
                    ,toolbar: '#bacInfectTrainList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit' || layEvent === 'detail'){ //编辑或详情
                //do something
                if(isNotEmpty(data.infectTrainId)){
                    if(layEvent === 'edit'){
                        saveOrEdit(data.infectTrainId,layEvent);
                    }
                    else{
                        detailOrPrint(data.infectTrainId);
                    }
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.infectTrainId)){
                        var ids=[];
                        ids.push(data.infectTrainId);
                        del(ids);
                    }
                });
            }else if(layEvent === 'attendance'){
                openAttendanceList(data.infectTrainId);
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
        url=$.config.server+"/departmentdaily/bacInfectTrainEdit";
    }else{  //编辑
        if(layEvent === "edit"){
            title = "编辑";
            url=$.config.server+"/departmentdaily/bacInfectTrainEdit?id=" + id + "&layEvent=" + layEvent;
        }
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:900, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:680,  //弹框自定义的高度，方法会自动判断是否超过高度
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
                    table.reload('bacInfectTrainList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 详情和打印页面
 */
function detailOrPrint(id){
    var title = "详情";
    var btn = ["打印", "取消"];
    var url=$.config.server+"/departmentdaily/bacInfectTrainDetailOrPrint?id=" + id;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:900, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:650,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        btn:btn,
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.onPrint(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("打印成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('bacInfectTrainList_table'); //重新刷新table
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
        url: $.config.services.logistics + "/bacInfectTrain/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('bacInfectTrainList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('bacInfectTrainList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.infectTrainId);
            });
            del(ids);
        });
    }
}

/**
 * 获取出勤情况
 */
function openAttendanceList(id){
    var title="出勤情况";
    var url=$.config.server+"/departmentdaily/attendanceList?id=" + id ;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:497, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:520,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin){
            layer.close(index); //如果设定了yes回调，需进行手工关闭
            var contentvalue = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('bacInfectTrainList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 导出excel
 */
function onExportExcel() {
    _downloadFile({
        url: $.config.services.logistics + "/bacInfectTrain/export.do",
        data: getSearchParam(),
        fileName: '感控培训列表.xlsx'
    });
}
/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var searchParam = layui.form.val("bacInfectTrainList_search");
    return $.extend({
        planDate: '',
        trainMethod: '',
        trainStatus:'',
        planTheme:''
    }, searchParam)
}

