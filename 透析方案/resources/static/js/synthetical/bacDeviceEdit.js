/**
 * 设备台账-新增、编辑
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/06
 */
var bacDeviceEdit = avalon.define({
    $id: "bacDeviceEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    wardList:[],//病区列表
    regionList:[],//区域
    characteristics:'',//治疗特征
    infectionMark:'',//感染特征
    wardCode:'',//病区
    regionCode:'',//区域
    deviceType:'',//设备类型
    readonly: {readonly: false}, // 设置只读
    disabled:{disabled: false}, // 设置只读
    layEvent:''//编辑或详情
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id=GetQueryString("id");  //接收变量id
        bacDeviceEdit.layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        if (bacDeviceEdit.layEvent === 'detail') {
            bacDeviceEdit.readonly = {readonly: true};
            bacDeviceEdit.disabled = {disabled: true};
            $('input[type="radio"]').prop('disabled', true);
            $('input[type="checkbox"]').prop('disabled', true);
        }
        if(bacDeviceEdit.layEvent != 'detail'){
            //初始化表单元素,日期时间选择器
            var laydate=layui.laydate;
            laydate.render({
                elem: '#buyDate'
                ,type: 'date'
                ,trigger: 'click'
            });
            laydate.render({
                elem: '#enabledDate'
                ,type: 'date'
                ,trigger: 'click'
            });
        }
        bacDeviceEdit.wardCode=GetQueryString("wardCode");//接收病区
        getWardList(function(data){
            getRegionList(function(data){
                //获取实体信息
                getInfo(id,function(data){
                    //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
                    //...
                });
            });
        });
        //下拉框联动
        form=layui.form;
        form.on('select(wardCode)', function(data){
            bacDeviceEdit.wardCode = data.value;
            getRegionList(function(data){
                //选择病区后重新渲染区域下拉框
                addregionHtml();
            });
        });
        form.on('select(deviceType)', function(data){
            addHtml(data.value);
            //消毒机
            var tmp = baseFuncInfo.getSysDictByCode("sterilizeDeviceType");
            var tmpFlier = tmp.filter(function (val) {
                if(val.value == data.value){
                return val;
                }
            });
            if(tmpFlier !=null && tmpFlier.length>0){
                addregionHtml();
            }else{
                var form=layui.form; //调用layui的form模块
                var html = '';
                $('#regionDetail').html(html);
                form.render();
            }
        });
        avalon.scan();
    });
});


