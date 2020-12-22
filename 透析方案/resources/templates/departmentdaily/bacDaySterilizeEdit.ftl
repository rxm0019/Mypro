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
<body ms-controller="bacDaySterilizeEdit">
<div class="layui-card-body" style="padding: 10px;">
<div class="layui-form" lay-filter="bacDaySterilizeEdit_form" id="bacDaySterilizeEdit_form" style="padding: 10px 10px 0 0;">

    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
            <div class="disui-form-flex " >
                <label>ID</label>
                <input type="hidden" name="daySterilizeId"  autocomplete="off" />
            </div>
        </div>

        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex " >
                <label><span class="edit-verify-span">*</span>类型：</label>
                <select name="areaSterilize" ms-duplex="areaSterilizeSelected" lay-filter="areaSterilize" :attr="@disabled">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @areaSterilizeSelect"></option>
                </select>
            </div>
        </div>


        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex " >
                <label><span class="edit-verify-span">*</span>名称：</label>
                <select name="areaName" ms-duplex="areaNameSelected" lay-filter="areaName" :attr="@disabled">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @areaNameSelect"></option>
                </select>
            </div>
        </div>

        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex " >
                <label>描述：</label>
                <textarea name="described" ms-duplex="described" maxlength="500"  :attr="@readonly"></textarea>
            </div>
        </div>

        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex " >
                <label><span class="edit-verify-span">*</span>消毒方式：</label>
                <select name="sterilizeMethod" lay-verify="required" :attr="@disabled">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('sterilizeMethod')"></option>
                </select>
            </div>
        </div>

        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex " >
                <label>消毒人：</label>
                <input type="text" name="sterilizeUser" ms-duplex="sterilizeUser" maxlength="5"  autocomplete="off" :attr="@readonly">
            </div>
        </div>

        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex " >
                <label>消毒日期：</label>
                <input type="text" name="sterilizeDate" id="sterilizeDate" autocomplete="off" :attr="@disabled">
            </div>
        </div>
    </div>

        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="bacDaySterilizeEdit_submit" id="bacDaySterilizeEdit_submit">提交</button>
        </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/departmentdaily/bacDaySterilizeEdit.js?t=${currentTimeMillis}"></script>
</div>
</body>
</html>