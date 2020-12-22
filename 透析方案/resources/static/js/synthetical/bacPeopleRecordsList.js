/**
 * bacPeopleRecordsList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * @author carl
 * @date 2018/08/10
 * @description 用于展示人员档案信息
 * @version 1.0
 */
var bacPeopleRecordsList = avalon.define({
    $id: "bacPeopleRecordsList",
    peopletype:GetQueryString("peopletype"),
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
        elem: '#bacPeopleRecordsList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacPeopleRecordsList_search'  //指定的lay-filter
        ,conds:[
            {field: 'name', title: '姓名：',type:'input'}
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
            table.reload('bacPeopleRecordsList_table',{
                where:field
            });
        }
    });
}
/**
 * 查询列表事件
 */
function getList() {
    var param = {
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    //医生
    var thisCols =[[]];
    if(bacPeopleRecordsList.peopletype === '0'){
        thisCols = [[ //表头
            {fixed: 'left',type:'checkbox'}  //开启编辑框
            ,{type: 'numbers', title: '序号',width:60 }  //序号
            ,{field: 'name', title: '姓名',width:90}
            ,{field: 'birthday', title: '出生年月',align:'center'
                ,templet: function(d){
                    return d.birthday === null ? '' : util.toDateString(d.birthday,"yyyy-MM-dd");
                },width:155}
            ,{field: 'age', title: '年齡',align:'center',width:90}
            ,{field: 'birthplace', title: '籍贯',width:180}
            ,{field: 'hiredate', title: '入职日期',align:'center'
                ,templet: function(d){
                    return d.hiredate === null ? '' : util.toDateString(d.hiredate,"yyyy-MM-dd");
                },width:155}
            ,{field: 'title', title: '职称',width:120,align:'center'
                ,templet: function(d){
                    return getSysDictName("Title",d.title);
                }}
            ,{field: 'storeTitle', title: '门店头衔',width:120,align:'center'
                ,templet: function(d){
                    return getSysDictName("StoreTitle",d.storeTitle);
                }}
            ,{field: 'clinicalYear', title: '临床年资',width:120,align:'center'}
            ,{field: 'hemodialysisYear', title: '血透年资',width:120,align:'center'}
            ,{field: 'idcardType', title: '证件',width:120,align:'center'
                ,templet: function(d){
                    return getSysDictName("IdCardType",d.idcardType)+":"+d.idcardNo;
                }
            }
            ,{field: 'dataStatus', title: '状态',width:120, align:'center'
                ,templet: function(d) {
                    return getSysDictName("sys_status",d.dataStatus)
                }}
            ,{fixed: 'right',title: '操作', align:'center'
                ,toolbar: '#bacPeopleRecordsList_bar'}
        ]]
    }else if (bacPeopleRecordsList.peopletype === '1'){
        thisCols = [[ //表头
            {fixed: 'left',type:'checkbox'}  //开启编辑框
            ,{type: 'numbers', title: '序号',width:60 }  //序号
            ,{field: 'name', title: '姓名',width:90}
            ,{field: 'birthday', title: '出生年月',align:'center'
                ,templet: function(d){
                    return d.birthday === null ? '' : util.toDateString(d.birthday,"yyyy-MM-dd");
                },width:155}
            ,{field: 'age', title: '年齡',align:'center',width:90}
            ,{field: 'sex', title: '性别',width:70,align:'center'
                ,templet: function(d){
                    return getSysDictName("Sex",d.sex);
                }}
            ,{field: 'birthplace', title: '籍贯',width:180}
            ,{field: 'hiredate', title: '入职日期',align:'center'
                ,templet: function(d){
                    return d.hiredate === null ? '' : util.toDateString(d.hiredate,"yyyy-MM-dd");
                },width:155}
            ,{field: 'title', title: '职称',width:120,align:'center'
                ,templet: function(d){
                    return getSysDictName("Title",d.title);
                }}
            ,{field: 'storeTitle', title: '门店头衔',width:120,align:'center'
                ,templet: function(d){
                    return getSysDictName("StoreTitle",d.storeTitle);
                }}
            ,{field: 'clinicalYear', title: '临床年资',width:120,align:'center'}
            ,{field: 'hemodialysisYear', title: '血透年资',width:120,align:'center'}
            ,{field: 'examine', title: '考核次数',width:120,align:'center'}
            ,{field: 'teaching', title: '是否为带教',width:120,align:'center'
                ,templet: function(d){
                    return d.teaching == 'Y' ? "是" : "否" ;
                }
            }
            ,{field: 'learnCard', title: '是否有进修证',width:120,align:'center'
                ,templet: function(d){
                    return d.learnCard == 'Y' ? "是" : "否" ;
                }
            }
            ,{field: 'affiliation', title: '实际归属门店',width:120,align:'center'}
            ,{field: 'talentsClass', title: '人才分类',width:120,align:'center'
                ,templet: function(d){
                    return getSysDictName("talentsClass",d.talentsClass);
                }}
            ,{field: 'talentsLevel', title: '级别',width:60,align:'center'
                ,templet: function(d){
                    return getSysDictName("talentsLevel",d.talentsLevel);
                }
            }
            ,{field: 'dataStatus', title: '状态',width:60, align:'center'
                ,templet: function(d) {
                    return getSysDictName("sys_status",d.dataStatus)
                }}
            ,{fixed: 'right',title: '操作', align:'center'
                ,toolbar: '#bacPeopleRecordsList_bar'}
        ]];
    }else if (bacPeopleRecordsList.peopletype === '2'){

        thisCols = [[ //表头
            {fixed: 'left',type:'checkbox'}  //开启编辑框
            ,{type: 'numbers', title: '序号' }  //序号
            ,{field: 'name', title: '姓名'}
            ,{field: 'birthday', title: '出生年月',align:'center'
                ,templet: function(d){
                    return d.birthday === null ? '' : util.toDateString(d.birthday,"yyyy-MM-dd");
                },width:155}
            ,{field: 'age', title: '年齡',align:'center',width:90}
            ,{field: 'birthplace', title: '籍贯'}
            ,{field: 'hiredate', title: '入职日期',align:'center'
                ,templet: function(d){
                    return d.hiredate === null ? '' :  util.toDateString(d.hiredate,"yyyy-MM-dd");
                },width:155}
            ,{field: 'position', title: '职位',align:'center'
                ,templet: function(d){
                    return getSysDictName("Position",d.position);
                }}
            ,{field: 'education', title: '学历',align:'center'
                ,templet: function(d){
                    return getSysDictName("EducationLevel",d.education);
                }}
            ,{field: 'dataStatus', title: '状态', align:'center'
                ,templet: function(d) {
                    return getSysDictName("sys_status",d.dataStatus)
                }}
            ,{fixed: 'right',title: '操作', align:'center'
                    ,toolbar: '#bacPeopleRecordsList_bar'}
        ]];
    }



    _layuiTable({
        elem: '#bacPeopleRecordsList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacPeopleRecordsList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-150', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/bacPeopleRecords/list.do/"+bacPeopleRecordsList.peopletype, // ajax的url必须加上$.config.services.logistics方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols:thisCols
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'detail'){ //查看
                if(isNotEmpty(data.peopleRecordsId)){
                    saveOrEdit(data.peopleRecordsId,true);
                }
                //do somehing
            }else if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.peopleRecordsId)){
                    saveOrEdit(data.peopleRecordsId,false);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确定删除此记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.peopleRecordsId)){
                        var ids=[];
                        ids.push(data.peopleRecordsId);
                        del(ids);
                    }
                });
            }
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(id,readonly){
    if(readonly == null || typeof readonly == "undefined"){
        readonly = false;
    }
    var url="";
    var title="";
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server+"/synthetical/bacPeopleRecordsEdit?peopletype="+bacPeopleRecordsList.peopletype;
    }else{  //编辑
        title= readonly ? "详情":"编辑";
        url=$.config.server+"/synthetical/bacPeopleRecordsEdit?id="+id + "&peopletype=" + bacPeopleRecordsList.peopletype+"&readonly="+readonly ;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:850, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:450,  //弹框自定义的高度，方法会自动判断是否超过高度
        readonly:readonly,
        title:title, //弹框标题
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功",500);
                    var table = layui.table; //获取layui的table模块
                    table.reload('bacPeopleRecordsList_table'); //重新刷新table
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
function del(ids){
    var param={
        "ids":ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.logistics+"/bacPeopleRecords/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功",500);
            var table = layui.table; //获取layui的table模块
            table.reload('bacPeopleRecordsList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('bacPeopleRecordsList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.peopleRecordsId);
            });
            del(ids);
        });
    }
}


/**
 * 导出excel
 */
function exportExcel() {
    var fileName = "";
    switch (bacPeopleRecordsList.peopletype) {
        case "0":
            fileName=  '医生档案.xlsx';
            break;
        case "1":
            fileName = '护士档案.xlsx';
            break;
        case "2":
            fileName ='行政人员档案.xlsx';
            break;
        default :
            fileName ="人员档案.xlsx";
    }
    _downloadFile({
        url: $.config.services.logistics + "/bacPeopleRecords/"+bacPeopleRecordsList.peopletype+"/export.do",
        data: getSearchParam(),
        fileName: fileName
    });
}
/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var searchParam = layui.form.val("bacPeopleRecordsList_search");
    return $.extend({
        peopletype: bacPeopleRecordsList.peopletype,
    }, searchParam)
}

