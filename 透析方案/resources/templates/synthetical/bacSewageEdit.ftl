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
<style>
    .layui-row .disui-form-flex>label {
        flex: 0 0 110px;
    }
    .layui-elem-field {
        margin: 10px!important;
    }
    .layui-elem-field legend {
        font-size: 14px;
    }
</style>
<body ms-controller="bacSewageEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="bacSewageEdit_form" id="bacSewageEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2 layui-hide">
                <div class="disui-form-flex " >
                    <label>ID</label>
                    <input type="hidden" name="sewageId" placeholder="请输入" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>登记人：</label>
                    <input type="text" name="registerUser" maxlength="50"/>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>污水登记日期：</label>
                    <input type="text" name="registerDate" id="registerDate"/>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>污水登记时间：</label>
                    <select name="registerTime" :attr="@disabled">
                        <option value="上午">上午</option>
                        <option value="下午">下午</option>
                    </select>
                </div>
            </div>
            <fieldset class="layui-elem-field layui-field-title">
                <legend>加药记录</legend>
            </fieldset>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>二氧化氯：</label>
                    <input type="text" name="chlorineDioxide"/>
                    <label>包</label>
                </div>
            </div>
            <fieldset class="layui-elem-field layui-field-title">
                <legend>检测浓度</legend>
            </fieldset>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>PH值：</label>
                    <input type="text" name="ph"/>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>余氯：</label>
                    <input type="text" name="hcio"/>
                    <label>mg/L</label>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>臭氧：</label>
                    <input type="text" name="ozone"/>
                    <label>mg/L</label>
                </div>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="bacSewageEdit_submit" id="bacSewageEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/synthetical/bacSewageEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>