/**
 * 推送历史列表
 * @author: hhc
 * @version: 1.0
 * @date: 2020/9/18
 */
var sysPushHistoryList = avalon.define({
    $id: "sysPushHistoryList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var id= GetQueryString('id');
        getList(id);  //查询列表

        avalon.scan();
    });
});

/**
 * 查询列表事件
 */
function getList(id) {
    var param ={'masterId':id};
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#sysPushHistoryList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'sysPushHistoryList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 400, //table的高度，页面最大高度减去差值
            url: $.config.services.platform + "/sysPushManage/getInfo.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'pushHospitalName', title: '推送医院', align: 'cebter'}
                , {
                    field: 'pushTime', title: '推送日期', align: 'center', templet: function (d) {
                        if(d.pushStatus === $.constant.pushStatus.SUCCESS){
                            return util.toDateString(d.pushTime, "yyyy-MM-dd HH:mm");
                        }else{
                            return "";
                        }

                    }
                }
                , {
                    field: 'pushStatus', title: '推送状态', align: "center",
                    templet: function (d) {
                        var str = d.pushStatus;
                        if (str === $.constant.pushStatus.UNPUSH) {
                            return "未推送";
                        } else if (str === $.constant.pushStatus.SUCCESS) {
                            return "成功";
                        } else if (str === $.constant.pushStatus.FAIL) {
                            return "失败";
                        }

                    }
                }
            ]]
        }
    });

}

