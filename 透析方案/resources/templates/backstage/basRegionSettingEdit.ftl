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
<body ms-controller="basRegionSettingEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="basRegionSettingEdit_form" id="basRegionSettingEdit_form" style="padding: 20px 30px 0 0;">

        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2 layui-hide">
                <div class="disui-form-flex " >
                    <label>ID</label>
                    <input type="hidden" name="regionSettingId" placeholder="请输入" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2 layui-hide">
                <div class="disui-form-flex " >
                    <input type="hidden" name="hospitalNo" placeholder="请输入" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>病区代码：</label>
                    <select name="wardSettingId" :attr="@disabled" lay-verify="required">
                        <option value=""></option>
                        <option  ms-attr="{value:el.wardSettingId}" ms-text="@el.wardName"
                                 ms-for="($index, el) in wardList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>区域代码：</label>
                    <input type="text" name="regionId" maxlength="10" lay-verify="required" autocomplete="off" :attr="@readonly,@regionIdReadonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>区域名称：</label>
                    <input type="text" name="regionName" maxlength="50" lay-verify="required" autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>排列顺序：</label>
                    <input type="text" name="orderNo" autocomplete="off" maxlength="7" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>状态：</label>
                    <input type="radio" name="dataStatus" ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                           ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('sys_status')">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>备注：</label>
                    <textarea name="remarks" maxlength="10000" class="layui-textarea" :attr="@readonly"></textarea>
                </div>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="basRegionSettingEdit_submit" id="basRegionSettingEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/backstage/basRegionSettingEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>