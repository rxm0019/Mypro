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
            flex: 0 0 110px;
        }
        .form-item-handle-details .input-box input {
            z-index: 1;
        }
        .form-item-handle-details .select-box {
            position: absolute;
            left: 0;
        }
        .form-item-handle-details .select-box .xm-select-title {
            display: none;
        }
    </style>
</head>
<body ms-controller="diaUnusualRecordEdit">
<div class="layui-form" lay-filter="diaUnusualRecordEdit_form" id="diaUnusualRecordEdit_form"
     style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2 layui-hide">
            <div class="disui-form-flex">
                <label>ID</label>
                <input type="hidden" name="unusualRecordId">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2 layui-hide">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>透析记录id</label>
                <input type="text" name="diaRecordId" id="diaRecordId" maxlength="35">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2 layui-hide">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>患者Ｉｄ</label>
                <input type="text" name="patientId" id="patientId" maxlength="35">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>监测日期：</label>
                <input type="text" name="monitorTime" id="monitorTime" lay-verify="monitorTimeRequired"
                       placeholder="HH:mm">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>病症及体征：</label>
                <select name="unusualDetails" xm-select="unusualDetails"
                        xm-select-height="36px"
                        xm-select-search=""
                        lay-filter="unusualDetails"
                        lay-verify="unusualDetailsRequired"
                >
                    <option value=""></option>
                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('UnusualDetails')">
                    </option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2 form-item-handle-details">
            <div class="disui-form-flex input-box">
                <label><span class="edit-verify-span">*</span>处理详情：</label>
                <input type="text" name="handleDetails" lay-verify="handleDetailsRequired" maxlength="2000" autocomplete="off">
            </div>
            <div class="disui-form-flex select-box">
                <label></label>
                <select name="handleDetailOptions" xm-select="handleDetailOptions"
                        xm-select-height="36px"
                        xm-select-search=""
                        lay-filter="handleDetailOptions">
                    <option value=""></option>
                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('HandleDetails')">
                    </option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
            <div class="disui-form-flex">
                <label>结果：</label>
                <textarea type="text" name="handleResults" maxlength="2000" autocomplete="off"></textarea>
            </div>
        </div>

        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="diaUnusualRecordEdit_submit"
                    id="diaUnusualRecordEdit_submit">
                提交
            </button>
        </div>
    </div>
</div>

<script type="text/javascript"
        src="${ctxsta}/static/js/dialysis/diaUnusualRecordEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>
