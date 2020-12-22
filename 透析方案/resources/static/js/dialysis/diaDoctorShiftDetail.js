/**
 * 医护交班详情
 * @author: Allen
 * @version: 1.0
 * @date: 2020/10/21
 */
var diaDoctorShiftDetail = avalon.define({
    $id: "diaDoctorShiftDetail",
    baseFuncInfo: baseFuncInfo, // 底层基本方法
    serverTime: new Date(), // 服务器时间
    doctorShiftId: "", // 医护交班ID
});

layui.use(['index'], function () {
    avalon.ready(function () {
        // 获取URL参数
        diaDoctorShiftDetail.doctorShiftId = GetQueryString("doctorShiftId");

        // 获取交班记录信息
        getInfo(diaDoctorShiftDetail.doctorShiftId, function (data) {
            var diaDoctorShift = data.diaDoctorShift;
            // 接班人姓名数组转换
            var replaceDoctorIds = (diaDoctorShift.replaceDoctor || "").split(",");
            var replaceDoctorUsers = isEmpty(diaDoctorShift.replaceDoctorName) ? [] : JSON.parse(diaDoctorShift.replaceDoctorName);
            replaceDoctorUsers = replaceDoctorUsers.sort(function (a, b) {
                var aIndex = replaceDoctorIds.indexOf(a.userId);
                var bIndex = replaceDoctorIds.indexOf(b.userId);
                return aIndex - bIndex;

            });
            var replaceDoctorNames = [];
            $.each(replaceDoctorUsers, function (index, item) {
                replaceDoctorNames.push(item.userName);
            });

            // 交班记录信息填充
            var util = layui.util;
            var scheduleShiftName = getSysDictName($.dictType.shift, diaDoctorShift.scheduleShift);
            layui.form.val("diaDoctorShiftEdit_form", {
                shiftType: diaDoctorShift.shiftType, // 交班类别：1-班次，2-患者
                scheduleShift: diaDoctorShift.scheduleShift, // 班次
                scheduleShiftName: scheduleShiftName, // 班次
                shiftDate: isEmpty(diaDoctorShift.shiftDate) ? "" : util.toDateString(diaDoctorShift.shiftDate, "yyyy-MM-dd"), // 交班日期
                shiftDoctor: diaDoctorShift.shiftDoctor, // 交班人
                shiftDoctorName: diaDoctorShift.shiftDoctorName, // 交班人姓名
                replaceDoctor: diaDoctorShift.replaceDoctor, // 接班人（多笔，用逗号分隔）
                replaceDoctorName: replaceDoctorNames.join("、"),
                remarks: diaDoctorShift.remarks, // 备注
            });
            if (isEmpty(scheduleShiftName)) {
                $("#shiftDoctorNameColumn").hide();
            }

            // 刷新患者列表
            onRefreshPatientList(data.patientList)
        });
    });

    avalon.scan();
});

/**
 * 获取交班记录信息
 * @param doctorShiftId
 * @param $callback
 */
function getInfo(doctorShiftId, $callback) {
    // 刷新患者列表
    onRefreshPatientList([]);

    var param = {
        "doctorShiftId": doctorShiftId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaDoctorShift/getInfo.do",
        data: param,
        dataType: "json",
        success: function(res) {
            diaDoctorShiftDetail.serverTime = new Date(res.ts);
        },
        done: function (data) {
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}

/**
 * 刷新患者列表
 */
function onRefreshPatientList(tableData) {
    var table = layui.table;
    table.render({
        elem: '#patientList_table',
        cols: [[
            { type: 'numbers', title: '序号', width: 60 },   //序号
            { field: 'patientName', title: '姓名' },
            { field: 'patientRecordNo', title: '病历号' },
            {
                field: 'birthday', title: '年龄',
                templet: function (d) {
                    return getUserAge(diaDoctorShiftDetail.serverTime, d.birthday);
                }
            },
            {
                field: 'scheduleShift', title: '班次',
                templet: function (d) {
                    return getSysDictName($.dictType.shift, d.scheduleShift);
                }
            },
            {
                field: 'diagnosis', title: '诊断',
                templet: function (d) {
                    return (d.diagnosis || "").split(",").join("，");
                }
            }
        ]],
        data: tableData,
        even: true
    });
}


