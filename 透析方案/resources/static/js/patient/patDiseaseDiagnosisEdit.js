/**
 * patDiseaseDiagnosisEdit.jsp的js文件，包括查询，编辑操作
 * 病历首页-疾病诊断编辑页面
 * @Author swn
 * @version: 1.0
 * @Date 2020/8/12
 */
var patDiseaseDiagnosisEdit = avalon.define({
    $id: "patDiseaseDiagnosisEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    diagnoseTypeId:"",  //记录点击的诊断类别id
    diagnoseTypeName:"",  //记录点击的诊断类别name
    basDiagnoseDetailList: [],//诊断项目
    basDiagnoseSearch: '', //诊断项目搜索条件
    diagnosisTypeList: [],//诊断结果
    deleteIds: [],//删除的诊断结果列表
    patientId: '',//患者id
    diagnosisDoctorId: '',//诊断医生
    diagnosisDate: '', //诊断日期
    diagnosisDoctorIds: [], //医生下拉列表
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        laydate.render({
            elem: '#diagnosisDate'
            ,type: 'date'
            ,done:function(value,date){//value, date, endDate点击日期、清空、现在、确定均会触发。回调返回三个参数，分别代表：生成的值、日期时间对象、结束的日期时间对象
                patDiseaseDiagnosisEdit.diagnosisDate = value;
                getInfo();
            }
        });
        var id=GetQueryString("id");  //接收变量
        var patientId = GetQueryString("patientId");
        patDiseaseDiagnosisEdit.patientId = patientId;
        patDiseaseDiagnosisEdit.diagnosisDoctorId=GetQueryString("diagnosisDoctorId");
        var diagnosisDate=GetQueryString("diagnosisDate");
        if(isEmpty(id)){
            var userId = baseFuncInfo.userInfoData.userid; // 当前登录用户id
            patDiseaseDiagnosisEdit.diagnosisDoctorId = userId; // 诊断医生默认为当前用户
            //初始化表单元素,日期时间选择器
            var util = layui.util;
            diagnosisDate = new Date();//默认当前日期
        }
        //初始化表单元素,日期时间选择器
        var util = layui.util;
        patDiseaseDiagnosisEdit.diagnosisDate = util.toDateString(Number(diagnosisDate),"yyyy-MM-dd");//默认当前日期
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            if(patientId != null){
                data.patientId = patientId;
            }
            //获取诊断类别
            getBasDiagnoseTypeTree(data.diagnoseTypeId);
            //获取诊断医生list
            getDoctorRoleList(patDiseaseDiagnosisEdit.diagnosisDoctorId );
            form.val('patDiseaseDiagnosisEdit_form', data);
            avalon.scan();
        });

    });
    //诊断医生监听值变化
    layui.form.on('select(diagnosisDoctorId)', function (obj) {
        patDiseaseDiagnosisEdit.diagnosisDoctorId = obj.value;
        getInfo();
    })
});

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getInfo(id,$callback){
    //初始化表单元素,日期时间选择器
    var util = layui.util;
    if (isEmpty(id)) {
        var data = {};
        data.diagnosisDate = util.toDateString(new Date(), "yyyy-MM-dd");
        typeof $callback === 'function' && $callback(data); //返回一个回调事件
    } else {
        var param = {
            "diseaseDiagnosisId": id //,
            // "patientId": patDiseaseDiagnosisEdit.patientId,
            // "diagnosisDate": patDiseaseDiagnosisEdit.diagnosisDate,
            // "diagnosisDoctorId": patDiseaseDiagnosisEdit.diagnosisDoctorId
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patDiseaseDiagnosis/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                // patDiseaseDiagnosisEdit.patientId = data.patientId;

                data.diagnosisDate = util.toDateString(data.diagnosisDate, "yyyy-MM-dd");
                // patDiseaseDiagnosisEdit.diagnosisDate = data.diagnosisDate;
                // patDiseaseDiagnosisEdit.diagnosisDoctorId = data.diagnosisDoctorId;
                // var patDiseaseDiagnosis = data.patDiseaseDiagnosis;
                var patDiseaseDiagnosis = [];
                patDiseaseDiagnosis.push(data)
                patDiseaseDiagnosisEdit.diagnosisTypeList = [];
                if (isNotEmpty(patDiseaseDiagnosis)) {
                    $.each(patDiseaseDiagnosis, function (index, item) {
                        var obj = {
                            diagnosisTypeId: item.diagnosisTypeId,
                            diagnoseTypeName: item.diagnoseTypeName,
                            icdCode: item.icdCode,
                            diagnoseTypeCode: item.diagnosisItemNo,
                            diseaseDiagnosisId: item.diseaseDiagnosisId,
                            diagnoseDetailName: item.diagnoseDetailName
                        };
                        patDiseaseDiagnosisEdit.diagnosisTypeList.push(obj);
                        data["diagnosisType_" + item.diagnosisItemNo] = item.diagnosisType;
                    })
                }
                form.val('patDiseaseDiagnosisEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

/**
 * 获取医生列表
 */
function getDoctorRoleList(diagnosisDoctorId){
    var param={
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getDoctorRoleList.do",
        data:param,
        dataType: "json",
        done:function(data){
            patDiseaseDiagnosisEdit.diagnosisDoctorIds = data;
            var userId=baseFuncInfo.userInfoData.userid;
            if(isEmpty(diagnosisDoctorId)){
                var userId=baseFuncInfo.userInfoData.userid;
                diagnosisDoctorId = userId;
            }
            patDiseaseDiagnosisEdit.diagnosisDoctorId = diagnosisDoctorId;
            $("#diagnosisDoctorId").find("option[value="+diagnosisDoctorId+"]").prop("selected",true);
            var form=layui.form; //调用layui的form模块
            form.render();

        }
    });
}
/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(patDiseaseDiagnosisEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#patDiseaseDiagnosisEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback,data){  //菜单保存操作
    var url = "";
    if(isEmpty(data)){  //id为空,新增操作
        url="/patDiseaseDiagnosis/saveInfo.do";
    }else{  //编辑
        url="/patDiseaseDiagnosis/editInfo.do";    }
    //对表单验证
    verify_form(function(field){
        if(field.diseaseDiagnosisId==null || field.diseaseDiagnosisId==''){
            field.patientId = patDiseaseDiagnosisEdit.patientId;
        }
        var patDiseaseDiagnosis = [];
        $("input[name^='diagnosisType_']").each(function(index, item) {
            var index=item.name.lastIndexOf("\_");
            var diagnoseTypeCode = item.name.substring(index+1,item.name.length)
            if(item.checked){
                var diseasediagnosisId = item.getAttribute("diseasediagnosisid");
                var item = {diagnosisItemNo:diagnoseTypeCode,diagnosisType:item.value, diseasediagnosisId: diseasediagnosisId};
                 patDiseaseDiagnosis.push(item);
            }
        });
        if(patDiseaseDiagnosis.length < 1){
            layer.msg('请填写诊断结果', {
                icon: 2
                ,shade: 0.01
                ,time:1000
            });
            return false;
        }
        // 判断是否有重复数据
        if(isRepeat(patDiseaseDiagnosis)){
            return false;
        }
        field["patDiseaseDiagnosis"] = patDiseaseDiagnosis;
        field["deleteIdStr"] =patDiseaseDiagnosisEdit.deleteIds.join(",");
        //成功验证后
        var param=field; //表单的元素
        checkExist(param,function(param){
            _ajax({
                type: "POST",
                //loading:true,  //是否ajax启用等待旋转框，默认是true
                url: $.config.services.dialysis + url,
                contentType: "application/json; charset=utf-8", //此设置后台可接受复杂参数，后台接收需要@RequestBody标签
                data: JSON.stringify(param), //此设置后台可接受复杂参数
                // dataType: "json",
                done:function(data){
                    typeof $callback === 'function' && $callback(data); //返回一个回调事件
                }
            });
        });

    });
}
function  checkExist(param,$callback){
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/patDiseaseDiagnosis/checkExist.do",
        contentType: "application/json; charset=utf-8", //此设置后台可接受复杂参数，后台接收需要@RequestBody标签
        data: JSON.stringify(param), //此设置后台可接受复杂参数
        // dataType: "json",
        done:function(data){
            var deleteIds = [];
            var deleteIdStr = param["deleteIdStr"]
            if(isNotEmpty(deleteIdStr)){
                deleteIds = deleteIdStr.split(",");
            }
            if(data!=null && data.length>0){
                var nameLst = [];
               for(var i in data){
                   var name = baseFuncInfo.getSysDictName('DiagnosisType', data[i].diagnosisType);
                   nameLst.push(name);
                   deleteIds.push(data[i].diseaseDiagnosisId);// 重复内容添加入删除列表
               }
                var nameStr = nameLst.join(",");
                layer.confirm('诊断结果('+ nameStr+")有重复，确认要覆盖原诊断结果吗", function(index){
                    param["deleteIdStr"] = deleteIds.join(",");
                    typeof $callback === 'function' && $callback(param); //返回一个回调事件
                });
            }
            else {
                typeof $callback === 'function' && $callback(param); //返回一个回调事件
            }
        }
    });
}
/**
 * 获取树结点列表 - 诊断类别
 * */
function getBasDiagnoseTypeTree(diagnoseTypeId){
    var param = {};
    // 渲染表格
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url:$.config.services.platform + "/basDiagnoseType/getBasDiagnoseTypeTree.do",
        data: param,
        done:function(data){
            //编辑树时还有一种方法初始化已有权限
            var setting={
                id: 'diagnoseTypeId', //新增自定义参数，同ztree的data.simpleData.idKey
                pId: 'parentTypeId', //新增自定义参数，同ztree的data.simpleData.pIdKey
                name:'diagnoseTypeName',  //新增自定义参数，同ztree的data.key.name
                //radio:true //新增自定义参数，开启radio
                //checkbox:true, //新增自定义参数，开启checkbox
                done:function(treeObj){
                    if (isNotEmpty(diagnoseTypeId)) {
                        $.each(data, function (index1, item) {
                            if (diagnoseTypeId == item.diagnoseTypeId) {
                                var node = treeObj.getNodeByParam("diagnoseTypeId", item.diagnoseTypeId, null);
                                if (node != null) {
                                    // treeObj.checkNode(node, true, false); // 加载勾选
                                    treeObj.selectNode(node); // 选中展开
                                    patDiseaseDiagnosisEdit.diagnoseTypeId=node.diagnoseTypeId;
                                    patDiseaseDiagnosisEdit.diagnoseTypeName=node.diagnoseTypeName;
                                }
                            }
                        });
                        // 根据诊断类别查询诊断项目
                        getBasDiagnoseDetailByType();
                    }
                },
                //其它具体参数请参考ztree文档
                view: {
                    selectedMulti: false  //设置是否允许同时选中多个节点。默认值: true
                },
                edit: {
                    enable: true,
                    showRemoveBtn: false, //设置是否显示删除按钮。[setting.edit.enable = true 时生效]
                    showRenameBtn: false, //设置是否显示编辑名称按钮。[setting.edit.enable = true 时生效]
                    drag: {
                        prev: true,
                        next: true,
                        inner: true //拖拽到目标节点时，设置是不允许成为目标节点的子节点
                    }
                },
                callback: {
                    beforeClick:zTreeBeforeClick //单击节点事件
                }
            };
            //加载ztree树
            ztreeObj=_initZtree($("#basDiagnoseTypeTree"),setting,data);

        }
    });
}

