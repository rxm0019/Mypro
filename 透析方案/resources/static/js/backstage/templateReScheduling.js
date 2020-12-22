/**
 * templateReScheduling.jsp的js文件，包括查询，编辑操作
 * 医护重新排班页面
 * @author: xcj
 * @version: 1.0
 * @date: 2020/08/10
 */
var templateReScheduling = avalon.define({
    $id: "templateReScheduling",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    type:'', //1-医生，2-护士
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        templateReScheduling.type=GetQueryString("type");  //接收变量
        avalon.scan();
    });
});


/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(templateReScheduling_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#templateReScheduling_submit").trigger('click');
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
        var url = "";
       if(templateReScheduling.type == '1'){
           url = $.config.services.schedule + "/bacClassDuty/reSchedulingDoctor.do";
       }
       if(templateReScheduling.type == '2'){
           url = $.config.services.schedule + "/bacClassDuty/reSchedulingNurse.do";
       }
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



