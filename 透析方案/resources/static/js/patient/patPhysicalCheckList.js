/**
 * 体格检查
 * patPhysicalCheckList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 */
var patPhysicalCheckList = avalon.define({
    $id: "patPhysicalCheckList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId: '',//患者id
    checkDateRange: '',// 检查日期时间范围
    patPatientInfoList: [],//患者列表
    patPhysicalCheck: [],//表单实体
    checkUserIds:[],//检查人下拉选单
    readonly: {readonly: true}, // 设置只读
    disabled: {disabled: true}, // 设置只读
    layEvent: "detail"
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        laydate.render({
            elem: '#checkDateRange'
            ,type: 'date'
            ,theme: '#72c0bb'
            ,range: '~'
            ,done:function(value,date){//value, date, endDate点击日期、清空、现在、确定均会触发。回调返回三个参数，分别代表：生成的值、日期时间对象、结束的日期时间对象
                patPhysicalCheckList.checkDateRange = value;
            }
        });
        laydate.render({
            elem: '#checkDate'
            ,type: 'date'
            ,theme: '#72c0bb'
        });
        var patientId = GetQueryString("patientId");
        patPhysicalCheckList.patientId = patientId;
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        search();
        getDoctorRoleList();//获取检查人列表
        avalon.scan();
    });
    var form = layui.form;
    form.verify({
        number: function (value, item) {
            var reg =/^0?$|^([1-9][0-9]*)?$/;
            if (value!=null && value!=='' && !reg.test(value)) {
                return "只能填写整数数字";
            }
        },
        decimalNumber1: function (value, item) {
            var reg =/^\d*\.{0,1}\d{0,1}$/;
            if (value!=null && value!=='' && !reg.test(value)) {
                return "只能填写最多一位小数的数字";
            }
        },
        urineVolume:function(value,item)
        {
            if(value!=null && value!=='' && (value < 0 || value > 5000) )
            {
                return "尿量取值范围[0,5000],取整数";
            }
        },
        nocturiaTimes:function(value,item)
        {
            if(value!=null && value!=='' && (value < 0 || value > 20) )
            {
                return "夜尿取值范围[0,20],取整数";
            }
        },
        systolicPressure:function(value,item)
        {
            if(value!=null && value!=='' && (value < 0 || value > 300) )
            {
                return "收缩压取值范围[0,300],取整数";
            }
        },
        diastolicPressure:function(value,item)
        {
            if(value!=null && value!=='' && (value < 0 || value > 300) )
            {
                return "舒张压取值范围[0,300],取整数";
            }
        },
        heartRate:function(value,item)
        {
            if(value!=null && value!=='' && (value < 0 || value > 300) )
            {
                return "HR取值范围[0,300],取整数";
            }
        },
        respire:function(value,item)
        {
            if(value!=null && value!=='' && (value < 0 || value > 100) )
            {
                return "R取值范围[0,100],取整数";
            }
        },
        temperature:function(value,item)
        {
            if(value!=null && value!=='' && (value < 35 || value > 42) )
            {
                return "体温取值范围[35,42],可输入一位小数";
            }
        },
        pulseRate:function(value,item)
        {
            if(value!=null && value!=='' && (value < 0 || value > 300) )
            {
                return "心率取值范围[0,300],取整数";
            }
        },
        decimalNumber2: function (value, item) {
            var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
            if (isNotEmpty(value) && (!reg.test(value) || (value <= 0 || value > 200))) {
                return "体重取值范围(0,200],可输入两位小数";
            }
        },
    })
});
/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#patPatientInfoList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'patPatientInfoList_search'  //指定的lay-filter
        ,conds:[
            {field: 'patientRecordNo', title: '病历号',type:'input'}
            ,{field: 'customerType', title: '客户类型',type:'select',data:getSysDictByCode("CustomerType",true)}
            ,{field: 'patientName', title: '姓名',type:'input'}
            ,{field: 'mobilePhone', title: '个人手机',type:'input'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            // table.reload('patPatientInfoList_table',{
            //     where:field
            // });
            patPhysicalCheckList.patientId = field.patientId;
            getList(field);
        }
    });
}

/**
 * 按检查日期查询
 */
function search(){
    var field = {patientId: patPhysicalCheckList.patientId};
    if(isNotEmpty(patPhysicalCheckList.checkDateRange)){
        var checkDateStart = patPhysicalCheckList.checkDateRange.split("~");
        field = {patientId: patPhysicalCheckList.patientId,checkDateStart: checkDateStart[0].replace(/^\s+|\s+$/g,""), checkDateEnd: checkDateStart[1].replace(/^\s+|\s+$/g,"")};
    }
    getList(field);

}
/**
 * 查询列表事件
 */
