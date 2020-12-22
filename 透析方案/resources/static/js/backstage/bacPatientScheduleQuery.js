/**
 * bacPatientScheduleQuery.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 患者排班排床查询页面
 * @Author xcj
 * @version: 1.0
 * @Date 2020/8/27
 */
var bacPatientScheduleQuery = avalon.define({
    $id: "bacPatientScheduleQuery",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    list:[],//排班列表
    month:'',//月份显示
    curMonthIndex:0,//相对当前周的第几周，-1是上一周，0是当前周，1是下一周
    patientList: {  // 患者列表
        data: [], // 显示患者列表数据
        errorMsg: '',
        list:[],//患者列表数据
    },
    currentPatientId:'',//选中的患者id
    lastTime:0,//比较输入时间
    searchStr:'',//查询的数据

});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        getPatientList();
        avalon.scan();
    });
});

/**
 * 上一月
 */
function lastMonth() {
    if(isEmpty(bacPatientScheduleQuery.currentPatientId)){
        warningToast("请选择患者！");
        return false;
    }
    bacPatientScheduleQuery.curMonthIndex = bacPatientScheduleQuery.curMonthIndex - 1;
    getList(bacPatientScheduleQuery.currentPatientId);
}

/**
 * 下一月
 */
function nextMonth() {
    if(isEmpty(bacPatientScheduleQuery.currentPatientId)){
        warningToast("请选择患者！");
        return false;
    }
    bacPatientScheduleQuery.curMonthIndex = bacPatientScheduleQuery.curMonthIndex + 1;
    getList(bacPatientScheduleQuery.currentPatientId);
}


/**
 * 查询列表事件
 */
function getList(patientId) {
    var param = {
        "patientId":patientId,
        "monthIndex":bacPatientScheduleQuery.curMonthIndex
    };
    _ajax({
        type: "POST",
        url: $.config.services.schedule + "/bacPatientSchedule/listPatientScheduleQuery.do",
        dataType: "json",
        data:param,
        done:function(data){
            bacPatientScheduleQuery.month = data.month;
            var list = data.sevenList;
            bacPatientScheduleQuery.list.clear();
            bacPatientScheduleQuery.list.pushArray(list);

            //获取上午、下午、晚上的右侧数据div
            var trs = $("tbody tr");
            //获取上午、下午、晚上的div
            for(var i=0;i<trs.length;i++){
                var parentHeight = trs[i].offsetHeight;
                $(trs[i]).find("td").css("height",parentHeight);
            }
        }
    });
}



/**
 * 获取单个实体
 */
function saveOrEdit(obj){
    var day = "";
    var patientScheduleId = "";
    if(isNotEmpty(obj)){
        day = $(obj).attr("day"); //获取选中行的数据
        patientScheduleId = $(obj).attr("patientScheduleId"); //获取选中行的数据
    }
    if(isEmpty(day)){
        return false;
    }

    debugger

    var url="";
    var title="";
    var btn = [];
    if(isEmpty(patientScheduleId)){  //id为空,新增操作
        //判断有无编辑权限
        if(!bacPatientScheduleQuery.baseFuncInfo.authorityTag('bacPatientScheduleList#add')){
            return false;
        }
        title="新增";
        url=$.config.server+"/backstage/bacPatientScheduleEdit?scheduleDate="+day+"&patientId="+bacPatientScheduleQuery.currentPatientId;
        btn = ["确定", "取消"];
    }else{  //编辑
        //判断有无编辑权限
        if(!bacPatientScheduleQuery.baseFuncInfo.authorityTag('bacPatientScheduleList#edit')){
            return false;
        }
        title="编辑";
        url=$.config.server+"/backstage/bacPatientScheduleEdit?id="+patientScheduleId+"&scheduleDate="+day;
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
                    if(isEmpty(bacPatientScheduleQuery.currentPatientId)){
                        warningToast("请选择患者！");
                        return false;
                    }
                    getList(bacPatientScheduleQuery.currentPatientId);
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        },
        btn3:function(index, layero){
            //按钮【按钮三】删除的回调
            if(!bacPatientScheduleQuery.baseFuncInfo.authorityTag('bacPatientScheduleList#delete')){
                return false;
            }
            var iframeWin = window[layero.find('iframe')[0]['name']];//得到iframe页的窗口对象，执行iframe页的方法：
            var ids = iframeWin.del(
                function success() {
                    successToast("删除成功");
                    if(isEmpty(bacPatientScheduleQuery.currentPatientId)){
                        warningToast("请选择患者！");
                        return false;
                    }
                    getList(bacPatientScheduleQuery.currentPatientId);
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
            return false;
        }
    });
}


