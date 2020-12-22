/**
 * bacScheduleDetailList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 患者排班模板明细表
 * @Author xcj
 * @version: 1.0
 * @Date 2020/11/28
 */
var bacScheduleDetailList = avalon.define({
    $id: "bacScheduleDetailList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    scheduleTemplateId:'',//模板id
    type:$.constant.TemplateType,
    templateType:'',//周期类型
    list:[],//排班列表
    mon:'',
    tue:'',
    web:'',
    thur:'',
    fri:'',
    sat:'',
    sun:'',
    currentMon:'',//当前周的星期一
    scheduleDate:null,
    errorMsg:'',
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        bacScheduleDetailList.scheduleTemplateId = GetQueryString("scheduleTemplateId");  //接收变量
        bacScheduleDetailList.templateType = GetQueryString("templateType");  //接收变量
        if(isEmpty(bacScheduleDetailList.scheduleTemplateId)){
            warningToast("请选择排班模板");
            return false;
        }
        initSearch(); //初始化搜索框
        getList();
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#bacScheduleDetailList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacScheduleDetailList_search'  //指定的lay-filter
        ,conds:[
            ,{field: 'scheduleShift', title: '班次',type:'select',data:getSysDictByCode("Shift",true)} //加载数据字典}
            ,{field: 'regionId',type:'select',title: '区组'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            getRegionId(filter,data);//项目下拉框
            debugger
            if(bacScheduleDetailList.templateType == $.constant.TemplateType.SHIFT){
                $("select[name='scheduleShift']").attr("disabled","disabled");
            }
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
    if(bacScheduleDetailList.templateType == $.constant.TemplateType.WEEK){
        var week = $(".select-week-btn").attr("id");
        var day = getScheduleDate(week); //排班日期
        param.scheduleDate = day;
    }
    debugger
    param.scheduleTemplateId = bacScheduleDetailList.scheduleTemplateId;
    param.templateType = bacScheduleDetailList.templateType;
    _ajax({
        type: "POST",
        url: $.config.services.schedule + "/bacScheduleDetail/list.do",
        dataType: "json",
        data:param,
        done:function(data){
            if(data!=null){
                bacScheduleDetailList.list.clear();
                bacScheduleDetailList.list.pushArray(data.list);
                debugger
                var util=layui.util;
                bacScheduleDetailList.scheduleDate = util.toDateString(data.scheduleDate,"yyyy-MM-dd");
                setShiftHeight();
                //周需要加日期
                if(bacScheduleDetailList.templateType == $.constant.TemplateType.WEEK){
                    initWeek(new Date(data.scheduleDate));
                }
                bacScheduleDetailList.errorMsg = "";
            }else {
                bacScheduleDetailList.errorMsg = "无数据";
            }
        }
    });
}


/**
 * 获取单个实体
 */
function saveOrEdit(obj){
    if(isEmpty(obj)){
        warningToast("请选择排班");
        return false;
    }
    var id = $(obj).attr("scheduleId"); //患者排班id
    var bedId = $(obj).attr("bedId"); //床号
    var shift = $(obj).attr("shift"); //班次
    var regionId = $(obj).attr("regionId"); //区组
    var day = "";
    debugger
    //不是周期需要获取日期
    if(bacScheduleDetailList.templateType != $.constant.TemplateType.WEEK){
        day = bacScheduleDetailList.scheduleDate;
    }else {
        var week = $(".select-week-btn").attr("id");
        day = getScheduleDate(week); //排班日期 yyyy-MM-dd
    }

    // 床号也要传过去
    var url="";
    var title="";
    var btn = [];
    //判断有无编辑权限
    if(!bacScheduleDetailList.baseFuncInfo.authorityTag('bacScheduleDetail#edit')){
        return false;
    }
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server+"/backstage/bacScheduleDetailEdit?scheduleDate="+day+"&bedId="+bedId+"&shift="+shift
            +"&regionId="+regionId+"&scheduleTemplateId="+bacScheduleDetailList.scheduleTemplateId;
        btn = ["确定", "取消"];
    }else{  //编辑
        title="编辑";
        url=$.config.server+"/backstage/bacScheduleDetailEdit?id="+id+"&scheduleDate="+day+"&scheduleTemplateId="+bacScheduleDetailList.scheduleTemplateId;
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
            if(!bacScheduleDetailList.baseFuncInfo.authorityTag('bacScheduleDetailList#del')){
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
 * 删除事件
 * @param id
 */
function del(id){
    var param={
        "id":id
    };
    debugger
    _ajax({
        type: "POST",
        url: $.config.services.schedule + "/bacScheduleDetail/delete.do",
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
    if(!bacScheduleDetailList.baseFuncInfo.authorityTag('bacScheduleDetailList#del')){
        return false;
    }
    var detailId = $(obj).attr("scheduleId"); //获取选中行的数据
    if(isEmpty(detailId)){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            del(detailId);
        });
    }
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
 * 初始化时间周期
 */
function initWeek(date) {
    debugger
    var firstDay = firstWeekDate(date);
    bacScheduleDetailList.currentMon = getDateTime(firstDay,0);
    setWeek();
    var week = date.getDay();
    addBtnClass(week);
}

/**
 * 动态设置周期日期
 */
function setWeek() {
    var mon_index = 0;
    var tue_index = 1;
    var web_index = 2;
    var thur_index = 3;
    var fri_index = 4;
    var sat_index = 5;
    var sun_index = 6;
    bacScheduleDetailList.mon = getDateTime(bacScheduleDetailList.currentMon,mon_index) + '<br>' + "星期一";
    bacScheduleDetailList.tue = getDateTime(bacScheduleDetailList.currentMon,tue_index) + '<br>' + "星期二";
    bacScheduleDetailList.web = getDateTime(bacScheduleDetailList.currentMon,web_index) + '<br>' + "星期三";
    bacScheduleDetailList.thur = getDateTime(bacScheduleDetailList.currentMon,thur_index) + '<br>' + "星期四";
    bacScheduleDetailList.fri = getDateTime(bacScheduleDetailList.currentMon,fri_index) + '<br>' + "星期五";
    bacScheduleDetailList.sat = getDateTime(bacScheduleDetailList.currentMon,sat_index) + '<br>' + "星期六";
    bacScheduleDetailList.sun = getDateTime(bacScheduleDetailList.currentMon,sun_index) + '<br>' + "星期日";
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
 * 根据星期几获取排班日期
 */
function getScheduleDate(week) {
    if(week == "mon"){
        return bacScheduleDetailList.mon.substr(0,10);
    }
    if(week == "tue"){
        return bacScheduleDetailList.tue.substr(0,10);
    }
    if(week == "web"){
        return bacScheduleDetailList.web.substr(0,10);
    }
    if(week == "thur"){
        return bacScheduleDetailList.thur.substr(0,10);
    }
    if(week == "fri"){
        return bacScheduleDetailList.fri.substr(0,10);
    }
    if(week == "sat"){
        return bacScheduleDetailList.sat.substr(0,10);
    }
    if(week == "sun"){
        return bacScheduleDetailList.sun.substr(0,10);
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