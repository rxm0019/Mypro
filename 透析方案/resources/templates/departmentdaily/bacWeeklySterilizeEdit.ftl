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
<body ms-controller="bacWeeklySterilizeEdit">
<div class="layui-card-body" style="padding: 10px;">
<div class="layui-form" lay-filter="bacWeeklySterilizeEdit_form" id="bacWeeklySterilizeEdit_form" style="padding: 10px 10px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
            <div class="disui-form-flex " >
                <label>ID</label>
                <input type="hidden" name="weeklySterilizeId"  autocomplete="off" :attr="@readonly" />
            </div>
        </div>

        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex" >
            <label><span class="edit-verify-span">*</span>消毒日期：</label>
            <input type="text" name="sterilizeDate"  id="sterilizeDate"  autocomplete="off" lay-verify="required" :attr="@disabled" >
            </div>
        </div>

        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex" >
            <label><span class="edit-verify-span">*</span>消毒人：</label>
            <input type="text" name="sterilizeUser" maxlength="5"  ms-duplex="sterilizeUser" autocomplete="off" lay-verify="required" :attr="@readonly" >
            </div>
        </div>

        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex " >
            <label>病区：</label>
            <select name="areaSterilize" ms-duplex="areaSterilize" lay-filter="areaSterilize" :attr="@disabled" >
                <option value=""></option>
                <option  ms-attr="{value:el.wardId}" ms-text="@el.wardName"
                         ms-for="($index, el) in @wardList"></option>
            </select>
            </div>
        </div>

        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex " >
                <label>区域：</label>
                <select name="regionSterilize" ms-duplex="regionSterilize" lay-filter="regionSterilize" :attr="@disabled" >
                    <option value=""></option>
                    <option  ms-attr="{value:el.regionId}" ms-text="@el.regionName"
                             ms-for="($index, el) in @regionList"></option>
                </select>
            </div>
        </div>

        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex " >
                <label>消毒机类型：</label>
                <select name="sterilizeType" :attr="@disabled">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('sterilizeDeviceType')"></option>
                </select>
            </div>
        </div>

        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex " >
                <label>消毒方式：</label>
                <select name="sterilizeMethod"  :attr="@disabled">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('sterilizeMethod')"></option>
                </select>
            </div>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="bacWeeklySterilizeEdit_submit" id="bacWeeklySterilizeEdit_submit">提交</button>
    </div>

    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/departmentdaily/bacWeeklySterilizeEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>