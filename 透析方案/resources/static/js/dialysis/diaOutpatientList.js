/**
 * 门诊收费，包括列表查询、排序、增加、修改、删除基础操作
 * @author Anders
 * @date 2020-09-22
 * @version 1.0
 */
var diaOutpatientList = avalon.define({
    $id: "diaOutpatientList",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,patientList: {  // 患者列表
        data: [], // 患者列表数据
        errorMsg: ''
    }
    ,currentPatient: { // 当前选中患者信息
        patientId: '', // 患者ID
        patientPhoto: '', // 照片
        patientName: '', // 姓名
        mobilePhone: '',  //电话
        patientRecordNo: '', // 病历号
        gender: '', // 性别
        age: '', // 年龄
        infectionStatus: '', // 感染
        stature: '',       //身高
        dryWeight: '',     //干体重
        insuranceTypes: '',   //医保类型
        socialSecurityNo: '',   //社保号
        idCardType: '',      //证件类型
        idCardNo: '',       //证件号码
        contactAddressComplete: '',// 通信地址
        patientPhoto: ''     //患者头像
    }
    ,serverTime: new Date()
    ,showPreRecord: true    //显示处方记录页面
    ,showPrePaper: false    //显示处方纸页面
    ,showPreDetail: false   //显示处方明细
    ,doctors: []             //医生列表
    ,doctorId: ''           //当前登录者是医生
    ,prescriptionId: ''     //处方笺编辑的id，添加处方笺要清空
    ,readonly: {readonly: false}        //查看详情，只读属性
    ,disabled: {disabled: false}    //查看详情，禁用
    ,sysHospital: {}         //中心管理
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        getSysHospital();
        getDoctorList();
        getPatientList();
        monitorCheckbox();   //个人出库修改
        avalon.scan();
    });
});

/**
 * 获取中心管理
 */
function getSysHospital() {
    var util = layui.util;
    _ajax({
        type: "POST",
        loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysHospital/hospitalList.do",
        dataType: "json",
        done:function(data){
            diaOutpatientList.sysHospital = data;
        }
    });
}

/**
 * 选中患者信息时，更新患者概览信息
 * @param obj
 */
function onSelectedPatientInfo(obj) {
    var dropdownItemObj = $(obj);

    // 设置患者列表项选中样式
    $(".patient-dropdown-item").removeClass("selected");
    dropdownItemObj.addClass("selected");

    // 更新当前患者概览信息
    diaOutpatientList.currentPatient.patientId = dropdownItemObj.attr("data-patient-id");
    diaOutpatientList.currentPatient.patientName = dropdownItemObj.attr("data-patient-name");
    diaOutpatientList.currentPatient.patientRecordNo = dropdownItemObj.attr("data-patient-record-no");
    diaOutpatientList.currentPatient.mobilePhone = dropdownItemObj.attr("data-mobile-phone");
    diaOutpatientList.currentPatient.gender = getSysDictName($.dictType.sex, dropdownItemObj.attr("data-gender"));
    diaOutpatientList.currentPatient.age = dropdownItemObj.attr("data-age");
    diaOutpatientList.currentPatient.stature = dropdownItemObj.attr('data-stature');
    diaOutpatientList.currentPatient.dryWeight = dropdownItemObj.attr('data-dry-weight');
    diaOutpatientList.currentPatient.insuranceTypes = dropdownItemObj.attr('data-insurance-types');
    diaOutpatientList.currentPatient.socialSecurityNo = dropdownItemObj.attr('data-social-security-no');
    diaOutpatientList.currentPatient.idCardType = dropdownItemObj.attr('data-id-card-type');
    diaOutpatientList.currentPatient.idCardNo = dropdownItemObj.attr('data-id-card-no');
    diaOutpatientList.currentPatient.contactAddressComplete = dropdownItemObj.attr('data-contact-address-complete');
    diaOutpatientList.currentPatient.patientPhoto = dropdownItemObj.attr('data-patient-photo');

    // layui.form.render();

    diaOutpatientList.showPreRecord = true;
    diaOutpatientList.showPrePaper = false;
    diaOutpatientList.showPreDetail = false;
    getList();
}

