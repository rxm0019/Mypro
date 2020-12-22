/**
 * bacScheduleTemplateList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 患者排班模板主表
 * @Author xcj
 * @version: 1.0
 * @Date 2020/11/28
 */
var bacScheduleTemplateList = avalon.define({
    $id: "bacScheduleTemplateList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    copyDay:'',//日期
    templateType:'0',//默认是按班次
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var form=layui.form; //调用layui的form模块
        bacScheduleTemplateList.copyDay=GetQueryString("copyDay");  //接收变量

        getList();  //查询列表
        form.on('radio(templateType)', function (data) {
            if (data.value == "0") {
                $("select[name='scheduleShift']").attr("disabled",false);
            }else {
                $("select[name='scheduleShift']").attr("disabled","disabled");
            }
            bacScheduleTemplateList.templateType = data.value;
            getList(data.value);  //查询列表
            layui.form.render();
        });
        avalon.scan();
    });
});

/**
 * 查询列表事件
 */
function getList(templateType) {
    var param = {
        templateType:bacScheduleTemplateList.templateType
    };
    if(isNotEmpty(templateType)){
        param.templateType = templateType;
    }
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#bacScheduleTemplateList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacScheduleTemplateList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-100', //table的高度，页面最大高度减去差值
            url: $.config.services.schedule + "/bacScheduleTemplate/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'templateName', title: '模板名称',align: 'center'}
                ,{field: 'userName', title: '建立人员',align: 'center'}
                ,{field: 'createTime', title: '建立日期',align:'center',templet: function(d){
                    return util.toDateString(d.createTime,"yyyy-MM-dd");
                }}
                ,{fixed: 'right',title: '操作',width: 200, align:'center'
                    ,toolbar: '#bacScheduleTemplateList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.scheduleTemplateId)){
                    show(data.scheduleTemplateId);
                }
            }if(layEvent === 'add'){ //编辑
                //do something
                if(isNotEmpty(data.scheduleTemplateId)){
                    layer.confirm('导入模板数据将会覆盖当前数据，确认导入所选记录吗？', function(index){
                        layer.close(index);
                        push(data.scheduleTemplateId);
                    });
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确认删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.scheduleTemplateId)){
                        del(data.scheduleTemplateId);
                    }
                });
            }
        }
    });
}

function show(id){
    var url=$.config.server + "/backstage/bacScheduleDetailList?scheduleTemplateId="+id+"&templateType="+bacScheduleTemplateList.templateType;
    var title="编辑模板";
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:1800, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:1600,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        btn:[],
        done:function(index,iframeWin){
        }
    });
}

/**
 * 导入排班模板
 */
function push(id){
    var scheduleShift =  $("select[name='scheduleShift']").val();
    var param={
        "scheduleTemplateId":id,
        "copyDay":bacScheduleTemplateList.copyDay,
        "scheduleShift":scheduleShift,
        "templateType":bacScheduleTemplateList.templateType
    };
    _ajax({
        type: "POST",
        url: $.config.services.schedule + "/bacScheduleDetail/pushScheduleDetail.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("导入成功");
        }
    });
}

/**
 * 删除事件
 * @param ids
 */
function del(id){
    var param={
        "id":id
    };
    _ajax({
        type: "POST",
        url: $.config.services.schedule + "/bacScheduleTemplate/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('bacScheduleTemplateList_table'); //重新刷新table
        }
    });
}
