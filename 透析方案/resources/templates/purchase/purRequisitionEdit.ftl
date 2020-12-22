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
<body ms-controller="purRequisitionEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="purRequisitionEdit_form" id="purRequisitionEdit_form"
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
                    <input type="text" name="requisitionNo" maxlength="32" lay-verify="required" :attr="@fixedField">
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
                    <input type="text" name="requisitionStatusText" maxlength="2" lay-verify="required" :attr="@fixedField">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label>备注：</label>
                    <textarea name="remarks" maxlength="21845" :attr="@dynamicField"></textarea>
                </div>
            </div>


            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="layui-form  layuiadmin-card-header-auto search-form">
                        <hr/>
                        <div class="layui-form-item" style="margin-bottom: 0px; height: 40px;">
                            <div class="layui-inline" style="margin-bottom: 5px;">
                                <label>预算公式：上个月出库数量 + 出库数量 x 患者新增系数</label>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline" style="width: 70px">
                                    <input type="text" name="budgetFormula" class="layui-input" ms-duplex="budgetFormula"
                                           style="width:80px" lay-verify="required|number" maxlength="10" :attr="@budgetFormula">
                                </div>
                                <label>- 即时库存</label>
                            </div>
                            <div class="layui-inline">
                                <button :visible="@baseFuncInfo.authorityTag('purRequisitionList#generateBudget')"
                                        class="layui-btn layui-btn-dismain" onclick="generateBudget()">生成预算
                                </button>
                                <button :visible="@baseFuncInfo.authorityTag('purRequisitionList#import')"
                                        class="layui-btn layui-btn-dismain" onclick="importBudget()">导入
                                </button>
                            </div>
                        </div>

                        <div class="" style="margin-bottom: 0px; height: 30px;">
                            <div class="layui-inline">
                                <label>预算类型：</label>
                            </div>
                            <div class="layui-inline">
                                <input type="radio" lay-filter="radio" name="budgetType" ms-duplex="budgetType"
                                       ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                                       ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('budgetType')">
                            </div>
                        </div>
                        <hr/>
                    </div>
                </div>
            </div>


            <!--搜素栏的div-->
            <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
                 id="purRequisitionList_search" lay-filter="purRequisitionList_search">
            </div>
            <div class="layui-card-body">
                <!--table定义-->
                <table id="purBudgetInfoList_table" lay-filter="purBudgetInfoList_table"></table>
                <!--table的工具栏按钮定义，注意：需要增加权限控制-->
                <script type="text/html" id="purBudgetInfoList_bar">
                    {{#  if(baseFuncInfo.authorityTag('purRequisitionList#set') && d.materielNo === ''){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="set">设置</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('purRequisitionList#delete')){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="delete">删除</a>
                    {{#  } }}
                </script>
            </div>

            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="purRequisitionEdit_submit"
                        id="purRequisitionEdit_submit">提交
                </button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/purchase/purRequisitionEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>