/**
 * bacClassManageNurseEdit.jsp的js文件，包括查询，编辑操作
 * 护士班种管理-新增编辑页面
 * @author: xcj
 * @version: 1.0
 * @date: 2020/08/14
 */
var bacClassManageNurseEdit = avalon.define({
    $id: "bacClassManageNurseEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    classWorked:0,//工时
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        var form=layui.form; //调用layui的form模块
        laydate.render({
            elem: '#classPart'
            ,type: 'time'
            ,range: true
            ,format: 'HH:mm'
            ,value:'00:00 - 00:00'
            ,done: function(value, date, endDate){
                var elemName = this.elem.selector;
                if(isNotEmpty(value)){
                    var min1=parseInt(value.substr(0,2))*60+parseInt(value.substr(3,2));
                    var min2=parseInt(value.substr(8,2))*60+parseInt(value.substr(11,2));
                    if(min1>min2){
                        warningToast("请设置正确的时间段！");
                        bacClassManageNurseEdit.classWorked = 0;
                        setTimeout(function(){
                            $('#classPart').val("00:00 - 00:00");
                        },300);
                    }else {
                        var classAttrSel =  $("select[name='classAttr']").val();
                        //如果是休息或者缺勤就设置00:00
                        if(classAttrSel == "2" || classAttrSel == "0"){
                            bacClassManageNurseEdit.classWorked = 0;
                            setTimeout(function(){
                                $('#classPart').val("00:00 - 00:00");
                            },300);
                            return false;
                        }
                        var time = (min2 - min1)/60;
                        bacClassManageNurseEdit.classWorked = time;
                    }
                }else {
                    bacClassManageNurseEdit.classWorked = 0;
                }
            }
        });
        var id=GetQueryString("id");  //接收变量
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });

        // 选择下拉框后触发
        form.on('select(classAttr)', function(data){
            if(data.value == "2" || data.value == "0"){
                bacClassManageNurseEdit.classWorked = 0;
                $("#classPart").val("00:00 - 00:00");
                $("input[name='classPart']").attr("disabled","disabled");
            }else {
                $("input[name='classPart']").attr("disabled",false);
            }
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
            "classManageId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.schedule+"/bacClassManage/getManageNurse.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                form.val('bacClassManageNurseEdit_form', data);
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
    form.on('submit(bacClassManageNurseEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacClassManageNurseEdit_submit").trigger('click');
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

        var url = "";
        if(isEmpty(param.classManageId)){
            url = $.config.services.schedule+"/bacClassManage/addNurse.do";
        }else{
            url = $.config.services.schedule+"/bacClassManage/editNurse.do";
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



