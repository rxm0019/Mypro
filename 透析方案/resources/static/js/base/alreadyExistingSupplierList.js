/**
 * 供应商管理
 * @author: Sinjar
 * @version: 1.0
 * @date: 2020/08/17
 */
var basSupplierManagementList = avalon.define({
    $id: "basSupplierManagementList",
    baseFuncInfo: baseFuncInfo//底层基本方法
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList();  //查询列表
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#basSupplierManagementList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'basSupplierManagementList_search'  //指定的lay-filter
        , conds: [
            {field: 'supplierCode', title: '供应商编码：', type: 'input'}
            , {field: 'supplierName', title: '供应商名称：', type: 'input'}
        ]
        , done: function (filter, data) {
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        , search: function (data) {
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('basSupplierManagementList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getList() {
    var drugInfoId = GetQueryString("drugInfoId");
    var consumableInfoId = GetQueryString("consumableInfoId");
    var url = '';
    if (isNotEmpty(drugInfoId)) {
        url = '/basDrugInfo/getMaterielSupplierRel.do';
    } else if (isNotEmpty(consumableInfoId)) {
        url = '/basConsumableInfo/getMaterielSupplierRel.do';
    }

    var param = {
        drugInfoId: drugInfoId,
        consumableInfoId: consumableInfoId
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#basSupplierManagementList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'basSupplierManagementList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-145', //table的高度，页面最大高度减去差值
            url: $.config.services.platform + url,
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}  //开启修改框
                ,{type: 'numbers', title: '序号', width: 60}  //序号
                ,{field: 'supplierCode', title: '供应商编码', align: 'center', sortField: 'bsm_.supplier_code', width: 200}
                ,{field: 'supplierName', title: '供应商名称', align: 'left', sortField: 'bsm_.supplier_name'}
                ,{field: 'price', title: '* 采购价格', align: 'right', edit: 'text', width: 200}
                ,{field: 'defaultSupplier', title: '是否为默认供应商', align: 'center', width: 200, templet: '#checkboxTpl'}
                ,{fixed: 'right', title: '操作', width: 140, align: 'center', toolbar: '#basSupplierManagementList_bar'}
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
                    if (isNotEmpty(data.materielSupplierRid)) {
                        var ids = [];
                        ids.push(data.materielSupplierRid);
                        del(ids);
                    }
                });
            }
        }
    });

    // 监听单元格编辑操作
    table.on('edit(basSupplierManagementList_table)', function (obj) {
        var value = obj.value; // 得到修改后的值
        var data = obj.data; // 得到所在行所有键值
        var field = obj.field; // 得到字段

        // 判断数据类型
        if (isNotEmpty($.trim(value)) && isNumber($.trim(value))) {
            if (Math.abs(value) > 9999999.99) {
                var error = [
                    '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite><br/>' + ('<span style="color: red">' + Math.abs($.trim(value)) + '</span>' + '超出上限值')
                ].join('');
                errorToast(error);

                // 恢复之前单元格的值
                var tr = obj.tr;
                var oldText = $(tr).find("td[data-field='" + field + "'] div").text();
                $(tr).find("td[data-field='" + field + "'] input").val(oldText);
            } else {
                editPrice(data);
            }
        } else {
            var msg = '';
            if (isEmpty($.trim(value))) {
                msg = '采购价格为必填项';
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

    // 监听设置默认供应商操作
    layui.form.on('checkbox(setDefaultSupplier)', function (obj) {
        setDefaultSupplier(obj, this);
    });
}

/**
 * 编辑价格
 * @param data 所在行所有键值
 */
function editPrice(data) {
    var drugInfoId = GetQueryString("drugInfoId");
    var consumableInfoId = GetQueryString("consumableInfoId");
    var url = '';
    if (isNotEmpty(drugInfoId)) {
        url = '/basDrugInfo/updateMaterielSupplierRel.do';
    } else if (isNotEmpty(consumableInfoId)) {
        url = '/basConsumableInfo/updateMaterielSupplierRel.do';
    }

    var param = {
        materielSupplierRid: data.materielSupplierRid,
        price: Math.abs($.trim(data.price))
    };
    _ajax({
        type: "POST",
        url: $.config.services.platform + url,
        data: param,  //必须字符串后台才能接收list,
        loading: false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function () {
            successToast("修改成功");
            var table = layui.table; //获取layui的table模块
            table.reload('basSupplierManagementList_table'); //重新刷新table
        }
    });
}

/**
 * 设置默认供应商
 * @param obj
 * @param $this
 */
function setDefaultSupplier(obj, $this) {
    var drugInfoId = GetQueryString("drugInfoId");
    var consumableInfoId = GetQueryString("consumableInfoId");
    var materielId = '';
    var url = '';
    if (isNotEmpty(drugInfoId)) {
        materielId = drugInfoId;
        url = '/basDrugInfo/updateMaterielSupplierRel.do';
    } else if (isNotEmpty(consumableInfoId)) {
        materielId = consumableInfoId;
        url = '/basConsumableInfo/updateMaterielSupplierRel.do';
    }

    var param = {
        materielSupplierRid: $this.attributes.materielSupplierRid.nodeValue,
        defaultSupplier: (obj.elem.checked === true ? 'Y' : 'N'),
        materielId: materielId
    };
    _ajax({
        type: "POST",
        url: $.config.services.platform + url,
        data: param,  //必须字符串后台才能接收list,
        loading: false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function () {
            successToast("设置成功");
            var table = layui.table; //获取layui的table模块
            table.reload('basSupplierManagementList_table'); //重新刷新table
        }
    });
}

/**
 * 弹窗：添加供应商，用于与药品进行绑定
 */
function bindSuppliers(id) {
    var url = "";
    var title = "";
    if (isEmpty(id)) {  //id为空,新增操作
        title = "添加供应商";
        url = $.config.server + "/base/bindSuppliers?drugInfoId=" + GetQueryString("drugInfoId") + "&materielNo=" + GetQueryString("materielNo") + "&dataStatus=" + GetQueryString("dataStatus") + "&consumableInfoId=" + GetQueryString("consumableInfoId");
        //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
        _layerOpen({
            url: url,  //弹框自定义的url，会默认采取type=2
            width: 1300, //弹框自定义的宽度，方法会自动判断是否超过宽度
            height: 800,  //弹框自定义的高度，方法会自动判断是否超过高度
            title: title, //弹框标题
            // readonly: readonly, // true：查看 | false：编辑
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
                        table.reload('basSupplierManagementList_table'); //重新刷新table
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                    }
                );
            }
        });
    }
}

/**
 * 删除事件
 * @param ids
 */
function del(ids) {
    var drugInfoId = GetQueryString("drugInfoId");
    var consumableInfoId = GetQueryString("consumableInfoId");
    var url = '';
    if (isNotEmpty(drugInfoId)) {
        url = '/basDrugInfo/deleteMaterielSupplierRel.do';
    } else if (isNotEmpty(consumableInfoId)) {
        url = '/basConsumableInfo/deleteMaterielSupplierRel.do';
    }

    var param = {
        "ids": ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.platform + url,
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('basSupplierManagementList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('basSupplierManagementList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确定删除所选记录吗？', function (index) {
            layer.close(index);
            var ids = [];
            $.each(data, function (i, item) {
                ids.push(item.materielSupplierRid);
            });
            del(ids);
        });
    }
}