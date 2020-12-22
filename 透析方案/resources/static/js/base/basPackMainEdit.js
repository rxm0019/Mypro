/**
 * 治疗打包明细
 * @author: Rain
 * @version: 1.0
 * @date: 2020/08/25
 */
var basPackMainEdit = avalon.define({
    $id: "basPackMainEdit",
    baseFuncInfo: baseFuncInfo,  //底层基本方法
    packMethodSelect: baseFuncInfo.getSysDictByCode('Pack'), //打包方式
    packKeySelect: baseFuncInfo.getSysDictByCode('Route'), //名称
    packMethodSelected: "0", //选中的打包方式
    packKeySelected: "" //选中的名称
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id = GetQueryString("id");  //接收变量
        //获取实体信息
        getInfo(id, function (data) {
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });
        var form = layui.form;
        //监听类型下拉事件
        form.on('select(packMethod)', function (data) {
            basPackMainEdit.packMethodSelected = data.value;
        });
        avalon.scan();
    });
});
/**
 * 类型选择变化事件，用于查询对应字典，并渲染名称选择下拉框
 */
basPackMainEdit.$watch('packMethodSelected', function (val) {
    basPackMainEdit.packKeySelect = getSysDictByCode(val);
    basPackMainEdit.packKeySelected = '';
    layui.form.render('select');
})


/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(id, $callback) {
    if (isEmpty(id)) {
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    } else {
        //编辑
        var param = {
            "packMainId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + "/basPackMain/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                basPackMainEdit.packKeySelect = getSysDictByCode(data.packMethod);
                form.val('basPackMainEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}


/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(basPackMainEdit_submit)', function (data) {
        debugger
        //通过表单验证后
        var field = {
            "packMethod": data.field.packMethod,
            "packKeyName": baseFuncInfo.getSysDictName(data.field.packMethod, data.field.packKey),
            "packKey": data.field.packKey,
            "packMainId": data.field.packMainId,
        }; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#basPackMainEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        
        var param = field; //表单的元素
        var url = $.config.services.platform + "/basPackMain/edit.do";
        var id = GetQueryString("id");
        if (isEmpty(id)) {
            url = $.config.services.platform + "/basPackMain/save.do";
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}




