/**
 * 血管通路图历史记录的js文件，包括查询，编辑操作
 * @author anders
 * @date 2020-09-13
 * @version 1.0
 */
var patVascularLocusHisList = avalon.define({
    $id: "vascularRoadHistory",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,vascularRoadId: ''
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        var vascularRoadId =  GetQueryString('vascularRoadId');    //类别
        patVascularLocusHisList.vascularRoadId = vascularRoadId;
        
        getList();
        avalon.scan();
    });
});



/**
 * 查询列表事件
 */
function getList() {
    var param = {
        vascularRoadId: patVascularLocusHisList.vascularRoadId
    }
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#patVascularLocusHisList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patVascularLocusHisList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            // height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + '/patVascularLocusHis/listAll.do',
            limit: 10,
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'updateUserName', title: '修改人', align: 'center'}
                ,{field: 'updateTime', title: '修改时间', align: 'center',templet:function (d) {
                        return util.toDateString(d.updateTime, 'yyyy-MM-dd HH:mm');
                    }}
                ,{fixed: 'right', title: '操作', width: 80, align: 'center', toolbar: '#patVascularLocusHisList_bar'}
            ]]
        },
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'delete') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.vascularLocusHisId)) {
                        _ajax({
                            type: "POST",
                            //loading:true,  //是否ajax启用等待旋转框，默认是true
                            url: $.config.services.dialysis + '/patVascularLocusHis/delete.do',
                            data: {id: data.vascularLocusHisId},
                            dataType: "json",
                            done:function(data){
                                successToast('删除成功');
                                var table = layui.table; //获取layui的table模块
                                table.reload('patVascularLocusHisList_table'); //重新刷新table
                            }
                        });
                    }
                });
            }
        }
    });
    //监听表格checkbox
    table.on('row(patVascularLocusHisList_table)', function(obj){
        var rowData = obj.data;
        console.log('>>>>>>>>>>>>>>>>>>..',rowData);
        $('#roadImgDiv').find('span').remove();
        $('#roadImgDiv').find('img').attr('src', '');
        showRoadImg(rowData.locusMarkerPhoto, rowData.locusMarkerData)
        //标注选中样式
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
    });
}

function showRoadImg(url, data) {
    if (isNotEmpty(url)) {
        $('#roadImg').attr('src', url);
        if (isNotEmpty(data)) {
            var itemList = JSON.parse(data);
            // var imgWidth = $('#roadImgDiv').width();
            // var imgHeight = $('#roadImgDiv').height();
            var imgWidth;
            var imgHeight;
            var img = new Image();
            img.src=$('#roadImg').attr("src");
            img.onload=function(){
                imgWidth=$('#roadImg').width();    //获取图片宽度
                imgHeight=$('#roadImg').height();  //获取图片高度

                itemList.forEach(function (item, i) {
                    var color;
                    var html;
                    if (item.id.indexOf('circleA') > -1) {
                        color = '#FF784E';
                    } else if (item.id.indexOf('circleV') > -1) {
                        color = '#4BB2FF';
                    }

                    var left = (item.rationWidthInImg * imgWidth + 86) > imgWidth ? (imgWidth - 86) : (item.rationWidthInImg * imgWidth);
                    var top = (item.ratioHeightInImg * imgHeight + 85) > imgHeight ? (imgHeight - 85) : (item.ratioHeightInImg * imgHeight);
                    //添加标签编辑事件
                    if (item.id.indexOf('circle') > -1) {
                        html = '<span id="' + item.id + '" class="move active" style="left:' + left + 'px;top:' + item.ratioHeightInImg * imgHeight + 'px;position:absolute;cursor: pointer;transform: rotate(' + item.rotate + 'deg);">' +
                            '<span class="needle-no" style="background: ' + color+ ';transform: rotate(' + -item.rotate + 'deg);"> '+ item.tagText +
                            '</span><span style="display: inline-block;border-top: 1px solid;border-color: ' + color + ';width: 60px;padding-bottom: 4px;"></span></span>';
                    } else if (item.id.indexOf('tag') > -1) {
                        html = '<span id="' + item.id + '" class="move tag-div" style="left:' + item.rationWidthInImg * imgWidth + 'px;top:' + item.ratioHeightInImg * imgHeight + 'px;">' + item.tagText + '</span>';
                    } else if (item.id === 'auxiliary_tool') {   //点击辅助工具
                        html = '<span id="' + item.id + '" class="move" style="left:' + left + 'px;top:' + top + 'px;position:absolute;cursor: pointer;transform: rotate(' + item.rotate + 'deg);">' +
                            '<img src="' + $.config.server + '/static/images/auxiliary_tool.png"></span>';
                    }

                    $(html).appendTo('#roadImgDiv');
                })

            }

        }
    }
}


