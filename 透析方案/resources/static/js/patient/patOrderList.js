/**
 * patOrderList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * @author anders
 * @date 2020-08-24
 * @version 1.0
 */
var patOrderList = avalon.define({
    $id: "patOrderList",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,currentTable: 'standingOrder_table'          //当前tab使用的table
    ,category: '0'                         //0-透析长期医嘱，1-普通长期医嘱，2-备用长期医嘱  默认0  点击tab的时候使用
    ,patientId: ''                         //患者id
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        patOrderList.patientId = GetQueryString('patientId');

        getList();  //查询列表
        tabEvent();   //tab点击事件
        avalon.scan();
    });
});

/**
 * 查询列表事件
 */
function getList() {
    var param = {
        category: patOrderList.category,
        patientId: patOrderList.patientId
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#' + patOrderList.currentTable, //必填，指定原始表格元素选择器（推荐id选择器）
        filter: patOrderList.currentTable, ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            // height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patOrder/listAll.do", // ajax的url必须加上getRootPath()方法
            page: false,
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}  //开启编辑框
                , {
                    field: 'stockCount', title: '库存', align: 'center', width: 80
                    , templet: function (d) {
                        if (d.type === '1' || d.type === '2') {  // 药疗 耗材 显示库存
                            if ((d.stockCount - d.stockLockCount) <= 0) {
                                return '<div style="height: 0px;width: 0px;border: 18px #FF784E solid;border-right-color:transparent;border-bottom-color: transparent;border-radius: 5px;"></div>' +
                                    '<div style="position: absolute;top:1px;left: 20px;color: #ffffff;">缺</div>';
                            }
                            return (d.stockCount - d.stockLockCount) + getSysDictName('purSalesBaseUnit', d.stockUnit);
                        } else {
                            return '';
                        }
                    }
                }
                , {field: 'orderContent', title: '医嘱名称#规格', align: 'left', width: 410,toolbar: '#orderContentTemplet'}
                , {
                    field: 'dosage', title: '单次剂量 x 频率 x 天数', align: 'center',width:200
                    , templet: function (d) {
                        if (d.orderType === '3') {
                            return getSysDictName('SampleType', d.testType);
                        }
                        if(isEmpty(d.frequency) || isEmpty(d.usageDays)) {
                            return '';
                        }
                        return d.dosage + d.basicUnit + ' x ' + getSysDictName('OrderFrequency', d.frequency) + ' x ' + d.usageDays + '天';
                    }
                }
                , {
                    field: 'channel', title: '途径', align: 'center',width:100
                    , templet: function (d) {
                        if (isEmpty(d.channel)) {
                            return '--';
                        }
                        return getSysDictName('Route', d.channel);
                    }
                }
                , {field: 'totalDosage', title: '总量<br>总量(取整)', align: 'center',width:100,templet:function (d) {
                    if (isEmpty(d.totalDosage)) {
                        return '';
                    }
                    var html = '<div>' + d.totalDosage + d.basicUnit + '</div>';
                    if (d.conversionRel2Sales === 0 || d.conversionRel2Basic === 0 || d.allowSplitDispense === 'Y') {
                        return html;
                    }
                    var value = d.totalDosage * (d.conversionRel2Sales / d.conversionRel2Basic);
                    if (value % 1 === 0) {   //整除
                        html += '<div>' + value + getSysDictName('purSalesBaseUnit', d.salesUnit) + '</div>';
                    } else {
                        html += '<div style="color: #ff0000;">' + Math.ceil(value) + getSysDictName('purSalesBaseUnit', d.salesUnit) + '余' + (Math.ceil(value) * d.conversionRel2Basic - d.totalDosage) + d.basicUnit + '</div>';
                    }

                    return html;
                }}
                , {
                    field: 'startDate', title: '起始日期<br>循环周期', align: 'center',width:200
                    , templet: function (d) {
                        var str = '--';
                        if (isEmpty(d.cycleType)) {
                            return str;
                        }
                        if (d.cycleType === '0') {  //每次透析
                            str = '(每次透析)';
                        } else if (d.cycleType === '1') {  //固定日期
                            if (d.cycleWeekType === '0') {   //每周
                                str = '(每周，' + numToWeek(d.cycleWeekDays) + ')';
                            } else if (d.cycleWeekType === '1') {   //单周
                                str = '(单周，' + numToWeek(d.cycleWeekDays) + ')';
                            } else if (d.cycleWeekType === '2') {   //双周
                                str = '(双周，' + numToWeek(d.cycleWeekDays) + ')';
                            }
                        } else if (d.cycleType === '2') {   //每隔几次透析
                            str = '(每隔' + d.cycleEveryTimes + '次透析)';
                        }
                        var end = d.endDate < 0 ? '长期' : util.toDateString(d.endDate, "yyyy/MM/dd");
                        var html = '<div>' + util.toDateString(d.startDate, "yyyy/MM/dd") + ' - ' + end + '</div><div>' + str + '</div>';
                        return html;
                    }
                }
                , {
                    field: 'dataStatus', title: '使用状态', align: 'center',width:90, templet: function (d) {
                        if (d.dataStatus === '0') {
                            return '在用';
                        } else if (d.dataStatus === '1') {
                            return '停用';
                        }
                    }
                }
                , {
                    field: 'establishUserName', title: '开嘱医生<br>下达日期', align: 'center',width:100
                    , templet: function (d) {
                        var html = '<div>' + d.establishUserName + '</div><div>' + util.toDateString(d.establishDate, "yyyy/MM/dd") + '</div>';
                        return html;
                    }
                }
                , {
                    field: 'disabledUserName', title: '停用人<br>停用时间', align: 'center',width:100
                    , templet: function (d) {
                        if (d.dataStatus !== '1') {
                            return '';
                        }
                        var html = '<div>' + d.disabledUserName + '</div><div>' + util.toDateString(d.disabledDatetime, "yyyy/MM/dd") + '</div>';
                        return html;
                    }
                }
                , {
                    fixed: 'right', title: '操作', width: 280, align: 'center'
                    , toolbar: '#patOrderList_bar'
                }
            ]]
            , done: function (res) {
                // 所有子医嘱添加特殊背景色
                var tableTarget = $("[lay-id='" + patOrderList.currentTable + "']");
                var subOrderTrs = tableTarget.find(".order-content.sub-order[data-parent-order-id]").closest("tr[data-index]");
                $.each(subOrderTrs, function (index, item) {
                    var dataIndex = $(item).attr("data-index");
                    tableTarget.find(".layui-table-body table tr[data-index='" + dataIndex + "']").addClass("sub-order-tr");
                });

                if (res.bizData) {
                    $.each(res.bizData, function (i, item) {
                        if (isNotEmpty(item.parentOrderId)) {         //禁用子医嘱的复选框选择事件
                            var index = res.bizData[i]['LAY_TABLE_INDEX'];
                            $(".layui-table tr[data-index="+index+"] input[type='checkbox']").prop('disabled',true);
                            $(".layui-table tr[data-index="+index+"] input[type='checkbox']").next().addClass('layui-btn-disabled');
                            $('.layui-table tr[data-index='+index+'] input[type="checkbox"]').prop('name', 'eee');
                        }
                    })
                }
            }
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'edit') { //编辑
                //do something
                if (isNotEmpty(data.orderId)) {
                    saveOrEdit(data.orderId, false);
                }
            } else if (layEvent === 'addAdvice') {
                if (isNotEmpty(data.orderId)) {      //子医嘱添加
                    saveOrEdit(data.orderId, true, data.frequency, data.usageDays,data.channel);
                }
            } else if (layEvent === 'disable') {
                if (isNotEmpty(data.orderId)) {
                    var status;
                    var title;
                    if (data.dataStatus === '0') {  //停用
                        status = '1';
                        title = '确定停用此医嘱吗？';
                    } else {
                        status = '0';
                        title = '确定启用此医嘱吗？';
                    }

                    layer.confirm(title, function (index) {
                        layer.close(index);
                        //向服务端发送删除指令
                        disable(data.orderId, status);
                    });
                }
            } else if (layEvent === 'del') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.orderId)) {
                        var ids = [];
                        ids.push(data.orderId);
                        del(ids);
                    }
                });
            }

            if (layEvent === 'toggle-fold-suborder') {
                var orderId = data.orderId;
                var tableTarget = $("[lay-id='" + patOrderList.currentTable + "']");
                // 父医嘱行
                var orderTr = tableTarget.find(".order-content[data-order-id='" + orderId + "']").closest("tr[data-index]");
                // 子医嘱行
                var subOrderTrs = tableTarget.find(".order-content.sub-order[data-parent-order-id='" + orderId + "']").closest("tr[data-index]");

                // 展开/折叠子医嘱
                var isOrderTrFold = orderTr.find(".order-content").hasClass("fold");
                if (isOrderTrFold) {
                    // 若父医嘱是折叠状态，则展开子医嘱，并设置父医嘱为展开状态
                    $.each(subOrderTrs, function (index, item) {
                        var dataIndex = $(item).attr("data-index");
                        tableTarget.find(".layui-table-body table tr[data-index='" + dataIndex + "']").show();
                    });
                    orderTr.find(".order-content").removeClass("fold");
                } else {
                    // 否则，则隐藏子医嘱，并设置父医嘱为折叠状态
                    $.each(subOrderTrs, function (index, item) {
                        var dataIndex = $(item).attr("data-index");
                        tableTarget.find(".layui-table-body table tr[data-index='" + dataIndex + "']").hide();
                    });
                    orderTr.find(".order-content").addClass("fold");
                }
            }
        }
    });

}

