/**
 * attendanceList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * @author Chauncey
 * @date 2020/09/02
 * @description 用于展示感控培训出勤情况开窗。
 * @version 1.0
 */
var attendanceList = avalon.define({
    $id: "attendanceList",
    infectTrainId: "",//传入的ID
    baseFuncInfo: baseFuncInfo,//底层基本方法
    attenDataUserId: [], //计划参加人员/出勤人员
    unAttenDataUserId: [],//缺勤人员
    userLists: [],//所有使用者列表
    attenDataArr: []//初始化数据源
});

layui.use(['index', 'transfer', 'layer', 'util'], function () {
    var transfer = layui.transfer;
    var layer = layui.layer;
    var util = layui.util;
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var id = GetQueryString("id");  //接收变量
        attendanceList.infectTrainId = id;
        //所有的入口事件写在这里...
        getInfo(id);  //查询实体
        getUserList();//获取所有使用者数据，用于查询使用者名字
        //通过出勤人员和缺勤人员，循环组合成数据源，绑定穿梭框
        attendanceList.attenDataArr = [];
        attendanceList.userLists.forEach(function (item) {
            //出勤人员
            for (var value of attendanceList.attenDataUserId) {
                if (value == item.id) {
                    attendanceList.attenDataArr.push(item);
                }
            }
            //缺勤人员
            for (var value of attendanceList.unAttenDataUserId) {
                if (value == item.id) {
                    attendanceList.attenDataArr.push(item);
                }
            }
        })
        //实例调用
        transfer.render({
            elem: '#attendanceData'
            , title: ['出勤人员', '缺勤人员']
            , data: attendanceList.attenDataArr
            , value: attendanceList.unAttenDataUserId
            ,width:'calc(50% - 38px)'
            ,height:'full'
            , parseData: function (res) {
                return {
                    "value": res.id //数据值
                    , "title": res.userName //数据标题
                }
            }
            , id: 'attendanceId' //定义唯一索引
            , showSearch: true
        })
        avalon.scan();
    });
});

/**
 * 获取实体
 * @param id
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(id) {
    if (isEmpty(id)) {
        return;
    } else {
        //编辑
        var param = {
            "infectTrainId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/bacInfectTrain/getInfo.do",
            data: param,
            dataType: "json",
            async: false,
            done: function (data) {
                if (data.joinUser != null) {
                    attendanceList.attenDataUserId = data.joinUser.split(',');
                }
                if (data.absenceUser != null) {
                    attendanceList.unAttenDataUserId = data.absenceUser.split(',');
                }
            }
        });
    }
}

/**
 * 获取计划参加人员列表
 */
function getUserList() {
    var param = {}
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.logistics + "/bacInfectTrain/getUserLists.do",
        data: param,
        dataType: "json",
        async: false,
        done: function (data) {
            attendanceList.userLists = data;
        }
    });
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    debugger
    var unAttenDataList = layui.transfer.getData('attendanceId'); //获取右侧数据
    var leftData = attendanceList.attenDataArr;
    //过滤已经存在于缺勤记录的数据
    for (var val of unAttenDataList){
        leftData = leftData.filter(function(x, index) {
            return x.id != val.value;
        });
    }
    var strUnattenData = funjsonToString(unAttenDataList, 'value');
    var strattenData = funjsonToString(leftData,'id');
    var param = {
        "infectTrainId":attendanceList.infectTrainId,
        "joinUser":strattenData,
        "absenceUser":strUnattenData
    };
    //跳转的URL
    var url = $.config.services.logistics + "/bacInfectTrain/editAtten.do";
    //可以继续添加需要上传的参数
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: url,
        data:param,
        dataType: "json",
        done:function(data){
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}

//提取json数据中某个属性，返回拼接字符串 逗号分隔
function funjsonToString(jsonData, key) {
    var value = "";//拼接json字符串
    for (var i = 0; i < jsonData.length; i++) {
        if (i > 0) {		//最开始为“，”,i>.0去除最开始的逗号
            value += ","
        }
        //jsonData[i][key]相当于json[i].key，但此处key为参数，值不明确，所以只能使用json[i][key]这种方式表达**
        value += jsonData[i][key];
    }
    return value;
}