/**
 * 查询患者列表事件
 * @param field
 */
function getPatientList() {
    var patientName = $('#patName').val();
    var param = {
        patientName: patientName
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaOutpatient/patientList.do",
        data: param,
        dataType: "json",
        success: function(res) {
            diaOutpatientList.serverTime = new Date(res.ts);
        },
        done: function(data) {
            if (data != null && data.length > 0) {
                $.each(data, function(index, item) {
                    var age = getUserAge(diaOutpatientList.serverTime, item.birthday);
                    item.age = (age <= 0 ? "-" : age);
                    if ($.constant.gender.MALE === item.gender) {
                        item.sexPic = '/static/svg/male.svg';
                    } else if($.constant.gender.FEMALE === item.gender){
                        item.sexPic = '/static/svg/female.svg';
                    }
                    item.gerder = getSysDictName($.dictType.sex, item.gender);
                    if (isNotEmpty(data[index].infectionStatus)) {
                        item.infectionStatus = "感染";
                    } else {
                        item.infectionStatus = "";
                    }
                    if (isEmpty(item.dryWeight)) {
                        item.dryWeight = '';
                    }
                    if (isEmpty(item.stature)) {
                        item.stature = '';
                    }
                });
                diaOutpatientList.patientList.data = data;
                diaOutpatientList.patientList.errorMsg = "";

                // 设置默认选中患者（若没有则默认选中第一笔）
                var selectedPatientId = diaOutpatientList.currentPatient.patientId;
                if (isEmpty(selectedPatientId) && diaOutpatientList.patientList.data.length > 0) {
                    selectedPatientId = diaOutpatientList.patientList.data[0].patientId;
                }
                $(".patient-dropdown-item[data-patient-id='" + selectedPatientId + "']").trigger("click");

            } else {
                diaOutpatientList.patientList.data = [];
                diaOutpatientList.patientList.errorMsg = "查无数据";
            }
        },
        error: function (error) {
            var res = error.responseJSON || {};
            var status = error.status;

            diaOutpatientList.patientList.data = [];
            diaOutpatientList.patientList.errorMsg = getRequestErrorMsg(res, status);
        }
    });
}

/**
 * 医生列表
 */
function getDoctorList() {
    _ajax({
        type: "POST",
        loading: false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getDoctorRoleList.do",
        dataType: "json",
        async: false,
        done: function (data) {
            diaOutpatientList.doctors=data;
            data.forEach(function (item, i) {
                if (item.id == baseFuncInfo.userInfoData.userid) {
                    diaOutpatientList.doctorId = item.id;
                }
            })
            var form = layui.form;
            form.render('select');
        }
    });
}

/**
 * 查询列表事件
 */
function getList() {
    var param = {
        patientId: diaOutpatientList.currentPatient.patientId
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#diaOutpatientList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'diaOutpatientList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-140', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/diaOutpatient/listAll.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page:false,
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'opcNumber', title: '门诊号',align:'center', width:130}
                ,{field: 'patientName', title: '姓名',align:'center'}
                ,{field: 'receivableStatus', title: '应收单上传',align:'center'
                    ,templet:function(d) {
                        return getSysDictName('ReceivableStatus', d.receivableStatus);
                    }
                }
                ,{field: 'diagnosis', title: '诊断',width:200}
                ,{field: 'infection', title: '传染病史',align:'center'}
                ,{field: 'establishDate', title: '开方日期',align:'center'
                    ,templet: function(d){
                        return util.toDateString(d.establishDate,"yyyy/MM/dd");
                    }}
                ,{field: 'establishUserName', title: '开方医生',align:'center'}
                ,{fixed: 'right',title: '操作',width: 170, align:'center'
                    ,toolbar: '#diaOutpatientList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.prescriptionId)){
                    diaOutpatientList.readonly = {readonly: false};
                    diaOutpatientList.disabled = {disabled: false};
                    diaOutpatientList.prescriptionId = data.prescriptionId;
                    editPrescription(data.prescriptionId);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.prescriptionId)){
                        var ids=[];
                        ids.push(data.prescriptionId);
                        del(ids);
                    }
                });
            } else if (layEvent === 'detail') {   //查看详情
                if (isNotEmpty(data.prescriptionId)) {
                    diaOutpatientList.prescriptionId = data.prescriptionId;
                    diaOutpatientList.readonly = {readonly: true};
                    diaOutpatientList.disabled = {disabled: true};
                    editPrescription(data.prescriptionId);
                }
            }
        }
    });
}

