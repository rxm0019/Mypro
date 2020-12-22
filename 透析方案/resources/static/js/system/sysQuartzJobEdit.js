/**
 * 排程管理执行设置编辑
 * @author: hhc
 * @version: 1.0
 * @date: 2020/9/4
 */
var sysQuartzJobEdit = avalon.define({
    $id: "sysQuartzJobEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    hours: [],     //循环获取时
    minutes: [],   //循环获取分
    cycleMinutes: [], //循环获取周期的分
    days: [],         //循环获取日
    everyDay: {disabled: false},
    cycle: {disabled: false},
    everyMonth: {disabled: false}
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id = GetQueryString("id");  //接收变量
        sysQuartzJobEdit.hours = getHours();
        sysQuartzJobEdit.minutes = getMinutes();
        sysQuartzJobEdit.cycleMinutes = getCycleMinutes();
        sysQuartzJobEdit.days = getDays();
        //获取实体信息
        getInfo(id, function (data) {
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });
        checkBoxSelect();
        checkBoxListener();
        avalon.scan();
    });
});

/**
 * 每天、周期、每月点击监听事件
 */
function checkBoxListener() {
    var form = layui.form; //调用layui的form模块
    //这里的everyDay_checked是lay-filter的值
    form.on('checkbox(everyDay_checked)', function (data) {
        if (data.elem.checked) {//checked表示被选中
            $("#everyDayHour").attr('lay-verify', 'required');      //添加必填项
            $("#everyDayMinute").attr('lay-verify', 'required');
            $("#everyMonthDay").removeAttr('lay-verify');  //移除必填项
            $("#everyMonthHour").removeAttr('lay-verify');
            $("#everyMonthMinute").removeAttr('lay-verify');
            $("#cycleMinute").removeAttr('lay-verify');
            $("#cycleHour").val('');  //清空周期的时属性
            $("#cycleMinute").val('');
            $("#everyMonthDay").val('');
            $("#everyMonthHour").val('');
            $("#everyMonthMinute").val('');
            sysQuartzJobEdit.everyDay = {disabled: false};  //启用每天里的下拉框
            sysQuartzJobEdit.cycle = {disabled: 'disabled'};      //禁用周期里的下拉框
            sysQuartzJobEdit.everyMonth = {disabled: 'disabled'}; //禁用每月里的下拉框

        } else {
            $("#everyDayHour").removeAttr('lay-verify');
            $("#everyDayMinute").removeAttr('lay-verify');
            $("#everyDayHour").val('');
            $("#everyDayMinute").val('');

            sysQuartzJobEdit.everyDay = {disabled: 'disabled'};
            sysQuartzJobEdit.cycle = {disabled: 'disabled'};
            sysQuartzJobEdit.everyMonth = {disabled: 'disabled'};
        }
        form.render('select'); //刷新select选择框渲染
    });
    form.on('checkbox(cycle_checked)', function (data) {    //监听周期的复选框
        if (data.elem.checked) {    //判断是否选中周期的复选框
            // sysQuartzJobEdit.everyDay = {disabled: 'disabled'};

            $("#cycleMinute").attr('lay-verify', 'required');
            $("#everyDayHour").removeAttr('lay-verify');
            $("#everyDayMinute").removeAttr('lay-verify');
            $("#everyMonthDay").removeAttr('lay-verify');
            $("#everyMonthHour").removeAttr('lay-verify');
            $("#everyMonthMinute").removeAttr('lay-verify');
            $("#everyDayHour").val('');
            $("#everyDayMinute").val('');
            $("#everyMonthDay").val('');
            $("#everyMonthHour").val('');
            $("#everyMonthMinute").val('');
            sysQuartzJobEdit.everyDay = {disabled: 'disabled'};
            sysQuartzJobEdit.cycle = {disabled: false};  //启用周期的下拉框
            sysQuartzJobEdit.everyMonth = {disabled: 'disabled'};
        } else {
            $("#cycleMinute").removeAttr('lay-verify');
            $("#cycleHour").val('');
            $("#cycleMinute").val('');
            sysQuartzJobEdit.everyDay = {disabled: 'disabled'};
            sysQuartzJobEdit.cycle = {disabled: 'disabled'};
            sysQuartzJobEdit.everyMonth = {disabled: 'disabled'};
        }
        form.render('select');
    });
    form.on('checkbox(everyMonth_checked)', function (data) { //监听每月的复选框
        if (data.elem.checked) {
            $("#everyMonthDay").attr('lay-verify', 'required');
            $("#everyMonthHour").attr('lay-verify', 'required');
            $("#everyMonthMinute").attr('lay-verify', 'required');
            $("#everyDayHour").removeAttr('lay-verify');
            $("#everyDayMinute").removeAttr('lay-verify');
            $("#cycleMinute").removeAttr('lay-verify');
            $("#everyDayHour").val('');
            $("#everyDayMinute").val('');
            $("#cycleHour").val('');
            $("#cycleMinute").val('');
            sysQuartzJobEdit.everyDay = {disabled: 'disabled'};
            sysQuartzJobEdit.cycle = {disabled: 'disabled'};
            sysQuartzJobEdit.everyMonth = {disabled: false};

        } else {
            $("#everyMonthDay").removeAttr('lay-verify');
            $("#everyMonthHour").removeAttr('lay-verify');
            $("#everyMonthMinute").removeAttr('lay-verify');
            $("#everyMonthDay").val('');
            $("#everyMonthHour").val('');
            $("#everyMonthMinute").val('');
            sysQuartzJobEdit.everyDay = {disabled: 'disabled'};
            sysQuartzJobEdit.cycle = {disabled: 'disabled'};
            sysQuartzJobEdit.everyMonth = {disabled: 'disabled'};
        }
        form.render('select');
    });

    form.on('select(jobName_form)', function (data) { //监听新增功能的下拉框
        if (isNotEmpty(data.value)) {
            $("#jobGroup").val(getSysDictShortName("job_class",data.value));  //将字典标签简称赋值给任务分组
            $("#jobClassName").val(data.value);
        }
        form.render('select');
    });
}

