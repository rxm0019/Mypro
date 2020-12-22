/**
 * eduTeachList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 健康教育--教育实施
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/9
 */
var eduTeachList = avalon.define({
    $id: "eduTeachList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    dictType:$.dictType,
    allThemeType:[],//字典主题类型数据
    searchTheme:"1",//教育主题查询模式 1-图文，2-列表
    searchRecord:"1",//教育记录查询模式 1-明细，2-统计
    pageSize:0,//图文列表分页总是
    themeList:[],//图文列表
    htmlNurse:'',//护士下拉列表
    isFirstTeach:true,//第一次点击 教育计划页签，查询数据
    isFirstRecord:true,//第一次点击 教育记录页签，查询数据
    totalPage:false,//教育记录--统计分页显示、隐藏
});

layui.use(['index','laypage','laydate'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        eduTeachList.allThemeType = getSysDictMap($.dictType.ThemeType);
        var limit = 3;
        var width = $(window).width(); //获取页面宽度,以便确定页面最多显示多少个条件
        if (width >= 1500) {
            limit = 4;
        } else if (width >= 1200 && width < 1500) {
            limit = 3;
        } else if (width >= 900 && width < 1200) {
            limit = 2;
        } else {
            limit = 1;
        }
        var themeLimit = limit+1;
        initSearchTheme(themeLimit); //初始化搜索框
        themeLayTotal();

        //责任护士列表
        getPrincipalNurse(function (htmlStr) {
            initSearchPlan();
            initSearchRecord(limit);
        });

        filterSelect();//监控下拉
        //监听tab切换
        element = layui.element;
        element.on('tab(teachTab)', function(data){
            if(data.index == 0){
                themeLayTotal();
            }
            if(data.index == 1){
                if(eduTeachList.isFirstTeach){
                    getTeachList();
                    eduTeachList.isFirstTeach = false;
                }
            }
            if(data.index == 2){
                if(eduTeachList.isFirstRecord){
                    getTeachDetailList()
                    eduTeachList.isFirstTeach = false;
                }
            }
        });
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearchTheme(limit){
    var form=layui.form;

    //教育主题--搜素栏的div
    var conditionArr = []; //用于存储每个搜索条件的html字符串
    conditionArr.push('<div class="layui-inline" style="height: 35px"> <label class="layui-form-label">查询模式：</label>' +
        ' <div class="layui-input-block"> <input type="radio" name="mode" value="1" title="图文" checked="" lay-filter="mode"> ' +
        '<input type="radio" name="mode" value="2" title="列表" lay-filter="mode"></div></div>')
    conditionArr.push('<div class="layui-inline" style="height: 35px"> <div class="layui-input-block"> ' +
        '<input type="checkbox" name="checkPlan" title="教育计划" value="1"> </div> </div>');
    conditionArr.push('<div class="layui-inline" style="width:300px;"><label class="layui-form-label">主题来源：</label>' +
        ' <div class="layui-input-inline"> <select name="eduBaseFrom1" lay-filter="eduBaseFrom1"> <option value="">全部</option>' +
        ' <option value="0">中心建立</option> <option value="1">总部推送</option> </select> </div> </div>');
    conditionArr.push('<div class="layui-inline" style="width:300px;"><label class="layui-form-label">教育类型：</label> ' +
        '<div class="layui-input-inline"> <select name="eduBaseType1" lay-filter="eduBaseType1"></select> </div> </div>');
    conditionArr.push('<div class="layui-inline" style="width:300px;"><label class="layui-form-label">主题类型：</label> ' +
        '<div class="layui-input-inline"> <select name="themeType1" lay-filter="themeType1"></select> </div> </div>');
    conditionArr.push('<div class="layui-inline" style="width:300px;"><label class="layui-form-label">教材类型：</label> ' +
        '<div class="layui-input-inline"> <select name="contentType" lay-filter="contentType"></select> </div> </div>');
    //开始处理筛选条件，根据limit是否出现收缩或者展开
    var htmlStr = "";

    if (conditionArr.length > limit && limit > 0) {
        htmlStr += '<div class="layui-form-item" style="margin-bottom: 0px; height: 40px;vertical-align: unset;">';
        htmlStr += (conditionArr.slice(0, limit)).join("");
        htmlStr +=
            '<div class="layui-inline" style="line-height: 42px;">' +
            '   <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach " id="eduTeachTheme_search_search" lay-submit ' +
            'lay-filter="eduTeachTheme_search_search">' +
            '   搜 索' +
            '   </button>' +
            '   <a href="javascript:;" class="pl-10" onclick="showMoreTheme(this)" id="moreCondit">' +
            '       <cite>更多筛选条件</cite><span class="layui-icon layui-icon-down condition-icon"></span>' +
            '   </a>' +
            '</div>';
        htmlStr += '</div>';

        htmlStr += '<div class="layui-form-item" style="display:none; height: 40px" id="condition_more_theme">';
        htmlStr += (conditionArr.slice(limit)).join("");
        htmlStr += '</div>';
    } else {
        htmlStr += '<div class="layui-form-item">';
        htmlStr += conditionArr.join("");
        htmlStr +=
            '<div class="layui-inline" style="line-height: 42px;">' +
            '   <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach" id="eduTeachTheme_search_search" lay-submit ' +
            'lay-filter="eduTeachTheme_search_search">' +
            '   搜 索' +
            '   </button>' +
            '</div>';
        htmlStr += '</div>';
    }
    $('#eduTeachTheme_search').html(htmlStr);

    var educationType = getSysDictByCode($.dictType.EducationType,true);
    var html = "";
    $.each(educationType,function(i,item){
        html+='<option value="'+item.value+'">'+item.name+'</option>';
    });
    $("select[name='eduBaseType1']").html(html);

    var contentType = getSysDictByCode($.dictType.ContentType,true);
    html = "";
    $.each(contentType,function(i,item){
        html+='<option value="'+item.value+'">'+item.name+'</option>';
    });
    $("select[name='contentType']").html(html);
    //刷新表单
    form.render();

    //监听搜索
    form.on('submit(eduTeachTheme_search_search)', function (data) {
        //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
        var field = data.field;
        var table = layui.table; //获取layui的table模块
        eduTeachList.searchTheme = field.mode;
        if(field.mode == '1'){
            themeLayTotal(field);
        }else {
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            getThemeList(field);
        }
        avalon.scan();
    });
}


/**
 * 初始化搜索框
 */
function initSearchPlan(){
    _initSearch({
        elem: '#eduTeachPlan_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'eduTeachPlan_search'  //指定的lay-filter
        ,conds:[
            ,{field: 'principalNurse',type:'select', title: '责任护士：'}
            ,{field: 'eduBaseFrom2',type:'select', title: '主题来源：'
                ,data:getThemeSource()}
            ,{field: 'sustainType',type:'select', title: '患者类型：'
                ,data:getSustainType()}
            ,{field: 'eduBaseType2',type:'select', title: '教育类型：'
                ,data:getSysDictByCode($.dictType.EducationType,true)} //加载数据字典
            ,{field: 'themeType2',type:'select', title: '主题类型：'}
            ,{field: 'teachMethod',type:'select', title: '教育方式：'
                ,data:getSysDictByCode($.dictType.EducationMethod,true)} //加载数据字典
            ,{field: 'patientName', title: '患者姓名：',type:'input'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            var form=layui.form;
            $("select[name='principalNurse']").html(eduTeachList.htmlNurse);
            //如果是护士角色，可默认选中
            if(eduTeachList.baseFuncInfo.userInfoData.userType == $.constant.userType.nurse){
                data.principalNurse = eduTeachList.baseFuncInfo.userInfoData.userid;
            }
            form.val(filter, data);
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            var param = {
                "userId":field.principalNurse,
                "eduBaseFrom":field.eduBaseFrom2,
                "sustainType":field.sustainType,
                "eduBaseType":field.eduBaseType2,
                "themeType":field.themeType2,
                "teachMethod":field.teachMethod,
                "patientName":field.patientName
            };
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('eduTeachPlanList_table',{
                where:param
            });
        }
    });
}


/**
 * 初始化搜索框
 */
function initSearchRecord(limit){
    var form=layui.form;

    //教育计划--搜素栏的div
    var conditionArr = []; //用于存储每个搜索条件的html字符串
    conditionArr.push('<div class="layui-inline" style="height: 35px"> <label class="layui-form-label">查询模式：</label>' +
        ' <div class="layui-input-block"> <input type="radio" name="method" value="1" title="明细" checked="" lay-filter="method"> ' +
        '<input type="radio" name="method" value="2" title="统计" lay-filter="method"></div></div>')
    conditionArr.push('<div class="layui-inline" style="width:300px;"><label class="layui-form-label">责任护士：</label> ' +
        '<div class="layui-input-inline"> <select name="principalNurse3" lay-filter="principalNurse3"></select> </div> </div>');
    conditionArr.push('<div class="layui-inline" style="width:300px;"><label class="layui-form-label">主题来源：</label>' +
        ' <div class="layui-input-inline"> <select name="eduBaseFrom3" lay-filter="eduBaseFrom3"> <option value="">全部</option>' +
        ' <option value="0">中心建立</option> <option value="1">总部推送</option> </select> </div> </div>');
    conditionArr.push('<div class="layui-inline" style="width:300px;"><label class="layui-form-label">宣教日期：</label> ' +
        '<div class="layui-input-inline"> <input type="text" name="teachMonth" id="teachMonth" placeholder="yyyy-MM ~ yyyy-MM" autocomplete="off" class="layui-input"></div> </div>');
    conditionArr.push('<div class="layui-inline" style="width:300px;"><label class="layui-form-label">患者姓名：</label> ' +
        '<div class="layui-input-inline"> <input type="text" name="patientName3" autocomplete="off" class="layui-input"></div> </div>');
    //开始处理筛选条件，根据limit是否出现收缩或者展开
    var htmlStr = "";

    if (conditionArr.length > limit && limit > 0) {
        htmlStr += '<div class="layui-form-item" style="margin-bottom: 0px; height: 40px;">';
        htmlStr += (conditionArr.slice(0, limit)).join("");
        htmlStr +=
            '<div class="layui-inline" style="line-height: 42px;">' +
            '   <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach " id="eduTeachRecord_search_search" lay-submit ' +
            'lay-filter="eduTeachRecord_search_search">' +
            '   搜 索' +
            '   </button>' +
            '   <a href="javascript:;" class="pl-10" onclick="showMoreRecord(this)" id="moreCondit">' +
            '       <cite>更多筛选条件</cite><span class="layui-icon layui-icon-down condition-icon"></span>' +
            '   </a>' +
            '</div>';
        htmlStr += '</div>';

        htmlStr += '<div class="layui-form-item" style="display:none; height: 40px" id="condition_more_record">';
        htmlStr += (conditionArr.slice(limit)).join("");
        htmlStr += '</div>';
    } else {
        htmlStr += '<div class="layui-form-item">';
        htmlStr += conditionArr.join("");
        htmlStr +=
            '<div class="layui-inline" style="line-height: 42px;">' +
            '   <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach" id="eduTeachRecord_search_search" lay-submit ' +
            'lay-filter="eduTeachRecord_search_search">' +
            '   搜 索' +
            '   </button>' +
            '</div>';
        htmlStr += '</div>';
    }
    $('#eduTeachRecord_search').html(htmlStr);

    $("select[name='principalNurse3']").html(eduTeachList.htmlNurse);
    //如果是护士角色，可默认选中
    if(eduTeachList.baseFuncInfo.userInfoData.userType == $.constant.userType.nurse){
        form.val("eduTeachRecord_search", {"principalNurse3":eduTeachList.baseFuncInfo.userInfoData.userid});
    }
    var laydate = layui.laydate;
    //年月范围
    var dateStr = getYearMonth() + " ~ " + getYearMonth();
    laydate.render({
        elem: '#teachMonth'
        ,type: 'month'
        ,range: "~"
        ,value: dateStr
    });
    //刷新表单
    form.render();
    //监听搜索
    form.on('submit(eduTeachRecord_search_search)', function (data) {
        //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
        var field = data.field;
        var table = layui.table; //获取layui的table模块
        if(isEmpty(field.teachMonth)){
            warningToast("请选择宣教日期");
            return false;
        }
        var months = field.teachMonth.split("~");
        var beginMonth = months[0].trim();
        var endMonth = months[1].trim();
        var param = {
            "userId":field.principalNurse3,
            "eduBaseFrom":field.eduBaseFrom3,
            "patientName":field.patientName3,
            "beginMonth":beginMonth,
            "endMonth":endMonth
        };
        eduTeachList.searchRecord = field.method;
        if(field.method == '1'){
            getTeachDetailList(param);
        }else {
            getTeachTotalList(param);
        }
    });
}



/**
 * 教育主题 -- 图文列表分页总数
 * @param field
 */
function themeLayTotal(field) {
    var param = {};
    if(isNotEmpty(field)){
        param = $.extend(param,{
            "eduBaseFrom":field.eduBaseFrom1,
            "eduBaseType":field.eduBaseType1,
            "themeType":field.themeType1,
            "contentType":field.contentType,
            "checkPlan":field.checkPlan
        })
    }
    //因为使用分页，使用先查询总数，然后查询分页数据
    _ajax({
        type: "POST",
        url:  $.config.services.logistics + "/eduDataBase/listThemeTotal.do",
        data:param,  //必须字符串后台才能接收list,
        loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(total) {
            eduTeachList.pageSize = total;
            themeLaypage(field);
        }
    });
}
/**
 * 教育主题 -- 图文列表分页
 * @param field
 */
function themeLaypage(field) {
    var laypage = layui.laypage
    laypage.render({
        elem: 'img-page'
        ,count: eduTeachList.pageSize
        ,layout: [ 'prev', 'page', 'next','skip','count', 'limit']
        ,limit: 8
        ,limits:[8,16,24,32]
        ,prev:'<i class="layui-icon layui-icon-left"></i>'
        ,next:'<i class="layui-icon layui-icon-right"></i>'
        ,theme:'#72C0BB'
        ,jump: function(obj, first){
            //obj包含了当前分页的所有参数，比如：
            var param = {
                "page.pageNum":obj.curr,
                "page.pageSize":obj.limit
            };
            if(isNotEmpty(field)){
                param = $.extend(param,{
                    "eduBaseFrom":field.eduBaseFrom1,
                    "eduBaseType":field.eduBaseType1,
                    "themeType":field.themeType1,
                    "contentType":field.contentType,
                    "checkPlan":field.checkPlan
                })
            }
            _ajax({
                type: "POST",
                url:  $.config.services.logistics + "/eduDataBase/listTheme.do",
                data:param,  //必须字符串后台才能接收list,
                //loading:false,  //是否ajax启用等待旋转框，默认是true
                dataType: "json",
                done: function(data){
                    eduTeachList.themeList.clear();
                    eduTeachList.themeList.pushArray(data);
                }
            });
        }
    });
}


/**
 * 教育主题 -- 列表
 */
function getThemeList(field) {
    var param = {
        "eduBaseFrom":field.eduBaseFrom1,
        "eduBaseType":field.eduBaseType1,
        "themeType":field.themeType1,
        "contentType":field.contentType,
        "checkPlan":field.checkPlan
    };
    _layuiTable({
        elem: '#eduTeachThemeList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'eduTeachThemeList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-160', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/eduDataBase/listTheme.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'eduBaseName', title: '教育主题',align:'center'}
                ,{field: 'eduBaseFrom', title: '主题来源',align:'center',templet: function(d){
                    if(d.eduBaseFrom == $.constant.themeSource.local){
                        return "中心建立";
                    }else {
                        return "总部推送";
                    }
                }}
                ,{field: 'eduBaseType', title: '教育类型',align:'center',templet: function(d){
                    return getSysDictName($.dictType.EducationType,d.eduBaseType);
                }}
                ,{field: 'themeType', title: '主题类型',align:'center',templet: function(d){
                    return getSysDictName($.dictType.ThemeType,d.themeType);
                }}
                ,{field: 'contentType', title: '教材类型',align:'center',templet: function(d){
                    return getSysDictName($.dictType.ContentType,d.contentType);
                }}
                ,{field: 'remarks', title: '备注'}
                ,{fixed: 'right',title: '操作',width: 120, align:'center'
                    ,toolbar: '#eduTeachThemeList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'eduTheme'){ //编辑
                //do something
                if(isNotEmpty(data.eduBaseId)){
                    eduTheme(null,data.eduBaseId);
                }
            }
        }
    });
}


/**
 * 教育计划列表
 */
function getTeachList() {
    var param = {};
    if(eduTeachList.baseFuncInfo.userInfoData.userType == $.constant.userType.nurse){
        param.userId = eduTeachList.baseFuncInfo.userInfoData.userid;
    }
    _layuiTable({
        elem: '#eduTeachPlanList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'eduTeachPlanList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-200', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/eduDataBase/listPlan.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'patientName', title: '患者姓名',align:'center'}
                ,{field: 'patientRecordNo', title: '病历号',align:'center'}
                ,{field: 'eduBaseFrom', title: '主题来源',align:'center',templet: function(d){
                    if(d.eduBaseFrom == $.constant.themeSource.local){
                        return "中心建立";
                    }else {
                        return "总部推送";
                    }
                }}
                ,{field: 'eduBaseName', title: '教育主题',align:'center'}
                ,{field: 'eduBaseType', title: '教育类型',align:'center',templet: function(d){
                    return getSysDictName($.dictType.EducationType,d.eduBaseType);
                }}
                ,{field: 'themeType', title: '主题类型',align:'center',templet: function(d){
                    return getSysDictName($.dictType.ThemeType,d.themeType);
                }}
                ,{field: 'teachMethod', title: '教育方式',align:'center',templet: function(d){
                    return getSysDictName($.dictType.EducationMethod,d.teachMethod);
                }}
                ,{fixed: 'right',title: '操作',width: 160, align:'center'
                    ,toolbar: '#eduTeachPlanList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'eduTheme'){ //编辑
                //do something
                if(isNotEmpty(data.eduBaseId) && isNotEmpty(data.patientId)){
                    show(data.eduBaseId,data.patientId,"宣教");
                }
            }else if(layEvent === 'eduShow'){
                if(isNotEmpty(data.eduBaseId)){
                    show(data.eduBaseId,"","预览");
                }
            }else if(layEvent === 'delPlan'){
                layer.confirm('确定删除所选记录吗？', function(index){
                    layer.close(index);
                    if(isNotEmpty(data.eduPlanId)){
                        var ids=[];
                        ids.push(data.eduPlanId);
                        del(ids);
                    }
                });
            }
        }
    });
}



/**
 * 教育记录 -- 明细
 */
function getTeachDetailList(field) {
    var util=layui.util;
    var param = {};
    if(isEmpty(field)){
        if(eduTeachList.baseFuncInfo.userInfoData.userType == $.constant.userType.nurse){
            param.userId = eduTeachList.baseFuncInfo.userInfoData.userid;
        }
        param.beginMonth = getYearMonth();
        param.endMonth = getYearMonth();
    }else {
        param = $.extend(param,field);
    }
    _layuiTable({
        elem: '#eduTeachDetailList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'eduTeachDetailList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-160', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/eduDataBase/getTeachDetailList.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'patientName', title: '患者姓名',align:'center'}
                ,{field: 'patientRecordNo', title: '病历号',align:'center'}
                ,{field: 'eduBaseFrom', title: '主题来源',align:'center',templet: function(d){
                    if(d.eduBaseFrom == $.constant.themeSource.local){
                        return "中心建立";
                    }else {
                        return "总部推送";
                    }
                }}
                ,{field: 'eduBaseName', title: '教育主题',width: 140,align:'center'}
                ,{field: 'eduBaseType', title: '教育类型',align:'center',templet: function(d){
                    return getSysDictName($.dictType.EducationType,d.eduBaseType);
                }}
                ,{field: 'themeType', title: '主题类型',align:'center',templet: function(d){
                    return getSysDictName($.dictType.ThemeType,d.themeType);
                }}
                ,{field: 'teachMethod', title: '教育方式',align:'center',templet: function(d){
                    return getSysDictName($.dictType.EducationMethod,d.teachMethod);
                }}
                ,{field: 'teachMethod', title: '教育日期',align:'center',templet: function(d){
                    if(isNotEmpty(d.teachDate)){
                        return util.toDateString(d.teachDate,"yyyy-MM-dd");
                    }else{
                        return "--";
                    }
                }}
                ,{field: 'teachMethod', title: '测评',width: 80,align:'center',templet: function(d){
                    if(d.teachAssess == $.constant.teachAssess.NO){
                        return "无测评";
                    }else if(d.teachAssess == $.constant.teachAssess.FAIL){
                        return "不合格";
                    }else if(d.teachAssess == $.constant.teachAssess.PASS){
                        return "合格";
                    }else{
                        return "";
                    }
                }}
                ,{field: 'planUser', title: '计划者',align:'center'}
                ,{field: 'teachUser', title: '宣教者',align:'center'}
                ,{field: 'assessUser', title: '测评者',align:'center'}
                ,{fixed: 'right',title: '操作',width: 180, align:'center'
                    ,toolbar: '#duTeachDetailList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'addTeach'){ //编辑
                if(isNotEmpty(data.teachId)){
                    addAssess(data.teachId,data.eduBaseName);
                }
            }else if(layEvent === 'eduShow'){
                if(isNotEmpty(data.eduBaseId)){
                    show(data.eduBaseId,"","预览");
                }
            }else if(layEvent === 'showTeach'){
                if(isNotEmpty(data.teachId)){
                    showAssess(data.teachId,data.eduBaseName);
                }
            }
        }
    });
}

