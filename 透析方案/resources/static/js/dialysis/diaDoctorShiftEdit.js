/**
 * 医护交班
 * @author Care
 * @date 2020-10-10
 * @version 1.0
 */
var diaDoctorShiftEdit = avalon.define({
    $id: "diaDoctorShiftEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId: '',//患者ｉｄ
    diaRecordId: '',//透析ｉｄ
    scheduleShift: '',//班次
    patientScheduleShift: '',  //医护交班，交班类型班次
    queryMode: '2',      //查询模式  1-班次  2-肾友
    shiftDate: new Date(),//交班日期
    pathType: '',//通路类型　　0-导管　　1-代表穿刺
    shiftDateLog: '',//交班日志日期
    shiftShow: false,//班次是否显示
    sumCatheter: 0,//导管例
    sumPuncture: 0,//穿刺例
    dialuSum: 0,//透析人数
    increaseSum: 0,//转入人数
    outInSum: 0,//转出人数
    rujiSum: 0,//留治人数
    deathSum: 0,//死亡人数
    diaMachineFailureListList: [],//故障透析机列表
    deleteMachineFailureList: [],//故障透析机删除列表
    diaShiftPatientListList: [],//病患名单
    mapDialysisMode: [],//透析例次
    dialysisDateVal: '',//交班日期
    dialysisDate: '',//透析日期
    catheterListTable: [],//血管通路-导管表格
    catheterColumnList: [],//血管通路-导管表格-表头
    punctureListTable: [],//血管通路-穿刺表格
    punctureColumnList: [],//血管通路-穿刺表格-表头
    dialysisRoutineListTable: [],//透析例次
    routineColumnList: [],//透析例次-表头
    complicaListTable: [],//并发症统计
    complicaColumnList: [],//并发症统计-表头
    unusualRows: [],//并发症数
    diaInstanceRows: [],//透析例次
    doctorList: [],//医生列表
    nurseList: [],//护士列表
    scheduleShiftList: []
});

layui.use(['index', 'formSelects'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var shiftArr = getSysDictByCode('Shift', false);  //班次   字典数据
        shiftArr.unshift({name: '全天', value: ''});               //把全天添加到班次中
        diaDoctorShiftEdit.scheduleShiftList = shiftArr;

        //初始化表单元素,日期时间选择器
        var laydate = layui.laydate;
        laydate.render({
            elem: '#shiftDate'
            , type: 'date'
            , value: new Date()
        });
        laydate.render({
            elem: '#shiftDateLog'
            , type: 'date'
            , value: new Date()
        });
        diaDoctorShiftEdit.shiftDateLog = layui.util.toDateString(new Date(), "yyyy-MM-dd");
        diaDoctorShiftEdit.dialysisDateVal = layui.util.toDateString(new Date(), "yyyy-MM-dd");
        diaDoctorShiftEdit.diaRecordId = GetQueryString("diaRecordId");  //接收变量
        diaDoctorShiftEdit.patientId = GetQueryString("patientId");  //接收变量
        diaDoctorShiftEdit.dialysisDate = GetQueryString("dialysisDate");  //接收变量

        $($('.tab-style')[0]).trigger('click');
        // getScheduleShift(diaDoctorShiftEdit.diaRecordId);//获取班次
        getPatientList(diaDoctorShiftEdit.queryMode);//获取病患名单
        getNurseInfo();// 获取护士选项
        getDoctorInfo(); // 获取医生选项
        monitorQueryMode();   //查询模式监听
        getMachineFailure();//透析器故障列表
        avalon.scan();
    });
});

/**
 * 查询模式监听
 */
function monitorQueryMode() {
    var form = layui.form;
    form.on('select(scheduleShift)', function (obj) {
        var queryMode = "1";
        diaDoctorShiftEdit.patientScheduleShift = obj.value;
        getPatientList(queryMode);
    });

    form.on('radio(shiftType)', function (data) {
        var value = data.value;//被点击的radio的value值
        if (value === '1') {      //查询模式  明细
            diaDoctorShiftEdit.shiftShow = true;
            diaDoctorShiftEdit.queryMode = '1';
            getPatientList(diaDoctorShiftEdit.queryMode);
        } else if (value === '2') {   //查询模式  统计
            diaDoctorShiftEdit.shiftShow = false;
            diaDoctorShiftEdit.queryMode = '2';
            getPatientList(diaDoctorShiftEdit.queryMode);
        }
    });
}

