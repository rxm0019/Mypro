/**
 * bacPeopleRecordsEdit.jsp的js文件，包括查询，编辑操作
 * @author carl
 * @date 2020/08/10
 * @description 人员管理编辑页面
 * @version 1.0
 */

var myFunction = {
    whetherFun:function() {
        var dicts = [];
        dicts.push({value:'N', name: "否"});
        dicts.push({value:'Y', name: "是"});
        return dicts;
    }
}
var bacPeopleRecordsEdit = avalon.define({
    $id: "bacPeopleRecordsEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    myFun:myFunction,
    peopletype:GetQueryString("peopletype"), //人员类型变量
    doctor: '0' == GetQueryString("peopletype"), // 医生
    nurse: '1' == GetQueryString("peopletype"), // 护士
    admin: '2' == GetQueryString("peopletype"), // 行政人员
    readonly:{readonly: false}, //只读
    disabled: {disabled: false}, //禁用
    disabledVal:false
});

var nowDate = new Date();//获取当前时间
var defaultDate = nowDate.getFullYear()-30 + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();//当前时间的年份减去30年，生日的默认日期
//var minDate =  nowDate.getFullYear()-100 + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
function getFormatDate(date){
    return date.getFullYear()+"-"+(date.getMonth() + 1)+"-"+date.getDate();
}

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        laydate.render({
            elem: '#birthday'
            ,value:defaultDate
            //,min:minDate
            //,max:getFormatDate(nowDate)
            ,isInitValue: false
            ,type: 'date'
            ,theme: 'dis'
            ,trigger: 'click'
        });
        laydate.render({
            elem: '#hiredate'
            ,type: 'date'
            ,trigger: 'click'
        });
        var id=GetQueryString("id");  //接收变量
        var readonly = GetQueryString("readonly");
        if (readonly == 'true'){
            bacPeopleRecordsEdit.readonly = {readonly:true}
            bacPeopleRecordsEdit.disabled = {disabled:true}
            bacPeopleRecordsEdit.disabledVal = true
        }
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
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
function  getInfo(id,$callback,peopletype){
    if(isEmpty(id)){
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    }else{
        //编辑
        var param={
            "peopleRecordsId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics +"/bacPeopleRecords/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.birthday= isNotEmpty(data.birthday) ? util.toDateString(data.birthday,"yyyy-MM-dd") :"";
                data.hiredate= isNotEmpty(data.hiredate) ? util.toDateString(data.hiredate,"yyyy-MM-dd") : "";
                form.val('bacPeopleRecordsEdit_form', data);
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
    form.on('submit(bacPeopleRecordsEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段

        dis_verify_form(field,$callback)

        //typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacPeopleRecordsEdit_submit").trigger('click');
}

function isEmpty(obj){
    return (typeof obj === 'undefined' || obj === null || obj === "");
}
function isNotEmpty(obj){
    return !isEmpty(obj);
}

function dis_verify_form(field,$callback) {
    var errMsg = [];
    var idCardReg = /^[A-Za-z0-9]{10,18}$/;
    var numberReg = /^[0-9]+(.[0-9])*$/;
    var integerReg = /^[0-9]+$/;
    if(isEmpty(field.name) ){
        errMsg.push("姓名不能为空");
    }else if(field.name.length > 20) {
        errMsg.push("姓名仅限20个字符");
    }
    if(field.birthplace.length > 100){
        errMsg.push("籍贯仅限100个字符");
    }
    if(isNotEmpty(field.clinicalYear) && !numberReg.test(field.clinicalYear)){
        errMsg.push("临床年资只能输入数字,且仅能有一位小数");
    }

    if(field.clinicalYear >100){
        errMsg.push("临床年资不能大于100");
    }
    if(isNotEmpty(field.hemodialysisYear) && !numberReg.test(field.hemodialysisYear)){
        errMsg.push("血透年资只能输入数字,且仅能有一位小数");
    }
    if(field.hemodialysisYear >100){
        errMsg.push("血透年资不能大于100");
    }
    if(isNotEmpty(field.idcardNo) && field.idcardType == '1' && !idCardReg.test(field.idcardNo)){
        errMsg.push("身份证不合法，仅支持国内15-18位身份证以及港澳台10位身份证");
    }
    if(field.idcardNo.length > 30){
        errMsg.push("证件号码仅限30个字符");
    }

    if(isNotEmpty(field.idcardNo) && isEmpty(field.idcardType)){
        errMsg.push("填写证件号码后必须选择证件类型");
    }

    if(isNotEmpty(field.examine) && !integerReg.test(field.examine)){
        errMsg.push("考核次数只能输入正整数");
    }



    if(errMsg.length > 0){
        var layer=layui.layer; //调用layui的form模块

        errMsg = ['表单验证错误' + "："].concat(errMsg).join('<br/>');
        warningToast(errMsg);
        return false;
    }
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
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
        var url = $.config.services.logistics + "/bacPeopleRecords/edit.do";
        if(field.peopleRecordsId === null || field.peopleRecordsId === ''){
            //新增
            url = $.config.services.logistics + "/bacPeopleRecords/save.do"
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