/**
 * 获取单个实体
 */
function editPrescription(id){
    diaOutpatientList.showPreRecord = false;
    diaOutpatientList.showPrePaper = true;
    diaOutpatientList.showPreDetail = false;
    $('input[name="gender"][value="' + diaOutpatientList.currentPatient.gender + '"]').prop('checked', true);
    var laydate=layui.laydate;
    laydate.render({
        elem: '#establishDate'
        ,type: 'date'
        ,value: new Date()
    });

    getPrescriptionInfo(id);
    getDetailsList();

}

/**
 * 生成一笔处方笺记录
 */
function addPrescription() {
    layer.confirm('确定生成一笔处方笺记录吗？', function (index) {
        layer.close(index);
        diaOutpatientList.readonly = {readonly: false};
        diaOutpatientList.disabled = {disabled: false};
        var param = {
            patientId: diaOutpatientList.currentPatient.patientId,
            isNumber: diaOutpatientList.sysHospital.isNumber
        }
        _ajax({
            type: "POST",
            url: $.config.services.dialysis+"/diaOutpatient/add.do",
            data:param,  //必须字符串后台才能接收list,
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            dataType: "json",
            done: function(data){
                diaOutpatientList.prescriptionId = data;   //返回处方笺id
                editPrescription(data);
            }
        });
    });
}

/**
 * 获取处方笺实体
 */
function getPrescriptionInfo(prescriptionId) {
    var param = {
        prescriptionId: prescriptionId
    }
    _ajax({
        type: "POST",
        url: $.config.services.dialysis+"/diaOutpatient/getInfo.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            var form=layui.form; //调用layui的form模块
            //初始化表单元素,日期时间选择器
            var util=layui.util;
            data.establishDate=util.toDateString(data.establishDate,"yyyy-MM-dd");
            form.val('disPrescriptionEdit_form', data);
            if (isEmpty(data.establishUserId)) {   //判断开方医生是否为空
                $('#establishUserId').val(diaOutpatientList.doctorId);
            }
            form.render();
        }
    });
}

/**
 * 获取医嘱列表
 */
