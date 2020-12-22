/**
 * 供应商管理明细
 * @author: Rain
 * @version: 1.0
 * @date: 2020/08/10
 */
var basSupplierManagementEdit = avalon.define({
    $id: "basSupplierManagementEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    readonly: {readonly: false}, // 文本框设置只读
    supplierCode: {readonly: false},
    supplierNo:"",
    isNumber:""
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id = GetQueryString("id");  //接收变量
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        if (layEvent === 'detail') {
            basSupplierManagementEdit.readonly = {readonly: true};
            basSupplierManagementEdit.supplierCode = {readonly: true};
            $('input[type="radio"]').prop('disabled', true);
        } else if (layEvent === 'edit') {
            basSupplierManagementEdit.supplierCode = {readonly: true};
        }else if(layEvent==null){
            isAutoNumber();
        }
        //获取实体信息
        getInfo(id, function (data) {
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });
        avalon.scan();
    });
});
/**
 * 是否自动编号(当前中心)
 */
function isAutoNumber() {
    _ajax({
        type: "POST",
        loading: false,
        url: $.config.services.system + "/sysHospital/hospitalList.do",
        dataType: "json",
        async: false,
        done: function (data) {
            if (data.isNumber === 'Y') {
                basSupplierManagementEdit.isNumber = data.isNumber
                basSupplierManagementEdit.supplierCode = {readonly: true}; // 新增时设置只读
                // 按编码规则自动获取检验编码
                basSupplierManagementEdit.supplierNo = "由系统自动取号"
            }
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
            "supplierId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + "/basSupplierManagement/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                form.val('basSupplierManagementEdit_form', data);
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
    form.on('submit(basSupplierManagementEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        field.isNumber = basSupplierManagementEdit.isNumber;
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#basSupplierManagementEdit_submit").trigger('click');
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
        var url = $.config.services.platform + "/basSupplierManagement/save.do";
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                //资料有同步到HRP，同步有问题会提示
                if(data.indexOf("#")>0){
                    var ary=data.split("#")
                    if(ary[0]=="1" && ary[1]!="1"){
                        alert("同步HRP提示："+ary[1]);
                    }
                }
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function edit($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        var param = field; //表单的元素
        var url = $.config.services.platform + "/basSupplierManagement/edit.do";
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                //资料有同步到HRP，同步有问题会提示
                if(data.indexOf("#")>0){
                    var ary=data.split("#")
                    if(ary[0]=="1" && ary[1]!="1"){
                        alert("同步HRP提示："+ary[1]);
                    }
                }
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



