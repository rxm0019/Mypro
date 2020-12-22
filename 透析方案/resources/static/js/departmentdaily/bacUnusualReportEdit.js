/**
 * bacUnusualReportEdit.jsp的js文件，包括查询，编辑操作
 * @author: Chauncey
 * @version: 1.0
 * @date: 2020/08/12
 */
var bacUnusualReportEdit = avalon.define({
    $id: "bacUnusualReportEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    readonly: {readonly: false}, // 设置只读
    disabled: {disabled: false}, // 设置只读
    userName: baseFuncInfo.userInfoData.username, //当前登录者名称
    userType:baseFuncInfo.userInfoData.userType,//当前登陆者类型 1-医生，2-护士，3-行政人员
    sickId:"", //病历号
    sickNm:"" //患者姓名
});

layui.use(['index','formSelects'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        selectSick();
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate = layui.laydate;
        laydate.render({
            elem: '#occurDate'
            , type: 'date'
        });
        var id = GetQueryString("id");  //接收变量
        bacUnusualReportEdit.layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        if (bacUnusualReportEdit.layEvent === 'detail') {
            bacUnusualReportEdit.readonly = {readonly: true};
            bacUnusualReportEdit.disabled = {disabled:true}
            $('input[type="radio"]').prop('disabled', true);
            $('input[type="checkbox"]').prop('disabled', true);
            $('input[type="select"]').prop('disabled', true);
            var formSelects = layui.formSelects;
            formSelects.disabled("sickId");
        }
        else{
            //初始化表单元素,日期时间选择器
            var laydate=layui.laydate;
            laydate.render({
                elem: '#occurDate'
                ,type: 'date'
                ,trigger: 'click'
            });
        }
        /*layui.$("#sickId").blur(function(){
            getPatientName();
        });*/
        //获取实体信息
        getInfo(id, function (data) {
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //getPatientName();
            selectSick(data.sickId);
        });
        avalon.scan();
    });
});

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(id, $callback) {
    if (isEmpty(id)) {
        //新增
        // 表单赋值
        var form = layui.form;
        var util=layui.util;
        var data = {
            occurDate: util.toDateString(new Date(),"yyyy-MM-dd"),
        }
        form.val('bacUnusualReportEdit_form', data);
        checkSignature();
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    } else {
        //编辑
        var param = {
            "unusualReportId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/bacUnusualReport/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                if(bacUnusualReportEdit.userType == "1"){//如果为医生，护士不能签名
                    if(data.signatureDoctor == ""){
                        document.getElementById("signatureDoctor").value = bacUnusualReportEdit.userName;
                    }else{
                        document.getElementById("signatureDoctor").value = data.signatureDoctor;
                    }
                    document.getElementById("signatureNurse").readOnly = true;
                }else if(bacUnusualReportEdit.userType == "2"){//如果为护士，医生不能签名
                    if(data.signatureNurse == ""){
                        document.getElementById("signatureNurse").value = bacUnusualReportEdit.userName;
                    }else{
                        document.getElementById("signatureNurse").value = data.signatureNurse;
                    }
                    document.getElementById("signatureDoctor").readOnly = true;
                }else{
                    document.getElementById("signatureDoctor").readOnly = true;
                    document.getElementById("signatureNurse").readOnly = true;
                }
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util = layui.util;
                data.occurDate = util.toDateString(data.occurDate, "yyyy-MM-dd");
                getUnusualItem(data.unusualItem);
                bacUnusualReportEdit.sickId = data.sickId;
                form.val('bacUnusualReportEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

/**
 * 检查签名医生和护士
 */
function checkSignature(){
    if(bacUnusualReportEdit.userType == "1"){//如果为医生，护士不能签名
        document.getElementById("signatureDoctor").value = bacUnusualReportEdit.userName;
        document.getElementById("signatureNurse").readOnly = true;
    }else if(bacUnusualReportEdit.userType == "2"){//如果为护士，医生不能签名
        document.getElementById("signatureNurse").value = bacUnusualReportEdit.userName;
        document.getElementById("signatureDoctor").readOnly = true;
    }else{
        document.getElementById("signatureDoctor").readOnly = true;
        document.getElementById("signatureNurse").readOnly = true;
    }
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(bacUnusualReportEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacUnusualReportEdit_submit").trigger('click');
}

//渲染治疗特征复选框
function getUnusualItem(unusualItem) {
    var unusualItemsarr = unusualItem.split(',');
    for (var i in unusualItemsarr) {
        $("[id='unusualItem']:checkbox").each(function () {
            if (unusualItemsarr[i] === $(this).attr("value")) {
                this.checked = true;
            }
        });
    }
    $("#unusualItem").val();//渲染治疗特征复选框
    var form = layui.form;
    form.render();
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        var param = field; //表单的元素
        //判断是否存在主键ID，不存在执行新增否则为编辑
        var url = '';
        if (param.unusualReportId.length == 0) {
            url = $.config.services.logistics + "/bacUnusualReport/save.do"
        } else {
            url = $.config.services.logistics + "/bacUnusualReport/edit.do"
        }
        //可以继续添加需要上传的参数
        param.unusualItem = GetCheckboxValues("unusualItem");
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });

    //将checke拼接为"value1,value2,value3"
    function GetCheckboxValues(Name) {
        var result = [];
        $("[id='" + Name + "']:checkbox").each(function () {
            if ($(this).is(":checked")) {
                result.push($(this).attr("value"));
            }
        });
        return result.join(",");
    };
}
/**
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getPatientName(){
    var param = {
        "sickId":bacUnusualReportEdit.sickId
    }
    if(param.sickId == "" || param.sickId == null || typeof param.sickId == 'undefined'){
        return "";
    }
    console.log(param);
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.logistics + "/bacUnusualReport/getPatientName.do",
        data:param,
        dataType: "json",
        done:function(data){
            if(data !=null){
                bacUnusualReportEdit.sickNm = data;
            }
            else {
                bacUnusualReportEdit.sickId = "";
                bacUnusualReportEdit.sickNm = "";
            }
        }
    });
}

//患者下拉绑定
function selectSick(value){
    if(value == null || value == "" || typeof value == "undefined" ){
        value = "";
    }
    var formSelects = layui.formSelects;
    formSelects.btns('sickId',['remove']);
    formSelects.config('sickId',{
        type:'post',
        searchUrl: $.config.services.logistics + "/bacCallbackRecord/selSickData.do",
        searchVal:value,
        keySel:value == "" ? "":"sickId",
        searchName:'sickId',
        keyName:'patientName',
        keyVal:'patientRecordNo',
        delay: 1000,
        direction: 'auto',
        response: {
            statusCode: 0,          //成功状态码
            statusName: 'rtnCode',     //code key
            msgName: 'msg',         //msg key
            dataName: 'bizData'        //data key
        },
        //id:组件ID xm-select;  url:URL; searchVal:搜索的value; result:返回的结果
        beforeSuccess: function(id, url, searchVal, result){        //success之前的回调, 干嘛呢? 处理数据的, 如果后台不想修改数据, 你也不想修改源码, 那就用这种方式处理下数据结构吧
            if(result.bizData == '' || result.bizData == null || typeof result.bizData == "undefined" ){
                result.bizData=[];
            }
            return result;  //必须return一个结果, 这个结果要符合对应的数据结构
        },
        beforeSearch: function(id, url, val){
            if(!val){//内容为空, 不进行远程搜索
                return false;
            }
            return true;
        },
        success: function(id, url, searchVal, result){      //使用远程方式的success回调
            if(value != null && value != "" && typeof value != "undefined" ){
                formSelects.value("sickId",[value],true);
            }
        }
    });
}


