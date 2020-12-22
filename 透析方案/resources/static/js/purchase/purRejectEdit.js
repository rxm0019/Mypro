/**
 * purRejectEdit.ftl的js文件，包括查询，编辑操作
 */
var purRejectEdit = avalon.define({
    $id: "purRejectEdit",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,readonly: { readonly:true }
    ,requisitionId: GetQueryString("requisitionId") // 采购申请主键ID
    ,requisitionNo: GetQueryString("requisitionNo") // 采购申请单号
    ,rejectId: '' // 主键ID
    ,layEvent: GetQueryString("layEvent") // detail查看|reject编辑
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate = layui.laydate;
        laydate.render({
            elem: '#createTime'
            , type: 'date'
        });
        laydate.render({
            elem: '#updateTime'
            , type: 'date'
        });
        getRejectReasonId(purRejectEdit.requisitionNo);
        $('#purRejectEdit_form').attr('style', '');
        //获取实体信息
        if (purRejectEdit.layEvent === 'seeReason') {
            $('.edit-verify-span').hide();
            getInfo(purRejectEdit.rejectId, function (data) {
                //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
                //...
            });
        } else {
            purRejectEdit.readonly = { readonly:false }
        }

        avalon.scan();
    });
});

/**
 * 获取退回原因的记录ID
 * @param requisitionNo
 */
function getRejectReasonId(requisitionNo) {
    _ajax({
        type: "POST",
        loading: false,
        url: $.config.services.pharmacy + "/purReject/getRejectId.do",
        data: { requisitionNo: requisitionNo },
        dataType: "json",
        async: false,
        done: function (data) {
            purRejectEdit.rejectId = data;
        }
    });
}

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
            "rejectId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.pharmacy + "/purReject/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util = layui.util;
                data.createTime = util.toDateString(data.createTime, "yyyy-MM-dd");
                data.updateTime = util.toDateString(data.updateTime, "yyyy-MM-dd");
                form.val('purRejectEdit_form', data);
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
    form.on('submit(purRejectEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#purRejectEdit_submit").trigger('click');
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
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.pharmacy + "/purReject/saveOrEdit.do",
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



