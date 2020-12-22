/**
 * bacPatientPageTmplEdit.jsp的js文件，包括查询，编辑操作
 */
/*病历首页模板编辑页面
* @Author wahmh
* @Date 2020-9-14
* @Version 1.0
* */
var bacPatientPageTmplEdit = avalon.define({
    $id: "bacPatientPageTmplEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    layer: '',
    layEdit: '',//
    layEditList: [],//保存建立的layedit的返回值和对应的控制区域的ID
    currentIndex: 0,//当前的模块数,
    allCurrentIndex: 0,//当前用户添加过的模板数 一直累加 即使删掉模块
    patientPageTmplId: '',//模板id
    modelAndItemValueList: {},//模板和模块的内容
    patientId: '',//当前病人id
    patientInfo: {}//病人的信息
});
layui.use(['index', 'layedit', 'jquery', 'layer','code'], function () {
    layui.code(); //引用code方法
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var layEdit = layui.layedit
        bacPatientPageTmplEdit.layEdit = layEdit;
        bacPatientPageTmplEdit.layer = layui.layer
        layEdit.set({
            tool: [
                'html'//源码模式
                , 'undo', 'redo' //撤销重做--实验功能，不推荐使用
                , 'code', 'strong', 'italic', 'underline', 'del',
                , 'addhr' //添加水平线
                , '|', 'fontFomatt', 'fontfamily', 'fontSize',
                'colorpicker', 'fontBackColor'
                , 'face', '|', 'left', 'center', 'right', '|', 'link', 'unlink',
                , 'anchors' //锚点
                , '|', 'table'//插入表格
                , 'customlink'//插入自定义链接
                , 'fullScreen',
                'preview'//预览
            ]
            , height: 200
        })
        var patientId = GetQueryString("patientId");//获取病人id
        var patientTmplId = GetQueryString("id");  //获取模板ID
        bacPatientPageTmplEdit.patientId = patientId;
        bacPatientPageTmplEdit.patientPageTmplId = patientTmplId;
        if (isEmpty(patientTmplId)) {
            addModel();//当获取到的模板id为空时 才进行添加第一个模块 编辑模式下首次进入不需要调用此方法
        }
        //获取实体信息
        getInfo(patientTmplId, function (data) {
        });
        avalon.scan();
    });
});

/*
* 获取当前患者的信息
* @Param patientId 当前患者的ID
* @Param $callback 回调函数
* */
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
                        patientInfo['mainDiagnosis'] = diagnosisList[i].diagnoseDetailName
                    }
                    else {
                       otherDiagnosis.push( diagnosisList[i].diagnoseDetailName);
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
            patientInfo['list'] = data.list
            typeof $callback === 'function' && $callback(patientInfo); //返回一个回调事件
        }
    });
}

/*
* 主报表预览
* */
function preview() {
    //获取当前患者的信息
    getPatientInfo(bacPatientPageTmplEdit.patientId, function (data) {
        //获取当前页面的所有富文本编辑框的内容
        var tempAndItemList = bacPatientPageTmplEdit.layEditList;
        var html = "";
        for (var i = 1; i <= tempAndItemList.length; i++) {
            html += getLayEditValue(bacPatientPageTmplEdit.layEdit, i)
            html=html.replace(/｛/g,"{").replace(/｝/g,"}");
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
                'hospitalName':data.hospitalName
            }
            , function (string) {
                window.sessionStorage.setItem("previewHtml", string)
            });
        var url = $.config.server + "/patient/bacPatientPageItemEdit";
        var title = "主报表预览";
        _layerOpen({
            openInParent: true,
            btn: [],
            url: url,  //弹框自定义的url，会默认采取type=2
            width: 1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
            height: 'auto',  //弹框自定义的高度，方法会自动判断是否超过高度
            title: title, //弹框标题
            end:function(){
            //   窗口关闭清空原来缓存的数据
                window.sessionStorage.removeItem("previewHtml");
            }
        });
    });
}

/*
* 删除模块
* @Param id   富文本编辑器控制区域ID
* @Param itemId 要删除的模块ID
* */
function deleteModel(id, itemId) {
    //获取模块的id 值
    var patientPageItemId = "#" + itemId;
    var value = $(patientPageItemId).val();//获取当前要删除的模块的id值
    if (isNotEmpty(value)) {
        //    获取到的模块id不为空 要删除数据库中对应的数据
        layer.confirm('确定删除此模块吗？', function (index) {
            // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
            layer.close(index);
            //从数据库删除
            deleteModelByModelId(id, value);
        });
    } else {
        //    单纯从页面删除
        removeLayEdit(id);
    }
}

