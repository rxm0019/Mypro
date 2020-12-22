/**
 * bacClassDutyNurseList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 护士排班主页面
 * @Author xcj
 * @version: 1.0
 * @Date 2020/8/12
 */
var bacClassDutyNurseList = avalon.define({
    $id: "bacClassDutyNurseList",
    baseFuncInfo: baseFuncInfo//底层基本方法
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList();  //查询列表
        getManageList();
        avalon.scan();
    });
});
/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#bacClassDutyNurseList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacClassDutyNurseList_search'  //指定的lay-filter
        ,conds:[
            {field: 'userName', title: '姓名：',type:'input'}
            ,{field: 'dutyDate', title: '值班日期：',type:'date',format:'yyyy-MM-dd~yyyy-MM-dd',done: function(value, date, endDate){
                if(value!="" && value.length>0){
                    var today=new Date(value.substring(0,10));
                    var duty_date = newDate(today);
                    $("#dutyDate").val(duty_date);
                }else {
                    var date=new Date();
                    var duty_date = newDate(date);
                    $("#dutyDate").val(duty_date);
                }
            }}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //时间选择器
            var date=new Date();
            var duty_date = newDate(date);
            $("#dutyDate").val(duty_date);
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
    if(isEmpty(param)){
        param = {
        };
    }
    var date_begin = $("input[name='dutyDate']").val();
    if(isEmpty(date_begin)){
        var date=new Date();
        date_begin =  newDate(date);
    }
    var split_date = date_begin.split('~');
    var mon_date = split_date[0];
    if(mon_date!="" && mon_date.length>0){
        // 转换日期bai格式
        mon_date = mon_date.replace(/-/g,'/'); // "2010/08/01";
    }else{
        warningToast("请选择日期");
        return false;
    }
    var columnList = [
        {type: 'numbers', title: '序号',width:60 }  //序号
        ,{field: 'userName', title: '姓名',align: 'center'}
    ];

    var mon = "星期一 "+GetDateStr(mon_date,0);
    var edit1 ="edit1" + GetDateTimeStr(mon_date,0);
    columnList.push({field: "mon", title: mon, event: edit1,align: 'center',style:'cursor: pointer;',templet: function(d){
        var arrs = d.mon.split(';');
        return arrs[0];
    }});
    var tue = "星期二 "+GetDateStr(mon_date,1);
    var edit2 ="edit2" + GetDateTimeStr(mon_date,1);
    columnList.push({field: "tue", title: tue, event: edit2,align: 'center',style:'cursor: pointer;',templet: function(d){
        var arrs = d.tue.split(';');
        return arrs[0];
    }});
    var web = "星期三 "+GetDateStr(mon_date,2);
    var edit3 ="edit3" + GetDateTimeStr(mon_date,2);
    columnList.push({field: "web", title: web, event: edit3,align: 'center',style:'cursor: pointer;',templet: function(d){
        var arrs = d.web.split(';');
        return arrs[0];
    }});
    var thur = "星期四 "+GetDateStr(mon_date,3);
    var edit4 ="edit4" + GetDateTimeStr(mon_date,3);
    columnList.push({field: "thur", title: thur, event: edit4,align: 'center',style:'cursor: pointer;',templet: function(d){
        var arrs = d.thur.split(';');
        return arrs[0];
    }});
    var fri = "星期五 "+GetDateStr(mon_date,4);
    var edit5 ="edit5" + GetDateTimeStr(mon_date,4);
    columnList.push({field: "fri", title: fri, event: edit5,align: 'center',style:'cursor: pointer;',templet: function(d){
        var arrs = d.fri.split(';');
        return arrs[0];
    }});
    var sat = "星期六 "+GetDateStr(mon_date,5);
    var edit6 ="edit6" + GetDateTimeStr(mon_date,5);
    columnList.push({field: "sat", title: sat, event: edit6,align: 'center',style:'cursor: pointer;',templet: function(d){
        var arrs = d.sat.split(';');
        return arrs[0];
    }});
    var sun = "星期日 "+GetDateStr(mon_date,6);
    var edit7 ="edit7" + GetDateTimeStr(mon_date,6);
    columnList.push({field: "sun", title: sun, event: edit7,align: 'center',style:'cursor: pointer;',templet: function(d){
        var arrs = d.sun.split(';');
        return arrs[0];
    }});

    var startTime = split_date[0];
    var endTime = split_date[1];
    param.dutyDate_begin=util.toDateString(startTime,"yyyy-MM-dd");
    param.dutyDate_end=util.toDateString(endTime,"yyyy-MM-dd");
    param.dutyDate = "";
    _layuiTable({
        elem: '#bacClassDutyNurseList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacClassDutyNurseList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-145', //table的高度，页面最大高度减去差值
            url: $.config.services.schedule + "/bacClassDuty/listDutyNurse.do", // ajax的url必须加上$.config.services.schedule方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [columnList],
            done:function () {
                $("[lay-id='bacClassDutyNurseList_table'] .layui-table-cell").css({ 'height': 'auto','text-align': 'center','line-height': '25px'})
            }
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent.indexOf('edit')>-1){ //编辑
                //do something
                var editDate = layEvent.replace(/edit/g,"");
                var index = editDate.substr(0,1);
                var dutyDate = editDate.substr(1);
                if(index == "1"){
                    var arrs = data.mon.split(';');
                }
                if(index == "2"){
                    var arrs = data.tue.split(';');
                }
                if(index == "3"){
                    var arrs = data.web.split(';');
                }
                if(index == "4"){
                    var arrs = data.thur.split(';');
                }
                if(index == "5"){
                    var arrs = data.fri.split(';');
                }
                if(index == "6"){
                    var arrs = data.sat.split(';');
                }
                if(index == "7"){
                    var arrs = data.sun.split(';');
                }
                var date = new Date();
                date.setDate(date.getDate()-3);//超过3天不能修改
                var comareDay = util.toDateString(date,"yyyy-MM-dd");
                if(comareDay>dutyDate){
                    warningToast("日期已过3天，不能修改排班！");
                    return false;
                }else {
                    if (arrs.length > 1) {
                        var classManageId = arrs[1];
                        var bedId = arrs[2];
                        dutyEdit(data.userId, data.userName, classManageId, dutyDate, "0", bedId)
                    } else {
                        dutyEdit(data.userId, data.userName, classManageId, dutyDate, "1", null)
                    }
                }
            }
        }
    });
}


