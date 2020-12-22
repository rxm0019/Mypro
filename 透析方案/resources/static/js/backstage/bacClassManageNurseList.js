/**
 * bacClassManageNurseList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 护士班种管理
 * @author: xcj
 * @version: 1.0
 * @date: 2020/08/13
 */
var bacClassManageNurseList = avalon.define({
    $id: "bacClassManageNurseList",
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


function getList() {
    var param = {
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;

    param.manageType = "2"; //护士班种页面

    _layuiTable({
        elem: '#bacClassManageNurseList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacClassManageNurseList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-80', //table的高度，页面最大高度减去差值
            url: $.config.services.schedule + "/bacClassManage/listManageNurse.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'className', title: '班种', align:'center'}
                ,{field: 'classAttr', title: '班种属性' , align:'center',templet: function(d){
                    if(d.classAttr == '0'){
                        return '缺勤';
                    }
                    if(d.classAttr == '1'){
                        return '出勤';
                    }
                    if(d.classAttr == '2'){
                        return '休息';
                    }
                    if(d.classAttr == '3'){
                        return '加班';
                    }
                }}
                ,{field: 'classPart', title: '时段', align:'center'}
                ,{field: 'dataStatus', title: '状态', align:'center',templet: function(d) {
                    return getSysDictName("sys_status",d.dataStatus)
                }}
                ,{field: 'classWorked', title: '工时', align:'center'}
                ,{fixed: 'right',title: '操作',width: 140, align:'center'
                    ,toolbar: '#bacClassManageNurseList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.classManageId)){
                    saveOrEdit(data.classManageId);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.classManageId)){
                        var ids=[];
                        ids.push(data.classManageId);
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
function saveOrEdit(id){
    var url="";
    var title="";
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server+"/backstage/bacClassManageNurseEdit";
    }else{  //编辑
        title="编辑";
        url=$.config.server+"/backstage/bacClassManageNurseEdit?id="+id;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:800,  //弹框自定义的高度，方法会自动判断是否超过高度
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
function del(ids){
    var param={
        "ids":ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.schedule+"/bacClassManage/deleteNurse.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('bacClassManageNurseList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('bacClassManageNurseList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.classManageId);
            });
            del(ids);
        });
    }
}