function getDetailsList() {
    var param = {
        prescriptionId: diaOutpatientList.prescriptionId
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#diaOutpatientDetails_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'diaOutpatientDetails_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height:'full-310', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/diaOutpatientDetails/listAll.do", // ajax的url必须加上getRootPath()方法
            page: false,
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}  //开启编辑框
                ,{field: 'selfDrugs', title:'个人<br>出库',width:60,align:'center',templet:'#selfDrugsTemplet'}
                ,{field: 'orderContent', title: '医嘱名称#规格', align: 'left', width: 410,toolbar: '#orderContentTemplet'}
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
                ,{field: 'channel', title: '途径', align: 'center',width:100
                    , templet: function (d) {
                        if (isEmpty(d.channel)) {
                            return '--';
                        }
                        return getSysDictName('Route', d.channel);
                    }
                }
                ,{field: 'totalDosage', title: '总量<br>总量(取整)', align: 'center',minWidth:100,templet:function (d) {
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
                ,{field: 'executeOrderDoctorName', title: '开嘱医生', align: 'center',minWidth:100}
                ,{fixed: 'right', title: '操作', width: 210, align: 'center', toolbar: '#diaOutpatientDetailsList_bar',hide: diaOutpatientList.readonly.readonly}
            ]]
            , done: function (res) {
                // 所有子医嘱添加特殊背景色
                var tableTarget = $("[lay-id='diaOutpatientDetails_table']");
                var subOrderTrs = tableTarget.find(".order-content.sub-order[data-parent-order-id]").closest("tr[data-index]");
                $.each(subOrderTrs, function (index, item) {
                    var dataIndex = $(item).attr("data-index");
                    tableTarget.find(".layui-table-body table tr[data-index='" + dataIndex + "']").addClass("sub-order-tr");
                });

                if (res.bizData) {
                    $.each(res.bizData, function (i, item) {
                        if (isNotEmpty(item.parentOrderId)) {         //禁用子医嘱的复选框选择事件
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
            if (layEvent === 'editOrder') {
                if (isNotEmpty(data.detailsId)) {
                    saveOrEditOrder(data.detailsId, false);
                }
            } else if (layEvent === 'addSubOrder') {
                if (isNotEmpty(data.detailsId)) {      //子医嘱添加
                    saveOrEditOrder(data.detailsId, true, data.frequency, data.usageDays,data.channel);
                }
            } else if (layEvent === 'deleteOrder') {
                if (isNotEmpty(data.detailsId)) {
                    layer.confirm('确定删除此医嘱吗？', function (index) {
                        layer.close(index);
                        deleteOrder(data.detailsId,data.orderType);
                    })
                }
            } else if (layEvent === 'applyForm') {
                if (isNotEmpty(data.detailsId) && isNotEmpty(diaOutpatientList.prescriptionId)) {
                    apply();
                }
            }

            if (layEvent === 'toggle-fold-suborder') {
                var orderId = data.orderId;
                var tableTarget = $("[lay-id='diaOutpatientDetails_table']");
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
        prescriptionId: diaOutpatientList.prescriptionId
    }
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/tesApply/savePrescriptionApply.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            if(isNotEmpty(data)){
                baseFuncInfo.openPatientLayoutPage({
                    pageHref: "/examine/tesApplyList",
                    patientId: diaOutpatientList.currentPatient.patientId,
                })
            }
        }
    });
}

/**
 * 处方明细列表
 */
function getItemList() {
    var param = {
        prescriptionId: diaOutpatientList.prescriptionId
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#diaOutpatientItemList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'diaOutpatientItemList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-150', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + '/diaOutpatientItem/list.do', // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'materielName', title: '名称',width:250}
                ,{field: 'batchNo', title: '批号',align:'center'}
                ,{field: 'specifications', title: '规格'}
                ,{field: 'type', title: '类型',align:'center',
                    templet: function (d) {
                        return getSysDictName('materielType', d.type);
                    }
                }
                ,{field: 'manufactor', title: '生产厂家'}
                ,{field: 'materielNo', title: '编码',align:'center'}
                ,{field: 'useNumber', title: '数量',align:'center'}
                ,{field: 'basicUnit', title: '单位',align:'center'
                    ,templet: function (d) {
                        return getSysDictName('purSalesBaseUnit', d.basicUnit);
                    }
                }
                ,{field: 'userName', title: '添加者',align:'center'}
                ,{fixed: 'right',title: '操作',width: 140, align:'center',toolbar: '#diaOutpatientItemList_bar',hide: diaOutpatientList.readonly.readonly}
            ]],
            done: function (res) {

            }
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'editItem'){ //编辑
                //do something
                if(isNotEmpty(data.prescriptionItemId)){
                    var manufactor = isNotEmpty(data.manufactor) ? data.manufactor : '';
                    saveOrEditItem(data.prescriptionItemId,data.materielName,manufactor);
                }
            }else if(layEvent === 'deleteItem'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.prescriptionItemId)){
                        deleteItem(data.prescriptionItemId,data.materielNo, data.useNumber, data.batchNo, data.stockInfoId, data.type);
                    }
                });
            }
        }
    });
}

/**
 * 添加、编辑处方明细
 */
