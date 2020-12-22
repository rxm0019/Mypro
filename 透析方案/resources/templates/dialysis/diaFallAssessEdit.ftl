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
    <style type="text/css">
        .layui-row .disui-form-flex > label {
            flex-basis: 230px;
        }
    </style>
</head>
<body ms-controller="diaFallAssessEdit">
<div class="layui-form" lay-filter="diaFallAssessEdit_form" id="diaFallAssessEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6 layui-hide">
            <div class="disui-form-flex">
                <label class="layui-form-label">ID</label>

                <input type="hidden" name="fallAssessId" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6 layui-hide">
            <div class="disui-form-flex">
                <label class="layui-form-label">透析记录</label>

                <input type="text" name="diaRecordId" id="diaRecordId" maxlength="35" lay-verify="required" autocomplete="off"
                       class="layui-input">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">病人曾跌倒(3个月)/视觉障碍：</label>
                <select name="visionHinder"
                        lay-filter="visionHinder">
                    <option value=""></option>
                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('VisionHinder')"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">超过一个医学诊断：</label>
                <select name="diagnosisMore"
                        lay-filter="diagnosisMore">
                    <option value=""></option>
                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('DiagnosisMore')"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">使用助行器具：</label>
                <select name="assistWalk"
                        lay-filter="assistWalk">
                    <option value=""></option>
                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('AssistWalk')"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">步态：</label>
                <select name="gait"
                        lay-filter="gait">
                    <option value=""></option>
                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Gait')"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">精神状态：</label>
                <select name="mentality"
                        lay-filter="mentality">
                    <option value=""></option>
                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('MentalState')"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">使用药物治疗：</label>
                <select name="medication"
                        lay-filter="medication">
                    <option value=""></option>
                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Medication')"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">跌倒评估总分：</label>
                <label>{{fraction}}</label>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>评估人：</label>
                <select name="assessor" id="assessor" class="select" lay-verify="required">
                    <option value=""></option>
                    <option ms-attr="{value:el.id}" ms-text="@el.userName"
                            ms-for="($index, el) in makerName"></option>
                </select>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="diaFallAssessEdit_submit" id="diaFallAssessEdit_submit">
                提交
            </button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaFallAssessEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>