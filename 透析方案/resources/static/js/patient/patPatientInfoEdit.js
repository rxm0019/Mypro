/**
 * patPatientInfoEdit.jsp的js文件，包括查询，编辑操作
 * 病历首页-基本信息编辑页面
 * @Author swn
 * @version: 1.0
 * @Date 2020/8/12
 */
var uploadImgObj;
var patPatientInfoEdit = avalon.define({
    $id: "patPatientInfoEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patPatientInfo: [],//患者基本信息
    patPatientTagLists: [], //患者标签
    deletePatientTags: [], //删除的患者标签列表
    patFamilyMemberLists: [], //患者家庭情况
    deleteFamilyMembers: [], //患者家庭情况
    patPastDialysisLists: [], //患者过去透析史
    deletePastDialysis: [], //删除的过去透析史列表
    firstDiagnosisDoctors: [], //出诊医生下拉列表
    principalNurses: [], //主责护士下拉列表
    deleteFileIds: [], // 删除的文件ID列表
    withDeleteFile: true,
    hasPhotoImage: false,
    insuranceTypes: [],
    serverTime: new Date(),
    provinces: [],
    contactCitys: [],
    contactCountys: [],
    homeCitys: [],
    homeCountys: []
});

layui.use(['index', 'inputTags', 'table', 'formSelects'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    var table = layui.table;
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate = layui.laydate;
        laydate.render({
            elem: '#birthday'
            , type: 'date'
            ,max:layui.util.toDateString(new Date(),'yyyy-MM-dd')
            , done: function (value, date) {//value, date, endDate点击日期、清空、现在、确定均会触发。回调返回三个参数，分别代表：生成的值、日期时间对象、结束的日期时间对象
                if (isNotEmpty(value)) {
                    patPatientInfoEdit.patPatientInfo.age = getUserAge(patPatientInfoEdit.serverTime, value);
                    $('#age').val(patPatientInfoEdit.patPatientInfo.age);
                }
            }
        });
        laydate.render({
            elem: '#firstReceptionDate'
            , type: 'date'
        });
        laydate.render({
            elem: '#firstDialysisDate'
            , type: 'date'
        });
        laydate.render({
            elem: '#createTime'
            , type: 'date'
        });
        laydate.render({
            elem: '#updateTime'
            , type: 'date'
        });
        var id = GetQueryString("id");  //接收变量
        //获取实体信息
        getInfo(id, function (data) {
            if (isEmpty(id)) {
                layui.form.val('patPatientInfoEdit_form', {
                    "hospitalName": baseFuncInfo.userInfoData.loginHospitalName
                });
                layui.form.render();
            } else {
                /*医保类型复选下拉框*/
                var insuranceTypes = data.insuranceTypes;
                if (isNotEmpty(insuranceTypes)) {
                    patPatientInfoEdit.insuranceTypes = insuranceTypes.split(",");
                    var formSelects = layui.formSelects; //调用layui的form模块
                    //以下方式则重新渲染所有的已存在多选
                    var arr = baseFuncInfo.getSysDictByCode('InsuranceType');
                    formSelects.data('insuranceTypes', 'local', {
                        arr: arr
                    });
                    formSelects.value('insuranceTypes', patPatientInfoEdit.insuranceTypes);//要选中的值，
                }
            }

            // 在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            // 获取出诊医生列表
            getDoctorRoleList();
            // 获取主责护士列表
            getNurseRoleList();
            //获取区域
            getArea();
            //初始化上传组件
            initUpload(patPatientInfoEdit.photoImages);
        });
        var form = layui.form;
        form.verify({
            IdCodeValids: function (value, item) {
                var idCardType = $('#idCardType').val();
                debugger
                if(value.length>20)
                {
                    return '证件号码长度不能超过20个字符'
                }
                if (idCardType === $.constant.IdCardType.IdCard) {
                    var reg = /(^\d{15}$)|(^\d{17}(x|X|\d)$)/;
                    if (!reg.test(value)) {
                        return "请输入正确的身份证号";
                    }
                }
                if (idCardType === $.constant.IdCardType.Passport) {
                    var reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,23}$/
                    if (!reg.test(value)) {
                        return "请输入正确的护照";
                    }
                }
                if (idCardType === $.constant.IdCardType.ArmyCard) {
                    var reg =  /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/;
                    if (!reg.test(value)) {
                        return "请输入正确军官证";
                    }
                }
                if (idCardType === $.constant.IdCardType.Other) {
                    var reg = /^[a-zA-Z0-9]{15,20}$/
                    if (!reg.test(value)) {
                        return "请输入正确的证件号码";
                    }
                }
            },
            confirmPatientFilesNo:function(value,item){
               if(isNotEmpty(value))
               {
                   var reg =  /^[a-zA-Z-Za-z0-9\-\_]*$/;
                   if (!reg.test(value)) {
                       return "请输入正确的病历编号";
                   }
               }
            },
            confirmSocialSecurityNo:function(value,item){
                var reg = /^[a-zA-Z0-9]{15,20}$/
                if (!reg.test(value)) {
                    return "请输入正确的社保号";
                }
            },
            stature: function (value, item) {
                var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
                if (isNotEmpty(value) && (!reg.test(value) || (value <= 0 || value > 300))) {
                    return "身高取值范围(0,300],可输入两位小数";
                }
            },
            number: function (value, item) {
                var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
                if (value != null && value !== '' && !reg.test(value)) {
                    return "只能填写数字";
                }
            },
            weight: function (value, item) {
                var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
                if (isNotEmpty(value) && (!reg.test(value) || (value <= 0 || value > 200))) {
                    return "体重取值范围(0,200],可输入两位小数";
                }
            }
        })
        avalon.scan();
    });
    layui.form.on('select(contactProvince)', function (obj) { // 选择了省加载市
        funLoadArea(obj.value, function (data) {
            patPatientInfoEdit.contactCitys = data;
            layui.form.render('select');
        })
    });
    layui.form.on('select(contactCity)', function (obj) {// 选择了市加载县/区
        funLoadArea(obj.value, function (data) {
            patPatientInfoEdit.contactCountys = data;
            layui.form.render('select');
        })
    });
    layui.form.on('select(homeProvince)', function (obj) { // 选择了省加载市
        funLoadArea(obj.value, function (data) {
            patPatientInfoEdit.homeCitys = data;
            layui.form.render('select');
        })

    });
    layui.form.on('select(homeCity)', function (obj) {// 选择了市加载县/区
        funLoadArea(obj.value, function (data) {
            patPatientInfoEdit.homeCountys = data;
            layui.form.render('select');
        })
    });
    layui.form.on('select(idCardType)', function (obj) { // 证件类型
        if (obj.value === '1' && isNotEmpty($("#idCardNo").val())) {
            var idCardNo = $("#idCardNo").val();
            if (IdCodeValid(idCardNo)) {
                patPatientInfoEdit.patPatientInfo.birthday = IdCard(idCardNo, 1)
                patPatientInfoEdit.patPatientInfo.gender = IdCard(idCardNo, 2)
                patPatientInfoEdit.patPatientInfo.age = IdCard(idCardNo, 3)
                $('#birthday').val(patPatientInfoEdit.patPatientInfo.birthday)
                $("input[name='gender'][value= " + patPatientInfoEdit.patPatientInfo.gender + "]").prop('checked', true);
                $('#age').val(patPatientInfoEdit.patPatientInfo.age);
                var form = layui.form;
                form.render();
            }
        }
    });
    // 监听文本框事件，判断身份编码是否存在
    $("#idCardNo").blur(function () {
        var checkValue = this.value;
        var idCardType = $('#idCardType').val();
        if (idCardType === '1') {
            if (IdCodeValid(checkValue)) {
                patPatientInfoEdit.patPatientInfo.birthday = IdCard(checkValue, 1)
                patPatientInfoEdit.patPatientInfo.gender = IdCard(checkValue, 2)
                patPatientInfoEdit.patPatientInfo.age = IdCard(checkValue, 3)
                $('#birthday').val(patPatientInfoEdit.patPatientInfo.birthday)
                $("input[name='gender'][value= " + patPatientInfoEdit.patPatientInfo.gender + "]").prop('checked', true);
                $('#age').val(patPatientInfoEdit.patPatientInfo.age)
                var form = layui.form;
                form.render();
            }
        } else if (isEmpty(idCardType)) {
            var msg = "请选择证件类型";
            layer.msg(msg, {
                icon: 2
                , shade: 0.01
                , time: 1000
            });
        }
    });
});
layui.use(['dropdown'], function () {
    var dropdown = layui.dropdown;
    var layer = layui.layer;
    // ====================================================================================
    dropdown.suite("[lay-filter='test8']", {
        template: "#mymenu",
        success: function ($dom) {
        }
    });
})

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(id, $callback) {
    if (isEmpty(id)) {
        getPatFamilyMemberList([]);  //查询家庭情况列表
        getPatPastDialysisList([]); //查询过去透析史
        typeof $callback === 'function' && $callback(); //返回一个回调事件
    } else {
        //编辑
        var param = {
            "patientId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patPatientInfo/getInfo.do",
            data: param,
            dataType: "json",
            success: function (res) {
                patPatientInfoEdit.serverTime = new Date(res.ts);
            },
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util = layui.util;
                data.birthday = util.toDateString(data.birthday, "yyyy-MM-dd");
                data.firstReceptionDate = util.toDateString(data.firstReceptionDate, "yyyy-MM-dd");
                data.firstDialysisDate = util.toDateString(data.firstDialysisDate, "yyyy-MM-dd");
                data.createTime = util.toDateString(data.createTime, "yyyy-MM-dd");
                data.updateTime = util.toDateString(data.updateTime, "yyyy-MM-dd");
                data.age = getUserAge(patPatientInfoEdit.serverTime, data.birthday);
                data.patientTagList = data.patientTags.split(",");
                data.fixedPhoneFront = data.fixedPhone.split("-")[0];
                data.fixedPhoneLast = data.fixedPhone.split("-")[1];
                //标签赋值
                var patPatientTagList = [];
                $.each(data.patPatientTagLists, function (index, item) {
                    item.tagColors = getSysDictBizCode("PatientTagsColor", item.tagColor);
                    // patPatientTagList.push(item.tagContent);
                    patPatientTagList.push(item);
                })
                var inputTags = layui.inputTags;
                inputTags.render({
                    elem: '#inputTags',//定义输入框input对象
                    content: patPatientTagList,//默认标签
                    aldaBtn: false,//是否开启获取所有数据的按钮
                    done: function (value) { //回车后的回调
                        console.log(value)
                    }
                })

                patPatientInfoEdit.patPatientTagLists = data.patPatientTagLists;
                patPatientInfoEdit.patFamilyMemberLists = data.patFamilyMemberLists;
                patPatientInfoEdit.patPastDialysisLists = data.patPastDialysisLists;

                getPatFamilyMemberList(data.patFamilyMemberLists);  //查询家庭情况列表
                getPatPastDialysisList(data.patPastDialysisLists); //查询过去透析史
                patPatientInfoEdit.patPatientInfo = data;
                patPatientInfoEdit.photoImages = data.photoImages;
                if (data.photoImages != null && data.photoImages.length > 0) {
                    patPatientInfoEdit.hasPhotoImage = true;
                }
                form.val('patPatientInfoEdit_form', data);
                /*感染状况*/
                var arr = data.infectionStatus.split(",");
                $.each(arr, function (i) {
                    $("input:checkbox[name='infectionStatusS']").each(function () {
                        var val = $(this).val();
                        if (val === arr[i]) {
                            $(this).prop("checked", true);
                        }
                    });
                });
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

/**
 * 查询家庭情况列表
 */
function getPatFamilyMemberList(patFamilyMemberLists) {
    var param = {};
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#patFamilyMemberList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patFamilyMemberList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-180', //table的高度，页面最大高度减去差值
            data: patFamilyMemberLists,
            page: false,
            cols: [[ //表头
                {type: 'numbers', title: '序号'}  //序号
                , {
                    field: 'familyMemberName', title: '*家属姓名', sortField: 'pfm_.family_member_name'
                    , templet: function (d) {
                        var html = '<input type="text" name="familyMemberName" lay-verify="required" maxlength="20" value="' + d.familyMemberName + '" autocomplete="off" class="layui-input" style="width:100%;height: 30px">'
                        return html;
                    }
                }
                , {
                    field: 'mobilePhone', title: '*家属手机', sortField: 'pfm_.mobile_phone'
                    , templet: function (d) {
                        var html = '<input type="text" name="fMobilePhone" lay-verify="required|phone" maxlength="11" value="' + d.mobilePhone + '" autocomplete="off" class="layui-input" style="width:100%;height: 30px">'
                        return html;
                    }
                }
                , {
                    field: 'relationship', title: '关系', sortField: 'pfm_.relationship'
                    , templet: function (d) {
                        var html = '<input type="text" name="relationship" value="' + d.relationship + '" maxlength="20" autocomplete="off" class="layui-input" style="width:100%;height: 30px">'
                        return html;
                    }
                }
                , {
                    field: 'birthday', title: '生日', sortField: 'pfm_.birthday'
                    , templet: function (d) {
                        var birthday = util.toDateString(d.birthday, "yyyy-MM-dd");
                        var html = '<input type="text" name="foBirthday" lay-verify="required" class="dialysis_birthday layui-input" value="' + birthday + '"  id="birthday" placeholder="yyyy-MM-dd" autocomplete="off" style="height: 30px" >'
                        return html;
                    }
                }
                , {
                    field: 'incomeStatus', title: '收入', sortField: 'pfm_.incomeStatus'
                    , templet: function (d) {
                        var html = '<input type="text" name="foIncomeStatus" value="' + d.incomeStatus + '" maxlength="15" autocomplete="off" class="layui-input" style="width:100%;height: 30px">'
                        return html;
                    }
                }
                , {
                    field: 'occupation', title: '职业', sortField: 'pfm_.occupation'
                    , templet: function (d) {
                        var html = '<input type="text" name="foOccupation" value="' + d.occupation + '" maxlength="30" autocomplete="off" class="layui-input" style="width:100%;height: 30px">'
                        return html;
                    }
                }
                , {
                    field: 'remarks', title: '备注', sortField: 'pfm_.occupation'
                    , templet: function (d) {
                        var html = '<input type="text" name="remarks" value="' + d.remarks + '" maxlength="2000" autocomplete="off" class="layui-input" style="width:100%;height: 30px">'
                        return html;
                    }
                }
                , {
                    fixed: 'right', title: '操作', align: 'center'
                    , toolbar: '#patFamilyMemberList_bar'
                }
            ]],
            done: function (res, curr, count) {
                //家属姓名
                $("input[name='familyMemberName']").on("input", function (obj) {
                    var index = $(this).parents('tr').attr('data-index');
                    patPatientInfoEdit.patFamilyMemberLists[index].familyMemberName = obj.delegateTarget.value;
                })
                //家属手机
                $("input[name='fMobilePhone']").on("input", function (obj) {
                    var index = $(this).parents('tr').attr('data-index');
                    patPatientInfoEdit.patFamilyMemberLists[index].mobilePhone = obj.delegateTarget.value;
                })
                //关系
                $("input[name='relationship']").on("input", function (obj) {
                    var index = $(this).parents('tr').attr('data-index');
                    patPatientInfoEdit.patFamilyMemberLists[index].relationship = obj.delegateTarget.value;
                })
                //收入
                $("input[name='foIncomeStatus']").on("input", function (obj) {
                    var index = $(this).parents('tr').attr('data-index');
                    patPatientInfoEdit.patFamilyMemberLists[index].incomeStatus = obj.delegateTarget.value;
                })
                //备注
                $("input[name='remarks']").on("input", function (obj) {
                    var index = $(this).parents('tr').attr('data-index');
                    patPatientInfoEdit.patFamilyMemberLists[index].remarks = obj.delegateTarget.value;
                })
                //职业
                $("input[name='foOccupation']").on("input", function (obj) {
                    var index = $(this).parents('tr').attr('data-index');
                    patPatientInfoEdit.patFamilyMemberLists[index].occupation = obj.delegateTarget.value;
                })
                //初始透析日期
                $(".dialysis_birthday").each(function (i) {
                    if (isEmpty(res.bizData[i].birthday)) {
                        patPatientInfoEdit.patFamilyMemberLists[i].birthday = util.toDateString(new Date(), "yyyy-MM-dd");
                    }
                    layui.laydate.render({
                        elem: this,
                        format: "yyyy-MM-dd",
                        done: function (value, date) {
                            if (res && res.bizData[i]) {
                                $.extend(res.bizData[i], {'birthday': value})
                                patPatientInfoEdit.patFamilyMemberLists[i].birthday = value;
                            }
                        }
                    });
                });
            }
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'edit') { //编辑
                //do something
                if (isNotEmpty(data.familyMemberId)) {
                    saveOrEdit(data.familyMemberId);
                }
            } else if (layEvent === 'del') { //删除
                var trIndex = $("[lay-id='patFamilyMemberList_table']").find(tr.selector).attr("data-index");
                layer.confirm('确认删除所选记录吗？', function (index) {
                    debugger
                    if (isNotEmpty(obj.data.familyMemberId)) {
                        patPatientInfoEdit.deleteFamilyMembers.push(obj.data);
                    }
                    patPatientInfoEdit.patFamilyMemberLists.splice(trIndex, 1)
                    table.reload("patFamilyMemberList_table", {
                        data: patPatientInfoEdit.patFamilyMemberLists   // 将新数据重新载入表格
                    })
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.familyMemberId)) {
                        var ids = [];
                        ids.push(data.familyMemberId);
                        //delPatFamilyMember(ids);
                    }
                });
            }
        }
    });
}

