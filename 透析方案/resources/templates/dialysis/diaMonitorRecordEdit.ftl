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
    <style type="text/css">
        .layui-row .disui-form-flex > label {
            flex-basis: 120px;

        }

        .layui-row .disui-form-flex > label:last-child {
            flex-basis: 60px;
            text-align: left;
        }
    </style>
</head>
<body ms-controller="diaMonitorRecordEdit">
<div class="layui-form" lay-filter="diaMonitorRecordEdit_form" id="diaMonitorRecordEdit_form"
     style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6 layui-hide">
            <div class="disui-form-flex">
                <label class="layui-form-label">ID</label>
                <input type="hidden" name="monitorRecordId" autocomplete="off">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6 layui-hide">
            <div class="disui-form-flex">
                <label class="layui-form-label">透析记录id</label>
                <input type="text" name="diaRecordId" id="diaRecordId" maxlength="32"
                       autocomplete="off">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>监测时间：</label>
                <input type="text" name="monitorTime" id="monitorTime" lay-verify="fieldRequired" data-field-name="监测时间"
                       placeholder="HH:mm:ss" :attr="@disabled"
                       autocomplete="off">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">血流量：</label>
                <input type="text" name="bloodFlow" lay-verify="fieldNotInRange" data-field-name="血流量"
                       data-min-value="0" data-max-value="10000" data-integer="true" :attr="@readonly" autocomplete="off">
                <label>ml/min</label>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">静脉压：</label>
                <input type="text" name="veinPressure" lay-verify="fieldNotInRange" data-field-name="静脉压"
                       data-min-value="0" data-max-value="200" :attr="@readonly" autocomplete="off">
                <label>mmHg</label>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">动脉压：</label>
                <input type="text" name="arteryPressure" lay-verify="arteryPressure" data-field-name="动脉压"
                       data-min-value="-200" data-max-value="200" :attr="@readonly" autocomplete="off">
                <label>mmHg</label>
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">跨膜压：</label>
                <input type="text" name="transmembrane" lay-verify="fieldNotInRange" data-field-name="跨膜压"
                       data-min-value="0" data-max-value="200" :attr="@readonly" autocomplete="off">
                <label>mmHg</label>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">收缩压：</label>
                <input type="text" name="systolicPressure" lay-verify="fieldNotInRange" data-field-name="收缩压"
                       data-min-value="0" data-max-value="300" data-integer="true" :attr="@readonly" autocomplete="off">
                <label>mmHg</label>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">舒张压：</label>
                <input type="text" name="diastolicPressure" lay-verify="fieldNotInRange" data-field-name="舒张压"
                       data-min-value="0" data-max-value="300" data-integer="true" :attr="@readonly" autocomplete="off">
                <label>mmHg</label>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">脉博：</label>
                <input type="text" name="pulse" lay-verify="fieldNotInRange" data-field-name="脉博" data-min-value="0"
                       data-max-value="300" data-integer="true" :attr="@readonly" autocomplete="off">
                <label>次/分</label>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">R(呼吸)：</label>
                <input type="text" name="respire" lay-verify="fieldNotInRange" data-field-name="R(呼吸)"
                       data-min-value="0" data-max-value="100" data-integer="true" :attr="@readonly" autocomplete="off">
                <label>次/分</label>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">肝素量：</label>
                <input type="text" name="heparinValue" lay-verify="fieldNotInRange" data-field-name="肝素量"
                       data-min-value="0" data-max-value="200" :attr="@readonly" autocomplete="off">
                <label>{{dosageFirstUnit}}/h</label>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">电导度：</label>
                <input type="text" name="conductivity" lay-verify="fieldNotInRange" data-field-name="电导度"
                       data-min-value="0" data-max-value="200" :attr="@readonly" autocomplete="off">
                <label>us/cm</label>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">透析液温度：</label>
                <input type="text" name="dialysateTemperature" lay-verify="fieldNotInRange" data-field-name="透析液温度"
                       data-min-value="35" data-max-value="42" :attr="@readonly"
                       autocomplete="off">
                <label>℃</label>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">置换液累计量：</label>
                <input type="text" name="replacementFluidTotal"
                       lay-verify="fieldNotInRange" data-field-name="置换液累计量" data-min-value="0" data-max-value="100"
                       :attr="@readonly" autocomplete="off">
                <label>L</label>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">累计脱水量：</label>
                <input type="text" name="totalMoreDehydration"
                       lay-verify="fieldNotInRange" data-field-name="累计脱水量" data-min-value="0" data-max-value="200"
                       :attr="@readonly" autocomplete="off">
                <label>L</label>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">脱水速率：</label>
                <input type="text" name="moreDehydrationRate" lay-verify="fieldNotInRange" data-field-name="脱水速率"
                       data-min-value="0" data-max-value="200" :attr="@readonly" autocomplete="off">
                <label>L/H</label>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label class="layui-form-label">管路安全：</label>
                <select name="linkSafe" 　id="linkSafe" lay-filter="linkSafe" :attr="@disabled">
                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('LinkSafe')"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 form-item-position">
            <div class="disui-form-flex">
                <label class="layui-form-label">管路位置：</label>
                <select name="position" id="position" xm-select="position"
                         lay-filter="position">
                    <option value=""></option>
                    <option value="1">A</option>
                    <option value="2">V</option>
                </select>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="diaMonitorRecordEdit_submit"
                    id="diaMonitorRecordEdit_submit">提交
            </button>
        </div>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/dialysis/diaMonitorRecordEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>
