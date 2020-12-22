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
<body ms-controller="patDocRecordEdit">
<div class="layui-form" lay-filter="patDocRecordEdit_form" id="patDocRecordEdit_form"
     style="padding: 20px 30px 0 0;margin: auto;width: 600px">
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">ID</label>
        <div class="layui-input-inline">
            <input type="hidden" name="recordId" placeholder="请输入" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-row layui-col-space1" style="text-align: center">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>文书名称：</label>
                <input type="text" name="recordName" maxlength="15" autocomplete="off" id="recordName"
                       lay-verify="required">
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span"></span>患者姓名：</label>
                <input type="text" name="patientName" maxlength="20" autocomplete="off" id="patientName"
                       :attr="@disabled">
            </div>
        </div>
    </div>

    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span"></span>病历号：</label>
                <input type="text" name="patientRecordNo" maxlength="50" autocomplete="off" id="patientRecordNo"
                       :attr="@disabled"
                >
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span"></span>签名日期：</label>
                <input type="text" name="signDatetime" maxlength="500" autocomplete="off" id="signDatetime"
                >
                <input type="hidden" name="hospitalId" maxlength="500" autocomplete="off" id="hospitalId"
                >
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>文书：</label>
                <button type="button" class="layui-btn" id="uploadFile"
                        style="margin-left: 8px;background-color: rgb(118, 192, 187)"
                >上传文件
                </button>
                <input type="hidden" name="imageSrc" id="image"/>
                <input type="hidden" name="fileTitle" id="fileTitle"/>
                <input type="hidden" name="mimeType" id="mimeType"/>
                <input type="hidden" name="patientId" id="patientId"/>
                <input type="hidden" name="fileId" id="fileId"/>
                <span style="color: red;padding-top: 10px;padding-left: 10px">(支持图片、PDF)</span>
                <div class="" id="fileShowDiv" style="padding-left: 15px; width: 140px"></div>
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label class="layui-form-label">备注：</label>
                <textarea rows="2" name="remarks" id="remarks" maxlength="100"></textarea>
            </div>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="patDocRecordEdit_submit" id="patDocRecordEdit_submit">提交
        </button>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/patient/patDocRecordEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>