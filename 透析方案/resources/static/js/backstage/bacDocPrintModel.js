/**
 */
//import {win} from "../../lib/avalon/src/seed/browser";
/*文书模板库打印预览界面
* @Author wahmh
* @Date 2020-9-14
* @Version 1.0
* */
var bacDocPrintModel = avalon.define({
    $id: "bacDocPrintModel",
    baseFuncInfo: baseFuncInfo,//底层基本方法
});
layui.use(['index', 'layedit', 'layer'], function () {

    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var modelKey = GetQueryString("modelKey");
        var html = sessionStorage.getItem(modelKey);
        sessionStorage.removeItem(modelKey);
        $("#appendHtml").append(html);
        avalon.scan();
    });
});

function printModel() {
    var newstr = $("#appendHtml").html();
    var oldstr = document.body.innerHTML;
    document.body.innerHTML = newstr;
    window.print();
    document.body.innerHTML = oldstr;
    return false;
}

function printModel() {
    window.print();
}



