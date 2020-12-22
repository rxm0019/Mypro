/**
 * bacWorkingHoursEdit.jsp的js文件，包括查询，编辑操作
 * 护士工时管理-新增编辑页面
 * @author: xcj
 * @version: 1.0
 * @date: 2020/08/14
 */
var bacWorkingHoursEdit = avalon.define({
    $id: "bacWorkingHoursEdit",
    baseFuncInfo: baseFuncInfo//底层基本方法

});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var form=layui.form; //调用layui的form模块
        var date=new Date();
        var year = date.getFullYear();
        var laydate=layui.laydate;
        laydate.render({
            elem: '#workingYear'
            ,type: 'year'
            ,value:year
        });
        //获取实体信息
        getInfo(year,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
        });

        //输入框的值改变时触发
        $("#defaultHours").on("input",function(e){
            var value = e.delegateTarget.value;
            form.val('bacWorkingHoursEdit_form', {
                janHours:value,
                febHours:value,
                marHours:value,
                aprHours:value,
                mayHours:value,
                junHours:value,
                julHours:value,
                augHours:value,
                septHours:value,
                octHours:value,
                novHours:value,
                decHours:value,
            });
        });

        //表单验证
        form.render();//这句一定要加，占坑
        form.verify({
            hoursNum:function(value, item){ //value：表单的值、item：表单的DOM对象
                if(value>465){
                    return '只能是数字且范围0~465！';
                }
                if(value<0){
                    return '只能是数字且范围0~465！';
                }
            }
        });

        avalon.scan();
    });
});

/**
 * 搜索
 */
function search() {
    var year =  $("#workingYear").val();
    getInfo(year,function(data){
        //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
    });
}

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getInfo(year,$callback){
    if(isEmpty(year)){
        //新增
        warningToast("请选择年度",1000);
        return;
    }else{
        //编辑
        var param={
            "workingYear":year
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.schedule + "/bacWorkingHours/getInfoByYear.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                form.val('bacWorkingHoursEdit_form', data);
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
    form.on('submit(bacWorkingHoursEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacWorkingHoursEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var year =  $("#workingYear").val();
        if(isEmpty(year)){
            warningToast("请选择年度");
            return;
        }
        var param=field; //表单的元素
        param.workingYear = year;
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.schedule + "/bacWorkingHours/saveOrEdit.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



