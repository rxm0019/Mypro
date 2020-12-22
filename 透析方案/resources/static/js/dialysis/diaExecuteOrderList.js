/**
 * diaExecuteOrderList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * @author anders
 * @date 2020-09-04
 * @version 1.0
 */
var diaExecuteOrderList = avalon.define({
    $id: "diaExecuteOrderList",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,currentUserType: baseFuncInfo.userInfoData.userType   //当前登录者角色
    ,userType: $.constant.userType                    //角色常量
    ,currentTable: 'standingOrder_table'          //当前tab使用的table
    ,category: '0'                         //0-透析长期医嘱，1-普通长期医嘱，2-备用长期医嘱 3-医嘱字典 默认0  点击tab的时候使用
    ,diaRecordId: ''    //透析记录id  进入页面的时候要获取
    ,patientId: ''      //患者id
    ,userId: ''         //当前登录者id
    ,showBtn: true      //显示按钮
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        diaExecuteOrderList.diaRecordId = GetQueryString('diaRecordId');
        diaExecuteOrderList.patientId = GetQueryString('patientId');
        diaExecuteOrderList.showBtn = GetQueryString("readonly") !== 'Y';
        diaExecuteOrderList.userId = baseFuncInfo.userInfoData.userid;

        getOrderList('0');  //查询长期医嘱列表
        monitorCheckbox();
        getList();      //当日医嘱
        getRecentItem();  //判断是否有近期检验项目
        monitorRadio();
        tabEvent();      //tab监听事件
        avalon.scan();
    });
});

/**
 * 查询列表事件
 */
