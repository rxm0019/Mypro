/**
 * 模板列表
 * @author Care
 * @date 2020-09-02
 * @version 1.0
 */
var bacContentTemplateList = avalon.define({
    $id: "bacContentTemplateList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    templateType: GetQueryString("templateType"),
    isShow: true,
    contentTemplateId: '',//模板Id
    readonly: {readonly: true}, // 文本框设置只读
    add: '',//标记添加
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        // 初始化表单
        initFormVerify();
        initSearch(); //初始化搜索框
        console.log("type",bacContentTemplateList.templateType);
        if(bacContentTemplateList.templateType != 'null'){
            $("#templateType").val(bacContentTemplateList.templateType);
        }
        getList(bacContentTemplateList.templateType);  //查询列表
        avalon.scan();
    });
});

/**
 * 初始化表单验证方法
 */
function initFormVerify() {
    layui.form.verify({
        // 字段必填校验
        fieldRequired: function (value, item) {
            var target = $(item);
            var fieldName = target.attr("data-field-name") || "";
            if (isEmpty(value.trim())) {
                return fieldName + "不能为空";
            }
        }
    })
}


/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#bacContentTemplateList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'bacContentTemplateList_search'  //指定的lay-filter
        , conds: [
            {field: 'templateTitle', title: '', placeholder: '模板名称', type: 'input',}
        ]
        , done: function (filter, data) {
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        , search: function (data) {
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('bacContentTemplateList_table', {
                where: field
            });
        }
    });
}

/**
 * 根据模板名称查询
 */
function searchList() {
    var templateTitle = $("#templateTitle").val();
    getList(bacContentTemplateList.templateType, templateTitle);
}

/**
 * 查询模板列表事件
 */
function getList(templateType, templateTitle) {
    var param = {
        templateType: templateType,
        templateTitle: templateTitle,
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#bacContentTemplateList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'bacContentTemplateList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.platform + "/bacContentTemplate/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {field: 'templateTitle', title: '模板名称',}
                , {field: 'editor', title: '修改人员',}
                , {
                    field: 'updateTime', title: '修改日期'
                    , templet: function (d) {
                        return util.toDateString(d.updateTime, "yyyy-MM-dd");
                    }
                }
            ]],
            done: function (obj) {
                if (obj.bizData != null && obj.bizData.length > 0) {
                    //取出第一笔数据
                    var data = obj.bizData[0];
                    //模板表单赋值
                    layui.form.val('templateImport_form', data);
                }
            }
        }
    });
    //监听行单击事件（双击事件为：rowDouble）
    table.on('row(bacContentTemplateList_table)', function (obj) {
        var data = obj.data;
        if (data != null) {
            bacContentTemplateList.contentTemplateId = data.contentTemplateId;
            getSingleLineInfor(data.contentTemplateId);
        }
        //标注选中样式
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
    });
}
/**
 * 添加按钮
 */
function add() {
    bacContentTemplateList.add = "add";
    bacContentTemplateList.isShow = false;
    bacContentTemplateList.readonly = {readonly: false};
    //添加时清空模板信息
    layui.form.val("templateImport_form", {
        contentTemplateId: "",
        templateTitle: "",
        templateContent: "",
    })
}

/**
 * 取消按钮
 */
function cancel() {
    bacContentTemplateList.isShow = true;
    bacContentTemplateList.readonly = {readonly: true};
    //添加时清空模板信息
    layui.form.val("templateImport_form", {
        contentTemplateId: "",
        templateTitle: "",
        templateContent: "",
    })
}

/**
 * 修改模板
 */
function edit() {
    bacContentTemplateList.add = "";
    var id = bacContentTemplateList.contentTemplateId;
    if (isEmpty(id)) {
        warningToast("请点击要修改的数据行!");
        return false;
    } else {
        bacContentTemplateList.isShow = false;
        bacContentTemplateList.readonly = {readonly: false};
        getSingleLineInfor(id);
    }
}

/**
 * 获取单行模板信息
 */
function getSingleLineInfor(contentTemplateId) {
    var url = "";
    if (isNotEmpty(contentTemplateId)) {
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + "/bacContentTemplate/getInfo.do",
            data: {contentTemplateId: contentTemplateId},
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                form.val('templateImport_form', data);
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
    form.on('submit(templateImport_form_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#templateImport_form_submit").trigger('click');
}

/**
 * 保存模板信息
 */
function saveTemplateInfo() {
    //对表单验证
    verify_form(function(field){
        var url = "";
        //成功验证后
        var param=field; //表单的元素
        console.log("param",param);
        url = $.config.services.platform + "/bacContentTemplate/save.do";
        if (isNotEmpty(param.contentTemplateId)) {
            url = $.config.services.platform + "/bacContentTemplate/edit.do";
        }
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                if (data == 1) {
                    successToast("保存成功");
                    bacContentTemplateList.isShow = true;
                    var table = layui.table; //获取layui的table模块
                    table.reload('bacContentTemplateList_table'); //重新刷新table
                } else {
                    errorToast("保存失败");
                    bacContentTemplateList.isShow = true;
                    var table = layui.table; //获取layui的table模块
                    table.reload('bacContentTemplateList_table'); //重新刷新table
                }
            }
        });
    })

}


/**
 * 删除事件
 * @param ids
 */
function del() {
    var id = bacContentTemplateList.contentTemplateId;
    if (isEmpty(id)) {
        warningToast("请点击要删除的数据行!");
        return false;
    } else {
        var param = {
            "id": id
        };
        layer.confirm('确定删除所选记录吗？', function (index) {
            layer.close(index);
            _ajax({
                type: "POST",
                url: $.config.services.platform + "/bacContentTemplate/delete.do",
                data: param,  //必须字符串后台才能接收list,
                //loading:false,  //是否ajax启用等待旋转框，默认是true
                dataType: "json",
                done: function (data) {
                    successToast("删除成功");
                    bacContentTemplateList.contentTemplateId = "";
                    var table = layui.table; //获取layui的table模块
                    table.reload('bacContentTemplateList_table'); //重新刷新table
                }
            });

        })

    }
}


/**
 * 关闭弹窗--导入模板信息
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {
    //菜单保存操作
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(templateImport_form_commit)', function (data) {
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#templateImport_form_commit").trigger('click');
}

