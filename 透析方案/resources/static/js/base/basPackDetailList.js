/**
 * 治疗打包(打包)
 * @author: Rain
 * @version: 1.0
 * @date: 2020/08/14
 */
var basPackDetailList = avalon.define({
    $id: "basPackDetailList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    readonly: {readonly: false}, // 文本框设置只读
    packMethod: GetQueryString("packMethod"),
    packKeyName: GetQueryString("packKeyName")
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        basPackDetailList.readonly = {readonly: true};
        //所有的入口事件写在这里...
        getList();  //查询列表
        avalon.scan();
    });
});

/**
 * 查询列表事件
 */
function getList() {
    var id = GetQueryString("packMainId");  //接收变量
    var param = {
        "packMainId": id
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#basPackDetailList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'basPackDetailList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-200', //table的高度，页面最大高度减去差值
            url: $.config.services.platform + "/basPackMain/detailList.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}, //开启修改框
                {type: 'numbers', title: '序号', width: 60}, //序号
                {
                    field: 'materielNo', title: '编码', align: 'center'
                }
                , {
                    field: 'materielName', title: '名称', align: 'center'
                }
                , {
                    field: 'manufactor', title: '厂家', align: 'center'
                }
                , {
                    field: 'specifications', title: '规格', align: 'center'
                }
                , {
                    field: 'basicUnit', title: '单位', align: 'center',
                    templet: function (d) {
                        return getSysDictName($.dictType.purSalesBaseUnit,d.basicUnit);
                    }
                }
                , {
                    field: 'number', title: '*数量', align: 'right', edit: 'text'
                }
                , {
                    field: 'type', title: '类别', align: 'center',
                    templet: function (d) {
                        if (d.type != null) {
                            if (d.type === "1") {
                                return "药品"
                            } else if (d.type === "2") {
                                return "耗材"
                            } else {
                                return "诊疗"
                            }
                        } else {
                            return "";
                        }
                    }

                }
                , {
                    fixed: 'right', title: '操作', width: 140, align: 'center'
                    , toolbar: '#basPackDetailList_bar'
                }
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'delete') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.packDetailId)) {
                        var ids = [];
                        ids.push(data.packDetailId);
                        del(ids);
                    }
                });
            }
        }
    });

    // 监听单元格编辑操作
    table.on('edit(basPackDetailList_table)', function (obj) {
        var value = obj.value; // 得到修改后的值
        var data = obj.data; // 得到所在行所有键值
        var field = obj.field; // 得到字段
        // 判断数据类型
        if (isNotEmpty($.trim(value)) && isNumber($.trim(value))) {
            if (($.trim(value) * 1) % 1 !== 0) {
                var error = [
                    '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite><br/>' + ('<span style="color: red">' + Math.abs($.trim(value)) + '</span>' + '请输入整数')
                ].join('');
                errorToast(error);
                // 恢复之前单元格的值
                var tr = obj.tr;
                var oldText = $(tr).find("td[data-field='" + field + "'] div").text();
                $(tr).find("td[data-field='" + field + "'] input").val(oldText);
            } else if (Math.abs(value) < 1 || Math.abs(value) > 9999999.99) {
                var error = [
                    '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite><br/>' + ('<span style="color: red">' + '只能输入1~9999999之间的值' + '</span>')
                ].join('');
                errorToast(error);
                // 恢复之前单元格的值
                var tr = obj.tr;
                var oldText = $(tr).find("td[data-field='" + field + "'] div").text();
                $(tr).find("td[data-field='" + field + "'] input").val(oldText);
            } else {
                editNumber(data);
            }
        } else {
            var msg = '';
            if (isEmpty($.trim(value))) {
                msg = '数量为必填项';
            } else {
                msg = '不是有效的数字';
            }

            var error = [
                '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite><br/>' + ('<span style="color: red">' + $.trim(value) + '</span>' + msg)
            ].join('');
            errorToast(error);

            // 恢复之前单元格的值
            var tr = obj.tr;
            var oldText = $(tr).find("td[data-field='" + field + "'] div").text();
            $(tr).find("td[data-field='" + field + "'] input").val(oldText);
        }
    });

}

/**
 * 编辑价格
 * @param data 所在行所有键值
 */
function editNumber(data) {
    var param = {
        packDetailId: data.packDetailId,
        number: Math.abs($.trim(data.number))
    };
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/basPackMain/updateNumber.do",
        data: param,  //必须字符串后台才能接收list,
        loading: false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function () {
            successToast("修改成功");
            var table = layui.table; //获取layui的table模块
            table.reload('basPackDetailList_table'); //重新刷新table
        }
    });
}


/**
 * 添加明细
 */
function insert() {
    var id = GetQueryString("packMainId");
    var packType = GetQueryString("packType");
    var title = "添加明细";
    var url = $.config.server + "/base/basPackDetailInsertList?id=" + id + "&packType=" + packType;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件

    _layerOpen({
        url: url,
        width: 1300, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 700,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        readonly: false, // true：查看 | false：编辑
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('basPackDetailList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 删除事件
 * @param ids
 */
function del(ids) {
    var param = {
        "ids": ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/basPackMain/deleteDetail.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('basPackDetailList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('basPackDetailList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据`
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确定删除所选记录吗？', function (index) {
            layer.close(index);
            var ids = [];
            $.each(data, function (i, item) {
                ids.push(item.packDetailId);
            });
            del(ids);
        });
    }
}