function getList(field) {
    var param = {
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#patPhysicalCheckList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'patPhysicalCheckList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patPhysicalCheck/list.do", // ajax的url必须加上getRootPath()方法
            where:field, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                // {type: 'numbers', title: '序号',width:60 }  //序号
                {field: 'checkDate', title: '检查日期',align:'center', width: '50%'
                    ,templet: function(d){
                    return util.toDateString(d.checkDate,"yyyy-MM-dd");
                }}
                ,{field: 'checkUserName', title: '检查人',align:'center', width: '50%'}
            ]],
            done: function (res, curr, count) {
                if(res.bizData!=null && res.bizData.length>0) {
                    //取出第一笔数据
                    var data = res.bizData[0];
                    $('.layui-table-view[lay-id="patPhysicalCheckList_table"]').children('.layui-table-box').children('.layui-table-body').find('table tbody tr[data-index="0"]').click();
                } else{
                    ClearForm( patPhysicalCheckList.patPhysicalCheck );
                    layui.form.render();
                }
            }
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.physicalCheckId)){
                    saveOrEdit(data.physicalCheckId);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确认删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.physicalCheckId)){
                        var ids=[];
                        ids.push(data.physicalCheckId);
                        del(ids);
                    }
                });
            }
        }
    });
    //监听行单击事件（双击事件为：rowDouble）
    table.on('row(patPhysicalCheckList_table)', function(obj){
        var data = obj.data;
        switchLayEvent('detail');
        //表单赋值
        getInfo(data);
        //标注选中样式
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
    });
}

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(data){
    //表单初始赋值
    var form=layui.form; //调用layui的form模块
    //初始化表单元素,日期时间选择器
    var util=layui.util;
    data.checkDate=util.toDateString(data.checkDate,"yyyy-MM-dd");
    patPhysicalCheckList.patPhysicalCheck = data;
    form.val('patPhysicalCheckEdit_form', data);
}
/**
 * 获取单个实体
 */
function switchLayEvent(layEvent){
    patPhysicalCheckList.layEvent = layEvent;
    var form = layui.form; //调用layui的form模块
    if(layEvent == 'add'|| layEvent == 'edit'){
        if(layEvent == 'add'){  //id为空,新增操作
            var data = patPhysicalCheckList.patPhysicalCheck;
            $("#patPhysicalCheckEdit_form").find('input[type=text],select').each(function() {
                if($(this)[0].name != 'patientId'){
                    if($(this)[0].name =='checkDate'){
                        //初始化表单元素,日期时间选择器
                        var util=layui.util;
                        $(this).val(util.toDateString(new Date(),"yyyy-MM-dd"));
                    } else if($(this)[0].name =='checkUserId'){
                        //当前登录用户id
                        $("#checkUserId").find("option[value="+baseFuncInfo.userInfoData.userid+"]").prop("selected",true);
                    } else {
                        $(this).val('');
                    }
                    patPhysicalCheckList.patPhysicalCheck[$(this)[0].name] = $(this).val();
                }
                else{
                    $(this).val(patPhysicalCheckList.patientId);
                }
            });
        }
        if(layEvent == 'edit'){
            if(patPhysicalCheckList.patPhysicalCheck == null || patPhysicalCheckList.patPhysicalCheck.length == 0){
                warningToast("该患者暂无体格数据");
                return false;
            }
        }
        $('#editLayEvent').show();
        $('#patPhysicalCheckList_tool').hide();
        patPhysicalCheckList.readonly = {readonly: false};
        patPhysicalCheckList.disabled = {disabled: false};
    }
    else{
        $('#editLayEvent').hide();
        $('#patPhysicalCheckList_tool').show();
        patPhysicalCheckList.readonly = {readonly: true};
        patPhysicalCheckList.disabled = {disabled: true};
    }
    form.render();
}

/**
 * 删除事件
 * @param ids
 */
function del(ids){
    var param={
        "ids":ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patPhysicalCheck/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功",500);
            var table = layui.table; //获取layui的table模块
            table.reload('patPhysicalCheckList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('patPhysicalCheckList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(isEmpty(patPhysicalCheckList.patPhysicalCheck.physicalCheckId)){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确认删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            ids.push(patPhysicalCheckList.patPhysicalCheck.physicalCheckId);
            del(ids);
        });
    }
}


/**
 * 获取医生列表
 */
function getDoctorRoleList(){
    var param ={
    }
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getDoctorRoleList.do",
        data:param,
        dataType: "json",
        done:function(data){
            patPhysicalCheckList.checkUserIds = data;
            var form=layui.form; //调用layui的form模块
            form.render();
            if(isNotEmpty(patPhysicalCheckList.patPhysicalCheck)){
                $("#checkUserId").find("option[value="+patPhysicalCheckList.patPhysicalCheck.checkUserId+"]").prop("selected",true);
            }
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
    form.on('submit(patPhysicalCheckEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#patPhysicalCheckEdit_submit").trigger('click');
}

/**
 * 保存实体
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save(){  //菜单保存操作
    var url = $.config.services.dialysis + "/patPhysicalCheck/add.do";//新增url
    if(patPhysicalCheckList.layEvent == 'edit'){
        url = $.config.services.dialysis + "/patPhysicalCheck/edit.do";//编辑url
    }
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field; //表单的元素
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data:param,
            dataType: "json",
            done:function(data){
                //成功保存之后的操作，刷新页面
                successToast("保存成功",500);
                var field = {patientId: patPhysicalCheckList.patientId}
                getList(field); //查询列表
                switchLayEvent('detail');

            }
        });
    });
}
// 清空实体对象值
function ClearForm(obj) {
    for (var key in obj){
        obj[key] = ''
        var input = document.getElementsByName(key);
        if (input!=null && input.length > 0){
            if (input[0].type == "text") {
                input[0].value = ''
            } else if (input[0].type == "textarea") {
                input[0].value = ''
            }else if (input[0].type == "select-one") {
                input[0].options[0].selected = true;
            }
        }
    }
}

/**
 * 点击打印事件
 */
function onPrint() {
    var uuid = guid();
    sessionStorage.setItem(uuid, JSON.stringify(patPhysicalCheckList.patPhysicalCheck));
    _layerOpen({
        openInParent: true,
        url: $.config.server + "/patient/patPhysicalCheckListPrint?uuid=" + uuid,
        width: 760, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 900,  // 弹框自定义的高度，方法会自动判断是否超过高度
        title: "体格检查信息打印", // 弹框标题
        btn: ["打印", "取消"],
        done: function (index, iframeWin,layer) {
            var ids = iframeWin.onPrint();
        }
    });
}