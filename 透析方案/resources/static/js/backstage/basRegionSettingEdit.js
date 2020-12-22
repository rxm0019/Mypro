/**
 * 区域设置-新增、编辑
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/06
 */
var basRegionSettingEdit = avalon.define({
    $id: "basRegionSettingEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    wardList: [], //病区列表
    readonly: {readonly: false}, // 设置只读
    regionIdReadonly: {readonly: false}, // 设置只读
    disabled:{disabled: false} // 设置只读
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        laydate.render({
            elem: '#createTime'
            ,type: 'date'
        });
        laydate.render({
            elem: '#updateTime'
            ,type: 'date'
        });
        var id=GetQueryString("id");  //接收变量
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        if (layEvent === 'detail') {
            basRegionSettingEdit.readonly = {readonly: true};
            basRegionSettingEdit.disabled = {disabled: true};
            $('input[type="radio"]').prop('disabled', true);
        }else if (layEvent === 'edit') {
            basRegionSettingEdit.wardSettingId = {readonly: true};
            basRegionSettingEdit.regionIdReadonly = {readonly: true};
        }
        getWardList(function(data){
        });
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });
        avalon.scan();
    });
});

//获取病区列表
function getWardList($callback){
    var param = {
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.platform + "/basWardSetting/getLists.do",
        data:param,
        dataType: "json",
        done:function(data){
            basRegionSettingEdit.wardList = data;
            var form=layui.form; //调用layui的form模块
            form.render();
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
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
            "regionSettingId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform+"/basRegionSetting/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.createTime=util.toDateString(data.createTime,"yyyy-MM-dd");
                data.updateTime=util.toDateString(data.updateTime,"yyyy-MM-dd");
                form.val('basRegionSettingEdit_form', data);
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
    form.on('submit(basRegionSettingEdit_submit)', function(data){
        //检验只能输入正整数
        var numberReg = /^[+]{0,1}(\d+)$/;
        if(isNotEmpty(data.field.orderNo) && !numberReg.test(data.field.orderNo)){
            errorToast("排列顺序只能输入正整数！");
        }else{
            //通过表单验证后
            var field = data.field; //获取提交的字段
            typeof $callback === 'function' && $callback(field); //返回一个回调事件
        }
    });
    $("#basRegionSettingEdit_submit").trigger('click');
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
        //判断是否存在主键ID，不存在执行新增否则为编辑
        var url = '';
        if(param.regionSettingId.length == 0){
            url = $.config.services.platform + "/basRegionSetting/save.do";
        }else{
            url = $.config.services.platform + "/basRegionSetting/edit.do";
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