function saveOrEditItem(id,materielName,manufactor){
    var url="";
    var title="";
    var width;
    var height;
    if(isEmpty(id)){  //id为空,新增操作
        title="添加处方明细";
        width = 1200;
        height = 700;
        url=$.config.server+"/dialysis/addPrescriptionList?prescriptionId=" + diaOutpatientList.prescriptionId;
    }else{  //编辑
        title="编辑";
        width = 450;
        height = 400;
        url=$.config.server+"/dialysis/diaOutpatientItemEdit?id="+id  + '&prescriptionId=' + diaOutpatientList.prescriptionId;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:width, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:height,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin,layer){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('diaOutpatientItemList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}


/**
 * 删除处方明细
 * @param ids
 */
function deleteItem(id, materielNo, useNumber, batchNo, stockInfoId, type){
    var param={
        prescriptionItemId:id,
        materielNo: materielNo,
        useNumber: useNumber,
        batchNo: batchNo,
        stockInfoId: stockInfoId,
        type: type,
        prescriptionId: diaOutpatientList.prescriptionId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaOutpatientItem/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('diaOutpatientItemList_table'); //重新刷新table
        }
    });
}


/**
 * 删除医嘱
 */
function deleteOrder(id,orderType) {
    var param = {
        id: id,
        prescriptionId: diaOutpatientList.prescriptionId,
        orderType:orderType //判断检验还是其他类型
    }

    _ajax({
        type: "POST",
        url: $.config.services.dialysis+"/diaOutpatientDetails/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('diaOutpatientDetails_table'); //重新刷新table
        }
    });
}

/**
 * 个人出库复选框监听
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
            detailsId:  $(this).attr('data-id'),
            selfDrugs: selfDrugs,
            prescriptionId: diaOutpatientList.prescriptionId
        }
        layer.confirm('确定修改个人出库？', function(index) {
            layer.close(index);
            _ajax({
                type: "POST",
                url: $.config.services.dialysis + "/diaOutpatientDetails/updateSelfDrugs.do",
                data: param,  //必须字符串后台才能接收list,
                //loading:false,  //是否ajax启用等待旋转框，默认是true
                dataType: "json",
                done: function (data) {
                    successToast("修改成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('diaOutpatientDetails_table'); //重新刷新table
                }
            });
        },function (index) {  //取消按钮关闭弹窗

        });
    });
}

/**
 * 保存医嘱
 */
function saveOrEditOrder(id, addSub, frequency, usageDays,channel){
    var url="";
    var title="";
    if(addSub){
        title="新增子医嘱";                      //新增执行医嘱，category=3
        url=$.config.server + "/dialysis/diaOutpatientDetailsEdit?prescriptionId=" + diaOutpatientList.prescriptionId + "&parentDetailsId=" + id +
            "&frequency=" + frequency + "&usageDays=" + usageDays + "&channel=" + channel;
    }else{
        if (isEmpty(id)) {  //id为空,新增操作
            title = "新增";
            url = $.config.server + "/dialysis/diaOutpatientDetailsEdit?prescriptionId=" + diaOutpatientList.prescriptionId;
        } else {  //编辑
            title = "编辑";
            url = $.config.server + "/dialysis/diaOutpatientDetailsEdit?id=" + id + "&prescriptionId=" + diaOutpatientList.prescriptionId;
        }
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
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
                    table.reload('diaOutpatientDetails_table'); //重新刷新table
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
function del(ids){
    var param={
        "ids":ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis+"/diaOutpatient/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('diaOutpatientList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('diaOutpatientList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.prescriptionId);
            });
            del(ids);
        });
    }
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(disPrescriptionEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#disPrescriptionEdit_submit").trigger('click');
}

/**
 * 处方笺确认提交
 */
function confirmPaper() {
    if (!diaOutpatientList.readonly.readonly) {   //不是只读详情，可以发送请求
        verify_form(function(field) {
            //成功验证后
            var param = field; //表单的元素
            param.prescriptionId = diaOutpatientList.prescriptionId;
            _ajax({
                type: "POST",
                url: $.config.services.dialysis+"/diaOutpatient/edit.do",
                data:param,  //必须字符串后台才能接收list,
                //loading:false,  //是否ajax启用等待旋转框，默认是true
                dataType: "json",
                done: function(data){
                    diaOutpatientList.prescriptionId = '';   //处方笺id
                    diaOutpatientList.showPreRecord = true;    //显示处方记录页面
                    diaOutpatientList.showPrePaper = false;    //隐藏处方纸页面
                    diaOutpatientList.showPreDetail = false;   //隐藏处方明细
                    getList();
                }
            });
        });
    } else {    //只读属性，不发送保存请求
        diaOutpatientList.prescriptionId = '';   //处方笺id
        diaOutpatientList.showPreRecord = true;    //显示处方记录页面
        diaOutpatientList.showPrePaper = false;    //隐藏处方纸页面
        diaOutpatientList.showPreDetail = false;   //隐藏处方明细
        getList();
    }
}

