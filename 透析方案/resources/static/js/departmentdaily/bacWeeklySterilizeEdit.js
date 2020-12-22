/**
 * bacWeeklySterilizeEdit.jsp的js文件，包括查询，编辑操作
 * @author carl
 * @date 2020/08/11
 * @description 每周消毒编辑页面。
 * @version 1.0
 */
var bacWeeklySterilizeEdit = avalon.define({
    $id: "bacWeeklySterilizeEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    sterilizeUser:baseFuncInfo.userInfoData.username, //消毒人，默认当前登陆者
    wardList:getWardList(), //获取病区列表
    areaSterilize:"", //病区
    regionList:[],  //区域列表
    regionSterilize:"", //区域
    readonly:{readonly: false}, //只读
    disabled: {disabled: false} //禁用

});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        var form = layui.form;
        laydate.render({
            elem: '#sterilizeDate'
            ,type: 'date'
            ,trigger: 'click'
        });
        var id=GetQueryString("id");  //接收变量
        var readonly = GetQueryString("readonly");
        if (readonly == 'true'){
            bacWeeklySterilizeEdit.readonly = {readonly:true}
            bacWeeklySterilizeEdit.disabled = {disabled:true}
        }

        //获取实体信息
        getInfo(id,function(data){

        });

        //监听名称下拉事件
        form.on('select(areaSterilize)', function(data){
            bacWeeklySterilizeEdit.areaSterilize = data.value;
            form.val("bacWeeklySterilizeEdit_form",{
                areaSterilize:data.value
            })
            form.render();

        });

        //监听区域下拉
        form.on('select(regionSterilize)', function(data){
            bacWeeklySterilizeEdit.regionSterilize = data.value;
            form.render();
        });
        avalon.scan();
    });
});

bacWeeklySterilizeEdit.$watch('areaSterilize', function (val) {
    getRegionList(val);
    bacWeeklySterilizeEdit.regionSterilize = "";
    layui.form.render();
})
//获取病区列表
function getWardList(){
    var param = {
        dataStatus:"0",
    };
    _ajax({
        type: "POST",
        async:false,
        url: $.config.services.platform + "/basWardSetting/getLists.do",
        data:param,
        dataType: "json",
        done:function(data){
            bacWeeklySterilizeEdit.wardList = data;
        }
    });
}

//获取区域列表
function getRegionList(data){
    var param = {
        dataStatus:"0",//初始化查询参数，排除标记已删除的数据
        wardId:data
    };
    _ajax({
        type: "POST",
        async:false,
        url: $.config.services.platform + "/basRegionSetting/getLists.do",
        data:param,
        dataType: "json",
        done:function(data){
            bacWeeklySterilizeEdit.regionList = data;
        }
    });
}

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
            "weeklySterilizeId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics+"/bacWeeklySterilize/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.sterilizeDate=util.toDateString(data.sterilizeDate,"yyyy-MM-dd");
                bacWeeklySterilizeEdit.areaSterilize = data.areaSterilize;
                bacWeeklySterilizeEdit.regionSterilize = data.regionSterilize;
                getRegionList(data.areaSterilize);
                form.val('bacWeeklySterilizeEdit_form', data);
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
    form.render();
    form.on('submit(bacWeeklySterilizeEdit_submit)', function(data){
debugger;
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacWeeklySterilizeEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field;
        var url = $.config.services.logistics + "/bacWeeklySterilize/edit.do";
        if(field.weeklySterilizeId === null || field.weeklySterilizeId === ''){
            //新增
            url = $.config.services.logistics + "/bacWeeklySterilize/save.do"
        }
        _ajax({
            type: "POST",
            url:url,
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



