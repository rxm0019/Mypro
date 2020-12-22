/**
 * diaEduShow.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 透析管理--健康教育
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/10
 */
var diaEduShow = avalon.define({
    $id: "diaEduShow",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    eduBaseId:'',//教育主题id
    patientId:'',//患者id
    isSave:false,//是否可保存

});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {

        var eduBaseId = GetQueryString("eduBaseId");  //接收变量
        var patientId = GetQueryString("patientId");  //接收变量

        if(isNotEmpty(eduBaseId)){
            diaEduShow.eduBaseId = eduBaseId;
            getInfo(eduBaseId,function(data){

            });
        }
        if(isNotEmpty(patientId)){
            diaEduShow.patientId = patientId;
            diaEduShow.isSave = true;
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
function  getInfo(id,$callback){
    //编辑
    var param={
        "eduBaseId":id
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/diaEdu/getThemeInfo.do",
        data:param,
        dataType: "json",
        done:function(data){
            $("#content").html(data.eduBaseContent);
           // form.val('diaEduShow_form', data);
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}

/**
 * 完成宣教，保存宣教记录，保存人和测评人不能相同
 * 宣教方式为现场教育
 */
function saveTeach() {
    var param={
        "eduBaseId":diaEduShow.eduBaseId,
        "patientId":diaEduShow.patientId,
        "teachMethod":$.constant.educationMethod.SCENE
    };

    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/diaEdu/saveTeach.do",
        data:param,
        dataType: "json",
        done:function(data){
            successToast("保存成功");
            if (window.parent.onRefreshRecordOption) {
                window.parent.onRefreshRecordOption();
            }
            diaEduShow.isSave = false;
            //关闭弹窗
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
            avalon.scan();
        }
    });
}