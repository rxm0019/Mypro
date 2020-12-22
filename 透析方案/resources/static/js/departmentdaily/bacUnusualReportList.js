/**
 * bacUnusualReportList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * @author: Chauncey
 * @version: 1.0
 * @date: 2020/08/12
 */
var bacUnusualReportList = avalon.define({
    $id: "bacUnusualReportList",
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
        elem: '#bacUnusualReportList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacUnusualReportList_search'  //指定的lay-filter
        ,conds:[
            {field: 'occurDate', title: '发生日期',type:'date_range'}
            ,{field: 'sickId', title: '患者姓名',type:'input'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
            $('input[name="occurDate_begin"]').prop("readonly", true);
            $('input[name="occurDate_end"]').prop("readonly", true);
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('bacUnusualReportList_table',{
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
    _layuiTable({
        elem: '#bacUnusualReportList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacUnusualReportList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/bacUnusualReport/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {/*fixed: 'left',*/type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'occurDate', title: '发生日期',align:'center',width:120
                    ,templet: function(d){
                    return util.toDateString(d.occurDate,"yyyy-MM-dd");
                }}
                ,{field: 'sickId', title: '病患姓名',width:100,align: 'center'}

                ,{field: 'unusualItem', title: '异常事件项目',width:150
                    ,templet: function(d){
                    var unusualItemArr = d.unusualItem.split(',');
                    var templetHtml='';
                    if(unusualItemArr.length>0){
                        for(var index in unusualItemArr){
                            if(index != 0){
                                templetHtml+="<div style='margin:0;padding:5px 15px;width: 100%; min-height: 28px; border-top: 1px solid #e6e6e6'>"
                            }else{
                                templetHtml+="<div style='margin:0;padding:5px 15px;width: 100%; border:none'>"
                            }
                            templetHtml+=getSysDictName("AbnormalEventItem",unusualItemArr[index]);
                            templetHtml+="</div>";
                            //templetHtml+=getSysDictName("AbnormalEventItem",unusualItemArr[index])+'<br />';
                        }
                    }
                    return templetHtml;
                }
                }
                ,{field: 'whetherHurt', title: '异常事件造成患者伤害',width: 200,align:'left'
                    ,templet: function(d){
                    //返回数据字典的名称
                        if(getSysDictName("YesOrNo",d.whetherHurt)=="是"){
                            return '是，未及时抢救，造成伤害。';
                        }else{
                            return '否，及时抢救，未造成伤害。';
                        }
                        //return getSysDictName("YesOrNo",d.whetherHurt);
                    }}
                ,{field: 'hurtExplain', title: '是否造成患者伤害的说明',width: 200,align:'left'}
                ,{field: 'wholeStory', title: '事情经过',width:250,align:'left'}
                ,{field: 'improve', title: '处理及改善建议',width: 250,align:'left'}
                ,{field: 'traceResult', title: '病患结果追踪',width:250,align:'left'}
                ,{field: 'suggestDoctor', title: '医师建议',width:250,align:'left'}
                ,{field: 'suggestNurse', title: '护士长建议',width:250,align:'left'}
                ,{field: 'signatureDoctor', title: '医师签名',width: 100,align: 'center'}
                ,{field: 'signatureNurse', title: '护士长签名',width: 100,align: 'center'}
                ,{field: 'createBy', title: '填写人',width: 100,align:'center'}
                ,{/*fixed: 'right',*/title: '操作',width: 180, align:'center'
                    ,toolbar: '#bacUnusualReportList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit'|| layEvent === 'detail'){ //编辑和详情
                //do something
                if(isNotEmpty(data.unusualReportId)){
                    saveOrEdit(data.unusualReportId,layEvent);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.unusualReportId)){
                        var ids=[];
                        ids.push(data.unusualReportId);
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
function saveOrEdit(id,layEvent){
    var url="";
    var title="";
    var readonly = false;
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server+"/departmentdaily/bacUnusualReportEdit";
    }else{  //编辑
        if(layEvent === "edit"){
            title = "编辑";
        }else {
            title = "详情";
            readonly = true;
        }
        url=$.config.server+"/departmentdaily/bacUnusualReportEdit?id="+id + "&layEvent=" + layEvent;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:850, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:550,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        readonly:readonly,//只读
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    //获取layui的table模块
                    var table = layui.table;
                    //重新刷新table
                    table.reload('bacUnusualReportList_table');
                    //如果设定了yes回调，需进行手工关闭
                    layer.close(index);
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
        url: $.config.services.logistics + "/bacUnusualReport/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('bacUnusualReportList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    //获取layui的table模块
    var table = layui.table;
    //test即为基础参数id对应的值
    var checkStatus = table.checkStatus('bacUnusualReportList_table');
    //获取选中行的数据
    var data=checkStatus.data;
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.unusualReportId);
            });
            del(ids);
        });
    }
}

/**
 * 导出excel
 */
function onExportExcel() {
    _downloadFile({
        url: $.config.services.logistics + "/bacUnusualReport/export.do",
        data: getSearchParam(),
        fileName: '异常事件汇报列表.xlsx'
    });
}

/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var searchParam = layui.form.val("bacUnusualReportList_search");
    return $.extend({
        occurDate: '',
        sickId: ''
    }, searchParam)
}

