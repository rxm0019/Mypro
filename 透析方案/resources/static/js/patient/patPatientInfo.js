/**
 * patPatientInfo.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 病历首页-基本信息页面
 * @Author swn
 * @version: 1.0
 * @Date 2020/8/12
 */
var patPatientInfo = avalon.define({
    $id: "patPatientInfo",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId:'',
    patPatientInfo: [],//表单数据
    patFamilyMemberLists: [],
    patientId: '',//患者id
    insuranceTypes: [], //医保类型下拉列表
    serverTime: new Date()
});
layui.use(['index', 'formSelects'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    var form = layui.form;
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate = layui.laydate;
        laydate.render({
            elem: '#birthday'
            ,type: 'date'
        });
        laydate.render({
            elem: '#firstReceptionDate'
            , type: 'date'
        });
        laydate.render({
            elem: '#firstDialysisDate'
            , type: 'date'
        });
        var patientId = GetQueryString("patientId");
        patPatientInfo.patientId = patientId;
        //查询右边表单数据
       // getPatPatientInfo(patientId);
        getInfo(patientId,function(data){
            // 获取出诊医生列表
            getDoctorRoleList();
            // 获取主责护士列表
            getNurseRoleList();

        })
        avalon.scan();

        // 更新外部iframe高度
        if (window.parent.onAppBodyResize) { window.parent.onAppBodyResize(); }
    });
    layui.form.on('checkbox(infectionStatus)', function(data){
        if(data.elem.checked){
            $(this).prop("checked",false);
            layui.form.render();
        }else{
            $(this).prop("checked", true);
            layui.form.render();
        }
    });
});
layui.use(['dropdown'], function () {
    var dropdown = layui.dropdown;
    var layer    = layui.layer;
    // ====================================================================================
    dropdown.suite("[lay-filter='test8']", {
        template: "#patPatientInfo",
        success: function ($dom) {
        }
    });
})
//查询右边表单数据
function getPatPatientInfo(id){
    getInfo(id,function(data){
        // 获取出诊医生列表
        getDoctorRoleList();
        // 获取主责护士列表
        getNurseRoleList();

    })
}
/**
 * 获取单个实体
 */
function saveOrEdit(type){
    var url="";
    var title="";
    if(type == 1){  //id为空,新增操作
        title="新增";
        url=$.config.server + "/patient/patPatientInfoEdit";
    }else{  //编辑
        title="编辑";
        url=$.config.server + "/patient/patPatientInfoEdit?id="+patPatientInfo.patientId;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true, //是否在父窗口打开弹窗，默认false
        url:url,  //弹框自定义的url，会默认采取type=2
        width:1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:800,  //弹框自定义的高度，方法会自动判断是否超过高度
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
                    getPatPatientInfo(patPatientInfo.patientId);
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            ,type);
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
        url: $.config.services.dialysis + "/patPatientInfo/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功",500);
            var table = layui.table; //获取layui的table模块
            table.reload('patPatientInfo_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('patPatientInfo_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.patientId);
            });
            del(ids);
        });
    }
}
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
            "patientId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patPatientInfo/getInfo.do",
            data:param,
            dataType: "json",
            success: function(res) {
                patPatientInfo.serverTime = new Date(res.ts);
            },
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.birthday=util.toDateString(data.birthday,"yyyy-MM-dd");
                data.firstReceptionDate = util.toDateString(data.firstReceptionDate,"yyyy-MM-dd");
                data.firstDialysisDate = util.toDateString(data.firstDialysisDate,"yyyy-MM-dd");
                data.createTime = util.toDateString(data.createTime,"yyyy-MM-dd");
                data.updateTime = util.toDateString(data.updateTime,"yyyy-MM-dd");
                patPatientInfo.patFamilyMemberLists = data.patFamilyMemberLists;
                data.fixedPhoneFront = data.fixedPhone.split("-")[0];
                data.fixedPhoneLast = data.fixedPhone.split("-")[1];
                /*医保类型复选下拉框*/
                var insuranceTypes =data.insuranceTypes;
                if(isNotEmpty(insuranceTypes)){
                    patPatientInfo.insuranceTypes = insuranceTypes.split(",");
                }
                var formSelects=layui.formSelects; //调用layui的form模块
                //以下方式则重新渲染所有的已存在多选
                //渲染下拉多选
                var arr = baseFuncInfo.getSysDictByCode('InsuranceType');
                formSelects.data('insuranceTypes', 'local', {
                    arr:arr
                });
                formSelects.value('insuranceTypes', patPatientInfo.insuranceTypes);//要选中的值
                $("#insuranceTypesId").parent().find(".icon-close").attr("style", "display: none");//隐藏关闭按钮
                //标签赋值
                var patPatientTagList = [];
                $.each(data.patPatientTagLists, function(index, item) {
                    var borderColor = getSysDictBizCode("PatientTagsColor", item.tagColor);
                    item.tagColor = borderColor;
                    patPatientTagList.push(item.tagContent)
                })
                data.patientTagList = patPatientTagList;
                data.age = getUserAge(patPatientInfo.serverTime, data.birthday);
                /*感染状况*/
                $("[type='checkbox']").removeAttr("checked");//先清空感染状况已选中项
                var arr=data.infectionStatus.split(",");
                $.each(arr, function (i) {
                    $("input:checkbox[name='infectionStatusS']").each(function () {
                        var val=$(this).val();
                        if (val ===arr[i]){
                            $(this).prop("checked", true);
                        }
                    });
                });
                patPatientInfo.patPatientInfo = data;
                form.val('patPatientInfo_form', data);
                getPatFamilyMemberList(data.patFamilyMemberLists);  //查询家庭情况列表
                getPatPastDialysisList(data.patPastDialysisLists); //查询过去透析史
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}
/**
 * 查询家庭情况列表
 */
