/**
 * 接口配置 - 编辑
 * @author: Gerald
 * @version: 1.0
 * @date: 2020/09/12
 */
var sysDockingEdit = avalon.define({
    $id: "sysDockingEdit",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,readonly: {readonly: false} // 设置只读

});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id=GetQueryString("id");  //接收变量
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        if(id!=null){
            $('#apiType').attr("readonly","readonly")//将input元素设置为readonly
        }
        //详情设置只读属性
        if (layEvent === 'detail') {
            sysDockingEdit.readonly = {readonly: true};
            $('input[type="radio"]').prop('disabled', true);
        }
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
    if(isEmpty(id)){
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    }else{
        //编辑
        var param={
            "dockingId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url:$.config.services.system+"/sysDocking/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                form.val('sysDockingEdit_form', data);
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
    form.on('submit(sysDockingEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#sysDockingEdit_submit").trigger('click');
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
        var url="";
        if(param.dockingId.length == 0){
            url=$.config.services.system+"/sysDocking/add.do";
        }else{
            url=$.config.services.system+"/sysDocking/edit.do";
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url:url,
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



