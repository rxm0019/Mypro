/**
 * bacClassManageDoctorEdit.jsp的js文件，包括查询，编辑操作
 * 医生班种管理-新增编辑页面
 * @author: xcj
 * @version: 1.0
 * @date: 2020/08/06
 */
var bacClassManageDoctorEdit = avalon.define({
    $id: "bacClassManageDoctorEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    partNum:1, //动态添加时间范围控件数
    classWorked:0,//工时
    classWorkeds:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//默认工时数组
    classWorkedErr:"",//时段错误控件

});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        var form=layui.form; //调用layui的form模块
        laydate.render({
            elem: '#classPart1'
            ,type: 'time'
            ,range: true
            ,format: 'HH:mm'
            ,value:'00:00 - 00:00'
            ,done: function(value, date, endDate){
                var elemName = this.elem.selector;
                var index = parseInt(elemName.replace('#classPart',''));
                //如果控件选择了时间
                if(isNotEmpty(value)){
                    var min1=parseInt(value.substr(0,2))*60+parseInt(value.substr(3,2));
                    var min2=parseInt(value.substr(8,2))*60+parseInt(value.substr(11,2));
                    if(min1>min2){
                        warningToast("请设置正确的时间段！");
                        bacClassManageDoctorEdit.classWorkeds[index-1] = 0;
                        changeWorked();
                        bacClassManageDoctorEdit.classWorkedErr = elemName;
                        setTimeout(function(){
                            $(bacClassManageDoctorEdit.classWorkedErr).val("00:00 - 00:00");
                            bacClassManageDoctorEdit.classWorkedErr = "";
                        },300);
                    }else {
                        var classAttrSel =  $("select[name='classAttr']").val();
                        //如果是休息或者缺勤就设置00:00
                        if(classAttrSel == "2" || classAttrSel == "0"){
                            bacClassManageDoctorEdit.classWorkeds[index-1] = 0;
                            changeWorked();
                            bacClassManageDoctorEdit.classWorkedErr = elemName;
                            setTimeout(function(){
                                $(bacClassManageDoctorEdit.classWorkedErr).val("00:00 - 00:00");
                                bacClassManageDoctorEdit.classWorkedErr = "";
                            },300);
                            return false;
                        }
                        var time = (min2 - min1)/60;
                        bacClassManageDoctorEdit.classWorkeds[index-1] = parseFloat(time.toFixed(1));
                        changeWorked();
                    }
                }else {
                    //控件清空时间
                    bacClassManageDoctorEdit.classWorkeds[index-1] = 0;
                    changeWorked();
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
            $("#classPart1").val("00:00 - 00:00");
            $("div[name='addPart']").remove();
            var len = bacClassManageDoctorEdit.classWorkeds.length;
            for(var i=1;i<len;i++){
                bacClassManageDoctorEdit.classWorkeds[i] = 0;
            }
            bacClassManageDoctorEdit.partNum = 1;
            changeWorked();
            if(data.value == "2" || data.value == "0"){
                $("input[name='classPart1']").attr("disabled","disabled");
                $("#andSetTime").attr("disabled","disabled");
            }else{
                $("input[name='classPart1']").attr("disabled",false);
                $("#andSetTime").attr("disabled",false);
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
            url: $.config.services.schedule+"/bacClassManage/getManageDoctor.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;

                if(data.classAttr == "0" || data.classAttr == "2"){
                    data.classPart = "00:00 - 00:00";
                    data.classPart1 = "00:00 - 00:00";
                    bacClassManageDoctorEdit.classWorked = 0;
                }
                var refParts = data.classPart.split(",");
                if(refParts.length>1){
                    bacClassManageDoctorEdit.partNum = refParts.length;
                    for(var i=2;i<=bacClassManageDoctorEdit.partNum;i++) {
                        var partName = "classPart" + i;
                        var delPartName = "delPart" + i;
                        setTimePart(partName,delPartName);
                    }
                    for(var i=1;i<=bacClassManageDoctorEdit.partNum;i++) {
                        var partName = "classPart" + i;
                        data[partName] = refParts[i-1];
                        var min1=parseInt(refParts[i-1].substr(0,2))*60+parseInt(refParts[i-1].substr(3,2));
                        var min2=parseInt(refParts[i-1].substr(8,2))*60+parseInt(refParts[i-1].substr(11,2));
                        var time = (min2 - min1)/60;
                        bacClassManageDoctorEdit.classWorkeds[i-1] = parseFloat(time.toFixed(1));
                    }
                    changeWorked()
                }else{
                    data.classPart1 = data.classPart;
                    var min1=parseInt(data.classPart.substr(0,2))*60+parseInt(data.classPart.substr(3,2));
                    var min2=parseInt(data.classPart.substr(8,2))*60+parseInt(data.classPart.substr(11,2));
                    var time = (min2 - min1)/60;
                    bacClassManageDoctorEdit.classWorkeds[0] = parseFloat(time.toFixed(1));
                    changeWorked()
                }

                form.val('bacClassManageDoctorEdit_form', data);
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
    form.on('submit(bacClassManageDoctorEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacClassManageDoctorEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){

        //去掉被删除的时间段
        var classPart = "";
        for(var i=1;i<=bacClassManageDoctorEdit.partNum;i++) {
            var partId = "classPart" + i;
            var classParts = field[partId];
            if (isNotEmpty(classParts)) {
                if (isNotEmpty(classPart)) {
                    classPart = classPart + ",";
                    classPart = classPart + classParts;
                } else {
                    classPart = classPart + classParts;
                }
            }
        }
        var arrParts = classPart.split(",");
        //排序时间段
        for(var j=0;j<arrParts.length-1;j++){
            //两两比较，如果前一个比后一个大，则交换位置。
            for(var i=0;i<arrParts.length-1-j;i++){
                if(arrParts[i]>arrParts[i+1]){
                    var temp = arrParts[i];
                    arrParts[i] = arrParts[i+1];
                    arrParts[i+1] = temp;
                }
            }
        }
        //比较前后时间段是否重叠
        for(var j=0;j<arrParts.length;j++) {
            var part1 = arrParts[j];
            var min1=parseInt(part1.substr(8,2))*60+parseInt(part1.substr(11,2));
            if(j+1<arrParts.length){
                var part2 = arrParts[j+1];
                var min2=parseInt(part2.substr(0,2))*60+parseInt(part2.substr(3,2));
                if(min1>min2){
                    warningToast("时间段重叠，请设置正确的时间段！");
                    return;
                }
            }
        }
        //重新获取排序好的时间段给后台存储
        classPart = "";
        for(var j=0;j<arrParts.length;j++){
            var classParts = arrParts[j];
            if (isNotEmpty(classPart)) {
                classPart = classPart + ",";
                classPart = classPart + classParts;
            } else {
                classPart = classPart + classParts;
            }
        }

        //成功验证后
        var param=field; //表单的元素
        param.classPart = classPart;
        var url = "";
        if(isEmpty(param.classManageId)){
            url = $.config.services.schedule+"/bacClassManage/addDoctor.do";
        }else{
            url = $.config.services.schedule+"/bacClassManage/editDoctor.do";
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

/**
 * 动态添加时间控件
 * @returns {boolean}
 */
function addSetTime() {
    if(bacClassManageDoctorEdit.partNum +1>12){
        warningToast("设置时段过多！");
        return false;
    }
    var classAttrSel =  $("select[name='classAttr']").val();
    if(classAttrSel == "2" || classAttrSel == "0"){
        return false;
    }
    bacClassManageDoctorEdit.partNum = bacClassManageDoctorEdit.partNum +1;
    var partName = "classPart" + bacClassManageDoctorEdit.partNum;
    var delPartName = "delPart" + bacClassManageDoctorEdit.partNum;
    setTimePart(partName,delPartName);
}

function delSetTime(obj) {
    var name = obj.name;
    var index = parseInt(name.replace('delPart',''));
    bacClassManageDoctorEdit.classWorkeds[index-1] = 0;
    changeWorked();
    $(obj).parent().remove();
}

/**
 * 工时赋值
 */
function changeWorked() {
    var work = 0;
    $.each(bacClassManageDoctorEdit.classWorkeds,function(i,item){
        work = work + item;
    });
    var classAttrSel =  $("select[name='classAttr']").val();
    if(classAttrSel == "2" || classAttrSel == "0"){
        bacClassManageDoctorEdit.classWorked = 0;
    }else{
        bacClassManageDoctorEdit.classWorked = work;
    }

}

/**
 * 动态添加时间控件
 * @param partName
 */
function setTimePart(partName,delPartName) {
    var  content=
        '<div class="disui-form-flex" name="addPart">'+
        '<label class="layui-form-label"> </label>'+
        '<input type="text" name="'+partName+'" id="'+partName+'" lay-verify="required" lay-verify-msg="请选择时段" placeholder="HH:mm"  autocomplete="off" >' +
        '<button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach layui-btn layui-btn-dismain delPart" name="'+delPartName+'" id="'+delPartName+'"  onclick="delSetTime(this)"><i class="layui-icon layui-icon-subtraction"></i></button>'+
        '</div>';
    $("#addPartTime").before(content);
    avalon.scan();
    var laydate=layui.laydate;
    laydate.render({
        elem: '#'+partName
        ,type: 'time'
        ,range: true
        ,format: 'HH:mm'
        ,value:'00:00 - 00:00'
        ,done: function(value, date, endDate){
            var elemName = this.elem.selector;
            var index = parseInt(elemName.replace('#classPart',''));
            if(isNotEmpty(value)){
                var min1=parseInt(value.substr(0,2))*60+parseInt(value.substr(3,2));
                var min2=parseInt(value.substr(8,2))*60+parseInt(value.substr(11,2));
                if(min1>min2){
                    warningToast("请设置正确的时间段！");
                    bacClassManageDoctorEdit.classWorkeds[index-1] = 0;
                    changeWorked();
                    bacClassManageDoctorEdit.classWorkedErr = elemName;
                    setTimeout(function(){
                        $(bacClassManageDoctorEdit.classWorkedErr).val("00:00 - 00:00");
                        bacClassManageDoctorEdit.classWorkedErr = "";
                    },300);
                }else {
                    var classAttrSel =  $("select[name='classAttr']").val();
                    //如果是休息或者缺勤就设置00:00
                    if(classAttrSel == "2" || classAttrSel == "0"){
                        bacClassManageDoctorEdit.classWorkeds[index-1] = 0;
                        changeWorked();
                        bacClassManageDoctorEdit.classWorkedErr = elemName;
                        setTimeout(function(){
                            $(bacClassManageDoctorEdit.classWorkedErr).val("00:00 - 00:00");
                            bacClassManageDoctorEdit.classWorkedErr = "";
                        },300);
                        return false;
                    }
                    var time = (min2 - min1)/60;
                    bacClassManageDoctorEdit.classWorkeds[index-1] = parseFloat(time.toFixed(1));
                    changeWorked();
                }
            }else {
                bacClassManageDoctorEdit.classWorkeds[index-1] = 0;
                changeWorked();
            }
        }
    });
}