/**
 * 教育记录  统计
 * @param field
 */
function getTeachTotalList(field) {
    var util=layui.util;
    var param = {
        "page.pageNum":1,
        "page.pageSize":20
    };
    if(isEmpty(field)){
        if(eduTeachList.baseFuncInfo.userInfoData.userType == $.constant.userType.nurse){
            param.userId = eduTeachList.baseFuncInfo.userInfoData.userid;
        }
        param.beginMonth = getYearMonth();
        param.endMonth = getYearMonth();
    }else {
        param = $.extend(param,field);
    }
    _ajax({
        type: "POST",
        url: $.config.services.logistics + "/eduDataBase/getTeachTotalList.do",
        dataType: "json",
        data:param,
        done:function(data){
            var pageCount = data.pageCount;
            creatTable(data);
            creatPage(param,pageCount);
        }
    });
}

function creatTable(data) {
    var headerList = data.headerList;
    var dataList = data.dataList;
    if(dataList.length>0){
        eduTeachList.totalPage = true;
    }else {
        eduTeachList.totalPage = false;
    }
    // 列表表头
    var columnList = [
        {type: 'numbers', title: '序号',width:60 }  //序号
        ,{field: 'patientName', title: '患者姓名', align:'center',width:120}
        ,{field: 'patientRecordNo', title: '病历号',align:'center',width:140}
        ,{field: 'principalNurse', title: '责任护士', align:'center',width:120}
    ];
    if(headerList.length>0){
        for(var j=0;j<headerList.length;j++) {
            var map = headerList[j];
            for (var key in map) {
                columnList.push({field: key, title: map[key], align:'center'})
            }
        }
    }
    _layuiTable({
        elem: '#eduTeachTotalList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'eduTeachTotalList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-200', //table的高度，页面最大高度减去差值
            data:dataList,
            page:false,
            cols: [columnList]
        }
    });

}

