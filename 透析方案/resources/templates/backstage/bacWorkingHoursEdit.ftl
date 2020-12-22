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
<body ms-controller="bacWorkingHoursEdit">
<div class="layui-card-body">
    <div class="layui-row demo-list" >
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" style="padding: 10px;border-bottom: 1px solid rgb(246, 246, 246);">
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">年度：</label>
                    <input type="text" name="workingYear" id="workingYear" placeholder="yyyy" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3" style="padding-left: 20px">
                <div class="disui-form-flex" >
                    <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach" onclick="search()">   搜 索   </button>
                </div>
            </div>
        </div>
    </div>

<div class="layui-form" lay-filter="bacWorkingHoursEdit_form" id="bacWorkingHoursEdit_form" style="padding: 0px 10px 10px 10px;">
    <div class="layui-row layui-col-space1 demo-list">
        <div class="layui-card-body" style="padding-top: 10px;">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">ID</label>
            <div class="layui-input-inline">
                <input type="hidden" name="workingHoursId" placeholder="请输入" autocomplete="off">
            </div>
        </div>

        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">默认工时：</label>
                    <input type="number" name="defaultHours" min="0" max="465" maxlength="3" lay-verify="hoursNum" autocomplete="off" id="defaultHours">
                </div>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label class="layui-form-label">一月工时：</label>
                <input type="number" name="janHours" min="0" max="465" maxlength="3" lay-verify="hoursNum" autocomplete="off" >
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label class="layui-form-label">二月工时：</label>
                <input type="number" name="febHours" min="0" max="465" maxlength="3" lay-verify="hoursNum" autocomplete="off" >
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label class="layui-form-label">三月工时：</label>
                <input type="number" name="marHours" min="0" max="465" maxlength="3" lay-verify="hoursNum" autocomplete="off" >
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label class="layui-form-label">四月工时：</label>
                <input type="number" name="aprHours" min="0" max="465" maxlength="3" lay-verify="hoursNum" autocomplete="off" >
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label class="layui-form-label">五月工时：</label>
                <input type="number" name="mayHours" min="0" max="465" maxlength="3" lay-verify="hoursNum" autocomplete="off" >
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label class="layui-form-label">六月工时：</label>
                <input type="number" name="junHours" min="0" max="465" maxlength="3" lay-verify="hoursNum" autocomplete="off">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label class="layui-form-label">七月工时：</label>
                <input type="number" name="julHours" min="0" max="465" maxlength="3" lay-verify="hoursNum" autocomplete="off">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label class="layui-form-label">八月工时：</label>
                <input type="number" name="augHours" min="0" max="465" maxlength="3" lay-verify="hoursNum" autocomplete="off">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label class="layui-form-label">九月工时：</label>
                <input type="number" name="septHours" min="0" max="465" maxlength="3" lay-verify="hoursNum" autocomplete="off">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label class="layui-form-label">十月工时：</label>
                <input type="number" name="octHours" min="0" max="465" maxlength="3" lay-verify="hoursNum" autocomplete="off">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label class="layui-form-label">十一月工时：</label>
                <input type="number" name="novHours" min="0" max="465" maxlength="3" lay-verify="hoursNum" autocomplete="off">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label class="layui-form-label">十二月工时：</label>
                <input type="number" name="decHours" min="0" max="465" maxlength="3" lay-verify="hoursNum" autocomplete="off">
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="bacWorkingHoursEdit_submit" id="bacWorkingHoursEdit_submit">提交</button>
        </div>
    </div>
</div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacWorkingHoursEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>