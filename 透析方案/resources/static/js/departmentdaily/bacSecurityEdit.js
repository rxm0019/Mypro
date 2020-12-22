/**
 * bacSecurityEdit.jsp的js文件，包括查询，编辑操作
 * @author Rain
 * @date 2020/09/01
 * @description 职业安全防护
 * @version 1.0
 */
var bacSecurityEdit = avalon.define({
    $id: "bacSecurityEdit",
    baseFuncInfo: baseFuncInfo//底层基本方法
    , readonly: {readonly: false} // 文本框设置只读
    , employeeJob: [ //职业下拉选
        {name: "医师", value: "1"},
        {name: "护理人员", value: "2"},
        {name: "保洁人员", value: "3"},
        {name: "后勤人员", value: "4"},
        {name: "其他", value: "5"}
    ]
    , exposureType: [ //暴露类型下拉选
        {name: "皮肤黏膜完整", value: "1"},
        {name: "原有皮肤黏膜损伤", value: "2"},
        {name: "皮肤黏膜受轻度损伤", value: "3"},
        {name: "皮肤黏膜受深度损伤", value: "4"}
    ]
    , exposureQuantity: [ //暴露量下拉选
        {name: "小（暴露源体液、血液 ≤ 5ml）", value: "1"},
        {name: "大（暴露源体液、血液 ≥ 5ml）", value: "2"}
    ]
    , occurState: [ //发生状况
        {name: "肌注", value: "1"},
        {name: "静注", value: "2"},
        {name: "穿刺", value: "3"},
        {name: "拔针", value: "4"},
        {name: "洗消", value: "5"},
        {name: "采集处理样本", value: "6"},
        {name: "收集锐器", value: "7"},
        {name: "其他", value: "8"}
    ]
    , equipment: [ //暴露器材 and 暴露部位
        {name: "穿刺器", value: "1"},
        {name: "注射针头", value: "2"},
        {name: "其他", value: "3"}
    ]
    , duration: [ //暴露持续时间
        {name: "≤ 10分钟", value: "1"},
        {name: "10 - 30分钟", value: "2"},
        {name: "≥ 30分钟", value: "3"}
    ]
    , prophylactic: [ //预防用药类型及计量
        {name: "立即肌注乙肝疫苗", value: "1"},
        {name: "立即肌注乙肝免疫球蛋白", value: "2"},
        {name: "口服双态芝", value: "3"},
        {name: "口服茚地那伟", value: "4"},
        {name: "立即静注人免疫白球", value: "5"},
        {name: "其他", value: "6"}
    ]
    , finalResult: [ //结论
        {name: "感染病毒", value: "1"},
        {name: "未感染病毒", value: "2"}
    ]
    , bacSecurityData: {} //打印时的数据
    , peopleRecordsList: [] // 人员下拉选
    , patientList: [] //患者列表下拉选
    , detectionResult: [ //检测结果
        {name: "阴性"},
        {name: "阳性"}
    ]



});

layui.use(['index', 'formSelects'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //获取人员下拉选
        getPeopleRecords();
        getPeopleRecordsList();
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        //获取患者列表下拉选
        getPatientList();
        getPatient();
        getCenterUser();
        var formSelects = layui.formSelects;
        var id=GetQueryString("id");  //接收变量
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        if (layEvent === 'detail') {
            bacSecurityEdit.readonly = {readonly: true};
            $('select').prop('disabled', true);
            $('input[type="radio"]').prop('disabled', true);
            formSelects.disabled("employeeName");
        } else {
            var laydate = layui.laydate;
            laydate.render({
                elem: '#occurDate'
                , type: 'date'
                , value: new Date()
            });
            laydate.render({
                elem: '#reportDate'
                , type: 'date'
                , value: new Date()
            });
        }
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
            //职业下拉选
            var length = bacSecurityEdit.employeeJob.length;
            onSelect("employeeJob", "otherJob", length);
            //发生状况
            length = bacSecurityEdit.occurState.length;
            onSelect("occurState", "otherState", length);
            //暴露器材
            length = bacSecurityEdit.equipment.length;
            onSelect("equipment", "otherEquipment", length);
            //暴露部位
            onSelect("parts", "otherParts", length);
            //预防用药类型及计量
            length = bacSecurityEdit.prophylactic.length;
            onSelect("prophylactic", "otherProphylactic", length);
            var param = {peopleRecordsId: data.employeeName,}
            getPeopleRecords(JSON.stringify(param));
            getPatientList(data.sickName);
            getCenterUser(JSON.stringify({peopleRecordsId:data.centerUser}));
        });
        avalon.scan();
    });
});


