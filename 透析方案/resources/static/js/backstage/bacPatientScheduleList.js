/**
 * bacPatientScheduleList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 患者排班主页面
 * @Author xcj
 * @version: 1.0
 * @Date 2020/8/19
 */
var bacPatientScheduleList = avalon.define({
    $id: "bacPatientScheduleList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    list:[],//排班列表
    mon:'',
    tue:'',
    web:'',
    thur:'',
    fri:'',
    sat:'',
    sun:'',
    currentMon:'',//当前周的星期一
    curWeekIndex:0,//相对当前周的第几周，-1是上一周，0是当前周，1是下一周
    currentDay:'',//服务器的时间

});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var day = GetQueryString("day");  //接收变量
        initSearch(); //初始化搜索框
        if(isNotEmpty(day)){
            var str = day.replace(/-/g, '/'); // "2010/08/01";
            var date = new Date(str);// 创建日期对象bai
            initWeek(date);
        }
        avalon.scan();
    });
});
/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#bacPatientScheduleList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacPatientScheduleList_search'  //指定的lay-filter
        ,conds:[
            ,{field: 'scheduleShift', title: '班次',type:'select',data:getSysDictByCode("Shift",true)} //加载数据字典}
            ,{field: 'regionId',type:'select',title: '区组'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            getRegionId(filter,data);//项目下拉框
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            getList(field);
        }
    });
}

/**
 *
 * 监听窗体大小，设置table-Shift高度
 */
$(window).resize(function () {
    setShiftHeight();
})

function setShiftHeight() {
    //获取上午、下午、晚上的右侧数据div
    var domRight = $(".table-Right");
    //获取上午、下午、晚上的div
    var domShift = $('.table-Shift');
    for(var i=0;i<domShift.length;i++){
        var parentHeight = domRight[i].offsetHeight - 2;
        //手机分辨率不用管
        if ($(window).width() < 767) {
            $(domShift[i]).css("height",'auto');
        }else{
            if(parentHeight<5){
                $(domShift[i]).css("height",'auto');
            }else {
                $(domShift[i]).css("height",parentHeight);
            }
        }
        var shift = $(domShift[i]).attr("shift");
        if(shift == 1){ //上午
            $(domShift[i]).addClass("morning");
        }
        if(shift == 2){ //下午
            $(domShift[i]).addClass("afternoon");
        }
        if(shift == 3){ //晚上
            $(domShift[i]).addClass("night");
        }
    }
}

/**
 * 上一周
 */
function lastWeek() {
    bacPatientScheduleList.curWeekIndex = bacPatientScheduleList.curWeekIndex - 1;
    setWeek();
    getList();
}

/**
 * 下一周
 */
function nextWeek() {
    bacPatientScheduleList.curWeekIndex = bacPatientScheduleList.curWeekIndex + 1;
    setWeek();
    getList();
}



/**
 * 点击了星期几，执行刷新数据
 * @param week
 */
function listSchedule(week) {
    addBtnClass(week);
    getList();
}

/**
 * 获取区组下拉列表
 */
function getRegionId(filter,formData) {
    var param = {
    };
    _ajax({
        type: "POST",
        url: $.config.services.schedule + "/bacPatientSchedule/getRegionId.do",
        data:param,  //必须字符串后台才能接收list,
        dataType: "json",
        success:function (res) {
            var util=layui.util;
            bacPatientScheduleList.currentDay=util.toDateString(new Date(res.ts),"yyyy-MM-dd");
            initWeek(new Date(res.ts));
        },
        done: function(data){
            var form=layui.form; //调用layui的form模块
            var htmlStr ='<option value="">全部</option>';
            $.each(data,function(i,item){
                htmlStr+='<option value="'+item.regionSettingId+'">'+item.regionName+'</option>';
            });
            $("select[name='regionId']").html(htmlStr);
            //刷新表单渲染
            form.render();
            //表单重新赋值
            form.val(filter, formData);
        }
    });
}

/**
 * 查询列表事件
 */
