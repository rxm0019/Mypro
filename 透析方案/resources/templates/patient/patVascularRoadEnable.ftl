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
<body ms-controller="patVascularRoadEnable">
<div class="layui-form" lay-filter="patVascularRoadEnable_form" id="patVascularRoadEnable_form" style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3 layui-hide">
            <label>ID</label>
            <div class="disui-form-flex">
                <input type="hidden" name="vascularRoadId" autocomplete="off" >
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label><span class="edit-verify-span">*</span>停用原因：</label>
                <select name="disabledReason" lay-verify="required">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('ChannelDisabledReason')"></option>
                </select>
            </div>
        </div>


        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="patVascularRoadEnable_submit" id="patVascularRoadEnable_submit">提交</button>
        </div>

    </div>

</div>
<script type="text/javascript" src="${ctxsta}/static/js/patient/patVascularRoadEnable.js?t=${currentTimeMillis}"></script>
</body>
</html>