/**
 * Login更新 - 编辑
 * @author: Gerald
 * @version: 1.0
 * @date: 2020/09/21
 */
var sysLoginBannerEdit = avalon.define({
    $id: "sysLoginBannerEdit",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,readonly: {readonly: false} // 设置只读
    ,deleteFileIds: [] // 删除的文件ID列表
    ,withDeleteFile: true

});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id=GetQueryString("id");  //接收变量
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        if(id!=null){
            $('#apiType').attr("readonly","readonly")//将input元素设置为readonly
        }
        //详情设置只读属性
        if (layEvent === 'detail') {
            sysLoginBannerEdit.readonly = {readonly: true};
            $('input[type="radio"]').prop('disabled', true);
        }
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
            initUpload(data.imgName);
        });
        avalon.scan();
    });
});

//图片上传
function initUpload(fileDatas) {
    fileDatas = fileDatas || [];
    uploadImgObj = _layuiUploadImg({
        elem: '#uploadImg'
        , url: $.config.services.system + '/sysLoginBanner/uploadImage.do'
        , accept: 'images'
        , method: 'post'
        , multiple: true
        , number: 5
        , acceptMime: 'image/*'
        , done: function (res) {
            //...上传成功后的事件
        }
        , showFileDiv: "#showImgDiv"
        , fileDatas: fileDatas
        , withDelete: sysLoginBannerEdit.withDeleteFile
        ,onAddItem: function (itemData) {
                var target = $(this.showFileDiv);
                var withDelete = this.withDelete;
                var fileTitle = itemData.fileTitle;
                var filePath = $.config.server+itemData.filePath;
                // 1. 图片对象
                var imgObj = '<img src="' + filePath + '" alt="' + fileTitle + '" title="' + fileTitle + '">';
                // 2. 删除按钮对象
                var deleteObj = withDelete ? '<i class="layui-icon icon-delete">&#x1006;</i>' : "";
                // 3. 图片项 = 图片对象 + 删除按钮对象
                var imgItemObj = $("<div>").addClass("layui-upload-item").addClass("with-img").data("itemData", itemData)
                    .append(imgObj).append(deleteObj);
                target.append(imgItemObj);
                imgItemObj.data("itemData", itemData);
            }
        , deleteItemCallack: function (deleteItemData, deleteItemObj) {
            if(isNotEmpty(deleteItemData.filePath)){
                var ids=[];
                ids.push(deleteItemData.filePath.replace(/^.*[\\\/]/, ''));
                del(ids);
                deleteItemObj.remove();
            }
        }
    });
}

/**
 * 删除事件
 * @param ids
 */
function del(ids){
    var param={
        "ids":ids
    };
    _ajax({
        type: "POST",
        url:$.config.services.system+"/sysLoginBanner/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('sysLoginBannerList_table'); //重新刷新table
        }
    });
}
/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getInfo(id,$callback){
    if(isEmpty(id)){
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    }else{
        //编辑
        var param={
            "imgName999":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url:$.config.services.system+"/sysLoginBanner/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                form.val('sysLoginBannerEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}


/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
     typeof $callback === 'function' && $callback(); //返回一个回调事件
}



