/**
 * nurseTransfer.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 护士交班报表
 * @Author xcj
 * @version: 1.0
 * @Date 2020/10/17
 */
var nurseTransfer = avalon.define({
    $id: "nurseTransfer",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    SysHospitalList:[],//区名和区名下的医护人员
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList();  //查询列表
        filterSelect();//监控下拉
        avalon.scan();
    });
});
/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#nurseTransfer_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'nurseTransfer_search'  //指定的lay-filter
        ,conds:[
            {field: 'patientRecordNo', title: '病历号：',type:'input'}
            ,{field: 'patientName', title: '患者姓名：',type:'input'}
            ,{field: 'shiftDate', title: '日期：',type:'date_range'}
            ,{field: 'hospitalNo',type:'select', title: '中心：'}
            ,{field: 'userId',type:'select', title: '交班人：'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            var form=layui.form;
            var util=layui.util;
            debugger
            form.val(filter,{
                "shiftDate_begin":util.toDateString(new Date(),"yyyy-MM-dd"),
            });
            form.val(filter,{
                "shiftDate_end":util.toDateString(new Date(),"yyyy-MM-dd")
            });
            getHospitalAndUser();
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('nurseTransfer_table',{
                where:field
            });
        }
    });
}

/**
 * 获取区名和区名下的医护人员下拉列表
 */
function getHospitalAndUser() {
    var param = {
        userType:$.constant.userType.nurse
    }
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patReport/listHospitalAndUser.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            if(data.length>0){
                nurseTransfer.SysHospitalList.pushArray(data);
                var userList = [];
                //清空数据，重新绑定值
                var htmlHospital ='';
                $.each(nurseTransfer.SysHospitalList,function(i,item){
                    htmlHospital+='<option value="'+item.hospitalNo+'">'+item.hospitalName+'</option>';
                    if(nurseTransfer.baseFuncInfo.userInfoData.hospitalNo == item.hospitalNo){
                        userList = item.sysUserList;
                    }
                });
                $("select[name='hospitalNo']").html(htmlHospital);
                $("select[name='hospitalNo']").val(nurseTransfer.baseFuncInfo.userInfoData.hospitalNo);

                var htmlUser ='<option value="">全部</option>';
                if(userList.length>0){
                    $.each(userList,function(i,item){
                        htmlUser+='<option value="'+item.id+'">'+item.userName+'</option>';
                    });
                }
                $("select[name='userId']").html(htmlUser);
                var form=layui.form;
                //刷新表单渲染
                form.render();
            }
        }
    });
}

/**
 * 监控下拉
 */
function filterSelect() {
    //监控教育类型，联动主题类型
    var form=layui.form;
    form.on('select(hospitalNo)', function(data){
        if(isNotEmpty(data.value)){
            //清空数据，重新绑定值
            var htmlUser ='';
            var userList = [];
            $.each(nurseTransfer.SysHospitalList,function(i,item){
                if(data.value == item.hospitalNo){
                    userList = item.sysUserList;
                    return false;
                }
            });
            if(userList.length>0){
                $.each(userList,function(i,item){
                    htmlUser+='<option value="'+item.id+'">'+item.userName+'</option>';
                });
            }
            $("select[name='userId']").html(htmlUser);
            $("select[name='userId']").val("");
            //刷新表单渲染
            form.render();
        }
    });
}
/**
 * 查询列表事件
 */
function getList() {
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    debugger
    var param = {
        shiftDate_begin:util.toDateString(new Date(),"yyyy-MM-dd"),
        shiftDate_end:util.toDateString(new Date(),"yyyy-MM-dd"),
        hospitalNo:nurseTransfer.baseFuncInfo.userInfoData.hospitalNo
    };
    _layuiTable({
        elem: '#nurseTransfer_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'nurseTransfer_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-140', //table的高度，页面最大高度减去差值
            url:  $.config.services.dialysis + "/patReport/getNurseTransfer.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'patientRecordNo', title: '病历号',align:'center'}
                ,{field: 'patientName', title: '患者姓名',align:'center'}
                ,{field: 'birthday', title: '年龄',align:'center',templet: function(d){
                    return Age(d.createTime,d.birthday);
                }}
                ,{field: 'shiftDate', title: '交班日期',align:'center',templet: function(d){
                    return util.toDateString(d.shiftDate, "yyyy-MM-dd");
                }}
                ,{field: 'remarks', title: '内容',align:'left'}
                ,{field: 'replaceDoctor', title: '接班人',align:'left'}
            ]]
        }
    });
}

function Age(createTime,birthday) {
    var thisYear = new Date(createTime).getFullYear();
    var brith = new Date(birthday).getFullYear();
    var age = (thisYear - brith);
    return age;
}


/**
 * 导出excel
 * @returns {boolean}
 */
function exportExcel(){
    var data = getSearchParam();
    if(isEmpty(data.shiftDate_begin) || isEmpty(data.shiftDate_end)){
        warningToast("请选择日期");
        return false;
    }
    var name = "护士交班报表_" + data.shiftDate_begin + "-" + data.shiftDate_end + ".xlsx";
    _downloadFile({
        url: $.config.services.dialysis + "/patReport/exportNurseTransfer.do",
        data:data,
        fileName: name
    });
}

/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var searchParam = layui.form.val("nurseTransfer_search");
    if(isEmpty(searchParam.shiftDate_begin) && isEmpty(searchParam.shiftDate_end)){
        var util=layui.util;
        var date = new Date();
        searchParam.shiftDate_begin = util.toDateString(date,"yyyy-MM-dd");
        searchParam.shiftDate_end = util.toDateString(date,"yyyy-MM-dd");
        searchParam.hospitalNo = baseFuncInfo.userInfoData.hospitalNo;
    }
    return $.extend({
    }, searchParam)
}