/**
 * ztree事件：单击节点事件
 */
function zTreeBeforeClick(treeId, treeNode, clickFlag) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    if(zTree.isSelectedNode(treeNode)){
        zTree.cancelSelectedNode(treeNode);
    }else {
        patDiseaseDiagnosisEdit.diagnoseTypeId=treeNode.diagnoseTypeId;
        patDiseaseDiagnosisEdit.diagnoseTypeName=treeNode.diagnoseTypeName;
        zTree.selectNode(treeNode);
        // 根据诊断类别查询诊断项目
        getBasDiagnoseDetailByType();
        //getInfo(treeNode.diagnoseTypeId);
    }
    return false;
}
/**
 * 获取实体 - 查询诊断项目
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getBasDiagnoseDetailByType(){
    if(isEmpty(patDiseaseDiagnosisEdit.diagnoseTypeId)){
        layer.msg('请选择诊断类别', {
            icon: 2
            ,shade: 0.01
            ,time:1000
        });
        return false;
    }
    var param={
        "diagnoseTypeId":patDiseaseDiagnosisEdit.diagnoseTypeId,
        "diagnoseDetailName":patDiseaseDiagnosisEdit.basDiagnoseSearch
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url:$.config.services.platform + "/basDiagnoseDetail/getBasDiagnoseDetailByType.do",
        data:param,
        dataType: "json",
        done:function(data){
            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            var html = '';
            $.each(data,function(index, item){
                html += '<div style=" border: 1px solid #d2c4c4;border-radius:15px;margin: 5px 0;cursor: pointer; " onclick="basDiagnoseDetailByTypeClick(\''+ item.diagnoseTypeCode +'\',\''+ item.icdCode +'\',\''+ item.diagnoseDetailName +'\')">' +
                 '<div style="width:100%;text-align: center;line-height: 20px">'+item.icdCode+'</div> ' +
                 '<div style="width:100%;text-align: center;line-height: 20px">'+item.diagnoseDetailName+'</div> ' +
                 '</div>';
            });
            $('#basDiagnoseTypeCode').html(html);
            form.render();
            patDiseaseDiagnosisEdit.basDiagnoseDetailList = data;
        }
    });
}

/**
 * 查询诊断项目
 */
