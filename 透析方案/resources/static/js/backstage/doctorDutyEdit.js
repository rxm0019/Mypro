/**
 * doctorDutyEdit.jsp的js文件，包括查询，编辑操作
 * 医生排班主页面-点击单元格编辑
 * @author: xcj
 * @version: 1.0
 * @date: 2020/08/10
 */
var doctorDutyEdit = avalon.define({
    $id: "doctorDutyEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    userId:'',
    userName:'',
    classTemplateId:'',
    dutyDate:'',
    editType:'',//新增or更新
    classManageList:[], //班种下拉列表
    sysUserList:[], //医生下拉列表
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        doctorDutyEdit.userId=GetQueryString("userId");  //接收变量
        doctorDutyEdit.userName=GetQueryString("userName");  //接收变量
        doctorDutyEdit.classTemplateId=GetQueryString("classManageId");  //接收变量
        doctorDutyEdit.dutyDate=GetQueryString("dutyDate");  //接收变量
        doctorDutyEdit.editType=GetQueryString("editType");  //接收变量
        //获取实体信息
        getInfo(function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
            if(doctorDutyEdit.editType == "1"){
                $("input[name='changeType']").attr("disabled","disabled");
            }
        });
        var form=layui.form; //调用layui的form模块
        form.on('radio(changeType)', function (data) {
            var type=data.value;
            if(type == "0"){
                $("#hideTpl").removeClass("layui-hide");
                $("#hidePer").addClass("layui-hide");
                $("#hideName").removeClass("layui-hide");
            }else{
                $("#hidePer").removeClass("layui-hide");
                $("#hideTpl").addClass("layui-hide");
                $("#hideName").addClass("layui-hide");
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
function  getInfo($callback){
    var param={
        "userId":doctorDutyEdit.userId,
        "dutyDate":doctorDutyEdit.dutyDate,
        "manageType":"1" //医生非删除数据
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.schedule + "/bacClassManage/listDutyEditDoctor.do",
        data:param,
        dataType: "json",
        done:function(data){
            doctorDutyEdit.classManageList.pushArray(data.ClassManage);
            doctorDutyEdit.sysUserList.pushArray(data.SysUser);
            var setData = {
                "userId":doctorDutyEdit.userId,
                "dutyDate":doctorDutyEdit.dutyDate,
                "userName":doctorDutyEdit.userName,
                "classManageId":doctorDutyEdit.classTemplateId
            }
            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            form.val('doctorDutyEdit_form',setData);
            typeof $callback === 'function' && $callback(); //返回一个回调事件
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
    form.on('submit(doctorDutyEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#doctorDutyEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        if(field.changeType == "0"){
            if(isEmpty(field.classManageId)){
                warningToast("请选择班种");
                return false;
            }
        }else {
            if(isEmpty(field.changeUserId)){
                warningToast("请选择交换医生");
                return false;
            }
        }
        //成功验证后
        var param=field; //表单的元素
        if(doctorDutyEdit.editType == "0"){
            param.editType = "0"; //更新操作
        }
        if(doctorDutyEdit.editType == "1"){
            param.editType = "1"; //新增操作
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.schedule + "/bacClassDuty/updateDutyDoctor.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



