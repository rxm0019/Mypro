/**
 * bacScheduleDetailEdit.jsp的js文件，包括查询，编辑操作
 * 患者排班模板明细表
 * @Author xcj
 * @version: 1.0
 * @Date 2020/11/28
 */
var bacScheduleDetailEdit = avalon.define({
    $id: "bacScheduleDetailEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    detailId:'',//排班id
    patientList:[],//患者列表-今天未安排的患者
    regionSettingList:[],//区组列表
    bedNumber:[],//床号列表
    curBedNumber:[],//区组下的床号列表（动态）
    dialysisSchemeList:[],//透析方案列表
    characteristics:'',//治疗特征
    regionId:'',//区组
    bedNumberId:'',//床号
    scheduleShift:"",//班次
    patientId:"",//患者id
    features:'',//治疗特征中文显示
    scheduleDate:'',//排班日期
    patientMark:'N',//患者感染标志
    bedMark:'N',//床号感染标志
    scheduleTemplateId:'',//模板主表id
});

layui.use(['index','formSelects'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {

        var id = GetQueryString("id");  //接收变量
        if(isNotEmpty(id)){
            bacScheduleDetailEdit.detailId = id;
        }
        bacScheduleDetailEdit.scheduleDate=GetQueryString("scheduleDate");
        bacScheduleDetailEdit.scheduleTemplateId = GetQueryString("scheduleTemplateId");

        var patientId = GetQueryString("patientId");
        if(isNotEmpty(patientId)){
            bacScheduleDetailEdit.patientId = patientId;
        }
        var bedId = GetQueryString("bedId");  //接收变量
        if(isNotEmpty(bedId)){
            bacScheduleDetailEdit.bedNumberId = bedId;
        }
        var shift = GetQueryString("shift");  //接收变量
        if(isNotEmpty(shift)){
            bacScheduleDetailEdit.scheduleShift = shift;
        }
        var regionId = GetQueryString("regionId");  //接收变量
        if(isNotEmpty(regionId)){
            bacScheduleDetailEdit.regionId = regionId;
        }
        //获取实体信息
        getInfo(function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
        });

        filterSelect();
        avalon.scan();
    });
});


/**
 * 所有下拉框监控
 */
