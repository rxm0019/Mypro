<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <style>
        .laytable-cell-checkbox .layui-disabled.layui-form-checked i {
            background: #fff !important;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="purRequisitionList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="purRequisitionList_search" lay-filter="purRequisitionList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="purRequisitionList_tool">
                <button :visible="@baseFuncInfo.authorityTag('purRequisitionList#add')"
                        class="layui-btn layui-btn-dismain"  onclick="addAndOpen()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('purRequisitionList#delete')"
                        class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>
                <button :visible="@baseFuncInfo.authorityTag('purRequisitionList#export')"
                        class="layui-btn layui-btn-dissub"  onclick="exportExcel()">导出</button>
            </div>
            <!--table定义-->
            <table id="purRequisitionList_table" lay-filter="purRequisitionList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="purRequisitionList_bar">
                {{#  if(baseFuncInfo.authorityTag('purRequisitionList#detail') && (d.requisitionStatus === $.constant.PRStatus.SUBMIT)){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('purRequisitionList#edit') && (d.requisitionStatus === $.constant.PRStatus.UN_SUBMIT || d.requisitionStatus === $.constant.PRStatus.GO_BACK)){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('purRequisitionList#submit') && (d.requisitionStatus === $.constant.PRStatus.UN_SUBMIT || d.requisitionStatus === $.constant.PRStatus.GO_BACK)){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="submit">提交</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('purRequisitionList#delete') && (d.requisitionStatus === $.constant.PRStatus.UN_SUBMIT || d.requisitionStatus === $.constant.PRStatus.GO_BACK)){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="delete">删除</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('purRequisitionList#seeReason') && (d.requisitionStatus === $.constant.PRStatus.GO_BACK)){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="seeReason">查看原因</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/purchase/purRequisitionList.js?t=${currentTimeMillis}"></script>
<script type="text/html" id="checkAll">
    {{#  if (d.requisitionStatus !== $.constant.PRStatus.SUBMIT){ }}
    <input type="checkbox" name="checkOne" title="" lay-skin="primary" data-id="{{ d.requisitionId }}" data-no="{{ d.requisitionNo }}" data-type="{{ d.budgetType }}" />
    {{#  } }}
</script>
</body>
</html>