/**
 * 推送执行设置编辑
 * @author: hhc
 * @version: 1.0
 * @date: 2020/9/17
 */
var sysPushManageEdit = avalon.define({
    $id: "sysPushManageEdit",
    masterId: "", //传入的Id
    pushType:"",    //传入的推送类型
    pushName:"",     //传入的名称
    pushCode:"",    //传入的编码
    pushHospitalNo:"", //推送医院代号
    currentHospitalNo:"",  //当前登录医院
    baseFuncInfo: baseFuncInfo,  //底层基本方法
    selectHospitalId: [],//选中医院
    hospitalDataArr: [],//初始化数据源
    sysPushEditList:{}  //接收参数对象
});

layui.use(['index', 'layer', 'transfer', 'util'], function () {
    var transfer = layui.transfer;
    var layer = layui.layer;
    var util = layui.util;

    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var uuid = GetQueryString("uuid");
        sysPushManageEdit.currentHospitalNo = baseFuncInfo.userInfoData.hospitalNo;
        sysPushManageEdit.sysPushEditList=JSON.parse(window.sessionStorage.getItem(uuid));
        window.sessionStorage.removeItem(uuid);
        //所有的入口事件写在这里...
        getHospitals();//获取医院列表
        //调用穿梭框
        transfer.render({
            elem: '#queryResultSetting',
            title: ['可选医院', '选中医院'],
            data: sysPushManageEdit.hospitalDataArr,
            value: sysPushManageEdit.selectHospitalId,
            width: 335,
            height: 400,
            parseData: function (res) {
                return {
                    "value": res.hospitalNo //数据值
                    , "title": res.hospitalName //数据标题
                    ,"hospitalNo":res.hospitalNo
                }
            },
            id:'hospitalNo' //定义唯一索引
        });
        avalon.scan();
    });
});

/**
 * 获取医院列表
 */
function getHospitals() {

    var param = {}
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system +"/listHospitalRoles.do",
        data: param,
        dataType: "json",
        async: false,
        done: function (data) {
            var hospitalArr = data;
            for (var i = hospitalArr.length - 1; i >= 0; i--) {
                var item = hospitalArr[i];
                if (item.hospitalNo === sysPushManageEdit.currentHospitalNo) { //可选医院排除掉当前登录医院
                    hospitalArr.splice(i, 1);
                }
            }
            //给穿梭框赋值
            sysPushManageEdit.hospitalDataArr = hospitalArr;
        }
    });

}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(sysPushManageEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#sysPushManageEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    var optionDataList = layui.transfer.getData('hospitalNo'); //获取穿梭框右侧数据
    if (optionDataList.length == 0) {
        warningToast("请至少选择一家医院");
        return false;
    }
    var sysPushList=[];
    optionDataList.forEach (function (item, index) {
        sysPushManageEdit.sysPushEditList.ids.forEach(function (masterId, i) {
            var node={};
            node.pushHospitalNo=item.hospitalNo;
            node.masterId = masterId;
            node.pushName = sysPushManageEdit.sysPushEditList.pushName[i];
            node.pushCode = sysPushManageEdit.sysPushEditList.pushCode[i];
            node.pushType = sysPushManageEdit.sysPushEditList.pushType;
            sysPushList.push(node);
        })
    }) ;
    //可以继续添加需要上传的参数
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.platform + "/sysPushManage/saveOrEdit.do",
        data: JSON.stringify(sysPushList),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        done: function (data) {
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}

