/**
 * patDocRecordList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 *
 /* 文书上传记录 js
 * @Author wahmh
 * @Date 2020-9-28
 * @Version 1.0
 * */
var patDocRecordList = avalon.define({
    $id: "patDocRecordList",
    baseFuncInfo: baseFuncInfo,//底层基本方法/
    patientId: ''
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var patientId = GetQueryString('patientId')
        patDocRecordList.patientId = patientId;
        //所有的入口事件写在这里...
        getList(patientId);  //查询列表
        avalon.scan();
    });
});

/*
* 添加文书上传记录
* */
function add() {
    _layerOpen({
        openInParent: true,
        url: $.config.server + "/patient/patDocRecordEdit?patientId=" + patDocRecordList.patientId,  //弹框自定义的url，会默认采取type=2
        width: 800, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 650,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: '文书上传', //弹框标题
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success(data) {
                    successToast('添加成功');
                    var table = layui.table; //获取layui的table模块
                    table.reload('patDocRecordList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}
/**
 * 查询列表事件
 */
function getList(patientId) {
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#patDocRecordList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patDocRecordList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            where:{"patientId":patientId},
            page: false,
            url: $.config.services.dialysis + "/patDocRecord/list.do", // ajax的url必须加上getRootPath()方法
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}  //开启编辑框
                , {field: 'recordName', title: '标题'}
                , {
                    field: 'signDatetime',
                    title: '签名日期',
                    align: 'center',
                    sortField: 'pdr_.sign_datetime'
                    ,
                    templet: function (d) {
                        return util.toDateString(d.signDatetime, "yyyy-MM-dd");
                    }
                }
                , {field: 'remarks', title: '备注'}
                , {
                    fixed: 'right', title: '操作', align: 'center', width: 300
                    , toolbar: '#patDocRecordList_bar'
                }
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'edit') { //编辑
                _layerOpen({
                    openInParent: true,
                    url: $.config.server + "/patient/patDocRecordEdit?patientId=" + patDocRecordList.patientId + "&id=" + data.recordId,  //弹框自定义的url，会默认采取type=2
                    width: 800, //弹框自定义的宽度，方法会自动判断是否超过宽度
                    height: 650,  //弹框自定义的高度，方法会自动判断是否超过高度
                    title: '文书编辑', //弹框标题
                    done: function (index, iframeWin, layer) {
                        /**
                         * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
                         * 利用iframeWin可以执行弹框的方法，比如save方法
                         */
                        var ids = iframeWin.save(
                            //成功保存之后的操作，刷新页面
                            function success(data) {
                                successToast('编辑成功');
                                var table = layui.table; //获取layui的table模块
                                table.reload('patDocRecordList_table'); //重新刷新table
                                layer.close(index); //如果设定了yes回调，需进行手工关闭
                            }
                        );
                    }
                });
            } else if (layEvent === 'delete') { //删除
                layer.confirm('确认删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.recordId)) {
                        var ids = [];
                        ids.push(data.recordId);
                        del(ids);
                    }
                });
            } else if (layEvent === 'preview') {
                var arr=[];
                if(data.mimeType!==$.constant.FileType.PDF)
                {
                   arr.push("打印");
                    arr.push("取消");
                }
                //    预览
                _layerOpen({
                    btn: arr,
                    openInParent: true,
                    url: $.config.server + "/patient/patDocRecordPreview?recordId=" + data.recordId,  //弹框自定义的url，会默认采取type=2
                    width: 1000, //弹框自定义的宽度，方法会自动判断是否超过宽度
                    height: 800,  //弹框自定义的高度，方法会自动判断是否超过高度
                    title: '预览', //弹框标题
                    done: function (index, iframeWin, layer) {
                        /**
                         * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
                         * 利用iframeWin可以执行弹框的方法，比如save方法
                         */
                        var ids = iframeWin.save(
                            //成功保存之后的操作，刷新页面
                        );
                    }
                });
            }
        }
    });
}

/*
  * 删除事件
  * @param ids
  */
function del(ids) {
    var param = {
        "ids": ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patDocRecord/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('patDocRecordList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDelete() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('patDocRecordList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确认删除所选记录吗？', function (index) {
            layer.close(index);
            var ids = [];
            $.each(data, function (i, item) {
                ids.push(item.recordId);
            });
            del(ids);
        });
    }
}

