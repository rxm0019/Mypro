<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/lib/zTree/v3/css/layuiStyle/layuiStyle.css">
</head>
<body ms-controller="sysUserAuthority">
<!-- 权限设置表单 -->
<div class="layui-form layui-row layui-col-xs12 pd-10" lay-filter="sysHospitalTree_form" id="sysHospitalTree_form">
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" style="height: 240px; overflow-y: auto;">
        <ul id="sysHospitalTree" class="ztree"></ul>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysUserAuthority.js?t=${currentTimeMillis}"></script>
<script type="text/javascript" src="${ctxsta}/static/lib/zTree/v3/js/jquery.ztree.all.min.js"></script>
</body>
</html>