function getPatFamilyMemberList(patFamilyMemberLists) {
    var param = {
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#patFamilyMemberList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'patFamilyMemberList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            data: patFamilyMemberLists,
            page: false,
            cols: [[ //表头
                {type: 'numbers', title: '序号'}  //序号
                ,{field: 'familyMemberName', title: '家属姓名',align:'center'}
                ,{field: 'mobilePhone',title: '家属手机',align:'center'}
                ,{field: 'relationship', title: '关系',align:'center'}
                ,{field: 'birthday', title: '生日',align:'center'
                    ,templet: function(d){
                    return util.toDateString(d.birthday,"yyyy-MM-dd");
                    }
                }
                ,{field: 'incomeStatus', title: '收入/年',align: 'right'}
                ,{field: 'occupation', title: '职业'}
                ,{field: 'remarks', title: '备注'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
        }
    });
}
/**
 * 查询过去透析史
 */
function getPatPastDialysisList(patPastDialysisLists) {
    var param = {
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#patPastDialysisList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'patPastDialysisList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            data: patPastDialysisLists,
            page: false,
            cols: [[ //表头
                {type: 'numbers', title: '序号',}  //序号
                ,{field: 'dialysisType', title: '透析类型',sortField:'ppd_.dialysisType',align:'center'
                    ,templet: function(d){
                        return getSysDictName("DialysisType",d.dialysisType);
                    }}
                ,{field: 'dialysisDateStart', title: '初始透析日期', sortField:'ppd_.dialysisDateStart',align:'center'
                    ,templet: function(d){
                        var dialysisDateStart = util.toDateString(d.dialysisDateStart,"yyyy-MM-dd");
                        var dialysisDateEnd = util.toDateString(d.dialysisDateEnd,"yyyy-MM-dd");
                        var dialysisDate = dialysisDateStart +"-" + dialysisDateEnd
                        return dialysisDate;
                    }}
                ,{field: 'dialysisHospital', title: '初始透析医院', sortField:'ppd_.dialysisHospital'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
        }
    });
}

/**
 * 获取医生列表
 */
function getDoctorRoleList(){
    var param ={
    }
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getDoctorRoleList.do",
        data:param,
        dataType: "json",
        done:function(data){
            $.each(data,function(i,item){
               if(item.id == patPatientInfo.patPatientInfo.firstDiagnosisDoctor){
                   patPatientInfo.patPatientInfo.firstDiagnosisDoctor = item.userName;
                   $('#firstDiagnosisDoctor').val(item.userName);
               }
            });
            var form = layui.form;
            form.render();
        }
    });
}
/**
 * 获取护士列表
 */
function getNurseRoleList(){
    var param ={
    }
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getNurseRoleList.do",
        data:param,
        dataType: "json",
        done:function(data){
            $.each(data,function(i,item){
                if(item.id == patPatientInfo.patPatientInfo.principalNurse){
                    patPatientInfo.patPatientInfo.principalNurses = item.userName;
                    $('#principalNurse').val(item.userName);
                }
            });
            var form = layui.form;
            form.render();
        }
    });
}
/**
 * 点击打印事件
 */
function onPrint() {
    var uuid = guid();
    sessionStorage.setItem(uuid, JSON.stringify(patPatientInfo.patPatientInfo));
    _layerOpen({
        openInParent: true,
        url: $.config.server + "/patient/patPatientInfoPrint?uuid=" + uuid,
        width: 820, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 842,  // 弹框自定义的高度，方法会自动判断是否超过高度
        title: "打印患者基本信息", // 弹框标题
        btn: ["打印", "取消"],
        done: function (index, iframeWin,layer) {
            var ids = iframeWin.onPrint();
        }
    });
}

/**
 * 弹框打开图片预览
 */
function previewImg() {
    var photoImages = patPatientInfo.patPatientInfo.photoImages;
    var photoData = [];
    if(photoImages != null && photoImages.length>0){
        photoData.push({ src: photoImages[0].filePath, alt: photoImages[0].fileTitle });
    } else{
        photoData.push({ src: + '/static/images/u6399.png', alt: 'default'});
    }
    parent.imagesPreview(photoData, 0);
}