/**
 * 监听文本框
 */
function onSelect(type, value, length) {
    findHidden(type, value, length);
    layui.use(['index'], function () {
        var form = layui.form;
        form.on('select(' + type + ')', function (data) {
            findHidden(type, value, length);
        });
    });
}

/**
 * 控制文本框显示
 *
 */
function findHidden(type, value, length) {
    if (type !== undefined) {
        var message = $("select[name=" + type + "]").val();
        if (message == length) {
            document.getElementById(value).style.display = "block";
        } else {
            document.getElementById(value).style.display = "none";
            setValue(value + "s");
        }
    }
}

/**
 * 清除文本框的值
 * @param Id
 */
function setValue(id) {
    var obj = document.getElementById(id);
    obj.value = "";
}


/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getInfo(id,$callback){
    if(isEmpty(id)){
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    }else{
        //编辑
        var param={
            "securityId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/bacSecurity/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.occurDate=util.toDateString(data.occurDate,"yyyy-MM-dd");
                data.reportDate=util.toDateString(data.reportDate,"yyyy-MM-dd");
                //对打印数据进行处理
                bacSecurityEdit.bacSecurityData = data;
                //对姓名进行处理
                for (var i in bacSecurityEdit.peopleRecordsList) {
                    if (bacSecurityEdit.peopleRecordsList[i].peopleRecordsId == data.employeeName) {
                        bacSecurityEdit.bacSecurityData.employeeName = bacSecurityEdit.peopleRecordsList[i].name;
                        break;
                    }
                }
                //对患者姓名进行处理
                for (var i in bacSecurityEdit.patientList) {
                    if (bacSecurityEdit.patientList[i].patientRecordNo == data.sickName) {
                        bacSecurityEdit.bacSecurityData.sickName = bacSecurityEdit.patientList[i].patientName;
                        break;
                    }
                }
                //对中心负责人进行处理
                for (var i in bacSecurityEdit.peopleRecordsList) {
                    if (bacSecurityEdit.peopleRecordsList[i].peopleRecordsId == data.centerUser) {
                        bacSecurityEdit.bacSecurityData.centerUser = bacSecurityEdit.peopleRecordsList[i].name;
                        break;
                    }
                }


                //对职业进行处理
                if (data.otherJob !== "" && data.otherJob !== null) {//其他职业类型有值时
                    bacSecurityEdit.bacSecurityData.employeeJob = data.otherJob
                } else {
                    for (var key in bacSecurityEdit.employeeJob) {
                        if (bacSecurityEdit.employeeJob[key].value === data.employeeJob) {
                            bacSecurityEdit.bacSecurityData.employeeJob = bacSecurityEdit.employeeJob[key].name
                        }
                    }
                }

                //对性别进行处理
                bacSecurityEdit.bacSecurityData.employeeSex = getSysDictName("Sex", data.employeeSex);
                //对带乳胶手套进行处理
                bacSecurityEdit.bacSecurityData.glove = data.glove == "Y" ? "①" : "②";
                //对岗前培训进行处理
                bacSecurityEdit.bacSecurityData.preTrain = data.preTrain == "Y" ? "①" : "②";
                //对暴露者性别进行处理
                bacSecurityEdit.bacSecurityData.sickSex = getSysDictName("Sex", data.sickSex);
                //对暴露后紧急处理措施1、2、3进行处理
                bacSecurityEdit.bacSecurityData.measuresOne = data.measuresOne == "Y" ? "①" : "②";
                bacSecurityEdit.bacSecurityData.measuresTwo = data.measuresTwo == "Y" ? "①" : "②";
                bacSecurityEdit.bacSecurityData.measuresThree = data.measuresThree == "Y" ? "①" : "②";
                //对暴露后4周内是否出现急性传染病感染症状进行处理
                bacSecurityEdit.bacSecurityData.symptom = data.symptom == "Y" ? "①" : "②";
                //对 ①②值进行处理
                var numberStr = ["", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];
                if (isNotEmpty(bacSecurityEdit.bacSecurityData.occurState)) {
                    bacSecurityEdit.bacSecurityData.occurState = numberStr[bacSecurityEdit.bacSecurityData.occurState];
                }
                if (isNotEmpty(bacSecurityEdit.bacSecurityData.equipment)) {
                    bacSecurityEdit.bacSecurityData.equipment = numberStr[bacSecurityEdit.bacSecurityData.equipment];
                }
                if (isNotEmpty(bacSecurityEdit.bacSecurityData.parts)) {
                    bacSecurityEdit.bacSecurityData.parts = numberStr[bacSecurityEdit.bacSecurityData.parts];
                }
                if (isNotEmpty(bacSecurityEdit.bacSecurityData.exposureType)) {
                    bacSecurityEdit.bacSecurityData.exposureType = numberStr[bacSecurityEdit.bacSecurityData.exposureType];
                }
                if (isNotEmpty(bacSecurityEdit.bacSecurityData.exposureQuantity)) {
                    bacSecurityEdit.bacSecurityData.exposureQuantity = numberStr[bacSecurityEdit.bacSecurityData.exposureQuantity];
                }
                if (isNotEmpty(bacSecurityEdit.bacSecurityData.duration)) {
                    bacSecurityEdit.bacSecurityData.duration = numberStr[bacSecurityEdit.bacSecurityData.duration];
                }
                if (isNotEmpty(bacSecurityEdit.bacSecurityData.prophylactic)) {
                    bacSecurityEdit.bacSecurityData.prophylactic = numberStr[bacSecurityEdit.bacSecurityData.prophylactic];
                }
                if (isNotEmpty(bacSecurityEdit.bacSecurityData.finalResult)) {
                    bacSecurityEdit.bacSecurityData.finalResult = numberStr[bacSecurityEdit.bacSecurityData.finalResult];
                }
                if (bacSecurityEdit.bacSecurityData.sickAge == null) {
                    bacSecurityEdit.bacSecurityData.sickAge = "";
                }
                if (bacSecurityEdit.bacSecurityData.employeeAge == null) {
                    bacSecurityEdit.bacSecurityData.employeeAge = "";
                }
                if (bacSecurityEdit.bacSecurityData.workingYears == null) {
                    bacSecurityEdit.bacSecurityData.workingYears = "";
                }
                form.val('bacSecurityEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
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
    form.on('submit(bacSecurityEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段

        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacSecurityEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        var id = GetQueryString("id");
        //成功验证后
        var param=field; //表单的元素
        //可以继续添加需要上传的参数

        if (isEmpty(id)) {
            _ajax({
                type: "POST",
                //loading:true,  //是否ajax启用等待旋转框，默认是true
                url: $.config.services.logistics + "/bacSecurity/save.do",
                data: param,
                dataType: "json",
                done: function (data) {
                    typeof $callback === 'function' && $callback(data); //返回一个回调事件
                }
            });
        } else {
            _ajax({
                type: "POST",
                //loading:true,  //是否ajax启用等待旋转框，默认是true
                url: $.config.services.logistics + "/bacSecurity/edit.do",
                data: param,
                dataType: "json",
                done: function (data) {
                    typeof $callback === 'function' && $callback(data); //返回一个回调事件
                }
            });
        }
    });
}


/**
 * 点击打印事件
 */
function onPrint() {
    document.getElementById("editForm").style.display = "none";
    document.getElementById("print").style.display = "block";
    document.getElementById("print").style.zoom = 0.80;
    window.print();
    document.getElementById("editForm").style.display = "block";
    document.getElementById("print").style.display = "none";
}

//患者下拉绑定
function getPeopleRecords(value) {
    if (value == null || value == "" || typeof value == "undefined") {
        value = "";
    }

    var formSelects = layui.formSelects;
    formSelects.btns('employeeName', ['remove']);
    formSelects.config('employeeName', {
        type: 'post',
        searchUrl: $.config.services.logistics + "/bacSecurity/getPeopleRecords.do",
        searchVal: value,
        keySel: value == "" ? "" : "name",
        searchName: 'employeeName',
        keyName: 'name',
        keyVal: 'peopleRecordsId',
        delay: 1000,
        direction: 'auto',
        response: {
            statusCode: 0,          //成功状态码
            statusName: 'rtnCode',     //code key
            msgName: 'msg',         //msg key
            dataName: 'bizData'        //data key
        },
        //id:组件ID xm-select;  url:URL; searchVal:搜索的value; result:返回的结果
        beforeSuccess: function (id, url, searchVal, result) {        //success之前的回调, 干嘛呢? 处理数据的, 如果后台不想修改数据, 你也不想修改源码, 那就用这种方式处理下数据结构吧
            if (result.bizData == '' || result.bizData == null || typeof result.bizData == "undefined") {
                result.bizData = [];
            }
            return result;  //必须return一个结果, 这个结果要符合对应的数据结构
        },
        beforeSearch: function (id, url, val) {
            if (isEmpty(val) || val == "{}") {//内容为空, 不进行远程搜索
                return false;
            }
            return true;
        },
        success: function (id, url, searchVal, result) {      //使用远程方式的success回调
            if (value != null && value != "" && typeof value != "undefined") {
                // formSelects.value("employeeName", [value], true);
            }
        }
    });
}

/**
 * 查询患者列表事件
 * @param field
 */
function getPatient() {
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patPatientInfo/options.do",
        //  data: param,
        dataType: "json",
        done: function (data) {
            console.log("data", data)
            if (isNotEmpty(data)) {
                bacSecurityEdit.patientList = data;
            }
        }
    });
}

