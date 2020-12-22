/**
 * eduPatient.jsp的js文件，包括查询，编辑操作
 * 健康教育--宣教实施-选患者
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/8
 */
var eduPatient = avalon.define({
    $id: "eduPatient",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    nurseList:[],//宣教护士
    eduBaseId:'',//教育主题
    patientList: {  // 患者列表
        data: [], // 显示患者列表数据
        errorMsg: '',
        list:[],//患者列表数据
    },
    currentPatientId:'',//选中的患者id
    lastTime:0,//比较输入时间
    searchStr:'',//查询的数据
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        eduPatient.eduBaseId = GetQueryString("eduBaseId");  //接收变量
        getPatientList();
        filterSelect();
        avalon.scan();
    });
});

/**
 * 监控下拉选项
 */
function filterSelect() {
    //监控教育类型，联动主题类型
    var form=layui.form;
    form.on('select(userId)', function(data){
        if(isNotEmpty(data.value)){
            //清空数据，重新绑定值
            eduPatient.patientList.data.clear();
            $.each(eduPatient.patientList.list, function(index, item) {
                if(data.value == item.principalNurse){
                    eduPatient.patientList.data.push(item);
                }
            });
        }else {
            eduPatient.patientList.data.clear();
            $.each(eduPatient.patientList.list, function(index, item) {
                eduPatient.patientList.data.push(item);
            });
        }
    });
}

/**
 * 查询患者列表事件
 * @param field
 */
function getPatientList() {
    var param = {};
    _ajax({
        type: "POST",
        url: $.config.services.logistics + "/eduDataBase/listPatientInfo.do",
        data: param,
        dataType: "json",
        done: function(data) {
            var patients = data.patient;
            var nurses = data.nurse;
            debugger
            if (patients != null && patients.length > 0) {
                $.each(patients, function(index, item) {
                    patients[index].age = Age(item.birthday);
                    patients[index].gerder = getSysDictName("Sex", item.gender);
                });
                eduPatient.patientList.data.pushArray(patients);
                eduPatient.patientList.list.pushArray(patients);
                eduPatient.patientList.errorMsg = "";

                var htmlStr ='<option value="">全部</option>';
                $.each(nurses, function(index, item) {
                    htmlStr+='<option value="'+item.id+'">'+item.userName+'</option>';
                });
                $("select[name='userId']").html(htmlStr);
                //刷新表单渲染
                var form = layui.form;
                form.render('select');

                // 设置默认选中患者（若没有则默认选中第一笔）
                var selectedPatientId = eduPatient.currentPatientId;
                if (isEmpty(selectedPatientId) && eduPatient.patientList.data.length > 0) {
                    selectedPatientId = eduPatient.patientList.data[0].patientId;
                }
                $(".patient-search-dropdown-item[data-patient-id='" + selectedPatientId + "']").trigger("click");
                // 滚动定位至选中元素
                //var scrollTop = $(".patient-search-layout .layui-side-scroll .patient-search-dropdown-item.selected").position().top;
                //$(".patient-search-layout .layui-side-scroll").scrollTop(scrollTop);
            } else {
                eduPatient.patientList.data = [];
                eduPatient.patientList.list = [];
                eduPatient.patientList.errorMsg = "查无数据";
            }
        },
        error: function (error) {
            var res = error.responseJSON || {};
            var status = error.status;
            eduPatient.patientList.data = [];
            eduPatient.patientList.list = [];
            eduPatient.patientList.errorMsg = getRequestErrorMsg(res, status);
        }
    });
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function edu($callback) {
    if(isNotEmpty(eduPatient.currentPatientId)){
        typeof $callback === 'function' && $callback(eduPatient.eduBaseId,eduPatient.currentPatientId); //返回一个回调事件
    }
}

/**
 * 患者列表搜索事件
 */
$('#patientName').on('keyup', function (event) {
    eduPatient.searchStr = $(this).val();
    eduPatient.lastTime = event.timeStamp;
    setTimeout(function () {
        //如果时间差为0，也就是你停止输入1s之内都没有其它的keyup事件产生，这个时候就可以去请求服务器了
        if (eduPatient.lastTime - event.timeStamp == 0) {
            eduPatient.patientList.data.clear();
            if(isNotEmpty(eduPatient.searchStr)){
                $.each(eduPatient.patientList.list, function(index, item) {
                    if(item.patientRecordNo.indexOf(eduPatient.searchStr) != -1
                        || item.patientName.indexOf(eduPatient.searchStr) != -1){
                        eduPatient.patientList.data.push(item);
                    }
                });
            }else {
                $.each(eduPatient.patientList.list, function(index, item) {
                    eduPatient.patientList.data.push(item);
                });
            }
        }
    }, 1000);
});


/**
 * 选中患者信息时，更新患者排班
 * @param obj
 */
function onSelectedPatientInfo(obj) {
    var dropdownItemObj = $(obj);
    // 设置患者列表项选中样式
    $(".patient-search-dropdown-item").removeClass("selected");
    dropdownItemObj.addClass("selected");
    // 更新当前患者概览信息
    eduPatient.currentPatientId = dropdownItemObj.attr("data-patient-id");
}

function Age(dateTime) {
    var aDate = new Date();
    var thisYear = aDate.getFullYear();
    var bDate = new Date(dateTime);
    var brith = bDate.getFullYear();
    var age = (thisYear - brith);
    return age;
}


