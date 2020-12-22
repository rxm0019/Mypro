/**
 * 菜单管理 - 自动生成菜单
 * @author: huoquan
 * @version: 1.0
 * @date: 2020/08/13
 */
var sysMenuAuto = avalon.define({
    $id: "sysMenuAuto",
    keyList: [], // 按钮列表
    tableName: "",
    menuUrl: "",
    menuName: "",
    addPk: function(){
        sysMenuAuto.keyList.push({
            keyName: "",
            keyCode: "",
            apiUrl: ""
        });
    },
    delPk: function(index) {
        avalon.Array.removeAt(sysMenuAuto.keyList, index);
    }
});

/**
 * tableName变化事件
 */
sysMenuAuto.$watch("tableName", function(a, b) {
    var oldName = toCamelCase(b);
    var newName = toCamelCase(a);
    $.each(sysMenuAuto.keyList, function (i, item) {
        if (item.keyCode.indexOf(oldName) == 0) {
            item.keyCode = newName + item.keyCode.substring(oldName.length, item.keyCode.length);
        }
    });
    if (sysMenuAuto.menuUrl == "/" + oldName + "/" + oldName + "List" || isEmpty(sysMenuAuto.menuUrl)) {
        sysMenuAuto.menuUrl = "/" + newName + "/" + newName + "List";
    }
    if (isEmpty(newName)) {
        sysMenuAuto.menuUrl = "";
    }
    if (sysMenuAuto.menuName == oldName) {
        sysMenuAuto.menuName = newName;
    }
});
layui.use(['index'],function(){
    avalon.ready(function () {
        // 获取URL参数
        var id = GetQueryString("id");
        var parentId = GetQueryString("parentId");
        var parentName = GetQueryString("parentName");

        // 表单赋值
        var form=layui.form;
        form.val('sysMenuAuto_form', {
            id: id,
            parentId: parentId,
            parentName: parentName
        });
        sysMenuAuto.keyList.pushArray([
            { keyName:"查询", keyCode:"List#list", apiUrl: "" },
            { keyName:"添加", keyCode:"List#add", apiUrl: "" },
            { keyName:"修改", keyCode:"List#edit", apiUrl: "" },
            { keyName:"查看", keyCode:"List#detail", apiUrl: "" },
            { keyName:"删除", keyCode:"List#delete", apiUrl: "" }
        ]);
        avalon.scan();
    });
});


/**
 * 自动生成菜单
 * @param $callBack
 */
function onMenuWithKeysSave($callBack){
    // 对表单验证
    verifyForm(function(field){
        // 成功验证后
        var param={
            "parentId": field.parentId,
            "menuName": field.menuName,
            "menuUrl": field.menuUrl,
            "sysKeyList": sysMenuAuto.keyList
        };
        _ajax({
            type: "POST",
            url: $.config.services.system + "/sysMenu/addWithKeys.do",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(param),
            done: function(data){
                if ($callBack != undefined) {
                    $callBack(data);
                }
            }
        });
    });
}

/**
 * 验证表单
 * @param $callback
 */
function verifyForm($callback) {
    // 监听提交,先定义个隐藏的按钮
    var form = layui.form; // 调用layui的form模块
    form.on('submit(sysMenuAuto_submit)', function(data) {
        // 通过表单验证后
        var field = data.field; // 获取提交的字段
        typeof $callback === 'function' && $callback(field); // 返回一个回调事件
    });
    $("#sysMenuAuto_submit").trigger('click');
}

/**
 * 字符串转换为驼峰命名法
 * @param str
 * @returns {string|*}
 */
function toCamelCase(str) {
    str = str.split(/[-_]/);
    return str.map(function(x, i) {
        return (i > 0 ? (x.charAt(0).toUpperCase() + x.slice(1)) : x);
    }).join("")
}