/**
 * 查询过去透析史
 */
function getPatPastDialysisList(patPastDialysisLists) {
    var param = {};
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#patPastDialysisList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patPastDialysisList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-200', //table的高度，页面最大高度减去差值
            data: patPastDialysisLists,
            page: false,
            cols: [[ //表头
                // {fixed: 'left',type:'checkbox'},  //开启编辑框
                {type: 'numbers', title: '序号'}  //序号
                , {
                    field: 'dialysisType', title: '*透析类型', sortField: 'ppd_.dialysisType'
                    , templet: function (d) {
                        var lists = baseFuncInfo.getSysDictByCode("DialysisType");
                        var html = '<select class="dialysis_type_class"  lay-verify="required" name="dialysisTypePast" lay-filter="dialysisTypeSelect" >' +
                            ' <option value="">请选择透析类型</option>'
                        $.each(lists, function (index, item) {
                            html += '<option value=' + item.value + '>' + item.name + '</option>'
                        })
                        html += '</select>';
                        return html;
                    }
                }
                , {
                    field: 'dialysisDateStart', title: '*初始透析日期', width: 400, sortField: 'ppd_.dialysisDateStart'
                    , templet: function (d) {
                        var dialysisDateStart = util.toDateString(d.dialysisDateStart, "yyyy-MM-dd");
                        var dialysisDateEnd = util.toDateString(d.dialysisDateEnd, "yyyy-MM-dd");
                        var html = '<input type="text" name="dialysisDateStart" lay-verify="required" class="dialysis_date_start layui-input" value="' + dialysisDateStart + '"  id="birthday" placeholder="yyyy-MM-dd" autocomplete="off" style="width:45%;height: 30px;float:left">' +
                            '<span style="float: left;width: 10%;text-align: center">至</span>' +
                            '<input type="text" name="dialysisDateEnd" lay-verify="required" class="dialysis_date_end layui-input" value="' + dialysisDateEnd + '" id="birthday" placeholder="yyyy-MM-dd" autocomplete="off" style="width:45%;height: 30px;float:left"">'
                        return html;
                    }
                }
                , {
                    field: 'dialysisHospital', title: '*初始透析医院', sortField: 'ppd_.dialysisHospital'
                    , templet: function (d) {
                        var html = '<input type="text" name="dialysisHospital" lay-verify="required"  value="' + d.dialysisHospital + '" autocomplete="off" class="layui-input"  maxlength="20" style="width:100%;height: 30px">'
                        return html;
                    }
                }
                , {
                    fixed: 'right', title: '操作', align: 'center'
                    , toolbar: '#patPastDialysisList_bar'
                }
            ]],
            done: function (res, curr, count) {
                //由于layui 设置了超出隐藏，所以这里改变下，以兼容操作按钮的下拉菜单
                $(".layui-table-body, .layui-table-box, .layui-table-cell").css('overflow', 'visible');
                //透析类型赋值
                var form = layui.form;
                layui.each($("select[name='dialysisTypePast']"), function (index, item) {
                    var elem = $(item);
                    elem.val(patPatientInfoEdit.patPastDialysisLists[index].dialysisType);
                });
                //透析类型监听值变化
                form.on('select(dialysisTypeSelect)', function (obj) {
                    var elem = $(obj.elem);
                    var trElem = elem.parents('tr');
                    patPatientInfoEdit.patPastDialysisLists[trElem.data('index')].dialysisType = obj.value;
                    form.render('select');
                })
                //初始透析医院监听值变化
                $("input[name='dialysisHospital']").on("input", function (obj) {
                    var index = $(this).parents('tr').attr('data-index');
                    patPatientInfoEdit.patPastDialysisLists[index].dialysisHospital = obj.delegateTarget.value;
                })
                form.render('select');
                //初始透析日期
                $(".dialysis_date_start").each(function (i) {
                    if (isEmpty(res.bizData[i].dialysisDateStart)) {
                        patPatientInfoEdit.patPastDialysisLists[i].dialysisDateStart = util.toDateString(new Date(), "yyyy-MM-dd");
                    }
                    layui.laydate.render({
                        elem: this,
                        format: "yyyy-MM-dd",
                        done: function (value, date) {
                            if (res && res.bizData[i]) {
                                $.extend(res.bizData[i], {'dialysisDateStart': value})
                                patPatientInfoEdit.patPastDialysisLists[i].dialysisDateStart = value;
                            }
                        }
                    });
                });
                $(".dialysis_date_end").each(function (i) {
                    if (isEmpty(res.bizData[i].dialysisDateEnd)) {
                        patPatientInfoEdit.patPastDialysisLists[i].dialysisDateEnd = util.toDateString(new Date(), "yyyy-MM-dd");
                    }
                    layui.laydate.render({
                        elem: this,
                        format: "yyyy-MM-dd",
                        done: function (value, date) {
                            if (res && res.bizData[i]) {
                                $.extend(res.bizData[i], {'dialysisDateEnd': value})
                                patPatientInfoEdit.patPastDialysisLists[i].dialysisDateEnd = value;
                            }
                        }
                    });
                });
            },
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'edit') { //编辑
                //do something
                if (isNotEmpty(data.familyMemberId)) {
                    saveOrEdit(data.familyMemberId);
                }
            } else if (layEvent === 'del') { //删除
                var trIndex = $("[lay-id='patPastDialysisList_table']").find(tr.selector).attr("data-index");
                layer.confirm('确认删除所选记录吗？', function (index) {
                    if (isNotEmpty(obj.data.pastDialysisId)) {
                        patPatientInfoEdit.deletePastDialysis.push(obj.data);
                    }
                    patPatientInfoEdit.patPastDialysisLists.splice(trIndex, 1);
                    table.reload("patPastDialysisList_table", {
                        data: patPatientInfoEdit.patPastDialysisLists   // 将新数据重新载入表格
                    })
                    //obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.pastDialysisId)) {
                        var ids = [];
                        ids.push(data.pastDialysisId);
                        //delPatFamilyMember(ids);
                    }
                });
            }
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
    form.on('submit(patPatientInfoEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#patPatientInfoEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback, type) {  //菜单保存操作
    var url = "";
    if (type == 1) {  //id为空,新增操作
        url = "/patPatientInfo/saveInfo.do";
    } else {  //编辑
        url = "/patPatientInfo/editInfo.do";
    }
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        // 获取感染状况选中的值
        var infectionStatusList = [];
        $('input[name=infectionStatusS]:checked').each(function () {
            infectionStatusList.push($(this).val());
        });
        field.infectionStatus = infectionStatusList.join(",");
        //标签
        field.patPatientTagLists = patPatientInfoEdit.patPatientTagLists;
        //固定电话
        field.fixedPhone = field.fixedPhoneFront + '-' + field.fixedPhoneLast;
        //家庭情况
        field.patFamilyMemberLists = patPatientInfoEdit.patFamilyMemberLists;
        //过去透析史
        field.patPastDialysisLists = patPatientInfoEdit.patPastDialysisLists;
        // 删除的患者标签列表
        field.deletePatientTags = patPatientInfoEdit.deletePatientTags;
        // 删除的患者家庭情况列表
        field.deleteFamilyMembers = patPatientInfoEdit.deleteFamilyMembers;
        // 删除的患者获取透析史列表
        field.deletePastDialysis = patPatientInfoEdit.deletePastDialysis;
        var param = field; //表单的元素
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + url,
            // data:param,
            // dataType: "json",
            contentType: "application/json; charset=utf-8", //此设置后台可接受复杂参数，后台接收需要@RequestBody标签
            data: JSON.stringify(param), //此设置后台可接受复杂参数

            done: function (data) {
                //返回的主键不为空  则把上传图片记录入库
                var saveSuccess = true;
                if (isNotEmpty(data.patientId)) {
                    saveSuccess = uploadImgRecord(data.patientId);
                }
                if (saveSuccess) {
                    typeof $callback === 'function' && $callback(data); //返回一个回调事件
                }
                // typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}

/**
 * 图片上传记录入库
 */
function uploadImgRecord(id) {
    // 获取待添加的文件列表
    var addFiles = [];
    var itemsData = uploadImgObj.config.getItemsData();
    $.each(itemsData, function (index, item) {
        if (isEmpty(item.fileId)) {
            addFiles.push(item);
        }
    });

    var saveSuccess = false;
    var param = {
        objectId: id,
        addFiles: addFiles,
        deleteFileIds: patPatientInfoEdit.deleteFileIds
    };

    if (addFiles.length == 0 && patPatientInfoEdit.deleteFileIds.length == 0) {  //没有上传和删除文件
        return true;
    }

    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + '/patPatientInfo/saveImage.do',
        data: JSON.stringify(param),
        dataType: "json",
        contentType: "application/json; charset=utf-8", //此设置后台可接受复杂参数，后台接收需要@RequestBody标签
        async: false,
        done: function (data) {
            saveSuccess = true;
            //返回的主键不为空  则把上传图片记录入库
        }
    });
    return saveSuccess;
}

