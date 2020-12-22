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
<body ms-controller="stoWarehouseOutMainEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="stoWarehouseOutMainEdit_form" id="stoWarehouseOutMainEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label>ID</label>
                <div class="disui-form-flex">
                    <input type="hidden" name="warehouseOutMainId" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>出库单号：</label>
                    <input type="text" name="orderOutNo" :attr="@orderOutNo">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>出库类型：</label>
                    <input type="text" name="type" :attr="@orderOutNo">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3" id="patient">
                <div class="disui-form-flex" >
                    <label>患者姓名：</label>
                    <input type="text" id="patientName" placeholder="由病历号带出" :attr="@orderOutNo">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3" id="createBy">
                <div class="disui-form-flex" >
                    <label>操作人：</label>
                    <input type="text" name="createName" autocomplete="off" :attr="@orderOutNo">
                </div>
            </div>
            <div id="detail"></div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" id="tool">
                <!--工具栏的按钮的div，注意：需要增加权限控制-->
                <div style="padding: 10px;" id="stoSalesDeliveryList_tool">
                    <button :visible="@baseFuncInfo.authorityTag('stoSalesDeliveryEdit#add')"
                            class="layui-btn layui-btn-dismain"  onclick="add()">添加物料</button>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <!--table定义-->
                <table id="stoWarehouseOutDetailList_table" lay-filter="stoWarehouseOutDetailList_table"></table>
                <script type="text/html" id="stoWarehouseOutDetailList_bar">
                    <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="delete">删除</a>
                </script>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="stoWarehouseOutMainEdit_submit" id="stoWarehouseOutMainEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/stock/stoWarehouseOutMainEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>