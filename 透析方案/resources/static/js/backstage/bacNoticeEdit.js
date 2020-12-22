/**
 * bacNoticeEdit.jsp的js文件，包括查询，编辑操作
 */
/*公告管理编辑页面
* @Author wahmh
* @Date 2020-9-16
* @Version 1.0
* */
var uploadImgObj;
var bacNoticeEdit = avalon.define({
    $id: "bacNoticeEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    layEdit: '',//建立的layEdit
    noticeLayEdit: '',//建立富文本编辑框的返回值
    deleteFileIds: []
});
layui.use(['index', 'layedit', 'layer', 'upload', 'jquery'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var $ = layui.jquery;
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var layEdit = layui.layedit;
        layEdit.set({
            tool: [
                'html'//源码模式
                , 'undo', 'redo' //撤销重做--实验功能，不推荐使用
                , 'code', 'strong', 'italic', 'underline', 'del',
                , 'addhr' //添加水平线
                , '|', 'fontFomatt', 'fontfamily', 'fontSize',
                'colorpicker', 'fontBackColor'
                , 'face', '|', 'left', 'center', 'right', '|', 'link', 'unlink',
                , 'anchors' //锚点
                , '|', 'table'//插入表格
                , 'customlink'//插入自定义链接
                , 'fullScreen',
                'preview'//预览
            ]
            , height: 200
        })
        var noticeLayEdit = layEdit.build('noticeContent');
        bacNoticeEdit.layEdit = layEdit;
        bacNoticeEdit.noticeLayEdit = noticeLayEdit
        var id = GetQueryString("id");  //接收变量
        //获取实体信息
        getInfo(id, function (data) {
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
            var arr;
            debugger
            if (JSON.stringify(data) !== '{}'&&data.filePath!='') {
                arr = [{filePath: data.filePath, fileTitle: data.fileTitle, fileId: data.fileId}];
            }
            initUpload(arr);
        });
        avalon.scan();
    });
});

//图片上传
function initUpload(fileDatas) {
    fileDatas = fileDatas || [];
    uploadImgObj = _layuiUploadFile({
        elem: '#uploadImage'
        , url: $.config.services.dialysis + '/bacNotice/uploadImage.do'
        , accept: 'images'
        , method: 'post'
        , multiple: true
        , number: 1
        , acceptMime: 'image/*'
        , done: function (res) {
            debugger
            //...上传成功后的事件
            $("#image").val(res.bizData.filePath)
            $("#fileTitle").val(res.bizData.fileTitle)
            $("#mimeType").val(res.bizData.mimeType)
        }
        , showFileDiv: "#fileShowDiv"
        , fileDatas: fileDatas
        , withDelete: true
        , deleteItemCallack: function (deleteItemData, deleteItemObj) {
            if (isEmpty(deleteItemData.fileId) && isNotEmpty(deleteItemData.filePath)) {
                // 未保存文件记录的文件直接删除
                var deleteSuccess = baseFuncInfo.onDeleteTempFile(deleteItemData.filePath);
                if (deleteSuccess) {
                    deleteItemObj.remove();
                }
            } else {
                // 已保存记录的文件先记录删除文件记录ID，保存是进行逻辑删除
                bacNoticeEdit.deleteFileIds.push(deleteItemData.fileId);
                //删除图片后清空原来的赋值信息
                $("#image").val("");
                $("#fileTitle").val("");
                $("#mimeType").val("");
                deleteItemObj.remove();
            }
        }
    });
}

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(id, $callback) {
    if (isEmpty(id)) {
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    } else {
        //编辑
        var param = {
            "noticeId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/bacNotice/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                form.val('bacNoticeEdit_form', data);
                //给富文本编辑框赋值
                bacNoticeEdit.layEdit.setContent(bacNoticeEdit.noticeLayEdit, data.noticeContent, false)
                // // //给图片地址赋值
                // //  $("#showImg").attr("src", data.imageSrc)
                data['filePath'] = data.imageSrc;
                $("#image").val("");
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(bacNoticeEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        var value = getLayEditValue(bacNoticeEdit.layEdit, bacNoticeEdit.noticeLayEdit)
        field['noticeContent'] = value;
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacNoticeEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        var param = field; //表单的元素
        param['deleteFileIds'] = bacNoticeEdit.deleteFileIds
        debugger
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/bacNotice/edit.do",
            data: JSON.stringify(param),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}