/**
 * bacCallbackRecordEdit.jsp的js文件，包括查询，编辑操作
 * @author Chauncey
 * @date 2020/08/17
 * @description 回访记录编辑页面。
 * @version 1.0
 */
var bacCallbackRecordEdit = avalon.define({
    $id: "bacCallbackRecordEdit",
    readonly: {readonly: false}, // 设置只读
    disabled: {disabled: false}, // 设置只读
    baseFuncInfo: baseFuncInfo,//底层基本方法
    currentUser:baseFuncInfo.userInfoData.username,//当前登陆者
    callbackUser:"",//回访者
    verifyUser:"",//查对者
    layEvent:""

});

layui.use(['index','formSelects'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        selectSick();
        laydate.render({
            elem: '#callbackDate'
            ,type: 'date'
        });
        //接收变量
        var id=GetQueryString("id");
        // 接收变量layEvent
        bacCallbackRecordEdit.layEvent = GetQueryString("layEvent");
        if (bacCallbackRecordEdit.layEvent === 'detail') {
            bacCallbackRecordEdit.readonly = {readonly: true};
            bacCallbackRecordEdit.disabled = {disabled:true}
            $('input[type="select"]').prop('disabled', true);
            var formSelects = layui.formSelects;
            formSelects.disabled("sickId");
        }
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            selectSick(data.sickId);

        });
        avalon.scan();
    });
});

//患者下拉绑定
function selectSick(value){
    if(value == null || value == "" || typeof value == "undefined" ){
        value = "";
    }
    var formSelects = layui.formSelects;
    formSelects.btns('sickId',['remove']);
    formSelects.config('sickId',{
        type:'post',
        searchUrl: $.config.services.logistics + "/bacCallbackRecord/selSickData.do",
        searchVal:value,
        keySel:value == "" ? "":"sickId",
        searchName:'sickId',
        keyName:'patientName',
        keyVal:'patientRecordNo',
        delay: 1000,
        direction: 'auto',
        response: {
            statusCode: 0,          //成功状态码
            statusName: 'rtnCode',     //code key
            msgName: 'msg',         //msg key
            dataName: 'bizData'        //data key
        },
        //id:组件ID xm-select;  url:URL; searchVal:搜索的value; result:返回的结果
        beforeSuccess: function(id, url, searchVal, result){        //success之前的回调, 干嘛呢? 处理数据的, 如果后台不想修改数据, 你也不想修改源码, 那就用这种方式处理下数据结构吧
            if(result.bizData == '' || result.bizData == null || typeof result.bizData == "undefined" ){
                result.bizData=[];
            }
            return result;  //必须return一个结果, 这个结果要符合对应的数据结构
        },
        beforeSearch: function(id, url, val){
            if(!val){//内容为空, 不进行远程搜索
                return false;
            }
            return true;
        },
        success: function(id, url, searchVal, result){      //使用远程方式的success回调
            if(value != null && value != "" && typeof value != "undefined" ){
                formSelects.value("sickId",[value],true);
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
function  getInfo(id,$callback){
    if(isEmpty(id)){
        bacCallbackRecordEdit.callbackUser = bacCallbackRecordEdit.currentUser;
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    }else{
        //编辑
        var param={
            "callbackRecordId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/bacCallbackRecord/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.callbackDate=util.toDateString(data.callbackDate,"yyyy-MM-dd");
                form.val('bacCallbackRecordEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}
/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(bacCallbackRecordEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacCallbackRecordEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field;
        //跳转的URL
        var url = '';
        if (param.callbackRecordId.length == 0) {
            url = $.config.services.logistics + "/bacCallbackRecord/save.do"
        } else {
            url = $.config.services.logistics + "/bacCallbackRecord/edit.do"
        }
        //表单的元素
        //可以继续添加需要上传的参数
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



