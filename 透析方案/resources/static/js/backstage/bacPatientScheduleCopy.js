/**
 * bacPatientScheduleCopy.jsp的js文件
 * 患者复制排班页面
 * @author: xcj
 * @version: 1.0
 * @date: 2020/08/25
 */
var bacPatientScheduleCopy = avalon.define({
    $id: "bacPatientScheduleCopy",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    lastWeek:"",//上一周日期
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var util=layui.util;
        var date=new Date();
        //获取上一周时间，限制日期选择器可选时间
        var max_date = newDate(date,"1");
        date = new Date(max_date);
        bacPatientScheduleCopy.lastWeek = max_date;
        var duty_date = newDate(date);

        var laydate=layui.laydate;
        laydate.render({
            elem: '#copyDate'
            ,type: 'date'
            ,format:'yyyy-MM-dd~yyyy-MM-dd'
            ,value:duty_date
            ,max: max_date
            ,done: function(value, date, endDate) {
                if (value != "" && value.length > 0) {
                    var today = new Date(value.substring(0, 10));
                    var duty_date = newDate(today);
                    $("#copyDate").val(duty_date);
                } else {
                    var date = new Date(bacPatientScheduleCopy.lastWeek);
                    var duty_date = newDate(date);
                    $("#copyDate").val(duty_date);
                }
            }
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
    form.on('submit(bacPatientScheduleCopy_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacPatientScheduleCopy_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作

    layer.confirm('复制排班将会覆盖所选的排班数据，请谨慎操作，是否继续?', function(index2){
        layer.close(index2);

        //对表单验证
        verify_form(function(field){
            //成功验证后
            var util=layui.util;
            if(isEmpty(field.copyDate)){
                warningToast("请选择复制周期");
                return false;
            }
            var split_date = field.copyDate.split('~');
            var mon_date = split_date[0];
            if(mon_date!="" && mon_date.length>0){
            }else{
                warningToast("请选择复制周期");
                return false;
            }
            var param={}; //表单的元素
            var startTime = split_date[0];
            var endTime = split_date[1];
            param.copyDate_begin=util.toDateString(startTime,"yyyy-MM-dd");
            param.copyDate_end=util.toDateString(endTime,"yyyy-MM-dd");
            param.copyType = field.copyType;
            //可以继续添加需要上传的参数
            _ajax({
                type: "POST",
                //loading:true,  //是否ajax启用等待旋转框，默认是true
                url: $.config.services.schedule + "/bacPatientSchedule/copyDialysisScheme.do",
                data:param,
                dataType: "json",
                done:function(data){
                    typeof $callback === 'function' && $callback(data); //返回一个回调事件
                }
            });
        });

    });
}

/**
 * 将日期控件选中的日期转换为 当前选中的周期
 * @param today
 * @param begion 是否返回本周星期一
 * @returns {string}
 */
function newDate(today,begion){
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
    if(isNotEmpty(begion)){
        return end;
    }else{
        return start+"~"+end;
    }
}


