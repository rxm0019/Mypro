/**
 * bacPatientPageTmplList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 */
//import {win} from "../../lib/avalon/src/seed/browser";
/*病历首页模板界面
* @Author wahmh
* @Date 2020-9-14
* @Version 1.0
* */
var bacPatientPageTmplList = avalon.define({
    $id: "bacPatientPageTmplList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientPageTmplId: '',//当前选中的模板id
    patientId: '',//当前病人的id
    isApplication: false//判断当前用户已经点击应用 （打印前需要）
});
layui.use(['index', 'layedit', 'layer'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        getTemplateAndModelList();  //获取数据库数据
        var id = GetQueryString("patientId");  //获取当前患者ID
        bacPatientPageTmplList.patientId = id;
        avalon.scan();
        form = layui.form;
//监听多选框点击事件  主要是通过 lay-filter="switchTest"  来监听
        form.on('checkbox(switchTest)', function (data) {
          application();
        });
    });
});

/*
* 获取患者的信息
* */
function getPatientInfo(patientId, $callback) {
    var time = 0;
    var patientInfo = {};
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.platform + "/bacDocTmpl/getPatientInfo.do",
        data: {patientId: patientId},
        dataType: "json",
        success: function (res) {
            date = new Date(res.ts);
            time = res.ts;
        },
        done: function (data) {
            //获取诊断类型
            var util = layui.util;
            patientInfo['mainDiagnosis'] = '';
            patientInfo['otherDiagnosis'] = '';
            var diagnosisList = data.pageFrontList
            if (diagnosisList.length > 0) {
                var otherDiagnosis = [];
                for (var i = 0; i < diagnosisList.length; i++) {
                    if (diagnosisList[i].diagnosisType == 1) {
                        patientInfo['mainDiagnosis']=diagnosisList[i].diagnoseDetailName;
                    }
                    else {
                        otherDiagnosis.push( diagnosisList[i].diagnoseDetailName)

                    }
                }
                patientInfo['otherDiagnosis'] = otherDiagnosis.join(",");
            }
            patientInfo['patientName'] = data.patientName
            patientInfo['gender'] = getSysDictName('Sex', data.gender);
            patientInfo['medrec'] = data.patientRecordNo;
            patientInfo['age'] = new Date(time).getFullYear() - new Date(data.birthday).getFullYear();
            patientInfo['fallage'] = data.dialysisYear;
            patientInfo['firstReceptionDate'] = isEmpty(data.firstReceptionDate) ? '' : util.toDateString(data.firstReceptionDate, "yyyy-MM-dd"), patientInfo['firstDialysisDate'] = isEmpty(data.firstDialysisDate) ? '' : util.toDateString(data.firstDialysisDate, "yyyy-MM-dd"), patientInfo['socialSecurityNo'] = data.socialSecurityNo;
            patientInfo['idCardNo'] = data.idCardNo;
            patientInfo['contactProvince'] = data.contactProvince;
            patientInfo['contactCity'] = data.contactCity;
            patientInfo['contactCountry'] = data.contactCountry;
            patientInfo['homeProvince'] = data.homeProvince;
            patientInfo['homeCity'] = data.homeCity;
            patientInfo['homeCountry'] = data.homeCountry;
            patientInfo['fixedPhone'] = data.fixedPhone;
            patientInfo['mobilePhone'] = data.mobilePhone;
            patientInfo['hospitalName'] = data.hospitalName;
            patientInfo['list'] = data.list
            typeof $callback === 'function' && $callback(patientInfo); //返回一个回调事件
        }
    });
}
/*
点击应用根据  用户选项组装表单
application
 */
