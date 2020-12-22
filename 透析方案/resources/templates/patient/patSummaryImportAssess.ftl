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
    <style>
        .layui-row .disui-form-flex>label {
            flex: 0 0 120px;
        }
        .legend-title .layui-field-title {
            margin: 5px 0 0px;
            border-width: 1px 0 0;
        }
        .legend-title .layui-elem-field legend {
            padding: 0 10px;
            font-size: 14px;
        }
        .form-item-assess-group .layui-input-block {
            margin: 3px;
            line-height: 30px;
        }
        .form-item-assess-group .layui-input-block .layui-form-checkbox {
            min-width: 160px;
        }
    </style>
</head>
<body ms-controller="patSummaryImportAssess">
<div class="layui-fluid">
    <div class="layui-card">
        <!-- 待导入评估组 -->
        <div class="layui-row layui-form" lay-filter="patSummaryImportAssess_form" id="patSummaryImportAssess_form">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 form-item-disinfect-surface">
                <div class="disui-form-flex form-item-assess-group">
                    <label><span class="edit-verify-span">*</span>待导入的评估组：</label>
                    <div class="layui-input-block">
                        <input type="checkbox" name="assessGroup" lay-skin="primary"
                               ms-for="($index, el) in @assessGroupOptions"
                               ms-attr="{value: el.value, title: el.name}">
                    </div>
                </div>
            </div>
        </div>

        <!-- 待导入化验记录 -->
        <div class="legend-title">
            <fieldset class="layui-elem-field layui-field-title">
                <legend><span class="edit-verify-span">*</span>待导入的化验记录（若选中的化验记录中化验值重复，则按最新的申请日期覆盖）</legend>
            </fieldset>
        </div>
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="patSummaryImportAssess_search" lay-filter="patSummaryImportAssess_search">
        </div>
        <div class="layui-card-body">
            <!--table定义-->
            <table id="patSummaryImportAssess_table" lay-filter="patSummaryImportAssess_table"></table>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/patient/patSummaryImportAssess.js?t=${currentTimeMillis}"></script>
</body>
</html>
