/**
 * bacPatientPageItemEdit.jsp的js文件，包括查询，编辑操作
 */
/*文书上传模板预览界面js
* @Author wahmh
* @Date 2020-9-30
* @Version 1.0
* */
var patDocRecordPreview = avalon.define({
    $id: "patDocRecordPreview",
    baseFuncInfo: baseFuncInfo,//底层基本方法
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var recordId = GetQueryString("recordId");
        getInfo(recordId);
        avalon.scan();
    });
});

/*
* 获取实体信息
* */
function getInfo(recordId) {
    var param = {
        "recordId": recordId
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/patDocRecord/getInfo.do",
        data: param,
        dataType: "json",
        done: function (data) {
            // imgSrc   文件的地址  mimeType 文件的类型
            if (data.mimeType === $.constant.FileType.PDF) {
                //    用户上传的是pdf文件 展示pdf
                var html = " <iframe src=\"" + data.imageSrc + "\" frameborder=\"1\" style=\"width: 100%; height: 100%\"></iframe>";
                $("#appendDiv").append(html);
            } else {
                //    用户上传的是图片 展示图片
                var html =
                    "    <div id=\"imageContent\" style=\"margin-left: 10px;margin-right: 10px\">\n" +
                    "<img id=\"imgId\" src=\"" + data.imageSrc + "\"\n" + "style=\"width: 100%\">\n" +
                    "    </div>";
                $("#appendDiv").append(html);
            }
        }
    });
}

/*
* 点击打印后从新加载当前的页面数据
* */
window.onafterprint = function afterPrint() {
    window.location.reload();
};

function save($callback) {
    window.print();
}

/*
* 模板打印
* */
function printModel() {

    window.print();

}