/**
 * 获取护士选项
 */
function getNurseInfo() {
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysUser/getNurseRoleList.do",
        data: {},
        dataType: "json",
        done: function (data) {
            console.log("222", data)
            diaDoctorShiftEdit.nurseList = data;
        }
    });
}

/**
 * 获取医生选项
 */
function getDoctorInfo() {
    _ajax({
        type: "POST",
        loading: true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getDoctorRoleList.do",
        data: {},
        dataType: "json",
        done: function (data) {
            console.log("111", data);
            // 更新医生选项
            diaDoctorShiftEdit.doctorList = data;
            var formSelects = layui.formSelects; //调用layui的form模块
            var makerName = [];
            var newMakerName = [];
            newMakerName = diaDoctorShiftEdit.nurseList.concat(diaDoctorShiftEdit.doctorList);
            $.each(newMakerName, function (index, item) {
                var makerNameObj = {}
                makerNameObj.name = item.userName;
                makerNameObj.value = item.id;
                makerName.push(makerNameObj)
            })
            formSelects.data('replaceDoctor', 'local', {
                arr: makerName
            });

        }
    });
}


/**
 * 获取班次
 */
// function getScheduleShift(diaRecordId) {
//     var param = {
//         "diaRecordId": diaRecordId
//     };
//     _ajax({
//         type: "POST",
//         //loading:false,  //是否ajax启用等待旋转框，默认是true
//         url: $.config.services.dialysis + "/diaRecord/getInfo.do",
//         data: param,
//         dataType: "json",
//         done: function (data) {
//             if (isNotEmpty(data.scheduleShift)) {
//                 diaDoctorShiftEdit.patientScheduleShift = data.scheduleShift;
//             } else {
//                 diaDoctorShiftEdit.patientScheduleShift = "";
//             }
//
//         }
//     });
// }

/**
 * 查询列表事件
 */
function getPatientList(queryMode) {
    if (queryMode === "1") {//班次
        var param = {
            shiftType: queryMode,
            diaRecordId: diaDoctorShiftEdit.diaRecordId,
            scheduleShift: diaDoctorShiftEdit.patientScheduleShift,
            dialysisDate: diaDoctorShiftEdit.dialysisDate,
        };
    }
    if (queryMode === "2") {//肾友
        var param = {
            shiftType: queryMode,
            diaRecordId: diaDoctorShiftEdit.diaRecordId,
            patientId: diaDoctorShiftEdit.patientId,
            dialysisDate: diaDoctorShiftEdit.dialysisDate,
        };
    }
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/diaShiftPatient/getPatientList.do",
        data: param,
        dataType: "json",
        done: function (data) {
            diaDoctorShiftEdit.diaShiftPatientListList = data.diaPatientList;
            if (isNotEmpty(data.diaDoctorShiftEdit)) {
                setDoctorShift(data.diaDoctorShiftEdit);
            } else {
                $("#doctorShiftId").val("");
                $("#shiftDate").val("");
                layui.formSelects.value("replaceDoctor", []);
                $("#remarks").val("");
            }
            _layuiTable({
                elem: '#patientList_table', //必填，指定原始表格元素选择器（推荐id选择器）
                filter: 'patientList_table', ////必填，指定的lay-filter的名字
                //执行渲染table配置
                render: {
                    page: false,
                    data: data.diaPatientList,
                    cols: [[ //表头
                        {type: 'numbers', title: '序号', width: 60}  //序号
                        , {field: 'patientName', title: '姓名'}
                        , {field: 'patientRecordNo', title: '病历号'}
                        , {
                            field: 'birthday', title: '年龄'
                            , templet: function (d) {
                                var birthday = layui.util.toDateString(d.birthday, "yyyy-MM-dd");
                                return getAge(birthday)
                            }
                        }
                        , {
                            field: 'scheduleShift', title: '班次'
                            , templet: function (d) {
                                return getSysDictName("Shift", d.scheduleShift);
                            }
                        }
                        , {
                            field: 'diagnosis', title: '诊断'
                            // , templet: function (d) {
                            //     debugger
                            //     var diagnosisArr = d.diagnosis.split('、');
                            //     var newArr = [];
                            //     var str = '';
                            //     $.each(diagnosisArr,function (index,item) {
                            //         if(newArr.indexOf(item) == -1){
                            //             newArr.push(item);
                            //         }
                            //     })
                            //     str = newArr.join('、');
                            //    return str;
                            // }
                        }
                    ]]
                },
            });
        }
    });
}

