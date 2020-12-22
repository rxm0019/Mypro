/* 文书模板库编辑界面 js
* @Author care
* @Date 2020-9-19
* @Version 1.0
* */
var sysHospitalPrint = avalon.define({
    $id: "sysHospitalPrint",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    layer: '',
    layEdit: '',
    layEditReturn: '',//创建富文本编辑返回的下标
    hospitalId: ''//当前的患者id

});
layui.use(['index', 'layedit', 'jquery', 'layer'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var layEdit = layui.layedit
        sysHospitalPrint.layEdit = layEdit;
        sysHospitalPrint.layer = layui.layer
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
        sysHospitalPrint.layEditReturn = layEdit.build('notesTemplate');
        //所有的入口事件写在这里...
        var hospitalId = GetQueryString("hospitalId");
        sysHospitalPrint.hospitalId = hospitalId;
        //获取实体信息
        getInfo(sysHospitalPrint.hospitalId);
        avalon.scan();
    });
});

/**
 * 获取实体
 * @param docId  模板id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(hospitalId) {
    if (isNotEmpty(hospitalId)) {
        //编辑
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.system + "/sysHospital/getInfo.do",
            data: {'hospitalId': hospitalId},
            dataType: "json",
            done: function (data) {
                sysHospitalPrint.layEdit.setContent(sysHospitalPrint.layEditReturn, data.notesTemplate, false)
                //表单初始赋值
                layui.form.val('sysHospitalPrint_form', data);
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
            var value = getLayEditValue(sysHospitalPrint.layEdit, sysHospitalPrint.layEditReturn);
            //    给富文本框赋值
            sysHospitalPrint.layEdit.setContent(sysHospitalPrint.layEditReturn, value, false)//false 替换 true 追加
        }
    })
    form.on('submit(sysHospitalPrint_submit)', function (data) {
        //通过表单验证后
        debugger
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#sysHospitalPrint_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function onHospitalSave($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        var param = field
        debugger
        var url;
        if (isNotEmpty(param.hospitalId)) {
            url = $.config.services.system + "/sysHospital/editPrescripNote.do"
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