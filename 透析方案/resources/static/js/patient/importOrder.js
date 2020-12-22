/**
 * 从组套导入的js文件，包括查询，删除
 * @author anders
 * @date 2020-09-02
 * @version 1.0
 */
var importOrder = avalon.define({
    $id: "importOrder",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,founder: ''   //创建人
    ,createTime: ''   //创建时间
    ,groupItemName: ''  //组套名称
    ,showGroupItem: false   //默认不显示
    ,delGroupId: ''     //要删除组套的id
    ,category: ''     //类别    0-透析长期医嘱，1-普通长期医嘱，2-备用长期医嘱
    ,patientId: ''    //患者id
    ,prescriptionId: ''  //处方笺id
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        var category =  GetQueryString('category');    //类别
        var patientId = GetQueryString('patientId');
        var prescriptionId = GetQueryString('prescriptionId');   //处方笺从组套导入
        importOrder.category = category;
        importOrder.patientId = patientId;
        importOrder.prescriptionId = prescriptionId;
        searchGroup();

        avalon.scan();
    });
});

/**
 * 查询列表事件
 */
function searchGroup() {
    importOrder.showGroupItem = false;
    var value = $('#orderGroupName').val();
    var param = {
        orderGroupName: value
    }
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#orderGroup_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'orderGroup_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            // height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.platform + '/bacOrderGroup/listAll.do',
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {field: 'orderGroupName', title: '组套名称', align: 'center'}
                ,{field: 'founder', title: '创建人', align: 'center'}
                ,{
                    field: 'createTime', title: '创建时间', align: 'center',width: '150'
                    , templet: function (d) {
                        return util.toDateString(d.createTime, 'yyyy-MM-dd HH:mm');
                    }
                }
            ]]
        }
    });
    //监听表格checkbox
    table.on('row(orderGroup_table)', function(obj){
        var rowData = obj.data;
        //标注选中样式
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
        getOrderGroupItem(rowData.orderGroupId);
        importOrder.delGroupId = rowData.orderGroupId;
        importOrder.groupItemName = rowData.orderGroupName;
        importOrder.founder = rowData.founder;
        importOrder.createTime = util.toDateString(rowData.createTime, 'yyyy-MM-dd HH:mm');
    });
}

/**
 * 获取医嘱组套子项
 */
function getOrderGroupItem(groupId) {
    importOrder.showGroupItem = true;
    var param = {
        orderGroupId: groupId
    }
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#importOrder_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'importOrder_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            // height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.platform + '/bacOrderGroupItem/listAll.do',
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {
                    field: 'orderType', title: '分类/子分类', align: 'center', width:200
                    , templet: function (d) {
                        if (d.orderType == '1') {  // 医嘱类别为药疗显示库存
                            return getSysDictName('OrderType', d.orderType) + '/' + getSysDictName('MedicalTherapy', d.orderSubType);
                        } else {
                            return getSysDictName('OrderType', d.orderType);
                        }
                    }
                }
                , {
                    field: 'orderContent', title: '医嘱名称#规格', align: 'left', width: 410,toolbar: '#orderContentTemplet'
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
                    field: 'channel', title: '途径', align: 'center',width:100
                    , templet: function (d) {
                        if (isEmpty(d.channel)) {
                            return '--';
                        }
                        return getSysDictName('Route', d.channel);
                    }
                }
                , {field: 'totalDosage', title: '总量<br>总量(取整)', align: 'center',width:200,templet:function (d) {
                        if (isEmpty(d.totalDosage)) {
                            return '';
                        }
                        var html = '<div>' + d.totalDosage + d.basicUnit + '</div>';
                        if (d.orderType === '1') {
                            if (d.conversionRel2Sales === 0 || d.conversionRel2Basic === 0 || d.allowSplitDispense === 'Y') {
                                return html;
                            }
                            var value = d.totalDosage * (d.conversionRel2Sales / d.conversionRel2Basic);
                            if (value % 1 === 0) {   //整除
                                html += '<div>' + value + getSysDictName('purSalesBaseUnit', d.salesUnit) + '</div>';
                            } else {
                                html += '<div style="color: #ff0000;">' + Math.ceil(value) + getSysDictName('purSalesBaseUnit', d.salesUnit) + '余' + (Math.ceil(value) * d.conversionRel2Basic - d.totalDosage) + d.basicUnit + '</div>';
                            }

                        }
                        return html;
                    }}
                , {
                    field: 'startDate', title: '起始日期<br>循环周期', align: 'center', width:180
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
            ]]
            , done: function () {
                // 所有子医嘱添加特殊背景色
                var tableTarget = $("[lay-id='importOrder_table']");
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

            if (layEvent === 'toggle-fold-suborder') {
                var orderId = data.orderGroupItemId;
                var tableTarget = $("[lay-id='importOrder_table']");
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
 * 删除组套
 */
function delOrderGroup() {
    if (isEmpty(importOrder.delGroupId)) {
        warningToast('请选择要删除的组套');
        return false;
    }

    layer.confirm('确定删除所选组套吗？', function (index) {
        // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
        layer.close(index);
        //向服务端发送删除指令
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + '/bacOrderGroup/delete.do',
            data: {id: importOrder.delGroupId},
            dataType: "json",
            done:function(data){
                successToast('删除成功');
                importOrder.showGroupItem = false;
                importOrder.delGroupId = '';
                var table = layui.table; //获取layui的table模块
                table.reload('importOrder_table', table.cache.importOrder_table);
                table.reload('orderGroup_table'); //重新刷新table
            }
        });
    });
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    var list = layui.table.cache['importOrder_table'];
    var url = $.config.services.dialysis + '/patOrder/importOrder.do';
    var param = {
        category: importOrder.category,
        patientId: importOrder.patientId,
        orderList: list
    };
    if (isEmpty(importOrder.category)){   //类型为空，则是门诊收费--医嘱明细的从组套导入
        param = {
            prescriptionId: importOrder.prescriptionId,
            orderList: list
        };
        url = $.config.services.dialysis + '/diaOutpatientDetails/importOrder.do';
    }
    if (isEmpty(list) && list.length == 0) {
        warningToast('请选择需要导入的组套');
        return false;
    }
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        // url: $.config.services.dialysis+"/patVascularRoad/saveOrEdit.do",
        url: url,
        data:{jsonData: JSON.stringify(param)},
        dataType: "json",
        done:function(data){
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });

}



