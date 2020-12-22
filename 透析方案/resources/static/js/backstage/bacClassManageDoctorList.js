/**
 * bacClassManageDoctorList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 医生班种管理
 * @author: xcj
 * @version: 1.0
 * @date: 2020/08/04
 */
var bacClassManageDoctorList = avalon.define({
    $id: "bacClassManageDoctorList",
    baseFuncInfo: baseFuncInfo//底层基本方法
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        getList();  //查询列表
        avalon.scan();
    });
});

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

    param.manageType = "2";
    _ajax({
        type: "POST",
        url: $.config.services.schedule + "/bacClassManage/listManageDoctor.do",
        dataType: "json",
        data:param,
        done:function(data){
            // 列表表头
            var columnList = [
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'className', title: '班种', align:'center'}
                ,{field: 'classAttr', title: '班种属性' , align:'center',templet: function(d){
                    if(d.classAttr == '0'){
                        return '缺勤';
                    }
                    if(d.classAttr == '1'){
                        return '出勤';
                    }
                    if(d.classAttr == '2'){
                        return '休息';
                    }
                    if(d.classAttr == '3'){
                        return '加班';
                    }
                }}
            ];
            if(data.length>0){
                var obj = data[0];
                for(var key1  in obj){
                    if(key1 == "total"){
                        var total = obj[key1];
                        for(var i=0;i<total;i++){
                            var time_name = "时段"+getupperNum(i+1);
                            var time_ = "time_" + i;
                            columnList.push({field: time_, title: time_name, align:'center'});
                        }
                    }
                }
            }
            columnList.push({field: 'dataStatus', title: '状态', align:'center',templet: function(d) {
                    return getSysDictName("sys_status",d.dataStatus)
                }});
            columnList.push({field: 'classWorked', title: '工时', align:'center'});
            // columnList.push({field: 'remarks', title: '备注'});
            columnList.push({fixed: 'right',title: '操作',width: 140, align:'center'
                ,toolbar: '#bacClassManageDoctorList_bar'});

            _layuiTable({
                elem: '#bacClassManageDoctorList_table', //必填，指定原始表格元素选择器（推荐id选择器）
                filter:'bacClassManageDoctorList_table', ////必填，指定的lay-filter的名字
                page:false,
                //执行渲染table配置
                render:{
                    height:'full-80', //table的高度，页面最大高度减去差值
                    data:data,
                    cols: [columnList]
                },
                //监听工具条事件
                tool:function(obj,filter){
                    var data = obj.data; //获得当前行数据
                    var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                    var tr = obj.tr; //获得当前行 tr 的DOM对象
                    if(layEvent === 'edit'){ //编辑
                        //do something
                        if(isNotEmpty(data.classManageId)){
                            saveOrEdit(data.classManageId);
                        }
                    }else if(layEvent === 'del'){ //删除
                        layer.confirm('确定删除所选记录吗？', function(index){
                            // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                            layer.close(index);
                            //向服务端发送删除指令
                            if(isNotEmpty(data.classManageId)){
                                var ids=[];
                                ids.push(data.classManageId);
                                del(ids);
                            }
                        });
                    }
                }
            });
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(id){
    var url="";
    var title="";
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server+"/backstage/bacClassManageDoctorEdit";
    }else{  //编辑
        title="编辑";
        url=$.config.server+"/backstage/bacClassManageDoctorEdit?id="+id;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:800,  //弹框自定义的高度，方法会自动判断是否超过高度
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
                    getList();
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
        url: $.config.services.schedule+"/bacClassManage/deleteDoctor.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            getList();
        }
    });
}

/**
 * 方便添加时段后缀
 * @param num
 * @returns {*}
 */
function getupperNum(num) {
    if(num == 1){
        return "一";
    }
    if(num == 2){
        return "二";
    }
    if(num == 3){
        return "三";
    }
    if(num == 4){
        return "四";
    }
    if(num == 5){
        return "五";
    }
    if(num == 6){
        return "六";
    }
    if(num == 7){
        return "七";
    }
    if(num == 8){
        return "八";
    }
    if(num == 9){
        return "九";
    }
    if(num == 10){
        return "十";
    }
    if(num == 11){
        return "十一";
    }
    if(num == 12){
        return "十二";
    }
}
