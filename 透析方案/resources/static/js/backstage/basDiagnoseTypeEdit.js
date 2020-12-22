/**
 * 诊断维护-新增诊断类别
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/26
 */
var basDiagnoseTypeEdit = avalon.define({
    $id: "basDiagnoseTypeEdit",
    baseFuncInfo: baseFuncInfo//底层基本方法

});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id=GetQueryString("id");  //接收变量
        var parentId=GetQueryString("parentId");  //接收变量
        var parentName=GetQueryString("parentName");  //接收变量
        // 表单赋值
        var form = layui.form;
        form.val('basDiagnoseTypeEdit_form', {
            diagnoseTypeId: id,
            parentTypeId: parentId,
            parentTypeName: parentName
        });

        // 编辑时，需自动带出实体信息
        if (isNotEmpty(id)) {
            getInfo(id);
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
function getInfo(menuId) {
    var param = {
        "diagnoseTypeId": menuId
    };
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/basDiagnoseType/getInfo.do",
        data: param,
        dataType: "json",
        done: function (data) {
            var form = layui.form;
            form.val('basDiagnoseTypeEdit_form', data);
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
    form.on('submit(basDiagnoseTypeEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#basDiagnoseTypeEdit_submit").trigger('click');
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
            url: $.config.services.platform + "/basDiagnoseType/save.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