function creatPage(field,pageCount) {
    var laypage = layui.laypage
    laypage.render({
        elem: 'total-page'
        ,count: pageCount
        ,layout: [ 'prev', 'page', 'next','skip','count', 'limit']
        ,limit: 20
        ,limits:[10,20,30,40,50,60,70,80,90]
        ,prev:'<i class="layui-icon layui-icon-left"></i>'
        ,next:'<i class="layui-icon layui-icon-right"></i>'
        ,theme:'#72C0BB'
        ,jump: function(obj, first){
            //obj包含了当前分页的所有参数，比如：
            //首次不执行
            if(!first){
                var param = {
                    "page.pageNum":obj.curr,
                    "page.pageSize":obj.limit
                };
                if(isNotEmpty(field)){
                    param = $.extend(param,{
                        "userId":field.userId,
                        "eduBaseFrom":field.eduBaseFrom,
                        "patientName":field.patientName,
                        "beginMonth":field.beginMonth,
                        "endMonth":field.endMonth
                    })
                }
                _ajax({
                    type: "POST",
                    url:  $.config.services.logistics + "/eduDataBase/getTeachTotalList.do",
                    data:param,  //必须字符串后台才能接收list,
                    dataType: "json",
                    done: function(data){
                        creatTable(data);
                    }
                });
            }
        }
    });

}

