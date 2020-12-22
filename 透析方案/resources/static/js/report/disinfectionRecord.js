/**
 * disinfectionRecord.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 */
/* 消毒记录js
* @Author wahmh
* @Date 2020-10-30
* @version 1.0
* */
var disinfectionRecord = avalon.define({
    $id: "disinfectionRecord",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    currentSelect: 'disinfectionMachine',//当前选中的tab选项 默认透析机消毒
    regionDisinfectTypeRay: getSysDictName("regionDisinfectType", $.constant.RegionDisinfectionType.AIR),//空气消毒
    regionDisinfectTypeAir: getSysDictName("regionDisinfectType", $.constant.RegionDisinfectionType.RAY),//紫外线消毒
    serializerTypeNameOfRay: getSysDictName("sterilizeDeviceType", $.constant.DeviceDisinfectionType.RAY),//紫外线消毒灯
    serializerTypeNameOfAir: getSysDictName("sterilizeDeviceType", $.constant.DeviceDisinfectionType.AIR)//空气消毒机

});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var laydate = layui.laydate;
        var util = layui.util;
        laydate.render({
            elem: "#sterilizeDate_begin"
            , type: 'date'
            , trigger: 'click',
            format:"yyyy-MM-dd"
        });
        laydate.render({
            elem: "#sterilizeDate_end"
            , type: 'date'
            , trigger: 'click'
            // , value: new Date()
            // , done: function (value, date) {
            //     disinfectionRecord.sterilizeDate_end = isNotEmpty(value) ? (value + ' 23:59:59') : value;
            // }
        });
        initTable();
        getHospitalAndUser();//获取区名
        avalon.scan();
    });
});

/**
 * 导出excel
 */
function onExportExcel() {
    var hospitalNo = $("select[name='regionId']").val();
    var param = {
        sterilizeDate_begin: $("#sterilizeDate_begin").val(),
        sterilizeDate_end: $("#sterilizeDate_end").val(),
        hospitalNo: hospitalNo
    };
    var url = "";
    var title = "";
    switch (disinfectionRecord.currentSelect) {
        case "disinfectionMachine":
            //透析机消毒
            url = $.config.services.dialysis + "/patReport/exportDisinfectionMachine.do";    //导出透析机消毒记录列表
            title = "透析机消毒记录.xlsx";
        /**
         * 导出透析机消毒记录excel
         */
            _downloadFile({
                url:url,
                data: {sterilizeDateBegin:$("#sterilizeDate_begin").val(),sterilizeDateEnd:$("#sterilizeDate_end").val(), hospitalNo: hospitalNo},
                fileName: title
            });
            break;
        case "disinfectionAir":
            //空气消毒
            url = $.config.services.dialysis + "/patReport/exportDisinfectionAir.do";     //导出空气消毒记录列表
            title = "空气消毒记录.xlsx";
            param['sterilizeType']=$.constant.RegionDisinfectionType.AIR;
            _downloadFile({
                url: url,
                data: param,
                fileName: title,
                ids:[]
            });
            break;
        case "disinfectionRay":
            //紫外线消毒
            url = $.config.services.dialysis + "/patReport/exportDisinfectionRay.do";   //导出紫外线消毒记录列表
            title = "紫外线消毒记录.xlsx";
            param['sterilizeType']=$.constant.RegionDisinfectionType.RAY
            _downloadFile({
                url: url,
                data: param,
                fileName: title
            });
            break;
    }
}

/*
* 初始化tab选项
* */
layui.use('element', function () {
    var element = layui.element;
    element.tabChange('disinfectionRecordTab', 'disinfectionMachine');
    element.on('tab(disinfectionRecordTab)', function (data) {
    })
});
/**
 * 监听tab点击
 */
layui.use('element', function () {
    var element = layui.element;
    //监听Tab切换，以改变地址hash值
    element.on('tab(disinfectionRecordTab)', function () {
        var tabId = this.getAttribute('lay-id');   //获取选项卡的lay-id
        disinfectionRecord.currentSelect = tabId;//修改当前的tab选中项
    })
})