function uploadClick() {
    $('#uploadImg').click();
}

//图片上传
function initUpload(fileDatas) {
    fileDatas = fileDatas || [];
    uploadImgObj = _layuiUploadImg({
        elem: '#uploadImg'
        , url: $.config.services.dialysis + '/patPatientInfo/uploadImage.do'
        , accept: 'images'
        , method: 'post'
        , multiple: true
        , number: 1
        , acceptMime: 'image/*'
        , done: function (res) {
            //...上传成功后的事件
            patPatientInfoEdit.hasPhotoImage = true;
            patPatientInfoEdit.patPatientInfo.patientPhoto = res.bizData.filePath;
            $('#patientPhoto').val(res.bizData.filePath);
        }
        , showFileDiv: "#showImgDiv"
        , fileDatas: fileDatas
        , withDelete: patPatientInfoEdit.withDeleteFile
        , deleteItemCallack: function (deleteItemData, deleteItemObj) {
            if (isEmpty(deleteItemData.fileId) && isNotEmpty(deleteItemData.filePath)) {
                // 未保存文件记录的文件直接删除
                patPatientInfoEdit.hasPhotoImage = false;
                patPatientInfoEdit.patPatientInfo.patientPhoto = "";
                $('#patientPhoto').val("");
                var deleteSuccess = baseFuncInfo.onDeleteTempFile(deleteItemData.filePath);
                if (deleteSuccess) {
                    deleteItemObj.remove();
                }
            } else {
                // 已保存记录的文件先记录删除文件记录ID，保存是进行逻辑删除
                patPatientInfoEdit.patPatientInfo.patientPhoto = "";
                $('#patientPhoto').val("");
                patPatientInfoEdit.deleteFileIds.push(deleteItemData.fileId);
                deleteItemObj.remove();
            }
            patPatientInfoEdit.hasPhotoImage = false;
        }
    });
}