/**
 * 监控下拉选项
 */
function filterSelect() {
    //监控教育类型，联动主题类型
    var form=layui.form;
    form.on('select(eduBaseType1)', function(data){
        if(isNotEmpty(data.value)){
            //清空数据，重新绑定值
            form.val('eduTeachTheme_search', {"themeType1":""});
            var htmlTheme ='<option value="">全部</option>';
            $.each(eduTeachList.allThemeType,function(i,item){
                if(data.value == item.dictBizCode){
                    htmlTheme+='<option value="'+item.value+'">'+item.name+'</option>';
                }
            });
            $("select[name='themeType1']").html(htmlTheme);
            //刷新表单渲染
            form.render();
        }
    });

    form.on('select(eduBaseType2)', function(data){
        if(isNotEmpty(data.value)){
            //清空数据，重新绑定值
            form.val('eduTeachPlan_search', {"themeType2":""});
            var htmlTheme ='<option value="">全部</option>';
            $.each(eduTeachList.allThemeType,function(i,item){
                if(data.value == item.dictBizCode){
                    htmlTheme+='<option value="'+item.value+'">'+item.name+'</option>';
                }
            });
            $("select[name='themeType2']").html(htmlTheme);
            //刷新表单渲染
            form.render();
        }
    });

    form.on('radio(mode)', function (data) {
        setTimeout(function(){
            $("#eduTeachTheme_search_search").trigger('click');
        },100);
    });

    form.on('radio(method)', function (data) {
        setTimeout(function(){
            $("#eduTeachRecord_search_search").trigger('click');
        },100);
    });
}

