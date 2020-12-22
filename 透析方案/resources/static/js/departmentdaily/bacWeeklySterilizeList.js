/**
 * bacWeeklySterilizeList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * @author carl
 * @date 2020/08/11
 * @description 每周消毒编辑页面。
 * @version 1.0
 */
var bacWeeklySterilizeList = avalon.define({
    $id: "bacWeeklySterilizeList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    wardList:getWardList(), //获取病区列表
    regionList:getRegionList(), // 获取区域列表
    regionListByward:[], //定义病区对应的区域
    areaSterilize:"", //病区
    regionSterilize:"" ,//区域
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList();  //查询列表
        avalon.scan();
    });

    //监听病区，并且根据病区拉取区域
    layui.form.on('select(areaSterilize)',function(data){
        bacWeeklySterilizeList.areaSterilize = data.value;
        bacWeeklySterilizeList.regionListByward = getRegionListByward(data.value);
        //替换区域内容，并重新渲染。
        var areaNameOption = '';
        for(var index in bacWeeklySterilizeList.regionListByward){
            areaNameOption += '<option value='+bacWeeklySterilizeList.regionListByward[index].regionId+
                '>' + bacWeeklySterilizeList.regionListByward[index].regionName + '</option>'
        }
        $("[name='regionSterilize']").html(areaNameOption);
        layui.form.render('select');
    })
});

//获取病区列表
function getWardList(){
    var param = {
        dataStatus:"0",
        //hospitalNo:baseFuncInfo.userInfoData.hospitalNo//登录功能完善后再获取，现在undefined
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        async:false,
        url: $.config.services.platform + "/basWardSetting/getLists.do",
        data:param,
        dataType: "json",
        done:function(data){
            bacWeeklySterilizeList.wardList = data;
        }
    });
}


//获取区域列表
function getRegionList(){
    var param = {
        dataStatus:"0",//初始化查询参数，排除标记已删除的数据
    };
    _ajax({
        type: "POST",
        async:false,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.platform + "/basRegionSetting/getLists.do",
        data:param,
        dataType: "json",
        done:function(data){
            bacWeeklySterilizeList.regionList = data;
        }
    });
}

//从变量中查询病区对应区域，减少拉去数据库次数
function getRegionListByward(wardId){
    var wardRegionList = [];
    for (var index in bacWeeklySterilizeList.regionList){
        var region = bacWeeklySterilizeList.regionList[index];
        console.log(region);
        if (region.wardId == wardId){
            wardRegionList.push(region);
        }
    }
    return wardRegionList;
}

/**
 * 初始化搜索框
 */
function initSearch(){
    var areaSterilizeTemplet =
        '<select name="areaSterilize" ms-duplex="areaSterilize" lay-filter="areaSterilize">' +
        '<option></option>';
    for(var index in bacWeeklySterilizeList.wardList){
        areaSterilizeTemplet += '<option value='+bacWeeklySterilizeList.wardList[index].wardId+
            '>' + bacWeeklySterilizeList.wardList[index].wardName + '</option>'
    }
    areaSterilizeTemplet +='</select>';

    _initSearch({
        elem: '#bacWeeklySterilizeList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacWeeklySterilizeList_search'  //指定的lay-filter
        ,conds:[
            {field: 'sterilizeDate', title: '消毒日期：',type:'date_range'}
            ,{field: 'areaSterilize',type:'select', title: '病区：'
                ,templet:areaSterilizeTemplet}
            ,{field: 'regionSterilize',type:'select', title: '区域：'
                ,data:getSysDictByCode("",true)} //加载数据字典
            ,{field: 'sterilizeType',type:'select', title: '设备类型：'
                ,data:getSysDictByCode("sterilizeDeviceType",true)}
            ,{field: 'sterilizeUser', title: '消毒人：',type:'input'}

        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('bacWeeklySterilizeList_table',{
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
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#bacWeeklySterilizeList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacWeeklySterilizeList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/bacWeeklySterilize/list.do",
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'areaSterilize', title: '病区',templet: function(d){
                      return renderWard(d.areaSterilize);
                    }}
                ,{field: 'regionSterilize', title: '区域',templet: function(d){
                        return renderRegion(d.areaSterilize,d.regionSterilize);
                    }}
                ,{field: 'sterilizeType', title: '设备类型',templet: function(d){
                        //返回数据字典的名称
                        return getSysDictName("sterilizeDeviceType",d.sterilizeType);
                    }}
                ,{field: 'bacDevices',title: '消毒机编号',style:'margin: 0;padding:0',templet: function(d){
                      return  randerDevices(d.bacDevices,"code");
                    }}
                ,{field: 'bacDevices', title: '消毒机名称',style:'margin: 0;padding:0',templet: function(d){
                        return  randerDevices(d.bacDevices,"name");
                    }}
                ,{field: 'sterilizeMethod', title: '消毒方式',templet: function(d){
                        //返回数据字典的名称
                        return getSysDictName("sterilizeMethod",d.sterilizeMethod);
                    }}
                ,{field: 'sterilizeUser', title: '消毒人'}
                ,{field: 'sterilizeDate', title: '消毒日期',align:'center'
                    ,templet: function(d){
                    return util.toDateString(d.sterilizeDate,"yyyy-MM-dd");
                }}
                ,{fixed: 'right',title: '操作', align:'center'
                    ,toolbar: '#bacWeeklySterilizeList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象

            if(layEvent === 'detail'){ //编辑
                //do something
                if(isNotEmpty(data.weeklySterilizeId)){
                    saveOrEdit(data.weeklySterilizeId,true);
                }
            }else if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.weeklySterilizeId)){
                    saveOrEdit(data.weeklySterilizeId);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.weeklySterilizeId)){
                        var ids=[];
                        ids.push(data.weeklySterilizeId);
                        del(ids);
                    }
                });
            }
        }
    });
}

