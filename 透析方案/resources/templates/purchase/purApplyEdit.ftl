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
<body ms-controller="purApplyEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="purApplyEdit_form" id="purApplyEdit_form"
         style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label>ID</label>
                <div class="disui-form-flex">
                    <input type="hidden" name="requisitionId">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>申请单号：</label>
                    <input type="text" name="requisitionNo" maxlength="32"  :attr="@noneIdTips">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>申请人：</label>
                    <input type="text" name="createByText" maxlength="32" lay-verify="required" :attr="@fixedField">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>申请日期：</label>
                    <input type="text" name="createTime" lay-verify="required" id="createTime" :attr="@fixedField">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>单据状态：</label>
                    <input type="text" name="requisitionStatusText" maxlength="2" lay-verify="required"
                           :attr="@fixedField">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label>备注：</label>
                    <textarea name="remarks" maxlength="21845" :attr="@dynamicField"></textarea>
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" id="tool">
                <!--工具栏的按钮的div，注意：需要增加权限控制-->
                <div style="padding: 10px;" id="stoSalesDeliveryList_tool">
                    <button :visible="@baseFuncInfo.authorityTag('stoSalesDeliveryEdit#add')"
                            class="layui-btn layui-btn-dismain" onclick="addMateriel()">添加物料
                    </button>
                </div>
            </div>

            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <!--table定义-->
                <table id="purApplyEdit_table" lay-filter="purApplyEdit_table"></table>
                <!--table的工具栏按钮定义，注意：需要增加权限控制-->
                <script type="text/html" id="purBudgetInfoList_bar">
                    {{#  if(baseFuncInfo.authorityTag('purRequisitionList#delete')){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="delete">删除</a>
                    {{#  } }}
                </script>
            </div>
            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="purApplyEdit_submit"
                        id="purApplyEdit_submit">提交
                </button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/purchase/purApplyEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>