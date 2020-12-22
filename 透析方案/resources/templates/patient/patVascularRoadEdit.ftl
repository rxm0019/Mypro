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
        .span-class{
            float: left;
            line-height: 38px;
            margin-left: 5px;
        }
    </style>
</head>
<body ms-controller="patVascularRoadEdit">
<div class="layui-form" lay-filter="patVascularRoadEdit_form" id="patVascularRoadEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3 layui-hide">
            <label>ID</label>
            <div class="disui-form-flex">
                <input type="hidden" name="vascularRoadId" autocomplete="off" >
                <input type="hidden" name="patientId">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex " >
                <label><span class="edit-verify-span">*</span>通路类型：</label>
                <select name="vascularRoadType" :attr="@disabled" lay-verify="required" lay-filter="vascularRoadType">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('ChannelType')"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex " >
                <label>通路部位：</label>
                <select name="vascularRoadPlace" :attr="@disabled" id="vascularRoadPlace">
                    <option value=""></option>
<#--                    <option  ms-attr="{value:el.value}" ms-text="@el.name"-->
<#--                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('ChannelPlace')"></option>-->
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label>建立时间：</label>
                <input type="text" name="establishedDate" id="establishedDate" readonly placeholder="yyyy-MM-dd" autocomplete="off" :attr="@disabled">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label>建立地点：</label>
                <input type="text" name="establishedPlace" maxlength="100"  autocomplete="off" :attr="@readonly" placeholder="请输入建立地点" :attr="@readonly">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label>启用时间：</label>
                <input type="text" name="activationTime" id="activationTime" placeholder="yyyy-MM-dd" readonly autocomplete="off" :attr="@disabled">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex " >
                <label><span class="edit-verify-span">*</span>使用状态：</label>
                <select name="dataStatus" :attr="@disabled" lay-verify="required" lay-filter="dataStatus">
                    <option value="0">在用</option>
                    <option value="1">停用</option>
<#--                    <option  ms-attr="{value:el.value}" ms-text="@el.name"-->
<#--                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('ChannelStatus')"></option>-->
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label>累加使用：</label>
                <input type="text" name="serviceLife" id="serviceLife" maxlength="5" lay-verify="validateDay" autocomplete="off" :attr="@readonly">
                <span class="span-class">天</span>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3" id="disabledReasonDiv">
            <div class="disui-form-flex " >
                <label><span class="edit-verify-span">*</span>停用原因：</label>
                <select name="disabledReason" id="disabledReason" :attr="@disabled">
                    <option value=""></option>
<#--                    <option  ms-attr="{value:el.value}" ms-text="@el.name"-->
<#--                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('ChannelDisabledReason')"></option>-->
                </select>
            </div>
        </div>

        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex" >
                <label>备注：</label>
                <textarea rows="5" name="remarks" maxlength="21845" :attr="@readonly"></textarea>
            </div>
        </div>


        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="patVascularRoadEdit_submit" id="patVascularRoadEdit_submit">提交</button>
        </div>

    </div>

</div>
<script type="text/javascript" src="${ctxsta}/static/js/patient/patVascularRoadEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>