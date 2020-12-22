/**
 * tOrgEdit.jsp的js文件，包括查询，编辑操作
 */
var tOrgEdit = avalon.define({
    $id: "tOrgEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    type:""
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        //接收变量
        var pid=GetQueryString("pid");
        var pname=GetQueryString("pname");
        var ptype=GetQueryString("ptype");
        if(isNotEmpty(pid)&&isNotEmpty(pname)&&isNotEmpty(ptype)){
            tOrgEdit.type=ptype;
            //添加子节点
            $("#selectPrison").addClass("layui-hide");
            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            form.val('tOrgEdit_form', {
                "orgParentName":pname,
                "parent":pid
            });
            $("#orgParent").removeClass("layui-hide");
            // $("#orgType").removeClass("layui-hide");
        }else {
            //添加一级组织
            $("#selectPrison").removeClass("layui-hide");
            // $("#orgType").addClass("layui-hide");
           getArea();
        }

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
    form.on('submit(tOrgEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        // if (isNotEmpty(tOrgEdit.type)&&isEmpty(field.category)) {
        //     warningToast("请选择类型");
        //     return false;
        // }
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#tOrgEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        if (isNotEmpty(field.provinceName)
            &&isNotEmpty(field.cityName)
            &&isNotEmpty(field.countyName)
            &&isNotEmpty(field.prisonProvince)
            &&isNotEmpty(field.prisonCity)
            &&isNotEmpty(field.prisonCounty)
        ) {
            field.areaName = field.provinceName + ',' + field.cityName + ',' + field.countyName;
            field.areaCode = field.prisonProvince + ',' + field.prisonCity + ',' + field.prisonCounty;
        }
        //成功验证后
        var param=field; //表单的元素
        //可以继续添加需要上传的参数
        //console.log(param);
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.system + "/tOrg/saveOrEdit.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}
/*获取地区*/
function getArea() {
    var form=layui.form;
    funLoadProvince("prisonProvince");//加载省
    // funLoadCity("prisonCity","110100");
    form.render('select');
    form.on('select(prisonProvince)', function(data){
        funLoadCity("prisonCity",data.value);//选择了省加载市
        form.val('tOrgEdit_form',{
            "provinceName":$(this).text()
        });
        form.render();
    });

    form.on('select(prisonCity)',function (data) {
        //console.log(data.value);
        funLoadCounty("prisonCounty",data.value);//选择了市加载县/区
        form.val('tOrgEdit_form',{
            "cityName":$(this).text()
        });
        form.render();
    });
    form.on('select(prisonCounty)',function (data) {
        form.val('tOrgEdit_form',{
            "countyName":$(this).text()
        });
        form.render();
    });
}





