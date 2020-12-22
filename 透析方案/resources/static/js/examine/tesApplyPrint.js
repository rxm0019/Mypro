/**
 * 打印检验申请单
 * @Author xcj
 * @version: 1.0
 * @Date 2020-10-30
 */
var tesApplyPrint = avalon.define({
    $id: "tesApplyPrint",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    applyId:'',//申请单id
    patientId:'',//患者id
    applyDate:'',
    hospitalName:'',
    mechanism:'',
    patientName:'',
    gender:'',
    patientAge:'',
    patientRecordNo:'',
    illness:'',
    purpose:'',
    applyList:[],
});
layui.use(['index'], function () {
    avalon.ready(function () {
        tesApplyPrint.applyId = GetQueryString('applyId');
        tesApplyPrint.patientId = GetQueryString('patientId');
        getInfo(tesApplyPrint.applyId,tesApplyPrint.patientId);
        avalon.scan();
    });
});


/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getInfo(applyId,patientId){
    //编辑
    var param={
        "applyId":applyId,
        "patientId":patientId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/tesApply/getInfo.do",
        data:param,
        dataType: "json",
        done:function(data){
            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            //初始化表单元素,日期时间选择器
            var util=layui.util;
            tesApplyPrint.applyList.clear();
            var patPatientInfo = data.patPatientInfo;
            debugger
            tesApplyPrint.applyList.pushArray(data.tesApplyItemList);
            $.each(tesApplyPrint.applyList, function(index, item) {
                item.examination = getSysDictName($.dictType.Examination,item.examination);
                item.testType = getSysDictName($.dictType.SampleType,item.testType);
                item.salesPrice = item.salesPrice+" 元/次";
            });

            tesApplyPrint.applyDate = util.toDateString(data.tesApply.applyDate,"yyyy-MM-dd");
            tesApplyPrint.hospitalName = data.tesApply.hospitalName;
            tesApplyPrint.mechanism = getSysDictName($.dictType.HospitalInspection, data.tesApply.mechanism);
            tesApplyPrint.illness = data.tesApply.illness;
            tesApplyPrint.purpose = data.tesApply.purpose;

            if(isNotEmpty(patPatientInfo.patientName) && patPatientInfo.patientName.length>8){
                tesApplyPrint.patientName = patPatientInfo.patientName.substring(0,8)+"...";
            }else {
                tesApplyPrint.patientName = patPatientInfo.patientName;
            }
            tesApplyPrint.gender =getSysDictName($.dictType.sex, patPatientInfo.gender);
            tesApplyPrint.patientAge = getAge(data.tesApply.applyDate,patPatientInfo.birthday);
            tesApplyPrint.patientRecordNo = patPatientInfo.patientRecordNo;
        }
    });
}

/**
 * 点击打印事件
 */
function onPrint() {
    window.print();
}

/**
 * 计算年龄
 * @param dateTime
 * @returns {number}
 */
function getAge(dialysisDate, birthday) {
    var aDate = new Date(dialysisDate);
    var thisYear = aDate.getFullYear();
    var bDate = new Date(birthday);
    var brith = bDate.getFullYear();
    var age = (thisYear - brith);
    return age;
}