/**
 * 添加家庭成员一行数据
 */
function addFamilyMember() {
    var dataBak = patPatientInfoEdit.patFamilyMemberLists;
    if (dataBak.length > 0) {
        var len = dataBak.length - 1;
        if (dataBak[len].familyMemberName == '' || dataBak[len].mobilePhone == '') {
            errorToast("请先补充完整上一笔数据的必填项", 1000);
            return false;
        }
    }
    patPatientInfoEdit.patFamilyMemberLists.push({
        "familyMemberName": ""
        , "mobilePhone": ""
        , "relationship": ""
        , "birthday": ""
        , "incomeStatus": ""
        , "occupation": ""
        , "remarks": ""
    });
    var table = layui.table;
    table.reload("patFamilyMemberList_table", {
        data: patPatientInfoEdit.patFamilyMemberLists   // 将新数据重新载入表格
    })
}

/**
 * 添加过去透析史一行数据
 */
function addPatPastDialysis() {
    var dataBak = patPatientInfoEdit.patPastDialysisLists;
    if (dataBak.length > 0) {
        var len = dataBak.length - 1;
        if (dataBak[len].dialysisType == '' || dataBak[len].dialysisDateStart == '' || dataBak[len].dialysisDateEnd == '') {
            errorToast("请先补充完整上一笔数据的必填项", 1000);
            return false;
        }
    }
    patPatientInfoEdit.patPastDialysisLists.push({
        "dialysisType": ""
        , "dialysisDateStart": ""
        , "dialysisDateEnd": ""
        , "dialysisHospital": ""
    });
    // getPatPastDialysisList(dataBak);
    var table = layui.table;
    table.reload("patPastDialysisList_table", {
        // where:{numbers: dataBak.length-1},
        data: patPatientInfoEdit.patPastDialysisLists   // 将新数据重新载入表格
    })
}

