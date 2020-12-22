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
<body ms-controller="basVisitEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="basVisitEdit_form" id="basVisitEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1" ms-if="@readonly =='N'">
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2 layui-hide">
                <div class="disui-form-flex " >
                    <label>ID</label>
                    <input type="hidden" name="basVisitId" placeholder="请输入" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>访问日期：</label>
                    <input type="text" name="visitDate" lay-verify="required" id="visitDate">
                </div>
            </div>
            <div id="AccessMethod"></div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>访问内容：</label>
                    <textarea name="remarks"class="layui-textarea" maxlength="10000"></textarea>
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1" ms-if="@readonly =='Y'">
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>患者姓名：</label>
                    <input type="text" id="patientName">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div style="padding: 10px;" id="basVisitEdit_tool">
                    <button :visible="@baseFuncInfo.authorityTag('basVisitEdit#delete')"
                            class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <!--table定义-->
                <table id="basVisitList_table" lay-filter="basVisitList_table"></table>

            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="basVisitEdit_submit" id="basVisitEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/synthetical/basVisitEdit.js?t=${currentTimeMillis}"></script>

<!--table的工具栏按钮定义，注意：需要增加权限控制-->
<script type="text/html" id="basVisitEdit_bar">
    {{#  if(baseFuncInfo.authorityTag('basVisitEdit#delete')){ }}
    <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="delete">删除</a>
    {{#  } }}
</script>
</body>
</html>