/**
 * eduNurse.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 健康教育--患者分组
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/7
 */
var eduNurse = avalon.define({
    $id: "eduNurse",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    nurseList:[],//护士列表里面有患者数据
    patientList:[],//未分配患者列表

});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList();  //查询列表
        avalon.scan();
    });
});
/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#eduNurse_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'eduNurse_search'  //指定的lay-filter
        ,conds:[
            {field: 'userName', title: '护士名称',type:'input'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            getList(field.userName)
        }
    });
}
/**
 * 查询列表事件
 */
function getList(userName) {
    if(isEmpty(userName)){
        userName = $("input[name='userName']").val();
    }
    var param = {
        userName:userName
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/patPatientInfo/listPrincipalNurse.do",
        data:param,
        dataType: "json",
        done:function(data){
            eduNurse.nurseList.clear();
            eduNurse.nurseList.pushArray(data.nurseList);
            eduNurse.patientList.clear();
            eduNurse.patientList.pushArray(data.patientList);

        }
    });
}


/**
 * 获取单个实体
 * id 护士id
 */
function edit(obj){
    var id = $(obj).attr("nurseId");
    var url="";
    var title="";
    //编辑
    title="编辑";
    url=$.config.server+"/education/eduNurseEdit?id="+id;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:650,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    getList();
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 删除事件
 * @param ids
 */
function del(obj){
    var patientId = $(obj).attr("patientId"); //获取选中行的数据
    var param={
        "patientId":patientId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis+"/patPatientInfo/delPrincipalNurse.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            getList();
        }
    });
}


