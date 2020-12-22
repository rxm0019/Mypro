/**
 * 转归记录
 * @author care
 * @date 2020-08-24
 * @version 1.0
 */
var patOutInRecordList = avalon.define({
    $id: "patOutInRecordList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    paintName: '',
    patientRecordNo: '',
    patientId: '',
    outInType: '',//转归类型
});
layui.use(['index'], function() {
    var form = layui.form;
    form.on('radio(outInType)',function (obj) {
        patOutInRecordList.outInType = obj.value;
        getList(patOutInRecordList.patientId);
    })

    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //接收患者id
        patOutInRecordList.patientId = GetQueryString("patientId");
        getPatientBasicInfor(patOutInRecordList.patientId);
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList(patOutInRecordList.patientId);  //查询列表
        avalon.scan();
        // 更新外部iframe高度
        if (window.parent.onAppBodyResize) { window.parent.onAppBodyResize(); }
    });
});
/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#patOutInRecordList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'patOutInRecordList_search'  //指定的lay-filter
        ,conds:[

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
            table.reload('patOutInRecordList_table',{
                where:field
            });
        }
    });
}
/**
 * 查询列表事件
 */
function getList(patientId) {
    var param = {
        "patientId": patientId,
        "outInType": patOutInRecordList.outInType,
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#patOutInRecordList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'patOutInRecordList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patOutInRecord/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'outInDatetime', title: '转归日期',align:'center'
                    ,templet: function(d){
                        return util.toDateString(d.outInDatetime,"yyyy-MM-dd");
                    }}
                ,{field: 'outInReason', title: '转归原因',align:'left',sortField:'poir_.out_in_reason'
                    ,templet: function (d) {
                        if(d.outInType=="0"){
                            return getSysDictName("OutReason",d.outInReason)
                        }
                        if(d.outInType=="1"){
                            return getSysDictName("InReason",d.outInReason)
                        }

                    }}
                ,{field: 'outInType', title: '转入/转出',align:'center'
                    ,templet: function (d) {
                    return d.outInType==0 ? '转出' : '转入';
                    }
            }
                ,{field: 'remarks', title: '记录备注',align:'left'}
                ,{fixed: 'right',title: '操作',width: 140, align:'center'
                    ,toolbar: '#patOutInRecordList_bar'}
            ]]
            ,done: function (obj) {
                    // if(isNotEmpty(obj.bizData) && obj.bizData.length > 0){
                    //     //判断最新一笔转归记录对应的客户类型
                    //     decideCustomerType(obj.bizData[0]);
                    //
                    // }
            }
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.outInId)){
                    saveOrEdit(data.outInId);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.outInId)){
                        del(data.outInId);
                    }
                });
            }
        }
    });
}

/**
 * 获取患者基本信息
 */
function getPatientBasicInfor(patientId){
    var url="";
    if(isNotEmpty(patientId)){
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis+"/patOutInRecord/getPatientBasicInfor.do",
            data: {id: patientId},
            dataType: "json",
            done: function (data) {
                if(data!="" && data!==null){
                    patOutInRecordList.paintName=data.patientName;
                    patOutInRecordList.patientRecordNo=data.patientRecordNo;
                }else{
                    errorToast("还未获取患者信息")
                }
            }
        });

    }
}
/**
 * 获取单个实体
 */
function saveOrEdit(id){
    var url="";
    var title="";
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server+"/patient/patOutInRecordEdit?paintName="+patOutInRecordList.paintName
            +"&patientRecordNo="+patOutInRecordList.patientRecordNo+"&patientId="+patOutInRecordList.patientId;
    }else{  //编辑
        title="编辑";
        url=$.config.server+"/patient/patOutInRecordEdit?id="+id+"&paintName="+patOutInRecordList.paintName+"&patientRecordNo="+patOutInRecordList.patientRecordNo+"&patientId="+patOutInRecordList.patientId;
    }
    // _layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true, //是否在父窗口打开弹窗，默认false
        url:url,  //弹框自定义的url，会默认采取type=2
        width:600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:600,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin,layer){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.saveFateRecord(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('patOutInRecordList_table'); //重新刷新table
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
function del(id){
    var param={
        "id":id,
        "patientId":patOutInRecordList.patientId,
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis+"/patOutInRecord/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('patOutInRecordList_table'); //重新刷新table
        }
    });
}

