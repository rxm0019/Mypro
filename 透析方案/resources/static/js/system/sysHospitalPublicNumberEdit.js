/**
 * 公众号配置
 * @author: wahmh
 * @version: 1.0
 * @date: 2020/09/18
 */
var sysHospitalPublicNumberEdit = avalon.define({
    $id: "sysHospitalPublicNumberEdit",
    baseFuncInfo: baseFuncInfo // 底层基本方法
});

layui.use(['index', 'form'], function () {
    avalon.ready(function () {
        var form = layui.form;
        getInfo(function (data) {

        });
    });
    avalon.scan();
});

/**
 * 获取实体
 * @param $callback 成功验证后的回调函数，
 *
 */
function getInfo($callback) {
    var form = layui.form;
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysHospital/getPublicNumberMessage.do",
        data: {},
        dataType: "json",
        done: function (data) {
            //给表单赋值,查询的时候根据后台已经根据医院代号将医院的Id进行返回
           form.val('sysHospitalPublicNumberEdit_form', data);
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}
/**
 * 保存或修改公众号信息
 * @param $callback
 */
function edit($callback) {  //菜单保存操作
    var layer = layui.layer;
    //对表单验证
    verifyForm(function (field) {
        //成功验证后
        var param = field; //表单的元素，这里面会带上医院的ID
        var url = $.config.services.system + "/sysHospital/editPublicNumberMessage.do";
        _ajax({
            type: "POST",
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                if (data > 0) {
                    successToast("修改成功");
                } else {
                    errorToast("修改失败");
                }
            }
        });
    });
}

/**
 * 验证表单
 * @param $callback
 */
function verifyForm($callback) {
    // 监听提交,先定义个隐藏的按钮
    var form = layui.form; // 调用layui的form模块
    form.on('submit(sysHospitalPublicNumberEdit_submit)', function (data) {
        // 通过表单验证后
        var field = data.field; // 获取提交的字段
        typeof $callback === 'function' && $callback(field); // 返回一个回调事件
    });

}


