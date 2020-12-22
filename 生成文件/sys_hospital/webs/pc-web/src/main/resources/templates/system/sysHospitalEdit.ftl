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
<body ms-controller="sysHospitalEdit">
<div class="layui-form" lay-filter="sysHospitalEdit_form" id="sysHospitalEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">ID</label>
            <div class="layui-input-inline">
                <input type="hidden" name="hospitalId" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>中心/医院名称</label>
            <div class="layui-input-inline">
                <input type="text" name="hospitalName" maxlength="100" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>上级</label>
            <div class="layui-input-inline">
                <input type="text" name="superior" maxlength="7" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>电话</label>
            <div class="layui-input-inline">
                <input type="text" name="tel" maxlength="30" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>地址</label>
            <div class="layui-input-inline">
                <input type="text" name="address" maxlength="500" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>医嘱显示价格:Y:是 =>显示；N:否=>不显示</label>
            <div class="layui-input-inline">
                <input type="text" name="isPrice" maxlength="1" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>是否自动发药:Y:是；N:否</label>
            <div class="layui-input-inline">
                <input type="text" name="isAutomatic" maxlength="1" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>记录透析痕迹是否需要记录:Y:是；N:否</label>
            <div class="layui-input-inline">
                <input type="text" name="isLog" maxlength="1" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>提前警示天数</label>
            <div class="layui-input-inline">
                <input type="text" name="days" lay-verify="required|number" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>启用日期</label>
            <div class="layui-input-inline">
                <input type="text" name="openingDate" lay-verify="required" id="openingDate" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>公众号名称</label>
            <div class="layui-input-inline">
                <input type="text" name="accountsName" maxlength="200" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>公众号appId</label>
            <div class="layui-input-inline">
                <input type="text" name="appid" maxlength="200" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>公众号appSecret</label>
            <div class="layui-input-inline">
                <input type="text" name="secret" maxlength="200" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>公众号token</label>
            <div class="layui-input-inline">
                <input type="text" name="token" maxlength="200" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>公众号aesKey</label>
            <div class="layui-input-inline">
                <input type="text" name="aeskey" maxlength="200" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>备注</label>
            <div class="layui-input-inline">
                <input type="text" name="remark" maxlength="1" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>创建人</label>
            <div class="layui-input-inline">
                <input type="text" name="createBy" maxlength="64" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>创建时间</label>
            <div class="layui-input-inline">
                <input type="text" name="createTime" lay-verify="required" id="createTime" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>更新人</label>
            <div class="layui-input-inline">
                <input type="text" name="updateBy" maxlength="64" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>更新时间</label>
            <div class="layui-input-inline">
                <input type="text" name="updateTime" lay-verify="required" id="updateTime" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>数据状态（0-启用，1-停用，2-删除）</label>
            <div class="layui-input-inline">
                <input type="text" name="dataStatus" maxlength="1" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>数据同步状态（0-未同步，1-已同步）</label>
            <div class="layui-input-inline">
                <input type="text" name="dataSync" maxlength="1" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="sysHospitalEdit_submit" id="sysHospitalEdit_submit">提交</button>
        </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysHospitalEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>