/**
 * 标签弹框
 */
$("#addFun").click(function () {
    // 常用标签赋值
    var data = baseFuncInfo.getSysDictByCode('PatientTags');
    var html = ''
    $.each(data, function (index, item) {
        var borderColor = getSysDictBizCode("PatientTagsColor", item.dictBizCode);
        html += '<div class="layui-tag" style="border: 1px solid ' + borderColor + ';color: ' + borderColor + '" onclick="addPatientTags(1,\'' + item.name + '\',\'' + item.dictBizCode + '\')"> ' + item.name + '</div>'
    })
    $("#patientTagsId").html(html);
    // 标签颜色赋值
    var data = baseFuncInfo.getSysDictByCode('PatientTagsColor');
    var html = ''
    $.each(data, function (index, item) {
        if (index === 0) {
            html += '<input type="radio" data-color="' + item.dictBizCode + '" style="color: ' + item.dictBizCode + '" checked lay-verify="radio" lay-verify-msg="标签颜色"  name="tagColor" value = ' + item.value + ' title = ' + item.name + '>'
        } else {
            html += '<input type="radio" data-color="' + item.dictBizCode + '" style="color: ' + item.dictBizCode + '" lay-verify="radio" lay-verify-msg="标签颜色"  name="tagColor" value = ' + item.value + ' title = ' + item.name + '>'
        }
    })
    $('#patientTagsColorId').html(html);
    layui.form.render('radio');
    //根据值设置不同颜色
    $('input[name=tagColor]').each(function () {
        var color = $(this).data("color");
        $(this).next().css("color", color);
        $(this).next().find(".layui-icon").css("color", color);
    });
});

