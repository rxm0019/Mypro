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
<body ms-controller="bacPatientScheduleCopy">
<div class="layui-card-body">
    <div class="layui-form" lay-filter="bacPatientScheduleCopy_form" id="bacPatientScheduleCopy_form" style="padding: 20px 50px 0 50px;">
        <div class="layui-row layui-col-space1 demo-list">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>复制周期：</label>
                    <input type="text" name="copyDate" id="copyDate" placeholder="yyyy-MM-dd~yyyy-MM-dd" autocomplete="off" >
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>复制类型：</label>
                    <input type="radio" name="copyType" value="1" title="将上周排班复制到本周" >
                </div>
                <div class="disui-form-flex" >
                    <label class="layui-form-label"></label>
                    <input type="radio" name="copyType" value="2" title="将复制周期排班复制到本周" >
                </div>
                <div class="disui-form-flex" >
                    <label class="layui-form-label"></label>
                    <input type="radio" name="copyType" value="3" title="将复制周期排班复制到下周" checked>
                </div>
                <div class="disui-form-flex" >
                    <label class="layui-form-label"></label>
                    <input type="radio" name="copyType" value="4" title="将复制周期前两周（包含复制周期）排班复制到下两周" >
                </div>
            </div>
            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="bacPatientScheduleCopy_submit" id="bacPatientScheduleCopy_submit">提交</button>
        </div>
    </div>
</div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacPatientScheduleCopy.js?t=${currentTimeMillis}"></script>
</body>
</html>