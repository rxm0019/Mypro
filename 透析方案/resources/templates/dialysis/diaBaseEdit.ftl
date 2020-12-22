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
        .layui-tag {
            display: inline-block;
            width: 75px;
            height: 30px;
            line-height: 30px;
            padding: 0 10px;
            white-space: nowrap;
            text-align: center;
            font-size: 14px;
            border-radius: 2px;
            margin: 0 5px 5px 0;
            cursor: pointer;
        }
    </style>
</head>
<body ms-controller="diaBaseEdit">
<div class="layui-form" lay-filter="tagMaintainEdit_form" id="tagMaintainEdit_form" style="padding: 20px;">
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">ID</label>
        <div class="layui-input-inline">
            <input type="hidden" name="diaBaseId" placeholder="请输入" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label style="flex-basis: 50px;text-align: left;">标签：</label>
                <div class="tags" id="tags"
                     style="width: 100%;margin: 0 auto;box-sizing: border-box;padding: 2px;border-radius: 5px;">
                    <input type="text" name="" id="inputTags" readonly autocomplete="off">
                </div>
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1" style="margin-left: 50px;border: grey 1px solid;">
        <div class="layui-col-sm10 layui-col-md10 layui-col-lg10" style="position: relative; min-height: 172px;border-right: 1px solid rgba(83, 100, 113, 0.5);">
            <div style="line-height: 30px">常用标签</div>
            <div class="layui-row layui-col-space1" style="margin-left: 3px;">
                <div class="layui-input-inline" id="patientTagsId">

                </div>
            </div>
            <div class="layui-row layui-col-space1" style="bottom: 5px;width:100%;">
                <div style="border-top:1px dashed #cccccc; height: 10px"></div>
                <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                    <div class="disui-form-flex" style="display: flex; align-items: center">
                        <input type="text" id="customPatientTagsId" maxlength="50" autocomplete="off">
                        <button class="layui-btn layui-btn-sm layui-btn-dismain" onclick="addPatientTags(2)">添加</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
            <div style="line-height: 30px;margin-left: 10px;">标签颜色</div>
            <div class="disui-form-flex">
                <div class="layui-input-inline" id="patientTagsColorId" style="margin-left: 10px;">
                </div>
            </div>
        </div>
    </div>

    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="tagMaintainEdit_submit" id="tagMaintainEdit_submit">提交</button>
    </div>


</div>
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaBaseEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>