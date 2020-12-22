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
        .layui-row .disui-form-flex>label{
            flex-basis: 160px;

        }
        .layui-form-radio{
            padding-right: 0px;
        }
        .layui-form-checkbox {
            margin-top: 10px;
        }
    </style>

</head>
<body ms-controller="bacUnusualReportEdit">
<div class="layui-form" lay-filter="bacUnusualReportEdit_form" id="bacUnusualReportEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3  layui-hide">
            <div class="disui-form-flex">
                <label>ID</label>
                <input type="hidden" name="unusualReportId" placeholder="请输入" autocomplete="off">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>发生日期：</label>
                <input type="text" name="occurDate" lay-verify="required|date" id="occurDate" placeholder="yyyy-MM-dd"
                       autocomplete="off" :attr="@disabled">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>患者信息：</label>
                <#--<input type="text" name="sickId" ms-duplex="sickId" id="sickId" maxlength="35" lay-verify="required"
                       placeholder="病历号" autocomplete="off" :attr="@readonly">
                <input type="text" name="sickNm" ms-duplex="sickNm"  lay-verify="required" autocomplete="off"
                       readonly="true" :attr="@readonly">-->
                <select name="sickId"  xm-select="sickId" xm-select-search="" xm-select-radio="" >
                    <option value="">请输入病历号或姓名</option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>治疗特征：</label>
                <div>
                    <input type="checkbox" id="unusualItem"  name="unusualItem" ms-attr="{value:el.value,title:el.name}"
                           ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('AbnormalEventItem')">
                </div>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>异常事件造成患者伤害：</label>
                <input type="radio"  name="whetherHurt"
                       ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                       ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('YesOrNo')">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>说明：</label>
                <textarea rows="3" name="hurtExplain" maxlength="200" :attr="@readonly"></textarea>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>事情经过：</label>
                <textarea rows="3" name="wholeStory" maxlength="200" :attr="@readonly"></textarea>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex" >
                <label>处理及改善建议：</label>
                <textarea rows="3" name="improve" maxlength="200" :attr="@readonly"></textarea>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>病患结果追踪：</label>
                <textarea rows="3" name="traceResult" maxlength="200" :attr="@readonly"></textarea>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>医师建议事项：</label>
                <textarea rows="3" name="suggestDoctor" maxlength="200" :attr="@readonly"></textarea>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>护士长建议事项：</label>
                <textarea rows="3" name="suggestNurse" maxlength="200" :attr="@readonly"></textarea>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex">
                <label>医师签名：</label>
                <input type="text" id="signatureDoctor" name="signatureDoctor" maxlength="35" autocomplete="off" :attr="@readonly">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex">
                <label>护士长签名：</label>
                <input type="text" id="signatureNurse" name="signatureNurse" maxlength="35" autocomplete="off" :attr="@readonly">
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3 layui-hide">
            <button class="layui-btn" lay-submit lay-filter="bacUnusualReportEdit_submit" id="bacUnusualReportEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/departmentdaily/bacUnusualReportEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>