/**
 *医护交班赋值
 * @param diaDoctorShiftEdit
 */
function setDoctorShift(diaDoctorShiftEdit) {
    diaDoctorShiftEdit.shiftDate = layui.util.toDateString(diaDoctorShiftEdit.shiftDate, "yyyy-MM-dd");
    var arr = diaDoctorShiftEdit.replaceDoctor.split(',');
    layui.formSelects.value('replaceDoctor', arr, true);
    layui.form.val("diaDoctorShiftEdit_form", diaDoctorShiftEdit)
}

/**
 * 班次点击事件
 */
function clickScheduleShift(obj) {
    $(obj).parent().find('.tab-style').removeClass('tab-click');
    $(obj).addClass('tab-click');
    var shiftValue = $(obj).attr('value');    //点击的班次对应的字典数据
    if (isEmpty(shiftValue)) {           //全天
        diaDoctorShiftEdit.scheduleShift = '';
    } else if (shiftValue === $.constant.Shift.AM) {   //上午
        diaDoctorShiftEdit.scheduleShift = $.constant.Shift.AM;
    } else if (shiftValue === $.constant.Shift.PM) {   //下午
        diaDoctorShiftEdit.scheduleShift = $.constant.Shift.PM;
    } else if (shiftValue === $.constant.Shift.NIGHT) {   //晚上
        diaDoctorShiftEdit.scheduleShift = $.constant.Shift.NIGHT;
    }
    searchOrder();
}

/**
 * 搜索按钮事件
 */
function searchOrder() {
    diaDoctorShiftEdit.shiftDateLog = $('#shiftDateLog').val();
    getHandoverLog();
}

/**
 * 获取年龄
 * @param dateTime
 * @returns {number}
 */
function getAge(dateTime) {
    var aDate = new Date();
    var thisYear = aDate.getFullYear();
    var bDate = new Date(dateTime);
    var brith = bDate.getFullYear();
    var age = (thisYear - brith);
    return age;
}

function getMachineFailure() {
    var param = {
        createTime_begin: diaDoctorShiftEdit.dialysisDate,
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/diaMachineFailure/list.do",
        data: param,
        dataType: "json",
        done: function (data) {
            diaDoctorShiftEdit.diaMachineFailureListList = data;
            getMachineFailureList(diaDoctorShiftEdit.diaMachineFailureListList);
        }
    });
}


/**
 * 获取机号弹窗
 */
function machineFailureAdd() {
    var url = "";
    var title = "";
    title = "新增";
    url = $.config.server + "/dialysis/diaMachineFailureEdit";
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 500,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success(data) {
                    successToast("保存成功", 500);
                    var machineFailure = diaDoctorShiftEdit.diaMachineFailureListList;
                    $.each(data.devices, function (index, item) {
                        var machine = {
                            "deviceName": item.name
                            , "deviceType": getSysDictName("deviceType", item.code)
                            , "deviceNo": item.value
                            , "occurrenceStage": ""
                            , "faultTips": ""
                            , "faultDescribe": ""
                            , "troubleshooting": ""
                        }
                        machineFailure.push(machine);
                    })
                    diaDoctorShiftEdit.diaMachineFailureListList = machineFailure;
                    var table = layui.table;
                    table.reload("diaMachineFailureList_table", {
                        // where:{numbers: dataBak.length-1},
                        data: diaDoctorShiftEdit.diaMachineFailureListList   // 将新数据重新载入表格
                    })

                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });


}


/**
 * 查询透析器故障列表
 */
