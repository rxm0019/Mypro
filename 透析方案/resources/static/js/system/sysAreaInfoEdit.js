/**
 * 区域数据表
 * @author: Gerald
 * @version: 1.0
 * @date: 2020/08/30
 */
var areaInfoEdit = avalon.define({
    $id: "areaInfoEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    id:"",
    type:"",
    parentName:"",
    parentCode:"",
    areaCode:"",
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        laydate.render({
            elem: '#createTime'
            ,type: 'date'
        });
        areaInfoEdit.id=GetQueryString("id");  //接收变量
        areaInfoEdit.type=GetQueryString("type");  //接收变量
        areaInfoEdit.parentName=GetQueryString("parentName");  //接收变量
        areaInfoEdit.parentCode=GetQueryString("parentCode");  //接收变量
        areaInfoEdit.areaCode=GetQueryString("areaCode");  //接收变量
        //编辑，获取实体信息
        if(areaInfoEdit.type == "2"){
            getInfo(areaInfoEdit.id,function(data){
                //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
                //...
            });
        }else {//新增
            if(isNotEmpty(areaInfoEdit.id)){//新增下级
                $("#parentCode").val(areaInfoEdit.parentCode);
                var form=layui.form; //调用layui的form模块
                //表格赋值
                form.val('areaInfoEdit_form', {
                    parentId:areaInfoEdit.id,
                    parentName:areaInfoEdit.parentName,
                    parentCode:areaInfoEdit.parentCode
                });
            }else {//新增第一级

            }

        }

        avalon.scan();
    });
});

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getInfo(id,$callback){
    if(isEmpty(id)){
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    }else{
        //编辑
        var param={
            "id":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.system+"/sysAreaInfo/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.createTime=util.toDateString(data.createTime,"yyyy-MM-dd");

                form.val('areaInfoEdit_form', data);
                $("#oldAreaCode").val(data.areaCode)
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}
/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(areaInfoEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#areaInfoEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field; //表单的元素
        param['oldAreaCode']=$("#oldAreaCode").val()
        if(isNotEmpty(areaInfoEdit.id) && areaInfoEdit.type == "1"){//新增下级
            param.parentId = areaInfoEdit.id;
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.system+"/sysAreaInfo/add.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}

