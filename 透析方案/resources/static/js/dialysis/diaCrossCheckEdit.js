/**
 * diaCrossCheckEdit.jsp的js文件，包括查询，编辑操作
 * 透析管理--交叉核对
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/19
 */
var diaCrossCheckEdit = avalon.define({
    $id: "diaCrossCheckEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    diaRecordId:'',//透析记录id
    patientId:'',//患者id
    sysUserList:[],//审核人员列表
    dialysisMode:"",
    parameterError:'',//透析参数核查差错
    accessError:'',//血管通路核查差错
    linkError:'',//管道连接核查差错
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //获取父页面保存按钮事件
        if (baseFuncInfo.authorityTag('diaCrossCheckEdit#add') || baseFuncInfo.authorityTag('diaCrossCheckEdit#edit')) {
            if (window.parent.setSaveCallback) {
                window.parent.setSaveCallback(function () {
                    $("#diaCrossCheckEdit_submit").trigger('click');
                });
            }
        }

        //接收变量
        diaCrossCheckEdit.diaRecordId = GetQueryString("diaRecordId");
        diaCrossCheckEdit.patientId = GetQueryString("patientId");

        //获取实体信息
        getInfo(function(data){
            if(isNotEmpty(data.crossCheckId)){
                //已核对过，非核对人员不可编辑
                if(data.checkNurse != diaCrossCheckEdit.baseFuncInfo.userInfoData.userid){
                    formDisable();
                }
            }else {
                check();
            }
            //无权限，不可编辑
            if (!baseFuncInfo.authorityTag('diaCrossCheckEdit#add')) {
                formDisable();
            }
        });
        submit();
        filterCheck();
        avalon.scan();
    });
});

/**
 * 不可编辑
 */
function formDisable() {
    var form=layui.form;
    $("select[name='checkNurse']").attr("disabled",true);
    $("input[type='checkbox']").prop("disabled", true);
    $("input[type='text']").prop("readonly", true);
    form.render();
}

/**
 * 未保存，默认选中
 */
function check(){
    var form=layui.form;
    $("input[name='parameterCheck']").prop("checked", true);
    $("input[name='accessCheck']").prop("checked", true);
    $("input[name='linkCheck']").prop("checked", true);
    $("input[name='panelDisinfect']").prop("checked", true);
    $("input[name='reelDisinfect']").prop("checked", true);
    $("input[name='flatDisinfect']").prop("checked", true);
    $("input[name='vehicleDisinfect']").prop("checked", true);
    form.render();
}
/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getInfo($callback){
    var param={
        "diaRecordId":diaCrossCheckEdit.diaRecordId
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/diaCrossCheck/getInfo.do",
        data:param,
        dataType: "json",
        done:function(data){
            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            diaCrossCheckEdit.sysUserList.clear();
            diaCrossCheckEdit.sysUserList.pushArray(data.sysUserList);
            var diaBase = data.diaBase; //透析信息
            diaCrossCheckEdit.dialysisMode = data.dialysisMode;


            var htmlStr ='<option value=""></option>';
            $.each(diaCrossCheckEdit.sysUserList,function(i,item){
                htmlStr+='<option value="'+item.id+'">'+item.userName+'</option>';
            });
            $("select[name='checkNurse']").html(htmlStr);
            form.render();

            var diaCrossCheck = data.diaCrossCheck;
            debugger
            if(isEmpty(diaCrossCheck.crossCheckId)){
                //没创建，如果是护士角色，可默认选中
                if(diaCrossCheckEdit.baseFuncInfo.userInfoData.userType == $.constant.userType.nurse && isEmpty(diaCrossCheckEdit.checkNurse)){
                    diaCrossCheck.checkNurse = diaCrossCheckEdit.baseFuncInfo.userInfoData.userid;
                }
                diaCrossCheck.diaRecordId = diaCrossCheckEdit.diaRecordId;
            }else {
                form.val('diaCrossCheckEdit_form', diaCrossCheck);
            }

            var parameterDoseText = isEmpty(diaBase.dosageFirstValue)?"":diaBase.dosageFirstValue;
            if(isNotEmpty(parameterDoseText)){
                parameterDoseText += " ";
            }
            parameterDoseText +=  getSysDictName($.dictType.AnticoagulantUnit, diaBase.dosageFirstUnit);

            var parameterKeepText = getSysDictName($.dictType.Anticoagulant, diaBase.dosageAdd);
            if(isNotEmpty(parameterKeepText)){
                parameterKeepText += " ";
            }
            parameterKeepText +=  isEmpty(diaBase.dosageAddValue)?"":diaBase.dosageAddValue;
            if(isNotEmpty(parameterKeepText)){
                parameterKeepText += " ";
            }
            var unit = getSysDictName($.dictType.AnticoagulantUnit, diaBase.dosageFirstUnit);
            if(isNotEmpty(unit)){
                unit += "/h";
            }
            parameterKeepText += unit ;

            var parameterTotalText = 0;
            if(Number(diaBase.dosageFirstValue) && Number(diaBase.dosageAddValue) && Number(diaBase.dialysisTime)){
                parameterTotalText = diaBase.dosageFirstValue + diaBase.dosageAddValue * diaBase.dialysisTime;
            }
            parameterTotalText += " ";
            parameterTotalText += getSysDictName($.dictType.AnticoagulantUnit, diaBase.dosageFirstUnit);

            var dialysisTime = "";
            if(diaBase.dialysisTime!=null){
                dialysisTime = diaBase.dialysisTime + " 时";
            }else {
                dialysisTime = "0 时";
            }
            if(diaBase.dialysisTimeMinute!=null){
                dialysisTime += diaBase.dialysisTimeMinute + " 分";
            }else {
                dialysisTime += "0 分";
            }

            var newData = {
                checkNurse:diaCrossCheck.checkNurse,
                diaRecordId:diaCrossCheck.diaRecordId,
                parameterDehydrationText:diaBase.parameterDehydration,//处方脱水量(L)
                parameterAnticoagulantText:getSysDictName($.dictType.Anticoagulant, diaBase.anticoagulant),
                parameterBloodText:diaBase.bloodFlow,
                parameterFluidText:diaBase.replacementFluidFlow,
                parameterDoseText:parameterDoseText,
                parameterKeepText:parameterKeepText,
                parameterTotalText:parameterTotalText,
                parameterDurationText:dialysisTime,
                parameterModeText:getSysDictName($.dictType.DialysisMode, diaBase.dialysisMode),
                parameterSubTotalText:diaBase.replacementFluidTotal,
                parameterSubModeText:getSysDictName($.dictType.SubstituteMode, diaBase.substituteMode),
                accessTypeText:diaBase.vascularAccessId
            };

            form.val('diaCrossCheckEdit_form', newData);

            //已经创建了数据
            if(isNotEmpty(diaCrossCheck.crossCheckId)){
                //获取到元素，将checked赋值为true即可
                var item = $("input[type='checkbox']");
                item.each(function () {//批量回显
                    if (diaCrossCheck['' + $(this)['context'].name + ''] == "Y") {
                        $(this).prop("checked", true);
                    }else {
                        $(this).prop("checked", false);
                    }
                })
                if (window.parent.showTabBadgeDot) {
                    window.parent.showTabBadgeDot(false);
                }
                form.render();//别忘了刷新
            }
            typeof $callback === 'function' && $callback(diaCrossCheck); //返回一个回调事件
        }
    });
}

