/**
 * bacClassTemplateDoctorEdit.jsp的js文件，包括查询，编辑操作
 * 医生值班模板--编辑删除页面
 * @author: xcj
 * @version: 1.0
 * @date: 2020/08/07
 */
var bacClassTemplateDoctorEdit = avalon.define({
    $id: "bacClassTemplateDoctorEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    userId:'',
    userName:'',
    classTemplateId:'',
    classManageList:[],
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var form=layui.form; //调用layui的form模块
        //所有的入口事件写在这里...
        bacClassTemplateDoctorEdit.userId=GetQueryString("userId");  //接收变量
        bacClassTemplateDoctorEdit.userName=GetQueryString("userName");  //接收变量
        bacClassTemplateDoctorEdit.classTemplateId=GetQueryString("templateId");  //接收变量

        //获取实体信息
        getInfo(bacClassTemplateDoctorEdit.classTemplateId,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });

        // 选择下拉框后触发
        form.on('select(defaultTemplate)', function(data){
            form.val('bacClassTemplateDoctorEdit_form',
                {
                    templateMon:data.value,
                    templateTue:data.value,
                    templateWed:data.value,
                    templateThur:data.value,
                    templateFri:data.value,
                    templateSat:data.value,
                }
            );
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
    debugger
    var param={
        "classTemplateId":id
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.schedule + "/bacClassTemplate/getTemplateDoctor.do",
        data:param,
        dataType: "json",
        done:function(data){
            bacClassTemplateDoctorEdit.classManageList.pushArray(data.ClassManage);
            var classTemplateData = data.ClassTemplate;
            debugger
            if(isEmpty(classTemplateData.templateSun)){
                $.each(bacClassTemplateDoctorEdit.classManageList,function(i,item){
                     if(item.classAttr == "2"){
                         classTemplateData.templateSun = item.classManageId;
                     }
                });
            }

            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            form.val('bacClassTemplateDoctorEdit_form', classTemplateData);
            typeof $callback === 'function' && $callback(classTemplateData); //返回一个回调事件
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
    form.on('submit(bacClassTemplateDoctorEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacClassTemplateDoctorEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        field.userId = bacClassTemplateDoctorEdit.userId;
        field.classTemplateId = bacClassTemplateDoctorEdit.classTemplateId;
        var param=field; //表单的元素
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.schedule + "/bacClassTemplate/saveOrEditDoctor.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



