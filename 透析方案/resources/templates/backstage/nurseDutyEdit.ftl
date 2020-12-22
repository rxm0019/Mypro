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
<body ms-controller="nurseDutyEdit">
<div class="layui-card-body">
    <div class="layui-form" lay-filter="nurseDutyEdit_form" id="nurseDutyEdit_form" style="padding: 20px 50px 0 50px;">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="userId" autocomplete="off" >
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">编辑模式：</label>
                    <div class="layui-input-block">
                        <input type="radio" name="changeType" value="0" title="修改值班" checked lay-filter="changeType">
                        <input type="radio" name="changeType" value="1" title="交换值班" lay-filter="changeType">
                    </div>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">值班日期：</label>
                    <input type="text" name="dutyDate" maxlength="50" autocomplete="off" readonly >
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" id="hideName">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">姓名：</label>
                    <input type="text" name="userName" maxlength="50" autocomplete="off" readonly >
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" id="hideTpl">
                <div class="disui-form-flex" >
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>班种：</label>
                    <select name="classManageId"  class="select" >
                        <option value=""></option>
                        <option  ms-attr="{value:el.classManageId}" ms-text="@el.className"
                                 ms-for="($index, el) in @classManageList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" id="hideBed">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">区组：</label>
                    <select  name="bedId" xm-select="bedId" xm-select-search="" xm-select-search-type="dl" xm-select-height="36px" style="width: inherit;">
                        <option value=""></option>
                        <option  ms-for="($index,el) in @regionSettingList" ms-attr="{value: el.value}">{{el.name}}</option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide" id="hidePer">
                <div class="disui-form-flex" >
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>交换护士：</label>
                    <select name="changeUserId"  class="select" >
                        <option value=""></option>
                        <option  ms-attr="{value:el.id}" ms-text="@el.userName"
                                 ms-for="($index, el) in @sysUserList"></option>
                    </select>
                </div>
            </div>

            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="nurseDutyEdit_submit" id="nurseDutyEdit_submit">提交</button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/backstage/nurseDutyEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>