/**
 * 复选框单选
 */
function checkBoxSelect() {
    var form = layui.form; //调用layui的form模块
    //复选框监听事件（只能单选）
    form.on('checkbox', function (data) {
        var oldState = data.elem.checked // 记录状态
        var elName = data.elem.name || '' // 取当前名称
        $("input[name='" + elName + "']").prop("checked", false);	//全部取消选中(name要一致)
        $(this).prop("checked", true);	//勾选当前选中的选择框
        if (!oldState) { // 如果是flase表示点击的是之前已被选中的那个
            $(this).prop("checked", false); // 取消勾选当前的
        }
        form.render('checkbox');	//重新渲染
    })
}

/**
 * 获取日
 * @returns {Array}
 */
function getDays() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var d = new Date(year, month, 0);
    // return d.getDate();获取到当前月的天数
    var daysArr = [];
    for (var i = 1; i <= d.getDate(); i++) {
        daysArr.push(i);
    }
    return daysArr;

}

/**
 * 获取时
 * @returns {Array}
 */
function getHours() {
    var housrArr = [];
    for (var i = 0; i < 24; i++) {
        housrArr.push(i);
    }
    return housrArr;
}

/**
 * 获取分
 * @returns {Array}
 */
function getMinutes() {
    var minuteArr = [];
    for (var i = 0; i < 60; i++) {
        minuteArr.push(i);
    }
    return minuteArr;
}

/**
 * 获取周期的分
 */
function getCycleMinutes() {
    var minuteArr = [];
    for (var i = 1; i < 60; i++) {
        minuteArr.push(i);
    }
    return minuteArr;
}


/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(id, $callback) {
    if (isEmpty(id)) {
        var form = layui.form; //调用layui的form模块
        form.render();
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    } else {
        //编辑
        var param = {
            "quartzJobId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + "/sysQuartzJob/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util = layui.util;
                if (isNotEmpty(data.cronMap)) {
                    if (data.checkOne == "everyMonth") {
                        //给每月的号，时，分赋值
                        data.everyMonthDay = data.cronMap.day;
                        data.everyMonthHour = data.cronMap.hour;
                        data.everyMonthMinute = data.cronMap.minute;
                        $("#checkOne3").prop("checked", true);	//勾选当前选中的选择框
                        sysQuartzJobEdit.everyDay = {disabled: 'disabled'};
                        sysQuartzJobEdit.cycle = {disabled: 'disabled'};
                    } else if (data.checkOne == "cycle") {
                        //给每周的时，分赋值
                        data.cycleHour = data.cronMap.hour;
                        data.cycleMinute = data.cronMap.minute;
                        $("#checkOne2").prop("checked", true);	//勾选当前选中的选择框
                        sysQuartzJobEdit.everyDay = {disabled: 'disabled'};
                        sysQuartzJobEdit.everyMonth = {disabled: 'disabled'};
                    } else {
                        //给每日的时，分赋值
                        data.everyDayHour = data.cronMap.hour;
                        data.everyDayMinute = data.cronMap.minute;
                        $("#checkOne1").prop("checked", true);	//勾选当前选中的选择框
                        sysQuartzJobEdit.cycle = {disabled: 'disabled'};
                        sysQuartzJobEdit.everyMonth = {disabled: 'disabled'};
                    }
                    form.render();	//重新渲染
                }
                delete data.checkOne;
                form.val('sysQuartzJobEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(sysQuartzJobEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#sysQuartzJobEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        var param = field; //表单的元素
        if (isEmpty(param.quartzJobId)) {
            param.dataStatus = '0';//添加的时候默认为启用状态
        }
        if (isEmpty(param.checkOne)) {
            warningToast('请选择频率类别');
            return false;
        }
        var url = $.config.services.platform + "/sysQuartzJob/add.do";
        if (isNotEmpty(param.quartzJobId)) {
            url = $.config.services.platform + "/sysQuartzJob/frequencyAdjust.do";
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}





