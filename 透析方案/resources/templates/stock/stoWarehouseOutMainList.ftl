<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
</head>
<style>
    .layui-form-label {
        white-space: nowrap;
        width: 100px;
    }
    .layui-input-inline{
        width: 170px !important;
    }
    .layui-input-block{
        width: calc(100% - 110px);
    }
</style>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="stoWarehouseOutMainList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="stoWarehouseOutMainList_search" lay-filter="stoWarehouseOutMainList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="stoWarehouseOutMainList_tool">
                <!--销售出库按钮权限控制-->
                <button :visible="@baseFuncInfo.authorityTag('stoSalesDeliveryList#add') && @sale"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('stoSalesDeliveryList#checkOut') && @sale"
                        class="layui-btn layui-btn-dissub"  onclick="batchOut()">审批出库</button>
                <button :visible="@baseFuncInfo.authorityTag('stoSalesDeliveryList#export') && @sale"
                        class="layui-btn layui-btn-dissub" onclick="exportExcel()">导出</button>
                <!--领料出库按钮权限控制-->
                <button :visible="@baseFuncInfo.authorityTag('stoPickDeliveryList#add') && @pick"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('stoPickDeliveryList#checkOut') && @pick"
                        class="layui-btn layui-btn-dissub"  onclick="batchOut()">审批出库</button>
                <button :visible="@baseFuncInfo.authorityTag('stoPickDeliveryList#export') && @pick"
                        class="layui-btn layui-btn-dissub" onclick="exportExcel()">导出</button>
                <!--采购退货出库按钮权限控制-->
                <button :visible="@baseFuncInfo.authorityTag('stoPurchaseDeliveryList#add') && @purchase"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('stoPurchaseDeliveryList#checkOut') && @purchase"
                        class="layui-btn layui-btn-dissub"  onclick="batchOut()">审批出库</button>
                <button :visible="@baseFuncInfo.authorityTag('stoPurchaseDeliveryList#export') && @purchase"
                        class="layui-btn layui-btn-dissub" onclick="exportExcel()">导出</button>
                <!--报损出库按钮权限控制-->
                <button :visible="@baseFuncInfo.authorityTag('stoReportLossDeliveryList#add') && @reportLoss"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('stoReportLossDeliveryList#checkOut') && @reportLoss"
                        class="layui-btn layui-btn-dissub"  onclick="batchOut()">审批出库</button>
                <button :visible="@baseFuncInfo.authorityTag('stoReportLossDeliveryList#export') && @reportLoss"
                        class="layui-btn layui-btn-dissub" onclick="exportExcel()">导出</button>
                <!--盘亏出库按钮权限控制-->
                <button :visible="@baseFuncInfo.authorityTag('stoInventoryLossDeliveryList#checkOut') && @inventoryLoss"
                        class="layui-btn layui-btn-dissub"  onclick="batchOut()">审批出库</button>
                <button :visible="@baseFuncInfo.authorityTag('stoInventoryLossDeliveryList#export') && @inventoryLoss"
                        class="layui-btn layui-btn-dissub" onclick="exportExcel()">导出</button>
                <!--调拨出库按钮权限控制-->
                <button :visible="@baseFuncInfo.authorityTag('stoAllocationDeliveryList#add') && @allocation"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('stoAllocationDeliveryList#checkOut') && @allocation"
                        class="layui-btn layui-btn-dissub"  onclick="batchOut()">审批出库</button>
                <button :visible="@baseFuncInfo.authorityTag('stoAllocationDeliveryList#export') && @allocation"
                        class="layui-btn layui-btn-dissub" onclick="exportExcel()">导出</button>
                <!--其他出库按钮权限控制-->
                <button :visible="@baseFuncInfo.authorityTag('stoOtherDeliveryList#add') && @other"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('stoOtherDeliveryList#checkOut') && @other"
                        class="layui-btn layui-btn-dissub"  onclick="batchOut()">审批出库</button>
                <button :visible="@baseFuncInfo.authorityTag('stoOtherDeliveryList#export') && @other"
                        class="layui-btn layui-btn-dissub" onclick="exportExcel()">导出</button>
            </div>
            <!--table定义-->
            <table id="stoWarehouseOutMainList_table" lay-filter="stoWarehouseOutMainList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="stoWarehouseOutMainList_bar">
                <!--销售出库按钮权限控制-->
                {{#  if(baseFuncInfo.authorityTag('stoSalesDeliveryList#detail') && (d.status == '1' || d.status == '2') && d.type=="0"){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-blue " lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoSalesDeliveryList#edit') && (d.autoFlag == '1') && d.type=="0" && d.status == '0'){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="edit">设置</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoSalesDeliveryList#checkOut') && (d.status == '0') && (d.autoFlag == '1' && d.type=="0")){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="checkOut">审批出库</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoSalesDeliveryList#delete') && (d.status == '0') && d.type=="0"){ }}
                <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="delete">关闭</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoSalesDeliveryList#deAudit') && (d.status == '1') && d.type == '0' && d.autoFlag == '1'){ }}
                <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="deAudit">反审核</a>
                {{#  } }}
                <!--领料出库按钮权限控制-->
                {{#  if(baseFuncInfo.authorityTag('stoPickDeliveryList#detail') && (d.status == '1' || d.status == '2') && d.type=="1"){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-blue " lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoPickDeliveryList#edit') && d.type=="1" && d.status == '0'){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="edit">设置</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoPickDeliveryList#checkOut') && (d.status == '0') && (d.type=="1")){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="checkOut">审批出库</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoPickDeliveryList#delete') && (d.status == '0') && d.type=="1"){ }}
                <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="delete">关闭</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoPickDeliveryList#deAudit') && (d.status == '1') && d.type == '1'){ }}
                <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="deAudit">反审核</a>
                {{#  } }}
                <!--采购退货出库按钮权限控制-->
                {{#  if(baseFuncInfo.authorityTag('stoPurchaseDeliveryList#detail') && (d.status == '1' || d.status == '2') && d.type=="2"){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-blue " lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoPurchaseDeliveryList#edit') && d.type=="2" && d.status == '0'){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="edit">设置</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoPurchaseDeliveryList#checkOut') && (d.status == '0') && (d.type=="2")){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="checkOut">审批出库</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoPurchaseDeliveryList#delete') && (d.status == '0') && d.type=="2"){ }}
                <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="delete">关闭</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoPurchaseDeliveryList#deAudit') && (d.status == '1') && d.type=="2"){ }}
                <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="deAudit">反审核</a>
                {{#  } }}
                <!--报损出库按钮权限控制-->
                {{#  if(baseFuncInfo.authorityTag('stoReportLossDeliveryList#detail') && (d.status == '1' || d.status == '2') && d.type=="3"){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-blue " lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoReportLossDeliveryList#edit') && d.type=="3" && d.status == '0'){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="edit">设置</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoReportLossDeliveryList#checkOut') && (d.status == '0') && (d.type=="3")){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="checkOut">审批出库</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoReportLossDeliveryList#delete') && (d.status == '0') && d.type=="3"){ }}
                <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="delete">关闭</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoReportLossDeliveryList#deAudit') && (d.status == '1') && d.type=="3"){ }}
                <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="deAudit">反审核</a>
                {{#  } }}
                <!--盘亏出库按钮权限控制-->
                {{#  if(baseFuncInfo.authorityTag('stoInventoryLossDeliveryList#detail') && (d.status == '1' || d.status == '2') && d.type=="4"){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-blue " lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoInventoryLossDeliveryList#edit') && d.type=="4" && d.status == '0'){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="edit">设置</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoInventoryLossDeliveryList#checkOut') && (d.status == '0') && (d.type=="4")){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="checkOut">审批出库</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoInventoryLossDeliveryList#delete') && (d.status == '0') && d.type=="4"){ }}
                <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="delete">关闭</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoInventoryLossDeliveryList#deAudit') && (d.status == '1') && d.type=="4"){ }}
                <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="deAudit">反审核</a>
                {{#  } }}
                <!--调拨出库按钮权限控制-->
                {{#  if(baseFuncInfo.authorityTag('stoAllocationDeliveryList#detail') && (d.status == '1' || d.status == '2') && d.type=="5"){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-blue " lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoAllocationDeliveryList#edit') && d.type=="5" && d.status == '0'){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="edit">设置</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoAllocationDeliveryList#checkOut') && (d.status == '0') && (d.type=="5")){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="checkOut">审批出库</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoAllocationDeliveryList#delete') && (d.status == '0') && d.type=="5"){ }}
                <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="delete">关闭</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoAllocationDeliveryList#deAudit') && (d.status == '1') && d.type=="5"){ }}
                <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="deAudit">反审核</a>
                {{#  } }}
                <!--其他出库按钮权限控制-->
                {{#  if(baseFuncInfo.authorityTag('stoOtherDeliveryList#detail') && (d.status == '1' || d.status == '2') && d.type=="6"){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-blue " lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoOtherDeliveryList#edit') && d.type=="6" && d.status == '0'){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="edit">设置</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoOtherDeliveryList#checkOut') && (d.status == '0') && (d.type=="6")){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="checkOut">审批出库</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoOtherDeliveryList#delete') && (d.status == '0') && d.type=="6"){ }}
                <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="delete">关闭</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('stoOtherDeliveryList#deAudit') && (d.status == '1') && d.type=="6"){ }}
                <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="deAudit">反审核</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/stock/stoWarehouseOutMainList.js?t=${currentTimeMillis}"></script>
</body>
</html>