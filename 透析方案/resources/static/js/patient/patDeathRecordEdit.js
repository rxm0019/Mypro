/**
 * patDeathRecord 的js文件
 * @author wahmh
 * @date 2020/09/03
 * @version 1.0
 */
var patDeathRecordEdit = avalon.define({
        $id: "patDeathRecordEdit",
        baseFuncInfo: baseFuncInfo,//底层基本方法
        editOrRead: false,// 编辑或以只读的方式展示  默认为false(只读) true(编辑)
        disabled: {disabled: true}//设置控件是否只读
        , patientId: "", //患者Id;
        deathRecordId: "",//死亡记录id
        patientMember: [],//患者家属List集合
        deathFlag: true,//从数据库获取到的有无死亡记录 true为有死亡记录   false 无死亡记录
        recordPeople: [],//记录人
        dockerId: "" //当前登录人id
    }
)
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id = GetQueryString("patientId");  //接收变量
        patDeathRecordEdit.patientId = id;
        //初始化表单元素,日期时间选择器
        var laydate = layui.laydate;
        laydate.render({
            elem: '#recordDatetime'
            , type: 'datetime',
            trigger: 'click',
            format: 'yyyy-MM-dd HH:mm',
            value:new Date()
        });
        laydate.render({
            elem: '#deathDatetime'
            , type: 'datetime',
            trigger: 'click',
            format: 'yyyy-MM-dd HH:mm',
            value: new Date()
        });
        laydate.render({
            elem: '#lastDialysisDatetime'
            , type: 'datetime',
            trigger: 'click',
            format: 'yyyy-MM-dd HH:mm',
            value: new Date()
        });
        laydate.render({
            elem: '#departureHospitalDatetime'
            , type: 'datetime',
            trigger: 'click',
            format: 'yyyy-MM-dd',
            value: new Date()
        });
        laydate.render({
            elem: '#createTime'
            , type: 'datetime',
            trigger: 'click',
            format: 'yyyy-MM-dd HH:mm',
            value: new Date()
        });
        laydate.render({
            elem: '#updateTime'
            , type: 'datetime',
            trigger: 'click',
            format: 'yyyy-MM-dd HH:mm',
            value: new Date()
        });
        //监听死亡类型下拉框状态的改变
        changeSelect()
        //获取患者家属信息
        getSelect()
        //获取实体信息aaaaaa
        getInfo(id, function (data) {
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });
        avalon.scan();
    });
});

//点击修改按钮
function update() {
    //获取现在下拉框选中的值
    var temp = $("#deathType").val();
    $(".edit-verify-span").html("*")
    controllerForm(temp)
    //将表单选项置为可修改
    patDeathRecordEdit.disabled = {disabled: false};
    //显示死亡类型下拉框
    $("#selectDeathType").css('display', 'block');
    //显示选择患者家属下拉框
    $("#selectContact").css("display", "block");
    //显示页面底部的保存和取消按钮
    $("#saveAndCancelButton").css('display', 'block');
    var form = layui.form;
    form.render('select');
}

//监听下拉框事件的改变
function changeSelect() {
    layui.use(['form'], function () {
        var form = layui.form;
        form.on('select(deathType)', function (data) {
            controllerForm(data.value)
        });
    })
}

/*
* 显示患者家属下拉列表div
* */
function showMemberList(e) {
    $("#patientMemberDiv").toggle()
    //阻止向上冒泡
    window.event.stopPropagation();
    $(document).click(function (event) {
        $("#patientMemberDiv").css("display", "none")
    })
}

/*
/*
* 控制表单具体要显示的项和 校验规则的移除
* @param falg   I 店内死亡  O店外死亡
* */
function controllerForm(flag) {
    switch (flag) {
        case "I":   //店内死亡显示店内死亡填写表单
            $("#inDeath").css('display', 'block');
            $("#outDeath").css('display', 'none');
            //需要移除店外死亡表单的 require属性
            $("#lastDialysisDatetime").removeAttr("lay-verify");
            $("#departureHospitalDatetime").removeAttr("lay-verify");
            $("#deathPlace").removeAttr("lay-verify");
// 添加要验证的属性  防止用户在点击删除原来店外死亡的记录又没有刷新页面 立即填写院内死亡记录
// 导致验证规则被删除
            $("#deathDatetime").attr('lay-verify', "required")
            break;
        case "O":   //店外死亡显示 店外死亡填写表单
            $("#inDeath").css('display', 'none');
            $("#outDeath").css('display', 'block');
            $("#deathPlace").attr('lay-verify', "required");
            $("#deathDatetime").removeAttr('lay-verify', "required");
            // 添加要验证的属性  防止用户在点击删除原来店内死亡的记录有 没有刷新页面 立即填写院外死亡记录
            // 导致验证规则被删除
            $("#lastDialysisDatetime").attr("lay-verify", "required");
            $("#departureHospitalDatetime").attr("lay-verify", "required");
            //填充患者最后一次透析时间-离开中心时间-主要诊断
            break;
    }
}

