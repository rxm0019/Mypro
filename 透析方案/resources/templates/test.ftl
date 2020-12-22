<#include "./base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
</head>
<body ms-controller="test">
<!-- 这里的xm-select属性是多选的ID, 如多处使用请保证全局唯一 -->
<select name="city" xm-select="selectId">
    <option value="1" disabled="disabled">北京</option>
    <option value="2" selected="selected">上海</option>
    <option value="3">广州</option>
    <option value="4" selected="selected">深圳</option>
    <option value="5">天津</option>
</select>

<!-- 执行渲染, 把原始select美化~~ -->
<script type="text/javascript">
    layui.use(['index','formSelects'],function(){

    });
</script>
</body>
</html>