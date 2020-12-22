/**
 * 处方明细的js文件，包括查询，编辑操作
 * @author anders
 * @date 2020-09-15
 * @version 1.0
 */
var diaPrescriptionItemEdit = avalon.define({
    $id: "diaPrescriptionItemEdit",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,materielList: []        //物料库存信息
    ,oldUseNumber: 0          //编辑前的使用数量
    ,oldBatchNo: ''            //编辑前的批次号
    ,oldStockInfoId: ''          //库存信息id
    ,materielNo: ''
    ,type: ''
    ,diaRecordId: ''             //透析记录id
    ,isLock: 'Y'              //中心管理是否锁库，Y--是  N--否
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        diaPrescriptionItemEdit.diaRecordId = GetQueryString('diaRecordId') || '';
        var id=GetQueryString("id");  //接收变量

        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
            diaPrescriptionItemEdit.oldUseNumber = data.useNumber;
            diaPrescriptionItemEdit.oldBatchNo = data.batchNo;
            diaPrescriptionItemEdit.oldStockInfoId = data.stockInfoId;
            diaPrescriptionItemEdit.materielNo = data.materielNo;
            diaPrescriptionItemEdit.type = data.type;
            diaPrescriptionItemEdit.isLock = data.isLock;
            if (data.isLock === 'Y' && (data.type === '1' || data.type === '2')) {
                $('#batchNo').attr('lay-verify', 'required');
                getBatchNoList(data.materielNo, data.batchNo);
            } else {
                $('#batchNo').removeAttr('lay-verify');
            }
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
            "prescriptionItemId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis+"/diaPrescriptionItem/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.createTime=util.toDateString(data.createTime,"yyyy-MM-dd");
                data.updateTime=util.toDateString(data.updateTime,"yyyy-MM-dd");
                form.val('diaPrescriptionItemEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

/**
 * 获取物料批次号
 */
function getBatchNoList(materielNo, batchNo) {
    var param = {
        materielNo: materielNo
    }
    _ajax({
        type: "POST",
        loading:false,
        url: $.config.services.dialysis + "/diaPrescriptionItem/listAllByMaterielNo.do",
        data:param,
        dataType: "json",
        done:function(data){
            diaPrescriptionItemEdit.materielList = data;
            $('#batchNo').val(batchNo);
            layui.form.render('select');
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
    form.on('submit(diaPrescriptionItemEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#diaPrescriptionItemEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field; //表单的元素
        param.oldUseNumber = diaPrescriptionItemEdit.oldUseNumber;
        param.oldBatchNo = diaPrescriptionItemEdit.oldBatchNo;
        param.oldStockInfoId = diaPrescriptionItemEdit.oldStockInfoId;
        param.materielNo = diaPrescriptionItemEdit.materielNo;
        param.type = diaPrescriptionItemEdit.type;
        param.diaRecordId = diaPrescriptionItemEdit.diaRecordId;
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis+"/diaPrescriptionItem/edit.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