/**
 * 宣教
 * @param id
 */
function eduTheme(obj,id) {
    var eduBaseId = '';
    if(isNotEmpty(obj)){
        eduBaseId = $(obj).attr("eduBaseId"); //获取选中行的数据
    }
    if(isNotEmpty(id)){
        eduBaseId = id;
    }
    if(isEmpty(eduBaseId)){
        warningToast("请选择教育主题");
        return false;
    }
    var url=$.config.server +"/education/eduPatient?eduBaseId="+eduBaseId;
    var title="宣教患者";
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:500, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:800,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin){
            var ids = iframeWin.edu(
                //成功保存之后的操作，刷新页面
                function success(eduBaseId,patientId) {
                    show(eduBaseId,patientId,"宣教");
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}


/**
 * 获取责任护士下拉列表
 */
function getPrincipalNurse($callback) {
    var param = {
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysUser/listPrincipalNurse.do",
        data:param,  //必须字符串后台才能接收list,
        dataType: "json",
        done: function(data){
            var form=layui.form; //调用layui的form模块
            var htmlStr ='<option value="">全部</option>';
            $.each(data,function(i,item){
                htmlStr+='<option value="'+item.id+'">'+item.userName+'</option>';
            });
            eduTeachList.htmlNurse = htmlStr;
            typeof $callback === 'function' && $callback(htmlStr); //返回一个回调事件
        }
    });
}

/**
 * 预览显示
 */
function show(eduBaseId,patientId,title) {
    var url="";
    url=$.config.server +"/education/eduDataBaseShow?eduBaseId="+eduBaseId+"&patientId="+patientId;
    parent.layui.index.openTabsPage(url,title);//这里要注意的是parent的层级关系
}

/**
 * 添加测评
 * @param eduPlanId
 */
function addAssess(teachId,eduBaseName) {
    var url="";
    var title="";
    title="测评";
    url=$.config.server+"/education/eduTeachEdit?teachId="+teachId+"&show=1"+"&eduBaseName="+eduBaseName;

    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:500, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:550,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin){
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('eduTeachDetailList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 显示测评
 * @param eduPlanId
 */
function showAssess(teachId,eduBaseName) {
    var url="";
    var title="";
    title="查看测评";
    url=$.config.server+"/education/eduTeachEdit?teachId="+teachId+"&show=0"+"&eduBaseName="+eduBaseName;

    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:550, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:550,  //弹框自定义的高度，方法会自动判断是否超过高度
        readonly:true,
        title:title, //弹框标题
        done:function(index,iframeWin){}
    });
}

/**
 * 删除事件
 * @param ids
 */
function del(ids){
    var param={
        "ids":ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.logistics + "/eduPlan/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('eduTeachPlanList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('eduTeachPlanList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.eduPlanId);
            });
            del(ids);
        });
    }
}

