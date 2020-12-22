/**
 * 医嘱字典明细
 * @author: Rain
 * @version: 1.0
 * @date: 2020/08/21
 */
var basOrderMainEdit = avalon.define({
    $id: "basOrderMainEdit",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,readonly: {readonly: false} // 文本框设置只读
    ,orderType:[{name:"药疗",value:"1"},{name:"诊疗",value:"2"},{name:"检验",value:"3"},{name:"处置",value:"4"}]
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
            var form = layui.form;
            onSelect();
            form.on('select(select)', function (data) {
                onSelect();
                form.render('select');
            });
        });
        avalon.scan();
    });
});



/**
 * 动态显示下拉框
 */
function onSelect() {
    var message = $("select[name=orderType]").val();
    
    //医嘱类别 选择药疗
    if (message == "1") {
        document.getElementById("medicalTherapy").style.display = "block";
        document.getElementById("specifications").style.display = "none";
        document.getElementById("unit").style.display = "none";
        setValue('Specifications');
        setValue('Unit');
    } else {
        document.getElementById("medicalTherapy").style.display = "none";
        document.getElementById("specifications").style.display = "block";
        document.getElementById("unit").style.display = "block";
        setValue('MedicalTherapy');
    }
    //医嘱类别 选择诊疗
    
    if (message == "2") {
        layui.jquery('input[name=specifications]').attr("lay-verify","required");
        layui.jquery('#specifications span').removeClass("layui-hide");
    } else {
        layui.jquery('input[name=specifications]').removeAttr("lay-verify");
        layui.jquery('#specifications span').addClass("layui-hide");
    }
    //医嘱类别 选择检验
    if (message == "3") {
        document.getElementById("examination").style.display = "block";
    } else {
        document.getElementById("examination").style.display = "none";
        setValue('Examination');
    }
    //医嘱类别 不选择检验
    if (message != "3") {
        document.getElementById("route").style.display = "block";
    } else {
        document.getElementById("route").style.display = "none";
        setValue('Route');
    }
}

/**
 * 医嘱类别变更时,清除下拉框,文本框的值
 * @param selectId
 */
function setValue(id) {
    var obj = document.getElementById(id);
    obj.value = "";
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
            "orderMainId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + "/basOrderMain/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                form.val('basOrderMainEdit_form', data);
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
    form.on('submit(basOrderMainEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        if (field.singleDose !== '' && field.singleDose !== null) {
            if (!isNumber(field.singleDose)) {
                errorToast("剂量只能输入数字！");
                return;
            }
            field.singleDose = parseFloat(field.singleDose).toFixed(2);
        }
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#basOrderMainEdit_submit").trigger('click');
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
        var url = $.config.services.platform + "/basOrderMain/edit.do";
        var id = GetQueryString("id");
        if (isEmpty(id)) {
            url = $.config.services.platform + "/basOrderMain/save.do";
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




