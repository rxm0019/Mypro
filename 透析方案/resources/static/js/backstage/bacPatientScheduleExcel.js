/**
 * bacPatientScheduleExcel.jsp的js文件，包括查询，编辑操作
 * 患者排班导出excel
 * @author: xcj
 * @version: 1.0
 * @date: 2020/08/29
 */
var bacPatientScheduleExcel = avalon.define({
    $id: "bacPatientScheduleExcel",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    userId:'',
    userName:'',
    classTemplateId:'',
    classManageList:[],
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        var scheduleDate=GetQueryString("scheduleDate");
        var str = scheduleDate.replace(/-/g, '/'); // "2010/08/01";

        var date=new Date(str);
        var duty_date = newDate(date);
        laydate.render({
            elem: '#scheduleDate'
            ,type: 'date'
            ,format:'yyyy-MM-dd~yyyy-MM-dd'
            ,value:duty_date
            ,done: function(value, date, endDate) {
                if(value!="" && value.length>0){
                    var today=new Date(value.substring(0,10));
                    var duty_date = newDate(today);
                    $("#scheduleDate").val(duty_date);
                }else {
                    var date=new Date();
                    var duty_date = newDate(date);
                    $("#scheduleDate").val(duty_date);
                }
            }
        });

        laydate.render({
            elem: '#startDate'
            ,type: 'date'
            ,format:'yyyy-MM-dd'
            ,value:date
        });

        laydate.render({
            elem: '#endDate'
            ,type: 'date'
            ,format:'yyyy-MM-dd'
            ,value:date
        });
        avalon.scan();
    });
});



/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(bacPatientScheduleExcel_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacPatientScheduleExcel_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param type  1-导出排床表，2-导出患者排班表
 */
function exportExcel(type){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var util=layui.util;
        var param={}; //表单的元素
        var fileName = "";
        if(type==1){
            if(isEmpty(field.scheduleDate)){
                warningToast("请选择排床日期范围");
                return false;
            }
            var split_date = field.scheduleDate.split('~');
            var startTime = split_date[0];
            var endTime = split_date[1];
            param.startDate=util.toDateString(startTime,"yyyy-MM-dd");
            param.endDate=util.toDateString(endTime,"yyyy-MM-dd");
            param.type = "1";
            fileName="排床表 " + param.startDate+"~"+param.endDate + ".xlsx";
        }else {
            if(isEmpty(field.startDate)||isEmpty(field.endDate)){
                warningToast("请选择患者排班日期范围");
                return false;
            }
            param.startDate=util.toDateString(field.startDate,"yyyy-MM-dd");
            param.endDate=util.toDateString(field.endDate,"yyyy-MM-dd");
            param.type = "2";
            fileName="患者排班表 " + param.startDate+"~"+param.endDate + ".xlsx";
        }

        //可以继续添加需要上传的参数
        _downloadFile({
            url: $.config.services.schedule + "/bacPatientSchedule/exportExcel.do",
            data: param,
            fileName: fileName
        });
    });
}





/**
 * 将日期控件选中的日期转换为 当前选中的周期
 * @param today
 * @returns {string}
 */
function newDate(today){
    // 0（周日） 到 6（周六） 之间的一个整数
    var weekday=today.getDay();
    var monday;
    var sunday;
    if (weekday==0) {
        monday=new Date(1000*60*60*24*(weekday-6) + today.getTime());
    }  else {
        monday=new Date(1000*60*60*24*(1-weekday) + today.getTime());
    }
    if (weekday==0) {
        sunday=today;
    }  else {
        sunday=new Date(1000*60*60*24*(7-weekday) + today.getTime());
    }
    var month = monday.getMonth()+1;
    if(month<10)
    {
        month = "0"+month;
    }
    var day1 = monday.getDate();
    if(day1<10)
    {
        day1 = "0"+day1;
    }
    var start = ""+monday.getFullYear()+"-"+month+"-"+day1;
    var month2 = sunday.getMonth()+1;
    if(month2<10)
    {
        month2 = "0"+month2;
    }
    var day2 = sunday.getDate();
    if(day2<10)
    {
        day2 = "0" + day2;
    }
    var end = ""+sunday.getFullYear()+"-"+month2+"-"+day2;
    return start+"~"+end;
}
