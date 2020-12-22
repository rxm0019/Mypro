/**
 * tesApplySampleList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 检验检查--检验检体采检
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/21
 */
var tesApplySampleList = avalon.define({
    $id: "tesApplySampleList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    constant:$.constant,
    applySendStatus:'',//送检状态
    applyId:'',//检验申请单id
    tesApply:'',
    tesApplyItemList:[],
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var applyId=GetQueryString("applyId");  //接收变量
        if(isNotEmpty(applyId)){
            tesApplySampleList.applyId = applyId;
        } else {
            warningToast("请选择申请单");
            return false;
        }
        getInfo(tesApplySampleList.applyId);
        getList(tesApplySampleList.applyId);  //查询列表
        avalon.scan();
    });
});

/**
 * 获取申请单信息和检验明细列表
 */
function getInfo(applyId) {
    var param={
        "applyId":applyId
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/tesApply/getInfo.do",
        data:param,
        dataType: "json",
        done:function(data){
            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            //初始化表单元素,日期时间选择器
            var util=layui.util;
            var formData = {};
            tesApplySampleList.tesApplyItemList.clear();
            tesApplySampleList.tesApply = data.tesApply;
            var patPatientInfo = data.patPatientInfo;
            tesApplySampleList.tesApplyItemList.pushArray(data.tesApplyItemList);

            formData.applyId = tesApplySampleList.tesApply.applyId;
            formData.applyDate = util.toDateString(tesApplySampleList.tesApply.applyDate,"yyyy-MM-dd");
            formData.hospitalName = tesApplySampleList.tesApply.hospitalName;
            formData.mechanism = getSysDictName($.dictType.HospitalInspection,tesApplySampleList.tesApply.mechanism);
            formData.illness = tesApplySampleList.tesApply.illness;
            formData.purpose = tesApplySampleList.tesApply.purpose;
            formData.sourceType = tesApplySampleList.tesApply.sourceType;
            formData.relationId = tesApplySampleList.tesApply.relationId; //申请单关联透析、门诊id
            tesApplySampleList.applyStatus = tesApplySampleList.tesApply.applyStatus;//申请单状态
            tesApplySampleList.applySendStatus = tesApplySampleList.tesApply.applySendStatus;//送检状态

            formData.patientId = tesApplySampleList.tesApply.patientId;
            formData.patientName = patPatientInfo.patientName;
            formData.gender =getSysDictName("Sex", patPatientInfo.gender);
            formData.patientAge = getAge(patPatientInfo.birthday,tesApplySampleList.newDate);
            formData.patientRecordNo = patPatientInfo.patientRecordNo;

            debugger
            form.val('tesApplySampleList_form', formData);
            creatItemTable(tesApplySampleList.tesApplyItemList);
        }
    });
}


function creatItemTable(tesApplyItemList) {
    _layuiTable({
        elem: '#tesApplyList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'tesApplyList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-580', //table的高度，页面最大高度减去差值
            data:tesApplyItemList,
            page: false,
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'orderName', title: '检验项目',align:'center'}
                ,{field: 'examination', title: '标本',align:'center',templet: function(d){
                    return getSysDictName($.dictType.Examination,d.examination);
                }}
                ,{field: 'testType', title: '检验类型',align:'center',templet: function(d){
                    return getSysDictName($.dictType.SampleType,d.testType);
                }}
                ,{field: 'examination', title: '单价/元',align:'center',templet: function(d){
                    return d.salesPrice+" 元/次";
                }}
            ]]
        }
    });
}

/**
 * 查询列表事件
 */
function getList(applyId) {
    var param = {
        applyId:applyId
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#tesApplySampleList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'tesApplySampleList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-580', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/tesApplySample/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'sampleCode', title: '检验条码',align:'center'}
                ,{field: 'checkoutName', title: '检验项目名称',align:'center'}
                ,{field: 'examination', title: '标本类型',align:'center',templet: function(d){
                    return getSysDictName($.dictType.Examination,d.examination);
                }}
                ,{field: 'testType', title: '检验类型',align:'center',templet: function(d){
                    return getSysDictName($.dictType.SampleType,d.testType);
                }}
                ,{field: 'describable', title: '标本状况',align:'center'}
                ,{fixed: 'right',title: '操作',width: 140, align:'center',
                    toolbar: '#tesApplySampleList_bar'
                }
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.applySampleId)){
                    saveOrEdit(data.applySampleId);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.applySampleId)){
                        del(data.applySampleId);
                    }
                });
            }
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(id){
    var url="";
    var title="";
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server + "/examine/tesApplySampleEdit?applyId="+tesApplySampleList.tesApply.applyId;
    }else{  //编辑
        title="编辑";
        url=$.config.server + "/examine/tesApplySampleEdit?applySampleId="+id;
    }

    _layerOpen({
        openInParent: true,
        url:url,  //弹框自定义的url，会默认采取type=2
        width:550, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:600,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin,layer){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('tesApplySampleList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 送检
 */
function send() {
    layer.confirm('温馨提示：送检后将不能编辑标本', function(index){
        layer.close(index);
        var param={
            "applyId":tesApplySampleList.applyId
        };
        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/tesApplySample/send.do",
            data:param,  //必须字符串后台才能接收list,
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            dataType: "json",
            done: function(data){
                successToast("送检成功");
                tesApplySampleList.applySendStatus = $.constant.ApplySendStatus.SENT;
                var table = layui.table; //获取layui的table模块
                table.reload('tesApplySampleList_table'); //重新刷新table
            }
        });
    });
}

/**
 * 取消送检
 */
function back() {
    var param={
        "applyId":tesApplySampleList.applyId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/tesApplySample/backSend.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("取消成功");
            tesApplySampleList.applySendStatus = $.constant.ApplySendStatus.NO_SEND;
            var table = layui.table; //获取layui的table模块
            table.reload('tesApplySampleList_table'); //重新刷新table
        }
    });
}

/**
 * 删除事件
 * @param ids
 */
function del(applySampleId){
    var param={
        "applySampleId":applySampleId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/tesApplySample/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('tesApplySampleList_table'); //重新刷新table
        }
    });
}

/**
 * 打印
 */
function printMethod(){
    if(isEmpty(tesApplySampleList.applyId)){
        warningToast("请选择申请单");
        return false;
    }
    _layerOpen({
        url: $.config.server + "/examine/tesApplySamplePrint?applyId="+tesApplySampleList.applyId,
        width: 1062, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 1000,  // 弹框自定义的高度，方法会自动判断是否超过高度
        title: "打印申请单", // 弹框标题
        btn: ["打印", "取消"],
        done: function (index, iframeWin) {
            var ids = iframeWin.onPrint();
        }
    });
}