/*
* 在无死亡记录模式下点击 添加按钮处理函数
* 隐藏无死亡记录界面显示添加死亡记录界面
* */
function addDeathRecord() {
    $("#noDeathRecord").css('display', 'none');
    $("#deathForm").css('display', 'block');
    //点击添加直接将将表单选项置为可修改
    patDeathRecordEdit.disabled = {disabled: false};
//    将死亡类型下拉框和 选择肾友家属下拉框显示出来
    $("#selectDeathType").css('display', 'block');
    // 先隐藏填写的表单  当选择死亡类型时再显示
    $("#inDeath").css('display', 'none');
    $("#outDeath").css('display', 'none');
    $("#selectContact").css("display", "block");
//    显示肾友家属下拉框
    $("#selectContact").css("display", 'block')
//    将表单前的校验规则提示星号显示出来
    $(".edit-verify-span").html("*")
//    死亡类型和 选择患者家属下拉框开启为可选择

//    默认选择院内死亡
    $("#deathType").val("I")
    var form = layui.form;
    form.render('select');
    //院内死亡表单显示
    $("#inDeath").css("display", "block")
//    隐藏修改和删除按钮
    $("#updateOrDelete").css("display", "none");
//显示保存和取消按钮
    $("#saveAndCancelButton").css('display', 'block');
//    获取患者的上次透析时间-离开中心时间
    getPatientMoreInfo();

}

/*
* deathRecordId 删除死亡记录
* */
function deleteDeathRecord() {
    var deathRecordId = patDeathRecordEdit.deathRecordId
    layer.confirm('确定删除死亡记录吗？', function (index) {
        layer.close(index);
        var param = {
            deathRecordId: deathRecordId,
            patientId: patDeathRecordEdit.patientId

        }
        //向服务端发送删除指令
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patDeathRecord/deleteDeathRecord.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //    删除成功
                if (data >= 1) {
                    //    数据删除成功切换到无死亡记录界面
                    $("#noDeathRecord").css('display', 'block');
                    $("#deathForm").css('display', 'none');
                    //删除后重新设置为无死亡记录
                    patDeathRecordEdit.deathFlag = false;
                    //    清空表单数据防止用户没有刷新当前页面点击添加后上次的信息还在
                    clearForm()
                    successToast("删除成功");
                }
            }
        })
    });
}

/*
* 清空表单和设置默认下拉框选项
* */
function clearForm() {
    var form = layui.form; //调用layui的form模块
    var data = {
        contactInfo: "",
        contactPerson: "",
        createBy: "",
        createTime: "",
        dataStatus: "",
        dataSync: "",
        deathDatetime: new Date(),
        deathDiagnosis: "",
        deathPlace: "",
        deathReason: "",
        deathReasonAnalysis: "",
        deathRecordId: "",
        deathType: "",
        departureHospitalDatetime: "",
        hospitalNo: "",
        infoSource: "",
        lastDialysisDatetime: "",
        mainDiagnosis: "",
        patientId: "",
        recordDatetime: "",
        recordUserId: "",
        relationship: "",
        rescueProcess: "",
        updateBy: "",
        updateTime: ""
    };
    //清空表单后默认选中请选择选项
    $("#familyMemberName").val("temp")
    form.val('patDeathRecordEdit_form', data);
    layui.form.render();
}

