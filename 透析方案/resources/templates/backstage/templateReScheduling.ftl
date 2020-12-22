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
<body ms-controller="templateReScheduling">
<div class="layui-card-body">
    <div class="layui-form" lay-filter="templateReScheduling_form" id="templateReScheduling_form" style="padding: 10px;">
        <div class="layui-row layui-col-space1 demo-list">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <label style="color: red;width: auto;text-align: left;flex: auto">
                        重新排班将会覆盖下方所选的未来三周数据，请谨慎操作，是否继续?</label>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <div class="layui-input-block">
                        <input type="radio" name="dataNext" value="0" title="本周" >
                        <input type="radio" name="dataNext" value="1" title="下一周" checked>
                    </div>
                </div>
            </div>
            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="templateReScheduling_submit" id="templateReScheduling_submit">提交</button>
        </div>
    </div>
</div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/backstage/templateReScheduling.js?t=${currentTimeMillis}"></script>
</body>
</html>