function getMachineFailureList(diaMachineFailureListList) {
    var param = {};
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#diaMachineFailureList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'diaMachineFailureList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            data: diaMachineFailureListList,
            page: false,
            cols: [[ //表头
                {
                    field: 'deviceName', width: 100, title: '设备名称',
                    templet: function (d) {
                        var html = '<input type="text" name="deviceName" value="' + d.deviceName + '" autocomplete="off" class="layui-input" style="width:100%;height: 28px">'
                        return html;
                    }
                }
                , {
                    field: 'deviceType', width: 100, title: '设备类型',
                    templet: function (d) {
                        var html = '<input type="text" name="deviceType" value="' + getSysDictName("deviceType", d.deviceType) + '" autocomplete="off" class="layui-input" style="width:100%;height: 28px">'
                        return html;
                    }
                }
                , {
                    field: 'deviceNo', width: 100, title: '＊机号',
                    templet: function (d) {
                        var html = '<input type="text" name="deviceNo" value="' + d.deviceNo + '" autocomplete="off" class="layui-input" style="width:100%;height: 28px">'
                        return html;
                    }
                }
                , {
                    field: 'occurrenceStage', width: 140, title: '故障发生阶段',
                    templet: function (d) {
                        var html = '<input type="text" name="occurrenceStage" value="' + d.occurrenceStage + '" autocomplete="off" class="layui-input" style="width:100%;height: 28px">'
                        return html;
                    }

                }
                , {
                    field: 'faultTips', width: 160, title: '故障提示信息及代码',
                    templet: function (d) {
                        var html = '<input type="text" name="faultTips" value="' + d.faultTips + '" autocomplete="off" class="layui-input" style="width:100%;height: 28px">'
                        return html;
                    }
                }
                , {
                    field: 'faultDescribe', width: 100, title: '故障描述',
                    templet: function (d) {
                        var html = '<input type="text" name="faultDescribe" value="' + d.faultDescribe + '" autocomplete="off" class="layui-input" style="width:100%;height: 28px">'
                        return html;
                    }
                }
                , {
                    field: 'troubleshooting', width: 100, title: '故障是否排除',
                    templet: function (d) {
                        var html = '<input type="text" name="troubleshooting" value="' + d.troubleshooting + '" autocomplete="off" maxlength="1" class="layui-input" style="width:100%;height: 28px">'
                        return html;
                    }
                }
                , {
                    fixed: 'right', title: '操作', width: 140, align: 'center'
                    , toolbar: '#diaMachineFailureList_bar'
                }
            ]],
            done: function (res, curr, count) {
                //设备名称
                $("input[name='deviceName']").on("input", function (obj) {

                    var index = obj.delegateTarget.closest("tr").rowIndex;
                    diaDoctorShiftEdit.diaMachineFailureListList[index].deviceName = obj.delegateTarget.value;
                })
                //设备类型
                $("input[name='deviceType']").on("input", function (obj) {

                    var index = obj.delegateTarget.closest("tr").rowIndex;
                    diaDoctorShiftEdit.diaMachineFailureListList[index].deviceType = obj.delegateTarget.value;
                })
                //机号
                $("input[name='deviceNo']").on("input", function (obj) {
                    var index = obj.delegateTarget.closest("tr").rowIndex;
                    diaDoctorShiftEdit.diaMachineFailureListList[index].deviceNo = obj.delegateTarget.value;
                })
                //故障发生阶段
                $("input[name='occurrenceStage']").on("input", function (obj) {

                    var index = obj.delegateTarget.closest("tr").rowIndex;
                    diaDoctorShiftEdit.diaMachineFailureListList[index].occurrenceStage = obj.delegateTarget.value;
                })
                //故障提示信息及代码
                $("input[name='faultTips']").on("input", function (obj) {

                    var index = obj.delegateTarget.closest("tr").rowIndex;
                    diaDoctorShiftEdit.diaMachineFailureListList[index].faultTips = obj.delegateTarget.value;
                })
                //故障描述
                $("input[name='faultDescribe']").on("input", function (obj) {

                    var index = obj.delegateTarget.closest("tr").rowIndex;
                    diaDoctorShiftEdit.diaMachineFailureListList[index].faultDescribe = obj.delegateTarget.value;
                })
                //故障是否排除
                $("input[name='troubleshooting']").on("input", function (obj) {

                    var index = obj.delegateTarget.closest("tr").rowIndex;
                    diaDoctorShiftEdit.diaMachineFailureListList[index].troubleshooting = obj.delegateTarget.value;
                })

                //
                // diaDoctorShiftEdit.diaMachineFailureListList = res;
            }
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'delete') { //删除
                var trIndex = $("[lay-id='diaMachineFailureList_table']").find(tr.selector).attr("data-index");
                layer.confirm('确认删除所选记录吗？', function (index) {
                    if (isNotEmpty(obj.data.machineFailureId)) {
                        diaDoctorShiftEdit.deleteMachineFailureList.push(obj.data);
                    }
                    diaDoctorShiftEdit.diaMachineFailureListList.splice(trIndex, 1)
                    table.reload("diaMachineFailureList_table", {
                        data: diaDoctorShiftEdit.diaMachineFailureListList   // 将新数据重新载入表格
                    })

                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.machineFailureId)) {
                        var ids = [];
                        ids.push(data.machineFailureId);
                    }
                });
            }
        }
    });
}