/**
 * 提交表单
 * 交叉核对执行护士是一个，核对人是一个，存一次就想，执行护士不用点保存
 */
function submit() {
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(diaCrossCheckEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        field.checkStatus = "Y";
        var url = "";
        //判断是否能编辑
        if(isNotEmpty(field.crossCheckId)){
            //已核对过，非核对人员不可编辑
            if(field.checkNurse != diaCrossCheckEdit.baseFuncInfo.userInfoData.userid){
                warningToast("非核对人员不可编辑！");
                return;
            }
        }
        url = $.config.services.dialysis + "/diaCrossCheck/save.do"

        var item = $("input[type='checkbox']");
        item.each(function () {
            var name = + $(this)['context'].name + '';
            if (isEmpty(field[$(this)['context'].name + ''])) {
                field[$(this)['context'].name + ''] = "N";
            }
        })

        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data:field,
            dataType: "json",
            done:function(data){
                successToast("保存成功");
                //已保存过去掉红点

                // 刷新当前透析记录状态
                if (window.parent.onRefreshRecordOption) { window.parent.onRefreshRecordOption(); }
            }
        });
    });
}

/**
 * 复选框监控
 */
function filterCheck() {
    var form = layui.form;

    //透析参数核查
    form.on('checkbox(checkOneAll)', function (data) {
        diaCrossCheckEdit.parameterError = "";
        $(".check-one input[type='checkbox']").prop("checked", false);
        form.render('checkbox');
    });

    form.on('checkbox(checkOne)', function (data) {
        var value = data.elem.title.replace(/\([^\)]*\)/g,"") + "；";
        if(data.elem.checked){
            diaCrossCheckEdit.parameterError += value;
        }else {
            diaCrossCheckEdit.parameterError = diaCrossCheckEdit.parameterError.replaceAll(value,"");
        }
        $('[name="parameterCheck"]').prop("checked", false);
        form.render('checkbox');
    });
    //血管通路核查
    form.on('checkbox(checkTwoAll)', function (data) {
        diaCrossCheckEdit.accessError = "";
        $(".check-two input[type='checkbox']").prop("checked", false);;
        form.render('checkbox');
    });

    form.on('checkbox(checkTwo)', function (data) {
        var value = data.elem.title.replace(/\([^\)]*\)/g,"") + "；";
        if(data.elem.checked){
            diaCrossCheckEdit.accessError += value;
        }else {
            diaCrossCheckEdit.accessError = diaCrossCheckEdit.accessError.replaceAll(value,"");
        }
        $('[name="accessCheck"]').prop("checked", false);
        form.render('checkbox');
    });

    //管道连接核查
    form.on('checkbox(checkThirdAll)', function (data) {
        diaCrossCheckEdit.linkError = "";
        $(".check-third input[type='checkbox']").prop("checked", false);;
        form.render('checkbox');
    });

    form.on('checkbox(checkThird)', function (data) {
        var value = data.elem.title.replace(/\([^\)]*\)/g,"") + "；";
        if(data.elem.checked){
            diaCrossCheckEdit.linkError += value;
        }else {
            diaCrossCheckEdit.linkError = diaCrossCheckEdit.linkError.replaceAll(value,"");
        }
        $('[name="linkCheck"]').prop("checked", false);
        form.render('checkbox');
    });

}