/**
 * 查询患者列表事件
 * @param field
 */
function getPatientList() {
    var param = {};
    _ajax({
        type: "POST",
        url: $.config.services.schedule + "/bacPatientSchedule/listPatientInfo.do",
        data: param,
        dataType: "json",
        done: function(data) {
            if (data != null && data.length > 0) {
                $.each(data, function(index, item) {
                    data[index].age = Age(item.birthday);
                    data[index].gerder = getSysDictName("Sex", item.gender);
                });
                bacPatientScheduleQuery.patientList.data.pushArray(data);
                bacPatientScheduleQuery.patientList.list.pushArray(data);

                bacPatientScheduleQuery.patientList.errorMsg = "";

                // 设置默认选中患者（若没有则默认选中第一笔）
                var selectedPatientId = bacPatientScheduleQuery.currentPatientId;
                if (isEmpty(selectedPatientId) && bacPatientScheduleQuery.patientList.data.length > 0) {
                    selectedPatientId = bacPatientScheduleQuery.patientList.data[0].patientId;
                }
                $(".patient-search-dropdown-item[data-patient-id='" + selectedPatientId + "']").trigger("click");
                // 滚动定位至选中元素
                //var scrollTop = $(".patient-search-layout .layui-side-scroll .patient-search-dropdown-item.selected").position().top;
                //$(".patient-search-layout .layui-side-scroll").scrollTop(scrollTop);
            } else {
                bacPatientScheduleQuery.patientList.data = [];
                bacPatientScheduleQuery.patientList.list = [];
                bacPatientScheduleQuery.patientList.errorMsg = "查无数据";
            }
        },
        error: function (error) {
            var res = error.responseJSON || {};
            var status = error.status;
            bacPatientScheduleQuery.patientList.data = [];
            bacPatientScheduleQuery.patientList.list = [];
            bacPatientScheduleQuery.patientList.errorMsg = getRequestErrorMsg(res, status);
        }
    });
}

/**
 * 患者列表搜索事件
 */
$('#patientName').on('keyup', function (event) {
    bacPatientScheduleQuery.searchStr = $(this).val();
    bacPatientScheduleQuery.lastTime = event.timeStamp;
    setTimeout(function () {
        //如果时间差为0，也就是你停止输入1s之内都没有其它的keyup事件产生，这个时候就可以去请求服务器了
        if (bacPatientScheduleQuery.lastTime - event.timeStamp == 0) {
            bacPatientScheduleQuery.patientList.data.clear();
            if(isNotEmpty(bacPatientScheduleQuery.searchStr)){
                $.each(bacPatientScheduleQuery.patientList.list, function(index, item) {
                    if(item.patientRecordNo.indexOf(bacPatientScheduleQuery.searchStr) != -1
                        || item.patientName.indexOf(bacPatientScheduleQuery.searchStr) != -1){
                        bacPatientScheduleQuery.patientList.data.push(item);
                    }
                });
            }else {
                $.each(bacPatientScheduleQuery.patientList.list, function(index, item) {
                    bacPatientScheduleQuery.patientList.data.push(item);
                });
            }
        }
    }, 1000);
});


/**
 * 选中患者信息时，更新患者排班
 * @param obj
 */
function onSelectedPatientInfo(obj) {
    var dropdownItemObj = $(obj);
    // 设置患者列表项选中样式
    $(".patient-search-dropdown-item").removeClass("selected");
    dropdownItemObj.addClass("selected");
    // 更新当前患者概览信息
    bacPatientScheduleQuery.currentPatientId = dropdownItemObj.attr("data-patient-id");
    // 更新患者排班
    getList(bacPatientScheduleQuery.currentPatientId);

}

function Age(dateTime) {
    var aDate = new Date();
    var thisYear = aDate.getFullYear();
    var bDate = new Date(dateTime);
    var brith = bDate.getFullYear();
    var age = (thisYear - brith);
    return age;
}

