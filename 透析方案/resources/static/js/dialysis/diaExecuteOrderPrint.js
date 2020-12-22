/**
 * 打印医嘱
 * @Author anders
 * @version: 1.0
 * @Date 2020-10-10
 */
var diaExecuteOrderPrint = avalon.define({
    $id: "diaExecuteOrderPrint",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    sysHospital: {},     //中心管理
    notesType: {},        //处方笺打印
    printModel: {        //打印的信息
        patientInfo: {},  //患者信息
        orderList: [],     //医嘱信息
        printType: '',      //打印类型
        diagnosis: '',       //诊断
        prescriptionNumber: ''       //处方编号
    },
    errMsg: ''
});
layui.use(['index'], function () {
    avalon.ready(function () {
        diaExecuteOrderPrint.notesType = {
            ALL: '1',           //方式一：打印全部的医嘱处方；
            FINETWO: '2',   //方式二：通过配置，只打印“精二”的医嘱处方；
            BYORDERTYPE: '3',  //方式三：通过配置，把“药疗”、“耗材”、“诊疗”、“检验”、“处置”、“其它”，按大类分开打印；
            DRUGUSEWAY: '4'   //方式四：中心通过配置，按用药途径，分开打印“口服的”、“非口服的”等"
        }

        // 获取查询参数
        var patientId = GetQueryString("patientId") || '';
        var diaRecordId = GetQueryString("diaRecordId") || '';
        var prescriptionId = GetQueryString("prescriptionId") || '';
        diaExecuteOrderPrint.printModel.diagnosis = GetQueryString("diagnosis") || '';
        diaExecuteOrderPrint.printModel.prescriptionNumber = GetQueryString("prescriptionNumber") || '';

        getSysHospital();
        getPatientInfo(patientId, diaRecordId);
        getOrderList(patientId, diaRecordId, prescriptionId);

        avalon.scan();
    });
});

/**
 * 获取中心管理列表
 */
function getSysHospital() {
    _ajax({
        type: "POST",
        loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysHospital/hospitalList.do",
        dataType: "json",
        async: false,
        done:function(data){
            diaExecuteOrderPrint.sysHospital = data;
        }
    });
}

/**
 * 获取患者信息
 * @param patientId
 */
function getPatientInfo(patientId, diaRecordId) {
    var param = {
        patientId: patientId,
        diaRecordId: diaRecordId
    }
    var date;
    _ajax({
        type: "POST",
        loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/diaExecuteOrder/getPatientInfo.do",
        data: param,
        dataType: "json",
        async: false,
        success: function (res) {
            date = new Date(res.ts);
        },
        done: function (data) {
            data.issueDate = layui.util.toDateString(date, 'yyyy-MM-dd HH:mm:ss');   //开具日期
            data.age = getUserAge(date, data.birthday) + '岁';
            diaExecuteOrderPrint.printModel.patientInfo = data;
        }
    });
}

/**
 * 获取医嘱列表
 */
