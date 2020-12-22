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
</head>
<style>
    .layui-btn-dismain{
        margin-left: 0px !important;
    }

     /* 防止下拉框的下拉列表被隐藏---必须设置 */
    [data-field="storageRoom"] .layui-table-cell, .layui-table-tool-panel li {
        overflow: visible;
    }
</style>
<body ms-controller="stoWarehouseInMainEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="stoWarehouseInMainEdit_form" id="stoWarehouseInMainEdit_form"
         style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="warehouseInMainId">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4" :visible="@allocation && @showOrderOutNo">
                <div class="disui-form-flex">
                    <label class="layui-form-label">入库单编号：</label>
                    <input type="text" name="orderInNo" maxlength="32" placeholder="系统自动生成" :attr="@fixedField">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4" :visible="!(@allocation && @showOrderOutNo)">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>调拨出库单：</label>
                    <select name="orderOutNo" ms-duplex="orderOutNoStr" lay-filter="orderOutNoStr">
                        <option value=""></option>
                        <option ms-attr="{value:el.warehouseOutMainId}" ms-text="@el.orderOutNo"
                                ms-for="($index, el) in @allocationDeliveryList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label class="layui-form-label">入库类型：</label>
                    <input type="text" name="typeText" maxlength="2" :attr="@fixedField">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label class="layui-form-label">操作人：</label>
                    <input type="text" name="createByText" maxlength="32" :attr="@fixedField">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4" :visible="@purchaseTrue">
                <div class="disui-form-flex">
                    <label class="layui-form-label">采购单编号：</label>
                    <input type="text" name="bussOrderNo" maxlength="32" :attr="@fixedField">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4" :visible="@inventoryProfitTrue">
                <div class="disui-form-flex">
                    <label class="layui-form-label">盘点单编号：</label>
                    <input type="text" name="bussOrderNo" maxlength="32" :attr="@fixedField">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4" :visible="@purchaseTrue">
                <div class="disui-form-flex">
                    <label class="layui-form-label">供应商名称：</label>
                    <input type="text" name="supplierName" maxlength="32" :attr="@fixedField">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4" :visible="@inventoryProfitTrue">
                <div class="disui-form-flex">
                    <label class="layui-form-label">入库状态：</label>
                    <input type="text" name="statusText" maxlength="2" :attr="@fixedField">
                </div>
            </div>
            <div class="layui-col-sm8 layui-col-md8 layui-col-lg8" :visible="!(@purchaseTrue || @inventoryProfitTrue)">
                <div class="disui-form-flex">
                    <label class="layui-form-label">摘要：</label>
                    <textarea name="remark" maxlength="21845" style="height: 20px" :attr="@dynamicField"></textarea>
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>入库日期：</label>
                    <input type="text" name="warehouseInDate" id="createTime" lay-verify="required" :attr="@dynamicField" >
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" :visible="@purchaseTrue || @inventoryProfitTrue">
                <div class="disui-form-flex">
                    <label class="layui-form-label">摘要：</label>
                    <textarea name="remarks" maxlength="21845" style="height: 20px" :attr="@dynamicField"></textarea>
                </div>
            </div>
            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4 layui-hide">
                <button class="layui-btn" lay-submit lay-filter="stoWarehouseInMainEdit_submit"
                        id="stoWarehouseInMainEdit_submit">提交
                </button>
            </div>
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px 10px 0px 10px;" id="stoWarehouseInDetailList_tool">
                <!-- 采购入库 -->
                <button :visible="@baseFuncInfo.authorityTag('stoPurchaseInList#add') && @purchase"
                        class="layui-btn layui-btn-dismain" onclick="addMateriel()">添加物料</button>
                <!-- 销售退货入库 -->
                <button :visible="@baseFuncInfo.authorityTag('stoSaleInList#add') && @sale"
                        class="layui-btn layui-btn-dismain" onclick="addMateriel()">添加物料</button>
                <!-- 盘盈入库 -->
                <button :visible="@baseFuncInfo.authorityTag('stoInventorySurplusInList#add') && @inventoryProfit"
                        class="layui-btn layui-btn-dismain" onclick="addMateriel()">添加物料</button>
                <!-- 调拨入库 -->
                <button :visible="@baseFuncInfo.authorityTag('stoAllocationInList#add') && @allocation && @sign"
                        class="layui-btn layui-btn-dismain" onclick="addMateriel()">添加物料</button>
                <!-- 其他入库 -->
                <button :visible="@baseFuncInfo.authorityTag('stoOtherInList#add') && @other"
                        class="layui-btn layui-btn-dismain" onclick="addMateriel()">添加物料</button>
            </div>
            <!--table定义-->
            <table id="stoWarehouseInDetailList_table" lay-filter="stoWarehouseInDetailList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="stoWarehouseInDetailList_bar">
                <!-- 采购入库 -->
                {{# if(stoWarehouseInMainEdit.warehousingType === $.constant.WarehouseInType.PURCHASE) {  }}
                    {{#  if(baseFuncInfo.authorityTag('stoPurchaseInList#delete')){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="delete">关闭</a>
                    {{#  } }}
                {{#  } }}

                <!-- 销售退货入库 -->
                {{# if(stoWarehouseInMainEdit.warehousingType === $.constant.WarehouseInType.SALE) {  }}
                    {{#  if(baseFuncInfo.authorityTag('stoSaleInList#delete')){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="delete">删除</a>
                    {{#  } }}
                {{#  } }}

                <!-- 盘盈入库 -->
                {{# if(stoWarehouseInMainEdit.warehousingType === $.constant.WarehouseInType.INVENTORY_PROFIT) {  }}
                    {{#  if(baseFuncInfo.authorityTag('stoInventorySurplusInList#delete')){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="delete">删除</a>
                    {{#  } }}
                {{#  } }}

                <!-- 调拨入库 -->
                {{# if(stoWarehouseInMainEdit.warehousingType === $.constant.WarehouseInType.ALLOCATION) {  }}
                    {{#  if(baseFuncInfo.authorityTag('stoAllocationInList#delete')){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="delete">删除</a>
                    {{#  } }}
                {{#  } }}

                <!-- 其他入库 -->
                {{# if(stoWarehouseInMainEdit.warehousingType === $.constant.WarehouseInType.OTHER) {  }}
                    {{#  if(baseFuncInfo.authorityTag('stoOtherInList#delete')){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="delete">删除</a>
                    {{#  } }}
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/stock/stoWarehouseInMainEdit.js?t=${currentTimeMillis}"></script>

<script type="text/html" id="warehouseInCount">
    <input class="layui-input" type="text" maxlength="11" name="warehouseInCountTemp" style="height:100%;text-align:right;padding-right:5px;" lay-verify="required|number" lay-filter="warehouseInCount" id={{"quantity_" + d.warehouseInDetailId}}>
</script>
<script type="text/html" id="manufactureDate">
    <input class="layui-input" type="text" name="manufactureDate" style="height:100%" lay-verify="required|date" lay-filter="manufactureDate" id={{"input_" + d.warehouseInDetailId}}>
</script>

<script type="text/html" id="expirationDate">
    <input class="layui-input" type="text" name="expirationDate" style="height:100%" lay-verify="required|date" lay-filter="expirationDate" id={{"expirationDate_" + d.warehouseInDetailId}}>
</script>

<script type="text/html" id="storageRoom">
    <select name="storageRoom" lay-verify="required" lay-filter={{"storageRoom_" + d.warehouseInDetailId}} lay-search id={{"select_" + d.warehouseInDetailId}}>
        <option value=""></option>
        {{# stoWarehouseInMainEdit.warehouseList.map(function(item, idx, arr) { }}
        <option value={{ item.warehouseId }}>{{ item.houseName }}</option>
        {{# }); }}
    </select>
</script>

<!-- 调拨入库 -->
<script type="text/html" id="warehouseOutCount">
    <input class="layui-input" type="text" maxlength="11" name="warehouseInCountTemp" style="height:100%;text-align:right;padding-right:5px;" lay-verify="required|number" lay-filter="warehouseInCount" id={{"quantity_" + d.warehouseOutId}}>
</script>
<script type="text/html" id="manufactureOutDate">
    <input class="layui-input" type="text" name="manufactureDate" style="height:100%" lay-verify="required|date" lay-filter="manufactureDate" id={{"input_" + d.warehouseOutId}}>
</script>

<script type="text/html" id="expirationOutDate">
    <input class="layui-input" type="text" name="expirationDate" style="height:100%" lay-verify="required|date" lay-filter="expirationDate" id={{"expirationDate_" + d.warehouseOutId}}>
</script>

<script type="text/html" id="storageOutRoom">
    <select name="storageRoom" lay-verify="required" lay-filter={{"storageRoom_" + d.warehouseOutId}} lay-search id={{"select_" + d.warehouseOutId}}>
        <option value=""></option>
        {{# stoWarehouseInMainEdit.warehouseList.map(function(item, idx, arr) { }}
        <option value={{ item.warehouseId }}>{{ item.houseName }}</option>
        {{# }); }}
    </select>
</script>
</body>
</html>