/**
 * 查询列表事件
 */
function getManageList() {
    var param = {
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    param.manageType = "1";
    _layuiTable({
        elem: '#bacClassManageDoctorList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacClassManageDoctorList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-145', //table的高度，页面最大高度减去差值
            url: $.config.services.schedule + "/bacClassManage/listManageNurse.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false, //开启分页
            cols: [[ //表头
                {field: 'className', title: '班种名称',templet: function(d){
                    if(d.classAttr == '2' || d.classAttr == '0'){
                        return '<span style="width: 20px;">名称：'+d.className+'</span>';
                    }else{
                        return '<span style="width: 20px;">名称：'+d.className+'</span>' + '<br>'
                            + '<span style="width: 20px;">时间：'+d.classPart.replace(/,/gmi, ' ; ')+'</span>' ;
                    }
                }}
            ]],
            done:function () {
                $("[lay-id='bacClassManageDoctorList_table'] .layui-table-body .layui-table-cell").css({ 'height': 'auto','text-align': 'left'})
            }
        }
    });
}


/**
 * 弹窗班种管理页面
 */
function classManage(){
    var url="";
    var title="";
    title="班种管理";
    url=$.config.server+"/backstage/bacClassManageNurseList";
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:800,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        readonly:true,
        done:function(index,iframeWin){
        },
        end: function(){
            var table = layui.table; //获取layui的table模块
            table.reload('bacClassDutyNurseList_table'); //重新刷新table
            table.reload('bacClassManageDoctorList_table'); //重新刷新table
        }
    });
}

/**
 * 弹窗值班模板管理
 */
function classTemplate() {
    var url="";
    var title="";
    title="值班模板管理";
    url=$.config.server+"/backstage/bacClassTemplateNurseList";
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:1600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:900,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        readonly:true,
        done:function(index,iframeWin){
        },
        end: function(){
            var table = layui.table; //获取layui的table模块
            table.reload('bacClassDutyNurseList_table'); //重新刷新table
            table.reload('bacClassManageDoctorList_table'); //重新刷新table
        }
    });
}

/**
 * 工时管理页面
 */
function workingHours() {
    var url="";
    var title="";
    title="工时管理";
    url=$.config.server+"/backstage/bacWorkingHoursEdit";
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:1000, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:600,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 编辑排班
 * @param userId
 * @param userName
 * @param classManageId
 * @param dutyDate
 * @param dutyDate
 */
function dutyEdit(userId,userName,classManageId,dutyDate,editType,bedId) {
    var url="";
    var title="";
    title="编辑排班";
    //无权限
    if(!bacClassDutyNurseList.baseFuncInfo.authorityTag('nurseDutyEdit#edit')){
        return;
    }
    url=$.config.server+"/backstage/nurseDutyEdit?userId="+userId+"&userName="+userName+"&classManageId="+classManageId
        +"&dutyDate="+dutyDate+"&editType="+editType+"&bedId="+bedId;
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:500, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:550,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
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
                    table.reload('bacClassDutyNurseList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 弹窗护士考勤统计报表
 */
function classDuty() {
    var url="";
    var title="";

    title="考勤统计";
    url=$.config.server+"/backstage/bacClassDutyNurseReport";

    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:1600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:900,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        readonly:true,
        done:function(index,iframeWin){
        }
    });
}

/**
 * 导出excel
 */
function exportExcel() {
    var data = getSearchParam();
    if(isEmpty(data.dutyDate_begin) || isEmpty(data.dutyDate_end)){
        warningToast("请选择日期");
        return false;
    }
    var name = "护士排班表_" + data.dutyDate_begin + "-" + data.dutyDate_end + ".xlsx";
    _downloadFile({
        url: $.config.services.schedule + "/bacClassDuty/exportDutyNurse.do",
        data:data,
        fileName: name
    });
}

/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var searchParam = layui.form.val("bacClassDutyNurseList_search");
    if(isEmpty(searchParam.dutyDate_begin)){
        var util=layui.util;
        var date_begin = $("input[name='dutyDate']").val();
        var split_date = date_begin.split('~');
        var startTime = split_date[0];
        var endTime = split_date[1];
        searchParam.dutyDate_begin=util.toDateString(startTime,"yyyy-MM-dd");
        searchParam.dutyDate_end=util.toDateString(endTime,"yyyy-MM-dd");
    }
    searchParam.dutyDate = "";
    return $.extend({
    }, searchParam)
}



function newDate(today){
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

function GetDateStr(mon_date,AddDayCount) {
    var date = new Date(mon_date);
    date.setDate(date.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var m = (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);//获取当前月份的日期，不足10补0
    var d = date.getDate()<10?"0"+date.getDate():date.getDate();//获取当前几号，不足10补0
    return m+"/"+d;
}

function GetDateTimeStr(mon_date,AddDayCount) {
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