function application() {
    $("#showPatientModel").empty();//先清空原来的数据
    var arr = new Array();//选中的模块的ID集合
    $("input:checkbox[name='selectForm']:checked").each(function (i) {
        arr[i] = $(this).val();
    });
    if (arr.length == 0) {
        bacPatientPageTmplList.isApplication = false;
        return;
    } else {
        bacPatientPageTmplList.isApplication = true;//设置标志位为true表明此时可以进行打印操作
        var param = {'ids': arr}
        //获取模块内容
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/bacPatientPageItem/getModelList.do",
            data: param,
            dataType: "json",
            done: function (dataContent) {
                getPatientInfo(bacPatientPageTmplList.patientId, function (data) {
                    for (var n = 0; n < dataContent.length; n++) {
                        html = dataContent[n].itemContent;
                        html = html.replace(/｛/g, "{").replace(/｝/g, "}");
                        //根据信息类型分组
                        var groupList = groupByAdjustType(data.list);
                        //处理分组后的数据
                        var groupList = dealWithList(groupList);
                        var headList = [];//头部数据
                        var middleList = [];//中部数据
                        var bottomList = [];//底部数据
                        var util = layui.util;
                        for (var i = 0; i < groupList.length; i++) {
                            //组装头部数据模板
                            if (i === 0) {
                                var head = groupList[i];
                                var dryWeight = head[0];
                                var vascularRoad = head[1];
                                var anticoagulant = head[2];
                                for (var j = 0; j < 5; j++) {
                                    var item = {
                                        "dryWeightDate": isEmpty(dryWeight[j].adjustDate) ? '' : util.toDateString(dryWeight[j].adjustDate, "yyyy-MM-dd"),
                                        "dryWeightValue": dryWeight[j].adjustValue,
                                        "roadDate": isEmpty(vascularRoad[j].adjustDate) ? '' : util.toDateString(vascularRoad[j].adjustDate, "yyyy-MM-dd"),
                                        "roadValue": vascularRoad[j].adjustValue,
                                        "anticoagulantDate": isEmpty(anticoagulant[j].adjustDate) ? '' : util.toDateString(anticoagulant[j].adjustDate, "yyyy-MM-dd"),
                                        "anticoagulantValue": anticoagulant[j].adjustValue
                                    }
                                    headList.push(item);
                                }
                            }
                            //组装中部数据模板
                            if (i === 1) {
                                var middle = groupList[1];
                                var infectious = middle[0];
                                var tumour = middle[1];
                                var allergy = middle[2];
                                for (var j = 0; j < 3; j++) {
                                    var item = {
                                        "infectiousDate": isEmpty(infectious[j].adjustDate) ? '' : util.toDateString(infectious[j].adjustDate, "yyyy-MM-dd"),
                                        "infectiousValue": infectious[j].adjustValue,
                                        "tumourDate": isEmpty(tumour[j].adjustDate) ? '' : util.toDateString(tumour[j].adjustDate, "yyyy-MM-dd"),
                                        "tumourValue": tumour[j].adjustValue,
                                        "allergyDate": isEmpty(allergy[j].adjustDate) ? '' : util.toDateString(allergy[j].adjustDate, "yyyy-MM-dd"),
                                        "allergyValue": allergy[j].adjustValue
                                    }
                                    middleList.push(item);
                                }
                            }
                            //组装尾部数据模板
                            if (i === 2) {
                                var bottom = groupList[2];
                                var dialysisFrequency = bottom[0];
                                var dialysisFrequencyMore = bottom[1];
                                var dialysisMode = bottom[2];
                                if (dialysisMode.length > 4) {
                                    for (var i = 4; i < 8; i++) {
                                        //如果治疗频率记录大于  2   频率分开两边渲染
                                        dialysisFrequencyMore[i - 4] = dialysisFrequency[i];
                                    }
                                }
                                var concentrationCa = bottom[3];
                                for (var j = 0; j < 4; j++) {
                                    var item = {
                                        "frequencyAValue": dialysisFrequency[j].adjustValue,
                                        "frequencyADate": isEmpty(dialysisFrequency[j].adjustDate) ? '' : util.toDateString(dialysisFrequency[j].adjustDate, "yyyy-MM-dd"),
                                        "frequencyBValue": dialysisFrequencyMore[j].adjustValue,
                                        "frequencyBDate": isEmpty(dialysisFrequencyMore[j].adjustDate) ? '' : util.toDateString(dialysisFrequencyMore[j].adjustDate, "yyyy-MM-dd"),
                                        "modeValue": dialysisMode[j].adjustValue,
                                        "modeDate": isEmpty(dialysisMode[j].adjustDate) ? '' : util.toDateString(dialysisMode[j].adjustDate, "yyyy-MM-dd"),
                                        "caValue": concentrationCa[j].adjustValue,
                                        "caDate": isEmpty(concentrationCa[j].adjustDate) ? '' : util.toDateString(concentrationCa[j].adjustDate, "yyyy-MM-dd"),
                                    }
                                    bottomList.push(item);
                                }
                            }
                        }
                        layui.laytpl(html).render(
                            {
                                'name': data.patientName,
                                'sex': data.gender,
                                'medrec': data.medrec,
                                'age': data.age,
                                'fallage': data.fallage,
                                'firstReceptionDate': data.firstReceptionDate,
                                'firstDialysisDate': data.firstDialysisDate,
                                'socialSecurityNo': data.socialSecurityNo,
                                'idCardNo': data.idCardNo,
                                'contactProvince': data.contactProvince,
                                'contactCity': data.contactCity,
                                'contactCountry': data.contactCountry,
                                'homeProvince': data.homeProvince,
                                'homeCity': data.homeCity,
                                'homeCountry': data.homeCountry,
                                'fixedPhone': data.fixedPhone,
                                'mobilePhone': data.mobilePhone,
                                'mainDiagnosis': data.mainDiagnosis,
                                'otherDiagnosis': data.otherDiagnosis,
                                'hospitalName': data.hospitalName,
                                'headList': headList,
                                'middleList': middleList,
                                'bottomList': bottomList
                            }
                            , function (string) {
                                $("#showPatientModel").append(string);//显示模块的内容
                            });
                    }
                });
            }
        });
    }
}

