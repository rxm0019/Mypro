/**
 * 污水登记-新增、编辑
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/17
 */
var bacSewageEdit = avalon.define({
    $id: "bacSewageEdit",
    baseFuncInfo: baseFuncInfo//底层基本方法

});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        laydate.render({
            elem: '#registerDate'
            ,type: 'date'
            ,trigger: 'click'
        });
        var id=GetQueryString("id");  //接收变量
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });
        var form=layui.form; //调用layui的form模块
        var util=layui.util;
        var data = {};
        if(isEmpty(id)){
            data = {
                registerDate:util.toDateString(new Date(),"yyyy-MM-dd")
                ,registerUser:baseFuncInfo.userInfoData.username
            }
        }
        form.val('bacSewageEdit_form', data);
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
            "sewageId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/bacSewage/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.registerDate=util.toDateString(data.registerDate,"yyyy-MM-dd");
                data.createTime=util.toDateString(data.createTime,"yyyy-MM-dd");
                data.updateTime=util.toDateString(data.updateTime,"yyyy-MM-dd");
                form.val('bacSewageEdit_form', data);
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
    form.on('submit(bacSewageEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        dis_verify_form(field,$callback)
        // typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacSewageEdit_submit").trigger('click');
}
//正数正则表达式（整数或小数）
var numberReg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
function dis_verify_form(field,$callback) {
    var errMsg = [];
    if(isNotEmpty(field.chlorineDioxide) && !numberReg.test(field.chlorineDioxide)){
        errMsg.push("二氧化氯只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.ph) && !numberReg.test(field.ph)){
        errMsg.push("PH值只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.hcio) && !numberReg.test(field.hcio)){
        errMsg.push("余氯只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.ozone) && !numberReg.test(field.ozone)){
        errMsg.push("臭氧只能输入正数（整数或小数），");
    }
    if(errMsg.length > 0){
        errorToast(errMsg.toString().substring(0,errMsg.toString().length-1));
        return false;
    }
    typeof $callback === 'function' && $callback(field); //返回一个回调事件
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
        //判断是否存在主键ID，不存在执行新增否则为编辑
        var url = '';
        if(param.sewageId.length == 0){
            url = $.config.services.logistics + "/bacSewage/save.do";
        }else{
            url = $.config.services.logistics + "/bacSewage/edit.do";
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



