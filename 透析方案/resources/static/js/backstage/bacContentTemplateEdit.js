/**
 * 模板编辑
 * @author Care
 * @date 2020-09-02
 * @version 1.0
 */
var bacContentTemplateEdit = avalon.define({
    $id: "bacContentTemplateEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    templateType: '',//模板类型
    content: '',//模板内容
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var templateType= GetQueryString("templateType");
        var uuid = GetQueryString('uuid');
        bacContentTemplateEdit.content = sessionStorage.getItem(uuid);   //根据获取的uuid获取缓存的医嘱数据
        sessionStorage.removeItem(uuid);    //获取到医嘱数据后， 删除缓存
        if(bacContentTemplateEdit.content!='null'){
            $("#templateContent").val(bacContentTemplateEdit.content)
        }
        if(templateType!='null'){
            $("#templateType").val(templateType)
        }
        initFormVerify();
        avalon.scan();
    });
});

/**
 * 初始化表单验证方法
 */
function initFormVerify() {
    layui.form.verify({
        // 字段必填校验
        fieldRequired: function (value, item) {
            var target = $(item);
            var fieldName = target.attr("data-field-name") || "";
            if (isEmpty(value.trim())) {
                return fieldName + "不能为空";
            }
        }
    })
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(bacContentTemplateEdit_submit)', function(data){
        
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacContentTemplateEdit_submit").trigger('click');
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
            url: $.config.services.platform+"/bacContentTemplate/save.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