function randerDevices(devices,resultType){
    if(devices != null && devices.length == 0){
        return "";
    }
    templetHtml = "";
    for (var index in devices){
        if(index != 0){
            templetHtml+="<div style='margin:0;padding:5px 15px;width: 100%; min-height: 28px; border-top: 1px solid #e6e6e6'>"
        }else{
            templetHtml+="<div style='margin:0;padding:5px 15px;width: 100%; border:none'>"
        }

        console.log(devices[index]);
        if(resultType === 'name'){
            templetHtml += devices[index].deviceName;
        }else{
            templetHtml+= devices[index].codeNo;
        }
        templetHtml+="</div>"
    }
    templetHtml += ""
    return templetHtml
}

function renderWard(wardId){
    for (var index in bacWeeklySterilizeList.wardList){
        var ward = bacWeeklySterilizeList.wardList[index];
        console.log(ward);
        if (ward.wardId == wardId){
            return ward.wardName;
        }
    }
    return "";
}

function renderRegion(wardId,regionId) {
    for (var index in bacWeeklySterilizeList.regionList){
        var region = bacWeeklySterilizeList.regionList[index];
        console.log(region);
        if (region.wardId == wardId && region.regionId == regionId){
            return region.regionName;
        }
    }
    return "";
}

/**
 * 获取单个实体
 */
function saveOrEdit(id,readonly){
    if(readonly == null || typeof readonly == "undefined"){
        readonly = false;
    }
    var url="";
    var title="";
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server + "/departmentdaily/bacWeeklySterilizeEdit";
    }else{  //编辑
        title=readonly ? "详情":"编辑";
        url=$.config.server + "/departmentdaily/bacWeeklySterilizeEdit?id="+id + "&readonly="+readonly;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:500,  //弹框自定义的高度，方法会自动判断是否超过高度
        readonly:readonly,
        title:title, //弹框标题
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功",500);
                    var table = layui.table; //获取layui的table模块
                    table.reload('bacWeeklySterilizeList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
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
        url: $.config.services.logistics + "/bacWeeklySterilize/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功",500);
            var table = layui.table; //获取layui的table模块
            table.reload('bacWeeklySterilizeList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('bacWeeklySterilizeList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.weeklySterilizeId);
            });
            del(ids);
        });
    }
}

/**
 * 导出excel
 */
function exportExcel() {
    _downloadFile({
        url: $.config.services.logistics + "/bacWeeklySterilize/export.do",
        data: getSearchParam(),
        fileName: '每周消毒.xlsx'
    });
}
/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var searchParam = layui.form.val("bacWeeklySterilizeList_search");

    return $.extend({
        sterilizeDate: "",
    }, searchParam)

}

