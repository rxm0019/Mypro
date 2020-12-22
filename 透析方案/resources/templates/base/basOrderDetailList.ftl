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
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
</head>
<body ms-controller="basOrderDetailList">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="basOrderDetailList_form" id="basOrderDetailList_form"
         style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="OrderDetailId" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label class="layui-form-label">医嘱名称：</label>
                    <input type="text" ms-duplex="@orderName" :attr="@readonly">
                </div>
            </div>

            <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                <div class="disui-form-flex">
                    <label class="layui-form-label">医嘱类别：</label>
                    <input type="text" ms-duplex="@orderType" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3" :if="@hide">
                <div class="disui-form-flex">
                    <label class="layui-form-label">规格：</label>
                    <input type="text" ms-duplex="@specifications" :attr="@readonly" >
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3" :if="@hide">
                <div class="disui-form-flex">
                    <label class="layui-form-label">单位：</label>
                    <input type="text" ms-duplex="@unit" :attr="@readonly">
                </div>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="basOrderDetailList_submit"
                    id="basOrderDetailList_submit">
                提交
            </button>
        </div>
    </div>
</div>
<div class="layui-fluid">
    <div class="layui-card">
        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="basOrderDetailList_tool">
                <button class="layui-btn layui-btn-dismain" onclick="insert()">新增打包明细</button>
                <button :visible="baseFuncInfo.authorityTag('basOrderDetailList#delete')"
                        class="layui-btn layui-btn-dissub " onclick="batchDel()">删除
                </button>
            </div>

            <!--table定义-->
            <table id="basOrderDetailList_table" lay-filter="basOrderDetailList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="basOrderDetailList_bar">
                {{#  if(baseFuncInfo.authorityTag('basOrderDetailList#delete')){ }}
                <a class="layui-btn layui-btn-danger layui-btn-xs layui-btn-dissmall layui-btn-dis-black"
                   lay-event="delete">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/base/basOrderDetailList.js?t=${currentTimeMillis}"></script>
</body>
</html>