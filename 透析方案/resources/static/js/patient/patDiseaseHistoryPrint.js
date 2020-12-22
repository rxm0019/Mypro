/**
 * 患者管理--病情记录--病史打印
 * @author Care
 * @date 2020-09-02
 * @version 1.0
 */
var patDiseaseHistoryPrint = avalon.define({
    $id: "patDiseaseHistoryPrint",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    recordUserId: '',//当前记录人
    patDiseaseHistory: null,//病史信息
});
layui.use(['index', 'formSelects'], function () {
    avalon.ready(function () {
        var uuid = GetQueryString('uuid');
        var temp = sessionStorage.getItem(uuid);
        var data = JSON.parse(temp);  //根据获取的uuid获取缓存的数据
        sessionStorage.removeItem(uuid)//清楚缓存数据
        if (isNotEmpty(data.allergicDrugDetails)) {
            var allergicArr = data.allergicDrugDetails.split(",");
            var dataArr = [];
            $.each(allergicArr, function (index, item) {
                var dictName = getSysDictName("AllergicDrug", item);
                dataArr.push(dictName);
            })
        }
        data.allergicDrugDetails = dataArr;

        if (data.allergicDrugStatus === "Y") {
            data.allergicDrugStatus = "有";
        }
        if (data.allergicDrugStatus === "N") {
            data.allergicDrugStatus = "无";
        }
        if (data.allergicDrugStatus === "U") {
            data.allergicDrugStatus = "不详";
        }
        data.allergicDrugStatus = data.allergicDrugStatus;
        data.gender = getSysDictName("Sex",data.gender);
        patDiseaseHistoryPrint.patDiseaseHistory = data;
    })
});
/**
 * 点击打印事件
 */
function onPrint() {
    window.print();
}