/**
 * 统计交班信息
 * @param shiftDateLog
 */
function getHandoverLog() {

    var param = {
        scheduleShift: diaDoctorShiftEdit.scheduleShift,
        statisticsDate_begin: diaDoctorShiftEdit.shiftDateLog,
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/diaStatistics/getHandoverLogList.do",
        data: param,
        dataType: "json",
        done: function (data) {
            diaDoctorShiftEdit.dialysisDateVal = layui.util.toDateString($('#shiftDateLog').val(), "yyyy-MM-dd");//给导出日期赋值
            var dialyList = [];//透析人数
            var catheterList = [];//导管
            var punctureList = [];//穿刺
            var unusualList = [];//并发症
            var diaInstanceList = [];//透析例次
            var catheterOrpuncture = [];//导管或穿刺
            if (isNotEmpty(data.statisticsList) && data.statisticsList.length > 0) {
                $.each(data.statisticsList, function (index, item) {
                    dialyList.push(item.patientId);
                    if (isNotEmpty(item) && item.statisticsType === "CatheterAssess") {
                        catheterList.push(item);
                    } else if (isNotEmpty(item) && item.statisticsType === "PunctureAssess") {
                        punctureList.push(item);
                    } else if (isNotEmpty(item) && item.statisticsType === "Unusual") {
                        unusualList.push(item);
                    } else if (isNotEmpty(item) && item.statisticsType === "DialysisCases") {
                        diaInstanceList.push(item);
                    } else if (isNotEmpty(item) && item.statisticsType === "VascularCases") {
                        catheterOrpuncture.push(item);
                    }
                })
            }
            console.log("---", unusualList);
            console.log("---", diaInstanceList);
            diaDoctorShiftEdit.unusualRows = unusualList;
            diaDoctorShiftEdit.diaInstanceRows = diaInstanceList;

            getCatheterList(catheterList);
            getPunctureList(punctureList);
            if (isNotEmpty(diaInstanceList) && diaInstanceList.length > 0) {
                getDiaInstanceList(diaInstanceList);

            } else {
                _layuiTable({
                    elem: '#dialysisRoutineList_table', //必填，指定原始表格元素选择器（推荐id选择器）
                    filter: 'dialysisRoutineList_table', ////必填，指定的lay-filter的名字
                    //执行渲染table配置
                    render: {
                        page: false,
                        data: "",
                        cols: []
                    },
                });
            }

            if (isNotEmpty(unusualList) && unusualList.length > 0) {
                getUnusualList(unusualList);
            } else {
                _layuiTable({
                    elem: '#complicaList_table', //必填，指定原始表格元素选择器（推荐id选择器）
                    filter: 'complicaList_table', ////必填，指定的lay-filter的名字
                    //执行渲染table配置
                    render: {
                        page: false,
                        data: "",
                        cols: []
                    },
                });
            }
            getCatheterOrpuncture(catheterOrpuncture);
            if (isNotEmpty(data.shiftoverStatistics)) {
                diaDoctorShiftEdit.dialuSum = data.shiftoverStatistics.patientDialysis;//透析患者数
                diaDoctorShiftEdit.increaseSum = data.shiftoverStatistics.patientIn;//转入患者数
                diaDoctorShiftEdit.outInSum = data.shiftoverStatistics.patientOut;//转出患者数
                diaDoctorShiftEdit.rujiSum = data.shiftoverStatistics.patientRuji;//留治患者数
                diaDoctorShiftEdit.deathSum = data.shiftoverStatistics.patientDeath;//死亡患者数
            }
        }
    });
}

/**
 * 导管
 * @param catheterList
 */