/*
* 根据controllerId 移除富文本编辑器
* @Param controllerId 富文本编辑器所在div的ID
* */
function removeLayEdit(controllerId) {
    var id = "#" + controllerId;
    $(id).remove();
    var modelNum = parseInt(bacPatientPageTmplEdit.currentIndex);
    if (modelNum > 1) {
        bacPatientPageTmplEdit.currentIndex = modelNum - 1
        //    将layeditc从数组中删除
        bacPatientPageTmplEdit.layEditList.splice(bacPatientPageTmplEdit.layEditList.indexOf(id), 1)
    }
}

/*
* 根据模块id删除模块
* @Param controllerId 富文本编辑器所在divID 控制当前富文本编辑框的id
* @Param patientPageItemId 当前模块ID 要删除的模块的Id
* */
function deleteModelByModelId(controllerId, patientPageItemId) {
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/bacPatientPageItem/delete.do",
        data: {'id': patientPageItemId},
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("模块删除成功");
            // 从当前界面移除富文本框
            removeLayEdit(controllerId);
        }
    });
}

/*
数字转换成对应的语文数字
* */
function intToChinese(str) {
    str = str + '';
    var len = str.length - 1;
    var idxs = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿'];
    var num = ['0', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    return str.replace(/([1-9]|0+)/g, function ($, $1, idx, full) {
        var pos = 0;
        if ($1[0] != '0') {
            pos = len - idx;
            if (idx == 0 && $1[0] == 1 && idxs[len - idx] == '十') {
                return idxs[len - idx];
            }
            return num[$1[0]] + idxs[len - idx];
        } else {
            var left = len - idx;
            var right = len - idx + $1.length;
            if (Math.floor(right / 4) - Math.floor(left / 4) > 0) {
                pos = left - left % 4;
            }
            if (pos) {
                return idxs[pos] + num[$1[0]];
            } else if (idx + $1.length >= len) {
                return '';
            } else {
                return num[$1[0]]
            }
        }
    });
}

/*
* 添加模块
* */
function addModel(model) {
    bacPatientPageTmplEdit.currentIndex = parseInt(bacPatientPageTmplEdit.currentIndex) + 1;//当前模块数加一
    bacPatientPageTmplEdit.allCurrentIndex = parseInt(bacPatientPageTmplEdit.allCurrentIndex) + 1;//累计添加数加一
    if (bacPatientPageTmplEdit.currentIndex >= 8) {
        bacPatientPageTmplEdit.layer.msg('最多只能添加7个模块！');
        bacPatientPageTmplEdit.currentIndex = 7;
        return;
    } else {
        //动态添加的模块整个控制器的id
        var controllerId = "controller" + bacPatientPageTmplEdit.allCurrentIndex;
        var patientPageItemId = "itemId" + bacPatientPageTmplEdit.allCurrentIndex;
        //模块名称的id 输入框的name属性
        var modelName = 'modelName' + bacPatientPageTmplEdit.allCurrentIndex;
        //添加模块 创建富文本编辑 id 富文本编辑器的name属性
        var addModelName = "addModelName" + bacPatientPageTmplEdit.allCurrentIndex;
        //模块的名称  模块 一  模块二
        var itemName = "模块" + intToChinese(bacPatientPageTmplEdit.allCurrentIndex) + "：";
        //动态添加的button的id
        var deleteIconId = 'deleteIconId' + bacPatientPageTmplEdit.allCurrentIndex;
        var html = " <div id=" + controllerId + ">\n" +
            "            <div class=\"layui-row layui-col-space1\" style=\"padding-top: 15px\">\n" +
            "                <div class=\"layui-col-sm12 layui-col-md12 layui-col-lg12\">\n" +
            "                    <div class=\"disui-form-flex\">\n" +
            "                        <label class=\"layui-form-label\"><span class=\"edit-verify-span\"\n" +
            "                                                              style=\"width: 150px\">*</span>" + itemName + "</label>\n" +
            "                        <input type=\"text\" maxlength='15' name=" + modelName + " lay-verify=\"required\"\n" +
            "                               id=" + modelName + " autocomplete=\"off\" class=\"layui-input\">\n" +
            "                          <input type=\"hidden\" name=" + patientPageItemId + " id=" + patientPageItemId + ">" +
            "                        <button class=\"layui-btn layui-btn-dismain \" style=\"margin-top: 2px\" id=" + deleteIconId + "\n" +
            "                                onclick=\"deleteModel('" + controllerId + '\',' + '\'' + patientPageItemId + '\'' + ")\"><i class=\"layui-icon layui-icon-close\"></i>\n" +
            "                        </button>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "            <div class=\"layui-col-sm12 layui-col-md12 layui-col-lg12\">\n" +
            "                <label class=\"layui-form-label\"><span class=\"edit-verify-span\"\n" +
            "                                                      style=\"width: 150px\"></span></label>\n" +
            "                <textarea class=\"layui-edit\" id=" + addModelName + " name=" + addModelName + " tabindex=-1 lay-verify=\"textAreaContent\"\n" +
            "                          style=\"width: 60%\"></textarea>\n" +
            "            </div>\n" +
            "        </div>"
        //动态添加模块
        $("#controllerAddModel").before(html);
        //给动态添加的富文本编辑器 添加校验属性
        // //    添加 必须填写属性
        var modelName = '#' + modelName;
        var addModel = '#' + addModelName;
        $(modelName).attr("lay-verify", 'required')
        $(addModel).attr("lay-verify", 'textAreaContent')//给富文本框赋值
        //判断当前是否是第一个模块 如果是隐藏右上角的删除按钮
        if (bacPatientPageTmplEdit.currentIndex === 1) {
            $("#deleteIconId1").css("display", "none");
        }
        //建立富文本编辑器
        var returnLayEdit = bacPatientPageTmplEdit.layEdit.build(addModelName);
        //将controllId重新赋值  存进数组以便于后续额删除操作
        controllerId = {
            "modelId": addModelName,
            "returnValue": returnLayEdit
        }
        if (isNotEmpty(model)) {
            //    参数不为空  数据回显时进行的动态添加模块操作
            //给模块名赋值
            $(modelName).val(model.modelName);
            //给富文本编辑框赋值
            bacPatientPageTmplEdit.layEdit.setContent(returnLayEdit, model.modelContent, false)
            //    回显的时候将当前模块的Id也一起回写进去
            var itemId = "#" + patientPageItemId;
            $(itemId).val(model.patientPageItemId)
            var tempValue = $(itemId).val();
        }
        bacPatientPageTmplEdit.layEditList.push(controllerId)//将新建立的富文本编辑器的下标和所在的div的ID存进数组
    }
}

/**
 * 获取实体
 * @param patientPageTmplId  模板id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(patientPageTmplId, $callback) {
    if (isEmpty(patientPageTmplId)) {
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    } else {
        //编辑
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/bacPatientPageTmpl/getInfo.do",
            data: {'id': patientPageTmplId},
            dataType: "json",
            done: function (data) {
                //数据回写
                $("#patientPageTmplId").val(data.patientPageTmplId)
                $("#pageName").val(data.pageName);
                for (var i = 0; i < data.modelList.length; i++) {
                    //    创建富文本编辑器 数据回显
                    addModel(data.modelList[i]);
                }
                //修改当前的模块数
                bacPatientPageTmplEdit.currentIndex = data.modelList.length;
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
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
// //校验富文本编辑框
    form.verify({
        textAreaContent: function (value, item) { //value：表单的值、item：表单的DOM对象
            // 获取富文本编辑框的id
            var itemId = item.id;
            var list = bacPatientPageTmplEdit.layEditList;
            //   查询当前要校验的富文本编辑框在数组中的位置
            var index = list.findIndex(function (item) {
                return item.modelId === itemId;
            })
            if (index >= 0 && index < list.length) {
                //    获取建立时的富文本编辑框的返回值
                var modelNameId = "#" + list[index].modelId;
                var returnValue = list[index].returnValue;
                //  获取富文本框的值
                var value = getLayEditValue(bacPatientPageTmplEdit.layEdit, returnValue);
                //    给富文本框赋值
                bacPatientPageTmplEdit.layEdit.setContent(returnValue, value, false)//false 替换 true 追加
            }
        }
    })
    form.on('submit(bacPatientPageTmplEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacPatientPageTmplEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        bacPatientPageTmplEdit.modelAndItemValueList = {'pageName': '', modelList: []};
        bacPatientPageTmplEdit.modelAndItemValueList.pageName = field.pageName;
        var modelListTemp = bacPatientPageTmplEdit.modelAndItemValueList.modelList;
        for (var i = 1; i <= bacPatientPageTmplEdit.allCurrentIndex; i++) { //此处必须使用allIndex currentIndex 代表当前的模块数量 如果用户进行了删除又添加操作将会出错
            var a = {};
            //模块内容不为空
            if (isNotEmpty(field["addModelName" + i])||isNotEmpty(field["modelName"+i])) {
                a.modelName = field["modelName" + i];
                a.modelContent = field["addModelName" + i];
            }
            if (JSON.stringify(a) !== '{}') {
                modelListTemp.push(a);
            }
        }
        bacPatientPageTmplEdit.modelAndItemValueList.modelList = modelListTemp;
        var param = bacPatientPageTmplEdit.modelAndItemValueList;
        var url;
        if (isEmpty(bacPatientPageTmplEdit.patientPageTmplId)) {
            //    新增
            url = $.config.services.dialysis + "/bacPatientPageTmpl/add.do";
        } else {
            //    编辑
            url = $.config.services.dialysis + "/bacPatientPageTmpl/edit.do";
            //    编辑模式下需要添加的模板ID
            param['patientPageTmplId'] = bacPatientPageTmplEdit.patientPageTmplId

        }
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data: JSON.stringify(param),
            contentType:"application/json;charset=utf-8",
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}


