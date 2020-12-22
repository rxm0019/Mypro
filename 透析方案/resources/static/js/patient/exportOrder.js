/**
 * exportOrder.js的js文件
 * @author anders
 * @date 2020-08-24
 * @version 1.0
 */
var exportOrder = avalon.define({
    $id: "exportOrder",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,orderList: []        //接收到的医嘱数据
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var uuid = GetQueryString('uuid');
        exportOrder.orderList = JSON.parse(sessionStorage.getItem(uuid));   //根据获取的uuid获取缓存的医嘱数据
        sessionStorage.removeItem(uuid);    //获取到医嘱数据后， 删除缓存
        getList();
        avalon.scan();
    });
});

/**
 * 查询列表事件
 */
function getList() {
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#exportOrder_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'exportOrder_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            // height:'full-180', //table的高度，页面最大高度减去差值
            data: exportOrder.orderList,
            page: false,
            cols: [[ //表头
                {
                    field: 'orderType', title: '分类/子分类', align: 'center', width: 200
                    , templet: function (d) {
                        if (d.orderType == '1') {  // 医嘱类别为药疗显示库存
                            return getSysDictName('OrderType', d.orderType) + '/' + getSysDictName('MedicalTherapy', d.orderSubType);
                        } else {
                            return getSysDictName('OrderType', d.orderType);
                        }
                    }
                }
                , {
                    field: 'orderContent', title: '医嘱名称#规格', align: 'center', align: 'left', width: 410,toolbar: '#orderContentTemplet'
                }
                , {
                    field: 'dosage', title: '单次剂量 x 频率 x 天数', align: 'center', width: 200
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
                    field: 'channel', title: '途径', align: 'center'
                    , templet: function (d) {
                        if (isEmpty(d.channel)) {
                            return '--';
                        }
                        return getSysDictName('Route', d.channel);
                    }
                }
                , {field: 'totalDosage', title: '总量<br>总量(取整)', align: 'center',width: 150,templet:function (d) {
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
                            html += '<div style="color: #ff0000;">' + Math.ceil(value) + getSysDictName('purSalesBaseUnit', d.salesUnit)+ '余' + (Math.ceil(value) * d.conversionRel2Basic - d.totalDosage) + d.basicUnit + '</div>';
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
                    fixed: 'right', title: '操作', width: 100, align: 'center'
                    , toolbar: '#exportOrder_bar'
                }
            ]]
            ,done: function () {
                // 所有子医嘱添加特殊背景色
                var tableTarget = $("[lay-id='exportOrder_table']");
                var subOrderTrs = tableTarget.find(".order-content.sub-order[data-parent-order-id]").closest("tr[data-index]");
                $.each(subOrderTrs, function (index, item) {
                    var dataIndex = $(item).attr("data-index");
                    tableTarget.find(".layui-table-body table tr[data-index='" + dataIndex + "']").addClass("sub-order-tr");
                });
            }
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'del') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    if (isNotEmpty(data.orderId) || isNotEmpty(data.detailsId)) {
                        var arr = exportOrder.orderList;
                         for (var i = arr.length - 1; i >= 0; i--) {
                             var item = arr[i];
                            if (item.orderId === data.orderId) {
                                arr.splice(i, 1);    //删除下标为i的元素  删除长度为1
                            }
                            if (isNotEmpty(item.parentOrderId) && item.parentOrderId === data.orderId) {
                                arr.splice(i, 1);
                            }
                        }
                        exportOrder.orderList = arr;
                        getList();
                    }
                });
            }

            if (layEvent === 'toggle-fold-suborder') {
                var orderId = data.orderId;
                var tableTarget = $("[lay-id='exportOrder_table']");
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
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(exportOrder_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#exportOrder_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //导出组套
    verify_form(function(field){
        var param=field; //表单的元素
        var dataList = {};
        if (exportOrder.orderList.length <= 0) {
            warningToast('请选择需要导出的医嘱');
            return;
        }
        dataList.orderGroupName = param.orderGroupName;
        dataList.orderGroupItemList = exportOrder.orderList;
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + '/bacOrderGroup/save.do',
            data:{jsonData: JSON.stringify(dataList)},
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



