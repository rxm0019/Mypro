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
<body ms-controller="patDialysisBaseRemarkEdit">
<div class="layui-form" lay-filter="patDialysisBaseRemarkEdit_form" id="patDialysisBaseRemarkEdit_form"
     style="padding: 20px 30px 0 0;">
<#--    <div class="layui-form-item  layui-hide">-->
<#--        <label class="layui-form-label">患者ID</label>-->
<#--        <input type="hidden" name="patientId" id="patientId"  autocomplete="off" class="layui-input">-->
<#--    </div>-->
<#--    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4 layui-hide">-->
<#--        <div class="disui-form-flex">-->
<#--            <label><span class="edit-verify-span">*</span>透析总频次：</label>-->
<#--            <select name="dialysisTotalFrequency">-->
<#--                <option value=""></option>-->
<#--                <option ms-attr="{value:el.value}" ms-text="@el.name"-->
<#--                        ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('DialysisFrequency')"></option>-->
<#--            </select>-->
<#--        </div>-->
<#--    </div>-->
<#--    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4 layui-hide">-->
<#--        <div class="disui-form-flex">-->
<#--            <label><img id="iconDryWeightChart" src="/web/static/images/dryweight.png"><span-->
<#--                        class="edit-verify-span">*</span>干体重：</label>-->
<#--            <input type="text" name="dryWeight" >-->
<#--            <label>kg</label>-->
<#--        </div>-->
<#--    </div>-->
<#--    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4 layui-hide">-->
<#--        <div class="disui-form-flex">-->
<#--            <label>附加体重：</label>-->
<#--            <input type="text" name="additionalWeight">-->
<#--            <label>kg</label>-->
<#--        </div>-->
<#--    </div>-->
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
            <div class="disui-form-flex">
                <label class="layui-form-label">调整备注：</label>
                <textarea name="remarks" maxlength="5000"
                          class="layui-textarea"></textarea>
            </div>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="patDialysisBaseRemarkEdit_submit"
                id="patDialysisBaseRemarkEdit_submit">提交
        </button>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/patient/patDialysisBaseRemarkEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>