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
<style>
    .notice-img-box {
        margin: 3px;
    }
    .notice-img-box button {
        vertical-align: top;
    }
    .notice-img-box .notice-img-show {
        display: inline-block;
        margin-left: 10px;
        width: 184px;
    }
    .layui-upload-item.with-img {
        margin: 0;
        width: 100%;
        height: 100%;
    }
</style>
<body ms-controller="bacNoticeEdit">
<div class="layui-form" lay-filter="bacNoticeEdit_form" id="bacNoticeEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">ID</label>
        <input type="hidden" name="noticeId" autocomplete="off" class="layui-input">
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>公告主题：</label>
                <input type="text" name="noticeName" maxlength="20" lay-verify="required" autocomplete="off"
                       class="layui-input">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label class="layui-form-label">备注：</label>
                <textarea name="remarks" rows="2" id="remarks" maxlength="100"
                          autocomplete="off"></textarea>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span"></span>封面图片：</label>
                    <button type="button" class="layui-btn" id="uploadImage"
                            :visible="@baseFuncInfo.authorityTag('bacNotice#uploadImage')"
                            style="margin-left: 8px;background-color: rgb(118, 192, 187)"
                    >上传图片
                    </button>
                    <input type="hidden" name="imageSrc" id="image"/>
                    <input type="hidden" name="fileTitle" id="fileTitle"/>
                    <input type="hidden" name="mimeType" id="mimeType"/>
                    <div class="" id="fileShowDiv" style="padding-left: 15px; width: 140px"></div>
                </div>
            </div>
        </div>
<#--        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">-->
<#--            <div class="disui-form-flex">-->
<#--                <label class="layui-form-label">封面图片：</label>-->
<#--                <div class="notice-img-box">-->
<#--                    <button type="button" class="layui-btn layui-btn-sm layui-btn-dismain" id="uploadImage"-->
<#--                            :visible="@baseFuncInfo.authorityTag('bacNotice#uploadImage')">-->
<#--                        上传图片-->
<#--                    </button>-->
<#--                    <div class="notice-img-show" id="showImgDiv" style="height: 120px">-->
<#--&lt;#&ndash;                        <img id="showImg" style="width: 100%;height: 100%"/>&ndash;&gt;-->
<#--                    </div>-->
<#--                    <input type="hidden" name="imageSrc" id="image"/>-->
<#--                    <input type="hidden" name="fileTitle" id="fileTitle"/>-->
<#--                    <input type="hidden" name="mimeType" id="mimeType"/>-->
<#--                </div>-->
<#--            </div>-->
<#--        </div>-->
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" style="padding: 10px 0 0 20px;">
        <textarea class="layui-edit" id="noticeContent" name="noticeContent"
                  style="width: 60%" maxlength="2000"></textarea>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="bacNoticeEdit_submit" id="bacNoticeEdit_submit">提交</button>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacNoticeEdit.js?t=${currentTimeMillis}"></script>
<script type="text/javascript" src="${ctxsta}/static/layuiadmin/layui/lay/modules/ace/ace.js"></script>
</body>
</html>
