/**
 * diaMachineFailureEdit.jsp的js文件，包括查询，编辑操作
 */
var diaMachineFailureEdit = avalon.define({
    $id: "diaMachineFailureEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    deviceName: '',//设备名称
    deviceType: '',//设备类型
    devices: [],
});

layui.use(['index','formSelects'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它

    var formSelects = layui.formSelects;
    formSelects.on('codeNo', function (id, vals, val,isAdd) {
        if(isAdd == true){
            vals.push(val);
        }else if(isAdd == false){
            vals.splice(vals.indexOf(val),1)
        }
        diaMachineFailureEdit.devices = vals;
        return true;
    });
    avalon.ready(function () {
        getDialysisMachine();
        avalon.scan();
    });
});

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getDialysisMachine(){
        var param={
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis+"/diaMachineFailure/getDialysisMachine.do",
            data:param,
            dataType: "json",
            done:function(data){
                var formSelects = layui.formSelects; //调用layui的form模块
                var patVascularRoads = [];
                $.each(data, function (index, item) {
                    var patVascularObj = {};
                    patVascularObj.code = item.deviceType;
                    patVascularObj.name = item.deviceName
                    patVascularObj.value = item.codeNo;
                    patVascularRoads.push(patVascularObj);
                })
                formSelects.data('codeNo', 'local', {
                    arr: patVascularRoads
                });
            }
        });
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(diaMachineFailureEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        field.devices = diaMachineFailureEdit.devices;
        
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#diaMachineFailureEdit_submit").trigger('click');
}