//获取病区列表
function getWardList($callback){
    var param = {
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.platform + "/basWardSetting/getLists.do",
        data:param,
        dataType: "json",
        done:function(data){
            bacDeviceEdit.wardList = data;
            var form=layui.form; //调用layui的form模块
            form.render();
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}

//获取区域列表
function getRegionList($callback){
    bacDeviceEdit.regionList = [];
    var param = {
        wardId:bacDeviceEdit.wardCode
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.platform + "/basRegionSetting/getLists.do",
        data:param,
        dataType: "json",
        done:function(data){
            bacDeviceEdit.regionList = data;
            var form=layui.form; //调用layui的form模块
            form.render();
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
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
            "deviceId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/bacDevice/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.buyDate = isNotEmpty(data.buyDate) ? util.toDateString(data.buyDate, "yyyy-MM-dd") : "";
                data.enabledDate = isNotEmpty(data.enabledDate) ? util.toDateString(data.enabledDate, "yyyy-MM-dd") : "";
                data.createTime = isNotEmpty(data.createTime) ? util.toDateString(data.createTime, "yyyy-MM-dd") : "";
                data.updateTime = isNotEmpty(data.updateTime) ? util.toDateString(data.updateTime, "yyyy-MM-dd") : "";
                bacDeviceEdit.characteristics = data.characteristics;
                bacDeviceEdit.infectionMark = data.infectionMark;
                addHtml(data.deviceType);
                getDeviceByCodeNo(bacDeviceEdit.characteristics,bacDeviceEdit.infectionMark);
                form.val('bacDeviceEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

//动态加载透析机治疗特征、感染特征以及所属区域
function addHtml(value) {
    var form=layui.form; //调用layui的form模块
    var html = '';
    //治疗特征列表
    var characteristicslists = baseFuncInfo.getSysDictByCode("DialysisMode");
    //感染特征列表
    var infectionMarklists = baseFuncInfo.getSysDictByCode("InfectionMark");
    //透析机
    var tmp = baseFuncInfo.getSysDictByCode("DialyzerType");
    var dialyzer = "";
    $.each(tmp,function(index, item){
        if(item.value !=""){
            dialyzer = item.value;
        }
    })
    //消毒机
    var tmp = baseFuncInfo.getSysDictByCode("sterilizeDeviceType");
    var tmpFlier = tmp.filter(function (val) {
        if(val.value == value){
            return val;
        }
    });

    if(value == dialyzer){
        html +='<div class="layui-col-sm12 layui-col-md12 layui-col-lg12">'+
            '<div class="disui-form-flex " >'+
            '<label>治疗特征：</label>'
        $.each(characteristicslists,function(index, item){
            html +=  '<input type="checkbox" id="characteristics"'
            html +=  'value="' + item.value+  '" title="' + item.name + '">'
        })
        html +='</div>'
        html +='</div>'
        html +='<div class="layui-col-sm12 layui-col-md12 layui-col-lg12">'+
            '<div class="disui-form-flex " >'+
            '<label>感染特征：</label>'
        $.each(infectionMarklists,function(index, item){
            html +=  '<input type="checkbox" id="infectionMark"'
            html +=  'value="' + item.value+  '" title="' + item.name + '">'
        })
        html +='</div>'
        html +='</div>'
    }else if(tmpFlier !=null && tmpFlier.length>0){
        html +='<div class="layui-col-sm6 layui-col-md3 layui-col-lg2">'+
            '<div class="disui-form-flex " >'+
            '<label>所属病区：</label>'
        if (bacDeviceEdit.layEvent === 'detail') {
            html +=  '<select name="wardCode" id="wardCode" lay-filter="wardCode" disabled>'
        }else{
            html +=  '<select name="wardCode" id="wardCode" lay-filter="wardCode">'
        }
        html +=  ' <option value="">请选择所属病区</option>'
        $.each(bacDeviceEdit.wardList,function(index, item){
            html +=  '<option value=' +item.wardId+ '>' +item.wardName+ '</option>'
        })
        html +='</select>'
        html +='</div>'
        html +='</div>'
    }
    $('#deviceDetail').html(html);
    form.render();
    if(tmpFlier !=null && tmpFlier.length>0){
        addregionHtml();
    }
}

function addregionHtml() {
    var form=layui.form; //调用layui的form模块
    var html = '';
    html +='<div class="layui-col-sm6 layui-col-md3 layui-col-lg2">'+
            '<div class="disui-form-flex " >'+
            '<label>所属区域：</label>'
        if (bacDeviceEdit.layEvent === 'detail') {
            html +=  '<select name="regionCode" id="regionCode" disabled>'
        }else{
            html +=  '<select name="regionCode" id="regionCode">'
        }
    html +=  ' <option value="">请选择所属区域</option>'
        $.each(bacDeviceEdit.regionList,function(index, item){
            html +=  '<option value=' +item.regionId+ '>' +item.regionName+ '</option>'
        })
    html +='</select>'
    html +='</div>'
    html +='</div>'
    $('#regionDetail').html(html);
    form.render();
}

//渲染治疗特征复选框、感染特征复选框
function getDeviceByCodeNo(characteristics,infectionMark) {
    var characteristicsarr = characteristics.split(',');
    for(var i in characteristicsarr){
        $("[id='characteristics']:checkbox").each(function () {
            if(characteristicsarr[i] === $(this).attr("value")){
                this.checked = true;
            }
        });
    }
    var infectionMarkarr = infectionMark.split(',');
    for(var i in infectionMarkarr){
        $("[id='infectionMark']:checkbox").each(function () {
            if(infectionMarkarr[i] === $(this).attr("value")){
                this.checked = true;
            }
        });
    }
    $("#characteristics").val();//渲染治疗特征复选框
    $("#infectionMark").val();//渲染感染特征复选框
    var form=layui.form;
    form.render();
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(bacDeviceEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacDeviceEdit_submit").trigger('click');
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
        //判断是否存在主键ID，不存在执行新增否则为编辑
        var url = '';
        if(param.deviceId.length == 0){
            url = $.config.services.logistics + "/bacDevice/save.do";
        }else{
            url = $.config.services.logistics + "/bacDevice/edit.do";
        }
        //可以继续添加需要上传的参数
        param.characteristics = GetCheckboxValues("characteristics");
        param.infectionMark = GetCheckboxValues("infectionMark");
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

    //将checke拼接为"value1,value2,value3"
    function GetCheckboxValues(Name) {
        var result = [];
        $("[id='" + Name + "']:checkbox").each(function () {
            if ($(this).is(":checked")) {
                result.push($(this).attr("value"));
            }
        });
        return result.join(",");
    };
}