function getOrderList(dataStatus) {
    var param = {
        category: diaExecuteOrderList.category,
        patientId: diaExecuteOrderList.patientId,
        dataStatus: dataStatus
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#' + diaExecuteOrderList.currentTable, //必填，指定原始表格元素选择器（推荐id选择器）
        filter: diaExecuteOrderList.currentTable, ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            // height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patOrder/listAll.do", // ajax的url必须加上getRootPath()方法
            page: false,
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}  //开启编辑框
                ,{field: 'stockCount', title: '库存', align: 'center', width: 90
                    , templet: function (d) {
                        if (d.type === '1' || d.type === '2') {  // 药品  耗材显示库存
                            if ((d.stockCount  - d.stockLockCount) <= 0) {
                                return '<div style="height: 0px;width: 0px;border: 15px #FF784E solid;border-right-color:transparent;border-bottom-color: transparent;border-radius: 5px;"></div>' +
                                    '<div style="position: absolute;top:0;left: 18px;color: #ffffff;font-size: 12px;">缺</div>';
                            }
                            return (d.stockCount - d.stockLockCount) + getSysDictName('purSalesBaseUnit', d.stockUnit);
                        } else {
                            return '';
                        }
                    }
                }
                ,{field: 'orderContent', title: '医嘱名称#规格', align: 'left',width: 410,toolbar: '#orderContentTemplet'}
                ,{field: 'dosage', title: '单次剂量 x 频率 x 天数', align: 'center',width:200
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
                ,{field: 'channel', title: '途径', align: 'center', width:100
                    , templet: function (d) {
                        if (isEmpty(d.channel)) {
                            return '--';
                        }
                        return getSysDictName('Route', d.channel);
                    }
                }
                ,{field: 'totalDosage', title: '总量<br>总量(取整)', align: 'center',width:100,templet:function (d) {
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
                ,{field: 'startDate', title: '起始日期<br>循环周期', align: 'center',width:200
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
                ,{field: 'dataStatus', title: '使用状态', align: 'center',width:90, templet: function (d) {
                        if (d.dataStatus === '0') {
                            return '在用';
                        } else if (d.dataStatus === '1') {
                            return '停用';
                        }
                    }
                }
                ,{field: 'establishUserName', title: '开嘱医生<br>下达日期', align: 'center',width:100
                    , templet: function (d) {
                        var html = '<div>' + d.establishUserName + '</div><div>' + util.toDateString(d.establishDate, "yyyy/MM/dd") + '</div>';
                        return html;
                    }
                }
                ,{field: 'disabledUserName', title: '停用人<br>停用时间', align: 'center',width:100
                    , templet: function (d) {
                        if (d.dataStatus != '1') {
                            return '';
                        }
                        var html = '<div>' + d.disabledUserName + '</div><div>' + util.toDateString(d.disabledDatetime, "yyyy/MM/dd") + '</div>';
                        return html;
                    }
                }
                ,{fixed: 'right', title: '操作', width: diaExecuteOrderList.currentTable==='templateOrder_table' ? 210 : 140, align: 'center', toolbar: '#orderList_bar',hide: !diaExecuteOrderList.showBtn}
            ]]
            ,done: function () {

            }
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'disable') {
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
            } else if (layEvent === 'addPerform') {
                layer.confirm('确定执行此医嘱吗？', function (index) {
                    layer.close(index);
                    //向服务端发送指令
                    if (isNotEmpty(data.orderId)) {
                        addPerform(data.orderId);
                    }
                });
            } else if (layEvent === 'continueOpen') {
                layer.confirm('确定续开当前医嘱？', function (index) {
                    layer.close(index);
                    if (isNotEmpty(data.orderId)) {
                        continueOpenOrder(data.orderId);
                    }
                })
            } else if (layEvent === 'addSubOrder') {
                if (isNotEmpty(data.orderId)) {      //子医嘱添加
                    saveOrEditOrder(data.orderId, true, data.frequency, data.usageDays,data.channel);
                }
            }

            if (layEvent === 'toggle-fold-suborder') {
                var orderId = data.orderId;
                var tableTarget = $("[lay-id='" + diaExecuteOrderList.currentTable + "']");
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
 * 获取当日医嘱列表
 */
function getList() {
    var param = {
        diaRecordId: diaExecuteOrderList.diaRecordId,
        patientId: diaExecuteOrderList.patientId
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#diaExecuteOrderList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'diaExecuteOrderList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            // height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/diaExecuteOrder/listAll.do", // ajax的url必须加上getRootPath()方法
            page: false,
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}  //开启编辑框
                ,{field: 'selfDrugs', title:'个人<br>出库',width:60,align:'center',templet:'#selfDrugsTemplet'}
                ,{field: 'orderContent', title: '医嘱名称#规格', align: 'left',width: 410,toolbar: '#execute_orderContent_templet'}
                ,{field: 'dosage', title: '单次剂量 x 频率 x 天数', align: 'center',width:200
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
                ,{field: 'channel', title: '途径', align: 'center', width:100
                    , templet: function (d) {
                        if (isEmpty(d.channel)) {
                            return '--';
                        }
                        return getSysDictName('Route', d.channel);
                    }
                }
                ,{field: 'totalDosage', title: '总量<br>总量(取整)', align: 'center',width:100,templet:function (d) {
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
                ,{field: 'executeOrderDoctorName', title: '开嘱医生<br>提交时间', align: 'center',width:100
                    , templet: function (d) {
                        var html = '<div>' + d.executeOrderDoctorName + '</div><div>' + util.toDateString(d.submitOrderDate, "HH:mm") + '</div>';
                        if (d.orderStatus === $.constant.orderStatus.NOT_COMMIT) {   //未提交
                            return d.executeOrderDoctorName;
                        }
                        // if (d.orderType === '3') {  //医嘱类型为 检验类型
                        //     return d.executeOrderDoctorName;
                        // }
                        return html;
                    }
                }
                ,{field: 'executeOrderNurseName', title: '执行护士<br>执行时间', align: 'center',width:100
                    , templet: function (d) {
                        var html = '<div>' + d.executeOrderNurseName + '</div><div>' + util.toDateString(d.executeOrderDate, "HH:mm") + '</div>';
                        if (d.orderStatus === $.constant.orderStatus.NOT_COMMIT || d.orderStatus === $.constant.orderStatus.SUBMITTED) {
                            return '';
                        } else if (d.orderStatus === $.constant.orderStatus.EXECUTED || d.orderStatus === $.constant.orderStatus.CHECKED || d.orderStatus === $.constant.orderStatus.CANCEL_CHECKED) {
                            return html;
                        } else if (d.orderStatus === $.constant.orderStatus.CANCELLED_EXECUTE) {
                            return d.executeOrderNurseName;
                        }
                    }
                }
                ,{field: 'checkOrderNurseName', title: '核对护士<br>核对时间', align: 'center',width:100
                    , templet: function (d) {
                        var html = '<div>' + d.checkOrderNurseName + '</div><div>' + util.toDateString(d.checkOrderDate, "HH:mm") + '</div>';
                        if (d.orderStatus === $.constant.orderStatus.NOT_COMMIT || d.orderStatus === $.constant.orderStatus.SUBMITTED || d.orderStatus === $.constant.orderStatus.EXECUTED) {
                            return '';
                        } else if (d.orderStatus === $.constant.orderStatus.CHECKED) {
                            return html;
                        } else if(d.orderStatus === $.constant.orderStatus.CANCEL_CHECKED || d.orderStatus === $.constant.orderStatus.NOT_COMMIT || d.orderStatus === $.constant.orderStatus.CANCELLED_EXECUTE) {
                            return d.checkOrderNurseName;
                        }
                    }
                }
                ,{fixed: 'right', title: '操作', width: 250, align: 'center', toolbar: '#diaExecuteOrderList_bar',hide:!diaExecuteOrderList.showBtn}
            ]]
            ,done: function (res) {
                if (res.bizData.length > 0) {
                    // window.parent.showTabBadgeDot(true);   //显示红点
                    for (var i = 0; i <= res.bizData.length; i++) {
                        var item = res.bizData[i];
                        if (item.orderStatus !== $.constant.orderStatus.NOT_COMMIT) {
                            window.parent.showTabBadgeDot(false);
                            break;
                        }
                    }
                }

                // 所有子医嘱添加特殊背景色
                var tableTarget = $("[lay-id='diaExecuteOrderList_table']");
                var subOrderTrs = tableTarget.find(".order-content.sub-order[data-parent-order-id]").closest("tr[data-index]");
                $.each(subOrderTrs, function (index, item) {
                    var dataIndex = $(item).attr("data-index");
                    tableTarget.find(".layui-table-body table tr[data-index='" + dataIndex + "']").addClass("sub-order-tr");
                });

                if (res.bizData) {
                    $.each(res.bizData, function (i, item) {
                        if (isNotEmpty(item.parentExecuteOrderId)) {         //禁用子医嘱的复选框选择事件
                            var index = res.bizData[i]['LAY_TABLE_INDEX'];
                            $(".layui-table tr[data-index="+index+"] input[name='layTableCheckbox']").prop('disabled',true);
                            $(".layui-table tr[data-index="+index+"] input[name='layTableCheckbox']").next().addClass('layui-btn-disabled');
                            $('.layui-table tr[data-index='+index+'] input[name="layTableCheckbox"]').prop('name', 'eee');
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
            if (layEvent === 'edit') {
                if (isNotEmpty(data.executeOrderId)) {
                    saveOrEdit(data.executeOrderId, false);
                }
            } else if (layEvent === 'addSubOrder') {
                if (isNotEmpty(data.executeOrderId)) {      //子医嘱添加
                    saveOrEdit(data.executeOrderId, true, data.frequency, data.usageDays,data.channel);
                }
            } else if (layEvent === 'commit') {
                if (isNotEmpty(data.executeOrderId)) {
                    var ids = [];
                    ids.push(data.executeOrderId);
                    if (isNotEmpty(data.subOrderId)) {
                        ids = ids.concat(data.subOrderId.split(','));   //将子医嘱一起进行提交
                    }
                    layer.confirm('确定提交此医嘱吗？', function(index) {
                        layer.close(index);
                        commit(ids);
                    });
                }
            } else if (layEvent === 'check') {
                if (isNotEmpty(data.executeOrderId)) {
                    var ids = [];
                    ids.push(data.executeOrderId);
                    if (isNotEmpty(data.subOrderId)) {
                        ids = ids.concat(data.subOrderId.split(','));   //将子医嘱一起进行核对
                    }
                    check(ids);
                }
            } else if (layEvent === 'cancelExecute') {
                if (isNotEmpty(data.executeOrderId)) {
                    var ids = [];
                    ids.push(data.executeOrderId);
                    if (isNotEmpty(data.subOrderId)) {
                        ids = ids.concat(data.subOrderId.split(','));   //将子医嘱一起进行取消执行
                    }
                    layer.confirm('确定取消执行此医嘱吗？', function (index) {
                        layer.close(index);
                        cancelExecute(ids);
                    })
                }
            } else if (layEvent === 'cancelCheck') {
                if (isNotEmpty(data.executeOrderId)) {
                    var ids = [];
                    ids.push(data.executeOrderId);
                    if (isNotEmpty(data.subOrderId)) {
                        ids = ids.concat(data.subOrderId.split(','));   //将子医嘱一起进行取消核对
                    }
                    layer.confirm('确定取消核对此医嘱吗？', function (index) {
                        layer.close(index);
                        cancelCheck(ids);
                    })
                }
            } else if (layEvent === 'cancelCommit') {
                if (isNotEmpty(data.executeOrderId)) {
                    var ids=[];
                    ids.push(data.executeOrderId);
                    if (isNotEmpty(data.subOrderId)) {
                        ids = ids.concat(data.subOrderId.split(','));   //将子医嘱一起进行取消提交
                    }
                    layer.confirm('确定取消提交此医嘱吗？', function (index) {
                        layer.close(index);
                        cancelCommit(ids);
                    })
                }
            } else if (layEvent === 'execute') {
                if (isNotEmpty(data.executeOrderId)) {
                    var ids = [];
                    ids.push(data.executeOrderId);
                    if (isNotEmpty(data.subOrderId)) {
                        ids = ids.concat(data.subOrderId.split(','));   //将子医嘱一起进行执行
                    }
                    layer.confirm('确定执行此医嘱吗？', function (index) {
                        layer.close(index);
                        execute(ids);
                    })
                }
            } else if (layEvent === 'del') {
                if (isNotEmpty(data.executeOrderId)) {
                    layer.confirm('确定删除此医嘱吗？', function (index) {
                        layer.close(index);
                        del(data.executeOrderId,data.orderType);
                    })
                }
            } else if (layEvent === 'applyForm') {
                if (isNotEmpty(data.executeOrderId) && isNotEmpty(diaExecuteOrderList.diaRecordId)) {
                    apply();
                }
            }

            if (layEvent === 'toggle-fold-suborder') {
                var orderId = data.executeOrderId;
                var tableTarget = $("[lay-id='diaExecuteOrderList_table']");
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
 * 先创建检验申请单，然后跳转申请单编辑页面
 */
function apply(){
    var param = {
        diaRecordId: diaExecuteOrderList.diaRecordId
    }
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/tesApply/saveOrderApply.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            if(isNotEmpty(data)){
                baseFuncInfo.openPatientLayoutPage({
                    pageHref: "/examine/tesApplyList",
                    patientId: diaExecuteOrderList.patientId,
                })
            }
        }
    });
}

/**
 * 获取是否有近期检验项目
 */
function getRecentItem(){
    var param = {
        patientId: diaExecuteOrderList.patientId
    }
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/tesPlan/recentTestPlanList.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            if(isNotEmpty(data)){
                for (var i = 0; i < data.length; i++){
                    if (data[i].isRecent === '0') {
                        $('#recentItem').css('background-color', '#FF784E');
                        $('#recentItem').css('color', '#ffffff');
                        $('#recentItem').css('border-color', '#FF784E');
                        break;
                    }
                }
            }
        }
    });
}

/**
 * 执行医嘱，个人出库复选框监听
 */
function monitorCheckbox() {

    var form = layui.form;
    form.on('checkbox(selfDrugs)', function(data){
        var checked = data.elem.checked      //被点击的checkbox 是否选中
        var selfDrugs = 'N';
        if(checked) {
            selfDrugs = 'Y';
        }
        var param = {
            executeOrderId:  $(this).attr('data-id'),
            selfDrugs: selfDrugs,
            diaRecordId: diaExecuteOrderList.diaRecordId
        }
        layer.confirm('确定修改个人出库？', function(index) {
            layer.close(index);
            _ajax({
                type: "POST",
                url: $.config.services.dialysis + "/diaExecuteOrder/updateSelfDrugs.do",
                data: param,  //必须字符串后台才能接收list,
                //loading:false,  //是否ajax启用等待旋转框，默认是true
                dataType: "json",
                done: function (data) {
                    successToast("修改成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('diaExecuteOrderList_table'); //重新刷新table
                }
            });
        });
    });
}

/**
 * 监听tab
 */
function tabEvent() {
    layui.use('element', function () {
        var element = layui.element;
        //监听Tab切换，以改变地址hash值
        element.on('tab(diaExecuteOrderTab)', function () {
            var tabId = this.getAttribute('lay-id');   //获取选项卡的lay-id

            layui.form.render('radio');

            var dataStatus = '';
            if (tabId === 'standingOrder') {
                diaExecuteOrderList.currentTable = 'standingOrder_table';
                diaExecuteOrderList.category = '0';
                dataStatus = $("input[name='standStatus']:checked").val();
            } else if (tabId === 'medicalRecords') {
                diaExecuteOrderList.currentTable = 'medicalRecords_table';
                diaExecuteOrderList.category = '1';
                dataStatus = $("input[name='medicalStatus']:checked").val();
            } else if (tabId === 'templateOrder') {
                diaExecuteOrderList.currentTable = 'templateOrder_table';
                diaExecuteOrderList.category = '2';
                dataStatus = '0';   //备用长期医嘱，查启用状态的数据
            }
            getOrderList(dataStatus);
        });
    });
}

/**
 * 单选按钮监听事件
 */
function monitorRadio() {
    var form = layui.form;
    form.on('radio(standStatus)', function(data){
        var value = data.value;//被点击的radio的value值
        getOrderList(value);
    });
    form.on('radio(medicalStatus)', function(data){
        var value = data.value;//被点击的radio的value值
        getOrderList(value);
    });
}

/**
 * 备用长期医嘱添加执行到当日医嘱
 */
function addPerform(orderId) {
    var param = {
        orderId: orderId,
        diaRecordId: diaExecuteOrderList.diaRecordId
    }
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaExecuteOrder/addPerform.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("添加执行成功");
            var table = layui.table; //获取layui的table模块
            table.reload('diaExecuteOrderList_table'); //重新刷新table
        }
    });
}

/**
 * 备用长期医嘱续开
 */
function continueOpenOrder(orderId) {
    var param = {
        orderId: orderId
    }
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patOrder/continueOpenOrder.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("续开医嘱成功");
            var table = layui.table; //获取layui的table模块
            table.reload(diaExecuteOrderList.currentTable); //重新刷新table
        }
    });
}