function filterSelect() {

    var form=layui.form;
    form.on('select(dialysisMode)', function(data){
        form.val('bacScheduleDetailEdit_form', {"dialyzer":""});
        if(isNotEmpty(data.value)){
            if(isNotEmpty(bacScheduleDetailEdit.characteristics)){
                if(bacScheduleDetailEdit.characteristics.indexOf(data.value) == -1){
                    layer.confirm('当前床位没有选中的透析方式，是否继续？',{
                        btn:['继续','取消'],
                        cancel:function(index, layero){
                            form.val('bacScheduleDetailEdit_form', {"dialysisMode":""});
                            form.val('bacScheduleDetailEdit_form', {"dialyzer":""});
                        }
                    },function (index) {
                        layer.close(index);
                    },function(index){
                        layer.close(index);
                        form.val('bacScheduleDetailEdit_form', {"dialysisMode":""});
                        form.val('bacScheduleDetailEdit_form', {"dialyzer":""});
                    });
                }
            }
            $.each(bacScheduleDetailEdit.dialysisSchemeList,function(index, item){
                if(data.value == item.dialysisMode){
                    form.val('bacScheduleDetailEdit_form', {"dialyzer":item.dialyzer});
                }
            })
        }
    });

    var formSelects=layui.formSelects; //调用layui的form模块
    layui.formSelects.on('patientId', function(id, vals, val, isAdd, isDisabled){
        //id:           点击select的id
        //vals:         当前select已选中的值
        //val:          当前select点击的值
        //如果return false, 那么将取消本次操作
        //患者感染标志
        bacScheduleDetailEdit.patientMark = "N";
        if(isAdd){
            //获取透析方案
            dialysisScheme(val.value);

            //比较感染标志 不为初始值，则比较
            if(isNotEmpty(val.infectionStatus)){
                bacScheduleDetailEdit.patientMark = val.infectionStatus;
            }else {
                bacScheduleDetailEdit.patientMark = "";
            }
            debugger
            //已经选了床号
            if(bacScheduleDetailEdit.bedMark != "N"){
                if(isNotEmpty(bacScheduleDetailEdit.patientMark)){
                    if(isNotEmpty(bacScheduleDetailEdit.bedMark)){
                        var pMarks = bacScheduleDetailEdit.patientMark.split(",");
                        var code = "";
                        //判断感染标志是否相同，只要有一个不同都不行
                        $.each(pMarks,function(index, item){
                            if(bacScheduleDetailEdit.bedMark.indexOf(item) == -1){
                                code = "1";
                            }
                        })
                        if(code == "1"){
                            warningToast("患者感染状况与透析机感染标志不符！");
                            bacScheduleDetailEdit.patientMark = "N";
                            return false;
                        }
                    }else{
                        warningToast("患者感染状况与透析机感染标志不符！");
                        bacScheduleDetailEdit.patientMark = "N";
                        return false;
                    }
                }
                if(isEmpty(bacScheduleDetailEdit.patientMark)){
                    if(isNotEmpty(bacScheduleDetailEdit.bedMark)){
                        warningToast("患者感染状况与透析机感染标志不符！");
                        bacScheduleDetailEdit.patientMark = "N";
                        return false;
                    }
                }
            }
        }
    });
    layui.formSelects.on('regionId', function(id, vals, val, isAdd, isDisabled){
        bacScheduleDetailEdit.curBedNumber.clear();
        if(isAdd){
            //根据区组，动态联动床号下拉
            $.each(bacScheduleDetailEdit.bedNumber,function(index, item){
                if(val.value == item.regionSettingId){
                    bacScheduleDetailEdit.curBedNumber.push(item)
                }
            })
        }
        formSelects.data('bedNumberId', 'local', {
            arr:bacScheduleDetailEdit.curBedNumber
        });
        layui.formSelects.value('bedNumberId',""); //床号下拉框赋值
        bacScheduleDetailEdit.bedMark = "N"; //清空数据
        bacScheduleDetailEdit.features = "";
    });
    layui.formSelects.on('bedNumberId', function(id, vals, val, isAdd, isDisabled){
        bacScheduleDetailEdit.bedMark = "N";
        bacScheduleDetailEdit.features = "";
        if(isAdd){
            //床号感染标志和患者感染标志对比
            if(isNotEmpty(val.infectionMark)){
                bacScheduleDetailEdit.bedMark = val.infectionMark;
            }else {
                bacScheduleDetailEdit.bedMark = "";
            }
            //不为初始值，则比较
            // 已经选了患者
            if(bacScheduleDetailEdit.patientMark != "N"){
                if(isNotEmpty(bacScheduleDetailEdit.bedMark)){
                    if(isNotEmpty(bacScheduleDetailEdit.patientMark)){
                        var pMarks = bacScheduleDetailEdit.patientMark.split(",");
                        var code = "";
                        $.each(pMarks,function(index, item){
                            if(bacScheduleDetailEdit.bedMark.indexOf(item) == -1){
                                code = "1";
                            }
                        })
                        if(code == "1"){
                            warningToast("患者感染状况与透析机感染标志不符！");
                            bacScheduleDetailEdit.bedMark = "N";
                            bacScheduleDetailEdit.features = "";
                            return false;
                        }
                    }else{
                        warningToast("患者感染状况与透析机感染标志不符！");
                        bacScheduleDetailEdit.bedMark = "N";
                        bacScheduleDetailEdit.features = "";
                        return false;
                    }
                }
                if(isEmpty(bacScheduleDetailEdit.bedMark)){
                    if(isNotEmpty(bacScheduleDetailEdit.patientMark)){
                        warningToast("患者感染状况与透析机感染标志不符！");
                        bacScheduleDetailEdit.bedMark = "N";
                        bacScheduleDetailEdit.features = "";
                        return false;
                    }
                }
            }

            //治疗特征
            if(isNotEmpty(val.characteristics)){
                bacScheduleDetailEdit.characteristics = val.characteristics;
            }else {
                bacScheduleDetailEdit.characteristics = "";
            }

            //如果有透析方式，则判断床位是否存在该透析方式
            var mode = $("select[name='dialysisMode']").val();
            if(isNotEmpty(mode)){
                if(bacScheduleDetailEdit.characteristics.indexOf(mode) == -1){
                    layer.confirm('当前床位没有选中的透析方式，是否继续？',{
                        btn:['继续','取消'],
                        cancel:function(index, layero){
                            form.val('bacScheduleDetailEdit_form', {"dialysisMode":""});
                            form.val('bacScheduleDetailEdit_form', {"dialyzer":""});
                        }
                    },function (index) {
                        layer.close(index);
                    },function(index){
                        layer.close(index);
                        form.val('bacScheduleDetailEdit_form', {"dialysisMode":""});
                        form.val('bacScheduleDetailEdit_form', {"dialyzer":""});
                    });
                }
            }
        }
    });
}


/**
 * 获取患者透析方案列表 -- 动态选中透析器用
 */
