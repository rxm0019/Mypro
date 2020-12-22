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
<body ms-controller="bacWeixinPushEdit">
<div class="layui-form" lay-filter="bacWeixinPushEdit_form" id="bacWeixinPushEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-row" ms-if="pushType === pushModule.HEALTHEDUCATION">
            <div class="disui-form-flex" >
                <label class="layui-form-label">患者类型：</label>
                <div class="layui-input-block">
                    <input type="radio" name="sustainType" lay-filter="sustainType" value="" title="全部" checked>
                    <input type="radio" name="sustainType" lay-filter="sustainType" value="0" title="新患者">
                    <input type="radio" name="sustainType" lay-filter="sustainType" value="1" title="维持性患者">
                </div>
            </div>
        </div>
        <div class="layui-row">
            <div class="disui-form-flex" >
                <label class="layui-form-label"><span class="edit-verify-span">*</span>患者姓名：</label>
                <select name="patientId" id="patientId" class="select" lay-filter="patientId" lay-verify="required" xm-select="patientId" xm-select-search="" xm-select-search-type="dl" xm-select-height="36px">
                </select>
            </div>
        </div>
        <div class="layui-row" ms-if="pushType === pushModule.HEALTHEDUCATION">
            <div class="disui-form-flex" >
                <label class="layui-form-label"><span class="edit-verify-span">*</span>教育主题：</label>
                <select name="eduBaseId" id="eduBaseId" class="select" lay-filter="eduBaseId">
                    <option ms-attr="{value: el.eduBaseId}" ms-text="@el.eduBaseName" ms-for="($index, el) in @healthThemeList"></option>
                </select>
            </div>
        </div>
        <div class="layui-row" ms-if="pushType === pushModule.PATIENTSCHEDUL">
            <div class="disui-form-flex" >
                <label class="layui-form-label"><span class="edit-verify-span">*</span>排班日期：</label>
                <input type="text" name="dateStart" lay-verify="required" id="dateStart" autocomplete="off" readonly>
                <span style="float: left;line-height: 38px;margin: 0 5px;"> - </span>
                <input type="text" name="dateEnd" lay-verify="required" id="dateEnd" autocomplete="off" readonly>
            </div>
        </div>
        <div class="layui-row" ms-if="pushType === pushModule.NOTICE">
            <div class="disui-form-flex" >
                <label class="layui-form-label"><span class="edit-verify-span">*</span>公告主题：</label>
                <select name="noticeId" id="noticeId" class="select" lay-filter="noticeId">
                    <option ms-attr="{value: el.noticeId}" ms-text="@el.noticeName" ms-for="($index, el) in @noticeList"></option>
                </select>
            </div>
        </div>
        <div class="layui-row">
            <div class="disui-form-flex" >
                <label class="layui-form-label"></label>
                <button class="layui-btn layui-btn-dismain" style="width: 100%;" onclick="previewTheme()">预览</button>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="bacWeixinPushEdit_submit" id="bacWeixinPushEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacWeixinPushEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>