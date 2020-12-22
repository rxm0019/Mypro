/**
 * bacDocTmplEdit.jsp的js文件，包括查询，编辑操作
 */
/* 文书模板库编辑界面 js
* @Author wahmh
* @Date 2020-9-19
* @Version 1.0
* */
var bacDocTmplEdit = avalon.define({
    $id: "bacDocTmplEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    layer: '',
    layEdit: '',
    layEditReturn: '',//创建富文本编辑返回的下标
    docId: '',//模板id
    patientId: ''//当前的患者id
});
layui.use(['index', 'layedit', 'jquery', 'layer'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var layEdit = layui.layedit
        bacDocTmplEdit.layEdit = layEdit;
        bacDocTmplEdit.layer = layui.layer
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
        bacDocTmplEdit.layEditReturn = layEdit.build('docContent');
        //所有的入口事件写在这里...
        var docTmplId = GetQueryString("id");  //接收变量
        var patientId = GetQueryString("patientId");
        bacDocTmplEdit.docId = docTmplId;
        bacDocTmplEdit.patientId = patientId;
        //获取实体信息
        getInfo(docTmplId, function (data) {
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });
        avalon.scan();
    });
});

/**
 * 获取实体
 * @param docId  模板id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(docId, $callback) {
    if (isEmpty(docId)) {
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    } else {
        //编辑
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + "/bacDocTmpl/getInfo.do",
            data: {'id': docId},
            dataType: "json",
            done: function (data) {
                //数据回写
                $("#docName").val(data.docName)
                bacDocTmplEdit.layEdit.setContent(bacDocTmplEdit.layEditReturn, data.docContent, false)//false 替换
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
// //校验富文本编辑框
    form.verify({
        textAreaContent: function (value, item) { //value：表单的值、item：表单的DOM对象
            //  获取富文本框的值
            var value = getLayEditValue(bacDocTmplEdit.layEdit, bacDocTmplEdit.layEditReturn);
            //    给富文本框赋值
            bacDocTmplEdit.layEdit.setContent(bacDocTmplEdit.layEditReturn, value, false)//false 替换 true 追加
        }
    })
    form.on('submit(bacDocTmplEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacDocTmplEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        var param = field
        var url;
        if (isEmpty(bacDocTmplEdit.docId)) {
            //    新增
            url = $.config.services.platform + "/bacDocTmpl/add.do";
        } else {
            //    编辑
            url = $.config.services.platform + "/bacDocTmpl/edit.do";
            //    编辑模式下需要添加的模板ID
            param['docId'] = bacDocTmplEdit.docId

        }
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}