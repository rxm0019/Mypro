/**
 * eduNurseEdit.jsp的js文件，包括查询，编辑操作
 * 健康教育--患者分组编辑页面
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/8
 */
var eduNurseEdit = avalon.define({
    $id: "eduNurseEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    nurseId:'',//护士id
    patientList:[],//所有患者列表
    selectPatientList:[],//选中的患者列表
});

layui.use(['index', 'transfer'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var transfer = layui.transfer;
        //所有的入口事件写在这里...
        eduNurseEdit.nurseId=GetQueryString("id");  //接收变量
        //获取实体信息
        getInfo(function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            transfer.render({
                elem: '#patientList'
                , title: ['未选患者', '已选患者']
                , data: eduNurseEdit.patientList
                , value: eduNurseEdit.selectPatientList
                , height:450
                , parseData: function (res) {
                    return {
                        "value": res.patientId //数据值
                        , "title": res.patientName //数据标题
                    }
                }
                , id: 'transferId' //定义唯一索引
                , showSearch: true
            })
        });
        avalon.scan();
    });
});

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getInfo($callback){
    //编辑
    var param={
        "nurseId":eduNurseEdit.nurseId
    };
    debugger
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/patPatientInfo/getPrincipalInfo.do",
        data:param,
        dataType: "json",
        done:function(data){
            eduNurseEdit.patientList.clear();
            eduNurseEdit.selectPatientList.clear();
            //所有患者--添加有责任护士的患者
            eduNurseEdit.patientList.pushArray(data.principalList);
            //所有患者--添加无责任护士的患者
            eduNurseEdit.patientList.pushArray(data.patientList);
            $.each(data.principalList, function (index, item) {
                eduNurseEdit.selectPatientList.push(item.patientId);
            });
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}


/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作

    var selectList = layui.transfer.getData('transferId'); //获取右侧数据
    var beforeSelect = eduNurseEdit.selectPatientList.toString();
    var afterSelect = "";
    var newSelect = [];
    var delSelect = [];
    $.each(selectList, function (index, item) {
        afterSelect += item.value + ",";
        //判断是否新增
        if(beforeSelect.indexOf(item.value) == -1){
            newSelect.push(item.value);
        }
    });
    $.each(eduNurseEdit.selectPatientList, function (index, item) {
        //判断是否删除
        if(afterSelect.indexOf(item) == -1){
            delSelect.push(item);
        }
    });
    var param={
        newSelectIds:newSelect.toString(),
        delSelectIds:delSelect.toString(),
        nurseId:eduNurseEdit.nurseId
    }; //表单的元素
    debugger
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/patPatientInfo/editPrincipalNurse.do",
        data:param,
        dataType: "json",
        done:function(data){
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}



