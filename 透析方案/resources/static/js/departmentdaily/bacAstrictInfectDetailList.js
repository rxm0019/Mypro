/**
 * bacAstrictInfectDetailList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * @author Chauncey
 * @date 2020/09/01
 * @description 用于展示感控培训知识库开窗。
 * @version 1.0
 */
var bacAstrictInfectDetailList = avalon.define({
    $id: "bacAstrictInfectDetailList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    editIndex:"",
    selData:"" //选中的行的数据
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
        elem: '#bacAstrictInfectDetailList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacAstrictInfectDetailList_search'  //指定的lay-filter
        ,conds:[
            {field: 'title', title: '标题：',type:'input'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('bacAstrictInfectDetailList_table',{
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
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#bacAstrictInfectDetailList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacAstrictInfectDetailList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/bacAstrictInfect/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'radio'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'title', title: '标题'}
            ]]
            ,done: function (res, curr, count) { //查询完成默认选择第一行数据
                // $(".layui-table-view[lay-id='bacAstrictInfectDetailList_table'] .layui-table-body tr[data-index = '0' ]").click()
            }
        },
    });
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(bacAstrictInfectDetailList_submit)', function(data){
        //通过表单验证后
        var table = layui.table; //获取layui的table模块
        var checkStatus = table.checkStatus('bacAstrictInfectDetailList_table'); //test即为基础参数id对应的值
        var data = checkStatus.data; //获取选中行的数据
        //通过表单验证后
        var field = data; //获取提交的字段
        if (data.length == 0) {
            warningToast("请至少选择一条记录");
            return false;
        } else if(data.length != 1) {
            warningToast("仅能选择一条记录");
            return false;
        }
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacAstrictInfectDetailList_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        try {
            parent.layui.layedit.setContent(parent.bacInfectTrainEdit.editIndex, field[0].content);
            parent.layer.close(index);//关闭当前页
        }catch (e) {

        }
    });



}




