/**
 * Created by huoquan on 2017/9/28.
 */
var ztreeObj;
var sysOpenTree = avalon.define({
    $id: "sysOpenTree",
    baseFuncInfo: baseFuncInfo//底层基本方法
});
layui.use(['index'], function(){
    avalon.ready(function () {
        var util = layui.util;
        var form = layui.form;
        //执行
        util.fixbar({});
        form.on('submit(sysOpenTree_search)', function(data){
            //搜索事件
            ztreeObj.searchTree(data.field.searchnName);
        });
        avalon.scan();
    });
});

//获取树结点列表
function initSysZtree(setting,data){
    ztreeObj=_initZtree($("#sysOpenTree"),setting,data);
}

//确定事件，获取全部勾选的
function getCheckedList($callback){
    var nodes= ztreeObj.getCheckedList();
    typeof $callback=== 'function' && $callback(nodes);
}