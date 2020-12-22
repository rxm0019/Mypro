/**
 * bacPatientScheduleEdit.jsp的js文件，包括查询，编辑操作
  患者排班编辑页面
 * @Author xcj
 * @version: 1.0
 * @Date 2020/8/19
 *
 * 注意：还没完成，需关联执行医嘱那边，查看是否能继续编辑
 */
var bacPatientScheduleEdit = avalon.define({
    $id: "bacPatientScheduleEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientScheduleId:'',//排班id
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
    //患者透析方式动态查找校验
});

layui.use(['index','formSelects'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器

        var id = GetQueryString("id");  //接收变量
        if(isNotEmpty(id)){
            bacPatientScheduleEdit.patientScheduleId = id;
        }
        bacPatientScheduleEdit.scheduleDate=GetQueryString("scheduleDate");

        var patientId = GetQueryString("patientId");
        if(isNotEmpty(patientId)){
            bacPatientScheduleEdit.patientId = patientId;
        }
        var bedId = GetQueryString("bedId");  //接收变量
        if(isNotEmpty(bedId)){
            bacPatientScheduleEdit.bedNumberId = bedId;
        }
        var shift = GetQueryString("shift");  //接收变量
        if(isNotEmpty(shift)){
            bacPatientScheduleEdit.scheduleShift = shift;
        }
        var regionId = GetQueryString("regionId");  //接收变量
        if(isNotEmpty(regionId)){
            bacPatientScheduleEdit.regionId = regionId;
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
        form.val('bacPatientScheduleEdit_form', {"dialyzer":""});
        if(isNotEmpty(data.value)){
            if(isNotEmpty(bacPatientScheduleEdit.characteristics)){
                if(bacPatientScheduleEdit.characteristics.indexOf(data.value) == -1){
                    layer.confirm('当前床位没有选中的透析方式，是否继续？',{
                        btn:['继续','取消'],
                        cancel:function(index, layero){
                            form.val('bacPatientScheduleEdit_form', {"dialysisMode":""});
                            form.val('bacPatientScheduleEdit_form', {"dialyzer":""});
                        }
                    },function (index) {
                        layer.close(index);
                    },function(index){
                        layer.close(index);
                        form.val('bacPatientScheduleEdit_form', {"dialysisMode":""});
                        form.val('bacPatientScheduleEdit_form', {"dialyzer":""});
                    });
                }
            }
            $.each(bacPatientScheduleEdit.dialysisSchemeList,function(index, item){
                if(data.value == item.dialysisMode){
                    form.val('bacPatientScheduleEdit_form', {"dialyzer":item.dialyzer});
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
        bacPatientScheduleEdit.patientMark = "N";
        if(isAdd){
            //获取透析方案
            dialysisScheme(val.value);

            //比较感染标志 不为初始值，则比较
            if(isNotEmpty(val.infectionStatus)){
                bacPatientScheduleEdit.patientMark = val.infectionStatus;
            }else {
                bacPatientScheduleEdit.patientMark = "";
            }
            debugger
            //已经选了床号
            if(bacPatientScheduleEdit.bedMark != "N"){
                if(isNotEmpty(bacPatientScheduleEdit.patientMark)){
                    if(isNotEmpty(bacPatientScheduleEdit.bedMark)){
                        var pMarks = bacPatientScheduleEdit.patientMark.split(",");
                        var code = "";
                        //判断感染标志是否相同，只要有一个不同都不行
                        $.each(pMarks,function(index, item){
                            if(bacPatientScheduleEdit.bedMark.indexOf(item) == -1){
                                code = "1";
                            }
                        })
                        if(code == "1"){
                            warningToast("患者感染状况与透析机感染标志不符！");
                            bacPatientScheduleEdit.patientMark = "N";
                            return false;
                        }
                    }else{
                        warningToast("患者感染状况与透析机感染标志不符！");
                        bacPatientScheduleEdit.patientMark = "N";
                        return false;
                    }
                }
                if(isEmpty(bacPatientScheduleEdit.patientMark)){
                    if(isNotEmpty(bacPatientScheduleEdit.bedMark)){
                        warningToast("患者感染状况与透析机感染标志不符！");
                        bacPatientScheduleEdit.patientMark = "N";
                        return false;
                    }
                }
            }
        }
    });
    layui.formSelects.on('regionId', function(id, vals, val, isAdd, isDisabled){
        bacPatientScheduleEdit.curBedNumber.clear();
        if(isAdd){
            //根据区组，动态联动床号下拉
            $.each(bacPatientScheduleEdit.bedNumber,function(index, item){
                if(val.value == item.regionSettingId){
                    bacPatientScheduleEdit.curBedNumber.push(item)
                }
            })
        }
        formSelects.data('bedNumberId', 'local', {
            arr:bacPatientScheduleEdit.curBedNumber
        });
        layui.formSelects.value('bedNumberId',""); //床号下拉框赋值
        bacPatientScheduleEdit.bedMark = "N"; //清空数据
        bacPatientScheduleEdit.features = "";
    });
    layui.formSelects.on('bedNumberId', function(id, vals, val, isAdd, isDisabled){
        bacPatientScheduleEdit.bedMark = "N";
        bacPatientScheduleEdit.features = "";
        if(isAdd){
            //床号感染标志和患者感染标志对比
            if(isNotEmpty(val.infectionMark)){
                bacPatientScheduleEdit.bedMark = val.infectionMark;
            }else {
                bacPatientScheduleEdit.bedMark = "";
            }
            //不为初始值，则比较
            // 已经选了患者
            if(bacPatientScheduleEdit.patientMark != "N"){
                if(isNotEmpty(bacPatientScheduleEdit.bedMark)){
                    if(isNotEmpty(bacPatientScheduleEdit.patientMark)){
                        var pMarks = bacPatientScheduleEdit.patientMark.split(",");
                        var code = "";
                        $.each(pMarks,function(index, item){
                            if(bacPatientScheduleEdit.bedMark.indexOf(item) == -1){
                                code = "1";
                            }
                        })
                        if(code == "1"){
                            warningToast("患者感染状况与透析机感染标志不符！");
                            bacPatientScheduleEdit.bedMark = "N";
                            bacPatientScheduleEdit.features = "";
                            return false;
                        }
                    }else{
                        warningToast("患者感染状况与透析机感染标志不符！");
                        bacPatientScheduleEdit.bedMark = "N";
                        bacPatientScheduleEdit.features = "";
                        return false;
                    }
                }
                if(isEmpty(bacPatientScheduleEdit.bedMark)){
                    if(isNotEmpty(bacPatientScheduleEdit.patientMark)){
                        warningToast("患者感染状况与透析机感染标志不符！");
                        bacPatientScheduleEdit.bedMark = "N";
                        bacPatientScheduleEdit.features = "";
                        return false;
                    }
                }
            }

            //治疗特征
            if(isNotEmpty(val.characteristics)){
                bacPatientScheduleEdit.characteristics = val.characteristics;
            }else {
                bacPatientScheduleEdit.characteristics = "";
            }
            // var feature = "";
            // if(isNotEmpty(bacPatientScheduleEdit.characteristics)){
            //     var modes = bacPatientScheduleEdit.characteristics.split(",");
            //     $.each(modes,function(index, item){
            //         if(feature.length>0){
            //             feature = feature + "," + getSysDictName("DialysisMode",item);
            //         }else {
            //             feature = feature + getSysDictName("DialysisMode",item);
            //         }
            //     })
            // }
            // bacPatientScheduleEdit.features = feature;

            //如果有透析方式，则判断床位是否存在该透析方式
            var mode = $("select[name='dialysisMode']").val();
            if(isNotEmpty(mode)){
                if(bacPatientScheduleEdit.characteristics.indexOf(mode) == -1){
                    layer.confirm('当前床位没有选中的透析方式，是否继续？',{
                        btn:['继续','取消'],
                        cancel:function(index, layero){
                            form.val('bacPatientScheduleEdit_form', {"dialysisMode":""});
                            form.val('bacPatientScheduleEdit_form', {"dialyzer":""});
                        }
                    },function (index) {
                        layer.close(index);
                    },function(index){
                        layer.close(index);
                        form.val('bacPatientScheduleEdit_form', {"dialysisMode":""});
                        form.val('bacPatientScheduleEdit_form', {"dialyzer":""});
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
            bacPatientScheduleEdit.dialysisSchemeList.clear();
            bacPatientScheduleEdit.dialysisSchemeList.pushArray(data);
           // dialysisMode
            var mode = $("select[name='dialysisMode']").val();
            //如果有透析方式，并且在透析方案中，则透析器赋值
            var form=layui.form;
            form.val('bacPatientScheduleEdit_form', {"dialyzer":""});
            $("select[name='dialyzer']").val("");
            if(isNotEmpty(mode)){
                $.each(bacPatientScheduleEdit.dialysisSchemeList,function(index, item){
                    if(mode == item.dialysisMode){
                        form.val('bacPatientScheduleEdit_form', {"dialyzer":item.dialyzer});
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
        "patientScheduleId":bacPatientScheduleEdit.patientScheduleId,
        "scheduleDate":bacPatientScheduleEdit.scheduleDate
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.schedule + "/bacPatientSchedule/getInfo.do",
        data:param,
        dataType: "json",
        done:function(data){
            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            //初始化表单元素,日期时间选择器
            var formSelects=layui.formSelects; //调用layui的form模块

            bacPatientScheduleEdit.patientList.pushArray(data.PatientInfo);
            bacPatientScheduleEdit.regionSettingList.pushArray(data.RegionSetting);
            bacPatientScheduleEdit.bedNumber.pushArray(data.BedNumber);
            formSelects.btns('patientId',['remove']);
            formSelects.btns('regionId',['remove']);
            formSelects.btns('bedNumberId',['remove']);

            formSelects.data('patientId', 'local', {
                arr:bacPatientScheduleEdit.patientList
            });
            formSelects.data('regionId', 'local', {
                arr:bacPatientScheduleEdit.regionSettingList
            });
            var PatientSchedule = data.PatientSchedule;
            //编辑回显
            showBackEdit(PatientSchedule);
            //新增回显
            PatientSchedule = showBackAdd(PatientSchedule);

            form.val('bacPatientScheduleEdit_form', PatientSchedule);
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
        $.each(bacPatientScheduleEdit.patientList,function(index, item){
            if(PatientSchedule.patientId == item.value){
                infectionStatus = item.infectionStatus;
            }
        })
        bacPatientScheduleEdit.patientMark = infectionStatus;
    }

    if(isNotEmpty(PatientSchedule.regionId)){
        layui.formSelects.value('regionId',[PatientSchedule.regionId]); //区组下拉框赋值

        bacPatientScheduleEdit.curBedNumber.clear();
        var bedMark = "";//床号感染标志
        var characteristics = "";//治疗特征
        //根据区组，动态联动床号下拉
        $.each(bacPatientScheduleEdit.bedNumber,function(index, item){
            if(PatientSchedule.regionId == item.regionSettingId){
                bacPatientScheduleEdit.curBedNumber.push(item)
                if(PatientSchedule.bedNumberId == item.value){
                    bedMark = item.infectionMark;
                    characteristics = item.characteristics;
                }
            }
        })
        formSelects.data('bedNumberId', 'local', {
            arr:bacPatientScheduleEdit.curBedNumber
        });
        layui.formSelects.value('bedNumberId',[PatientSchedule.bedNumberId]); //区组下拉框赋值
        bacPatientScheduleEdit.bedMark = bedMark;

        //治疗特征
         bacPatientScheduleEdit.characteristics = characteristics;
        // var feature = "";
        // if(isNotEmpty(bacPatientScheduleEdit.characteristics)){
        //     var modes = bacPatientScheduleEdit.characteristics.split(",");
        //     $.each(modes,function(index, item){
        //         if(feature.length>0){
        //             feature = feature + "," + getSysDictName("DialysisMode",item);
        //         }else {
        //             feature = feature + getSysDictName("DialysisMode",item);
        //         }
        //     })
        // }
        // bacPatientScheduleEdit.features = feature;
    }
}

/**
 * 新增回显
 */
function showBackAdd(PatientSchedule) {
    var util=layui.util;
    var formSelects=layui.formSelects; //调用layui的form模块
    //点击床号新增则床号和班次固定
    if(isNotEmpty(bacPatientScheduleEdit.patientScheduleId)){
        PatientSchedule.scheduleDate=util.toDateString(PatientSchedule.scheduleDate,"yyyy-MM-dd");
    }else {
        PatientSchedule.scheduleDate=bacPatientScheduleEdit.scheduleDate;
    }
    if(isNotEmpty(bacPatientScheduleEdit.bedNumberId)){
        PatientSchedule.bedNumberId = bacPatientScheduleEdit.bedNumberId;
        PatientSchedule.regionId = bacPatientScheduleEdit.regionId;
        bacPatientScheduleEdit.curBedNumber.clear();
        var bedMark = "";//床号感染标志
        var characteristics = "";//治疗特征
        //根据区组，动态联动床号下拉
        $.each(bacPatientScheduleEdit.bedNumber,function(index, item){
            if(bacPatientScheduleEdit.regionId == item.regionSettingId){
                bacPatientScheduleEdit.curBedNumber.push(item)
                if(PatientSchedule.bedNumberId == item.value){
                    bedMark = item.infectionMark;
                    characteristics = item.characteristics;
                }
            }
        })

        formSelects.data('bedNumberId', 'local', {
            arr:bacPatientScheduleEdit.curBedNumber
        });

        bacPatientScheduleEdit.bedMark = bedMark;
        //治疗特征
        bacPatientScheduleEdit.characteristics = characteristics;
        var feature = "";
        if(isNotEmpty(bacPatientScheduleEdit.characteristics)){
            var modes = bacPatientScheduleEdit.characteristics.split(",");
            $.each(modes,function(index, item){
                if(feature.length>0){
                    feature = feature + "," + getSysDictName("DialysisMode",item);
                }else {
                    feature = feature + getSysDictName("DialysisMode",item);
                }
            })
        }
        bacPatientScheduleEdit.features = feature;

        layui.formSelects.value('regionId',[bacPatientScheduleEdit.regionId]); //区组下拉框赋值
        formSelects.disabled('regionId');

        layui.formSelects.value('bedNumberId',[PatientSchedule.bedNumberId]); //区组下拉框赋值
        formSelects.disabled('bedNumberId');
    }
    if(isNotEmpty(bacPatientScheduleEdit.scheduleShift)){
        PatientSchedule.scheduleShift= bacPatientScheduleEdit.scheduleShift;
        $("select[name='scheduleShift']").attr("disabled","disabled");
    }

    //点击排床查询中的编辑
    if(isNotEmpty(bacPatientScheduleEdit.patientId)){
        layui.formSelects.value('patientId',[bacPatientScheduleEdit.patientId]); //患者下拉框赋值
        formSelects.disabled('patientId');

        //患者感染标志
        var infectionStatus = "";
        $.each(bacPatientScheduleEdit.patientList,function(index, item){
            if(bacPatientScheduleEdit.patientId == item.value){
                infectionStatus = item.infectionStatus;
            }
        })
        bacPatientScheduleEdit.patientMark = infectionStatus;
        PatientSchedule.patientId = bacPatientScheduleEdit.patientId
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
    form.on('submit(bacPatientScheduleEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacPatientScheduleEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后

        if(bacPatientScheduleEdit.patientMark=='N'){
            warningToast("请选择患者！");
            return false;
        }
        if(bacPatientScheduleEdit.bedMark=='N'){
            warningToast("请选择床号！");
            return false;
        }
        if(isNotEmpty(bacPatientScheduleEdit.patientMark)){
            if(isNotEmpty(bacPatientScheduleEdit.bedMark)){
                var pMarks = bacPatientScheduleEdit.patientMark.split(",");
                var code = "";
                //判断感染标志是否相同，只要有一个不同都不行
                $.each(pMarks,function(index, item){
                    if(bacPatientScheduleEdit.bedMark.indexOf(item) == -1){
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
        if(isEmpty(bacPatientScheduleEdit.patientMark)){
            if(isNotEmpty(bacPatientScheduleEdit.bedMark)){
                warningToast("患者感染状况与透析机感染标志不符！");
                return false;
            }
        }

        var param=field; //表单的元素
        //可以继续添加需要上传的参数
        var url = "";
        if(isNotEmpty(bacPatientScheduleEdit.patientScheduleId)){
            url = $.config.services.schedule + "/bacPatientSchedule/editPatientSchedule.do";
        }else {
            url = $.config.services.schedule + "/bacPatientSchedule/savePatientSchedule.do";
        }
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
            "id":bacPatientScheduleEdit.patientScheduleId
        };
        _ajax({
            type: "POST",
            url: $.config.services.schedule + "/bacPatientSchedule/delete.do",
            data:param,  //必须字符串后台才能接收list,
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            dataType: "json",
            done: function(data){
                typeof $callback === 'function' && $callback(); //返回一个回调事件
            }
        });
    });
}



