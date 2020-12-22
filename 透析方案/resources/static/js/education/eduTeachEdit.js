/**
 * eduTeachEdit.jsp的js文件，包括查询，编辑操作
 * 健康教育--教育记录测评
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/16
 */
var eduTeachEdit = avalon.define({
    $id: "eduTeachEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    eduBaseName:'',
    readonly: {readonly: false}, // 文本框设置只读
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...

        var id = GetQueryString("teachId");  //接收变量
        var show = GetQueryString("show");
        if(show == "0"){
            eduTeachEdit.readonly = {readonly: true};
            $('input[type="radio"]').prop('disabled', true);
        }
        eduTeachEdit.eduBaseName = GetQueryString("eduBaseName");
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
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
    var param={
        "teachId":id
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.logistics + "/eduTeach/getInfo.do",
        data:param,
        dataType: "json",
        done:function(data){
            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            //初始化表单元素,日期时间选择器
            var util=layui.util;
            data.teachDate=util.toDateString(data.teachDate,"yyyy-MM-dd");
            data.eduBaseName = eduTeachEdit.eduBaseName;
            form.val('eduTeachEdit_form', data);
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}
/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(eduTeachEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#eduTeachEdit_submit").trigger('click');
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
            url: $.config.services.logistics + "/eduTeach/edit.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



