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
</style>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="disinfectionRecord">
<div class="layui-form">
    <div class="layui-card">
        <div class="order-layout-header">
            <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form">
                <div class="layui-form-item condition-box">
                    <div class="layui-inline" style="width:300px;">
                        <label class="layui-form-label">开始日期：</label>
                        <div class="layui-input-inline">
                            <input type="text" id="sterilizeDate_begin" readonly placeholder="yyyy-MM-dd"
                                   class="layui-input">
                        </div>
                    </div>
                    <div class="layui-inline" style="width:300px;">
                        <label class="layui-form-label">结束日期：</label>
                        <div class="layui-input-inline">

                            <input type="text" id="sterilizeDate_end" readonly placeholder="yyyy-MM-dd" class="layui-input">
                        </div>
                    </div>

                    <div class="layui-inline" style="width:300px;">
                        <div class="disui-form-flex">
                            <label class="layui-form-label">区名：</label>
                            <div class="layui-input-inline">
                                <select id="regionId" name="regionId" lay-filter="regionId">
                                    <option value="" >全部</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="layui-inline">
                        <div class="disui-form-flex">
                            <button
                                    class="layui-btn layui-btn-dis-xs layui-btn-dis-seach" style="margin-left: 5px;" onclick="searchOrder()">搜索
                            </button>
                            <button :visible="@baseFuncInfo.authorityTag('patReport#exportDisinfectionAir')||@baseFuncInfo.authorityTag('patReport#exportDisinfectionMachine')||@baseFuncInfo.authorityTag('patReport#exportDisinfectionRay')"
                                    class="layui-btn layui-btn-dis-xs layui-btn-dissub" onclick="onExportExcel()">导出</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-card">
            <div class="layui-tab" lay-filter="disinfectionRecordTab">
                <ul class="layui-tab-title">
                    <li lay-id="disinfectionMachine">透析机消毒</li>
                    <li lay-id="disinfectionAir">空气消毒</li>
                    <li lay-id="disinfectionRay">紫外线消毒</li>
                </ul>
                <div class="layui-tab-content">
                    <#--                  透析机消毒-->
                    <div class="layui-tab-item" layui-show>
                        <table id="disinfectionMachine_table" lay-filter="disinfectionMachine_table"></table>
                    </div>
                    <#--                空气消毒-->
                    <div class="layui-tab-item" layui-show>
                        <table id="disinfectionAir_table" lay-filter="disinfectionAir_table"></table>
                    </div>
                    <#--                    紫外线消毒-->
                    <div class="layui-tab-item" layui-show>
                        <table id="disinfectionRay_table" lay-filter="disinfectionRay_table"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/report/disinfectionRecord.js?t=${currentTimeMillis}"></script>
<!--覆盖表格样式，由于表格样式优先级较高，所以放在底部-->
<style>
    [data-field="bacDevices"] > .layui-table-cell{
        margin: 0;
        padding: 0;
        height: unset;
    }
</style>
</body>
</html>