/**
 * 微信推送功能
 * 计划添加微信推送只是添加到计划里面
 * 此微信推送按钮会立即推送微信公众号
 */
function sendWeChat() {

}

/**
 * 批量添加制定计划
 */
function batchAdd() {
    var url="";
    var title="";
    //将护士id传过去，默认查询当前所选护士负责的患者，当id为空时会查询所有患者
    var userId =  $("select[name='principalNurse']").val();
    if(isEmpty(userId)){
        userId = "";
    }
    title="新增";
    url=$.config.server+"/education/eduTeachPlanEdit?userId="+userId;

    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:550, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:650,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('eduTeachPlanList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

function showMoreTheme(obj) {
    if ($(obj).hasClass("condition-open")) {
        $(obj).removeClass("condition-open");
        $("#condition_more_theme").slideUp();
        $(obj).html('<cite>更多筛选条件</cite><span class="layui-icon layui-icon-down condition-icon"></span>');
    } else {
        $(obj).addClass("condition-open");
        $("#condition_more_theme").slideDown();
        $(obj).html('<cite>收起筛选条件</cite><span class="layui-icon layui-icon-up condition-icon"></span>');
    }
}

function showMoreRecord(obj) {
    if ($(obj).hasClass("condition-open")) {
        $(obj).removeClass("condition-open");
        $("#condition_more_record").slideUp();
        $(obj).html('<cite>更多筛选条件</cite><span class="layui-icon layui-icon-down condition-icon"></span>');
    } else {
        $(obj).addClass("condition-open");
        $("#condition_more_record").slideDown();
        $(obj).html('<cite>收起筛选条件</cite><span class="layui-icon layui-icon-up condition-icon"></span>');
    }
}

/**
 * 主题来源
 */
function getThemeSource() {
    var data = [];
    data.push({value: "", name: "全部"});
    data.push({value: "0", name: "中心建立"});
    data.push({value: "1", name: "总部推送"});
    return data;
}
/**
 * 患者类型
 */
function getSustainType() {
    var data = [];
    data.push({value: "", name: "全部"});
    data.push({value: "0", name: "新患者"});
    data.push({value: "1", name: "维持患者"});
    return data;
}

/**
 * 过滤器
 * @param obj
 * @returns {*}
 */
avalon.filters.attrIdPath = function(obj,filePath) {
    if(isEmpty(filePath)){
        obj.src = $.config.server + '/static/images/login-banner-1.jpg';
    }
    return obj;
}


function getYearMonth() {
    var myDate = new Date();
    var tYear = myDate.getFullYear();
    var tMonth = myDate.getMonth();

    var m = tMonth + 1;
    if (m.toString().length == 1) {
        m = "0" + m;
    }
    return tYear + '-' + m;
}