function getOrderList(patientId, diaRecordId, prescriptionId) {
    var notesType = diaExecuteOrderPrint.notesType;
    var sysHospital = diaExecuteOrderPrint.sysHospital;
    var param = {
        patientId: patientId,
        diaRecordId: diaRecordId
    }
    var url = $.config.services.dialysis + "/diaExecuteOrder/listAll.do";
    if(isEmpty(diaRecordId)) {
        param = {
            prescriptionId: prescriptionId
        }
        url = $.config.services.dialysis + "/diaOutpatientDetails/listAll.do";
    }
    _ajax({
        type: "POST",
        // loading:true,  //是否ajax启用等待旋转框，默认是true
        url: url,
        data: param,
        dataType: "json",
        done: function (data) {
            if (data == null || data.length <= 0) {
                diaExecuteOrderPrint.errMsg = '查无数据';
            }
            if (data != null && data.length > 0) {
                //修改要医嘱要打印的信息
                for (var i = 0; i < data.length; i++){
                    var item = data[i];
                    if (isNotEmpty(item.specifications)) {
                        item.orderContent = item.orderContent + '【' + item.specifications + '】';
                    }
                    item.channel = getSysDictName('Route', item.channel);
                    item.frequency = getSysDictName('OrderFrequency', item.frequency);
                    if (item.orderType === '3') {  //检验
                        item.channel = '';
                        item.frequency = '';
                    }
                    item.useGross = item.totalDosage + item.basicUnit;
                    item.buyGross = item.totalDosage + item.basicUnit;

                    //比例为0 或者 允许拆分发药，则不会进行总量的转换
                    if (item.conversionRel2Sales === 0 || item.conversionRel2Basic === 0 || item.allowSplitDispense === 'Y') {
                        continue;
                    }
                    var value = item.totalDosage * (item.conversionRel2Sales / item.conversionRel2Basic);
                    item.buyGross = Math.ceil(value) + getSysDictName('purSalesBaseUnit', item.salesUnit);
                    if (value % 1 === 0) {   //整除
                        item.useGross = 'X' + item.totalDosage + item.basicUnit;
                    }
                }

                if (sysHospital.notesType === notesType.ALL) {   //方式一
                    diaExecuteOrderPrint.printModel.printType = '普通';
                    diaExecuteOrderPrint.printModel.orderList = data;
                    printOrder(diaExecuteOrderPrint.printModel);
                } else if (sysHospital.notesType === notesType.FINETWO) {   //方式二
                    var orderList = [];
                    diaExecuteOrderPrint.printModel.printType = '精二';
                    data.forEach(function (item, index) {
                        if (isNotEmpty(item.classII) && item.classII === '1') {   //classII  0--普通  1--精二
                            orderList.push(item);
                        }
                    });
                    diaExecuteOrderPrint.printModel.orderList = orderList;
                    printOrder(diaExecuteOrderPrint.printModel);

                } else if (sysHospital.notesType === notesType.BYORDERTYPE) {  //方式三  “药疗”、“耗材”、“诊疗”、“检验”、“处置”、“其它”
                    var drugArr = [];  //药疗医嘱
                    var diagnosisArr = [];  //诊疗
                    var inspectionArr = [];  //检验
                    var disposeArr = [];    //处置
                    var otherArr = [];      //其他
                    data.forEach(function (item, index) {
                        if (item.orderType === '1') {
                            drugArr.push(item);
                        } else if (item.orderType === '2') {
                            diagnosisArr.push(item);
                        } else if (item.orderType === '3') {
                            inspectionArr.push(item);
                        } else if (item.orderType === '4') {
                            disposeArr.push(item);
                        } else if (item.orderType === '5') {
                            otherArr.push(item);
                        }
                    });
                    if (drugArr.length > 0) {
                        diaExecuteOrderPrint.printModel.printType = '药疗';
                        diaExecuteOrderPrint.printModel.orderList = drugArr;
                        printOrder(diaExecuteOrderPrint.printModel);
                    }
                    if (diagnosisArr.length > 0) {
                        diaExecuteOrderPrint.printModel.printType = '诊疗';
                        diaExecuteOrderPrint.printModel.orderList = diagnosisArr;
                        printOrder(diaExecuteOrderPrint.printModel);
                    }
                    if (inspectionArr.length > 0) {
                        diaExecuteOrderPrint.printModel.printType = '检验';
                        diaExecuteOrderPrint.printModel.orderList = inspectionArr;
                        printOrder(diaExecuteOrderPrint.printModel);
                    }
                    if (disposeArr.length > 0) {
                        diaExecuteOrderPrint.printModel.printType = '处置';
                        diaExecuteOrderPrint.printModel.orderList = disposeArr;
                        printOrder(diaExecuteOrderPrint.printModel);
                    }
                    if (otherArr.length > 0) {
                        diaExecuteOrderPrint.printModel.printType = '其他';
                        diaExecuteOrderPrint.printModel.orderList = otherArr;
                        printOrder(diaExecuteOrderPrint.printModel);
                    }
                    if (drugArr.length === 0 && diagnosisArr.length === 0 && inspectionArr.length === 0 && disposeArr.length === 0 && otherArr.length === 0) {
                        diaExecuteOrderPrint.printModel.printType = '全部';
                        diaExecuteOrderPrint.printModel.orderList = [];
                        printOrder(diaExecuteOrderPrint.printModel);
                    }
                } else if (sysHospital.notesType === notesType.DRUGUSEWAY) {   //方式四  口服   非口服
                    var perOsArr = [];   //口服
                    var notPerOsArr = [];  //非口服
                    data.forEach(function (item, index) {
                        if (getSysDictName('Route', item.channel) === '口服') {  //口服
                            perOsArr.push(item);
                        } else {
                            notPerOsArr.push(item);   //非口服
                        }
                    });
                    if (perOsArr.length > 0) {
                        diaExecuteOrderPrint.printModel.printType = '口服';
                        diaExecuteOrderPrint.printModel.orderList = perOsArr;
                        printOrder(diaExecuteOrderPrint.printModel);
                    }
                    if (notPerOsArr.length > 0) {
                        diaExecuteOrderPrint.printModel.printType = '非口服';
                        diaExecuteOrderPrint.printModel.orderList = notPerOsArr;
                        printOrder(diaExecuteOrderPrint.printModel);
                    }
                }
            }
        }
    });
}

/**
 * 打印
 * @param printModel
 */
function printOrder(printModel) {
    if (isNotEmpty(diaExecuteOrderPrint.sysHospital.notesTemplate)) {
        layui.laytpl(diaExecuteOrderPrint.sysHospital.notesTemplate).render({
                'patientInfo': printModel.patientInfo,
                'orderList': printModel.orderList,
                'doctor': printModel.orderList.length > 0 ? printModel.orderList[0].executeOrderDoctorName : '',
                'printType': printModel.printType,
                'diagnosis': printModel.diagnosis,
                'prescriptionNumber': printModel.prescriptionNumber
            }
            ,function (string) {
                $("#orderWrapper").append(string);//显示模块的内容
            }
        );
    } else {
        diaExecuteOrderPrint.errMsg = "当前登录中心无医嘱模板，请到中心管理添加医嘱打印模板";
    }
}

/**
 * 点击打印事件
 */
function onPrint() {
    window.print();
}




