/**
 * 诊断维护-新增/编辑诊断项目
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/27
 */
var basDiagnoseDetailEdit = avalon.define({
    $id: "basDiagnoseDetailEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    readonly: {readonly: false}, // 设置只读
    disabled:{disabled: false} // 设置只读
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id=GetQueryString("id");  //接收变量
        var diagnoseTypeId=GetQueryString("diagnoseTypeId");  //接收变量
        var diagnoseTypeName=GetQueryString("diagnoseTypeName");  //接收变量
        var readonly=GetQueryString("readonly");  //接收变量
        if(readonly=="Y"){
            basDiagnoseDetailEdit.readonly = {readonly: true};
            $('input[type="radio"]').prop('disabled', true);
        }
        // 表单赋值
        var form = layui.form;
        form.val('basDiagnoseDetailEdit_form', {
            diagnoseDetailId: id,
            diagnoseTypeId: diagnoseTypeId,
            diagnoseTypeName: diagnoseTypeName
        });

        // 编辑时，需自动带出实体信息
        if (isNotEmpty(id)) {
            getInfo(id,function(data){
                //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
                //...
            });
        }
        avalon.scan();
    });
});

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
            "diagnoseDetailId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + "/basDiagnoseDetail/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.createTime=util.toDateString(data.createTime,"yyyy-MM-dd");
                data.updateTime=util.toDateString(data.updateTime,"yyyy-MM-dd");
                form.val('basDiagnoseDetailEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}
/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(basDiagnoseDetailEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#basDiagnoseDetailEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field; //表单的元素        //判断是否存在主键ID，不存在执行新增否则为编辑
        var url = '';
        if(param.diagnoseDetailId.length == 0){
            url = $.config.services.platform + "/basDiagnoseDetail/save.do";
        }else{
            url = $.config.services.platform + "/basDiagnoseDetail/edit.do";
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



