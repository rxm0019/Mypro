/**
 * eduTeachReport.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 健康教育查询报表
 * @Author xcj
 * @version: 1.0
 * @Date 2020/10/17
 */
var eduTeachReport = avalon.define({
    $id: "eduTeachReport",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    SysHospitalList:[],//区名和区名下的医护人员
});

layui.use(['index','laypage','laydate'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getTeachDetailList();  //查询列表
        filterSelect();//监控下拉
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#eduTeachReport_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'eduTeachReport_search'  //指定的lay-filter
        ,conds:[
            {field: 'patientRecordNo', title: '病历号：',type:'input'}
            ,{field: 'patientName', title: '患者姓名：',type:'input'}
            ,{field: 'teachDate', title: '日期：',type:'date_range'}
            ,{field: 'customerType',type:'select', title: '查询范围：'
                , data: getSysDictByCode($.dictType.customerType, true)}
            ,{field: 'hospitalNo',type:'select', title: '中心：'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            var form=layui.form;
            var util=layui.util;
            form.val(filter,{
                "teachDate_begin":util.toDateString(new Date(),"yyyy-MM-dd"),
            });
            form.val(filter,{
                "teachDate_end":util.toDateString(new Date(),"yyyy-MM-dd")
            });
            getHospitalAndUser();
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('eduTeachReport_table',{
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
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patReport/listHospitalAndUser.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            if(data.length>0){
                eduTeachReport.SysHospitalList.pushArray(data);

                var userList = [];
                //清空数据，重新绑定值
                var htmlHospital ='';
                $.each(eduTeachReport.SysHospitalList,function(i,item){
                    htmlHospital+='<option value="'+item.hospitalNo+'">'+item.hospitalName+'</option>';
                    if(eduTeachReport.baseFuncInfo.userInfoData.hospitalNo == item.hospitalNo){
                        userList = item.sysUserList;
                    }
                });
                $("select[name='hospitalNo']").html(htmlHospital);
                $("select[name='hospitalNo']").val(eduTeachReport.baseFuncInfo.userInfoData.hospitalNo);

                var htmlUser ='';
                if(userList.length>0){
                    $.each(userList,function(i,item){
                        htmlUser+='<option value="'+item.id+'">'+item.userName+'</option>';
                    });
                }
                var form=layui.form;
                $("select[name='userId']").html(htmlUser);
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
            $.each(eduTeachReport.SysHospitalList,function(i,item){
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
 * 教育记录
 */
function getTeachDetailList() {
    var param = {};
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    param.teachDate_begin = util.toDateString(new Date(),"yyyy-MM-dd");
    param.teachDate_end = util.toDateString(new Date(),"yyyy-MM-dd");
    param.hospitalNo = baseFuncInfo.userInfoData.hospitalNo;
    _layuiTable({
        elem: '#eduTeachReport_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'eduTeachReport_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-140', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patReport/getTeachReportList.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'patientName', title: '患者姓名',align:'center'}
                ,{field: 'patientRecordNo', title: '病历号',align:'center'}
                ,{field: 'gender', title: '性别',align:'center',templet: function(d){
                    return getSysDictName($.dictType.sex, d.gender);
                }}
                ,{field: 'createTime', title: '添加时间',align:'center',templet: function(d){
                        if(isNotEmpty(d.createTime)){
                            return util.toDateString(d.createTime,"yyyy-MM-dd");
                        }else{
                            return "--";
                        }
                    }}
                ,{field: 'eduBaseName', title: '教育主题',width: 140,align:'left'}
                ,{field: 'eduObj', title: '教育对象',align:'center',templet: function(d){
                    return "患者";
                }}
                ,{field: 'teachMethod', title: '教育方式',align:'center',templet: function(d){
                        return getSysDictName($.dictType.EducationMethod,d.teachMethod);
                }}
                ,{field: 'teachAssess', title: '教育效果',align:'center',templet: function(d){
                        if(d.teachAssess == $.constant.teachAssess.NO){
                            return "";
                        }else if(d.teachAssess == $.constant.teachAssess.FAIL){
                            return "一般";
                        }else if(d.teachAssess == $.constant.teachAssess.PASS){
                            return "好";
                        }else{
                            return "";
                        }
                    }}
                ,{field: 'doYes', title: '是否执行',align:'center',templet: function(d){
                        return "是";
                    }}
                ,{field: 'doTime', title: '执行时间',align:'center',templet: function(d){
                        if(isNotEmpty(d.createTime)){
                            return util.toDateString(d.createTime,"yyyy-MM-dd");
                        }else{
                            return "--";
                        }
                    }}
                ,{field: 'teachUser', title: '护士签名',align:'center'}
                ,{fixed: 'right',title: '详细内容',width: 120, align:'center'
                    ,toolbar: '#eduTeachReport_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
           if(layEvent === 'eduShow'){
                if(isNotEmpty(data.eduBaseId)){
                    show(data.eduBaseId,"","预览");
                }
            }
        }
    });
}

/**
 * 预览显示
 */
function show(eduBaseId,patientId,title) {
    var url="";
    url=$.config.server +"/dialysis/diaEduShow?eduBaseId="+eduBaseId+"&patientId="+patientId;
    parent.layui.index.openTabsPage(url,title);//这里要注意的是parent的层级关系
}



/**
 * 导出excel
 * @returns {boolean}
 */
function exportExcel(){
    var data = getSearchParam();
    if(isEmpty(data.teachDate_begin) || isEmpty(data.teachDate_end)){
        warningToast("请选择日期");
        return false;
    }
    var name = "宣教查询报表_" + data.teachDate_begin + "-" + data.teachDate_end + ".xlsx";
    _downloadFile({
        url: $.config.services.dialysis + "/patReport/exportTeachReportList.do",
        data:data,
        fileName: name
    });
}

/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var searchParam = layui.form.val("eduTeachReport_search");
    if(isEmpty(searchParam.teachDate_begin) && isEmpty(searchParam.teachDate_end)){
        var util=layui.util;
        var date = new Date();
        searchParam.teachDate_begin = util.toDateString(date,"yyyy-MM-dd");
        searchParam.teachDate_end = util.toDateString(date,"yyyy-MM-dd");
        searchParam.hospitalNo = baseFuncInfo.userInfoData.hospitalNo;
    }
    return $.extend({
    }, searchParam)
}