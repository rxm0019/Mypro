/**
 * 监测记录
 * @author Care
 * @date 2020-09-20
 * @version 1.0
 */
var diaMonitorRecordList = avalon.define({
    $id: "diaMonitorRecordList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    diaRecordId: '',//透析记录ID
    patientId: '',//患者Ｉｄ
    dialysisDate: '',//透析日期
    unusualLength: 0,//病症列表条数
    monitorLength: 0,//监测记录列表条数
    dosageAdd: '',//追加抗凝剂
    dosageFirstUnit: '',//抗凝剂单位
    dialysisMode: '',//透析方式
    formReadonly: false,//归档后只读状态
    monitorRecordCount: 0,//监测记录条数
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        diaMonitorRecordList.diaRecordId = GetQueryString("diaRecordId");
        diaMonitorRecordList.patientId = GetQueryString("patientId");
        diaMonitorRecordList.formReadonly = GetQueryString("readonly") == "Y";
        if (window.parent.showTabBadgeDot) {
            window.parent.showTabBadgeDot(false);
        }
        initSearch(); //初始化搜索框
        getList(diaMonitorRecordList.diaRecordId);  //查询列表
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#diaMonitorRecordList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'diaMonitorRecordList_search'  //指定的lay-filter
        , conds: []
        , done: function (filter, data) {
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        , search: function (data) {
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('diaMonitorRecordList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getList(diaRecordId) {
    var param = {
        "diaRecordId": diaRecordId,
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaMonitorRecord/listAll.do",
        dataType: "json",
        data: param,
        done: function (data) {
            var isFiled = data.isFiled;
            var diaUnusualItems = data.diaUnusualItems;
            var diaMonitorRecords = data.diaMonitorRecords;
            var diaBaseWithBLOBs = data.diaBaseWithBLOBs;
            if (isNotEmpty(diaBaseWithBLOBs)) {
                console.log("data.diaBaseWithBLOBs", diaBaseWithBLOBs);
                diaMonitorRecordList.dosageAdd = getSysDictName($.dictType.Anticoagulant, diaBaseWithBLOBs.dosageAdd);
                diaMonitorRecordList.dosageFirstUnit = getSysDictName($.dictType.AnticoagulantUnit, diaBaseWithBLOBs.dosageFirstUnit);
                diaMonitorRecordList.dialysisMode = diaBaseWithBLOBs.dialysisMode;
            }
            //监测记录列表
            getMonitorList(diaMonitorRecords);
            //查询病症列表事件
            getDiseaseList(diaUnusualItems);

        }
    })
}

/**
 * 监测记录列表
 */
function getMonitorList(diaMonitorRecords) {
    var util = layui.util;
    var monitorRecordColumnConfig = {
        monitorTime: {
            fixed: "left", field: "monitorTime", title: "时间", width: 85, align: 'center', templet: function (row) {
                return isEmpty(row.monitorTime) ? "" : util.toDateString(row.monitorTime, "HH:mm");
            }
        },
        bloodFlow: {field: "bloodFlow", title: "血流量", minWidth: 85, align: 'center'},
        veinPressure: {field: "veinPressure", title: "静脉压", minWidth: 85, align: 'center'},
        arteryPressure: {field: "arteryPressure", title: "动脉压", minWidth: 85, align: 'center'},
        transmembrane: {field: "transmembrane", title: "跨膜压", minWidth: 85, align: 'center'},
        systolicPressure: {
            field: "systolicPressure", title: "收缩压/舒张压" + "<br>" + "(mmHg)", minWidth: 120, align: 'center',
            templet: function (row) {
                var systolicPressure = isEmpty(row.systolicPressure) ? "--" : row.systolicPressure; // 收缩压
                var diastolicPressure = isEmpty(row.diastolicPressure) ? "--" : row.diastolicPressure; // 舒张压
                return systolicPressure + " / " + diastolicPressure;
            }
        },
        pulse: {field: "pulse", title: "脉搏" + "<br>" + "(次/分)", minWidth: 85, align: 'center'},
        respire: {field: "respire", title: "呼吸" + "<br>" + "(次/分)", minWidth: 85, align: 'center'},
        heparinValue: {field: "heparinValue", title: diaMonitorRecordList.dosageAdd + "<br>" + "(" + diaMonitorRecordList.dosageFirstUnit + "/h)", width: 150, align: 'center'},
        conductivity: {field: "conductivity", title: "电导度" + "<br>" + "(us/cm)", minWidth: 85, align: 'center'},
        dialysateTemperature: {field: "dialysateTemperature", title: "透析液温度" + "<br>" + "(℃)", minWidth: 110, align: 'center'},
        replacementFluidTotal: {field: "replacementFluidTotal", title: "置换液累计量" + "<br>" + "(L)", minWidth: 120, align: 'center'},
        totalMoreDehydration: {
            field: "totalMoreDehydration", title: "累计脱水量(L)/脱水速率(L/H)", minWidth: 220, align: 'center',
            templet: function (row) {
                var totalMoreDehydration = isEmpty(row.totalMoreDehydration) ? "--" : row.totalMoreDehydration; // 累加脱水量
                var moreDehydrationRate = isEmpty(row.moreDehydrationRate) ? "--" : row.moreDehydrationRate; // 脱水速率
                return totalMoreDehydration + "L / " + moreDehydrationRate + "L/H";
            }
        },
        linkSafe: {
            field: "linkSafe", title: "管路安全", minWidth: 110, align: 'center',
            templet: function (row) {
                var selectedPosition = (row.position || "").split(",");
                var selectedPositionDesc = [];
                if (selectedPosition.indexOf($.constant.LinkSafePosition.A.value) >= 0) {
                    selectedPositionDesc.push($.constant.LinkSafePosition.A.name);
                }
                if (selectedPosition.indexOf($.constant.LinkSafePosition.V.value) >= 0) {
                    selectedPositionDesc.push($.constant.LinkSafePosition.V.name);
                }
                console.log(row.position, selectedPositionDesc);

                var linkSafe = getSysDictName("LinkSafe", row.linkSafe) || "--";
                var position = selectedPositionDesc.join(",");
                return linkSafe + (isEmpty(position) ? "" : " / " + position);
            }
        },
    };

    // 根据透析基本信息，隐藏部分字段
    var hideColumns = [];
    var dialysisModeBizCode = getSysDictBizCode($.dictType.DialysisMode, diaMonitorRecordList.dialysisMode);
    if (isEmpty(diaMonitorRecordList.dosageAdd)) { // 透析治疗无追加时候，隐藏肝素量该列
        hideColumns.push(monitorRecordColumnConfig.heparinValue.field);
    }
    if (dialysisModeBizCode != $.constant.DialysisMode.HDF) { // 透析治疗非hdf隐藏置换液
        hideColumns.push(monitorRecordColumnConfig.replacementFluidTotal.field);
    }

    // 根据字典设置是否显示列
    var showColumns = [];
    var monitoringRecordDict = getSysDictByCode($.dictType.MonitoringRecords);
    $.each(monitoringRecordDict, function (index, item) {
        // “字典设置该列显示 && 存在该设置列 && 不是隐藏列”，则加入显示的列表中
        if (item.dictBizCode === "1" && monitorRecordColumnConfig[item.value] && hideColumns.indexOf(item.value) < 0) {
            var column = monitorRecordColumnConfig[item.value];
            showColumns.push(column);
        }
    });
    // 默认添加操作列
    showColumns.push({ fixed: 'right', title: '操作', width: 120, align: 'center', toolbar: '#diaMonitorRecordList_bar' });

    // 渲染表格
    _layuiTable({
        elem: '#diaMonitorRecordList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'diaMonitorRecordList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            page: false,
            data: diaMonitorRecords, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [showColumns],
            done: function (res, curr, count) {
                diaMonitorRecordList.monitorRecordCount = count;
                if (count > 0) {
                    window.parent.showTabBadgeDot(false);
                } else {
                    window.parent.showTabBadgeDot(true);
                }
            }
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent == 'detail') {
                if (isNotEmpty(data.monitorRecordId)) {
                    saveOrEdit(data.monitorRecordId, layEvent, true);
                }
            } else if (layEvent === 'copy') { //编辑
                //do something
                saveOrEdit(data.monitorRecordId, layEvent, false);

            } else if (layEvent === 'edit') { //编辑
                //do something
                if (isNotEmpty(data.monitorRecordId)) {
                    saveOrEdit(data.monitorRecordId, layEvent, false);
                }
            } else if (layEvent === 'del') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.monitorRecordId)) {
                        del(data.monitorRecordId);
                    }
                });
            }
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(id, layEvent, readonly) {
    var url = "";
    var title = "";
    if (isEmpty(id)) {  //id为空,新增操作
        title = "新增";
        url = $.config.server + "/dialysis/diaMonitorRecordEdit?diaRecordId=" + diaMonitorRecordList.diaRecordId + "&dosageFirstUnit=" + diaMonitorRecordList.dosageFirstUnit + "&layEvent=" + "add";
    } else {  //编辑
        title = readonly ? "详情" : "编辑";
        url = $.config.server + "/dialysis/diaMonitorRecordEdit?id=" + id + "&dosageFirstUnit=" + diaMonitorRecordList.dosageFirstUnit + "&layEvent=" + layEvent;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 800, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 500,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        readonly: readonly,   //true - 查看详情  false - 编辑
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    getList(diaMonitorRecordList.diaRecordId);
                    successToast("保存成功", 1000);
                    // 刷新当前透析记录状态
                    if (window.parent.onRefreshRecordOption) { window.parent.onRefreshRecordOption(); }
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
function del(monitorRecordId) {
    var param = {
        "monitorRecordId": monitorRecordId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaMonitorRecord/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            getList(diaMonitorRecordList.diaRecordId);
            successToast("删除成功");
        }
    });
}

