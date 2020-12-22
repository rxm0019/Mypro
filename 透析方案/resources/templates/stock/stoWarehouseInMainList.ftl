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
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="stoWarehouseInMainList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="stoWarehouseInMainList_search" lay-filter="stoWarehouseInMainList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="stoWarehouseInMainList_tool">
                <!-- 采购入库 -->
                <button :visible="@baseFuncInfo.authorityTag('stoPurchaseInList#apply') && @purchase"
                        class="layui-btn layui-btn-dismain" onclick="batchApply()">审批入库
                </button>
                <button :visible="@baseFuncInfo.authorityTag('stoPurchaseInList#export') && @purchase"
                        class="layui-btn layui-btn-dissub" onclick="exportExcel()">导出
                </button>

                <!-- 销售退货入库 -->
                <button :visible="@baseFuncInfo.authorityTag('stoSaleInList#add') && @sale"
                        class="layui-btn layui-btn-dismain" onclick="setOrDetail('', $.constant.WarehouseInType.SALE)">添加
                </button>
                <button :visible="@baseFuncInfo.authorityTag('stoSaleInList#apply') && @sale"
                        class="layui-btn layui-btn-dismain" onclick="batchApply()">审批入库
                </button>
                <button :visible="@baseFuncInfo.authorityTag('stoSaleInList#export') && @sale"
                        class="layui-btn layui-btn-dissub" onclick="exportExcel()">导出
                </button>

                <!-- 盘盈入库 -->
                <button :visible="@baseFuncInfo.authorityTag('stoInventorySurplusInList#apply') && @inventoryProfit"
                        class="layui-btn layui-btn-dismain" onclick="batchApply()">审批入库
                </button>
                <button :visible="@baseFuncInfo.authorityTag('stoInventorySurplusInList#export') && @inventoryProfit"
                        class="layui-btn layui-btn-dissub" onclick="exportExcel()">导出
                </button>

                <!-- 调拨入库 -->
                <button :visible="@baseFuncInfo.authorityTag('stoAllocationInList#add') && @allocation"
                        class="layui-btn layui-btn-dismain" onclick="setOrDetail('', $.constant.WarehouseInType.ALLOCATION)">添加
                </button>
                <button :visible="@baseFuncInfo.authorityTag('stoAllocationInList#apply') && @allocation"
                        class="layui-btn layui-btn-dismain" onclick="batchApply()">审批入库
                </button>
                <button :visible="@baseFuncInfo.authorityTag('stoAllocationInList#export') && @allocation"
                        class="layui-btn layui-btn-dissub" onclick="exportExcel()">导出
                </button>

                <!-- 其他入库 -->
                <button :visible="@baseFuncInfo.authorityTag('stoOtherInList#add') && @other"
                        class="layui-btn layui-btn-dismain" onclick="setOrDetail('', $.constant.WarehouseInType.OTHER)">添加
                </button>
                <button :visible="@baseFuncInfo.authorityTag('stoOtherInList#apply') && @other"
                        class="layui-btn layui-btn-dismain" onclick="batchApply()">审批入库
                </button>
                <button :visible="@baseFuncInfo.authorityTag('stoOtherInList#export') && @other"
                        class="layui-btn layui-btn-dissub" onclick="exportExcel()">导出
                </button>
            </div>
            <!--table定义-->
            <table id="stoWarehouseInMainList_table" lay-filter="stoWarehouseInMainList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="stoWarehouseInMainList_bar">
                <!-- 采购入库 -->
                {{# if(d.type === $.constant.WarehouseInType.PURCHASE) {  }}
                    {{#  if(baseFuncInfo.authorityTag('stoPurchaseInList#detail') && (d.status === $.constant.WarehouseInStatus.SUBMIT)){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="detail">详情</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoPurchaseInList#set') && d.status === $.constant.WarehouseInStatus.UN_SUBMIT){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="set">设置</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoPurchaseInList#apply') && d.status === $.constant.WarehouseInStatus.UN_SUBMIT){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="apply">审批入库</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoPurchaseInList#deAudit') && d.status === $.constant.WarehouseInStatus.SUBMIT){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="deAudit">反审核</a>
                    {{#  } }}
                {{#  } }}

                <!-- 销售退货入库 -->
                {{# if(d.type === $.constant.WarehouseInType.SALE) {  }}
                    {{#  if(baseFuncInfo.authorityTag('stoSaleInList#detail') && (d.status === $.constant.WarehouseInStatus.SUBMIT || d.status === $.constant.WarehouseInStatus.CLOSE)){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="detail">详情</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoSaleInList#set') && d.status === $.constant.WarehouseInStatus.UN_SUBMIT){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="set">设置</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoSaleInList#apply') && d.status === $.constant.WarehouseInStatus.UN_SUBMIT){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="apply">审批入库</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoSaleInList#close') && (d.status === $.constant.WarehouseInStatus.UN_SUBMIT)){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="close">关闭</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoSaleInList#deAudit') && d.status === $.constant.WarehouseInStatus.SUBMIT){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="deAudit">反审核</a>
                    {{#  } }}
                {{#  } }}

                <!-- 盘盈入库 -->
                {{# if(d.type === $.constant.WarehouseInType.INVENTORY_PROFIT) {  }}
                    {{#  if(baseFuncInfo.authorityTag('stoInventorySurplusInList#detail') && (d.status === $.constant.WarehouseInStatus.SUBMIT || d.status === $.constant.WarehouseInStatus.CLOSE)){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="detail">详情</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoInventorySurplusInList#set') && d.status === $.constant.WarehouseInStatus.UN_SUBMIT){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="set">设置</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoInventorySurplusInList#apply') && d.status === $.constant.WarehouseInStatus.UN_SUBMIT){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="apply">审批入库</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoInventorySurplusInList#close') && (d.status === $.constant.WarehouseInStatus.UN_SUBMIT)){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="close">关闭</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoInventorySurplusInList#deAudit') && d.status === $.constant.WarehouseInStatus.SUBMIT){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="deAudit">反审核</a>
                    {{#  } }}
                {{#  } }}

                <!-- 调拨入库 -->
                {{# if(d.type === $.constant.WarehouseInType.ALLOCATION) {  }}
                    {{#  if(baseFuncInfo.authorityTag('stoAllocationInList#detail') && (d.status === $.constant.WarehouseInStatus.SUBMIT || d.status === $.constant.WarehouseInStatus.CLOSE)){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="detail">详情</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoAllocationInList#set') && d.status === $.constant.WarehouseInStatus.UN_SUBMIT){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="set">设置</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoAllocationInList#apply') && d.status === $.constant.WarehouseInStatus.UN_SUBMIT){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="apply">审批入库</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoAllocationInList#close') && (d.status === $.constant.WarehouseInStatus.UN_SUBMIT)){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="close">关闭</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoAllocationInList#deAudit') && d.status === $.constant.WarehouseInStatus.SUBMIT){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="deAudit">反审核</a>
                    {{#  } }}
                {{#  } }}

                <!-- 其他入库 -->
                {{# if(d.type === $.constant.WarehouseInType.OTHER) {  }}
                    {{#  if(baseFuncInfo.authorityTag('stoOtherInList#detail') && (d.status === $.constant.WarehouseInStatus.SUBMIT || d.status === $.constant.WarehouseInStatus.CLOSE)){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="detail">详情</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoOtherInList#set') && d.status === $.constant.WarehouseInStatus.UN_SUBMIT){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="set">设置</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoOtherInList#apply') && d.status === $.constant.WarehouseInStatus.UN_SUBMIT){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="apply">审批入库</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoOtherInList#close') && (d.status === $.constant.WarehouseInStatus.UN_SUBMIT)){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="close">关闭</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('stoOtherInList#deAudit') && d.status === $.constant.WarehouseInStatus.SUBMIT){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="deAudit">反审核</a>
                    {{#  } }}
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript"
        src="${ctxsta}/static/js/stock/stoWarehouseInMainList.js?t=${currentTimeMillis}"></script>
<script type="text/html" id="checkAll">
    {{#  if (d.status === $.constant.WarehouseInStatus.UN_SUBMIT){ }}
    <input type="checkbox" name="checkOne" title="" lay-skin="primary" data-id="{{ d.warehouseInMainId }}" />
    {{#  } }}
</script>
</body>
</html>