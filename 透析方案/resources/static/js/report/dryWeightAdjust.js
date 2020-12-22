/**
 * dryWeightAdjust.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 */
/* 干体重调整记录js
* @Author wahmh
* @Date 2020-10-30
* @version 1.0
* */
var dryWeightAdjust = avalon.define({
    $id: "dryWeightAdjust",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientList: {  // 患者列表
        data: [], // 患者列表数据
        errorMsg: ''
    }
    , currentPatient: { // 当前选中患者信息
        patientId: '', // 患者ID
        patientName: '' // 姓名
    },
    hospitalNo: '',//当前选中的医院的id
    customerType: ''//当前选中的医院的id
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var laydate = layui.laydate;
        var util = layui.util;
        laydate.render({
            elem: "#shiftDate_begin"
            , type: 'date'
            , trigger: 'click',
            format: "yyyy-MM-dd"
        });
        laydate.render({
            elem: "#shiftDate_end"
            , type: 'date'
            , trigger: 'click'
        });
        getHospitalAndUser();//获取中心
       var dicts= getSysDictByCode($.dictType.customerType, true);
        for (var i = 0; i < dicts.length; i++) {
            var html = " <option value=" + dicts[i].value + ">" + dicts[i].name + "</option>"
            $("#customerType").append(html)
        }
        //监听客户类型下拉框的变化
        var form = layui.form;
        form.on("select(customerType)", function (data) {
            dryWeightAdjust.customerType = $("#customerType").val(),
                getPatientList();
        })
        //监听区名类型下拉框的变化
        form.on("select(regionId)", function (data) {
            dryWeightAdjust.hospitalNo = $("#regionId").val()
            getPatientList();
        })
        form.render("select");
        getPatientList();
        avalon.scan();
    });
});

/**
 * 查询患者列表事件
 * @param field
 */
function getPatientList() {
    var hospitalNo = $("#regionId").val();
    var patientName = $('#patName').val();
    var param = {
        patientName: patientName,
        customerType: $("#customerType").val(),
        hospitalNo: $("#regionId").val()
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaOutpatient/getDryWeightAdjustPatientList.do",
        data: param,
        dataType: "json",
        success: function (res) {
            dryWeightAdjust.serverTime = new Date(res.ts);
        },
        done: function (data) {
            if (data != null && data.length > 0) {
                $.each(data, function (index, item) {
                    var age = getUserAge(dryWeightAdjust.serverTime, item.birthday);

                    item.age = (age <= 0 ? "-" : age);
                    if ($.constant.gender.MALE === item.gender) {
                        item.sexPic = '/static/svg/male.svg';
                    } else if ($.constant.gender.FEMALE === item.gender) {
                        item.sexPic = '/static/svg/female.svg';
                    }
                    item.gerder = getSysDictName($.dictType.sex, item.gender);
                    var infectionStatus = getSysDictShortName("InfectionMark", item.infectionStatus);
                    item.infectionStatus = isEmpty(infectionStatus) ? [] : infectionStatus.split(",");
                });
                dryWeightAdjust.patientList.data = data;
                dryWeightAdjust.patientList.errorMsg = "";
                selectedPatientId = dryWeightAdjust.patientList.data[0].patientId;

                $(".patient-dropdown-item[data-patient-id='" + selectedPatientId + "']").trigger("click");

            } else {
                var table=layui.table
                dryWeightAdjust.patientList.data = [];
                dryWeightAdjust.patientList.errorMsg = "查无数据";
                table.reload('dryWeightAdjust_table',{
                    where:{patientId:""}
                });
            }
        },
        error: function (error) {
            var res = error.responseJSON || {};
            var status = error.status;
            dryWeightAdjust.patientList.data = [];
            dryWeightAdjust.patientList.errorMsg = getRequestErrorMsg(res, status);
        }
    });
}

/**
 * 选中患者信息时，更新患者概览信息
 * @param obj
 */
function onSelectedPatientInfo(obj) {
    var table = layui.table;
    var dropdownItemObj = $(obj);

    // 设置患者列表项选中样式
    $(".patient-dropdown-item").removeClass("selected");
    dropdownItemObj.addClass("selected");

    // 更新当前患者概览信息
    dryWeightAdjust.currentPatient.patientId = dropdownItemObj.attr("data-patient-id");
    dryWeightAdjust.currentPatient.patientName = dropdownItemObj.attr("data-patient-name");
    var patientId = dropdownItemObj.attr("data-patient-id");
    $($('.tab-item')[1]).trigger('click');
    getTablist();

}

/**
 * 患者照片加载错误时，设置默认图片
 * @param target
 */
function onPatientPhotoError(target) {
    var gender = $(target).attr("data-gender");
    baseFuncInfo.onPatientPhotoError(target, gender);
}

function getTablist() {
    var util = layui.util;
    //干体重调整记录表格
    _layuiTable({
        elem: '#dryWeightAdjust_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'dryWeightAdjust_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-85',
            url: $.config.services.dialysis + "/patReport/getDryWeightList.do", // ajax的url必须加上getRootPath()方法
            where: {
                "hospitalNo": dryWeightAdjust.hospitalNo,
                "shiftDate_begin": $("#shiftDate_begin").val(),
                "shiftDate_end": $("#shiftDate_end").val(),
                "patientId": dryWeightAdjust.currentPatient.patientId
            }, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[//表头
                {type: 'numbers', title: '序号', width: 60}  //序号
                , {field: 'hospitalNo', title: '中心', align: 'center'}
                , {
                    field: 'createTime', title: '日期', align: 'center'
                    , templet: function (d) {
                        return util.toDateString(d.createTime, "yyyy-MM-dd");
                    }
                }
                , {field: 'patientName', title: '姓名', align: 'center'}
                , {field: 'patientRecordNo', title: '病历号'}
                , {
                    field: 'remarks', title: '原值', templet: function (data) {
                        return (data.dryWeight).toFixed(2);
                    }
                }
                , {field: 'dryWeightAdjust', title: '更改值'}
                , {field: 'updateBy', title: '修改人'}
                ,]]
        },
    });
}

/**
 * 导出excel
 */
function onExportExcel() {
    var param = {
        shiftDate_begin: $("#shiftDate_begin").val(),
        shiftDate_end: $("#shiftDate_end").val(),
        patientName: dryWeightAdjust.currentPatient.patientName,
        patientId: dryWeightAdjust.currentPatient.patientId
    };
    var url = $.config.services.dialysis + "/patReport/exportDryWeight.do";   //导出患者干体重调整记录excel
    var title = dryWeightAdjust.currentPatient.patientName + "干体重调整记录.xlsx";
    _downloadFile({
        url: url,
        data: param,
        fileName: title
    });
}

/**
 * 获取区名
 */
function getHospitalAndUser() {
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patReport/listHospitalAndUser.do",
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

/**
 * 搜索按钮事件
 */
function searchOrder() {
    //  获取表格信息
    getTablist();
}



