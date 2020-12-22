/**
 * 跌倒评估编辑
 * @author Care
 * @date 2020-09-06
 * @version 1.0
 */
var diaFallAssessEdit = avalon.define({
    $id: "diaFallAssessEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    makerName: [],
    assessor: '',
    fraction: '0',//跌倒评估得分
    visionHinder: '',
    diagnosisMore: '',
    assistWalk: '',
    gait: '',
    mentality: '',
    medication: '',
    assessor: '',//登录者
    diaFallAssess: null,//透前评估信息
});

layui.use(['index'], function () {
    var form = layui.form;
    form.on('select(visionHinder)', function (obj) {
        var bizCode = getSysDictBizCode("VisionHinder",obj.value);
        diaFallAssessEdit.visionHinder = bizCode;
        console.log("111", bizCode);
        computeAssessor()
    })
    form.on('select(diagnosisMore)', function (obj) {
        var bizCode = getSysDictBizCode("DiagnosisMore",obj.value);
        diaFallAssessEdit.diagnosisMore = bizCode;
        computeAssessor()
    })
    form.on('select(assistWalk)', function (obj) {
        var bizCode = getSysDictBizCode("AssistWalk",obj.value);
        diaFallAssessEdit.assistWalk = bizCode;
        computeAssessor()
    })
    form.on('select(gait)', function (obj) {
        var bizCode = getSysDictBizCode("Gait",obj.value);
        diaFallAssessEdit.gait = bizCode;
        computeAssessor()
    })
    form.on('select(mentality)', function (obj) {
        var bizCode = getSysDictBizCode("Mentality",obj.value);
        diaFallAssessEdit.mentality = bizCode;
        computeAssessor()
    })
    form.on('select(medication)', function (obj) {
        var bizCode = getSysDictBizCode("Medication",obj.value);
        diaFallAssessEdit.medication = bizCode;
        computeAssessor()
    })


    form.verify({
        assessScore: function (value) {
            if (value.trim() === "") {
                return;
            }
            if (!(/^\d+$/).test(value.trim())) {
                return '只能填数字，且数值为整数';
            }
            if (value.trim() < 0 || value.trim() > 1000) {
                return '请输入大于0且小于等于1000的数值！';
            }
        }
    })
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate = layui.laydate;
        diaFallAssessEdit.diaRecordId = GetQueryString("diaRecordId");  //接收变量
        if (isNotEmpty(diaFallAssessEdit.diaRecordId)) {
            $("#diaRecordId").val(diaFallAssessEdit.diaRecordId);
        }
        getMakerInfo();
        //获取实体信息
        getInfo(diaFallAssessEdit.diaRecordId);
        avalon.scan();
    });
});

/**
 * 获取角色
 * @param roleId
 */
function getMakerInfo() {
    var url = "";
    $(document).ready(function () {
        _ajax({
            type: "POST",
            loading: true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.system + "/sysUser/getNurseRoleList.do",
            data: {},
            dataType: "json",
            done: function (data) {
                var form = layui.form; //调用layui的form模块
                diaFallAssessEdit.makerName = data;
                data.forEach(function (item, i) {
                    if (item.id == baseFuncInfo.userInfoData.userid) {
                        diaFallAssessEdit.assessor = item.id;
                    }
                })
                layui.form.val('diaFallAssessEdit_form', {
                    assessor: diaFallAssessEdit.assessor,// 操作者
                });
                form.render();
            }
        });
    });
}

/**
 * 计算跌倒评估得分
 */
function computeAssessor() {
    diaFallAssessEdit.fraction = (diaFallAssessEdit.visionHinder * 1) + (diaFallAssessEdit.diagnosisMore * 1) + (diaFallAssessEdit.assistWalk * 1) + (diaFallAssessEdit.gait * 1) + (diaFallAssessEdit.mentality * 1) + (diaFallAssessEdit.medication * 1);
}

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(diaRecordId) {
    if (isNotEmpty(diaRecordId)) {
        //编辑
        var param = {
            "diaRecordId": diaRecordId,
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/diaAssess/getFalldown.do",
            data: param,
            dataType: "json",
            done: function (data) {
                var form = layui.form; //调用layui的form模块
                if (data) {
                    diaFallAssessEdit.diaFallAssess = data;
                    diaFallAssessEdit.visionHinder = getSysDictBizCode("VisionHinder",data.visionHinder);
                    diaFallAssessEdit.diagnosisMore = getSysDictBizCode("DiagnosisMore",data.diagnosisMore);
                    diaFallAssessEdit.assistWalk = getSysDictBizCode("AssistWalk",data.assistWalk);
                    diaFallAssessEdit.gait = getSysDictBizCode("Gait",data.gait);
                    diaFallAssessEdit.mentality = getSysDictBizCode("Mentality",data.mentality);
                    diaFallAssessEdit.medication = getSysDictBizCode("Medication",data.medication);
                    computeAssessor();
                }

                //表单初始赋值
                form.val('diaFallAssessEdit_form', data);
            }
        });
    }
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(diaFallAssessEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#diaFallAssessEdit_submit").trigger('click');
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
        param.assessScore = diaFallAssessEdit.fraction;
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/diaFallAssess/saveOrEdit.do",
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(param); //返回一个回调事件
            }
        });
    });
}



