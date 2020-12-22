<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <style>
        .layui-unselect dl {
            max-height:220px;
        }
    </style>
</head>
<body ms-controller="bacScheduleDetailEdit">
<div class="layui-card-body">
<div class="layui-form" lay-filter="bacScheduleDetailEdit_form" id="bacScheduleDetailEdit_form" style="padding: 20px 100px 0 100px;">
    <div class="layui-row layui-col-space1 demo-list">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">ID</label>
            <div class="layui-input-inline">
                <input type="hidden" name="detailId" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">患者排班模板主表id</label>
            <div class="layui-input-inline">
                <input type="text" name="scheduleTemplateId"  placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex" >
                <label class="layui-form-label"><span class="edit-verify-span">*</span>患者姓名：</label>
                <select name="patientId" xm-select="patientId" xm-select-height="36px" xm-select-search="" xm-select-radio="" lay-verify="required">
                    <option value=""></option>
                    <option  ms-for="($index,el) in @patientList" ms-attr="{value: el.value}">{{el.name}}</option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex" >
                <label class="layui-form-label">排班日期：</label>
                <input type="text" name="scheduleDate" maxlength="50"  autocomplete="off" ms-duplex="@scheduleDate" readonly >
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex" >
                <label class="layui-form-label"><span class="edit-verify-span">*</span>班次：</label>
                <select name="scheduleShift"  class="select" lay-verify="required">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Shift')"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex" >
                <label class="layui-form-label"><span class="edit-verify-span">*</span>区组：</label>
                <select name="regionId" xm-select="regionId" xm-select-height="36px" xm-select-search="" xm-select-radio="" >
                    <option value=""></option>
                    <option  ms-for="($index,el) in @regionSettingList" ms-attr="{value: el.value}">{{el.name}}</option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex" >
                <label class="layui-form-label"><span class="edit-verify-span">*</span>床号：</label>
                <select name="bedNumberId" xm-select="bedNumberId" xm-select-height="36px" xm-select-search="" xm-select-radio=""  lay-verify="required">
                    <option value=""></option>
                    <option  ms-for="($index,el) in @curBedNumber" ms-attr="{value: el.value}">{{el.name}}</option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex" >
                <label class="layui-form-label"><span class="edit-verify-span">*</span>透析方式：</label>
                <select name="dialysisMode" id="dialysisMode" class="select" lay-verify="required" lay-filter="dialysisMode">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('DialysisMode')"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex" >
                <label class="layui-form-label">透析器：</label>
                <select name="dialyzer"  class="select">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Dialyzer')"></option>
                </select>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="bacScheduleDetailEdit_submit" id="bacScheduleDetailEdit_submit">提交</button>
        </div>
    </div>
</div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacScheduleDetailEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>