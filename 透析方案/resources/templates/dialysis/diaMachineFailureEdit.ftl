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
<body ms-controller="diaMachineFailureEdit">
<div class="layui-form" lay-filter="diaMachineFailureEdit_form" id="diaMachineFailureEdit_form"
     style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>透析机：</label>
                <select name="codeNo" xm-select="codeNo"
                        xm-select-height="36px"
                        xm-select-search=""
                        lay-filter="codeNo"
                        lay-verify="required"
                >
                    <option value=""></option>
                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('codeNo')">
                    </option>
                </select>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="diaMachineFailureEdit_submit"
                    id="diaMachineFailureEdit_submit">提交
            </button>
        </div>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/dialysis/diaMachineFailureEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>