/**
 * 透前评估
 * @author Care
 * @date 2020-09-02
 * @version 1.0
 */
var diaAssessList = avalon.define({
    $id: "diaAssessList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    diaRecordId: '',//透析ｉｄ
    patientId: '',//患者ｉｄ
    painGradeShow: false,//是否显示疼痛评估表
    diaAssess: null,//透前评估信息
    punctureAndAccess: '',//导管和穿刺
    accessShow: false,//显示导管
    punctureShow: false,//显示穿刺
    cathetreRoadId: '',//导管--血管通路ID
    punctureRoadId: '',//穿刺--血管通路ID
    catheterTypeList: [],
    formReadonly: false, // 表单只读状态
    assessScoreReadOnly: true,//跌倒评估得分只读
    assessScoreDisabled: true,//跌倒评估得分是否显示
    hemorrhageSiteDisabled: true,//出血部位是否显示
    feverDegreeDisabled: true,//发热度数是否显示
    swellingSiteDisabled: true,//红肿位置是否显示
    oozingBloodSiteDisabled: true,//渗血部位是否显示
    firstStroke: "",
    secondStroke: "",
    diaBase: { // 透析治疗信息
        withCatheter: false, // 血管通路是否包含“导管类”
        withPuncture: false, // 血管通路是否包含“穿刺类”
    },
});
layui.use(['index', 'rate'], function () {
    avalon.ready(function () {
        //获取父页面保存按钮事件
        if (baseFuncInfo.authorityTag('diaAssessList#addOrEdit')) {
            if (window.parent.setSaveCallback) {
                window.parent.setSaveCallback(function () {
                    diaAssessSubmit();
                });
            }
        }
        diaAssessList.patientId = GetQueryString("patientId");
        diaAssessList.diaRecordId = GetQueryString("diaRecordId");
        diaAssessList.formReadonly = GetQueryString("readonly") == "Y" || !baseFuncInfo.authorityTag('diaAssessList#addOrEdit');
        // 初始化表单
        initFormVerify();
        initForm();
        getInfo(diaAssessList.diaRecordId);//获取透前评估信息
        avalon.scan();
    });
});


/**
 * 初始化表单验证方法
 */
function initFormVerify() {
    layui.form.verify({
        // 字段必填校验
        fieldRequired: function (value, item) {
            var target = $(item);
            var fieldName = target.attr("data-field-name") || "";
            if (isEmpty(value.trim())) {
                return fieldName + "不能为空";
            }
        },
        // 字段数值范围校验
        fieldNotInRange: function (value, item) {
            var target = $(item);
            var fieldName = target.attr("data-field-name");
            var minValue = Number(target.attr("data-min-value")) || 0;
            var maxValue = Number(target.attr("data-max-value")) || 0;
            var isInteger = target.attr("data-integer") == "true";

            if (value.trim() === "") {
                return;
            }

            // 判断输入是否是数值
            if (isInteger) {
                if (!(/^\d+$/).test(value.trim())) {
                    return fieldName + "只能填数字，且数值为整数";
                }
            } else {
                if (!(/^\d+\.?\d{0,2}$/).test(value)) {
                    return fieldName + "只能填数字，且小数不能超过两位";
                }
            }

            // 判断输入是否是有效的数值
            if (value.trim() < minValue || value.trim() > maxValue) {
                return fieldName + "只能输入" + minValue + "~" + maxValue + "的值";
            }
        }
    });
}

function initForm() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    var form = layui.form;
    var rate = layui.rate;
    //出血
    form.on('select(hemorrhage)', function (obj) {
        var hemorrhage = obj.value;
        resetHemorrhageDisabled(hemorrhage);
    });
    //发热
    form.on('select(fever)', function (obj) {
        var fever = obj.value;
        resetFeverDisabled(fever);
    });
    //红肿
    form.on('select(fistulaSwelling)', function (obj) {
        var fistulaSwelling = obj.value;
        resetFistulaSwellingDisabled(fistulaSwelling);
    });
    //渗血
    form.on('select(fistulaOozingBlood)', function (obj) {
        var fistulaOozingBlood = obj.value;
        resetFistulaOozingBloodDisabled(fistulaOozingBlood);
    });
    //控制跌倒评估隐藏与显示
    form.on('radio(fallAssess)', function (obj) {
        var fallAssessValue = obj.value;
        fallAssessDisabled(fallAssessValue);

    });

    form.render('select');

    var dictMap = getSysDictMap("ChannelType");
    var catheterType = [];
    $.each(dictMap, function (index, item) {
        if (item.dictBizCode === "1") {
            catheterType.push(item)
        }
    })
    diaAssessList.catheterTypeList = catheterType;

    $(document).on('click',"#aboutIcon", function () {
        console.log("---");
        
        var that = this;
        layer.tips('导管测量长度：' +
            '<br>第一次导管测量长度：' + diaAssessList.firstStroke + 'CM' +
            '<br>第二次导管测量长度：' + diaAssessList.secondStroke + 'CM'
            , that, {
            tips: 1
        }); //在元素的事件回调体中，follow直接赋予this即可
    });


}

