/**
 * patDiseaseDiagnosisList.jsp的js文件，包括列表查询、增加、修改、删除基础操作
 * 病历首页-疾病诊断页面
 * @Author swn
 * @version: 1.0
 * @Date 2020/8/12
 */
var patDiseaseDiagnosisList = avalon.define({
    $id: "patDiseaseDiagnosisList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId: '',//患者id
    patientName: '', //患者名称
    patientRecordNo: '',//患者编号
    gender: '',//患者性别
    age: '',//患者年龄
    infectionStatus: '',//是否感染
    customerType: '',//客户类型
    isShow: false
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var patientId = GetQueryString("patientId");
        patDiseaseDiagnosisList.patientId = patientId;
        getList();
        avalon.scan();
    });
});

/**
 * 查询列表事件
 */
function getList() {
    var param = {
        "patientId": patDiseaseDiagnosisList.patientId
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#patDiseaseDiagnosisList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'patDiseaseDiagnosisList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            url: $.config.services.dialysis + "/patDiseaseDiagnosis/listAll.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page:false,
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'diagnosisType', title: '诊断类型',sortField:'pdd_.diagnosis_type', align:'center'
                    ,templet: function(d){
                        //返回数据字典的名称
                        return getSysDictName("DiagnosisType",d.diagnosisType);
                    }
                  }
                ,{field: 'diagnoseTypeName', title: '诊断类别', align:'center'}

                ,{field: 'diagnoseDetailName', title: '诊断项目名称'}
                ,{field: 'icdCode', title: 'ICD-10编码', align:'center'}
                ,{field: 'diagnosisDate', title: '诊断时间',align:'center',sortField:'pdd_.diagnosis_date'
                    ,templet: function(d){
                        return util.toDateString(d.diagnosisDate,"yyyy-MM-dd");
                    }
                 }
                ,{field: 'diagnosisDoctorName', title: '诊断医生',sortField:'pdd_.diagnosis_doctor_id', align:'center'}
                ,{fixed: 'right',title: '操作',width: 140, align:'center'
                    ,toolbar: '#patDiseaseDiagnosisList_bar'}
            ]],
            done: function(res, curr, count) {
                // 更新外部iframe高度
                if (window.parent.onAppBodyResize) { window.parent.onAppBodyResize(); }
            }
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.diseaseDiagnosisId)){
                    saveOrEdit(data);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确认删除所选纪录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.diseaseDiagnosisId)){
                        var ids=[];
                        ids.push(data.diseaseDiagnosisId);
                        del(ids);
                    }
                });
            }
        }
    });
}

/**
 * 获取单个实体
 * @param data
 */
function saveOrEdit(data){
    var url="";
    var title="";
    if(isEmpty(data)){  //id为空,新增操作
        title="疾病诊断新增";
        url=$.config.server + "/patient/patDiseaseDiagnosisEdit?patientId="+patDiseaseDiagnosisList.patientId;
    }else{  //编辑
        title="疾病诊断编辑";
        url=$.config.server + "/patient/patDiseaseDiagnosisEdit?id="+data.diseaseDiagnosisId+"&patientId="+patDiseaseDiagnosisList.patientId+"&diagnosisDoctorId="+data.diagnosisDoctorId+"&diagnosisDate="+data.diagnosisDate;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url:url,  //弹框自定义的url，会默认采取type=2
        width:1000, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:600,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin,layer){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功",500);
                    var table = layui.table; //获取layui的table模块
                    table.reload('patDiseaseDiagnosisList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            ,data);
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
        url: $.config.services.dialysis + "/patDiseaseDiagnosis/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功",500);
            var table = layui.table; //获取layui的table模块
            table.reload('patDiseaseDiagnosisList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('patDiseaseDiagnosisList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条纪录");
        return false;
    }else{
        layer.confirm('确认删除所选纪录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.diseaseDiagnosisId);
            });
            del(ids);
        });
    }
}