/**
 * 保存长期医嘱
 */
function saveOrEditOrder(id, addSub, frequency, usageDays,channel) {
    var url = "";
    var title = "";
    if (addSub) {    //新增子医嘱
        title = "新增子医嘱";
        url = $.config.server + "/patient/patOrderEdit?patientId=" + diaExecuteOrderList.patientId + "&parentOrderId=" + id +
            "&category=" + diaExecuteOrderList.category + "&frequency=" + frequency + "&usageDays=" + usageDays + "&channel=" + channel;
    } else {
        if (isEmpty(id)) {  //id为空,新增操作
            title = "新增";
            url = $.config.server + "/patient/patOrderEdit?patientId=" + diaExecuteOrderList.patientId + "&category=" + diaExecuteOrderList.category;
        } else {  //编辑
            title = "编辑";
            url = $.config.server + "/patient/patOrderEdit?orderId=" + id + "&category=" + diaExecuteOrderList.category + '&patientId=' + diaExecuteOrderList.patientId
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
                    successToast('保存成功');
                    var table = layui.table; //获取layui的table模块
                    table.reload(diaExecuteOrderList.currentTable); //重新刷新table
                    if (diaExecuteOrderList.currentTable === 'standingOrder_table') {   //修改透析长期医嘱，要刷新执行医嘱表格
                        table.reload('diaExecuteOrderList_table');
                    }
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 保存执行医嘱
 */
function saveOrEdit(id, addSub, frequency, usageDays,channel){
    var url="";
    var title="";
    if(addSub){
        title="新增子医嘱";                      //新增执行医嘱，category=3
        url=$.config.server + "/dialysis/diaExecuteOrderEdit?diaRecordId=" + diaExecuteOrderList.diaRecordId + "&category=" + '3' + "&parentExecuteOrderId=" + id +
         "&frequency=" + frequency + "&usageDays=" + usageDays + "&channel=" + channel;
    }else{
        if (isEmpty(id)) {  //id为空,新增操作
            title = "新增";
            url = $.config.server + "/dialysis/diaExecuteOrderEdit?diaRecordId=" + diaExecuteOrderList.diaRecordId + "&category=" + '3';
        } else {  //编辑
            title = "编辑";
            url = $.config.server + "/dialysis/diaExecuteOrderEdit?id=" + id + "&diaRecordId=" + diaExecuteOrderList.diaRecordId;
        }
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url:url,  //弹框自定义的url，会默认采取type=2
        width:900, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:700,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin, layer){
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
                    table.reload('diaExecuteOrderList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 修改长期医嘱
 */
function editOrder() {
    var table = layui.table;
    var checkStatus = table.checkStatus(diaExecuteOrderList.currentTable);
    var data = checkStatus.data;
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }
    if (data.length > 1) {
        warningToast('只能选择一笔医嘱进行修改');
        return false;
    }
    var id = data[0].orderId;
    saveOrEditOrder(id);
}

/**
 * 删除长期医嘱
 */
function deleteOrder() {
    var table = layui.table;
    var checkStatus = table.checkStatus(diaExecuteOrderList.currentTable);
    var data = checkStatus.data;
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }

    layer.confirm('确定删除所选记录吗？', function(index){
        layer.close(index);
        var ids = [];    //需要删除的医嘱信息的id
        data.forEach(function (item, i) {
            ids.push(item.orderId);
        })
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
                table.reload(diaExecuteOrderList.currentTable); //重新刷新table
            }
        });
    });
}

/**
 * 停用长期医嘱
 */
function disable(id, status) {
    var param = {
        "id": id,
        "dataStatus": status
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patOrder/disable.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            var tip = status === '0' ? '启用成功' : '停用成功';
            successToast(tip);
            var table = layui.table; //获取layui的table模块
            table.reload(diaExecuteOrderList.currentTable); //重新刷新table
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
        url: $.config.server + "/patient/importOrder?category=" + diaExecuteOrderList.category + '&patientId=' + diaExecuteOrderList.patientId,  //弹框自定义的url，会默认采取type=2
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
                    table.reload(diaExecuteOrderList.currentTable); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 删除执行医嘱
 * @param ids
 */
function del(id,orderType){
    var param={
        "id":id,
        "diaRecordId": diaExecuteOrderList.diaRecordId,
        "orderType":orderType
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis+"/diaExecuteOrder/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('diaExecuteOrderList_table'); //重新刷新table
        }
    });
}

/**
 * 全部提交
 */
function commitAll() {
    var table = layui.table;
    var checkStatus = table.checkStatus('diaExecuteOrderList_table');
    var data = checkStatus.data;
    if(data.length===0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定提交所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (item.orderStatus !== $.constant.orderStatus.NOT_COMMIT) {  //判断医嘱是不是 未提交  状态
                    warningToast('请选择未提交的医嘱');
                    return false;
                }

                if (isEmpty(item.parentExecuteOrderId)) {   //将父医嘱添加到ids
                    ids.push(item.executeOrderId);
                    if (isNotEmpty(item.subOrderId)) {
                        ids = ids.concat(item.subOrderId.split(','));   //将子医嘱一起进行提交
                    }
                }
            }
            commit(ids);
        });
    }
}