function getList(param) {
    if(isEmpty(param)){
        var scheduleShift =  $("select[name='scheduleShift']").val();
        var regionId =  $("select[name='regionId']").val();
        param = {
            "scheduleShift":scheduleShift,
            "regionId":regionId
        };
    }
    var week = $(".select-week-btn").attr("id");
    var day = getScheduleDate(week); //排班日期
    param.scheduleDate = day;

    _ajax({
        type: "POST",
        url: $.config.services.schedule + "/bacPatientSchedule/listPatientSchedule.do",
        dataType: "json",
        data:param,
        done:function(data){
            bacPatientScheduleList.list.clear();
            bacPatientScheduleList.list.pushArray(data);
            setShiftHeight();
            var week = $(".select-week-btn").attr("id");
            var day = getScheduleDate(week); //排班日期 yyyy-MM-dd
            //昨天的数据不显示删除按钮
            if(bacPatientScheduleList.currentDay > day){
                $('.layui-btn-del').hide();
            }
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(obj){
    var id = ""; //患者排班id
    var bedId = "";//床号
    var shift = "";//班次
    var regionId = "";//区组
    debugger
    if(isNotEmpty(obj)){
        id = $(obj).attr("scheduleId"); //获取选中行的数据
        bedId = $(obj).attr("bedId"); //获取选中行的数据
        shift = $(obj).attr("shift"); //获取选中行的数据
        regionId = $(obj).attr("regionId"); //获取选中行的数据
    }

    var week = $(".select-week-btn").attr("id");
    var day = getScheduleDate(week); //排班日期 yyyy-MM-dd
    //昨天的数据不能编辑
    if(bacPatientScheduleList.currentDay > day){
        return false;
    }

    // 床号也要传过去
    var url="";
    var title="";
    var btn = [];
    if(isEmpty(id)){  //id为空,新增操作
        //判断有无编辑权限
        if(!bacPatientScheduleList.baseFuncInfo.authorityTag('bacPatientScheduleList#add')){
            return false;
        }
        title="新增";
        url=$.config.server+"/backstage/bacPatientScheduleEdit?scheduleDate="+day+"&bedId="+bedId+"&shift="+shift+"&regionId="+regionId;
        btn = ["确定", "取消"];
    }else{  //编辑
        //判断有无编辑权限
        if(!bacPatientScheduleList.baseFuncInfo.authorityTag('bacPatientScheduleList#edit')){
            return false;
        }
        title="编辑";
        url=$.config.server+"/backstage/bacPatientScheduleEdit?id="+id+"&scheduleDate="+day;
        btn = ["确定", "取消", "删除"];
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:720, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:600,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        btn:btn,
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    //重新刷新table
                    getList();
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        },
        btn3:function(index, layero){
        //按钮【按钮三】删除的回调
            //判断有无编辑权限
            if(!bacPatientScheduleList.baseFuncInfo.authorityTag('bacPatientScheduleList#delete')){
                return false;
            }
            var iframeWin = window[layero.find('iframe')[0]['name']];//得到iframe页的窗口对象，执行iframe页的方法：
            var ids = iframeWin.del(
                function success() {
                    successToast("删除成功");
                    getList();
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
            return false;
        }
    });
}

/**
 * 复制排班
 */
function copySchedule() {
    var url=$.config.server + "/backstage/bacPatientScheduleCopy";
    var title="复制排班";
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:650, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:500,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("操作成功");
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
            return false;
        }
    });
}

/**
 * 保存模板
 */
function saveTemplate() {
    var week = $(".select-week-btn").attr("id");
    var copyDay = getScheduleDate(week); //排班日期 yyyy-MM-dd
    var url=$.config.server + "/backstage/bacScheduleTemplateEdit?copyDay="+copyDay;
    var title="保存模板";
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:550, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:500,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("操作成功");
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
            return false;
        }
    });
}

/**
 * 调出模板
 */
function pushTemplate() {
    var week = $(".select-week-btn").attr("id");
    var copyDay = getScheduleDate(week); //排班日期 yyyy-MM-dd
    var url=$.config.server + "/backstage/bacScheduleTemplateList?copyDay="+copyDay;
    var title="调出模板";
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:1800, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:1600,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        btn:[],
        done:function(index,iframeWin){
        },
        end:function (){
            getList();
        }
    });
}

/**
 * 弹窗班种管理页面
 */
function exportExcel(){
    var url="";
    var title="";
    var week = $(".select-week-btn").attr("id");
    var day = getScheduleDate(week); //排班日期 yyyy-MM-dd
    title="导出排班";
    url=$.config.server+"/backstage/bacPatientScheduleExcel?scheduleDate="+day;

    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:700,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        readonly:true,
        done:function(index,iframeWin){
        }
    });
}

/**
 * 按月预览
 */
function monthSchedule() {
    var url="";
    var title="";
    title="按月预览";
    url=$.config.server + "/backstage/bacPatientScheduleMonth";
    parent.layui.index.openTabsPage(url, title);//这里要注意的是parent的层级关系
}

/**
 * 排床查询
 */
function querySchedule() {
    var url="";
    var title="";
    title="排床查询";
    url=$.config.server + "/backstage/bacPatientScheduleQuery";
    parent.layui.index.openTabsPage(url,title);//这里要注意的是parent的层级关系
}

