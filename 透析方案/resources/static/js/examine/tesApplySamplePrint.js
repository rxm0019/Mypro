/**
 * 打印检验申请单
 * @Author xcj
 * @version: 1.0
 * @Date 2020-10-30
 */
var tesApplySamplePrint = avalon.define({
    $id: "tesApplySamplePrint",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    constant:$.constant,
    sampleList:[],
    mechanism:'',

});
layui.use(['index'], function () {
    avalon.ready(function () {
        var applyId=GetQueryString("applyId");  //接收变量
        getList(applyId);
        avalon.scan();
    });
});

/**
 * 查询列表事件
 */
function getList(applyId) {
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/tesApplySample/getSamplePrint.do",
        data:{applyId:applyId},
        dataType: "json",
        done:function(data){
            if(data.length>0){
                debugger
                tesApplySamplePrint.mechanism = getSysDictName($.dictType.HospitalInspection,data[0].mechanism);
                tesApplySamplePrint.sampleList.pushArray(data);
                $.each(tesApplySamplePrint.sampleList, function (index, item) {
                    var name = item.patientName;
                    if(isNotEmpty(name)){
                        if(name.length>8){
                            item.patientName = name.substring(0,8)+"...";
                        }else {
                            item.patientName = name;
                        }
                    }
                });
            }
        }
    });
}


/**
 * 点击打印事件
 */
function onPrint() {
    window.print();
}




