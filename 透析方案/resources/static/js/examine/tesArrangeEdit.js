/**
 * tesArrangeEdit.jsp的js文件，包括查询，编辑操作
 * 检验检查--化验整合
 * @Author xcj
 * @version: 1.0
 * @Date 2020/10/05
 */
var tesArrangeEdit = avalon.define({
    $id: "tesArrangeEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId:'',//患者id
    sampleCode:'',//检验条码
    applyId:'',//申请单id
    applyDate:null,//申请日期
    mechanism:'', //检验机构
    testType:'',//检验类型
    basTestMainMap:[],//检验总类
    bacExamineItemsList:[],
    arrangeList:[],// 页面显示的数据，注意js传值方式，bacExamineItemsList和arrangeList互通

});

layui.use(['index','formSelects'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        tesArrangeEdit.patientId=GetQueryString("patientId");  //接收变量
        tesArrangeEdit.sampleCode=GetQueryString("sampleCode");  //接收变量
        tesArrangeEdit.applyId=GetQueryString("applyId");  //接收变量
        tesArrangeEdit.applyDate=GetQueryString("applyDate");  //接收变量
        tesArrangeEdit.mechanism=GetQueryString("mechanism");
        tesArrangeEdit.testType=GetQueryString("testType");
        //获取实体信息
        getInfo();

        var formSelects = layui.formSelects;
        formSelects.on('testMainId', function(id, vals, val, isAdd, isDisabled){
            //id:           点击select的id
            //vals:         当前select已选中的值
            //val:          当前select点击的值
            //isAdd:        当前操作选中or取消
            //isDisabled:   当前选项是否是disabled
            var old = [];
            var add = [];

            $.each(vals, function (index, item) {
                if(item.value != val.value){
                    $.each(item.noList, function (i, no) {
                        if(!old.includes(no)) {//includes 检测数组是否有某个值
                            old.push(no);
                        }
                    });
                }
            });
            var list = [];
            $.each(old, function (index, item) {
                $.each(tesArrangeEdit.arrangeList, function (a, arritem) {
                    if(item == arritem.examineItemsNo){
                        list.push(arritem);
                    }
                });
            });
            if(isAdd){
                $.each(val.noList, function (index, item) {
                    if(!old.includes(item)) {//includes 检测数组是否有某个值
                        add.push(item);
                    }
                });
                $.each(tesArrangeEdit.bacExamineItemsList, function (b, bacitem) {
                    $.each(add, function (index, item) {
                        if(item == bacitem.examineItemsNo){
                            list.push(bacitem);
                        }
                    });
                });
            }
            tesArrangeEdit.arrangeList.clear();
            tesArrangeEdit.arrangeList.pushArray(list);
            avalon.scan();
        }, true);

        avalon.scan();
    });
});

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getInfo(){
    //编辑
    var param={
        patientId:tesArrangeEdit.patientId,
        sampleCode:tesArrangeEdit.sampleCode,
        applyId:tesArrangeEdit.applyId,
        testType:tesArrangeEdit.testType
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/testReport/getInfo.do",
        data:param,
        dataType: "json",
        done:function(res) {
            //表单初始赋值
            var form = layui.form; //调用layui的form模块
            //初始化表单元素,日期时间选择器
            var util = layui.util;

            tesArrangeEdit.basTestMainMap = res.basTestMainMap;
            tesArrangeEdit.bacExamineItemsList.pushArray(res.bacExamineItemsList);
            var tesMainId = res.tesMainId;

            var formSelects=layui.formSelects; //调用layui的form模块
            //如下设置内置操作
            formSelects.btns('testMainId', []);
            //以下方式则重新渲染所有的已存在多选
            //渲染下拉多选
            formSelects.data('testMainId', 'local', {
                arr:tesArrangeEdit.basTestMainMap
            });
            formSelects.value('testMainId', tesMainId);//要选中的值，

            tesArrangeEdit.arrangeList.clear();
            var add = [];
            $.each(tesMainId, function (m, main) {
                $.each(tesArrangeEdit.basTestMainMap, function (index, item) {
                    if(main == item.value){
                        $.each(item.noList, function (i, noitem) {
                            $.each(tesArrangeEdit.bacExamineItemsList, function (b, bacitem) {
                                if(noitem == bacitem.examineItemsNo){
                                    if(!add.includes(noitem)) {//includes 检测数组是否有某个值
                                        tesArrangeEdit.arrangeList.push(bacitem);
                                        add.push(noitem);
                                        return false;
                                    }
                                }
                            });
                        });
                    }
                });
            });
            form.val('tesArrangeEdit_form', {testMainId:tesMainId.toString()});
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
    form.on('submit(tesArrangeEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#tesArrangeEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field; //表单的元素
        param.patientId = tesArrangeEdit.patientId;
        param.sampleCode = tesArrangeEdit.sampleCode;
        param.applyId = tesArrangeEdit.applyId;
        param.applyDate = tesArrangeEdit.applyDate;
        param.mechanism = tesArrangeEdit.mechanism;
        param.testType = tesArrangeEdit.testType;
        param.bacExamineItemsLists = tesArrangeEdit.arrangeList;

        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url:  $.config.services.dialysis + "/testReport/saveOrEdit.do",
            data:JSON.stringify(param), //此设置后台可接受复杂参数
            contentType: "application/json; charset=utf-8", //此设置后台可接受复杂参数，后台接收需要@RequestBody标签
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}




