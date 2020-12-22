/**
 * patPatientHistoryEdit.jsp的js文件，包括查询，编辑操作
 * 患者管理-透析管理-干体重编辑页面
 * @Author Care
 * @version: 1.0
 * @Date 2020/8/12
 */

var patDialysisBaseRemarkEdit = avalon.define({
    $id: "patDialysisBaseRemarkEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId: '',//接收患者Id变量
    dryWeight: '',//接收干体重变量
    additionalWeight: '',//附加干体重
    dialysisTotalFrequency: '',//透析频次
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var form=layui.form;
        //初始化表单
        initForm();
        avalon.scan();
    });
});
//初始化表单
function initForm() {
    var uuid = GetQueryString('uuid');
    var temp = sessionStorage.getItem(uuid);
    var data = JSON.parse(temp);  //根据获取的uuid获取缓存的数据
    sessionStorage.removeItem(uuid)//清楚缓存数据
    patDialysisBaseRemarkEdit.patientId = data.patientId;
    patDialysisBaseRemarkEdit.dryWeight = data.dryWeight;
    patDialysisBaseRemarkEdit.additionalWeight = data.additionalWeight;
    patDialysisBaseRemarkEdit.dialysisTotalFrequency = data.dialysisTotalFrequency;
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(patDialysisBaseRemarkEdit_submit)', function(data){
        var field = data.field; //获取提交的字段
        field.patientId=patDialysisBaseRemarkEdit.patientId;
        field.dryWeight=patDialysisBaseRemarkEdit.dryWeight;
        field.additionalWeight=patDialysisBaseRemarkEdit.additionalWeight;
        field.dialysisTotalFrequency=patDialysisBaseRemarkEdit.dialysisTotalFrequency;
        //通过表单验证后

        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#patDialysisBaseRemarkEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field; //表单的元素
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis+"/patDialysisScheme/saveDialysisBasicInfor.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



