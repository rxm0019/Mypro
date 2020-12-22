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
        .layui-row .disui-form-flex>label{
            flex-basis: 120px;
        }
        .layui-layedit {
            border-width: 1px;
            border-style: solid;
            border-radius: 2px;
            width: 100%;
        }
        .layui-upload-item.with-file{
            float: right;
            width: auto;
            margin-right: 30px;
        }
        .layui-upload-item.with-file a {
            width: auto;
        }
        .layui-upload-item .icon-delete {
            margin: 2px 0 0 2px;
        }
    </style>
</head>
<body ms-controller="sysUserManualEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="sysUserManualEdit_form" id="sysUserManualEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="manualId" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" >
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>名称</label>
                    <input type="text" name="manualName" maxlength="100" lay-verify="required"  autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>状态：</label>
                    <input type="radio" name="dataStatus" ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                           ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('sys_status')">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <div class="layui-upload" style="width: 100%;">
                        <input type="hidden" id="fileList" name="fileList" maxlength="1024" autocomplete="off">
                        <div style="width: 16%;float: right">
                            <button :visible="@baseFuncInfo.authorityTag('sysUserManualEdit#uploadAnnex')" type="button" class="layui-btn layui-btn-sm layui-btn-dismain" id="uploadFile" style="float: right">上传附件</button>
                        </div>
                        <div style="width: 80%;float: right">
                            <div style="float: right;width: 100%">
                                <div id="fileShowDiv"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label>内容：</label>
                    <textarea id="remarks" lay-verify="remarks" name="remarks"></textarea>
                </div>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="sysUserManualEdit_submit" id="sysUserManualEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysUserManualEdit.js?t=${currentTimeMillis}"></script>
<script type="text/javascript" src="${ctxsta}/static/layuiadmin/layui/lay/modules/ace/ace.js"></script>
</body>
</html>