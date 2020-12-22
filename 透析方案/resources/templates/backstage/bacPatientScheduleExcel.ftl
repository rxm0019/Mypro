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
<body ms-controller="bacPatientScheduleExcel">
<div class="layui-card-body">
    <div class="layui-form" lay-filter="bacPatientScheduleExcel_form" id="bacPatientScheduleExcel_form" style="padding:0px 50px;">
        <div class="layui-row layui-col-space1 demo-list">

            <div class="layui-row">
                <fieldset class="layui-elem-field layui-field-title">
                    <legend style="font-size: 16px;">排床表</legend>
                </fieldset>
            </div>
            <div class="layui-row">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">日期范围:</label>
                    <input type="text" name="scheduleDate" id="scheduleDate" placeholder="yyyy-MM-dd~yyyy-MM-dd" autocomplete="off" >
                </div>
            </div>
            <div class="layui-row">
                <div class="disui-form-flex">
                    <label class="layui-form-label"> </label>
                    <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach layui-btn layui-btn-dismain"
                            style="margin: 3px;width: 100%;font-size: 16px;" onclick="exportExcel(1)">导出排床表</button>
                </div>
            </div>
            <div class="layui-row">
                <fieldset class="layui-elem-field layui-field-title">
                    <legend style="font-size: 16px;">患者排班表</legend>
                </fieldset>
            </div>

            <div class="layui-row">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">日期范围:</label>
                    <input type="text" name="startDate" lay-verify="required" id="startDate" placeholder="yyyy-MM-dd" autocomplete="off" >
                    <div class="layui-form-mid layui-word-aux" style="margin: 0px;"> - </div>
                    <input type="text" name="endDate" lay-verify="required" id="endDate" placeholder="yyyy-MM-dd" autocomplete="off" >
                </div>
            </div>
            <div class="layui-row">
                <div class="disui-form-flex">
                    <label class="layui-form-label"> </label>
                    <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach layui-btn layui-btn-dismain"
                            style="margin: 3px;width: 100%;font-size: 16px;" onclick="exportExcel(2)">导出患者排班表</button>
                </div>
            </div>

            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="bacPatientScheduleExcel_submit" id="bacPatientScheduleExcel_submit">提交</button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacPatientScheduleExcel.js?t=${currentTimeMillis}"></script>
</body>
</html>