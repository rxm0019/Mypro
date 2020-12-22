/**
 * tesApplySampleEdit.jsp的js文件，包括查询，编辑操作
 * 检验检查--检验申请单检体
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/27
 */
var tesApplySampleEdit = avalon.define({
    $id: "tesApplySampleEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    dictType:$.dictType,
    applyId:'',//申请单id
    applySampleId:'',//检验申请单检体表
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...

        var applyId=GetQueryString("applyId");  //接收变量
        if(isNotEmpty(applyId)){
            tesApplySampleEdit.applyId = applyId;
        }
        var applySampleId=GetQueryString("applySampleId");  //接收变量
        if(isNotEmpty(applySampleId)){
            tesApplySampleEdit.applySampleId = applySampleId;
        }
        //获取实体信息
        getInfo(tesApplySampleEdit.applySampleId,function(data){

        });
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
            "applySampleId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/tesApplySample/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                form.val('tesApplySampleEdit_form', data);
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
    form.on('submit(tesApplySampleEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#tesApplySampleEdit_submit").trigger('click');
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
        var url = "";
        if(isEmpty(tesApplySampleEdit.applySampleId)){
            param.applyId = tesApplySampleEdit.applyId;
            url = $.config.services.dialysis + "/tesApplySample/save.do";
        }else {
            url = $.config.services.dialysis + "/tesApplySample/edit.do";
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



