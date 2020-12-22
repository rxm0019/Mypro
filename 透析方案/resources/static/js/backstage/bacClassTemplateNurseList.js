/**
 * bacClassTemplateNurseList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 护士值班模板页面
 * @author: xcj
 * @version: 1.0
 * @date: 2020/08/14
 */
var bacClassTemplateNurseList = avalon.define({
    $id: "bacClassTemplateNurseList",
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
        elem: '#bacClassTemplateNurseList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacClassTemplateNurseList_search'  //指定的lay-filter
        ,conds:[
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
            table.reload('bacClassTemplateNurseList_table',{
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
        elem: '#bacClassTemplateNurseList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacClassTemplateNurseList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-80', //table的高度，页面最大高度减去差值
            url: $.config.services.schedule + "/bacClassTemplate/listTemplateNurse.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'userName', title: '姓名', align:'center'}
                ,{field: 'templateMon', title: '星期一',align:'center',templet: function(d){
                    return d.templateMon + '<br>' + d.partMon;
                }}
                ,{field: 'templateTue', title: '星期二',align:'center',templet: function(d){
                    return d.templateTue + '<br>' + d.partTue;
                }}
                ,{field: 'templateWed', title: '星期三',align:'center',templet: function(d){
                    return d.templateWed + '<br>' + d.partWed;
                }}
                ,{field: 'templateThur', title: '星期四',align:'center',templet: function(d){
                    return d.templateThur + '<br>' + d.partThur;
                }}
                ,{field: 'templateFri', title: '星期五',align:'center',templet: function(d){
                    return d.templateFri + '<br>' + d.partFri;
                }}
                ,{field: 'templateSat', title: '星期六',align:'center',templet: function(d){
                    return d.templateSat + '<br>' + d.partSat;
                }}
                ,{field: 'templateSun', title: '星期日',align:'center',templet: function(d){
                    return d.templateSun + '<br>' + d.partSun;
                }}
                ,{fixed: 'right',title: '操作',width: 140, align:'center'
                    ,toolbar: '#bacClassTemplateNurseList_bar'}
            ]],
            done:function () {
                $("[lay-id='bacClassTemplateNurseList_table'] .layui-table-cell").css({ 'height': 'auto','text-align': 'center','line-height': '20px'})
            }
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.userId)){
                    saveOrEdit(data.userId,data.userName,data.classTemplateId);
                }
            }
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(userId,userName,templateId){
    var url="";
    var title="";
    if(isEmpty(templateId)){  //id为空,新增操作
        title="新增";
        url=$.config.server + "/backstage/bacClassTemplateNurseEdit?userId="+userId+"&userName="+userName;
    }else{  //编辑
        title="编辑";
        url=$.config.server + "/backstage/bacClassTemplateNurseEdit?userId="+userId
            +"&userName="+userName+"&templateId="+templateId;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:600,  //弹框自定义的高度，方法会自动判断是否超过高度
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
                    var table = layui.table; //获取layui的table模块
                    table.reload('bacClassTemplateNurseList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 重新排班
 */
function reScheduling() {
    var url=$.config.server + "/backstage/templateReScheduling?type=2";
    var title="重新排班";
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:500, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:250,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("操作成功");
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}