//患者下拉绑定
function getPatientList(value) {
    if (value == null || value == "" || typeof value == "undefined") {
        value = "";
    }
    var formSelects = layui.formSelects;
    formSelects.btns('sickName', ['remove']);
    formSelects.config('sickName', {
        type: 'post',
        searchUrl: $.config.services.logistics + "/bacCallbackRecord/selSickData.do",
        searchVal: value,
        keySel: value == "" ? "" : "sickName",
        searchName: 'sickId',
        keyName: 'patientName',
        keyVal: 'patientRecordNo',
        delay: 1000,
        direction: 'auto',
        response: {
            statusCode: 0,          //成功状态码
            statusName: 'rtnCode',     //code key
            msgName: 'msg',         //msg key
            dataName: 'bizData'        //data key
        },
        //id:组件ID xm-select;  url:URL; searchVal:搜索的value; result:返回的结果
        beforeSuccess: function (id, url, searchVal, result) {        //success之前的回调, 干嘛呢? 处理数据的, 如果后台不想修改数据, 你也不想修改源码, 那就用这种方式处理下数据结构吧
            if (result.bizData == '' || result.bizData == null || typeof result.bizData == "undefined") {
                result.bizData = [];
            }
            return result;  //必须return一个结果, 这个结果要符合对应的数据结构
        },
        beforeSearch: function (id, url, val) {
            if (!val) {//内容为空, 不进行远程搜索
                return false;
            }
            return true;
        },
        success: function (id, url, searchVal, result) {      //使用远程方式的success回调
            if (value != null && value != "" && typeof value != "undefined") {
                formSelects.value("sickName", [value], true);
            }
        }
    });
}
/**
 * 获取人员管理下拉选
 */
