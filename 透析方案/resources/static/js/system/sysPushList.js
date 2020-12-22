/**
 * 推送执行记录列表
 * @author: hhc
 * @version: 1.0
 * @date: 2020/9/14
 */
var sysPushList = avalon.define({
    $id: "sysPushList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    pushStatus:$.constant.pushStatus
});
layui.use(['index','formSelects'], function () {
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
     var hospitalOptions = getHospitalOptions();
    _initSearch({
        elem: '#sysPushList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'sysPushList_search'  //指定的lay-filter
        , conds: [
            {field: 'pushType', title: '推送类型：', type: 'select', data: getSysDictByCode("PushType", true)}
            , {field: 'pushHospitalNo', title: '推送医院：', type: 'select', data:hospitalOptions, search: true }
            , {field: 'pushTime', title: '推送日期：', type: 'date_range'}
            , {
                field: 'pushStatus', title: '推送状态：', type: 'checkbox'
                , data: [{'name': '成功', 'value': '1'}, {'name': '失败', value: '2'}, {'name': '未推送', 'value': '0'}, {'name': '推送中', 'value': '3'}]
            }
            , {field: 'pushCode', title: '编码：', type: 'input'}
            , {field: 'pushName', title: '名称：', type: 'input'}
        ]
        , done: function (filter, data) {
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        , search: function (data) {
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            if (isNotEmpty(field.pushTime_end) &&field.pushTime_begin > field.pushTime_end) {
                warningToast('开始日期不能大于结束日期');
                return false;
            }
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('sysPushList_table', {
                where: field
            });
        }
    });
}

/**
 * 获取医院列表
 */
function getHospitalOptions() {
    var hospitalOptions = [{name: "全部", value: ""}];

    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system +"/listHospitalRoles.do",
        dataType: "json",
        async: false,
        done: function(data) {
            if (data) {
                $.each(data, function (index, item) {
                    hospitalOptions.push({name: item.hospitalName , value: item.hospitalNo});
                });
            }
        }
    });
    return hospitalOptions;
}

/**
 * 查询列表事件
 */
function getList() {
    var param = {
        pushType:$("select[name='pushType']").val(),
        pushHospitalNo:$("select[name='pushHospitalNo']").val(),
        pushStatus:layui.formSelects.value('pushStatus','val').join(','),
        pushCode:$("input[name='pushCode']").val(),
        pushName:$("input[name='pushName']").val(),
        pushTime_begin:$("input[name='pushTime_begin']").val(),
        pushTime_end:$("input[name='pushTime_end']").val()
    };

    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#sysPushList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'sysPushList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-200', //table的高度，页面最大高度减去差值
            url: $.config.services.platform + "/sysPush/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}  //开启编辑框
                , {
                    field: 'pushType', title: '推送类型', align: "center",
                    templet: function (d) {
                        return getSysDictName('PushType', d.pushType);
                    }
                }
                , {field: 'pushCode', title: '编码', align: "left"}
                , {field: 'pushName', title: '名称', align: "left"}
                , {field: 'pushHospitalName', title: '推送医院', align: "center"}
                , {
                    field: 'pushTime', title: '推送日期', align: 'center', templet: function (d) {
                        if (isEmpty(d.pushTime)) {
                            return "";
                        } else {
                            return util.toDateString(d.pushTime, "yyyy-MM-dd HH:mm");
                        }
                    }
                }
                , {
                    field: 'pushStatus', title: '推送状态', align: "center",
                    templet: function (d) {
                        var str = d.pushStatus;
                        if (str === sysPushList.pushStatus.UNPUSH) {
                            return "未推送";
                        } else if (str === sysPushList.pushStatus.SUCCESS) {
                            return "成功";
                        } else if (str === sysPushList.pushStatus.FAIL) {
                            return "<span style='color: red;'>失败</span>";
                        }else if(str === sysPushList.pushStatus.PUSHING){
                            return "<span style='color: blue;'>推送中</span>";
                        }else {
                        }
                    }
                }
                , {
                    fixed: 'right', title: '操作', width: 140, align: 'center'
                    , toolbar: '#sysPushList_bar'
                }

            ]]
            ,done:function(res) {
                for(var i = 0;i<res.bizData.length;i++){
                    var state = res.bizData[i].pushStatus; //推送状态为1，禁止勾选
                    if(state === $.constant.pushStatus.SUCCESS){
                        var index = res.bizData[i]['LAY_TABLE_INDEX'];
                        $(".layui-table tr[data-index="+index+"] input[type='checkbox']").prop('disabled',true);
                        $(".layui-table tr[data-index="+index+"] input[type='checkbox']").next().addClass('layui-btn-disabled');
                        $('.layui-table tr[data-index=' + index + '] input[type="checkbox"]').prop('name', 'eee');
                    }

                }

            }

        },

        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'detail') { //详细
                //do something
                if (isNotEmpty(data.pushId)) {
                    saveOrEdit(data.pushId,data.pushStatus);
                }
            } else if (layEvent === 'push') { //推送
                layer.confirm('确定推送吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //
                    if (isNotEmpty(data.pushId)) {
                        var ids = [];
                        ids.push(data.pushId)
                       pushing(ids);
                    }
                });
            }
        }
    });

}

/**
 * 获取单个实体
 */
function saveOrEdit(id,pushStatus) {
    var url = "";
    var title = "";
    if (isEmpty(id)) {  //id为空,新增操作
        title = "新增";
        url = $.config.server + "/system/sysPushEdit";
    } else if(pushStatus === "2"){
        title = "失败原因";
        url = $.config.server + "/system/sysPushEdit?id=" + id;
    } else
    {  //编辑
        title = "详细";
        url = $.config.server + "/system/sysPushEdit?id=" + id;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url, //弹框自定义的url，会默认采取type=2
        readonly:true,
        width: 600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 400,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    //successToast("保存成功", 500);
                    var table = layui.table; //获取layui的table模块
                    table.reload('sysPushList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 推送
 */
function pushing(ids) {
    var param = {
        "ids" :ids
    }
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/sysPush/push.do",
        data: param,  //必须字符串后台才能接收list,
        loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("请手动刷新页面")
            var table = layui.table; //获取layui的table模块
            table.reload('sysPushList_table'); //重新刷新table
        }
    });

}

/**
 * 批量推送
 */
function batchPush(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('sysPushList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确定推送吗？', function (index) {
            layer.close(index);
            var ids = [];
            $.each(data, function (i, item) {
                ids.push(item.pushId);
            });
            pushing(ids);
        });
    }
}



