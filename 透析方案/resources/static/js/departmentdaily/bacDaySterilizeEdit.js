/**
 * bacDaySterilizeEdit.jsp的js文件，包括查询，编辑操作
 * @author carl
 * @date 2020/08/11
 * @description 每日消毒编辑页面。
 * @version 1.0
 */
var bacDaySterilizeEdit = avalon.define({
    $id: "bacDaySterilizeEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    areaSterilizeSelect:[
        {"name":"清洁区","value":"cleanRoom"}
        ,{"name":"半清洁区","value":"halfCleanRoom"}
        ,{"name":"污染区","value":"pollutionRoom"}
        ,{"name":"病历车","value":"MedicalRecordCar"}], // 定义的消毒区域类型
    areaSterilizeSelected:"cleanRoom", //选中的消毒区域类型
    areaNameSelect:baseFuncInfo.getSysDictByCode('cleanRoom'), //查询字典档的消毒区域名称
    areaNameSelected:'', //选中的消毒区域名称
    described:"", //消毒区域描述。
    sterilizeUser:baseFuncInfo.userInfoData.username, //消毒人
    readonly:{readonly: false}, //只读
    disabled: {disabled: false} //禁用
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        laydate.render({
            elem: '#sterilizeDate'
            ,type: 'date'
            ,trigger: 'click'
        });
        var id=GetQueryString("id");  //接收变量
        var readonly = GetQueryString("readonly");
        if (readonly == 'true'){
            bacDaySterilizeEdit.readonly = {readonly:true}
            bacDaySterilizeEdit.disabled = {disabled:true}
        }

        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });
        var form = layui.form;
        //监听类型下拉事件
        form.on('select(areaSterilize)', function(data){
            bacDaySterilizeEdit.areaSterilizeSelected = data.value;
        });
        //监听名称下拉事件
        form.on('select(areaName)', function(data){
            bacDaySterilizeEdit.areaNameSelected = data.value;
        });


        avalon.scan();
    });
});
/**
 * 类型选择变化事件，用于查询对应字典，并渲染名称选择下拉框
 */
bacDaySterilizeEdit.$watch('areaSterilizeSelected', function (val) {
    bacDaySterilizeEdit.areaNameSelect = getSysDictByCode(val);
    bacDaySterilizeEdit.areaNameSelected = '';
    bacDaySterilizeEdit.described = '';
    layui.form.render('select');
})

/**
 * 名称选择变化事件，用于查询对应字典
 */
bacDaySterilizeEdit.$watch('areaNameSelected',function (val) {

    if(val === ''){
        return;
    }
    //查询选择值对应的name
    var lab = '';
    for(var dict in bacDaySterilizeEdit.areaNameSelect){
        console.log(bacDaySterilizeEdit.areaNameSelect[dict])
        if(bacDaySterilizeEdit.areaNameSelect[dict].value === val){
            lab = bacDaySterilizeEdit.areaNameSelect[dict].name;
        }
    }

    //请求字典档获取字典描述
    var param={
        "sysDict.dictType":bacDaySterilizeEdit.areaSterilizeSelected,
        "dictDataName":lab,
        "dictDataValue":val,
        "page.pageNum":1,
        "page.pageSize":20
    }
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system+"/sysDictData/list.do",
        data:param,
        dataType: "json",
        done:function(data){
            console.log(data);
            for(var dict in data){

                //将描述带入表单
                bacDaySterilizeEdit.described = data[dict].dictDataDesc
            }
        }
    });
})




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
            "daySterilizeId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics+"/bacDaySterilize/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.sterilizeDate=util.toDateString(data.sterilizeDate,"yyyy-MM-dd");
                bacDaySterilizeEdit.areaNameSelect = getSysDictByCode(data.areaSterilize);
                form.val('bacDaySterilizeEdit_form', data);
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
    form.on('submit(bacDaySterilizeEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacDaySterilizeEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        var param=field;
        var url = $.config.services.logistics + "/bacDaySterilize/edit.do";
        if(field.daySterilizeId === null || field.daySterilizeId === ''){
            //新增
            url = $.config.services.logistics + "/bacDaySterilize/save.do"
        }
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