/**
 * 出血启用/禁用：【出血】与【出血部位】联动
 * @param hemorrhage
 */
function resetHemorrhageDisabled(hemorrhage) {
    var isEnable = false;
    if (!diaAssessList.formReadonly) {
        // 若不是只读，还需判断【出血】的值：当【出血】非无时，才启用;
        isEnable = hemorrhage === $.constant.YesOrNo.YES;
    }
    if (!isEnable) {
        diaAssessList.hemorrhageSiteDisabled = true;
        layui.form.val("diaAssessList_form", {hemorrhageSite: ""});
    } else {
        diaAssessList.hemorrhageSiteDisabled = false;
    }

    layui.form.render('select');
}

/**
 * 发热启用/禁用：【发热】与【发热度数】联动
 * @param hemorrhage
 */
function resetFeverDisabled(feaver) {
    var isEnable = false;
    if (!diaAssessList.formReadonly) {
        // 若不是只读，还需判断【发热】的值：当【发热】非无时，才启用;
        isEnable = feaver === $.constant.YesOrNo.YES;
    }
    if (!isEnable) {
        diaAssessList.feverDegreeDisabled = true;
        layui.form.val("diaAssessList_form", {feverDegree: ""});
    } else {
        diaAssessList.feverDegreeDisabled = false;
    }
}

/**
 * 红肿启用/禁用：【红肿】与【红肿位置】联动
 * @param hemorrhage
 */
function resetFistulaSwellingDisabled(fistulaSwelling) {
    var isEnable = false;
    if (!diaAssessList.formReadonly) {
        // 若不是只读，还需判断【红肿】的值：当【红肿】非无时，才启用;
        var fistulaSwellingBizCode = getSysDictBizCode("FistulaSwelling", fistulaSwelling);
        isEnable = fistulaSwellingBizCode === $.constant.YesOrNo.YES;
    }
    if (!isEnable) {
        diaAssessList.swellingSiteDisabled = true;
        layui.form.val("diaAssessList_form", {swellingSite: ""});
    } else {
        diaAssessList.swellingSiteDisabled = false;
    }
    layui.form.render('select');
}

/**
 * 渗血启用/禁用：【渗血】与【渗血位置】联动
 * @param hemorrhage
 */
function resetFistulaOozingBloodDisabled(fistulaOozingBlood) {
    var isEnable = false;
    if (!diaAssessList.formReadonly) {
        // 若不是只读，还需判断【渗血】的值：当【渗血】非无时，才启用;
        var fistulaOozingBloodBizCode = getSysDictBizCode("FistulaOozingBlood", fistulaOozingBlood);
        isEnable = fistulaOozingBloodBizCode === $.constant.YesOrNo.YES;
    }
    if (!isEnable) {
        diaAssessList.oozingBloodSiteDisabled = true;
        layui.form.val("diaAssessList_form", {oozingBloodSite: ""});
    } else {
        diaAssessList.oozingBloodSiteDisabled = false;
    }
}

/**
 * 【跌倒评估】与【跌倒评估得分】联动
 * @param fallAssessValue
 */
function fallAssessDisabled(fallAssessValue){
    var isEnable = false;
    if (!diaAssessList.formReadonly) {
        // 若不是只读，还需判断【发热】的值：当【发热】非无时，才启用;
        isEnable = fallAssessValue === $.constant.YesOrNo.YES;
    }
    if (!isEnable) {
        diaAssessList.assessScoreDisabled = true;
        layui.form.val("diaAssessList_form", {assessScore: ""});
    } else {
        diaAssessList.assessScoreDisabled = false;
    }
}
/**
 * 获取实体
 * @param diaRecordId
 */