/**
 * 提交医嘱
 */
function commit(ids) {
    var param = {
        ids: ids,
        orderStatus: $.constant.orderStatus.SUBMITTED,   // 将医嘱状态改为(已提交/待执行)状态
        diaRecordId: diaExecuteOrderList.diaRecordId
    }
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaExecuteOrder/commit.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            //刷新应收单上传状态
            if (window.parent.onRefreshRecordOption) { window.parent.onRefreshRecordOption(); }
            successToast(data);
            var table = layui.table; //获取layui的table模块
            table.reload('diaExecuteOrderList_table'); //重新刷新table
        }
    });
}

/**
 * 取消提交医嘱
 */
function cancelCommit(ids) {
    var param = {
        ids: ids,
        orderStatus: $.constant.orderStatus.NOT_COMMIT,     // 将医嘱状态改为 未提交 状态
        diaRecordId: diaExecuteOrderList.diaRecordId
    }
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaExecuteOrder/cancelCommit.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            //刷新应收单上传状态
            if (window.parent.onRefreshRecordOption) { window.parent.onRefreshRecordOption(); }
            successToast("已取消提交");
            var table = layui.table; //获取layui的table模块
            table.reload('diaExecuteOrderList_table'); //重新刷新table
        }
    });
}


/**
 * 全部核对
 */
