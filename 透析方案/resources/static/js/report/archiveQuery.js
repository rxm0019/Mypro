/**
 * archiveQuery.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 归档查询
 * @Author wahmh
 * @version: 1.0
 * @Date 2020/10/28
 */
var archiveQuery = avalon.define({
    $id: "archiveQuery",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    SysHospitalList: [],//区名和区名下的医护人员
});
layui.use(['index'], function () {
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
function initSearch() {
    _initSearch({
        elem: '#archiveQuery_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'archiveQuery_search'  //指定的lay-filter
        , conds: [
            {field: 'patientRecordNo', title: '病历号：', type: 'input'}
            , {field: 'patientName', title: '患者姓名：', type: 'input'}
            , {
                field: 'customerType',
                type: 'select',
                title: '客户类型：',
                data: getSysDictByCode($.dictType.customerType, true)
            }
            , {
                field: 'recordStatus',
                type: 'select',
                title: '归档：',
                data: [{value: "", name: "全部"}, {value: "10", name: "未归档"}, {value: "9", name: "归档"}]
            }
            , {field: 'hospitalNo', type: 'select', title: '中心：'}
            , {field: 'shiftDate', title: '日期：', type: 'date_range'}
        ]
        , done: function (filter, data) {
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            var form = layui.form;
            var util = layui.util;
            form.val(filter, {
                "shiftDate_begin": util.toDateString(new Date(), "yyyy-MM-dd"),
            });
            form.val(filter, {
                "shiftDate_end": util.toDateString(new Date(), "yyyy-MM-dd")
            });
            getHospitalAndUser();
        }
        , search: function (data) {
            if (isNotEmpty($("#shiftDate_begin").val()) && $("#shiftDate_begin").val() > $("#shiftDate_end").val()) {
                warningToast('开始时间不能大于结束时间');
                return false;
            }
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('archiveQuery_table', {
                where: field
            });
        }
    });
}

/**
 * 导出excel
 */
function onExportExcel() {

   var param={
       patientRecordNo:$("input[name='patientRecordNo']").val(),
       patientName: $("input[name='patientName']").val(),
       customerType: $("select[name='customerType']").val(),
       recordStatus: $("select[name='recordStatus']").val(),
       hospitalNo:$("select[name='hospitalNo']").val(),
       shiftDate_begin:$("input[name='shiftDate_begin']").val(),
       shiftDate_end:$("input[name='shiftDate_end']").val()
   }
    var url = $.config.services.dialysis + "/patReport/exportArchiveQuery.do";    //导出透归档信息列表
    var title =  "归档记录.xlsx";
            /**
             * 导出归档查询excel
             */
             _downloadFile({
                 url: url,
                 data: param,
                 fileName: title
             })
}
/**
 * 获取区名
 */
function getHospitalAndUser() {
    var param = {
        userType: $.constant.userType.nurse
    }
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patReport/listHospitalAndUser.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            if (data.length > 0) {
                archiveQuery.SysHospitalList.pushArray(data);
                var userList = [];
                //清空数据，重新绑定值
                var htmlHospital = '';
                $.each(archiveQuery.SysHospitalList, function (i, item) {
                    htmlHospital += '<option value="' + item.hospitalNo + '">' + item.hospitalName + '</option>';
                    if (archiveQuery.baseFuncInfo.userInfoData.hospitalNo == item.hospitalNo) {
                        userList = item.sysUserList;
                    }
                });
                $("select[name='hospitalNo']").html(htmlHospital);
                $("select[name='hospitalNo']").val(archiveQuery.baseFuncInfo.userInfoData.hospitalNo);
                var form = layui.form;
                //刷新表单渲染
                form.render();
            }
        }
    });
}

/**
 * 查询列表事件
 */
function getList() {
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    var param = {
        shiftDate_begin: util.toDateString(new Date(), "yyyy-MM-dd"),
        shiftDate_end: util.toDateString(new Date(), "yyyy-MM-dd"),
        hospitalNo: archiveQuery.baseFuncInfo.userInfoData.hospitalNo,
        userType: $.constant.userType.nurse
    };
    _layuiTable({
        elem: '#archiveQuery_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'archiveQuery_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-85', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patReport/getArchiveList.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号', width: 60}  //序号
                , {field: 'patientRecordNo', title: '病历号', align: 'center'}
                , {field: 'patientName', title: '患者姓名', align: 'center'}
                , {
                    field: 'gender', title: '性别', align: 'center', templet: function (d) {
                        return getSysDictName("Sex", d.gender);
                    }
                }
                , {
                    field: 'dialysisDate', title: '透析日期', align: 'center', templet: function (d) {
                        return util.toDateString(d.dialysisDate, "yyyy-MM-dd");
                    }
                }
                , {field: 'principalNurse', title: '责任护士', align: 'left'}
                , {
                    field: 'recordStatus', title: '归档状态', align: 'left', templet: function (d) {
                        return d.recordStatus === $.constant.dialysisRecordStatus.FILED ? "已归档" : "未归档";
                    }
                }
            ]]
        }
    });
}
