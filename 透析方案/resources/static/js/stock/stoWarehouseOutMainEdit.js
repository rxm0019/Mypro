/**
 * 出库管理的js文件，包括查询，编辑操作
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/31
 */
var stoWarehouseOutMainEdit = avalon.define({
    $id: "stoWarehouseOutMainEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    detailList:[],//出库物料明细
    patientList:[],//患者列表
    patientId:'',//患者ID
    patientRecordNo:'',//病历号
    status:'',//出库状态
    un_submit: '0' == GetQueryString("status"), // 待出库
    submit: '1' == GetQueryString("status"), // 已出库
    close: '2' == GetQueryString("status"), // 已关闭
    type:'',//出库类型
    sale: '0' == GetQueryString("type"), // 销售出库
    pick: '1' == GetQueryString("type"), // 领料出库
    purchase: '2' == GetQueryString("type"), // 采购退货出库
    reportLoss: '3' == GetQueryString("type"), // 报损出库
    inventoryLoss: '4' == GetQueryString("type"), // 盘亏出库
    allocation: '5' == GetQueryString("type"), // 调拨出库
    other: '6' == GetQueryString("type"), // 其他出库
    orderOutNo: {readonly: false}, // 出库单编号设置只读
    layEvent:'',
    disabled:{disabled: false}, // 设置只读
    readonly:{readonly: false}, // 设置只读
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...

        var id=GetQueryString("id");  //接收变量
        stoWarehouseOutMainEdit.layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        var isNumber = GetQueryString("isNumber");//出库单号是否自动编码
        if($.constant.isNumber.Y == isNumber){
            stoWarehouseOutMainEdit.orderOutNo = {readonly: true};
            $('input[name="orderOutNo"]').prop('placeholder', '系统自动生成');
        }
        //销售出库显示患者姓名，否则显示操作人
        if(stoWarehouseOutMainEdit.sale==true){
            document.getElementById("patient").style.display = "block";
            document.getElementById("createBy").style.display = "none";
        }else{
            document.getElementById("patient").style.display = "none";
            document.getElementById("createBy").style.display = "block";
        }
        //添加物料按钮：查看详情与盘亏出库时不显示
        if(stoWarehouseOutMainEdit.layEvent != 'detail' && stoWarehouseOutMainEdit.inventoryLoss == false){
            document.getElementById("tool").style.display = "block";
        }else{
            document.getElementById("tool").style.display = "none";
        }
        //获取患者列表
        getPatientList(function(data){
            //不同的出库类型、出库状态，界面控件显示
            addHtml(id);

            if(stoWarehouseOutMainEdit.sale==true){
                stoWarehouseOutMainEdit.type = '销售出库';
            }else if(stoWarehouseOutMainEdit.pick==true){
                stoWarehouseOutMainEdit.type = '领料出库';
            }else if(stoWarehouseOutMainEdit.purchase==true){
                stoWarehouseOutMainEdit.type = '采购退货出库';
            }else if(stoWarehouseOutMainEdit.reportLoss==true){
                stoWarehouseOutMainEdit.type = '报损出库';
            }else if(stoWarehouseOutMainEdit.inventoryLoss==true){
                stoWarehouseOutMainEdit.type = '盘亏出库';
            }else if(stoWarehouseOutMainEdit.allocation==true){
                stoWarehouseOutMainEdit.type = '调拨出库';
            }else if(stoWarehouseOutMainEdit.other==true) {
                stoWarehouseOutMainEdit.type = '其他出库';
            }
            if(isEmpty(id) || stoWarehouseOutMainEdit.un_submit==true){
                stoWarehouseOutMainEdit.status="待出库";
            }else if(stoWarehouseOutMainEdit.submit==true){
                stoWarehouseOutMainEdit.status="已出库";
            }else if(stoWarehouseOutMainEdit.close==true){
                stoWarehouseOutMainEdit.status="已关闭";
            }else{
                stoWarehouseOutMainEdit.status="";
            }
            //渲染出库状态、出库类型文本框
            var form=layui.form; //调用layui的form模块
            var createName='';
            if(isEmpty(id)){
                createName = baseFuncInfo.userInfoData.username;
            }else{
                createName = GetQueryString("createName");
            }
            //控件渲染
            var data = {
                type:stoWarehouseOutMainEdit.type,
                status:stoWarehouseOutMainEdit.status,
                createName:createName
            };
            form.val('stoWarehouseOutMainEdit_form', data);
            if (stoWarehouseOutMainEdit.layEvent == 'detail') {
                $('input[type="text"]').prop('disabled', true);
                stoWarehouseOutMainEdit.disabled = {disabled: true};
                stoWarehouseOutMainEdit.readonly = {readonly: true};
            }
            //获取实体信息
            getInfo(id,function(data){

                //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
                //...
            });
        });
        //出库物料明细
        if(isNotEmpty(id)){
            getDetailList(id);
        }
        //渲染出库物料明细列表
        getList();
        //下拉框联动，根据病历号带出患者姓名
        form=layui.form;
        form.on('select(patientId)', function(data){
            $.each(stoWarehouseOutMainEdit.patientList, function (i, item) {
                if(item.patientRecordNo==data.value){
                    $("#patientName").val(item.patientName);//渲染患者姓名文本框
                    stoWarehouseOutMainEdit.patientId = item.patientId;
                    stoWarehouseOutMainEdit.patientRecordNo = data.value;
                }
            });
        });
        avalon.scan();
    });
});

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getInfo(id,$callback){
    if(isEmpty(id)){
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    }else{
        //编辑
        var param={
            "warehouseOutMainId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.pharmacy + "/stoWarehouseOutMain/"+GetQueryString("type")+"/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){

                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                var tmp = {
                    warehouseOutMainId:data.warehouseOutMainId,
                    orderOutNo:data.orderOutNo,
                    bussOrderNo:data.bussOrderNo,
                    remarks:data.remarks,
                    closereason:data.closereason,
                    receivableNo:data.receivableNo,
                    updateTime: util.toDateString(data.updateTime, "yyyy-MM-dd"),
                    warehouseOutDate: isNotEmpty(data.warehouseOutDate) ?util.toDateString(data.warehouseOutDate, "yyyy-MM-dd"):""
                }
                form.val('stoWarehouseOutMainEdit_form', tmp);
                var list = stoWarehouseOutMainEdit.patientList.filter(x=>x.patientRecordNo==data.bussOrderNo);
                if(list !=null && list.length>0){
                    var patientName = stoWarehouseOutMainEdit.patientList.filter(x=>x.patientRecordNo==data.bussOrderNo)[0].patientName;
                    $("#patientName").val(patientName);//渲染患者姓名文本框
                    stoWarehouseOutMainEdit.patientId = stoWarehouseOutMainEdit.patientList.filter(x=>x.patientRecordNo==data.bussOrderNo)[0].patientId;
                }
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

//查询病患列表
function getPatientList($callback){
    var param = {
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.pharmacy + "/stoWarehouseOutMain/patientList.do", // ajax的url必须加上getRootPath()方法
        data:param,
        dataType: "json",
        done:function(data){
            $.each(data, function (i, item) {
                item.noAndName = item.patientRecordNo+" | "+item.patientName;
            });
            stoWarehouseOutMainEdit.patientList = data;
            var form=layui.form; //调用layui的form模块
            form.render();
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}

//不同的出库类型、出库状态，界面控件显示
function addHtml(id) {
    var form=layui.form; //调用layui的form模块
    var html = '';
    if(stoWarehouseOutMainEdit.sale==true || stoWarehouseOutMainEdit.inventoryLoss==true){
        if(stoWarehouseOutMainEdit.sale==true){
            html += '<div class="layui-col-sm3 layui-col-md3 layui-col-lg3">' +
                '<div class="disui-form-flex">'+
                '<label>病历号：</label>'
            if(stoWarehouseOutMainEdit.layEvent==="detail"){
                html += '<select name="bussOrderNo" lay-filter="patientId"  disabled>'
            }else{
                html += '<select name="bussOrderNo" lay-filter="patientId" >'
            }
            html +=  ' <option value="">请选择</option>'
            $.each(stoWarehouseOutMainEdit.patientList,function(index, item){
                html +=  '<option value=' +item.patientRecordNo+ '>' +item.noAndName+ '</option>'
            })
            html +='</select>'
            html +='</div>'
            html +='</div>'
        }else{
            html +='<div class="layui-col-sm6 layui-col-md4 layui-col-lg3">'+
                '<div class="disui-form-flex" >'+
                '<label>盘点单号：</label>'+
                '<input type="text" name="bussOrderNo" autocomplete="off" readonly>'+
                '</div>'+
                '</div>'
        }
        html += '<div class="layui-col-sm3 layui-col-md3 layui-col-lg3">' +
            '<div class="disui-form-flex" >'+
            '<label>出库状态：</label>'+
            '<input type="text" name="status" autocomplete="off" readonly>'+
            '</div>'+
            '</div>'
    }
    if(((stoWarehouseOutMainEdit.sale==false && stoWarehouseOutMainEdit.inventoryLoss==false)) && (isEmpty(id) || stoWarehouseOutMainEdit.un_submit==true || stoWarehouseOutMainEdit.submit==true)){
        html +='<div class="layui-col-sm12 layui-col-md8 layui-col-lg6">'+
            '<div class="disui-form-flex " >'+
            '<label>摘要：</label>'
        if(stoWarehouseOutMainEdit.layEvent=="detail"){
            html +='<textarea name="remarks" readonly></textarea>'
        }else{
            html +='<textarea name="remarks"></textarea>'
        }
        html +='</div>'+
            '</div>'
    }
    if(((stoWarehouseOutMainEdit.sale==false && stoWarehouseOutMainEdit.inventoryLoss==false)) && (stoWarehouseOutMainEdit.close==true)){
        html +='<div class="layui-col-sm12 layui-col-md8 layui-col-lg6">'+
            '<div class="disui-form-flex " >'+
            '<label>关闭原因：</label>'
        if(stoWarehouseOutMainEdit.layEvent=="detail"){
            html +='<textarea name="closereason" readonly></textarea>'
        }else{
            html +='<textarea name="closereason"></textarea>'
        }
        html +='</div>'+
            '</div>'
    }
    html += '<div class="layui-col-sm3 layui-col-md3 layui-col-lg3">' +
        '<div class="disui-form-flex" >' +
        '<label><span class="edit-verify-span">*</span>出库日期：</label>' +
        '<input type="text" name="warehouseOutDate" id="warehouseOutDate" lay-verify="required" autocomplete="off" :attr="@orderOutNo">' +
        '</div>' +
        '</div>'
    if (stoWarehouseOutMainEdit.sale == true) {
        html += '<div class="layui-col-sm3 layui-col-md3 layui-col-lg3">' +
            '<div class="disui-form-flex" >' +
            '<label>处方单号：</label>' +
            '<input type="text" name="receivableNo" id="receivableNo" autocomplete="off" readonly="readonly"' +
            '</div>' +
            '</div>' +
            '</div>'
    }
    if((stoWarehouseOutMainEdit.sale==true || stoWarehouseOutMainEdit.inventoryLoss==true) && (isEmpty(id) || stoWarehouseOutMainEdit.un_submit==true || stoWarehouseOutMainEdit.submit==true)){
        html +='<div class="layui-col-sm12 layui-col-md12 layui-col-lg12">'+
            '<div class="disui-form-flex " >'+
            '<label>摘要：</label>'
        if(stoWarehouseOutMainEdit.layEvent=="detail"){
            html +='<textarea name="remarks" readonly></textarea>'
        }else{
            html +='<textarea name="remarks"></textarea>'
        }
        html +='</div>'+
            '</div>'
    }
    if((stoWarehouseOutMainEdit.sale==true || stoWarehouseOutMainEdit.inventoryLoss==true) && (stoWarehouseOutMainEdit.close==true)){
        html +='<div class="layui-col-sm12 layui-col-md12 layui-col-lg12">'+
            '<div class="disui-form-flex " >'+
            '<label>关闭原因：</label>'
        if(stoWarehouseOutMainEdit.layEvent=="detail"){
            html +='<textarea name="closereason" readonly></textarea>'
        }else{
            html +='<textarea name="closereason"></textarea>'
        }
        html +='</div>'+
            '</div>'
    }

    $('#detail').html(html);


    var laydate = layui.laydate;
    laydate.render({
        elem: '#warehouseOutDate'
        , type: 'date'
        , trigger: 'click'
    });

    if (isEmpty(stoWarehouseOutMainEdit.layEvent)) {
        form.val('stoWarehouseOutMainEdit_form', {
            warehouseOutDate: layui.util.toDateString(new Date(), "yyyy-MM-dd")
        });

    }
    form.render();
}

//添加物料
function add() {
    //查看详情时按钮不可用，出库类型为盘亏出库时按钮不可用
    if(stoWarehouseOutMainEdit.layEvent != 'detail' && stoWarehouseOutMainEdit.inventoryLoss==false){
        var title = "添加物料";
        var url = $.config.server + "/stock/stockOutCommonList?type="+GetQueryString("type");
        //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
        _layerOpen({
            url: url,
            width: 1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
            height: 850,  //弹框自定义的高度，方法会自动判断是否超过高度
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
                        table.reload('stoWarehouseOutMainDetailList_table'); //重新刷新table
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                    }
                );
            }
        });
    }
}

//子页面调用，获取返回的物料数组
function getAddList(ids) {
    //将选择的物料带回
    $.each(ids, function (i, item) {
        //采购退货出库出库数量自动带回剩余库存，其余出库类型出库数量、剩余出库数量默认为0
        if(stoWarehouseOutMainEdit.purchase==false){
            item.warehouseOutCounts=0;
            item.warehouseOutCountSurplus=0;
        }else{
            item.warehouseOutCounts=item.stockCount;
            item.warehouseOutCountSurplus=0;
        }
        stoWarehouseOutMainEdit.detailList.push(item);
    });
    // 将新数据重新载入表格
    var table=layui.table;
    table.reload("stoWarehouseOutDetailList_table",{
        data:stoWarehouseOutMainEdit.detailList
    })
}

//子页面调用，获取已选择的物料数组
function getSelectList() {
    return stoWarehouseOutMainEdit.detailList
}

//查询出库记录明细
function getDetailList(id,$callback){
    var param = {
        warehouseOutMainId:id
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.pharmacy + "/stoWarehouseOutMain/"+GetQueryString("type")+"/detailList.do", // ajax的url必须加上getRootPath()方法
        data:param,
        dataType: "json",
        done:function(data){
            stoWarehouseOutMainEdit.detailList = data;
            getList();
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}

/**
 * 出库物料明细列表渲染
 */
function getList() {
    var param = {
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#stoWarehouseOutDetailList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'stoWarehouseOutDetailList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            data: stoWarehouseOutMainEdit.detailList,
            page:false,
            limit: Number.MAX_VALUE, // 数据表格默认全部显示
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 , fixed: 'left'}  //序号
                ,{field: 'bussOrderNo', title: '采购单编号',align:'center',minWidth:140, fixed: 'left',
                    hide:stoWarehouseOutMainEdit.purchase == false}
                ,{field: 'materielType', title: '物料类别',align:'center',width:90, fixed: 'left'
                    ,templet: function(d){
                        return getSysDictName("materielType",d.materielType);
                    }}
                ,{field: 'materielNo', title: '物料编码',align:'center',minWidth:140, fixed: 'left'}
                ,{field: 'materielName', title: '物料名称',align:'left',minWidth:300, fixed: 'left'}
                ,{field: 'warehouseOutCounts', title: '*出库数量',align:'right',minWidth:100, edit: 'text'}
                ,{field: 'houseName', title: '仓库',align:'center',minWidth:130}
                ,{field: 'batchNo', title: '批次号',align:'center',minWidth:150}
                ,{field: 'specifications', title: '规格',align:'center',minWidth:100}
                ,{field: 'manufactor', title: '厂家',align:'center',minWidth:200}
                ,{field: 'stockUnit', title: '单位',align:'center',minWidth:80,
                    templet: function(d){
                        return getSysDictName($.dictType.purSalesBaseUnit,d.stockUnit);
                    }
                }
                ,{field: 'expirationDate', title: '到期日期',align:'center',minWidth:110
                    ,templet: function(d){
                        return util.toDateString(d.updateTime,"yyyy-MM-dd");
                    }}
                ,{field: 'remarks', title: '备注',align:'left',minWidth:200, edit: 'text'}
                ,{fixed: 'right',title: '操作', align:'center'
                    ,toolbar: '#stoWarehouseOutDetailList_bar'}
            ]],
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            //查看详情、盘亏出库时删除按钮不可用
            if(layEvent === 'delete' && stoWarehouseOutMainEdit.layEvent != 'detail' && stoWarehouseOutMainEdit.inventoryLoss == false) {
                //已存在出库ID点击删除直接更新至数据库，否则仅将数据从列表中移除
                if(isNotEmpty(data.warehouseOutId)){
                    layer.confirm('确定将所选记录从列表中删除？', function(index){
                        layer.close(index);
                        if(isNotEmpty(data.warehouseOutId)){
                            del(obj,data.warehouseOutId);
                        }
                    });
                }else{
                    stoWarehouseOutMainEdit.detailList.splice(obj.tr.index(),1)
                    table.reload("stoWarehouseOutDetailList_table",{
                        data:stoWarehouseOutMainEdit.detailList  // 将新数据重新载入表格
                    })
                }
            }
        }
    });
    //监听单元格编辑
    table.on('edit(stoWarehouseOutDetailList_table)', function(obj){
        var value = obj.value //得到修改后的值
            ,data = obj.data //得到所在行所有键值
            ,field = obj.field; //得到字段
        var old=$(this).prev().text();//原值
        var index = obj.tr.index();//行下标
        //检验只能输入正整数
        var numberReg = /^[+]{0,1}(\d+)$/;
        //备注也可编辑，只有编辑出库数量才校验
        if(field=="warehouseOutCounts"){
            if(isNotEmpty(value) && !numberReg.test(value)){
                errorToast("物料编码"+data.materielNo+"的出库数量只能输入正整数！");
                $(this).val(old);//文本重新赋原值
                stoWarehouseOutMainEdit.detailList[index].warehouseOutCounts = old;//列表重新赋原值
            }
            //盘亏出库，可剩余出库数量(可剩余出库数量=出库数量 - 手动修改的数量；手动修改的数量不允许超过出库数量)
            if(stoWarehouseOutMainEdit.inventoryLoss==true){
                if(parseInt(value)>parseInt(old)+parseInt(data.warehouseOutCountSurplus)){
                    errorToast("物料编码"+data.materielNo+"手动修改的数量不允许超过原出库数量!");
                    $(this).val(old);//文本重新赋原值
                }else{
                    stoWarehouseOutMainEdit.detailList[index].warehouseOutCountSurplus = parseInt(old)+parseInt(data.warehouseOutCountSurplus)-parseInt(value);
                }
            }else {
                //出库量不能大于可用库存量，可用库存量=库存量-锁库数量
                if(parseInt(data.stockCount)<parseInt(value)){
                    errorToast("物料编码"+data.materielNo+"的出库量不能大于可用库存量"+data.stockCount+"!");
                    $(this).val(old);//文本重新赋原值
                    stoWarehouseOutMainEdit.detailList[index].warehouseOutCounts = old;//列表重新赋原值
                }
            }
        }
    });
}

