/**
 * diaUpdateDryWeight.jsp的js文件，包括查询，编辑操作
 * 患者管理-透析管理-干体重编辑页面
 * @Author Care
 * @version: 1.0
 * @Date 2020/8/12
 */
var diaUpdateDryWeight = avalon.define({
    $id: "diaUpdateDryWeight",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    diaBaseId: GetQueryString("diaBaseId"),//接收diaBaseId变量
    dryWeight: GetQueryString("dryWeight"),//接收干体重变量
    patientId: GetQueryString("patientId"),//接收患者Id变量
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var form = layui.form;
        //干体重赋值
        if (diaUpdateDryWeight.dryWeight != 'null') {
            $("#dryWeight").val(diaUpdateDryWeight.dryWeight);
        };
        //表单校验
        form.verify({
            number: function (value) {
                if (value < 0 || value > 200) {
                    return '请输入大于0且小于200的数值！';
                }
                if (!(/^\d+\.?\d{0,2}$/).test(value)) {
                    return '只能填数字，且小数不能超过两位';
                }
            }
        });
        avalon.scan();
    });
});

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(diaUpdateDryWeight_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#diaUpdateDryWeight_submit").trigger('click');
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
        if (diaUpdateDryWeight.dryWeight != null) {
            param.dryWeightAdjust = param.dryWeight;
        } else {
            param.dryWeightAdjust = param.dryWeight - diaUpdateDryWeight.dryWeight;//干体重调整值
        }
        param.patientId = diaUpdateDryWeight.patientId;
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patPatientHistory/save.do",
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



