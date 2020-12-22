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
    .layui-form-checked span, .layui-form-checked:hover span {
        background-color: rgb(114,192,187) !important;
    }
</style>
</head>
<body ms-controller="basBednumberEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="basBednumberEdit_form" id="basBednumberEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2 layui-hide">
                <div class="disui-form-flex " >
                    <label>ID</label>
                    <input type="hidden" name="bedNumberId" placeholder="请输入" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2 layui-hide">
                <div class="disui-form-flex " >
                    <input type="hidden" name="hospitalNo" placeholder="请输入" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>床号：</label>
                    <input type="text" name="bedNo" maxlength="10" lay-verify="required" autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>病区名称：</label>
                    <select name="wardSettingId" lay-filter="wardId" id="wardSettingId" :attr="@disabled" lay-verify="required" >
                        <option value=""></option>
                        <option  ms-attr="{value:el.wardSettingId}" ms-text="@el.wardName"
                                 ms-for="($index, el) in wardList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>区域名称：</label>
                    <select name="regionSettingId" lay-filter="regionId" :attr="@disabled" lay-verify="required">
                        <option value=""></option>
                        <option  ms-attr="{value:el.regionSettingId}" ms-text="@el.regionName"
                                 ms-for="($index, el) in regionList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>透析机：</label>
                    <select name="codeNo" id="codeNo" lay-filter="codeNo" :attr="@disabled" lay-verify="required">
                        <option value=""></option>
                        <option  ms-attr="{value:el.codeNo}" ms-text="@el.deviceName"
                                 ms-for="($index, el) in deviceList"></option>
                    </select>
                </div>
            </div>
<#--            <div lay-filter="DeviceList_form" id="DeviceList_form"></div>-->
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>品牌型号：</label>
                    <input type="text" name="brand" id="brand" autocomplete="off" readonly>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>治疗特征：</label>
                        <input type="checkbox" name="characteristics" disabled
                               ms-attr="{value:el.value,title:el.name}"
                               ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('DialysisMode')">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>感染特征：</label>
                        <input type="checkbox" name="infectionMark" disabled
                               ms-attr="{value:el.value,title:el.name}"
                               ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('InfectionMark')">
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
            <button class="layui-btn" lay-submit lay-filter="basBednumberEdit_submit" id="basBednumberEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/backstage/basBednumberEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>