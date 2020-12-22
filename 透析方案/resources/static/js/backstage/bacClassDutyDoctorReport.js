/**
 * bacClassDutyDoctorReport.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 医生考勤统计报表页面
 * @Author xcj
 * @version: 1.0
 * @Date 2020/8/11
 */
var bacClassDutyDoctorReport = avalon.define({
    $id: "bacClassDutyDoctorReport",
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
        elem: '#bacClassDutyDoctorReport_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacClassDutyDoctorReport_search'  //指定的lay-filter
        ,conds:[
            {field: 'dutyMonth', title: '月份：',type:'month'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
            var form=layui.form;
            var util=layui.util;
            var startTime = new Date();
            form.val(filter,{
                "dutyMonth":util.toDateString(startTime,"yyyy-MM")
            });
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            getList(field);
        }
    });
}
/**
 * 查询列表事件
 */
function getList(param) {
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    var startTime = new Date();
    if(isEmpty(param)){
        param = {
        };
        param.dutyMonth=util.toDateString(startTime,"yyyy-MM");
    }
    if(isEmpty(param.dutyMonth)){
        param.time_begin=util.toDateString(startTime,"yyyy-MM");
    }

    _ajax({
        type: "POST",
        url: $.config.services.schedule + "/bacClassDuty/reportClassDutyDoctor.do",
        dataType: "json",
        data:param,
        done:function(data){
            // 列表表头
            var columnList = [
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'userName', title: '姓名', align:'center'}
            ];
            var hearData = data.ClassManage;
            var listData = data.ClassDuty;

            for(var j=0;j<hearData.length;j++){
                var obj = hearData[j];
                columnList.push({field: obj.classManageId, title: obj.className, align:'center'});
            }

            columnList.push({field: 'timeTotal', title: '总工时(小时)', align:'center'});
            columnList.push({field: 'outTotal', title: '出勤(天/小时)', align:'center'});
            columnList.push({field: 'plusTotal', title: '加班(天/小时)', align:'center'});
            columnList.push({field: 'restTotal', title: '休息(天)', align:'center'});
            columnList.push({field: 'lessTotal', title: '缺勤(天)', align:'center'});

            _layuiTable({
                elem: '#bacClassDutyDoctorReport_table', //必填，指定原始表格元素选择器（推荐id选择器）
                filter:'bacClassDutyDoctorReport_table', ////必填，指定的lay-filter的名字
                //执行渲染table配置
                render:{
                    height:'full-145', //table的高度，页面最大高度减去差值
                    data:listData,
                    page:false,
                    cols: [columnList]
                },
                //监听工具条事件
                tool:function(obj,filter){
                    var data = obj.data; //获得当前行数据
                    var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                    var tr = obj.tr; //获得当前行 tr 的DOM对象
                }
            });
        }
    });
}

/**
 * 导出excel
 */
function exportExcel(){
    var util=layui.util;
    var dutyMonth = $("input[name='dutyMonth']").val();
    if(isEmpty(dutyMonth)){
        warningToast("请选择月份");
        return false;
    }
    var name = "医生考勤统计表_" + dutyMonth + ".xlsx";
    _downloadFile({
        url: $.config.services.schedule + "/bacClassDuty/exportClassDutyDoctor.do",
        data: {dutyMonth:dutyMonth},
        fileName: name
    });
}