$(document).on('click','i.layuiadmin-button-btn',function(){
    getBasDiagnoseDetailByType();
});
function basDiagnoseDetailByTypeClick(diagnoseTypeCode,icdCode,diagnoseDetailName) {
    var data = patDiseaseDiagnosisEdit.diagnosisTypeList;
    var flag=false;
    $.each(data,function(index, item){
        if(item.diagnosisTypeId == patDiseaseDiagnosisEdit.diagnosisTypeId && item.diagnoseTypeCode == diagnoseTypeCode) {
            layer.msg('请勿重复添加相同诊断项目', {
                icon: 2
                ,shade: 0.01
                ,time:1000
            });
            flag = true;
            return false;
        }
    })
    if(!flag){
        var obj = {
            diagnosisTypeId:patDiseaseDiagnosisEdit.diagnosisTypeId,
            diagnoseTypeName:patDiseaseDiagnosisEdit.diagnoseTypeName,
            icdCode:icdCode,
            diagnoseTypeCode:diagnoseTypeCode,
            diseaseDiagnosisId: "",
            diagnoseDetailName:diagnoseDetailName
        };
        patDiseaseDiagnosisEdit.diagnosisTypeList.push(obj);
        var form=layui.form; //调用layui的form模块
        form.render();
    }
}

