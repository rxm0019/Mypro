/**
 * bacPatientScheduleMonth.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 患者排班按月预览页面
 * @Author xcj
 * @version: 1.0
 * @Date 2020/8/26
 */
var bacPatientScheduleMonth = avalon.define({
    $id: "bacPatientScheduleMonth",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    list:[],//排班列表
    month:'',//月份显示
    curMonthIndex:0,//相对当前周的第几周，-1是上一周，0是当前周，1是下一周

});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        getList();
        avalon.scan();
    });
});


/**
 * 上一月
 */
function lastMonth() {
    bacPatientScheduleMonth.curMonthIndex = bacPatientScheduleMonth.curMonthIndex - 1;
    getList();
}

/**
 * 下一月
 */
function nextMonth() {
    bacPatientScheduleMonth.curMonthIndex = bacPatientScheduleMonth.curMonthIndex + 1;
    getList();
}


/**
 * 查询列表事件
 */
function getList() {
    var param = {};
    param.monthIndex = bacPatientScheduleMonth.curMonthIndex;
    _ajax({
        type: "POST",
        url: $.config.services.schedule + "/bacPatientSchedule/listPatientScheduleMonth.do",
        dataType: "json",
        data:param,
        done:function(data){
            bacPatientScheduleMonth.month = data.month;
            var list = data.sevenList;
            bacPatientScheduleMonth.list.clear();
            bacPatientScheduleMonth.list.pushArray(list);
        }
    });
}

function showList(obj) {
    var day = $(obj).attr("day"); //获取选中行的数据
    var url="";
    var title="";
    title="患者排班";
    if(isNotEmpty(day)){
        url=$.config.server + "/backstage/bacPatientScheduleList?day="+day;
        parent.layui.index.openTabsPage(url, title); //这里要注意的是 parent 的层级关系
    }
}