// 判断标签列表是否有重复数据
function judgeDuplicate(name) {
    var flag = false;
    var data = patPatientInfoEdit.patPatientTagLists;
    $.each(data, function (index, item) {
        if (item.tagContent === name) {
            flag = true;
            return false;
        }
    })
    if (flag) {
        layer.msg("请勿添加重复标签", {
            icon: 2
            , shade: 0.01
            , time: 1000
        });
    }
    return flag;
}

/**
 * 添加标签
 * @param type
 * @param name
 */
function addPatientTags(type, name, dictBizCode) {
    var arr = [];
    if (type == 1) {
        // 先判断是否有重复数据
        if (judgeDuplicate(name)) {
            return false;
        }
        var obj = {tagContent: name, tagColor: dictBizCode};
        patPatientInfoEdit.patPatientTagLists.push(obj);
        //arr.push(name);
        var tagColors = getSysDictBizCode("PatientTagsColor", dictBizCode);
        arr.push({tagContent: name, tagColors: tagColors});
    } else {
        // 先判断是否有重复数据
        if (judgeDuplicate($("#customPatientTagsId").val())) {
            return false;
        }
        var tagColor = $('input[name=tagColor]:checked')[0].value;
        var obj = {tagContent: $("#customPatientTagsId").val(), tagColor: tagColor}
        patPatientInfoEdit.patPatientTagLists.push(obj);
        if (isEmpty($("#customPatientTagsId").val())) {
            errorToast("请输入自定义标签", 500);
            return false;
        }
        // arr.push($("#customPatientTagsId").val());
        var tagColors = getSysDictBizCode("PatientTagsColor", tagColor);
        arr.push({tagContent: $("#customPatientTagsId").val(), tagColors: tagColors});
        $("#customPatientTagsId").val("");
    }
    // var dropdown = layui.dropdown;
    // dropdown.hide("[lay-filter='test8']");
    var inputTags = layui.inputTags;
    inputTags.render({
        elem: '#inputTags',//定义输入框input对象
        content: arr,
        aldaBtn: false,//是否开启获取所有数据的按钮
        done: function (value) { //回车后的回调
            console.log(value)
        }
    })
}