/**
 * 获取区名
 */
function getHospitalAndUser() {
    var param = {
        userType: $.constant.userType.nurse
    }
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patReport/listHospitalAndUser.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    $("#regionId").append("  <option value=" + data[i].hospitalNo + ">" + data[i].hospitalName + "</option>")
                }
                var form = layui.form;
                //刷新表单渲染
                form.render();
            }
        }
    });
}
/**初始化表格数据**/
function initTable() {
    var hospitalNo = $("select[name='regionId']").val();
    var util=layui.util;
    //透析机消毒表格
    _layuiTable({
        elem: '#disinfectionMachine_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'disinfectionMachine_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-85',
            url: $.config.services.dialysis + "/patReport/getDisinfectionMachineList.do", // ajax的url必须加上getRootPath()方法
            where: {
                "hospitalNo": hospitalNo,
                "sterilizeDateBegin": $("#sterilizeDate_begin").val(),
                "sterilizeDateEnd": $("#sterilizeDate_end").val()
            }, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号', width: 60}  //序号
                , {
                    field: 'startTime', title: '消毒日期', align: 'center', minWidth: 105
                    , templet: function (d) {
                        return util.toDateString(d.startTime, "yyyy-MM-dd");
                    }
                }
                , {
                    field: 'scheduleShift', title: '班次', align: 'center'
                    , templet: function (d) {
                        return getSysDictName("Shift", d.scheduleShift);
                    }
                }
                , {field: 'regionName', title: '区域', align: 'center', minWidth: 110}
                , {field: 'bedNo', title: '床号', align: 'center'}
                , {field: 'codeNo', title: '透析机编号', align: 'center', minWidth: 115}
                , {
                    field: 'infectionMark', title: '感染标志', align: 'left', minWidth: 110
                    , templet: function (d) {
                        return getSysDictNameList("InfectionMark", d.infectionMark);
                    }
                }
                , {
                    field: 'startTime', title: '开始时间', align: 'center', minWidth: 92
                    , templet: function (d) {
                        return util.toDateString(d.startTime, "HH:mm");
                    }
                }
                , {
                    field: 'endTime', title: '结束时间', align: 'center', minWidth: 92
                    , templet: function (d) {
                        return util.toDateString(d.endTime, "HH:mm");
                    }
                }
                , {
                    field: 'disinfectHour', title: '消毒时长', align: 'center', minWidth: 135
                    , templet: function (d) {
                        return changeTime(d.disinfectHour, d.disinfectMin);
                    }
                }
                , {
                    field: 'disinfectOrder', title: '消毒程序', align: 'center', minWidth: 135
                    , templet: function (d) {
                        return getSysDictName("DisinfectOrder", d.scheduleShift);
                    }
                }
                , {
                    field: 'sheetChange', title: '床单更换', align: 'center', minWidth: 95
                    , templet: function (d) {
                        return getSysDictName("SheetChange", d.sheetChange);
                    }
                }
                , {
                    field: 'disinfectSurface', title: '表面消毒方式', align: 'left', minWidth: 105
                    , templet: function (d) {
                        return getSysDictName("DisinfectSurface", d.disinfectSurface);
                    }
                }
                , {field: 'userName', title: '操作者', align: 'center', minWidth: 95}
            ]]
        }
    });
    //空气消毒表格
    _layuiTable({
        elem: '#disinfectionAir_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'disinfectionAir_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-85',
            url: $.config.services.dialysis + "/patReport/getDisinfectionAirList.do", // ajax的url必须加上getRootPath()方法
            where: {
                "hospitalNo": hospitalNo,
                "sterilizeDate_begin": $("#sterilizeDate_begin").val(),
                "sterilizeDate_end": $("#sterilizeDate_end").val(),
                "sterilizeType": $.constant.RegionDisinfectionType.AIR
            }, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号', width: 60, rowspan: 2}  //序号
                , {field: 'areaName', title: '消毒区域', align: 'center', rowspan: 2}
                , {
                    field: 'sterilizeType',
                    title: disinfectionRecord.serializerTypeNameOfAir,
                    align: 'center',
                    colspan: 2
                }
                , {
                    field: 'startSterilizeTime', title: '消毒开始时间', align: 'center', rowspan: 2
                    , templet: function (d) {
                        if (d.startSterilizeTime != null && d.startSterilizeTime != "") {
                            return util.toDateString(d.startSterilizeTime, 'HH:mm:ss');
                        } else {
                            return "";
                        }
                    }
                }
                , {
                    field: 'endSterilizeTime', title: '消毒结束时间', align: 'center', rowspan: 2
                    , templet: function (d) {
                        if (d.endSterilizeTime != null && d.endSterilizeTime != "") {
                            return util.toDateString(d.endSterilizeTime, 'HH:mm:ss');
                        } else {
                            return "";
                        }
                    }
                }
                , {field: 'sterilizeUser', title: '消毒人', align: 'center', rowspan: 2}
                , {
                    field: 'sterilizeDate', title: '消毒日期', align: 'center', rowspan: 2
                    , templet: function (d) {
                        return util.toDateString(d.sterilizeDate, "yyyy-MM-dd");
                    }
                }
                , {field: 'remarks', title: '备注', rowspan: 2}
            ], [
                {
                    field: 'bacDevices', title: '设备编号', align: 'center', templet: function (d) {
                        return randerDevices(d.bacDevices, "code");
                    }
                }
                , {
                    field: 'bacDevices', title: '设备名称', align: 'center', templet: function (d) {
                        return randerDevices(d.bacDevices, "name");
                    }
                }
            ]]
        },
    });
    //紫外线消毒表格
    _layuiTable({
        elem: '#disinfectionRay_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'disinfectionRay_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-85',
            url: $.config.services.dialysis + "/patReport/getDisinfectionRayList.do", // ajax的url必须加上getRootPath()方法
            where: {
                "hospitalNo": hospitalNo,
                "sterilizeDate_begin": $("#sterilizeDate_begin").val(),
                "sterilizeDate_end": $("#sterilizeDate_end").val(),
                "sterilizeType": $.constant.RegionDisinfectionType.RAY
            }, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号', width: 60, rowspan: 2}  //序号
                , {field: 'areaName', title: '消毒区域', align: 'center', rowspan: 2}
                , {
                    field: 'sterilizeType',
                    title: disinfectionRecord.serializerTypeNameOfRay,
                    align: 'center',
                    colspan: 2
                }
                , {
                    field: 'startSterilizeTime', title: '消毒开始时间', align: 'center', rowspan: 2
                    , templet: function (d) {
                        if (d.startSterilizeTime != null && d.startSterilizeTime != "") {
                            return util.toDateString(d.startSterilizeTime, 'HH:mm:ss');
                        } else {
                            return "";
                        }
                    }
                }
                , {
                    field: 'endSterilizeTime', title: '消毒结束时间', align: 'center', rowspan: 2
                    , templet: function (d) {
                        if (d.endSterilizeTime != null && d.endSterilizeTime != "") {
                            return util.toDateString(d.endSterilizeTime, 'HH:mm:ss');
                        } else {
                            return "";
                        }
                    }
                }
                , {field: 'sterilizeUser', title: '消毒人', align: 'center', rowspan: 2}
                , {
                    field: 'sterilizeDate', title: '消毒日期', align: 'center', rowspan: 2
                    , templet: function (d) {
                        return util.toDateString(d.sterilizeDate, "yyyy-MM-dd");
                    }
                }
                , {field: 'remarks', title: '备注', rowspan: 2}
            ], [
                {
                    field: 'bacDevices', title: '设备编号', align: 'center', templet: function (d) {
                        return randerDevices(d.bacDevices, "code");
                    }
                }
                , {
                    field: 'bacDevices', title: '设备名称', align: 'center', templet: function (d) {
                        return randerDevices(d.bacDevices, "name");
                    }
                }
            ]]
        },
    });
}

