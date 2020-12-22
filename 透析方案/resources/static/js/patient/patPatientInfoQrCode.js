/**
 * 患者管理 - 患者列表 - 打印二维码
 * @Author Allen
 * @version: 1.0
 * @Date 2020/8/20
 */
var patPatientInfoQrCode = avalon.define({
    $id: "patPatientInfoQrCode",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientList: {  // 患者列表
        data: [], // 患者列表数据
        errorMsg: ''
    }
});
layui.use(['index', 'qrcode'], function () {
    avalon.ready(function () {
        var $ = layui.$;

        // 获取查询参数
        var qPatientIds = GetQueryString("patientIds") || '';
        var searchParams = {
            patientName: GetQueryString("patientName") || '',
            mobilePhone: GetQueryString("mobilePhone") || '',
            patientRecordNo: GetQueryString("patientRecordNo") || '',
            customerType: GetQueryString("customerType") || '',
            patientIds: isEmpty(qPatientIds) ? [] : qPatientIds.split(",")
        };

        // 查询患者列表
        getPatientList(searchParams);
        avalon.scan();
    });
});

/**
 * 查询患者列表
 * @param field
 */
function getPatientList(field) {
    var param = isNotEmpty(field) ? field : {};
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patPatientInfo/listForPrint.do",
        data:JSON.stringify(param),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        done: function(data) {
            if (data != null && data.length > 0) {
                patPatientInfoQrCode.patientList.data = data;
                patPatientInfoQrCode.patientList.errorMsg = "";

                // 找到所有二维码DIV，并渲染
                var qrcodeObjs = $(".item-qrcode-box .qrcode-content");
                for (var i = 0; i < qrcodeObjs.length; i++) {
                    var qrcodeObj = $(qrcodeObjs[i]);
                    var hospitalNo = qrcodeObj.attr("data-hospital-no");
                    var patientRecordNo = qrcodeObj.attr("data-patient-record-no");

                    if (isEmpty(patientRecordNo)) {
                        qrcodeObj.html("未生成病历号");
                    } else {
                        // 生成链接并渲染二维码
                        var qrcodeUrl = $.base64.encode($.config.server + "/?hospitalNo=" + hospitalNo + "&patientRecordNo=" + patientRecordNo);
                        qrcodeObj.qrcode({ render: "canvas", width: 90, height: 90, text: qrcodeUrl, correctLevel: 1 });
                    }
                }
            } else {
                patPatientInfoQrCode.patientList.data = [];
                patPatientInfoQrCode.patientList.errorMsg = "查无数据";
            }
        },
        error: function (error) {
            var res = error.responseJSON || {};
            var status = error.status;

            patPatientInfoQrCode.patientList.data = [];
            patPatientInfoQrCode.patientList.errorMsg = getRequestErrorMsg(res, status);
        }
    });
}

/**
 * 点击打印事件
 */
function onPrint() {
    window.print();
}




