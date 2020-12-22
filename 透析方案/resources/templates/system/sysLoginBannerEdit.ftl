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
<body ms-controller="sysLoginBannerEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="sysLoginBannerEdit_form" id="sysLoginBannerEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="LoginBannerId"  autocomplete="off" >
                </div>
            </div>

            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <button type="button" id="uploadImg"><i class="layui-icon layui-icon-add-1"></i></button>
                <div class="disui-form-flex">

                    <div class="layui-upload" style="padding-left: 15px; ">
                        <div class="" id="showImgDiv" style="display: inline;"></div>
                        <input type="hidden" id="listPhoto" name="listPhoto" maxlength="1024" autocomplete="off" >

                    </div>
                </div>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="sysLoginBannerEdit_submit" id="sysLoginBannerEdit_submit">提交</button>
        </div>
</div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysLoginBannerEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>