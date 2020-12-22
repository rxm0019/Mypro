<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <style>
        .layui-form-label {
            width: 90px;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="stoInventorySelectDetailList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="stoInventorySelectDetailList_search" lay-filter="stoInventorySelectDetailList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="stoInventorySelectDetailList_tool">
                <button :visible="@baseFuncInfo.authorityTag('stoInventorySelectDetailList#save')"
                        class="layui-btn layui-btn-dismain" onclick="save()" :if="@statusFlag">保存
                </button>
                <button :visible="@baseFuncInfo.authorityTag('stoInventorySelectDetailList#export')"
                        class="layui-btn layui-btn-dissub" onclick="onExportExcel()">导出
                </button>
                <button :visible="@baseFuncInfo.authorityTag('stoInventorySelectDetailList#dispose')"
                        class="layui-btn layui-btn-dissub" onclick="dispose()" :if="@statusFlag">盘盈盘亏处理
                </button>

            </div>
            <!--table定义-->
            <table id="stoInventorySelectDetailList_table" lay-filter="stoInventorySelectDetailList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript"
        src="${ctxsta}/static/js/stock/stoInventorySelectDetailList.js?t=${currentTimeMillis}"></script>
</body>
</html>