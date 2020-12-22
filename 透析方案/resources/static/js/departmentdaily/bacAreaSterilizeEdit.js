/**
 * bacAreaSterilizeEdit.jsp的js文件，包括查询，编辑操作
 * @author Chauncey
 * @date 2020/08/20
 * @description 区域消毒编辑。
 * @version 1.0
 */
var bacAreaSterilizeEdit = avalon.define({
    $id: "bacAreaSterilizeEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    sterilizeUser:baseFuncInfo.userInfoData.username,//当前登陆者
    readonly: {readonly: false}, // 设置只读
    disabled: {disabled: false}, // 设置只读
    wardList:getWardList(),
    areaSterilize:"",
    regionList:[],
    regionSterilize:"",
    createBy: "", //创建人
    createTime: "" //创建时间

});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        var form = layui.form;
        laydate.render({
            elem: '#startSterilizeTime'
            ,type: 'time'
            ,trigger: 'click'
        });
        laydate.render({
            elem: '#endSterilizeTime'
            ,type: 'time'
            ,trigger: 'click'
        });
        laydate.render({
            elem: '#sterilizeDate'
            ,type: 'date'
            ,trigger: 'click'
        });
        //接收变量
        var id=GetQueryString("id");
        // 接收变量layEvent
        bacAreaSterilizeEdit.layEvent = GetQueryString("layEvent");
        if (bacAreaSterilizeEdit.layEvent === 'detail') {
            bacAreaSterilizeEdit.readonly = {readonly: true};
            bacAreaSterilizeEdit.disabled = {disabled:true};
            //$('input[type="select"]').prop('disabled', true);
        }
        //获取实体信息
        getInfo(id,function(data){
        });

        //监听名称下拉事件
        form.on('select(areaSterilize)', function(data){
            bacAreaSterilizeEdit.areaSterilize = data.value;
            form.val("bacWeeklySterilizeEdit_form",{
                areaSterilize:data.value
            })
            form.render();

        });

        form.on('select(regionSterilize)', function(data){
            bacAreaSterilizeEdit.regionSterilize = data.value;
            form.render();
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
            "areaSterilizeId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/bacAreaSterilize/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.startSterilizeTime= data.startSterilizeTime ==null ? "" : util.toDateString(data.startSterilizeTime,"HH:mm:ss");
                data.endSterilizeTime=data.endSterilizeTime == null ? "" : util.toDateString(data.endSterilizeTime,"HH:mm:ss");
                data.sterilizeDate=data.sterilizeDate == null ? "" : util.toDateString(data.sterilizeDate,"yyyy-MM-dd");
                bacAreaSterilizeEdit.areaSterilize = data.areaSterilize;
                bacAreaSterilizeEdit.regionSterilize = data.regionSterilize;
                getRegionList(data.areaSterilize);
                bacAreaSterilizeEdit.createBy = data.createBy;
                bacAreaSterilizeEdit.createTime =  data.createTime ;
                form.val('bacAreaSterilizeEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

bacAreaSterilizeEdit.$watch('areaSterilize', function (val) {
    getRegionList(val);
    bacAreaSterilizeEdit.regionSterilize = "";
    layui.form.render();
})
//获取病区列表
function getWardList(){
    var param = {
        dataStatus:"0",
        //hospitalNo:baseFuncInfo.userInfoData.hospitalNo//登录功能完善后再获取，现在undefined
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        async:false,
        url: $.config.services.platform + "/basWardSetting/getLists.do",
        data:param,
        dataType: "json",
        done:function(data){
            bacAreaSterilizeEdit.wardList = data;
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
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.platform + "/basRegionSetting/getLists.do",
        data:param,
        dataType: "json",
        done:function(data){
            bacAreaSterilizeEdit.regionList = data;
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
    form.on('submit(bacAreaSterilizeEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        field.createBy = bacAreaSterilizeEdit.createBy;
        field.createTime = layui.util.toDateString(bacAreaSterilizeEdit.createTime);
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacAreaSterilizeEdit_submit").trigger('click');
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
        //跳转的URL
        var url = '';
        if (param.areaSterilizeId.length == 0) {
            url = $.config.services.logistics + "/bacAreaSterilize/save.do"
        } else {
            url = $.config.services.logistics + "/bacAreaSterilize/edit.do"
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



