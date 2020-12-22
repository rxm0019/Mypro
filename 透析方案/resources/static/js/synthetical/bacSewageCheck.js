/**
 * 污水登记-核对
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/17
 */
var bacSewageCheck = avalon.define({
    $id: "bacSewageCheck",
    baseFuncInfo: baseFuncInfo//底层基本方法

});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id=GetQueryString("id");  //接收变量
        var checkUser=GetQueryString("checkUser");  //接收变量
        var form=layui.form; //调用layui的form模块
        var data = {};
        if(isEmpty(checkUser)){
            data = {sewageId: id,checkUser:baseFuncInfo.userInfoData.username}
        }else{
            data = {sewageId: id,checkUser:checkUser}
        }
        form.val('bacSewageCheck_form', data);
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
    form.on('submit(bacSewageCheck_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacSewageCheck_submit").trigger('click');
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
        var url = $.config.services.logistics + "/bacSewage/check.do";
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