/*
根据 deathFlag判断是否有死亡记录  true有死亡记录  false 没有死亡记录
* 在无死亡记录模式下点击切换到无死亡记录界面
* 在有死亡记录模式下点击切换到 死亡记录信息详情页面
* */
function cancelEditOrSave() {
    //隐藏选择肾友家属
    $("#selectContact").css("display", "none");
    switch (patDeathRecordEdit.deathFlag) {
        case true:
            $("#noDeathRecord").css('display', 'none')
            $("#deathForm").css('display', 'block')
            //重新将下面的保存和取消按钮隐藏  同时将表单重新设置为不可编辑状态
            $("#saveAndCancelButton").css('display', 'none')
            patDeathRecordEdit.disabled = {disabled: true};
            var form = layui.form;
            form.render('select');
            break;
        case false:
            $("#noDeathRecord").css('display', 'block')
            $("#deathForm").css('display', 'none')
            //重新将下面的保存和取消按钮隐藏  同时将表单重新设置为不可编辑状态
            $("#saveAndCancelButton").css('display', 'none')
            patDeathRecordEdit.disabled = {disabled: true};
            var form = layui.form;
            form.render('select');
            break;
    }


}

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(id, $callback) {
    //获取制定人
    getMakers()
    if (isEmpty(id)) {
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    } else {
        //编辑
        var param = {
            "patientId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patDeathRecord/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //无死亡记录
                if (data.patientId === "") {
                    //无死亡记录
                    patDeathRecordEdit.deathFlag = false
                    $("#noDeathRecord").css('display', 'block');
                    $("#deathForm").css('display', 'none');
                }
                //有死亡记录
                else {
                    // 隐藏选择肾友家属 以只读的方式查看
                    $("#selectContact").css("display", "none");
                    //隐藏选择患者家属下链接
                    $("#selectContact").css("display", "none")
                    //将表单校验规则前的*置为空  在点击修改后在显示出来
                    $(".edit-verify-span").html("")
                    //deathType  判断死亡类型 I院内死亡  O 院外死亡
                    switch (data.deathType) {
                        case 'I':
                            $("#inDeath").css('display', 'block');
                            $("#outDeath").css('display', 'none');
                            break;
                        case 'O':
                            $("#inDeath").css('display', 'none');
                            $("#outDeath").css('display', 'block');
                            break;
                    }
                    //将死亡记录id保存下来
                    patDeathRecordEdit.deathRecordId = data.deathRecordId
                    $("#noDeathRecord").css('display', 'none');
                    $("#deathForm").css('display', 'block');
                    //表单初始赋值
                    var form = layui.form; //调用layui的form模块
                    //初始化表单元素,日期时间选择器
                    var util = layui.util;
                    //给表单赋值
                    data.recordDatetime = util.toDateString(data.recordDatetime, "yyyy-MM-dd HH:mm");
                    if (data.deathDatetime < 0) {
                        data.deathDatetime = ""
                    } else {
                        data.deathDatetime = util.toDateString(data.deathDatetime, "yyyy-MM-dd HH:mm");
                    }
                    if (data.lastDialysisDatetime < 0) {
                        data.lastDialysisDatetime = "";
                    } else {
                        data.lastDialysisDatetime = util.toDateString(data.lastDialysisDatetime, "yyyy-MM-dd HH:mm");
                    }
                    data.departureHospitalDatetime = util.toDateString(data.departureHospitalDatetime, "yyyy-MM-dd HH:mm");
                    form.val('patDeathRecordEdit_form', data);
                    // var recordDatetime=$("#recordDatetime").val();
                    typeof $callback === 'function' && $callback(data); //返回一个回调事件
                }

            }
        });
    }
}

/*
获取制定人
* */
function getMakers() {
    _ajax({
        type: "POST",
        loading: false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getDoctorRoleList.do",
        dataType: "json",
        done: function (data) {
            patDeathRecordEdit.recordPeople = data;
            $("#recordUserId").empty();    //清空列表
            //添加请选择列表
            $("#recordUserId").append($("<option/>").text('选择记录人').attr("value", ""));
            for (var i = 0; i < data.length; i++) {
                $("#recordUserId").append($("<option/>").text(data[i].userName).attr("value", data[i].id)); //动态添加标签
                if (data[i].id == baseFuncInfo.userInfoData.userid) {
                    patDeathRecordEdit.dockerId = data[i].id;
                }
            }
            $("#recordUserId").val(patDeathRecordEdit.dockerId)
            var form = layui.form;
            form.render('select');
        }
    });
}

