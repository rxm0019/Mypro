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
    .layui-row .disui-form-flex>label {
        flex: 0 0 120px;
    }
</style>
<body ms-controller="basDiagnoseTypeEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="basDiagnoseTypeEdit_form" id="basDiagnoseTypeEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2 layui-hide">
                <div class="disui-form-flex " >
                    <label>ID</label>
                    <input type="hidden" name="diagnoseTypeId" placeholder="请输入" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
                <div class="disui-form-flex">
                    <label>parentTypeId：</label>
                    <input type="hidden" name="parentTypeId" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>父诊断类别名称：</label>
                    <input type="text" name="parentTypeName" readonly>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>诊断类别名称：</label>
                    <input type="text" name="diagnoseTypeName" maxlength="50" lay-verify="required">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>诊断类别编码：</label>
                    <input type="text" name="diagnoseTypeCode" maxlength="50" lay-verify="required">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>质控诊断名称：</label>
                    <input type="text" name="diagnoseTypeQcname" maxlength="50">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>状态：</label>
                    <input type="radio" name="dataStatus" ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                           ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('sys_status')">
                </div>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="basDiagnoseTypeEdit_submit" id="basDiagnoseTypeEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/backstage/basDiagnoseTypeEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>