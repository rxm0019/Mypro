/**
 * tesApplyPickList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作]
 * 检验检查--检验申请单采检页面
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/25
 */
var tesApplyPickList = avalon.define({
    $id: "tesApplyPickList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId:'',
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        var id = GetQueryString("patientId");  //接收变量
        if(isNotEmpty(id)){
            tesApplyPickList.patientId = id;
        }else {
            warningToast("请选择患者");
            return false;
        }
        getList();  //查询列表
        avalon.scan();
    });
});
/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#tesApplyPickList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'tesApplyPickList_search'  //指定的lay-filter
        ,conds:[
            {field: 'applyDate', title: '申请日期：',type:'date_range'}
            ,{field: 'applyStatus',type:'select', title: '申请状态：'
                ,data:getSysDictByCode($.dictType.ApplicationStatus,true)} //加载数据字典
            ,{field: 'applySendStatus',type:'select', title: '送检状态：'
                ,data:getSysDictByCode($.dictType.ApplySendStatus,true)} //加载数据字典
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            var form=layui.form;
            var util=layui.util;
            form.val(filter,{
                "applyDate_begin":util.toDateString(new Date(),"yyyy-MM-dd"),
            });
            form.val(filter,{
                "applyDate_end":util.toDateString(new Date(),"yyyy-MM-dd")
            });
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            field.patientId = tesApplyPickList.patientId;
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('tesApplyPickList_table',{
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
    param.applyDate_begin = util.toDateString(new Date(),"yyyy-MM-dd");
    param.applyDate_end = util.toDateString(new Date(),"yyyy-MM-dd");
    param.patientId = tesApplyPickList.patientId;
    _layuiTable({
        elem: '#tesApplyPickList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'tesApplyPickList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-90', //table的高度，页面最大高度减去差值
            url:  $.config.services.dialysis + "/tesApply/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'applyDate', title: '申请日期',width: 120,align:'center',templet: function(d){
                    return util.toDateString(d.applyDate,"yyyy-MM-dd");
                }}
                ,{field: 'hospitalName', title: '送检医院',width: 140,align:'center'}
                ,{field: 'mechanism', title: '检验机构',width: 120,align:'center',templet: function(d){
                    return getSysDictName($.dictType.HospitalInspection,d.mechanism);
                }}
                ,{field: 'userId', title: '开检医生',width: 100,align:'center'}
                ,{field: 'orderItem', title: '检验项目',align:'center'}
                ,{field: 'sourceType', title: '申请单来源',width: 120,align:'center',templet: function(d){
                    if(d.sourceType == $.constant.SourceType.DIALYSIS){
                        return "透析";
                    }
                    if(d.sourceType == $.constant.SourceType.CLINIC){
                        return "门诊";
                    }
                    if(d.sourceType == $.constant.SourceType.EXAMINE){
                        return "检验";
                    }
                }}
                ,{field: 'applyStatus', title: '申请单状态',width: 100,align:'center',templet: function(d){
                    return getSysDictName($.dictType.ApplicationStatus,d.applyStatus);
                }}
                ,{field: 'applySendStatus', title: '送检状态',width: 100,align:'center',templet: function(d){
                    return getSysDictName($.dictType.ApplySendStatus,d.applySendStatus);
                }}
                ,{fixed: 'right',title: '操作',width: 140, align:'center'
                    ,toolbar: '#tesApplyPickList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'apply'){ //申请单
                //do something
                if(isNotEmpty(data.applyId)){
                    saveOrEdit(data.applyId);
                }
            }
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(id){
    var url="";
    var title="";
    title="编辑";
    url=$.config.server+"/examine/tesApplySampleList?applyId="+id;

    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url:url,  //弹框自定义的url，会默认采取type=2
        width:1600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:1000,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        btn: [], // btnType=0时设置才生效
        end:function() {
            var table = layui.table; //获取layui的table模块
            table.reload('tesApplyPickList_table'); //重新刷新table
        }
    });
}



function getSourceType() {
    var data = [];
    data.push({value: "", name: "全部"});
    data.push({value: "1", name: "透析"});
    data.push({value: "2", name: "门诊"});
    data.push({value: "3", name: "检验"});
    return data;
}