/**
 * 找出两个数组的差集
 * */

function getDifferent(rang, ids) {
    for (var i = rang.length - 1; i >= 0; i--) {
        for (var j = 0; j < ids.length; j++) {
            if (rang[i] === ids[j]) {
                rang.splice(i, 1);
                break;
            }
        }
    }
}
/**
 * 按照调整类型分组 分成三组  上中下
 * @param arr
 * @returns {Array}
 */
function groupByAdjustType(arr) {
    var rang = ['DryWeight', 'VascularRoad', 'Anticoagulant', 'Infectious', 'Tumour', 'Allergy', 'DialysisFrequency', 'DialysisFrequencyMore', 'DialysisMode', 'ConcentrationCa'];
    var result = [];
    var ids = [];
    //获取当前患者存在的项目
    for (var i = 0; i < arr.length; i++) {
        if (ids.indexOf(arr[i].adjustType) === -1) {
            ids.push(arr[i].adjustType)
        }
    }
    //根据调整类型分组
    for (var j = 0; j < ids.length; j++) {
        var temp = [];
        for (var k = 0; k < arr.length; k++) {
            if (ids[j] === arr[k].adjustType) {
                temp.push(arr[k]);
            }
        }
        //将数据 按照时间倒序
        temp.sort(function (a, b) {
            if (a.adjustDate < b.adjustDate) {
                return 1;
            } else {
                return -1;
            }
        })
        result.push(temp);
    }
    //组装数据 弄成相同的结构  保证 每个检验项目的 条数都为8 记录数不够用空填充
    for (var i = 0; i < result.length; i++) {
        var resultLength = result[i].length;
        for (var j = 0; j < 8 - resultLength; j++) {
            result[i].push({"adjustType": "", "adjustValue": "", "adjustDate": ""});
        }
    }
    var resultLength = result.length
    //获取两个数组的差集
    getDifferent(rang, ids)
    //如果患者没有检验过当前项目  将空数据组装 确保每个项目必须有值
    for (var i = 0; i < 10 - resultLength; i++) {

        var arr = new Array({"adjustType": rang[i], "adjustValue": "", "adjustDate": ""}, {
                "adjustType": "",
                "adjustValue": "",
                "adjustDate": ""
            }, {"adjustType": "", "adjustValue": "", "adjustDate": ""}, {
                "adjustType": "",
                "adjustValue": "",
                "adjustDate": ""
            }, {"adjustType": "", "adjustValue": "", "adjustDate": ""}
            , {"adjustType": "", "adjustValue": "", "adjustDate": ""}
            , {"adjustType": "", "adjustValue": "", "adjustDate": ""}
            , {"adjustType": "", "adjustValue": "", "adjustDate": ""}
        );
        result.push(arr)
    }
    return result;
}
/*
* 处理分组排序后的数据 生成结构一样的数组
* **/
function dealWithList(arr) {
    var total = [];
    var arrHead = new Array(3);
    var arrMiddle = new Array(3);
    var arrBottom = new Array(4);
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            switch (arr[i][j].adjustType) {
                case "DryWeight":
                    arrHead[0] = arr[i];
                    break;
                case "VascularRoad":
                    arrHead[1] = arr[i];
                    break;
                case "Anticoagulant":
                    arrHead[2] = arr[i];
                    break;
                case "Infectious":
                    arrMiddle[0] = arr[i];
                    break;
                case "Tumour":
                    arrMiddle[1] = arr[i];
                    break;
                case "Allergy":
                    arrMiddle[2] = arr[i];
                    break;
                case "DialysisFrequency":
                    arrBottom[0] = arr[i];
                    break;
                case "DialysisFrequencyMore":
                    arrBottom[1] = arr[i];
                    break;
                case "DialysisMode":
                    arrBottom[2] = arr[i];
                    break;
                case "ConcentrationCa":
                    arrBottom[3] = arr[i];
                    break;
            }
            break;
        }

    }
    total.push(arrHead);
    total.push(arrMiddle);
    total.push(arrBottom);
    return total;
}
/*
* 添加或编辑模板
* */
function edit(num) {
    var url = "";
    var title = "";
    if (num == 1) {  //num为1,新增操作
        title = "新增模板";
        url = $.config.server + "/patient/bacPatientPageTmplEdit?patientId=" + bacPatientPageTmplList.patientId;
    } else {  //编辑
        //判断用户是否勾选模板 并且只能选择一个模板
        var table = layui.table; //获取layui的table模块
        var checkStatus = table.checkStatus('bacPatientPage_Tmpl'); //test即为基础参数id对应的值
        var data = checkStatus.data; //获取选中行的数据
        if (data.length == 0) {
            warningToast("请选择一条记录");
            return false;
        } else if (data.length > 1) {
            warningToast("只能选中一个模板进行编辑");
            return false;
        } else {
            var patientPageTmplId = data[0].patientPageTmplId;
            title = "编辑模板";
            url = $.config.server + "/patient/bacPatientPageTmplEdit?id=" + patientPageTmplId + "&patientId=" + bacPatientPageTmplList.patientId;
        }
    }
    _layerOpen({
        openInParent: true,
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 'auto',  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    var table = layui.table; //获取layui的table模块
                    table.reload('bacPatientPage_Tmpl'); //重新刷新table
                    successToast("保存成功");
                    var form = layui.form; //获取layui的form模块
                    form.render('checkbox'); //重新刷新from
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/*
* 动态添加 模板的复选框 或者模块
* */
function addModelDiv(html, flag) {
    switch (flag) {
        case 1:
            $("#addModelDiv").append(html)
            break;
        case 2:
            //添加选择标签
            $("#modelSelect").append(html)
            break;
    }
}

/**
 /**
 * 查询列表事件
 */
function getTemplateAndModelList() {
    var table = layui.table
    _layuiTable({
        elem: '#bacPatientPage_Tmpl', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'bacPatientPage_Tmpl', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'auto', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/bacPatientPageTmpl/list.do", // ajax的url必须加上getRootPath()方法
            page: false,
            // where:{'patientId':patPageFrontList.patientId,'adjustType':'ConcentrationCa'}, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}, //开启编辑框
                {field: 'pageName', title: '名称', event: 'getInfo', style: 'cursor: pointer;'}
            ]], done: function (data) {
                              //表格加载完成后，默认选中第一行
                $('.layui-table-view[lay-id="bacPatientPage_Tmpl"]').children('.layui-table-box').children('.layui-table-body').find('table tbody tr[data-index="0"] td[lay-event="getInfo"]').click();
            }
        }
    });
    //监听行单元格事件
    table.on('tool(bacPatientPage_Tmpl)', function (obj) {
        var data = obj.data;
        if (obj.event === 'getInfo') {
            //每次点击先清空原来添加的标签
            $("#modelSelect").empty()
            //清空原来显示的模板内容
            $("#showPatientModel").empty();
            //    obj参数为当前行的数据
            //获取当前行选中的模板的ID
            var templateId = obj.data.patientPageTmplId;
            bacPatientPageTmplList.patientPageTmplId = templateId;
            var param = {'id': templateId}
            _ajax({
                type: "POST",
                //loading:true,  //是否ajax启用等待旋转框，默认是true
                url: $.config.services.dialysis + "/bacPatientPageItem/list.do",
                data: param,
                dataType: "json",
                done: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        //默认全选
                        var html = " <input type=\"checkbox\" lay-filter=\"switchTest\" checked name=\"selectForm\" title=\"" + data[i].itemName + "\" value=\"" + data[i].patientPageItemId + "\" >"
                        addModelDiv(html, 2);
                    }
                    var form = layui.form; //获取layui的form模块
                    form.render('checkbox'); //重新刷新from
                    application();
                }
            });
        }
    });
}