/**
 * 监听tab
 */
function tabEvent() {
    layui.use('element', function () {
        var element = layui.element;
        //监听Tab切换，以改变地址hash值
        element.on('tab(patOrderTab)', function () {
            var tabId = this.getAttribute('lay-id');   //获取选项卡的lay-id
            if (tabId === 'standingOrder') {
                patOrderList.currentTable = 'standingOrder_table';
                patOrderList.category = '0';
            } else if (tabId === 'medicalRecords') {
                patOrderList.currentTable = 'medicalRecords_table';
                patOrderList.category = '1';
            } else if (tabId === 'templateOrder') {
                patOrderList.currentTable = 'templateOrder_table';
                patOrderList.category = '2';
            }
            getList();
        });
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(id, addSub, frequency, usageDays,channel) {
    var url = "";
    var title = "";
    if (addSub) {    //新增子医嘱
        title = "新增子医嘱";
        url = $.config.server + "/patient/patOrderEdit?patientId=" + patOrderList.patientId + "&parentOrderId=" + id +
            "&category=" + patOrderList.category + "&frequency=" + frequency + "&usageDays=" + usageDays + "&channel=" + channel;
    } else {
        if (isEmpty(id)) {  //id为空,新增操作
            title = "新增";
            url = $.config.server + "/patient/patOrderEdit?patientId=" + patOrderList.patientId + "&category=" + patOrderList.category;
        } else {  //编辑
            title = "编辑";
            url = $.config.server + "/patient/patOrderEdit?orderId=" + id + "&category=" + patOrderList.category + '&patientId=' + patOrderList.patientId
        }
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 900, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 800,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success(data) {
                    var title = "保存成功";
                    if (isNotEmpty(data)) {
                        title = '保存成功<br>' + data;
                    }
                    successToast(title, 2000);
                    var table = layui.table; //获取layui的table模块
                    table.reload(patOrderList.currentTable); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 停用事件
 */
function disable(id, dataStatus) {
    var param = {
        "id": id,
        "dataStatus": dataStatus
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patOrder/disable.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            var tip = dataStatus === '0' ? '启用成功' : '停用成功';
            successToast(tip);
            var table = layui.table; //获取layui的table模块
            table.reload(patOrderList.currentTable); //重新刷新table
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
        url: $.config.services.dialysis + "/patOrder/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload(patOrderList.currentTable); //重新刷新table
        }
    });
}

/**
 * 从组套导入
 */
function importAdvice() {
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url: $.config.server + "/patient/importOrder?category=" + patOrderList.category + '&patientId=' + patOrderList.patientId,  //弹框自定义的url，会默认采取type=2
        width: 1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 700,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: '从组套导入', //弹框标题
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success(data) {
                    successToast('导入成功');
                    var table = layui.table; //获取layui的table模块
                    table.reload(patOrderList.currentTable); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 导出到组套
 */
function exportAdvice() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus(patOrderList.currentTable); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if (data.length === 0) {
        warningToast('至少选择一条记录');
        return false;
    }

    var orderList = [];    //存放父医嘱和子医嘱
    var list = layui.table.cache[patOrderList.currentTable];

    $.each(data, function (index, item) {
        if (isEmpty(item.parentOrderId)) {   //将父医嘱添加到list
            orderList.push(item);
        }
        list.forEach(function (node, i) {
            if (node.parentOrderId === item.orderId) {    //将子医嘱添加到list
                orderList.push(node);
            }
        })
    })
    var uuid = guid();
    sessionStorage.setItem(uuid, JSON.stringify(orderList));    //选中的医嘱数据存进缓存，key: uuid,   value: 医嘱数据
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url: $.config.server + "/patient/exportOrder?uuid=" + uuid,  //弹框自定义的url，会默认采取type=2
        width: 1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 700,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: '导出到组套', //弹框标题
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success(data) {
                    successToast('导出成功');
                    // var table = layui.table; //获取layui的table模块
                    // table.reload(patOrderList.currentTable); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

