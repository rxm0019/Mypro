/**
 * patVascularRoadEdit.jsp的js文件，包括查询，编辑操作
 */
var patVascularRoadEdit = avalon.define({
    $id: "patVascularRoadEdit",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,readonly: {readonly: false} // 文本框设置只读
    ,disabled: {disabled: false}
    ,patientId: ''   //患者id

});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        laydate.render({
            elem: '#establishedDate'
            ,type: 'date'
            ,trigger: 'click'
            ,value: new Date()
            ,max: layui.util.toDateString(new Date(), 'yyyy-MM-dd')
            ,ready: function(date){
                activationTimeInput.config.min = {
                    year : date.year,
                    month : date.month - 1,
                    date : date.date
                };
            }
            ,done: function (value, date) {
                activationTimeInput.config.min = {
                    year : date.year,
                    month : date.month - 1,
                    date : date.date
                };
            }
        });
        var activationTimeInput = laydate.render({
            elem: '#activationTime'
            ,type: 'date'
            ,trigger: 'click'
            ,value: new Date()
            // ,min: $('#establishedDate').val() || '1900-01-01'
            ,done: function (value, date) {
                var days = DateDiff(value, layui.util.toDateString(new Date(), 'yyyy-MM-dd'));
                if (days <= 0) {
                    days = 0;
                }
                $('#serviceLife').val(days);
            }
        });

        var id=GetQueryString("id");  //接收变量
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        patVascularRoadEdit.patientId = GetQueryString('patientId');  //患者id
        if (layEvent === 'detail') {
            patVascularRoadEdit.readonly = {readonly: true};
            patVascularRoadEdit.disabled = {disabled: 'disabled'};
        }
        //获取实体信息
        getInfo(id,function(data){

            //设置启用时间的最小值
            if (isNotEmpty(data.establishedDate)) {
                var dateArr = layui.util.toDateString(data.establishedDate, 'yyyy-MM-dd').split('-');
                activationTimeInput.config.min = {
                    year: dateArr[0],
                    month: dateArr[1] - 1,
                    date: dateArr[2]
                }
            } else {
                var date = new Date();
                activationTimeInput.config.min = {
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    date: date.getDate()
                }
            }

            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            var form = layui.form;

            if (data.dataStatus == 1) {
                $("select[name='disabledReason']").empty();
                $("#disabledReasonDiv").css('display','block');
                $("#disabledReason").attr('lay-verify', 'required');

                // 停用原因赋值
                var html = "<option value=''></option>";
                var dictData = baseFuncInfo.getSysDictByCode('ChannelDisabledReason');
                $(dictData).each(function (v, k) {
                    html += "<option value='" + k.value + "'>" + k.name + "</option>";
                });
                //把遍历的数据放到select表里面
                $("select[name='disabledReason']").append(html);
                $('#disabledReason').val(data.disabledReason);
            } else {
                $("#disabledReasonDiv").css('display','none');
                $("#disabledReason").removeAttr('lay-verify');
            }

            var typeValue = data.vascularRoadType;
            var placeValue = data.vascularRoadPlace;
            var channelPlaceData = getSysDictByCode('ChannelPlace');
            var placeDictData = [];
            channelPlaceData.forEach(function (dict, i) {
                if (dict.dictBizCode == typeValue) {
                    placeDictData.push(dict);
                }
            });

            //empty() 方法从被选元素移除所有内容
            $("select[name='vascularRoadPlace']").empty();
            var html = "<option value=''></option>";
            $(placeDictData).each(function (v, k) {
                html += "<option value='" + k.value + "'>" + k.name + "</option>";
            });
            //把遍历的数据放到select表里面
            $("select[name='vascularRoadPlace']").append(html);
            $('#vascularRoadPlace').val(placeValue);
            //从新刷新了一下下拉框
            form.render('select');

        });
        var form = layui.form;
        form.verify({
            validateDay: function (value, item) {
                var reg = /^[0-9]\d*$/;
                if (value != null && value !== '' && !reg.test(value)) {
                    return "只能填写整数";
                }
            }
        })
        avalon.scan();
    });
});

/**
 * 计算两个日期相差的天数
 * @param sDate
 * @param eDate
 * @returns {number}
 * @constructor
 */
function DateDiff(sDate, eDate) { //sDate和eDate是yyyy-MM-dd格式
    var date1 = new Date(sDate);
    var date2 = new Date(eDate);
    var date3=date2.getTime()-date1.getTime();
    var days=Math.floor(date3/(24*3600*1000));
    return days;
}

// 通路类型和通路部位二级联动
layui.use('form', function(){
    var form = layui.form;
    form.on('select(vascularRoadType)', function(data){
        var typeValue = data.elem.value;
        var channelPlaceData = getSysDictByCode('ChannelPlace');
        var placeDictData = [];
        channelPlaceData.forEach(function (dict, i) {
            if (dict.dictBizCode == typeValue) {
                placeDictData.push(dict);
            }
        });
        //empty() 方法从被选元素移除所有内容
        $("select[name='vascularRoadPlace']").empty();
        var html = "<option value=''></option>";
        $(placeDictData).each(function (v, k) {
            html += "<option value='" + k.value + "'>" + k.name + "</option>";
        });
        //把遍历的数据放到select表里面
        $("select[name='vascularRoadPlace']").append(html);
        //从新刷新了一下下拉框
        form.render('select');      //重新渲染


    });

    form.on('select(dataStatus)', function (data) {
        var state = data.elem.value;
        if (state == '1') {  //停用
            $("select[name='disabledReason']").empty();
            $("#disabledReasonDiv").css('display','block');
            $("#disabledReason").attr('lay-verify', 'required');
            var html = "<option value=''></option>";
            var dictData = baseFuncInfo.getSysDictByCode('ChannelDisabledReason');
            $(dictData).each(function (v, k) {
                html += "<option value='" + k.value + "'>" + k.name + "</option>";
            });
            //把遍历的数据放到select表里面
            $("select[name='disabledReason']").append(html);
        } else {
            $("#disabledReasonDiv").css('display','none');
            $("#disabledReason").removeAttr('lay-verify');
        }
        form.render('select');
    })

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
            "vascularRoadId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis+"/patVascularRoad/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.establishedDate=util.toDateString(data.establishedDate,"yyyy-MM-dd");
                data.activationTime=util.toDateString(data.activationTime,"yyyy-MM-dd");
                data.disabledDatetime=util.toDateString(data.disabledDatetime,"yyyy-MM-dd");
                data.createTime=util.toDateString(data.createTime,"yyyy-MM-dd");
                data.updateTime=util.toDateString(data.updateTime,"yyyy-MM-dd");
                form.val('patVascularRoadEdit_form', data);
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
    form.on('submit(patVascularRoadEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#patVascularRoadEdit_submit").trigger('click');
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
        var url = $.config.services.dialysis+"/patVascularRoad/edit.do";
        if (isEmpty(param.vascularRoadId)) {
            param.patientId = patVascularRoadEdit.patientId;
            url = $.config.services.dialysis+"/patVascularRoad/save.do";
        }
        var establishedDate = field.establishedDate;
        var activationTime = field.activationTime;
        if(isNotEmpty(establishedDate) && isNotEmpty(activationTime)){//判断起始日期不能大于结束时期
            if (activationTime < establishedDate) {
                warningToast("建立时间不能大于启用时间");
                return;
            }
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            // url: $.config.services.dialysis+"/patVascularRoad/saveOrEdit.do",
            url: url,
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}

