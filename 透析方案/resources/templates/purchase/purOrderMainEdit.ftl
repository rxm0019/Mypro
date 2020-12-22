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
        .layui-row .disui-form-flex > label {
            flex-basis: 120px;
        }

        .layui-row .disui-form-flex > label:last-child {
            flex-basis: 90px;
        }
    </style>
</head>
<body ms-controller="purOrderMainEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="purOrderMainEdit_form" id="purOrderMainEdit_form"
         style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="disui-form-flex">
                    <input type="hidden" name="orderMainId">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label class="layui-form-label">订单编号：</label>
                    <input type="text" name="purchaseOrderNo" maxlength="32" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label class="layui-form-label">订单状态：</label>
                    <input type="text" name="orderStatusText" maxlength="2" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label class="layui-form-label">采购人：</label>
                    <input type="text" name="createByText" maxlength="32" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label class="layui-form-label">供应商名称：</label>
                    <input type="text" name="supplierInfoText" maxlength="32" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label class="layui-form-label">B2B供应商：</label>
                    <input type="radio" lay-verify="radio" name="b2bSupplier"
                           ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                           ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('YesOrNo')">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label class="layui-form-label">采购日期：</label>
                    <input type="text" name="createTimeText" id="createTime" placeholder="yyyy-MM-dd" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>结算方式：</label>
                    <select name="settlementType" lay-verify="required" ms-duplex="settlementTypeStr">
                        <option value=""></option>
                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('settlementType')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>付款方式：</label>
                    <select name="paymentType" lay-verify="required" ms-duplex="paymentTypeStr">
                        <option value=""></option>
                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('paymentType')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>预付款比率(%)：</label>
                    <input type="text" name="prepayment" lay-verify="required|number" maxlength="5" :attr="@prepayment">
                </div>
            </div>

            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="purOrderMainEdit_submit" id="purOrderMainEdit_submit">
                    提交
                </button>
            </div>
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px 10px 0px 10px;" id="stoWarehouseInDetailList_tool">
                <button :visible="@baseFuncInfo.authorityTag('purOrderMainList#add') && @btnDelete"
                        class="layui-btn layui-btn-dismain" onclick="addMateriel()">添加物料</button>
            </div>
            <!--table定义-->
            <table id="purOrderDetailEdit_table" lay-filter="purOrderDetailEdit_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="purOrderDetailEdit_bar">
                {{#  if(baseFuncInfo.authorityTag('purOrderMainList#close') && purOrderMainEdit.btnDelete){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="delete">删除</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('purOrderMainList#close') && purOrderMainEdit.btnClose){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="close">关闭</a>
                {{#  } }}
            </script>
        </div>

    </div>
</div>

<script type="text/javascript" src="${ctxsta}/static/js/purchase/purOrderMainEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>