function checkAll() {
    var table = layui.table;
    var checkStatus = table.checkStatus('diaExecuteOrderList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定核对所选记录？', function(index){
            layer.close(index);
            var ids=[];
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (item.orderStatus !== $.constant.orderStatus.EXECUTED) {  //判断医嘱是不是 已执行/待核对  状态
                    warningToast('请选择已执行的医嘱');
                    return false;
                }

                if (item.executeOrderNurse === diaExecuteOrderList.userId) {
                    warningToast('你是执行护士，不能进行核对');
                    return false;
                }

                if (isEmpty(item.parentExecuteOrderId)) {   //将父医嘱添加到ids
                    ids.push(item.executeOrderId);
                    if (isNotEmpty(item.subOrderId)) {
                        ids = ids.concat(item.subOrderId.split(','));   //将子医嘱一起进行提交
                    }
                }
            }
            check(ids);
        });
    }
}

/**
 * 核对医嘱
 */
function check(ids) {
    _layerOpen({
        openInParent: true,
        url:$.config.server + "/dialysis/orderCheckDate?ids=" + ids.join(',') + "&diaRecordId=" + diaExecuteOrderList.diaRecordId,  //弹框自定义的url，会默认采取type=2
        width:400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:500,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:'患者标签', //弹框标题
        done:function(index,iframeWin, layer){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("医嘱核对成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('diaExecuteOrderList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 取消核对医嘱
 */
function cancelCheck(ids) {
    var param = {
        ids: ids,
        orderStatus: $.constant.orderStatus.CANCEL_CHECKED,   //将医嘱状态修改为 已取消核对/取消执行/核对 状态
        diaRecordId: diaExecuteOrderList.diaRecordId
    }
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaExecuteOrder/cancelCheck.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("已取消核对");
            var table = layui.table; //获取layui的table模块
            table.reload('diaExecuteOrderList_table'); //重新刷新table
        }
    });
}

/**
 * 执行医嘱
 */
function execute(ids) {
    var param = {
        ids: ids,
        orderStatus: $.constant.orderStatus.EXECUTED,   //将医嘱状态修改为 已执行/待核对 状态
        diaRecordId: diaExecuteOrderList.diaRecordId
    }
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaExecuteOrder/execute.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("执行成功");
            var table = layui.table; //获取layui的table模块
            table.reload('diaExecuteOrderList_table'); //重新刷新table
        }
    });
}

