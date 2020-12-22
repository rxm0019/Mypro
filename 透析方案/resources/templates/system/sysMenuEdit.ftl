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
<style>
    .layui-row .disui-form-flex>label {
        flex: 0 0 110px;
    }
</style>
<body ms-controller="sysMenuEdit">
<div class="layui-form layui-row" lay-filter="sysMenuEdit_form" id="sysMenuEdit_form" style="padding: 20px 30px 0 20px;">
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
        <div class="disui-form-flex">
            <label>ID：</label>
            <input type="hidden" name="id" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
        <div class="disui-form-flex">
            <label>parentId：</label>
            <input type="hidden" name="parentId" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <label>上级菜单：</label>
            <input type="text" name="parentName" readonly autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <label><span class="edit-verify-span">*</span>菜单名称：</label>
            <input type="text" name="menuName" maxlength="50" lay-verify="required" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <label><span class="edit-verify-span">*</span>目标地址：</label>
            <input type="text" name="menuUrl" maxlength="255" lay-verify="required" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <label>菜单图标：</label>
            <input type="text" name="menuIcon" maxlength="50" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <label>菜单图标(图片)：</label>
            <input type="text" name="menuImg" maxlength="50" autocomplete="off" class="layui-input">
        </div>
        <div class="disui-form-flex">
            <label></label>
            <div class="layui-form-mid layui-word-aux">（当图标与图片共存时，图片优先显示）</div>
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <label>是否APP可用：</label>
            <div class="layui-input-block">
                <input type="radio" name="menuApp" value="Y" title="是">
                <input type="radio" name="menuApp" value="N" title="否" checked>
            </div>
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <label>状态：</label>
            <div class="layui-input-block">
                <input type="radio" name="dataStatus" value="0" title="启用" checked>
                <input type="radio" name="dataStatus" value="1" title="停用">
            </div>
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <label>备注：</label>
            <textarea name="remark" maxlength="255"></textarea>
        </div>
    </div>
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="sysMenuEdit_submit" id="sysMenuEdit_submit">提交</button>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysMenuEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>