/**
 * 从组套导入
 */
function importOrder() {
    _layerOpen({
        url: $.config.server + "/patient/importOrder?prescriptionId=" + diaOutpatientList.prescriptionId,  //弹框自定义的url，会默认采取type=2
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
                    table.reload('diaOutpatientDetails_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 导出到组套
 */
function exportOrder() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('diaOutpatientDetails_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if (data.length === 0) {
        warningToast('至少选择一条记录');
        return false;
    }

    var orderList = [];    //存放父医嘱和子医嘱
    var list = layui.table.cache['diaOutpatientDetails_table'];

    $.each(data, function (index, item) {
        if (isEmpty(item.parentDetailsId)) {   //将父医嘱添加到list
            orderList.push(item);
        }
        list.forEach(function (node, i) {
            if (node.parentDetailsId === item.detailsId) {    //将子医嘱添加到list
                orderList.push(node);
            }
        })
    })

    var uuid = guid();
    sessionStorage.setItem(uuid, JSON.stringify(orderList));    //选中的医嘱数据存进缓存，key: uuid,   value: 医嘱数据
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
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

/**
 * 处方明细按钮
 */
function clickPreDetail() {
    diaOutpatientList.showPreRecord = false;    //隐藏处方记录页面
    diaOutpatientList.showPrePaper = false;    //隐藏处方笺页面
    diaOutpatientList.showPreDetail = true;   //显示处方明细
    getItemList();
}

/**
 * 处方笺按钮
 */
function clickPrePaper() {
    editPrescription(diaOutpatientList.prescriptionId);
}

/**
 * 打印医嘱
 */
function printOrder() {
    _layerOpen({
        url: $.config.server + "/dialysis/diaExecuteOrderPrint?patientId=" + diaOutpatientList.currentPatient.patientId +
            '&prescriptionId=' + diaOutpatientList.prescriptionId + '&diagnosis=' + $('#diagnosis').val() + '&prescriptionNumber=' + $('#opcNumber').val(),
        width: 710, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 842,  // 弹框自定义的高度，方法会自动判断是否超过高度
        title: "打印医嘱", // 弹框标题
        btn: ["打印", "取消"],
        done: function (index, iframeWin) {
            var ids = iframeWin.onPrint();
        }
    });
}

/**
 * 应收单上传 点击事件
 */
function uploadReceivables() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('diaOutpatientList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast('至少选择一条记录');
        return false;
    }

    //上传操作
    var uploadFun = function () {
        var prescriptionIds = [];
        for(var i = 0; i < data.length; i++) {
            var item = data[i];
            if ($.constant.ReceivableStatus.ARCHIVED === item.receivableStatus) {   //已归档
                warningToast("不能上传已归档的处方单！");
                return ;
            }
            if ($.constant.ReceivableStatus.CHARGE === item.receivableStatus) {   //已收费
                warningToast("不能上传已收费的处方单！");
                return ;
            }
            prescriptionIds.push(item.prescriptionId);
        }
        _ajax({
            type: "POST",
            url: $.config.services.dialysis+"/diaOutpatient/uploadReceivables.do",
            data:{prescriptionIds: prescriptionIds},  //必须字符串后台才能接收list,
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            dataType: "json",
            done: function(data){
                successToast(data);
                var table = layui.table; //获取layui的table模块
                table.reload('diaOutpatientList_table'); //重新刷新table
            }
        });
    }

    // 应收单上传前需用户确认是否上传
    layer.confirm('确定上传应收单吗？', function (index) {
        layer.close(index);
        uploadFun();
    });
}

/**
 * 患者照片加载错误时，设置默认图片
 * @param target
 */
function onPatientPhotoError(target) {
    var gender = $(target).attr("data-gender");
    baseFuncInfo.onPatientPhotoError(target, gender);
}