/**
 * 取消执行医嘱
 */
function cancelExecute(ids) {
    var param = {
        ids: ids,
        orderStatus: $.constant.orderStatus.CANCELLED_EXECUTE,   //将医嘱状态修改为 已取消执行 状态
        diaRecordId: diaExecuteOrderList.diaRecordId
    }
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaExecuteOrder/cancelExecute.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("已取消执行");
            var table = layui.table; //获取layui的table模块
            table.reload('diaExecuteOrderList_table'); //重新刷新table
        }
    });
}

/**
 * 查看医嘱历史
 */
function orderHistory() {
    _layerOpen({
        openInParent: true,
        url:$.config.server + "/dialysis/orderHistory?patientId=" + diaExecuteOrderList.patientId,
        width:1300, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:700,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:'医嘱历史', //弹框标题
        readonly: true,
        done:function(index,iframeWin, layer){
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 近期检验项目
 */
function recentItem() {
    _layerOpen({
        openInParent: true,
        url:$.config.server + "/dialysis/recentInspectionItemList?patientId=" + diaExecuteOrderList.patientId + "&diaRecordId=" + diaExecuteOrderList.diaRecordId,
        width:1000, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:600,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:'检验项目', //弹框标题
        done:function(index,iframeWin, layer){
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success(data) {
                    successToast('保存成功');
                    var table = layui.table; //获取layui的table模块
                    table.reload('diaExecuteOrderList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 打印医嘱
 */
function printOrder() {
    _layerOpen({
        openInParent: true,
        url: $.config.server + "/dialysis/diaExecuteOrderPrint?patientId=" + diaExecuteOrderList.patientId + '&diaRecordId=' + diaExecuteOrderList.diaRecordId,
        width: 710, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 842,  // 弹框自定义的高度，方法会自动判断是否超过高度
        title: "打印医嘱", // 弹框标题
        btn: ["打印", "取消"],
        done: function (index, iframeWin, layer) {
            var ids = iframeWin.onPrint();
        }
    });
}