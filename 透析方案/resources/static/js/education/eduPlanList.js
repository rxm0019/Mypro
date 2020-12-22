/**
 * eduPlanList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 健康教育--教育计划
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/9
 */
var eduPlanList = avalon.define({
    $id: "eduPlanList",
    baseFuncInfo: baseFuncInfo//底层基本方法
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
        elem: '#eduPlanList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'eduPlanList_search'  //指定的lay-filter
        ,conds:[
            {field: 'patientName', title: '患者姓名：',type:'input'}
            ,{field: 'principalNurse',type:'select', title: '责任护士：'}
            ,{field: 'sustainType',type:'select', title: '患者类型：'
                ,data:getSustainType()} //加载数据字典
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            getPrincipalNurse(filter,data);
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('eduPlanList_table',{
                where:field
            });
        }
    });
}

/**
 * 患者类型
 */
function getSustainType() {
    var data = [];
    data.push({value: "", name: "全部"});
    data.push({value: "0", name: "新患者"});
    data.push({value: "1", name: "维持患者"});
    return data;
}

/**
 * 查询列表事件
 */
function getList() {
    var principalNurse = "";
    if(eduPlanList.baseFuncInfo.userInfoData.userType == $.constant.userType.nurse){
        principalNurse = eduPlanList.baseFuncInfo.userInfoData.userid;
    }
    var param = {
        principalNurse:principalNurse
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#eduPlanList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'eduPlanList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-145', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patPatientInfo/listEduPlanPatient.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'patientName', title: '患者姓名',align:'center'}
                ,{field: 'patientRecordNo', title: '病历号',align:'center'}
                ,{field: 'sustainType', title: '患者类型',align:'center',templet: function(d){
                    if(d.sustainType == $.constant.sustainType.newPatient){
                        return "新患者";
                    }else  if(d.sustainType == $.constant.sustainType.keepPatient){
                        return "维持性患者";
                    }else {
                        return "";
                    }
                }}
                ,{field: 'userName', title: '责任护士',align:'center'}
                ,{fixed: 'right',title: '操作',width: 200, align:'center'
                    ,toolbar: '#eduPlanList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'add'){
                //do something
                if(isNotEmpty(data.patientId)){
                    if(isNotEmpty(data.patientId)){
                        var ids=[];
                        ids.push(data.patientId);
                        saveOrEdit(ids);
                    }
                }
            }else if(layEvent === 'edit'){
                if(data.sustainType == $.constant.sustainType.newPatient){
                    layer.confirm('是否转为维持性患者？', function(index){
                        layer.close(index);
                        if(isNotEmpty(data.patientId)){
                            editSustainType(data.patientId,$.constant.sustainType.keepPatient);
                        }
                    });
                }else {
                    layer.confirm('是否转为新患者？', function(index){
                        layer.close(index);
                        if(isNotEmpty(data.patientId)){
                            editSustainType(data.patientId,$.constant.sustainType.newPatient);
                        }
                    });
                }
            }
        }
    });
}

/**
 * 批量制定计划
 * @returns {boolean}
 */
function batchAdd(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('eduPlanList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        var ids=[];
        $.each(data,function(i,item){
            ids.push(item.patientId);
        });
        saveOrEdit(ids);
    }
}



/**
 * 获取单个实体
 */
function saveOrEdit(ids){
    var url="";
    var title="";
    if(ids.length<=0){
        warningToast('至少选择一笔记录');
        return false;
    }
    var uuid = guid();
    sessionStorage.setItem(uuid, JSON.stringify(ids));    //选中的患者数据存进缓存，key: uuid,   value: 患者id数据
    title="新增";
    url=$.config.server+"/education/eduPlanEdit?uuid=" + uuid;

    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:550, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:550,  //弹框自定义的高度，方法会自动判断是否超过高度
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
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 获取责任护士下拉
 * @param filter
 * @param formData
 */
function getPrincipalNurse(filter,formData) {
    var param = {
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysUser/listPrincipalNurse.do",
        data:param,  //必须字符串后台才能接收list,
        dataType: "json",
        done: function(data){
            var form=layui.form; //调用layui的form模块
            var htmlStr ='<option value="">全部</option>';
            $.each(data,function(i,item){
                htmlStr+='<option value="'+item.id+'">'+item.userName+'</option>';
            });
            $("select[name='principalNurse']").html(htmlStr);
            //刷新表单渲染
            form.render();
            //表单重新赋值
            //如果是护士角色，可默认选中
            if(eduPlanList.baseFuncInfo.userInfoData.userType == $.constant.userType.nurse){
                formData.principalNurse = eduPlanList.baseFuncInfo.userInfoData.userid;
            }
            form.val(filter, formData);
        }
    });
}

/**
 * 编辑患者维持类型
 * @param ids
 */
function editSustainType(patientId,sustainType){
    var param={
        "patientId":patientId,
        "sustainType":sustainType
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patPatientInfo/editSustainType.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("操作成功");
            var table = layui.table; //获取layui的table模块
            table.reload('eduPlanList_table'); //重新刷新table
        }
    });
}

/**
 * 微信推送功能
 * 计划添加微信推送只是添加到计划里面
 * 此微信推送按钮会立即推送微信公众号并且添加数据到教育记录，教育方式为微信推送
 */
function sendWeChat() {

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
        url: $.config.services.system + "/sysUser/listPrincipalNurse.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('eduPlanList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('eduTeachList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.teachId);
            });
            del(ids);
        });
    }
}