/**
 * 查询列表事件
 * @param sterilizeDate_begin 开始时间
 * @param sterilizeDate_end 结束时间
 * @param hosptalNo  医院代号
 * @param queryModel 查询的具体表格
 */
function getList(sterilizeDate_begin, sterilizeDate_end, hospitalNo, queryModel) {
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    debugger
    var param;
    if (queryModel === "disinfectionMachine") {
        param = {
            "hospitalNo": hospitalNo,
            "sterilizeDateBegin": sterilizeDate_begin,
            "sterilizeDateEnd": sterilizeDate_end
        }
    } else if (queryModel === "disinfectionAir") {
        param = {
            "sterilizeType": $.constant.RegionDisinfectionType.AIR,
            "hospitalNo": hospitalNo,
            "sterilizeDate_begin": sterilizeDate_begin,
            "sterilizeDate_end": sterilizeDate_end
        }
    } else if (queryModel === "disinfectionRay") {
        param = {
            "sterilizeType": $.constant.RegionDisinfectionType.RAY,
            "hospitalNo": hospitalNo,
            "sterilizeDate_begin": sterilizeDate_begin,
            "sterilizeDate_end": sterilizeDate_end
        }
    }
    switch (queryModel) {
        case "disinfectionMachine":
            table.reload('disinfectionMachine_table', {
                where: param
            });
            break;
        case "disinfectionAir":
            table.reload('disinfectionAir_table', {
                where: param
            });
            break;
        case "disinfectionRay":
            table.reload('disinfectionRay_table', {
                where: param
            });
            break;
    }
}

