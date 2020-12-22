/**
 * 门诊收费 处方明细
 * @author anders
 * @date 2020-09-27
 * @version 1.0
 */
var diaOutpatientItemEdit = avalon.define({
    $id: "diaOutpatientItemEdit",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,materielList: []        //物料库存信息
    ,oldUseNumber: 0          //编辑前的使用数量
    ,oldBatchNo: ''            //编辑前的批次号
    ,oldStockInfoId: ''          //库存信息id
    ,materielNo: ''
    ,type: ''
    ,prescriptionId: ''           //处方笺id
    ,isLock: 'Y'              //中心管理是否锁库，Y--是  N--否
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        diaOutpatientItemEdit.prescriptionId = GetQueryString("prescriptionId") || '';
        var id=GetQueryString("id");  //接收变量

        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
            diaOutpatientItemEdit.oldUseNumber = data.useNumber;
            diaOutpatientItemEdit.oldBatchNo = data.batchNo;
            diaOutpatientItemEdit.oldStockInfoId = data.stockInfoId;
            diaOutpatientItemEdit.materielNo = data.materielNo;
            diaOutpatientItemEdit.type = data.type;
            diaOutpatientItemEdit.isLock = data.isLock;
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
            url: $.config.services.dialysis+"/diaOutpatientItem/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                form.val('diaOutpatientItemEdit_form', data);
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
            diaOutpatientItemEdit.materielList = data;
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
    form.on('submit(diaOutpatientItemEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#diaOutpatientItemEdit_submit").trigger('click');
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
        param.oldUseNumber = diaOutpatientItemEdit.oldUseNumber;
        param.oldBatchNo = diaOutpatientItemEdit.oldBatchNo;
        param.oldStockInfoId = diaOutpatientItemEdit.oldStockInfoId;
        param.materielNo = diaOutpatientItemEdit.materielNo;
        param.type = diaOutpatientItemEdit.type;
        param.prescriptionId = diaOutpatientItemEdit.prescriptionId;
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis+"/diaOutpatientItem/edit.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



