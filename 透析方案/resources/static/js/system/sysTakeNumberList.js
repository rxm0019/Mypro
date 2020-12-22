/**
 * 编码规则
 * @author: Gerald
 * @version: 1.0
 * @date: 2020/09/08
 */
var sysTakeNumberList = avalon.define({
    $id: "sysTakeNumberList",
    baseFuncInfo: baseFuncInfo//底层基本方法
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        getList();  //查询列表
        avalon.scan();
    });
});

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
        elem: '#sysTakeNumberList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'sysTakeNumberList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url:$.config.services.system+ "/sysTakeNumber/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                 {field: 'name', title: '类别'}
                ,{field: 'prefix', title: '首字母',width: 80}
                ,{field: 'numberLen', title: '流水号长度',width: 100,align:'right'}
                ,{field: 'number', title: '目前流水号',width: 100,align:'right'}
                ,{fixed: 'right',title: '操作',width: 180, align:'center'
                    ,toolbar: '#sysTakeNumberList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit'){ //编辑
                layer.confirm('编辑后将重新编码，可能会影响系统正常运行，确定编辑吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送编辑指令
                    //do something
                    if(isNotEmpty(data.takeNumberId)){
                        saveOrEdit(data.takeNumberId);
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
        url=$.config.server + "/system/sysTakeNumberEdit";
    }else{  //编辑
        title="编辑";
        url=$.config.server + "/system/sysTakeNumberEdit?id="+id;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:500,  //弹框自定义的高度，方法会自动判断是否超过高度
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
                    table.reload('sysTakeNumberList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