function getPeopleRecordsList() {
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.logistics + "/bacSecurity/getPeopleRecords.do",
        data: {employeeName: ""},
        dataType: "json",
        done: function (data) {
            console.log("data", data)
            if (isNotEmpty(data)) {
                bacSecurityEdit.peopleRecordsList = data;
            }
        }
    });
}


//中心负责人下拉绑定
function getCenterUser(value) {
    if (value == null || value == "" || typeof value == "undefined") {
        value = "";
    }

    var formSelects = layui.formSelects;
    formSelects.btns('centerUser', ['remove']);
    formSelects.config('centerUser', {
        type: 'post',
        searchUrl: $.config.services.logistics + "/bacSecurity/getPeopleRecords.do",
        searchVal: value,
        keySel: value == "" ? "" : "name",
        searchName: 'employeeName',
        keyName: 'name',
        keyVal: 'peopleRecordsId',
        delay: 1000,
        direction: 'auto',
        response: {
            statusCode: 0,          //成功状态码
            statusName: 'rtnCode',     //code key
            msgName: 'msg',         //msg key
            dataName: 'bizData'        //data key
        },
        //id:组件ID xm-select;  url:URL; searchVal:搜索的value; result:返回的结果
        beforeSuccess: function (id, url, searchVal, result) {        //success之前的回调, 干嘛呢? 处理数据的, 如果后台不想修改数据, 你也不想修改源码, 那就用这种方式处理下数据结构吧
            if (result.bizData == '' || result.bizData == null || typeof result.bizData == "undefined") {
                result.bizData = [];
            }
            return result;  //必须return一个结果, 这个结果要符合对应的数据结构
        },
        beforeSearch: function (id, url, val) {
            if (isEmpty(val) || val == "{}") {//内容为空, 不进行远程搜索
                return false;
            }
            return true;
        },
        success: function (id, url, searchVal, result) {      //使用远程方式的success回调
            if (value != null && value != "" && typeof value != "undefined") {
                // formSelects.value("employeeName", [value], true);
            }
        }
    });
}