/*
* 模板打印
* */
function printModel() {
    //先判断打印标志位
    if (!bacPatientPageTmplList.isApplication) {
        warningToast("请先应用一个模块后再打印");
        return false;
    }
    var newstr = $("#showPatientModel").html();
    var modelKey = guid();
    sessionStorage.setItem(modelKey, newstr);
    _layerOpen({
        btn: ['打印', '取消'],
        openInParent: true,
        url: url = $.config.server + "/patient/bacPatientPageTmplPrintModel?modelKey=" + modelKey,
        width: 1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 794,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: '模板打印', //弹框标题
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.printModel();
        }
    });
}

/**
 * 批量删除事件
 * @param ids
 */
function del(ids) {
    var param = {
        "ids": ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/bacPatientPageTmpl/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('bacPatientPage_Tmpl'); //重新刷新table
            //清空原来的预览界面
            $("#showPatientModel").empty()
            //    清空标签
            $("#modelSelect").empty()

        }
    });
}

/**
 * 批量删除
 */
function batchDel() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('bacPatientPage_Tmpl'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    }
    var ids = [];
    $.each(data, function (i, item) {
        ids.push(item.patientPageTmplId);
    })
    layer.confirm('模块和模板的内容将会被一起删除，是否删除？', function (index) {
        // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
        layer.close(index);
        //删除
        del(ids);
    });
}