/**
 * 初始化时间周期
 */
function initWeek(date) {
    var firstDay = firstWeekDate(date);
    bacPatientScheduleList.currentMon = getDateTime(firstDay,0);
    setWeek();
    var week = date.getDay();
    addBtnClass(week);
    getList();  //查询列表
}

/**
 * 动态设置周期日期
 */
function setWeek() {
    var mon_index = bacPatientScheduleList.curWeekIndex * 7 + 0;
    var tue_index = bacPatientScheduleList.curWeekIndex * 7 + 1;
    var web_index = bacPatientScheduleList.curWeekIndex * 7 + 2;
    var thur_index = bacPatientScheduleList.curWeekIndex * 7 + 3;
    var fri_index = bacPatientScheduleList.curWeekIndex * 7 + 4;
    var sat_index = bacPatientScheduleList.curWeekIndex * 7 + 5;
    var sun_index = bacPatientScheduleList.curWeekIndex * 7 + 6;
    bacPatientScheduleList.mon = getDateTime(bacPatientScheduleList.currentMon,mon_index) + '<br>' + "星期一";
    bacPatientScheduleList.tue = getDateTime(bacPatientScheduleList.currentMon,tue_index) + '<br>' + "星期二";
    bacPatientScheduleList.web = getDateTime(bacPatientScheduleList.currentMon,web_index) + '<br>' + "星期三";
    bacPatientScheduleList.thur = getDateTime(bacPatientScheduleList.currentMon,thur_index) + '<br>' + "星期四";
    bacPatientScheduleList.fri = getDateTime(bacPatientScheduleList.currentMon,fri_index) + '<br>' + "星期五";
    bacPatientScheduleList.sat = getDateTime(bacPatientScheduleList.currentMon,sat_index) + '<br>' + "星期六";
    bacPatientScheduleList.sun = getDateTime(bacPatientScheduleList.currentMon,sun_index) + '<br>' + "星期日";
}

/**
 * 标志当前选中星期几
 * @param week
 */
function addBtnClass(week) {
    $("#weekBtn button").removeClass('select-week-btn');
    if(week == 0){
        $("#sun").addClass('select-week-btn');
    }
    if(week == 1){
        $("#mon").addClass('select-week-btn');
    }
    if(week == 2){
        $("#tue").addClass('select-week-btn');
    }
    if(week == 3){
        $("#web").addClass('select-week-btn');
    }
    if(week == 4){
        $("#thur").addClass('select-week-btn');
    }
    if(week == 5){
        $("#fri").addClass('select-week-btn');
    }
    if(week == 6){
        $("#sat").addClass('select-week-btn');
    }
}

/**
 * 删除事件
 * @param id
 */
function del(id){
    var param={
        "id":id
    };
    _ajax({
        type: "POST",
        url: $.config.services.schedule + "/bacPatientSchedule/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            getList();
        }
    });
}

/**
 * 批量删除
 */
function batchDel(obj){
    //判断有无编辑权限
    if(!bacPatientScheduleList.baseFuncInfo.authorityTag('bacPatientScheduleList#delete')){
        return false;
    }
    var patientScheduleId = $(obj).attr("scheduleId"); //获取选中行的数据
    if(isEmpty(patientScheduleId)){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            del(patientScheduleId);
        });
    }
}

/**
 * 获取n天后的yyyy-MM-dd 字符串
 * @param mon_date
 * @param AddDayCount 多少天后
 * @returns {string}
 * @constructor
 */
function getDateTime(mon_date,AddDayCount) {
    var date = new Date(mon_date);
    date.setDate(date.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var year = date.getFullYear();
    var month =(date.getMonth() + 1).toString();
    var day = (date.getDate()).toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    var dateTime = year + "-" + month + "-" + day;
    return dateTime;
}

/**
 * 当前周的星期一
 * @param today Date类型
 * @returns {string}
 */
function firstWeekDate(today){
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
    return start;

}

/**
 * 根据星期几获取排班日期
 */
function getScheduleDate(week) {
    if(week == "mon"){
        return bacPatientScheduleList.mon.substr(0,10);
    }
    if(week == "tue"){
        return bacPatientScheduleList.tue.substr(0,10);
    }
    if(week == "web"){
        return bacPatientScheduleList.web.substr(0,10);
    }
    if(week == "thur"){
        return bacPatientScheduleList.thur.substr(0,10);
    }
    if(week == "fri"){
        return bacPatientScheduleList.fri.substr(0,10);
    }
    if(week == "sat"){
        return bacPatientScheduleList.sat.substr(0,10);
    }
    if(week == "sun"){
        return bacPatientScheduleList.sun.substr(0,10);
    }
}