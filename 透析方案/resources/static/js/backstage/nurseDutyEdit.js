/**
 * nurseDutyEdit.jsp的js文件，包括查询，编辑操作
 * 护士排班主页面-点击单元格编辑
 * @author: xcj
 * @version: 1.0
 * @date: 2020/08/17
 */
var nurseDutyEdit = avalon.define({
    $id: "nurseDutyEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    userId:'',
    userName:'',
    classTemplateId:'', //班种id
    dutyDate:'',
    editType:'',//新增or更新
    bedId:[], //区组id数组
    classManageList:[], //班种下拉列表
    sysUserList:[], //医生下拉列表
    regionSettingList:[], //区组列表
});

layui.use(['index','formSelects'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        nurseDutyEdit.userId=GetQueryString("userId");  //接收变量
        nurseDutyEdit.userName=GetQueryString("userName");  //接收变量
        nurseDutyEdit.classTemplateId=GetQueryString("classManageId");  //接收变量
        nurseDutyEdit.dutyDate=GetQueryString("dutyDate");  //接收变量
        nurseDutyEdit.editType=GetQueryString("editType");  //接收变量
        var bedId = GetQueryString("bedId");  //接收变量
        if(isNotEmpty(bedId)){
            nurseDutyEdit.bedId = bedId.split(",");
        }

        //获取实体信息
        getInfo(function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
            if(nurseDutyEdit.editType == "1"){
                $("input[name='changeType']").attr("disabled","disabled");
            }
        });
        var form=layui.form; //调用layui的form模块
        form.on('radio(changeType)', function (data) {
            var type=data.value;
            if(type == "0"){
                $("#hideTpl").removeClass("layui-hide");
                $("#hideName").removeClass("layui-hide");
                $("#hideBed").removeClass("layui-hide");
                $("#hidePer").addClass("layui-hide");
            }else{
                $("#hidePer").removeClass("layui-hide");
                $("#hideTpl").addClass("layui-hide");
                $("#hideName").addClass("layui-hide");
                $("#hideBed").addClass("layui-hide");
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
        "userId":nurseDutyEdit.userId,
        "dutyDate":nurseDutyEdit.dutyDate,
        "manageType":"1" //护士非删除数据
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.schedule + "/bacClassManage/listDutyEditNurse.do",
        data:param,
        dataType: "json",
        done:function(data){
            debugger
            nurseDutyEdit.classManageList.pushArray(data.ClassManage);
            nurseDutyEdit.sysUserList.pushArray(data.SysUser);
            nurseDutyEdit.regionSettingList.pushArray(data.RegionSetting);
            var setData = {
                "userId":nurseDutyEdit.userId,
                "dutyDate":nurseDutyEdit.dutyDate,
                "userName":nurseDutyEdit.userName,
                "classManageId":nurseDutyEdit.classTemplateId
            }

            var formSelects=layui.formSelects; //调用layui的form模块
            //以下方式则重新渲染所有的已存在多选
            //渲染下拉多选
            formSelects.data('bedId', 'local', {
                arr:nurseDutyEdit.regionSettingList
            });
            formSelects.value('bedId', nurseDutyEdit.bedId);//要选中的值，

            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            form.val('nurseDutyEdit_form',setData);
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
    form.on('submit(nurseDutyEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#nurseDutyEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        debugger
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
        if(nurseDutyEdit.editType == "0"){
            param.editType = "0"; //更新操作
        }
        if(nurseDutyEdit.editType == "1"){
            param.editType = "1"; //新增操作
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.schedule + "/bacClassDuty/updateDutyNurse.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



