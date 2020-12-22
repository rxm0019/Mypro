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
        .layui-form-label {
            width: 120px;
        }
        #purOrderMainList_search .layui-input-inline {
            width: 160px !important;
        }
        #purOrderMainList_search .layui-input-block {
            width: calc(100% - 130px) !important;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="purOrderMainList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="purOrderMainList_search" lay-filter="purOrderMainList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="purOrderMainList_tool">
                <button :visible="@baseFuncInfo.authorityTag('purOrderMainList#add')"
                        class="layui-btn layui-btn-dismain"  onclick="add()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('purOrderMainList#import')"
                        class="layui-btn layui-btn-dismain"  :click="@baseFuncInfo.batchImp('purOrderMain', 'pharmacy')">导入采购单</button>
                <button :visible="@baseFuncInfo.authorityTag('purOrderMainList#apply')"
                        class="layui-btn layui-btn-dismain"  onclick="Apply4Warehousing()">申请入库</button>
                <button :visible="@baseFuncInfo.authorityTag('purOrderMainList#report') && @reportFinance"
                        class="layui-btn layui-btn-dismain"  onclick="Report2Finance()">上报财务</button>
                <button :visible="@baseFuncInfo.authorityTag('purOrderMainList#export')"
                        class="layui-btn layui-btn-dissub"  onclick="exportExcel()">导出</button>
            </div>
            <!--table定义-->
            <table id="purOrderMainList_table" lay-filter="purOrderMainList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="purOrderMainList_bar">
                {{#  if(baseFuncInfo.authorityTag('purOrderMainList#approval') && d.orderStatus === $.constant.POStatus.PENDING_APPROVAL){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="edit">编辑</a>
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="approval">审批</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('purOrderMainList#detail') && (d.orderStatus === $.constant.POStatus.WAREHOUSING || d.orderStatus === $.constant.POStatus.UN_WAREHOUSING || d.orderStatus === $.constant.POStatus.PARTIAL_WAREHOUSING)){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('purOrderMainList#report') && d.reportingStatus === $.constant.POReportingStatus.TO_BE_REPORTED && purOrderMainList.reportFinance && d.orderStatus !== $.constant.POStatus.PENDING_APPROVAL && d.b2bSupplier === $.constant.b2bSupplier.N){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="report">上报财务</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('purOrderMainList#execution') && d.orderStatus === $.constant.POStatus.UN_WAREHOUSING && d.b2bSupplier === $.constant.b2bSupplier.N && d.purchaseStatus === $.constant.POPurchaseStatus.TO_BE_PURCHASED){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="execution">执行采购</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('purOrderMainList#send') && d.orderStatus === $.constant.POStatus.UN_WAREHOUSING && (d.b2bSupplier === $.constant.b2bSupplier.Y && d.b2b === '') && d.purchaseStatus === $.constant.POPurchaseStatus.TO_BE_PURCHASED){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="send">发送B2B</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('purOrderMainList#apply') && (d.orderStatus === $.constant.POStatus.UN_WAREHOUSING) && (d.reportingStatus === $.constant.POReportingStatus.REPORTED || !purOrderMainList.reportFinance) && (d.purchaseStatus === $.constant.POPurchaseStatus.PURCHASING)){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="apply">申请入库</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/purchase/purOrderMainList.js?t=${currentTimeMillis}"></script>
<script type="text/html" id="checkAll">
    {{#  if ((d.orderStatus === $.constant.POStatus.UN_WAREHOUSING && (d.reportingStatus === $.constant.POReportingStatus.REPORTED || !purOrderMainList.reportFinance) && d.purchaseStatus === $.constant.POPurchaseStatus.PURCHASING) || d.reportingStatus === $.constant.POReportingStatus.TO_BE_REPORTED){ }}
    <input type="checkbox" name="checkOne" title="" lay-skin="primary" data-id="{{ d.orderMainId }}" data-supplierId="{{ d.supplierInfoId }}" data-purchaseOrderNo="{{ d.purchaseOrderNo }}" data-orderStatus="{{ d.orderStatus }}" data-reportingStatus="{{ d.reportingStatus }}" data-purchaseStatus="{{ d.purchaseStatus }}" data-b2bSupplier="{{ d.b2bSupplier }}" />
    {{#  } }}
</script>
</body>
</html>