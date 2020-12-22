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
<style type="text/css">
    .layui-elem-field legend{
        font-size: 14px;
    }
    .layui-upload-img {
        width: 80px;
        height: 80px;
    }
    #uploadImg {
        height: 80px;
        width: 80px;
        background-color: #ffffff;
        border: 2px solid #e6e6e6;
        color: #e6e6e6;
        vertical-align: middle;
        cursor: pointer;
    }
    #uploadImg i {
        font-size: 30px;
    }
</style>
<body ms-controller="fileUpload">
<div class="layui-form" lay-filter="uploadImg_form" style="width: 300px;">
    <fieldset class="layui-elem-field layui-field-title">
        <legend>图片</legend>
    </fieldset>
    <div class="layui-upload" style="padding-left: 15px;">
        <div id="showImgDiv" style="display: inline;"></div>
        <button type="button" id="uploadImg"><i class="layui-icon layui-icon-add-1"></i></button>
    </div>
    <div style="margin-left: 15px; padding-top: 15px; margin-top: 15px; border-top: solid 1px #e6e6e6;">
        <button class="layui-btn layui-btn-dismain" onclick="onSaveUploadImg()">保存</button>
        <div id="showUploadImg"></div>
    </div>
</div>
<div class="layui-form pt-30" lay-filter="uploadImg_form" style="width: 300px;">
    <fieldset class="layui-elem-field layui-field-title">
        <legend>附件</legend>
    </fieldset>
    <div class="layui-upload" style="padding-left: 15px;">
        <button class="layui-btn layui-btn-dismain" id="uploadFile">上传附件</button>
        <div id="showFileDiv"></div>
    </div>
    <div style="margin-left: 15px; padding-top: 15px; margin-top: 15px; border-top: solid 1px #e6e6e6;">
        <button class="layui-btn layui-btn-dismain" onclick="onSaveUploadFile()">保存</button>
        <div id="showUploadFile"></div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/backstage/fileUpload.js?t=${currentTimeMillis}"></script>
</body>
</html>
