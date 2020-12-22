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
            flex-basis: 120px;

        }
        .layui-form-radio{
            padding-right: 0px;
        }
    </style>

</head>
<body ms-controller="basOtherRelatEdit">
<div class="layui-form" lay-filter="basOtherRelatEdit_form" id="basOtherRelatEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3 layui-hide">
            <label>ID</label>
            <div class="disui-form-flex">
                <input type="hidden" name="otherRelatId" autocomplete="off" >
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label><span class="edit-verify-span">*</span>姓名：</label>
                <input type="text" name="name"  lay-verify="required" maxlength="20"  autocomplete="off" :attr="@readonly">
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label>性别：</label>
                <input type="radio" name="sex" ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                       ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Sex')">
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label>职称：</label>
                <input type="text" name="title" maxlength="30" autocomplete="off" :attr="@readonly">
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex " >
                <label><span class="edit-verify-span">*</span>类别：</label>
                <select name="type" :attr="@disabled" lay-verify="required">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('RelatType')"></option>
                </select>
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label>公司：</label>
                <input type="text" name="company" maxlength="100" autocomplete="off" :attr="@readonly">
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label>电话：</label>
                <input type="text" name="tel" maxlength="30" autocomplete="off" :attr="@readonly">
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label>邮箱：</label>
                <input type="text" name="mail" maxlength="50" autocomplete="off" :attr="@readonly">
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex " >
                <label>状态：</label>
                <input type="radio"  name="dataStatus" ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                       ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('sys_status')">
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
            <button class="layui-btn" lay-submit lay-filter="basOtherRelatEdit_submit" id="basOtherRelatEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/synthetical/basOtherRelatEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>