function getInfo(diaRecordId) {
    if (isNotEmpty(diaRecordId)) {
        //编辑
        var param = {
            "diaRecordId": diaRecordId
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/diaAssess/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                console.log("===", data);
                var isFiled = data.isFiled; // 透析记录是否已归档
                var diaAssess = data.diaAssess; // 透前评估信息
                var firstTwoTimes = data.firstTwoTimes; // 获取透前评估前两笔用来显示--本次导管测量长度前两笔
                var diaBaseInfo = data.diaBaseInfo; // 透析基本信息
                var patVascularList = data.patVascularList;//血管通路
                var withPuncture = data.withPuncture; // 血管通路是否包含“穿刺类”
                var withCatheter = data.withCatheter; // 血管通路是否包含“导管类”
                var diaFallAssess = data.diaFallAssess; // 跌倒评估得分
                var patVascularConduits = data.patVascularConduits; // 血管通路包含导管时，导管概况信息
                var patVascularPunctures = data.patVascularPunctures; // 血管通路包含导管时，导管概况信息
                var unSaved = (diaAssess == null || $.constant.YesOrNo.YES != diaAssess.saveStatus); // 透前评估未保存过
                // 1. 若“透析记录未归档 && 透前评估未保存过”，则显示当前页签红点
                if (!isFiled && unSaved) {
                    window.parent.showTabBadgeDot(true);
                } else {
                    window.parent.showTabBadgeDot(false);
                }
                // 2.1 若血管通路包含“穿刺类”，则显示穿刺评估；否则隐藏穿刺评估
                diaAssessList.diaBase.withPuncture = withPuncture; // 血管通路是否包含“穿刺类”
                if (withPuncture) {
                    diaAssessList.punctureShow = true;
                    //  （若“透析记录未归档 && 透后小结未保存过”）血管通路类型”穿刺类”,自动默认带出 穿刺信息
                    layui.form.val("diaAssessList_form", {//穿刺次数默认值为1
                        pointATimes: 1,
                        pointVTimes: 1,
                    });
                    if (!isFiled && unSaved && patVascularPunctures) {
                        layui.form.val("diaAssessList_form", {
                            punctureModeA: patVascularPunctures.arteryWay,
                            punctureModeV: patVascularPunctures.veinWay,
                            punctureTypeA: patVascularPunctures.arteryNeedleType,
                            punctureTypeV: patVascularPunctures.veinNeedleType,
                            punctureModelA: patVascularPunctures.arteryNeedleNum,
                            punctureModelV: patVascularPunctures.veinNeedleNum,

                        })
                    }

                }
                // 2.2 若血管通路包含“导管类”，则显示导管评估；否则隐藏导管评估
                diaAssessList.diaBase.withCatheter = withCatheter; // 血管通路是否包含“导管类”
                if (withCatheter) {
                    diaAssessList.accessShow = true

                    //  （若“透析记录未归档 && 透后小结未保存过”）血管通路类型”导管类”,自动默认带出  导管信息
                    if (!isFiled && unSaved && patVascularConduits) {
                        layui.form.val("diaAssessList_form", {
                            catheterArterySide: patVascularConduits.arteryStatus,
                            catheterVeinSide: patVascularConduits.veinStatus,
                            catheterOutLength: patVascularConduits.externalLength,
                        });
                    }
                }
                // 2.3 若存在血管通路，带出对应的通路类型和通路位置
                if (!isFiled) {
                    if (isNotEmpty(patVascularList)) {//血管通路
                        getPatVascularList(patVascularList);
                    }
                }
                // 2. 更新透前评估表单
                if (diaAssess) {
                    diaAssessList.diaAssess = diaAssess;
                    layui.form.val("diaAssessList_form", diaAssess);
                }
                //3.0 跌倒评估得分
                if (diaFallAssess) {
                    layui.form.val("diaAssessList_form", {
                        assessScore: diaFallAssess.assessScore
                    });
                }
                // 4.0 表单其他状态更新
                var editForm = layui.form.val("diaAssessList_form");
                // 4.1 出血启用/禁用：【出血】与【出血部位】联动
                resetHemorrhageDisabled(editForm.hemorrhage);
                // 4.2 发热启用/禁用：【发热】与【发热度数】联动
                resetFeverDisabled(editForm.fever);
                // 4.3 红肿启用/禁用：【红肿】与【红肿位置】联动
                resetFistulaSwellingDisabled(editForm.fistulaSwelling);
                // 4.4 渗血启用/禁用：【渗血】与【渗血位置】联动
                resetFistulaOozingBloodDisabled(editForm.fistulaOozingBlood);
                //4.5【跌倒评估】与【跌倒评估得分】联动
                fallAssessDisabled(editForm.fallAssess);
                // 5.0
                if (isNotEmpty(firstTwoTimes)) {
                    if(isNotEmpty(firstTwoTimes[0].catheterMeasureLength)){
                        diaAssessList.firstStroke = firstTwoTimes[0].catheterMeasureLength;
                    }
                    if(isNotEmpty(firstTwoTimes[1].catheterMeasureLength)){
                        diaAssessList.secondStroke = firstTwoTimes[1].catheterMeasureLength;
                    }

                }
                $("#openPainGradeId").mouseover(function () {
                    var targetOffset = $(this).offset();
                    $("#painGradeList").css("top", targetOffset + "px");
                    $("#painGradeList").css("right", targetOffset + "px");
                    $("#painGradeList").removeClass("layui-hide");
                });
                $("#openPainGradeId").mouseout(function () {
                    $("#painGradeList").addClass("layui-hide");
                });
            }

        });
    }
}

