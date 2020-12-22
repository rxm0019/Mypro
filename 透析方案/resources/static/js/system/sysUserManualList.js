/**
 * 使用手册
 * @author: Gerald
 * @version: 1.0
 * @date: 2020/10/07
 */
var sysUserManualList = avalon.define({
    $id: "sysUserManualList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    selData: "", //选中的行的数据
    manunal: GetQueryString("manunal"),//：从菜单功能进入，可新增编辑；Y：从登录者下的浮窗进入，只可查看
    manualList: [],
    //选定操作手册
    onSelected: function (obj, item) {
        onSelectedInfo(obj, item);
    },
    remarks: '' // 显示的手册内容
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        initSearch(); //初始化搜索框
        getList();  //查询列表
        getManualList();
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#sysUserManualList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'sysUserManualList_search'  //指定的lay-filter
        , conds: [
            {field: 'manualName', title: '名称：', type: 'input'}
        ]
        , done: function (filter, data) {
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        , search: function (data) {
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('sysUserManualList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getList() {
    var param = {};
    //获取layui的table模块
    var table = layui.table;

    //监听行单击事件
    table.on('row(sysUserManualList_table)', function (obj) {
        $("#remarks").html(obj.data.remarks);
        $(".layui-table-click").each(function (i, e) {
            $(e).removeClass('layui-table-click');
        })
        obj.tr.addClass('layui-table-click');      //设置背景色和字体色
        sysUserManualList.selData = obj.data;   //将选中的数据存储
    });

    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#sysUserManualList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'sysUserManualList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.system + "/sysUserManual/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}  //开启编辑框
                , {type: 'numbers', title: '序号', width: 60}  //序号
                , {field: 'manualName', title: '名称'}
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'edit' || layEvent === 'detail') { //编辑、详情
                //do something
                if (isNotEmpty(data.manualId)) {
                    saveOrEdit(data.manualId, layEvent);
                }
            } else if (layEvent === 'del') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.manualId)) {
                        var ids = [];
                        ids.push(data.manualId);
                        del(ids);
                    }
                });
            }
        }
    });
}

/**
 * 获取状态为启用的手册信息
 */
function getManualList() {
    var param = {};
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysUserManual/getLists.do",
        data: param,
        dataType: "json",
        async: false,
        done: function (data) {
            if (data != null && data.length > 0) {
                sysUserManualList.manualList = data;
                // 滚动定位至选中元素
                var position = $(".dialysis-layout-side .layui-side-scroll .dialysis-dropdown-item.selected").position();
                if (position !== undefined) {
                    $(".dialysis-layout-side .layui-side-scroll").scrollTop(position.top);
                }
            }
        }
    });
}

/**
 * 选中操作手册时，更新手册信息
 * @param obj
 */
function onSelectedInfo(obj, item) {
    var dropdownItemObj = $(obj);

    // 设置手册列表项选中样式
    $(".dialysis-dropdown-item").removeClass("selected");
    dropdownItemObj.addClass("selected");
    var fileList = [];
    $("#fileShowDiv").html(fileList);//每点击一次，附件列表重新赋空值
    getInfo(item.manualId);//获取使用手册附件
    $("#remarks").html(item.remarks);//渲染右边内容框
}

/**
 * @param id
 * 获取使用手册附件
 */
function getInfo(id) {
    var param = {
        "manualId": id
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUserManual/getInfo.do",
        data: param,
        dataType: "json",
        async: false, // 异步设置为false
        done: function (data) {
            data.files = data.files || [];
            uploadFileObj = _layuiUploadFile({
                showFileDiv: "#fileShowDiv"
                , fileDatas: data.files
            })
            sysUserManualList.remarks = data.remarks;
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(id, layEvent) {
    var url = "";
    var title = "";
    if (isEmpty(id)) {  //id为空,新增操作
        title = "新增";
        url = $.config.server + "/system/sysUserManualEdit";
    } else {  //编辑
        title = "编辑";
        url = $.config.server + "/system/sysUserManualEdit?id=" + id + "&layEvent=" + layEvent;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 860,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('sysUserManualList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭

                    if (isNotEmpty(sysUserManualList.manunalId)) {
                        // 实时显示操作后的内容
                        getInfo(sysUserManualList.manunalId);
                        $('#remarks').html(sysUserManualList.remarks);
                    }
                }
            );
        }
    });
}

/**
 * 编辑事件
 */
function edit() {
    var checkStatus = layui.table.checkStatus('sysUserManualList_table');
    var data = checkStatus.data; // 获取选中行的数据
    if (data.length === 0) {
        warningToast("未选中任何记录");
    } else if (data.length > 1) {
        warningToast("只能选择一条记录");
    } else {
        var ids = [];
        $.each(data, function (i, item) {
            ids.push(item.manualId);
        });
        saveOrEdit(ids[0], 'edit');
    }
}

/**
 * 删除事件
 * @param ids
 */
function del(ids) {
    var param = {
        "ids": ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysUserManual/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('sysUserManualList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('sysUserManualList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确定删除所选记录吗？', function (index) {
            layer.close(index);
            var ids = [];
            $.each(data, function (i, item) {
                ids.push(item.manualId);
            });
            del(ids);
        });
    }
}

/**
 * 设置新增、修改所操作的手册ID
 * @param manualId
 */
function setManunalId(manualId) {
    sysUserManualList.manunalId = manualId;
}