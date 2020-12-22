/**
 * eduPlanEdit.jsp的js文件，包括查询，编辑操作
 * 健康教育--教育实施--添加教育计划
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/16
 */
var eduTeachPlanEdit = avalon.define({
    $id: "eduTeachPlanEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    dictType:$.dictType,
    patientIdList:[],//患者id
    allThemeType:[],//字典主题类型数据
    eduBaseList:[],//获取所有教育主题
    patientList:[],//患者列表
});

layui.use(['index','formSelects'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var form=layui.form;
        //所有的入口事件写在这里...
        var userId = GetQueryString('userId');
        if(isEmpty(userId)){
            userId = "";
        }
        //获取患者列表 + 教育主题列表
        getTeachPlanList(userId);

        //获取字典数据
        eduTeachPlanEdit.allThemeType = getSysDictMap($.dictType.ThemeType);
        var value = $("select[name='eduBaseType']").val();
        if(isNotEmpty(value)){
            var htmlTheme ='<option value=""></option>';
            $.each(eduTeachPlanEdit.allThemeType,function(i,item){
                if(value == item.dictBizCode){
                    htmlTheme+='<option value="'+item.value+'">'+item.name+'</option>';
                }
            });
            $("select[name='themeType']").html(htmlTheme);
        }
        //刷新表单渲染
        form.render();
        //监控下拉
        filterSelect();
        avalon.scan();
    });
});

/**
 * 监控下拉选项
 */
function filterSelect() {

    //监控教育类型，联动主题类型
    var form=layui.form;
    form.on('select(eduBaseType)', function(data){
        debugger
        if(isNotEmpty(data.value)){
            //清空数据，重新绑定值
            form.val('eduTeachPlanEdit_form', {"themeType":"","eduBaseId":""});
            var htmlTheme ='<option value=""></option>';
            $.each(eduTeachPlanEdit.allThemeType,function(i,item){
                if(data.value == item.dictBizCode){
                    htmlTheme+='<option value="'+item.value+'">'+item.name+'</option>';
                }
            });
            $("select[name='themeType']").html(htmlTheme);

            var htmlBase ='<option value=""></option>';
            $.each(eduTeachPlanEdit.eduBaseList,function(i,item){
                if(data.value == item.eduBaseType){
                    htmlBase+='<option value="'+item.eduBaseId+'">'+item.eduBaseName+'</option>';
                }
            });
            $("select[name='eduBaseId']").html(htmlBase);
            //刷新表单渲染
            form.render();
        }
    });

    //监控主题类型，联动教育主题
    form.on('select(themeType)', function(data){
        debugger
        if(isNotEmpty(data.value)){
            //清空数据，重新绑定值
            form.val('eduTeachPlanEdit_form', {"eduBaseId":""});
            var htmlStr ='<option value=""></option>';
            $.each(eduTeachPlanEdit.eduBaseList,function(i,item){
                if(data.value == item.themeType){
                    htmlStr+='<option value="'+item.eduBaseId+'">'+item.eduBaseName+'</option>';
                }
            });
            $("select[name='eduBaseId']").html(htmlStr);
            //刷新表单渲染
            form.render();
        }
    });

}

function getTeachPlanList(userId) {
    var param={
        "userId":userId
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.logistics + "/eduDataBase/getTeachPlanList.do",
        data:param,
        dataType: "json",
        done:function(data){
            var eduBaseList = data.eduBaseList;
            eduTeachPlanEdit.eduBaseList.clear();
            eduTeachPlanEdit.eduBaseList.pushArray(eduBaseList);

            var patientList = data.patientList;
            eduTeachPlanEdit.patientList.clear();
            eduTeachPlanEdit.patientList.pushArray(patientList);

            var formSelects=layui.formSelects; //调用layui的form模块
            formSelects.data('patientId', 'local', {
                arr:eduTeachPlanEdit.patientList
            });
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
    form.on('submit(eduTeachPlanEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#eduTeachPlanEdit_submit").trigger('click');
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
        param.patientIds = field.patientId;
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/eduPlan/save.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}




