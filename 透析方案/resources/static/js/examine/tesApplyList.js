/**
 * tesApplyList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作]
 * 检验检查--检验申请表
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/21
 */
var tesApplyList = avalon.define({
    $id: "tesApplyList",
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
            tesApplyList.patientId = id;
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
        elem: '#tesApplyList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'tesApplyList_search'  //指定的lay-filter
        ,conds:[
            {field: 'applyDate', title: '申请日期：',type:'date_range'}
            ,{field: 'applyStatus',type:'select', title: '申请状态：'
                ,data:getSysDictByCode($.dictType.ApplicationStatus,true)} //加载数据字典
            ,{field: 'applySendStatus',type:'select', title: '送检状态：'
                ,data:getSysDictByCode($.dictType.ApplySendStatus,true)} //加载数据字典
            ,{field: 'sourceType',type:'select', title: '申请来源：'
                ,data:getSourceType()} //加载数据字典
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            var form=layui.form;
            var util=layui.util;
            var date_end =  new Date();
            var date = new Date();
            var date_begin = date.setMonth(date.getMonth()-1);
            form.val(filter,{
                "applyDate_begin":util.toDateString(date_begin,"yyyy-MM-dd"),
            });
            form.val(filter,{
                "applyDate_end":util.toDateString(date_end,"yyyy-MM-dd")
            });
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            field.patientId = tesApplyList.patientId;
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('tesApplyList_table',{
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
    var date_end =  new Date();
    var date = new Date();
    var date_begin = date.setMonth(date.getMonth()-1);
    param.applyDate_begin = util.toDateString(date_begin,"yyyy-MM-dd");
    param.applyDate_end = util.toDateString(date_end,"yyyy-MM-dd");
    param.patientId = tesApplyList.patientId;
    _layuiTable({
        elem: '#tesApplyList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'tesApplyList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-120', //table的高度，页面最大高度减去差值
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
                ,{fixed: 'right',title: '操作',width: 150, align:'center'
                    ,toolbar: '#tesApplyList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit'){ //申请单
                //do something
                if(isNotEmpty(data.applyId)){
                    saveOrEdit(data.applyId);
                }
            }else if(layEvent === 'report'){ //检验报告
                if(isNotEmpty(data.applyId)){
                    baseFuncInfo.openPatientLayoutPage({
                        pageHref: "/examine/testReportList",
                        patientId: tesApplyList.patientId,
                    })
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.applyId)){
                        del(data.applyId);
                    }
                });
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
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server + "/examine/tesApplyEdit?patientId=" +tesApplyList.patientId+"&sourceType=" +$.constant.SourceType.EXAMINE;
    }else{  //编辑
        title="编辑";
        url=$.config.server+"/examine/tesApplyEdit?applyId="+id+"&patientId=" +tesApplyList.patientId;
    }
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
            table.reload('tesApplyList_table'); //重新刷新table
        }
    });
}


/**
 * 删除事件  无检验项目才能删除
 * @param ids
 */
function del(applyId){
    var param={
        "applyId":applyId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/tesApply/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('tesApplyList_table'); //重新刷新table
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

