/**
 * bacInfectTrainDetailOrPrint.jsp的js文件
 * @author Chauncey
 * @date 2020/09/03
 * @description 用于查看感控培训详情和打印。
 * @version 1.0
 */
var bacInfectTrainDetailOrPrint = avalon.define({
    $id: "bacInfectTrainDetailOrPrint",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    currentUser:baseFuncInfo.userInfoData.username, //当前登录者名字
    sysUserList:[],//所有使用者列表
    departmentName:"",//科室
    trainMethodName:"",//培训方式
    compereName:"",//主持人
    designerName:"",//制定人
    joinUserName:"",//出勤人员
    absenceUserName:"",//缺勤人员
    trainMethodSelect:[ //0-线上培训，1-口授
        {"name":"全部","value":""}
        ,{"name":"线上培训","value":0}
        ,{"name":"口授","value":1}],
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        laydate.render({
            elem: '#sterilizeDate'
            ,type: 'date'
            ,trigger: 'click'
        });
        var id=GetQueryString("id");  //接收变量
        var readonly = GetQueryString("readonly");
        getUserList();
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            debugger
            bacInfectTrainDetailOrPrint.departmentName = getSysDictName("Department",data.department);//科室
            //培训方式
            for(var index in bacInfectTrainDetailOrPrint.trainMethodSelect){
                if(data.trainMethod == bacInfectTrainDetailOrPrint.trainMethodSelect[index].value){
                    bacInfectTrainDetailOrPrint.trainMethodName = bacInfectTrainDetailOrPrint.trainMethodSelect[index].name;
                }
            }
            //主持人
            for(var index in bacInfectTrainDetailOrPrint.sysUserList){
                debugger
                if(data.compere == bacInfectTrainDetailOrPrint.sysUserList[index].id){
                    bacInfectTrainDetailOrPrint.compereName = bacInfectTrainDetailOrPrint.sysUserList[index].userName;
                }
            }
            //制定人
            for(var index in bacInfectTrainDetailOrPrint.sysUserList){
                debugger
                if(data.designer == bacInfectTrainDetailOrPrint.sysUserList[index].id){
                    bacInfectTrainDetailOrPrint.designerName = bacInfectTrainDetailOrPrint.sysUserList[index].userName;
                }
            }
            //出勤人员
            if(data.joinUser !=null && data.joinUser !=""){
                var htmlJoinUser = "";
                var joinUserArr = data.joinUser.split(',');
                for(var index in bacInfectTrainDetailOrPrint.sysUserList){
                    for(var i in joinUserArr){
                        if(joinUserArr[i] == bacInfectTrainDetailOrPrint.sysUserList[index].id){
                            htmlJoinUser +="<span style='padding-right: 50px'>";
                            htmlJoinUser +=bacInfectTrainDetailOrPrint.sysUserList[index].userName;
                            htmlJoinUser +="</span>";
                        }
                    }
                }
                $("#joinUserName").html(htmlJoinUser);
            }
            //缺勤人员
            if(data.absenceUser !=null && data.absenceUser !=""){
                var absenceUserArr = data.absenceUser.split(',');
                var htmlAbsenceUser = "";
                for(var index in bacInfectTrainDetailOrPrint.sysUserList){
                    for(var i in absenceUserArr){
                        if(absenceUserArr[i] == bacInfectTrainDetailOrPrint.sysUserList[index].id){
                            htmlAbsenceUser +="<span style='padding-right: 50px'>";
                            htmlAbsenceUser +=bacInfectTrainDetailOrPrint.sysUserList[index].userName;
                            htmlAbsenceUser +="</span>";
                        }
                    }
                }
                $("#absenceUserName").html(htmlAbsenceUser);
            }
            $("#content").html(data.content);
        });

        layui.$("#btnEditAtten").click(function(){
            openAttendanceList(id);
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
            "infectTrainId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/bacInfectTrain/getInfo.do",
            data:param,
            dataType: "json",
            async:false,
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.planDate=util.toDateString(data.planDate,"yyyy-MM-dd");
                form.val('bacInfectTrainDetailOrPrint_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}
/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(bacInfectTrainDetailOrPrint_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacInfectTrainDetailOrPrint_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        var param=field;
        var url = $.config.services.logistics + "/bacDaySterilize/edit.do";
        if(field.daySterilizeId === null || field.daySterilizeId === ''){
            //新增
            url = $.config.services.logistics + "/bacDaySterilize/save.do"
        }
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}

/**
 * 获取使用者列表
 */
function getUserList(){
    var param ={
    }
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.logistics + "/bacInfectTrain/getUserLists.do",
        data:param,
        dataType: "json",
        async:false,
        done:function(data){
            bacInfectTrainDetailOrPrint.sysUserList = data;

        }
    });
}

/**
 * 点击打印事件
 */
function onPrint() {
    document.getElementById("btnEditAtten").style.display = "none";
    document.getElementById("print").style.zoom = 0.84;
    window.print();
}

/**
 * 获取出勤情况
 */
function openAttendanceList(id){
    var title="出勤情况";
    var url=$.config.server+"/departmentdaily/attendanceList?id=" + id ;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:497, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:520,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin){
            layer.close(index); //如果设定了yes回调，需进行手工关闭
            var contentvalue = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        },
        end:function() {
            location.reload();
        }
    });
}