function getCatheterList(catheterList) {
    var catheterType = "导管";
    var skinTotal = 0;
    var secretionTotal = 0;
    var feverTotal = 0;
    var dropTotal = 0;
    var arterySideTotal = 0;
    var veinSideTotal = 0;
    var catheterTotal = catheterList.length;
    var columnList = [];
    $.each(catheterList, function (index, item) {
        if (isNotEmpty(item) && item.statisticsSubType === "skin") {
            skinTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType === "secretion") {
            secretionTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType === "fever") {
            feverTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType === "drop") {
            dropTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType === "arterySide") {
            arterySideTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType === "veinSide") {
            veinSideTotal++;
        }
    })
    var dataArr = [];
    var dataObj = {
        catheterType: catheterType,
        skinTotal: skinTotal,
        secretionTotal: secretionTotal,
        feverTotal: feverTotal,
        dropTotal: dropTotal,
        arterySideTotal: arterySideTotal,
        veinSideTotal: veinSideTotal,
        catheterTotal: catheterTotal
    }
    dataArr.push(dataObj);
    columnList.push({field: 'catheterType', title: "通路类型", width: 100, align: 'center'});
    columnList.push({field: 'skinTotal', title: "皮肤周围", width: 100, align: 'center'});
    columnList.push({field: 'secretionTotal', title: "分泌物", width: 100, align: 'center'});
    columnList.push({field: 'feverTotal', title: "发烧", width: 100, align: 'center'});
    columnList.push({field: 'dropTotal', title: "导管脱出", width: 100, align: 'center'});
    columnList.push({field: 'arterySideTotal', title: "动脉端", width: 100, align: 'center'});
    columnList.push({field: 'veinSideTotal', title: "静脉端", width: 100, align: 'center'});
    columnList.push({
        field: 'catheterTotal', title: "总计", width: 100, align: 'center', templet: function (d) {
            return '<a style="color: dodgerblue;cursor:pointer;" onclick="openSoliPeonNum(0)">' + d.catheterTotal + '</a>';
        }
    });
    diaDoctorShiftEdit.catheterListTable = dataArr;
    diaDoctorShiftEdit.catheterColumnList = columnList;
    _layuiTable({
        elem: '#catheterList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'catheterList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            page: false,
            data: dataArr,
            cols: [columnList]
        },
    });

}

/**
 * 穿刺
 * @param punctureList
 */
function getPunctureList(punctureList) {
    var punctureType = "穿刺";
    var skinTotal = 0;
    var swellingTotal = 0;
    var oozingBloodTotal = 0;
    var tremorTotal = 0;
    var noiseTotal = 0;
    var avTotal = 0;
    var punctureTotal = punctureList.length;
    var columnList = [];
    $.each(punctureList, function (index, item) {
        if (isNotEmpty(item) && item.statisticsSubType === "skin") {
            skinTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType === "swelling") {
            swellingTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType === "oozingBlood") {
            oozingBloodTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType === "tremor") {
            tremorTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType === "noise") {
            noiseTotal++;
        } else if (isNotEmpty(item) && (item.statisticsSubType === "arteryTimes" || item.statisticsSubType === "veinTimes")) {
            avTotal++;
        }
    });
    var dataArr = [];
    var dataObj = {
        punctureType: punctureType,
        skinTotal: skinTotal,
        swellingTotal: swellingTotal,
        oozingBloodTotal: oozingBloodTotal,
        tremorTotal: tremorTotal,
        noiseTotal: noiseTotal,
        avTotal: avTotal,
        punctureTotal: punctureTotal
    }
    dataArr.push(dataObj);
    columnList.push({field: 'punctureType', title: "通路类型", width: 100, align: 'center'});
    columnList.push({field: 'skinTotal', title: "皮肤周围", width: 100, align: 'center'});
    columnList.push({field: 'swellingTotal', title: "红肿", width: 100, align: 'center'});
    columnList.push({field: 'oozingBloodTotal', title: "渗血", width: 100, align: 'center'});
    columnList.push({field: 'tremorTotal', title: "震颤", width: 100, align: 'center'});
    columnList.push({field: 'noiseTotal', title: "杂音", width: 100, align: 'center'});
    columnList.push({field: 'avTotal', title: "穿刺次数", width: 100, align: 'center'});
    columnList.push({
        field: 'punctureTotal', title: "总计", width: 100, align: 'center', templet: function (d) {
            return '<a style="color: dodgerblue;cursor:pointer;" onclick="openSoliPeonNum(0)">' + d.punctureTotal + '</a>';
        }
    });
    diaDoctorShiftEdit.punctureListTable = dataArr;
    diaDoctorShiftEdit.punctureColumnList = columnList;
    _layuiTable({
        elem: '#punctureList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'punctureList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            page: false,
            data: dataArr,
            cols: [columnList]
        },
    });

}

