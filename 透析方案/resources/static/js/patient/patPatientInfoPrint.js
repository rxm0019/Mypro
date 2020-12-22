/**
 * 打印患者基本信息
 * @Author wahmh
 * @version: 1.0
 * @Date 2020-11-20
 */
var patPatientInfoPrint = avalon.define({
    $id: "patPatientInfoPrint",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    applyDate: '',
    hospitalName: '',
    mechanism: '',
    patientName: '',
    gender: '',
    patientAge: '',
    patientRecordNo: '',
    illness: '',
    purpose: '',
    applyList: [],
    patientInfo: {}

});
layui.use(['index'], function () {
    avalon.ready(function () {
        var uuid = GetQueryString('uuid');
        var temp = sessionStorage.getItem(uuid);
        var data = JSON.parse(temp);  //根据获取的uuid获取缓存的数据
        sessionStorage.removeItem(uuid)//清楚缓存数据
        data.customerType = getSysDictName('CustomerType', data.customerType);
        data.ethnicity = getSysDictName('Ethnicity', data.ethnicity);
        data.maritalStatus = getSysDictName("MaritalStatus", data.maritalStatus);
        data.religion = getSysDictName("Religion", data.religion);
        data.educationLevel = getSysDictName('EducationLevel', data.educationLevel)
        data.occupation = getSysDictName("Occupation", data.occupation);
        data.smokeStatus = getSysDictName("SmokeStatus", data.smokeStatus);
        data.incomeStatus = getSysDictName("IncomeStatus", data.incomeStatus);
        data.drinkStatus = getSysDictName("DrinkStatus", data.drinkStatus);
        data.dialysisType = getSysDictName('DialysisType', data.dialysisType);
        data.gender = getSysDictName("Sex", data.gender);  //infectionStatus
        data.dialysisTotalFrequency = getSysDictName('DialysisFrequency', data.dialysisTotalFrequency);
        var infections = [];
        var infectionArr = data.infectionStatus.split(",");
        if (isEmpty(data.infectionStatus)) {
            infections.push("暂无感染状况")
        } else {
            for (var i = 0; i < infectionArr.length; i++) {
                var item = getSysDictName('InfectionMark', infectionArr[i]);
                infections.push(isNotEmpty(item) ? item : "");
            }
        }
        data.infectionStatus = infections.join("，")
        var arr = [];
        //医保类型
        var insuranceType = getSysDictByCode("InsuranceType");
        for (var i = 0; i < insuranceType.length; i++) {
            arr.push(insuranceType[i].name);

        }
        data.insuranceType = arr.join("，")
        //标签
       var patTientTagList=[];
        for (var i = 0; i <data.patPatientTagLists.length ; i++) {
            patTientTagList.push(data.patPatientTagLists[i].tagContent)
        }
        data.patPatientTagLists =patTientTagList.join("，");
        patPatientInfoPrint.patientInfo = data
        avalon.scan();
    });
});

/**
 * 点击打印事件
 */
function onPrint() {
    window.print();
}




