// /**
//  * 患者管理--病情记录--病史编辑的js文件，包括查询，编辑操作
//  * @author Care
//  * @date 2020-09-02
//  * @version 1.0
//  */
// var patDiseaseHistoryEdit = avalon.define({
//     $id: "patDiseaseHistoryEdit",
//     baseFuncInfo: baseFuncInfo,//底层基本方法
//     patientId: GetQueryString("patientId"),
//     roleId: baseFuncInfo.userInfoData.roleid,//角色ID
//     makerName: [],//获取到的当前角色
// });
//
// layui.use(['index'], function () {
//     //加载layui的模块，index模块是基础模块，也可添加其它
//     avalon.ready(function () {
//         //所有的入口事件写在这里...
//         //初始化表单元素,日期时间选择器
//         var laydate = layui.laydate;
//         laydate.render({
//             elem: '#recordDate'
//             , type: 'date'
//             , trigger: 'click'
//             , value: new Date()
//         });
//         //监听提交,先定义个隐藏的按钮
//         var id = GetQueryString("id");  //接收变量
//         getMakerInfo(patDiseaseHistoryEdit.roleId);
//         avalon.scan();
//     });
// });
//
// /**
//  * 初始化搜索框
//  */
// function initSearch(){
//     _initSearch({
//         elem: '#patDiseaseHistoryEdit_search' //指定搜索框表单的元素选择器（推荐id选择器）
//         ,filter:'patDiseaseHistoryEdit_search'  //指定的lay-filter
//         ,conds:[
//             {field: 'templateTitle',title: '模板名称:',placeholder:'模板名称',type:'input',}
//         ]
//         ,done:function(filter,data){
//             //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
//             //...
//         }
//         ,search:function(data){
//             //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
//             var field = data.field;
//             var table = layui.table; //获取layui的table模块
//             //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
//             table.reload('patDiseaseHistoryEdit_table',{
//                 where:field
//             });
//         }
//     });
// }
//
// /**
//  * 模板列表
//  */
// function getList(templateType) {
//     var param = {
//         templateType: templateType,
//     };
//     //获取layui的table模块
//     var table=layui.table;
//     //获取layui的util模块
//     var util=layui.util;
//     _layuiTable({
//         elem: '#patDiseaseHistoryEdit_table', //必填，指定原始表格元素选择器（推荐id选择器）
//         filter:'patDiseaseHistoryEdit_table', ////必填，指定的lay-filter的名字
//         //执行渲染table配置
//         render:{
//             height:'full-180', //table的高度，页面最大高度减去差值
//             url: $.config.services.platform + "/bacContentTemplate/list.do", // ajax的url必须加上getRootPath()方法
//             where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
//             page: false,
//             cols: [[ //表头
//                 {field: 'templateTitle', title: '模板名称',sortField:'bct_.template_title'}
//                 ,{field: 'editor', title: '修改人员',sortField:'bct_.update_by_'}
//                 ,{field: 'updateTime', title: '修改日期',align:'center',sortField:'bct_.update_time_'
//                     ,templet: function(d){
//                         return util.toDateString(d.updateTime,"yyyy-MM-dd");
//                     }}
//             ]],
//             done: function (obj) {
//                 if (obj.bizData != null && obj.bizData.length > 0) {
//                     //取出第一笔数据
//                     var data = obj.bizData[0];
//                     //模板表单赋值
//                     getInfo(data);
//                 }
//             }
//         }
//     });
//     //监听行单击事件（双击事件为：rowDouble）
//     table.on('row(bacContentTemplateList_table)', function(obj){
//         var data = obj.data;
//         if(data!=null){
//             bacContentTemplateList.contentTemplateId = data.contentTemplateId;
//             getSingleLineInfor(data.contentTemplateId);
//         }
//         //标注选中样式
//         obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
//     });
// }
//
//
// /**
//  * 跳转至模板导入页面
//  */
// function importTemp(templateType) {
//
//     var url = "";
//     var title = "";
//     title = "从模板导入";
//     url = $.config.server + "/backstage/bacContentTemplateList?templateType=" + templateType;
//     //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
//     _layerOpen({
//         url: url,  //弹框自定义的url，会默认采取type=2
//         width: 1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
//         height: 800,  //弹框自定义的高度，方法会自动判断是否超过高度
//         title: title, //弹框标题
//         btn: ["导入", "取消"],
//         // readonly: true,   //true - 查看详情  false - 编辑
//         done: function (index, iframeWin) {
//             /**
//              * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
//              * 利用iframeWin可以执行弹框的方法，比如save方法
//              */
//             var ids = iframeWin.save(
//                 //成功保存之后的操作，刷新页面
//                 function success(date) {
//                     medicalHistoryFill(date)
//                     successToast("保存成功");
//                     var table = layui.table; //获取layui的table模块
//                     table.reload('patDiseaseHistoryEdit_form'); //重新刷新table
//                     layer.close(index); //如果设定了yes回调，需进行手工关闭
//                 }
//             );
//         }
//     });
// }
//
// /**
//  * 跳转至模板导出页面
//  */
// function exportTemp(templateType, content) {
//
//     var url = "";
//     var title = "";
//     title = "导出到模板";
//     url = $.config.server + "/backstage/bacContentTemplateEdit?templateType=" + templateType + "&content=" + content;
//     //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
//     _layerOpen({
//         url: url,  //弹框自定义的url，会默认采取type=2
//         width: 900, //弹框自定义的宽度，方法会自动判断是否超过宽度
//         height: 600,  //弹框自定义的高度，方法会自动判断是否超过高度
//         title: title, //弹框标题
//         btn: ["保存", "取消"],
//         // readonly: true,   //true - 查看详情  false - 编辑
//         done: function (index, iframeWin) {
//             /**
//              * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
//              * 利用iframeWin可以执行弹框的方法，比如save方法
//              */
//             var ids = iframeWin.save(
//                 //成功保存之后的操作，刷新页面
//                 function success(date) {
//                     medicalHistoryFill(date)
//                     successToast("保存成功");
//                     var table = layui.table; //获取layui的table模块
//                     table.reload('patDiseaseHistoryEdit_form'); //重新刷新table
//                     layer.close(index); //如果设定了yes回调，需进行手工关闭
//                 }
//             );
//         }
//     });
// }
//
// /**
//  * 获取模板内容
//  */
// function getTempCont(templateType) {//按钮点击方法
//     var patientComplaint = $("#patientComplaint").val();
//     var presentHistory = $("#presentHistory").val();
//     var cardioVascularHistory = $("#cardioVascularHistory").val();
//     var hypertensionHistory = $("#hypertensionHistory").val();
//     var brainVascularHistory = $("#brainVascularHistory").val();
//     var diabetesHistory = $("#diabetesHistory").val();
//     var hepatitisHistory = $("#hepatitisHistory").val();
//     var otherHistory = $("#otherHistory").val();
//     var familyHistory = $("#familyHistory").val();
//     var allergicHistory = $("#allergicHistory").val();
//     var marriageHistory = $("#marriageHistory").val();
//     var menstruationHistory = $("#menstruationHistory").val();
//     if (templateType == "PatientComplaint" && patientComplaint != "") {
//         return exportTemp(templateType, patientComplaint);//跳转页面
//     } else if(templateType == "PresentHistory" && presentHistory != "") {
//         return exportTemp(templateType, presentHistory);//跳转页面
//     }else if(templateType == "CardioVascularHistory" && cardioVascularHistory != "") {
//         return exportTemp(templateType, cardioVascularHistory);//跳转页面
//     }else if(templateType == "HypertensionHistory" && hypertensionHistory != "") {
//         return exportTemp(templateType, hypertensionHistory);//跳转页面
//     }else if(templateType == "BrainVascularHistory" && brainVascularHistory != "") {
//         return exportTemp(templateType, brainVascularHistory);//跳转页面
//     }else if(templateType == "DiabetesHistory" && diabetesHistory != "") {
//         return exportTemp(templateType, diabetesHistory);//跳转页面
//     }else if(templateType == "HepatitisHistory" && hepatitisHistory != "") {
//         return exportTemp(templateType, hepatitisHistory);//跳转页面
//     }else if(templateType == "OtherHistory" && otherHistory != "") {
//         return exportTemp(templateType, otherHistory);//跳转页面
//     }else if(templateType == "FamilyHistory" && familyHistory != "") {
//         return exportTemp(templateType, familyHistory);//跳转页面
//     }else if(templateType == "AllergicHistory" && allergicHistory != "") {
//         return exportTemp(templateType, allergicHistory);//跳转页面
//     }else if(templateType == "MarriageHistory" && marriageHistory != "") {
//         return exportTemp(templateType, marriageHistory);//跳转页面
//     }else if(templateType == "MenstruationHistory" && menstruationHistory != "") {
//         return exportTemp(templateType, menstruationHistory);//跳转页面
//     }else{
//         return warningToast("请填写模板内容");
//     }
// }
//
// /**
//  * 病史填充
//  */
// function medicalHistoryFill(date) {
//     if (date.templateType === "PatientComplaint") {
//         $("#patientComplaint").val(date.templateContent)
//     }
//     if (date.templateType === "PresentHistory") {
//         $("#presentHistory").val(date.templateContent)
//     }
//     if (date.templateType === "CardiovascularDiseasesHistory") {
//         $("#cardioVascularHistory").val(date.templateContent)
//     }
//     if (date.templateType === "HypertensionHistory") {
//         $("#hypertensionHistory").val(date.templateContent)
//     }
//     if (date.templateType === "CerebrovascularHistory") {
//         $("#brainVascularHistory").val(date.templateContent)
//     }
//     if (date.templateType === "DiabetesHistory") {
//         $("#diabetesHistory").val(date.templateContent)
//     }
//     if (date.templateType === "HepatitisHistory") {
//         $("#hepatitisHistory").val(date.templateContent)
//     }
//     if (date.templateType === "AtherHistory") {
//         $("#otherHistory").val(date.templateContent)
//     }
//     if (date.templateType === "FamilyHistory") {
//         $("#familyHistory").val(date.templateContent)
//     }
//     if (date.templateType === "AllergicHistory") {
//         $("#allergicHistory").val(date.templateContent)
//     }
//     if (date.templateType === "MarriageHistory") {
//         $("#marriageHistory").val(date.templateContent)
//     }
//     if (date.templateType === "MenstruationHistory") {
//         $("#menstruationHistory").val(date.templateContent)
//     }
// }
//
// /**
//  * 获取当前登录者
//  */
// function getMakerInfo(roleId) {
//     var url = "";
//     $(document).ready(function () {
//         if (isNotEmpty(roleId)) {
//             _ajax({
//                 type: "POST",
//                 loading: true,  //是否ajax启用等待旋转框，默认是true
//                 url: $.config.services.system + "/sysUser/getDoctorRoleList.do",
//                 data: {roleId: roleId},
//                 dataType: "json",
//                 done: function (data) {
//                     var form = layui.form; //调用layui的form模块
//                     patDiseaseHistoryEdit.makerName = data;
//                     var userId = baseFuncInfo.userInfoData.userid;
//                     patDiseaseHistoryEdit.recordUserId = userId;
//                     form.render();
//                 }
//             });
//         }
//
//     });
// }
//
// /**
//  * 验证表单
//  * @param $callback 成功验证后的回调函数
//  */
// function verify_form($callback) {
//     //监听提交,先定义个隐藏的按钮
//     var form = layui.form; //调用layui的form模块
//     form.on('submit(patDiseaseHistoryEdit_submit)', function (data) {
//         //通过表单验证后
//         var field = data.field; //获取提交的字段
//         field.patientId = patDiseaseHistoryEdit.patientId;
//
//         typeof $callback === 'function' && $callback(field); //返回一个回调事件
//     });
//     $("#patDiseaseHistoryEdit_submit").trigger('click');
// }
//
// /**
//  * 关闭弹窗
//  * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
//  */
// function save($callback) {  //菜单保存操作
//     //对表单验证
//     verify_form(function (field) {
//         //成功验证后
//         var param = field; //表单的元素
//         //可以继续添加需要上传的参数
//         var url = $.config.services.dialysis + "/patDiseaseHistory/edit.do";
//         if (isEmpty(param.diseaseHistoryId)) {
//             url = $.config.services.dialysis + "/patDiseaseHistory/save.do";
//         }
//         _ajax({
//             type: "POST",
//             //loading:true,  //是否ajax启用等待旋转框，默认是true
//             url: url,
//             data: param,
//             dataType: "json",
//             done: function (data) {
//
//                 typeof $callback === 'function' && $callback(data); //返回一个回调事件
//             }
//         });
//     });
// }
//
//
