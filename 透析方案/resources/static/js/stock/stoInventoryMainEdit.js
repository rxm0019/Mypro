/**
 * 库存盘点单明细
 * @author: Rain
 * @version: 1.0
 * @date: 2020/09/05
 */
var stoInventoryMainEdit = avalon.define({
    $id: "stoInventoryMainEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    warehouseList: [],
    readonly: {readonly: false} // 文本框设置只读
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id = GetQueryString("id");  //接收变量
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });
        getWarehouseList();
        //全选全不选
        var form = layui.form;
        form.on('checkbox(checkAll)', function (data) {
            var a = data.elem.checked;
            if (a == true) {
                $(".checkboxItem").prop("checked", true);
            } else {
                $(".checkboxItem").prop("checked", false);
            }
            form.render('checkbox');
        });
        form.on('checkbox(check)', function (data) {
            var num = 0;
            $("input[name='houseNo1']:checked").each(function (i, d) {
                num++;
            });
            if (num == stoInventoryMainEdit.warehouseList.length) {
                $("#checkAll").prop("checked", true);
            } else {
                $("#checkAll").prop("checked", false);
            }
            form.render('checkbox');
        });
        //开始盘点后不可修改
        var readonly = GetQueryString("readonly");
        if (readonly === "true") {
            stoInventoryMainEdit.readonly = {readonly: true};
            $('input[type="checkbox"]').prop('disabled', true);
        }
        avalon.scan();
    });
});

/**
 * 获取复选框选中的值
 * @returns {string}
 */
function canCelAll() {
    var houseNo = "";
    $('.checkboxItem:checked').each(function () {
        houseNo += $(this).val() + ",";
    });

    houseNo = houseNo.substr(0, houseNo.length - 1);
    return houseNo;
}

/**
 * 获取仓库下拉值
 */
function getWarehouseList() {
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/basWarehouse/getLists.do",
        dataType: "json",
        async: false,
        done: function (data) {
            stoInventoryMainEdit.warehouseList = data;
            layui.form.render();
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
            "inventoryMainId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.pharmacy + "/stoInventoryMain/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                getHouseNo(data.houseNo);
                var form=layui.form; //调用layui的form模块
                form.val('stoInventoryMainEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

/**
 * 渲染复选框
 */
function getHouseNo(houseNo) {
    var houseNoList = houseNo.split(',');
    var num = 0;
    for (var i in houseNoList) {
        debugger
        $("[name='houseNo1']:checkbox").each(function () {
            if (houseNoList[i] === $(this).attr("value")) {
                this.checked = true;
                num++;
            }
        });
    }
    if (num == stoInventoryMainEdit.warehouseList.length) {
        $("#checkAll").prop("checked", true);
    }
    layui.form.render();
}


/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(stoInventoryMainEdit_submit)', function(data){
        //通过表单验证后
        var houseNo = canCelAll();

        if (houseNo === "") {
            warningToast("请至少选中一个仓库");
            return false;
        }
        var field = {
            inventoryMainId: data.field.inventoryMainId,
            name: data.field.name,
            remarks: data.field.remarks,
            houseNo: houseNo
        };
        data.field; //获取提交的字段

        
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#stoInventoryMainEdit_submit").trigger('click');
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
        var url = $.config.services.pharmacy + "/stoInventoryMain/save.do";
        if (isNotEmpty(GetQueryString("id"))) {
            url = $.config.services.pharmacy + "/stoInventoryMain/edit.do";
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