/**
 * 获取医生列表
 */
function getDoctorRoleList() {
    var param = {}
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getDoctorRoleList.do",
        data: param,
        dataType: "json",
        done: function (data) {
            patPatientInfoEdit.firstDiagnosisDoctors = data;
            var form = layui.form; //调用layui的form模块
            form.render();
            if (isNotEmpty(patPatientInfoEdit.patPatientInfo.firstDiagnosisDoctor)) {
                var select = 'dd[lay-value=' + patPatientInfoEdit.patPatientInfo.firstDiagnosisDoctor + ']';
                $('#firstDiagnosisDoctor').siblings("div.layui-form-select").find('dl').find(select).click();
            }
        }
    });
}

/**
 * 获取护士列表
 */
function getNurseRoleList() {
    var param = {}
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getNurseRoleList.do",
        data: param,
        dataType: "json",
        done: function (data) {
            patPatientInfoEdit.principalNurses = data;
            var form = layui.form; //调用layui的form模块
            var select = patPatientInfoEdit.patPatientInfo.principalNurse;
            if (isNotEmpty(select)) {
                $("#principalNurse").find("option[value=" + select + "]").prop("selected", true);
            }
            form.render();
        }
    });
}


//检查身份证号码
function IdCodeValid(code) {
    //身份证号合法性验证
    //支持15位和18位身份证号
    //支持地址编码、出生日期、校验位验证
    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
    };
    var result = true;
    var msg = "验证成功";
    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(code)) {
        result = false,
            msg = "身份证号格式错误";
        // layer.msg(msg, {
        //     icon: 2
        //     ,shade: 0.01
        //     ,time:1000
        // });
    } else if (!city[code.substr(0, 2)]) {
        result = false,
            msg = "身份证号地址编码错误";
        // layer.msg(msg, {
        //     icon: 2
        //     ,shade: 0.01
        //     ,time:1000
        // });
    } else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            if (parity[sum % 11] != code[17].toUpperCase()) {
                result = false,
                    msg = "身份证号校验错误";
                // layer.msg(msg, {
                //     icon: 2
                //     ,shade: 0.01
                //     ,time:1000
                // });
            }
        }
    }
    return result;
}

