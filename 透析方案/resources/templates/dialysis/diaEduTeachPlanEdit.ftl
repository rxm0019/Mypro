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
<body ms-controller="diaEduTeachPlanEdit">
<div class="layui-card-body">
    <div class="layui-form" lay-filter="diaEduTeachPlanEdit_form" id="diaEduTeachPlanEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-row">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">教育类型：</label>
                    <select name="eduBaseType" class="select" lay-filter="eduBaseType"
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode(dictType.EducationType)"></option>
                    </select>
                </div>
            </div>
            <div class="layui-row">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">主题类型：</label>
                    <select name="themeType"  class="select" lay-filter="themeType"></select>
                </div>
            </div>
            <div class="layui-row">
                <div class="disui-form-flex" >
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>教育主题：</label>
                    <select name="eduBaseId" class="select" lay-filter="eduBaseId" lay-verify="required"></select>
                </div>
            </div>
            <div class="layui-row">
                <div class="disui-form-flex" >
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>教育方式：</label>
                    <select name="teachMethod" class="select" lay-verify="required">
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode(dictType.EducationMethod)"></option>
                    </select>
                </div>
            </div>
            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="diaEduTeachPlanEdit_submit" id="diaEduTeachPlanEdit_submit">提交</button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaEduTeachPlanEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>