/**
 * 透析例次
 * @param diaInstanceList
 */
function getDiaInstanceList(diaInstanceList) {
    if (isNotEmpty(diaInstanceList) && diaInstanceList.length > 0) {
        var columnList = [];

        var sysDict = getSysDictByCode("DialysisMode",false);
        var objList = [];
        $.each(sysDict, function (index, objItem) {
            if(isNotEmpty(objItem.value)){
                var obj = {
                    key: objItem.value,
                    name: objItem.name,
                    count: 0
                }
                objList.push(obj);
            }
        });

        //根据统计子类型计算数据笔数
        $.each(diaInstanceList, function (index, item) {
            $.each(objList, function (index2, item2) {
                if (item.statisticsSubType === item2.key) {
                    item2.count++;
                }
            })
        });


        //数据封装
        var dataList = [];
        var obj = {};
        var sumCount = 0;
        $.each(objList, function (index2, item2) {
            var key = item2.key;
            var value = item2.count;
            sumCount += item2.count;
            obj[key] = value;
        });
        obj.punctureTotal = sumCount;
        dataList.push(obj);

        $.each(objList, function (index, item) {
            columnList.push({field: item.key, title: item.name,align: 'center'});
        });
        columnList.push({field: 'punctureTotal', title: '总计',minWidth: 150,align: 'center'});
        diaDoctorShiftEdit.dialysisRoutineListTable = dataList;
        diaDoctorShiftEdit.routineColumnList = columnList;
        _layuiTable({
            elem: '#dialysisRoutineList_table', //必填，指定原始表格元素选择器（推荐id选择器）
            filter: 'dialysisRoutineList_table', ////必填，指定的lay-filter的名字
            //执行渲染table配置
            render: {
                page: false,
                data: dataList,
                cols: [columnList]
            },
        });
    }
}

/**
 * 并发症
 * @param unusualList
 */
function getUnusualList(unusualList) {
    if (isNotEmpty(unusualList) && unusualList.length > 0) {

        var headerList = [];
        $.each(unusualList, function (index, item) {
            headerList.push(item.statisticsSubType);
        })

        var objList = [];
        $.each(unique(headerList), function (index, item) {

            var obj = {
                key: item,
                name: getSysDictName("UnusualType", item),
                count: 0
            }
            objList.push(obj);
        })

        $.each(unusualList, function (index, item) {
            $.each(objList, function (index2, item2) {
                if (item.statisticsSubType == item2.key) {
                    item2.count++;
                }
            })
        })
        var dictMap = getSysDictMap("UnusualType");
        var columnList = [];
        $.each(dictMap, function (index, item) {
            columnList.push({field: item.value, title: item.name, width: 150, align: 'center'
                ,templet: function (d) {
                    var key = item.value;
                    return d[key] || 0;
                }
            });
        })
        columnList.push({
            fixed: 'right',title: "总计", width: 100, align: 'center', templet: function (d) {
                return '<a style="color: dodgerblue;cursor:pointer;" onclick="openSoliPeonNum(2)">' + unusualList.length + '</a>';
            }
        });

        var dataList = [];
        var obj = {};
        for(var i = 0; i < columnList.length; i++) {
            var item2=objList[i] || '';
            if (item2 !== '') {
                var key = item2.key;
                var value = item2.count;
                obj[key] = value;
            } else {
                var key = guid();
                var value = 0;
                obj[key] = value;
            }
        }
        dataList.push(obj);
        diaDoctorShiftEdit.complicaListTable = dataList;
        diaDoctorShiftEdit.complicaColumnList = columnList;
        _layuiTable({
            elem: '#complicaList_table', //必填，指定原始表格元素选择器（推荐id选择器）
            filter: 'complicaList_table', ////必填，指定的lay-filter的名字
            //执行渲染table配置
            render: {
                page: false,
                data: dataList,
                cols: [columnList]
            },
        });
    }
}

