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
<style type="text/css">
    .layui-elem-field legend{
        font-size: 14px;
    }
    .num-text{
        display: inline-block !important;
        text-align: center !important;
        border-bottom: 1px solid #cccccc;
    }
    .multiple-sign{
        display: inline-block !important;
        text-align: center;
    }
    .span-class{
        float: left;
        line-height: 38px;
        margin-left: 5px;
    }
    .cycle-type .layui-form-radio{
        padding: 0;
        margin: 6px 0 0 0;
        float: left;
    }
    .cycle-type .layui-form-radio:nth-of-type(n+2){
        margin: 6px 0 0 40px;
    }
    .layui-form-checkbox[lay-skin="primary"] span {
        color: #000000;
    }
    .layui-form-item .layui-form-checkbox[lay-skin=primary]{
        margin-left: 20px;
    }
</style>
<body ms-controller="patOrderEdit">
<div class="layui-form" lay-filter="patOrderEdit_form" id="patOrderEdit_form" style="padding: 20px;">
    <div class="layui-hide">
        <div class="layui-input-inline">
            <input type="hidden" name="orderId" autocomplete="off" class="layui-input">
            <input type="hidden" name="parentOrderId" autocomplete="off" class="layui-input">
            <input type="hidden" name="orderDictId" id="orderDictId" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-form-item">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex" >
                <label><span class="edit-verify-span">*</span>下达日期：</label>
                <input type="text" name="establishDate" lay-verify="required" id="establishDate" autocomplete="off" readonly>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex" >
                <label><span class="edit-verify-span">*</span>开嘱医生：</label>
                <select name="establishUserId" id="establishUserId"  lay-verify="required">
                    <option value=""></option>
                    <option ms-attr="{value:el.id}" ms-text="@el.userName"
                            ms-for="($index, el) in doctors"></option>
                </select>
            </div>
        </div>
    </div>
    <fieldset class="layui-elem-field layui-field-title">
        <legend>医嘱内容</legend>
    </fieldset>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex" >
                <label>医嘱类别：</label>
                <select name="orderType" id="orderType" lay-filter="orderType">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('OrderType')"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" id="orderSubTypeDiv">
            <div class="disui-form-flex" >
                <label>药疗分类：</label>
                <select name="orderSubType" id="orderSubType" lay-filter="orderSubType" lay-filter="orderSubType">

                </select>
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex" ms-if="!textShow">
                <label><span class="edit-verify-span">*</span>医嘱内容：</label>
                <input type="text" name="orderContent" id="orderContentInput" maxlength="200" autocomplete="off">
            </div>
            <div class="disui-form-flex" ms-if="textShow">
                <label><span class="edit-verify-span">*</span>医嘱内容：</label>
                <select name="orderContent" id="orderContent" lay-search lay-filter="orderContent"></select>
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
            <div class="disui-form-flex">
                <label>规格：</label>
                <input type="text" name="specifications" id="specifications" maxlength="50" autocomplete="off" :attr="@readonly">
            </div>
        </div>
        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
            <div class="disui-form-flex">
                <label>单位：</label>
                <input type="text" name="basicUnit" id="basicUnit" maxlength="50" autocomplete="off" :attr="@readonly">
            </div>
        </div>
        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4" id="stockCountDiv" ms-if="textShow">
            <div class="disui-form-flex">
                <label style="color: #ff0000;">库存：</label>
                <input type="text" name="stockCount" id="stockCount" maxlength="50" autocomplete="off" readonly style="border: none;color: #ff0000;">
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>厂家：</label>
                <input type="text" name="manufactor" id="manufactor" maxlength="100" autocomplete="off" :attr="@readonly">
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex" ms-if="showPrice">
                <label>价格：</label>
                <input type="text" name="salesPrice" id="salesPrice" readonly style="border: none;" maxlength="" autocomplete="off">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" ms-if="showAsterisk">
            <div class="disui-form-flex" style="display: inline-block; text-align: right;">
                <input type="checkbox" name="customEdit" id="customEdit" lay-filter="customEdit" lay-skin="primary" title="自定义编辑">
            </div>
        </div>
    </div>
    <fieldset class="layui-elem-field layui-field-title">
        <legend>使用途径及总量</legend>
    </fieldset>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm2 layui-col-md2 layui-col-lg2" ms-if="showOthers">
            <div class="disui-form-flex num-text">
                <span><span class="edit-verify-span" ms-if="showAsterisk">*</span>单次剂量</span>
            </div>
        </div>
        <div class="layui-col-sm1 layui-col-md1 layui-col-lg1" ms-if="showOthers">
            <div class="disui-form-flex multiple-sign">
                <span>X</span>
            </div>
        </div>
        <div class="layui-col-sm2 layui-col-md2 layui-col-lg2" ms-if="showOthers">
            <div class="disui-form-flex num-text">
                <span><span class="edit-verify-span" ms-if="showAsterisk">*</span>频率</span>
            </div>
        </div>
        <div class="layui-col-sm1 layui-col-md1 layui-col-lg1" ms-if="showOthers">
            <div class="disui-form-flex multiple-sign">
                <span>X</span>
            </div>
        </div>
        <div class="layui-col-sm2 layui-col-md2 layui-col-lg2" ms-if="showOthers">
            <div class="disui-form-flex num-text">
                <span><span class="edit-verify-span" ms-if="showAsterisk">*</span>天数</span>
            </div>
        </div>
        <div class="layui-col-sm1 layui-col-md1 layui-col-lg1" ms-if="showOthers">
            <div class="disui-form-flex multiple-sign">
                <span>=</span>
            </div>
        </div>
        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
            <div class="disui-form-flex num-text">
                <span><span class="edit-verify-span" ms-if="showAsterisk">*</span>总量</span>
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm2 layui-col-md2 layui-col-lg2" ms-if="showOthers">
            <div class="disui-form-flex">
                <input type="text" name="dosage" id="dosage" lay-verify="required|number" maxlength="5">
                <span class="span-class unit">{{basicUnit}}</span>
            </div>
        </div>
        <div class="layui-col-sm1 layui-col-md1 layui-col-lg1" ms-if="showOthers">
            <div class="disui-form-flex multiple-sign">
            </div>
        </div>
        <div class="layui-col-sm2 layui-col-md2 layui-col-lg2" ms-if="showOthers">
            <div class="disui-form-flex">
                <select name="frequency" id="frequency" lay-verify="required" lay-filter="frequency" :attr="@subDisabled"></select>
            </div>
        </div>
        <div class="layui-col-sm1 layui-col-md1 layui-col-lg1" ms-if="showOthers">
            <div class="disui-form-flex multiple-sign">
                <span></span>
            </div>
        </div>
        <div class="layui-col-sm2 layui-col-md2 layui-col-lg2" ms-if="showOthers">
            <div class="disui-form-flex">
                <input type="text" name="usageDays" lay-verify="required|validateDay" maxlength="3" id="usageDays" :attr="@subDisabled">
            </div>
        </div>
        <div class="layui-col-sm1 layui-col-md1 layui-col-lg1" ms-if="showOthers">
            <div class="disui-form-flex multiple-sign">
                <span></span>
            </div>
        </div>
        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
            <div class="disui-form-flex">
                <input type="text" name="totalDosage" lay-verify="required" id="totalDosage" ms-attr="{value:@totalDosage}" readonly>
                <span class="span-class unit">{{basicUnit}}</span>
                <span class="span-class" id="takeTotal" style="margin-left: 10px">{{takeTotal}}</span>
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span" id="channelAsterisk" ms-if="showAsterisk">*</span>途径：</label>
                <select name="channel" id="channel" :attr="@disabled">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Route')"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" id="testTypeDiv">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>检验类型：</label>
                <select name="testType" id="testType">
                </select>
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>备注：</label>
                <textarea rows="3" name="remarks" maxlength="21845"></textarea>
            </div>
        </div>
    </div>
    <fieldset class="layui-elem-field layui-field-title" ms-if="subShow">
        <legend>使用周期</legend>
    </fieldset>
    <div class="layui-row layui-col-space1" ms-if="subShow">
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex" >
                <label><span class="edit-verify-span">*</span>开始日期：</label>
                <input type="text" name="startDate" lay-verify="required" id="startDate" autocomplete="off" readonly>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex" >
                <label>结束日期：</label>
                <input type="text" name="endDate" id="endDate" autocomplete="off" readonly>
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1" ms-if="subShow">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex" >
                <label><span class="edit-verify-span">*</span>循环周期：</label>
                <div class="layui-input-block cycle-type">
                    <input type="radio" name="cycleType" value="0" lay-filter="cycleType" id="everyTime" title="每次透析" checked="">
                    <input type="radio" name="cycleType" value="1" lay-filter="cycleType" id="fixedDate" title="固定日期" style="margin-left: 20px;">
                    <input type="radio" name="cycleType" value="2" lay-filter="cycleType" id="everyOther">
                    <label for="everyOther" style="float: left;line-height: 38px;">每隔
                        <input type="text" name="cycleEveryTimes" maxlength="2" id="cycleEveryTimes" style="flex: 1 10 0px;width: 40px;padding-left: 10px;border: solid 0.5px rgba(83, 100, 113,0.5);border-radius: 6px;background-color: #FFFFFF;margin: 3px;min-height: 30px;" :attr="@cycleEveryTimesReadonly">
                        次</label>
                </div>
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1" style="border: 1px solid #cccccc;margin-left: 20px;padding-bottom: 10px;border-radius: 8px;" ms-if="showCycleWeekDiv">
        <div class="layui-col-sm8 layui-col-md8 layui-col-lg8">
            <div class="disui-form-flex multiple-sign">
                <input type="radio" name="cycleWeekType" value="0" title="每周" checked="">
                <input type="radio" name="cycleWeekType" value="1" title="单周">
                <input type="radio" name="cycleWeekType" value="2" title="双周">
            </div>
        </div>
        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
            <span class="span-class" style="color: #ff0000;">今天是第<span>{{agoToday}}</span>周</span>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex multiple-sign">
                <input type="checkbox" name="cycleWeekDays" lay-skin="primary" value="1" title="周一">
                <input type="checkbox" name="cycleWeekDays" lay-skin="primary" value="2" title="周二">
                <input type="checkbox" name="cycleWeekDays" lay-skin="primary" value="3" title="周三">
                <input type="checkbox" name="cycleWeekDays" lay-skin="primary" value="4" title="周四">
                <input type="checkbox" name="cycleWeekDays" lay-skin="primary" value="5" title="周五">
                <input type="checkbox" name="cycleWeekDays" lay-skin="primary" value="6" title="周六">
                <input type="checkbox" name="cycleWeekDays" lay-skin="primary" value="7" title="周七">
            </div>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="patOrderEdit_submit" id="patOrderEdit_submit">提交</button>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/patient/patOrderEdit.js?t=${currentTimeMillis}"></script>
</div>
</body>
</html>