/**
 * 查询病症列表事件
 */
function getDiseaseList(diaUnusualItems) {
    var util = layui.util;
    _layuiTable({
        elem: '#diaUnusualRecordList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'diaUnusualRecordList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            page: false,
            data: diaUnusualItems,
            cols: [[ //表头
                {
                    field: 'monitorTime', title: '记录时间', width: 100, align: 'center'
                    , templet: function (d) {
                        return util.toDateString(d.monitorTime, "HH:mm");
                    }
                }
                , {
                    field: 'unusualDetails', title: '病症及体征'
                    , templet: function (d) {
                        var list = d.unusualDetails.split(",");
                        var html = "";
                        $.each(list, function (index, item) {
                            html += '<div style="width: 100%; height: 29px;float: left;"><span class="layui-badge-dot layui-bg-black"></span><span style="font-size: 14px;margin-left: 5px">' + getSysDictName("UnusualDetails", item) + '</span></div>';
                        })
                        return html
                    }
                }
                , {field: 'handleDetails', title: '处理'}
                , {field: 'handleResults', title: '结果', align: 'left'}
                , {field: 'recorder', title: '记录人', width: 100, align: 'center'}
                , {
                    fixed: 'right', title: '操作', width: 140, align: 'center', toolbar: '#diaUnusualRecordList_bar'
                }
            ]],
            done: function (res, curr, count) {
                if (count > 0) {
                    window.parent.showTabBadgeDot(false);
                } else if (diaMonitorRecordList.monitorRecordCount > 0) {
                    window.parent.showTabBadgeDot(false);
                } else {
                    window.parent.showTabBadgeDot(true);
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
                if (isNotEmpty(data.unusualRecordId)) {
                    addOrEdit(data.unusualRecordId);
                }
            } else if (layEvent === 'delete') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.unusualRecordId)) {
                        diseaseDelete(data.unusualRecordId);
                    }
                });
            }
        }
    });
}

/**
 * 获取单个实体
 */
function addOrEdit(id) {
    var url = "";
    var title = "";
    if (isEmpty(id)) {  //id为空,新增操作
        title = "新增";
        url = $.config.server + "/dialysis/diaUnusualRecordEdit?diaRecordId=" + diaMonitorRecordList.diaRecordId;
    } else {  //编辑
        title = "编辑";
        url = $.config.server + "/dialysis/diaUnusualRecordEdit?id=" + id;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 500, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 500,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    getList(diaMonitorRecordList.diaRecordId);
                    successToast("保存成功", 1000);
                    // 刷新当前透析记录状态
                    if (window.parent.onRefreshRecordOption) { window.parent.onRefreshRecordOption(); }
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}


/**
 * 病症删除事件
 * @param ids
 */
function diseaseDelete(unusualRecordId) {
    var param = {
        "unusualRecordId": unusualRecordId,
        "diaRecordId": diaMonitorRecordList.diaRecordId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaUnusualRecord/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            getList(diaMonitorRecordList.diaRecordId);
            successToast("删除成功", 1000);
        }
    });
}