/**
 * 删除单笔出库明细
 * @param ids
 */
function del(obj,id){
    var param = {
        "id":id
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/stoWarehouseOutMain/"+GetQueryString("type")+"/delete.do",
        data:param,  //必须字符串后台才能接收list,
        dataType: "json",
        done: function(data){
            stoWarehouseOutMainEdit.detailList.splice(obj.tr.index(),1)
            var table=layui.table;
            table.reload("stoWarehouseOutDetailList_table",{
                data:stoWarehouseOutMainEdit.detailList  // 将新数据重新载入表格
            })
        }
    });
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(stoWarehouseOutMainEdit_submit)', function(data){
        var table = layui.table; //获取layui的table模块
        //获取表单数据
        var list = stoWarehouseOutMainEdit.detailList;
        var tmp = [];
        $.each(list, function (i, item) {
            if(item.warehouseOutCounts=='0'){
                tmp.push(item);
            }
        });
        if(tmp.length>0){
            layer.confirm('至少存在一笔出库量为0的物料，确定继续保存？', function(index){
                //通过表单验证后
                var field = data.field; //获取提交的字段
                typeof $callback === 'function' && $callback(field,list); //返回一个回调事件
            });
        }else{
            //通过表单验证后
            var field = data.field; //获取提交的字段
            typeof $callback === 'function' && $callback(field,list); //返回一个回调事件
        }
    });
    $("#stoWarehouseOutMainEdit_submit").trigger('click');
}