/**
 * 跌倒评估得分
 */
function saveOrEdit(id, $successCallback) {
    var url = "";
    var title = "";
    if (isEmpty(id)) {  //id为空,新增操作
        title = "跌倒评估";
        url = $.config.server + "/dialysis/diaFallAssessEdit?diaRecordId=" + diaAssessList.diaRecordId;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 500,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        done: function (index, iframeWin, layer) {

            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(function (data) {
                typeof $successCallback === 'function' && $successCallback(data);

                successToast("保存成功");
                layui.form.val("diaAssessList_form", {assessScore: data.assessScore});
                layer.close(index); //如果设定了yes回调，需进行手工关闭
            });
            // var ids = iframeWin.save(
            //     //成功保存之后的操作，刷新页面
            //     function success() {
            //         successToast("保存成功");
            //
            //         layer.close(index); //如果设定了yes回调，需进行手工关闭
            //     }
            // );
        }
    });
}

/**
 * 判断血管通路类型
 * @param patVascularList
 */
function getPatVascularList(patVascularList) {

    $.each(patVascularList, function (index, item) {
        var bizCode = getSysDictBizCode("ChannelType", item.vascularRoadType);
        if (bizCode === $.constant.ChannelGroup.CATHETER) {
            layui.form.val("diaAssessList_form", {
                catheterType: item.vascularRoadType, // 导管类型
                catheterLocation: item.vascularRoadPlace, // 通路位置

            });
            diaAssessList.cathetreRoadId = item.vascularRoadId;
        }
        if (bizCode === $.constant.ChannelGroup.PUNCTURE) {
            layui.form.val("diaAssessList_form", {
                fistulaPosition: item.vascularRoadPlace, // 通路位置
            });
            diaAssessList.punctureRoadId = item.vascularRoadId;
        }
    })

}


/**
 * 通路图
 */
function onDiaRoad(type) {
    var vascularRoadId = type === "1" ? diaAssessList.cathetreRoadId : diaAssessList.punctureRoadId;
    _layerOpen({
        openInParent: true,
        url: $.config.server + "/dialysis/diaVascularRoadList?patientId=" + diaAssessList.patientId + "&vascularRoadId=" + vascularRoadId,  //弹框自定义的url，会默认采取type=2
        width: 1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 800,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: '通路图', //弹框标题
        btn: [],
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success(data) {
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 表单提交
 */
function diaAssessSubmit() {
    verify_form(function (field) {
        //成功验证后
        var param = field; //表单的元素
        param.diaRecordId = diaAssessList.diaRecordId;
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/diaAssess/saveOrEdit.do",
            data: param,
            dataType: "json",
            done: function (data) {
                successToast("保存成功", 1000);
                // 刷新当前透析记录状态
                if (window.parent.onRefreshRecordOption) {
                    window.parent.onRefreshRecordOption();
                }
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });

    })
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(diaAssessList_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#diaAssessList_submit").trigger('click');
}