// JS通过身份证号获取生日、年龄、性别
function IdCard(UUserCard, num) {
    if (num == 1) {
        //获取出生日期
        birth = UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
        return birth;
    }
    if (num == 2) {
        //获取性别
        if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
            //男
            return "1";
        } else {
            //女
            return "2";
        }
    }
    if (num == 3) {
        //获取年龄
        var myDate = new Date();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
            age++;
        }
        return age;
    }
}

// 删除标签
$('#tags').on('click', '.close', function () {
    var tagContent = $(this).parent('span').find('em').text();
    var data = patPatientInfoEdit.patPatientTagLists;
    $.each(data, function (index, item) {
        if (item.tagContent === tagContent) {
            if (isNotEmpty(item.patientTagId)) {
                patPatientInfoEdit.deletePatientTags.push(item);
            }
            data.splice(index, 1);
            return false;
        }
    })
    patPatientInfoEdit.patPatientTagLists = data;
})

/*获取地区*/
function getArea() {
    var form = layui.form; //调用layui的form模块
    funLoadArea('', function (data) {//加载省
        patPatientInfoEdit.provinces = data;
        // 通信地址
        var contactProvince = patPatientInfoEdit.patPatientInfo.contactProvince;
        if (isNotEmpty(contactProvince)) {
            $("#contactProvince").find("option[value=" + contactProvince + "]").prop("selected", true);
            form.render();
            funLoadArea(contactProvince, function (data) {//选择了省加载市
                patPatientInfoEdit.contactCitys = data;
                var contactCity = patPatientInfoEdit.patPatientInfo.contactCity;
                if (isNotEmpty(contactCity)) {
                    $("#contactCity").find("option[value = " + contactCity + "]").prop("selected", true);
                    form.render();
                    funLoadArea(contactCity, function (data) {//选择了市加载县/区
                        patPatientInfoEdit.contactCountys = data;
                        var contactCounty = patPatientInfoEdit.patPatientInfo.contactCounty;
                        if (isNotEmpty(contactCounty)) {
                            $("#contactCounty").find("option[value=" + contactCounty + "]").prop("selected", true);
                            form.render();
                        }
                    });
                }
            });
        }
        // 家庭住址
        var homeProvince = patPatientInfoEdit.patPatientInfo.homeProvince;
        if (isNotEmpty(homeProvince)) {
            $("#homeProvince").find("option[value=" + homeProvince + "]").prop("selected", true);
            funLoadArea(homeProvince, function (data) {//选择了省加载市
                patPatientInfoEdit.homeCitys = data;
                var homeCity = patPatientInfoEdit.patPatientInfo.homeCity;
                if (isNotEmpty(homeCity)) {
                    $("#homeCity").find("option[value = " + homeCity + "]").prop("selected", true);
                    form.render();
                    funLoadArea(homeCity, function (data) {//选择了市加载县/区
                        patPatientInfoEdit.homeCountys = data;
                        var homeCounty = patPatientInfoEdit.patPatientInfo.homeCounty;
                        if (isNotEmpty(homeCounty)) {
                            $("#homeCounty").find("option[value=" + homeCounty + "]").prop("selected", true);
                            form.render();
                        }
                    });
                }
            });
        }
        form.render();
    })
}

// 获取区域代码
function funLoadArea(parentCode, $callback) {
    var param = {
        parentCode: parentCode
    }
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysAreaInfo/getOptions.do",
        data: param,
        dataType: "json",
        done: function (data) {
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}
