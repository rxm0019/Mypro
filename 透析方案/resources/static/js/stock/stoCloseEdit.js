/**
 * 关闭入库单弹窗，用于更改入库单状态及保存关闭原因
 * @author: Sinjar
 * @version: 1.0
 * @date: 2020/09/20
 */
var stoCloseEdit = avalon.define({
    $id: "stoCloseEdit",
    baseFuncInfo: baseFuncInfo,
    warehouseInMainId: GetQueryString("id") // 入库单ID
});

layui.use(['index'], function () {
    avalon.ready(function () {
        avalon.scan();
    });
});

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    var form = layui.form;
    form.on('submit(stoCloseEdit_submit)', function (data) {
        // 通过表单验证后
        var field = data.field;
        typeof $callback === 'function' && $callback(field); // 返回一个回调事件
    });
    $("#stoCloseEdit_submit").trigger('click');
}

/**
 * 保存关闭原因
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    // 对表单验证
    verify_form(function (field) {
        // 成功验证后
        layer.confirm('确定关闭所选记录吗？', function (index) {
            layer.close(index);

            var ids = [];
            ids.push(stoCloseEdit.warehouseInMainId);

            _ajax({
                type: 'POST',
                loading: false,  //是否ajax启用等待旋转框，默认是true
                url: $.config.services.pharmacy + '/stoWarehouseInMain/close.do',
                data: {
                    remarks: field.remarks,
                    ids: ids
                },
                dataType: "json",
                done: function (data) {
                    typeof $callback === 'function' && $callback(data); // 返回一个回调事件
                }
            });
        });
    });
}