function dialysisScheme(patientId) {
    var param={
        "patientId":patientId,
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.schedule + "/bacPatientSchedule/listDialysisScheme.do",
        data:param,
        dataType: "json",
        done:function(data){
            bacScheduleDetailEdit.dialysisSchemeList.clear();
            bacScheduleDetailEdit.dialysisSchemeList.pushArray(data);
            // dialysisMode
            var mode = $("select[name='dialysisMode']").val();
            //如果有透析方式，并且在透析方案中，则透析器赋值
            var form=layui.form;
            form.val('bacScheduleDetailEdit_form', {"dialyzer":""});
            $("select[name='dialyzer']").val("");
            if(isNotEmpty(mode)){
                $.each(bacScheduleDetailEdit.dialysisSchemeList,function(index, item){
                    if(mode == item.dialysisMode){
                        form.val('bacScheduleDetailEdit_form', {"dialyzer":item.dialyzer});
                    }
                })
            }
        }
    });
}

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getInfo($callback){
    //获取下拉数据和实体
    var param={
        "detailId":bacScheduleDetailEdit.detailId,
        "scheduleDate":bacScheduleDetailEdit.scheduleDate
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.schedule + "/bacScheduleDetail/getInfo.do",
        data:param,
        dataType: "json",
        done:function(data){
            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            //初始化表单元素,日期时间选择器
            var formSelects=layui.formSelects; //调用layui的form模块

            bacScheduleDetailEdit.patientList.pushArray(data.PatientInfo);
            bacScheduleDetailEdit.regionSettingList.pushArray(data.RegionSetting);
            bacScheduleDetailEdit.bedNumber.pushArray(data.BedNumber);
            formSelects.btns('patientId',['remove']);
            formSelects.btns('regionId',['remove']);
            formSelects.btns('bedNumberId',['remove']);

            formSelects.data('patientId', 'local', {
                arr:bacScheduleDetailEdit.patientList
            });
            formSelects.data('regionId', 'local', {
                arr:bacScheduleDetailEdit.regionSettingList
            });
            var PatientSchedule = data.PatientSchedule;
            //编辑回显
            showBackEdit(PatientSchedule);
            //新增回显
            PatientSchedule = showBackAdd(PatientSchedule);

            PatientSchedule.scheduleTemplateId = bacScheduleDetailEdit.scheduleTemplateId;
            form.val('bacScheduleDetailEdit_form', PatientSchedule);
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}

/**
 * 编辑操作回显
 * @param PatientSchedule
 */
function showBackEdit(PatientSchedule) {
    var util=layui.util;
    var formSelects=layui.formSelects; //调用layui的form模块
    if(isNotEmpty(PatientSchedule.patientId)){
        layui.formSelects.value('patientId',[PatientSchedule.patientId]); //患者下拉框赋值
        formSelects.disabled('patientId');

        //患者感染标志
        var infectionStatus = "";
        $.each(bacScheduleDetailEdit.patientList,function(index, item){
            if(PatientSchedule.patientId == item.value){
                infectionStatus = item.infectionStatus;
            }
        })
        bacScheduleDetailEdit.patientMark = infectionStatus;
    }

    if(isNotEmpty(PatientSchedule.regionId)){
        layui.formSelects.value('regionId',[PatientSchedule.regionId]); //区组下拉框赋值

        bacScheduleDetailEdit.curBedNumber.clear();
        var bedMark = "";//床号感染标志
        var characteristics = "";//治疗特征
        //根据区组，动态联动床号下拉
        $.each(bacScheduleDetailEdit.bedNumber,function(index, item){
            if(PatientSchedule.regionId == item.regionSettingId){
                bacScheduleDetailEdit.curBedNumber.push(item)
                if(PatientSchedule.bedNumberId == item.value){
                    bedMark = item.infectionMark;
                    characteristics = item.characteristics;
                }
            }
        })
        formSelects.data('bedNumberId', 'local', {
            arr:bacScheduleDetailEdit.curBedNumber
        });
        layui.formSelects.value('bedNumberId',[PatientSchedule.bedNumberId]); //区组下拉框赋值
        bacScheduleDetailEdit.bedMark = bedMark;

        //治疗特征
        bacScheduleDetailEdit.characteristics = characteristics;
    }
}

/**
 * 新增回显
 */
function showBackAdd(PatientSchedule) {
    var util=layui.util;
    var formSelects=layui.formSelects; //调用layui的form模块
    //点击床号新增则床号和班次固定
    if(isNotEmpty(bacScheduleDetailEdit.detailId)){
        PatientSchedule.scheduleDate=util.toDateString(PatientSchedule.scheduleDate,"yyyy-MM-dd");
    }else {
        PatientSchedule.scheduleDate=bacScheduleDetailEdit.scheduleDate;
    }
    if(isNotEmpty(bacScheduleDetailEdit.bedNumberId)){
        PatientSchedule.bedNumberId = bacScheduleDetailEdit.bedNumberId;
        PatientSchedule.regionId = bacScheduleDetailEdit.regionId;
        bacScheduleDetailEdit.curBedNumber.clear();
        var bedMark = "";//床号感染标志
        var characteristics = "";//治疗特征
        //根据区组，动态联动床号下拉
        $.each(bacScheduleDetailEdit.bedNumber,function(index, item){
            if(bacScheduleDetailEdit.regionId == item.regionSettingId){
                bacScheduleDetailEdit.curBedNumber.push(item)
                if(PatientSchedule.bedNumberId == item.value){
                    bedMark = item.infectionMark;
                    characteristics = item.characteristics;
                }
            }
        })

        formSelects.data('bedNumberId', 'local', {
            arr:bacScheduleDetailEdit.curBedNumber
        });

        bacScheduleDetailEdit.bedMark = bedMark;
        //治疗特征
        bacScheduleDetailEdit.characteristics = characteristics;
        var feature = "";
        if(isNotEmpty(bacScheduleDetailEdit.characteristics)){
            var modes = bacScheduleDetailEdit.characteristics.split(",");
            $.each(modes,function(index, item){
                if(feature.length>0){
                    feature = feature + "," + getSysDictName("DialysisMode",item);
                }else {
                    feature = feature + getSysDictName("DialysisMode",item);
                }
            })
        }
        bacScheduleDetailEdit.features = feature;

        layui.formSelects.value('regionId',[bacScheduleDetailEdit.regionId]); //区组下拉框赋值
        formSelects.disabled('regionId');

        layui.formSelects.value('bedNumberId',[PatientSchedule.bedNumberId]); //区组下拉框赋值
        formSelects.disabled('bedNumberId');
    }
    if(isNotEmpty(bacScheduleDetailEdit.scheduleShift)){
        PatientSchedule.scheduleShift= bacScheduleDetailEdit.scheduleShift;
        $("select[name='scheduleShift']").attr("disabled","disabled");
    }

    //点击排床查询中的编辑
    if(isNotEmpty(bacScheduleDetailEdit.patientId)){
        layui.formSelects.value('patientId',[bacScheduleDetailEdit.patientId]); //患者下拉框赋值
        formSelects.disabled('patientId');

        //患者感染标志
        var infectionStatus = "";
        $.each(bacScheduleDetailEdit.patientList,function(index, item){
            if(bacScheduleDetailEdit.patientId == item.value){
                infectionStatus = item.infectionStatus;
            }
        })
        bacScheduleDetailEdit.patientMark = infectionStatus;
        PatientSchedule.patientId = bacScheduleDetailEdit.patientId
    }
    return PatientSchedule;
}


/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(bacScheduleDetailEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacScheduleDetailEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后

        if(bacScheduleDetailEdit.patientMark=='N'){
            warningToast("请选择患者！");
            return false;
        }
        if(bacScheduleDetailEdit.bedMark=='N'){
            warningToast("请选择床号！");
            return false;
        }
        if(isNotEmpty(bacScheduleDetailEdit.patientMark)){
            if(isNotEmpty(bacScheduleDetailEdit.bedMark)){
                var pMarks = bacScheduleDetailEdit.patientMark.split(",");
                var code = "";
                //判断感染标志是否相同，只要有一个不同都不行
                $.each(pMarks,function(index, item){
                    if(bacScheduleDetailEdit.bedMark.indexOf(item) == -1){
                        code = "1";
                    }
                })
                if(code == "1"){
                    warningToast("患者感染状况与透析机感染标志不符！");
                    return false;
                }
            }else{
                warningToast("患者感染状况与透析机感染标志不符！");
                return false;
            }
        }
        if(isEmpty(bacScheduleDetailEdit.patientMark)){
            if(isNotEmpty(bacScheduleDetailEdit.bedMark)){
                warningToast("患者感染状况与透析机感染标志不符！");
                return false;
            }
        }

        var param=field; //表单的元素
        //可以继续添加需要上传的参数
        var url = "";
        url = $.config.services.schedule + "/bacScheduleDetail/edit.do";
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}

function del($callback){  //删除操作
    layer.confirm('确定删除所选记录吗？', function(index){
        layer.close(index);
        var param={
            "id":bacScheduleDetailEdit.detailId
        };
        _ajax({
            type: "POST",
            url: $.config.services.schedule + "/bacScheduleDetail/delete.do",
            data:param,  //必须字符串后台才能接收list,
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            dataType: "json",
            done: function(data){
                typeof $callback === 'function' && $callback(); //返回一个回调事件
            }
        });
    });
}




