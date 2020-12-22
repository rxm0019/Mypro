/**
 * bacPatientPageItemEdit.jsp的js文件，包括查询，编辑操作
 */
/*
* @Author wahmh
* @Date 2020-9-16
* */
var bacNoticePreview = avalon.define({
    $id: "bacNoticePreview",
    baseFuncInfo: baseFuncInfo,//底层基本方法
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        getHtml()
        avalon.scan();
    });
});
/*
* 获取sessionstorage里面的内容
* */
function getHtml()
{
    var htmlText=window.sessionStorage.getItem("noticePreviewContent")
        $("#content").append(htmlText)
}