/**
 *获取设备的名称
 **/
function randerDevices(devices, resultType) {
    if (devices != null && devices.length == 0) {
        return "";
    }
    templetHtml = "";
    for (var index in devices) {
        if (index != 0) {
            templetHtml += "<div style='margin:0;padding:5px 15px;width: 100%; min-height: 28px; border-top: 1px solid #e6e6e6'>"
        } else {
            templetHtml += "<div style='margin:0;padding:5px 15px;width: 100%; border:none'>"
        }
        if (resultType === 'name') {
            templetHtml += devices[index].deviceName;
        } else {
            templetHtml += devices[index].codeNo;
        }
        templetHtml += "</div>"
    }
    templetHtml += ""
    return templetHtml
}

/**
 * 搜索按钮事件
 */
function searchOrder() {
    var dateBegin=$("#sterilizeDate_begin").val();
    var dateEnd=$("#sterilizeDate_end").val();
    if (isNotEmpty(dateEnd) && new Date(dateBegin).getTime() > new Date(dateEnd).getTime()) {
        warningToast('开始时间不能大于结束时间');
        return false;
    }
    var hospitalNo = $("select[name='regionId']").val();
    getList(dateBegin, dateEnd, hospitalNo, disinfectionRecord.currentSelect);
}


/**
 * 获取数据字典的名称List，专用于列表显示
 * @param code
 * @param value
 */
function getSysDictNameList(code,value) {
    var name="";
    if(value !=null && value !=""){
        var characteristicsarr = value.split(',');
        for(var i in characteristicsarr){
            var tmp = getSysDictName(code,characteristicsarr[i]);
            name = name+tmp+","
        }
        name = name.substring(0,name.length-1);
    }else{
        name = "无";
    }
    return name;
}

//消毒时长处理
function changeTime(disinfectHour,disinfectMin) {
    if(isNotEmpty(disinfectHour) && isEmpty(disinfectMin)){
        return disinfectHour+"小时";
    }else if(isEmpty(disinfectHour) && isNotEmpty(disinfectMin)){
        return disinfectMin+"分钟";
    }else if(isNotEmpty(disinfectHour) && isNotEmpty(disinfectMin)){
        return disinfectHour+"小时"+disinfectMin+"分钟";
    }else{
        return "";
    }
}