/**
 * 数组去除重复
 */
function unique(headerList) {
    return Array.from(new Set(headerList))
}

/**
 * 导管或穿刺
 * @param catheterOrpuncture
 */
function getCatheterOrpuncture(catheterOrpuncture) {
    if (isNotEmpty(catheterOrpuncture) && catheterOrpuncture.length > 0) {
        var sumCatheter = 0;
        var sumPuncture = 0;
        $.each(catheterOrpuncture, function (index, item) {
            if (isNotEmpty(item) && item.statisticsSubType === "0") {
                sumCatheter++;
            } else if (isNotEmpty(item) && item.statisticsSubType === "1") {
                sumPuncture++;
            }
        })
        diaDoctorShiftEdit.sumCatheter = sumCatheter;
        diaDoctorShiftEdit.sumPuncture = sumPuncture;
    }
}

/**
 * 跳转
 */
function openSoliPeonNum(code) {
    var url = "";
    var title = "";
    if (code == 0) {
        diaDoctorShiftEdit.pathType = "CatheterAssess";
    }
    if (code == 1) {
        diaDoctorShiftEdit.pathType = "PunctureAssess";
    }
    if (code == 2) {
        diaDoctorShiftEdit.pathType = "Unusual";
        title = "并发症明细";
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
        url = $.config.server + "/dialysis/illnessDetails?pathType=" + diaDoctorShiftEdit.pathType
            + "&shiftDateLog=" + diaDoctorShiftEdit.shiftDateLog + "&scheduleShift=" + diaDoctorShiftEdit.scheduleShift
            + "&shiftDateLogEnd=" + diaDoctorShiftEdit.shiftDateLog;
    } else {
        title = "通路类型明细";
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
        url = $.config.server + "/dialysis/pathTypeEdit?pathType=" + diaDoctorShiftEdit.pathType
            + "&scheduleShift=" + diaDoctorShiftEdit.scheduleShift + "&shiftDateLog=" + diaDoctorShiftEdit.shiftDateLog
            + "&shiftDateLogEnd=" + diaDoctorShiftEdit.shiftDateLog;
    }

    top.layui.index.openTabsPage(url, title)//这里要注意的是parent的层级关系
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form(submitName, $callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(' + submitName + ')', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#" + submitName).trigger('click');

}

/**
 *医护交班关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function onDoctorShift($callback) {  //菜单保存操作
    //对表单验证
    verify_form('diaDoctorShiftEdit_submit', function (field) {
        //成功验证后
        var param = field; //表单的元素
        param.patientId = diaDoctorShiftEdit.patientId;
        param.diaRecordId = diaDoctorShiftEdit.diaRecordId;
        param.scheduleShift = diaDoctorShiftEdit.scheduleShift;
        param.diaShiftPatientListList = diaDoctorShiftEdit.diaShiftPatientListList;
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/diaDoctorShift/saveOrEdit.do",
            data: JSON.stringify(param),
            dataType: "json",
            done: function (data) {

                successToast("保存成功", 1000);
                setTimeout(function () {
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                }, 1000);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    })
};

/**
 * 交班日志关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function onShiftJournal($callback) {  //菜单保存操作
    //对表单验证
    verify_form('diaShiftJournal_submit', function (field) {
        //成功验证后
        var param = field; //表单的元素
        param.shiftDate = diaDoctorShiftEdit.shiftDateLog;
        param.shiftSchedule = diaDoctorShiftEdit.scheduleShift;
        param.diaMachineFailureListList = diaDoctorShiftEdit.diaMachineFailureListList;
        param.deleteMachineFailureList = diaDoctorShiftEdit.deleteMachineFailureList;
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/diaShiftJournal/saveOrEdit.do",
            data: JSON.stringify(param),
            dataType: "json",
            done: function (data) {
                successToast("保存成功", 1000);
                setTimeout(function () {
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                }, 1000);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    })
};

/**
 * 取消按钮－关闭弹窗
 */
function cancelBtn() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}

/**
 * 导出world
 */
function onExportWord() {
    $("#exportWord").wordExport("交班日志");
}