function selectPatientMember(familyMemberId) {
    for (var i = 0; i < patDeathRecordEdit.patientMember.length; i++) {
        if (familyMemberId === patDeathRecordEdit.patientMember[i].familyMemberId) {
            //    将当前选中的肾友信息填充到表单
            $("#contactPerson").val(patDeathRecordEdit.patientMember[i].familyMemberName)
            $("#relationship").val(patDeathRecordEdit.patientMember[i].relationship)
            $("#contactInfo").val(patDeathRecordEdit.patientMember[i].mobilePhone)
            //隐藏 下拉框div
            $("#patientMemberDiv").toggle()
            break;
        }
    }
}

/*
* 根据患者id 查询患者对应的联系人
* */
function getSelect() {
    var param = {
        "patientId": patDeathRecordEdit.patientId
    }
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/patDeathRecord/getPatientMemberMessage.do",
        data: param,
        dataType: "json",
        done: function (data) {
            //将下拉框信息保存下来
            patDeathRecordEdit.patientMember = data
            if (data.length < 1) {
                var temp = "<p style='text-align: center'>无患者家属信息</p>"
                $("#patientMemberDiv").append(temp)
            } else {
                for (var i = 0; i < data.length; i++) {
                    //默认选中第一笔患者家属信息
                    if (i === 0) {
                        $("#contactPerson").val(data[i].familyMemberName)
                        $("#relationship").val(data[i].relationship)
                        $("#contactInfo").val(data[i].mobilePhone)
                    }
                    var temp = "<p><a style=\"cursor: pointer;padding-left: 20px\" onclick=\"selectPatientMember(\'" + data[i].familyMemberId + "\')\">"
                        + data[i].familyMemberName + " " + "(" + data[i].relationship + " " + data[i].mobilePhone + ")" + "</a></p>";
                    $("#patientMemberDiv").append(temp)
                    // $("#familyMemberName").append($("<option/>").text(data[i].familyMemberName+" "+"("+data[i].relationship+" "+data[i].mobilePhone+")").attr("value", data[i].familyMemberId)); //动态添加标签
                }
            }
        }
    })
}

/**
 * 获取患者上次透析时间 -离开中心时间-主要诊断
 * */
function getPatientMoreInfo() {
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/patDeathRecord/getInfo.do",
        data: {"patientId": patDeathRecordEdit.patientId},
        dataType: "json",
        done: function (data) {
            var util = layui.util;
            if (data.lastDialysisDatetime < 0) {
                data.lastDialysisDatetime = "";
            } else {
                data.lastDialysisDatetime = util.toDateString(data.lastDialysisDatetime, "yyyy-MM-dd");
            }
            if (data.departureHospitalDatetime < 0) {
                data.departureHospitalDatetime = "";
            } else {
                data.departureHospitalDatetime = util.toDateString(data.departureHospitalDatetime, "yyyy-MM-dd");
            }
            $("#lastDialysisDatetime").val(data.lastDialysisDatetime);
            $("#departureHospitalDatetime").val(data.departureHospitalDatetime);
            $("#mainDiagnosis").val(data.mainDiagnosis);
        }
    });
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    //自定义验证表单的手机号码
    form.verify({
        phoneVerify: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value != "") {  //值不是空的时候再去走验证
                if (!/^1[3|4|5|7|8]\d{9}$/.test(value)) {
                    return '手机号格式不正确';
                }
            }
        }
    })
    form.on('submit(patDeathRecordEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#patDeathRecordEdit_submit").trigger('click');
}

/**
 * 保存或者修改死亡记录数据
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    $("#deathType").change()
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        var param = field; //表单的元素
        //添加patientId属性
        var key = 'patientId';
        var value = patDeathRecordEdit.patientId
        param[key] = value
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patDeathRecord/edit.do",
            data: param,
            dataType: "json",
            done: function (data) {
                // 重新给死亡记录id赋值
                patDeathRecordEdit.deathRecordId = data.deathRecordId
                // //重新将下面的保存和取消按钮隐藏  同时将表单重新设置为不可编辑状态
                $("#saveAndCancelButton").css('display', 'none')
                //显示上方的修改删除按钮
                $("#updateOrDelete").css('display', 'block')
                //将检验规则前的* 号去掉
                $(".edit-verify-span").html("")
                //开启禁止编辑模式
                patDeathRecordEdit.disabled = {disabled: true};
                var form = layui.form;
                form.render('select');//重新渲染下拉框
                successToast("保存成功");
                typeof $callback === 'function' && $callback(data); //返回 一个回调事件
            }
        });
    });
}



