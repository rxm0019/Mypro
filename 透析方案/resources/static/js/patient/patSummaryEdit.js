/**
 * 患者管理 - 新增阶段小结
 * @Author swn
 * @version: 1.0
 * @Date 2020/8/20
 */
var patSummaryEdit = avalon.define({
    $id: "patSummaryEdit",
    baseFuncInfo: baseFuncInfo, // 底层基本方法
    patientId: "", // 患者ID（传参）
    showMonthOption: true, // 显示/隐藏 月份/季度选项
    options: {
        year: getYearOptions(), // 年份
        month: getMonthOptions(), // 月份
        quarter: getQuarterOptions(), // 季度
        summaryType: [ //
            { name: "月份", value: $.constant.SummaryType.MONTH },
            { name: "季度", value: $.constant.SummaryType.QUARTER },
        ]
    }
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        // 获取请求参数
        patSummaryEdit.patientId = GetQueryString("patientId");

        // 设置新增默认值
        var currentDate = new Date();
        var defaultYear = currentDate.getFullYear();
        var defaultMonth = currentDate.getMonth() - 1;
        var defaultQuarter = Math.floor(currentDate.getMonth() / 3) + 1;
        layui.form.val('patSummaryEdit_form', {
            year: defaultYear,
            month: defaultMonth,
            quarter: defaultQuarter
        });

        // 阶段小结类型改变时，显示/隐藏 月份/季度选项
        layui.form.on('radio(summaryTypeClick)', function(data) {
            patSummaryEdit.showMonthOption = (data.value == $.constant.SummaryType.MONTH);
        });

        avalon.scan();
    });
});

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(patSummaryEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#patSummaryEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        // 获取请求参数
        monthOrQuarter = (field.summaryType == $.constant.SummaryType.MONTH ? field.month : field.quarter);
        var param = {
            patientId: patSummaryEdit.patientId,
            year: field.year,
            summaryType: field.summaryType,
            monthOrQuarter: monthOrQuarter
        };

        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/patSummary/addInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(field.year, data); //返回一个回调事件
            }
        });
    });
}