/**
 * 删除诊断结果项
 * @param e
 */
function deleteItem(e){
    var diagnoseTypeCode = e.id;
    var data = patDiseaseDiagnosisEdit.diagnosisTypeList;
    var diseasediagnosisId = e.getAttribute("diseasediagnosisid");
    if (isNotEmpty(diseasediagnosisId)) {
        patDiseaseDiagnosisEdit.deleteIds.push(diseasediagnosisId);
    }
    $.each(data,function(index, item){
        if(item.diagnoseTypeCode == diagnoseTypeCode) {
            data.splice(index,1);
            patDiseaseDiagnosisEdit.diagnosisTypeList = data;
            var form=layui.form; //调用layui的form模块
            form.render();
            return false;
        }
    })
}
// 判断诊断结果是否有重复数据
function isRepeat(data) {
    debugger
    var flag = false;
    var title = "";
    var i = 0;
    for(var i in data) {
        var temp = data[i].diagnosisType;
        if (flag) {
            break;
        }
        var j = 0;
        for (var j in data) {
            if (data[i].diagnosisItemNo != data[j].diagnosisItemNo && data[j].diagnosisType == temp&&temp==='1') {
                flag = true;
                title = getSysDictName("DiagnosisType", data[j].diagnosisType);
                break;
            }
        }
    }
    if(flag){
        layer.msg("请勿添加相同诊断结果（"  + title +"）", {
            icon: 2
            ,shade: 0.01
            ,time: 1000
        });
    }
    return flag;
}