/**
 * 保存
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field,list){
        //成功验证后
        var param=field; //表单的元素
        //判断是否存在主键ID，不存在执行新增否则为编辑
        var url = '';
        if(param.warehouseOutMainId.length == 0){
            url = $.config.services.pharmacy + "/stoWarehouseOutMain/"+GetQueryString("type")+"/save.do";
        }else{
            url = $.config.services.pharmacy + "/stoWarehouseOutMain/"+GetQueryString("type")+"/edit.do";
        }
        //可以继续添加需要上传的参数
        //出库明细
        param.warehouseOutDetailList = list;
        //出库类型
        param.type = GetQueryString("type");
        //出库标识，页面添加为1-手动
        if(GetQueryString("flag")=="1"){
            param.autoFlag = "1";
        }
        param.patientId = stoWarehouseOutMainEdit.patientId;
        param.patientRecordNo = stoWarehouseOutMainEdit.patientRecordNo;
        if(isEmpty(GetQueryString("id"))){
            param.status = "0";
        }else{
            param.status = GetQueryString("status");
        }
        //中心是否自动编码
        param.isNumber = GetQueryString("isNumber");
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            contentType: "application/json; charset=utf-8", //此设置后台可接受复杂参数，后台接收需要@RequestBody标签
            data:JSON.stringify(param), //此设置后台可接受复杂参数
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



