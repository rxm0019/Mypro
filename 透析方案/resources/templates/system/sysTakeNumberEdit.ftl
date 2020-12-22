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
<body ms-controller="sysTakeNumberEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="sysTakeNumberEdit_form" id="sysTakeNumberEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="takeNumberId" placeholder="请输入" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex">
                    <label>类别</label>
                    <input type="text" name="name" maxlength="3"  autocomplete="off" readonly="readonly" />
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex">
                    <label>首字母</label>
                    <input type="text" name="prefix" maxlength="15"  autocomplete="off" />
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>流水号长度</label>
                <input type="text" name="numberLen" lay-verify="required|number" autocomplete="off" />
            </div>
        </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="sysTakeNumberEdit_submit" id="sysTakeNumberEdit_submit">提交</button>
        </div>
</div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysTakeNumberEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>