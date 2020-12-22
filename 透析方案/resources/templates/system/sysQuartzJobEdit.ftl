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
        .span-style {
            float: left;
            margin-left: 3px;
            line-height: 38px;
        }

        .layui-row .disui-form-flex>label{
            flex-basis: 105px;
        }

        .layui-form-checkbox[lay-skin="primary"] span {
            color: #000000;
        }
    </style>
</head>
<body ms-controller="sysQuartzJobEdit">
<div class="layui-form" lay-filter="sysQuartzJobEdit_form" id="sysQuartzJobEdit_form" style="padding: 20px 30px 0 0;">
    <#--传值ID-->
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">ID</label>
        <div class="layui-input-inline">
            <input type="hidden" name="quartzJobId" placeholder="请输入" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-form-item">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>排程功能名称：</label>
                    <select name="jobName" lay-verify="required" lay-filter="jobName_form" :attr="@jobName">
                        <option value=""></option>
                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('job_class')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm9 layui-col-md9 layui-col-lg9">
                    <div class="disui-form-flex">
                        <label class="layui-form-label"><span class="edit-verify-span">*</span>任务分组：</label>
                        <input type="text" id="jobGroup" name="jobGroup" style="border: none;color: #000000;" lay-skin="primary" disabled>
                    </div>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm9 layui-col-md9 layui-col-lg9">
                    <div class="disui-form-flex">
                        <label class="layui-form-label"><span class="edit-verify-span">*</span>执行类：</label>
                        <input type="text" id="jobClassName" style="border: none;color: #000000;" name="jobClassName" lay-skin="primary" disabled>
                    </div>
                </div>
            </div>
        </div>
        <#--频率调整-->
        <#--每天-->
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex ">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>频率类别：</label>
                    <input type="checkbox" id="checkOne1" lay-filter="everyDay_checked" name="checkOne" value="everyDay"
                           lay-skin="primary" title="每天">
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex">
                    <select name="everyDayHour" id="everyDayHour" :attr="@everyDay">
                        <option value=""></option>
                        <option ms-attr="{value:el}" ms-for="($index, el) in @hours">{{el}}</option>
                    </select>
                    <span class="span-style">时</span>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex ">
                    <select name="everyDayMinute" id="everyDayMinute" :attr="@everyDay">
                        <option value=""></option>
                        <option ms-attr="{value:el}" ms-for="($index, el) in @minutes">{{el}}</option>
                    </select>
                    <span class="span-style">分</span>
                </div>
            </div>
        </div>
        <#--周期-->
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex">
                    <label class="layui-form-label"></label>
                    <input type="checkbox" id="checkOne2" name="checkOne" lay-filter="cycle_checked" value="cycle"
                           lay-skin="primary" title="周期">
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex">
                    <select name="cycleHour" id="cycleHour" :attr="@cycle">
                        <option value=""></option>
                        <option ms-attr="{value:el}" ms-for="($index, el) in @hours">{{el}}</option>
                    </select>
                    <span class="span-style">时</span>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex">
                    <select name="cycleMinute" id="cycleMinute" :attr="@cycle">
                        <option value=""></option>
                        <option ms-attr="{value:el}" ms-for="($index, el) in @cycleMinutes">{{el}}</option>
                    </select>
                    <span class="span-style">分</span>
                </div>
            </div>
        </div>
        <#--每月-->
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex">
                    <label class="layui-form-label"></label>
                    <input type="checkbox" id="checkOne3" name="checkOne" lay-filter="everyMonth_checked"
                           value="everyMonth" lay-skin="primary" title="每月">
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex">
                    <select name="everyMonthDay" id="everyMonthDay" :attr="@everyMonth">
                        <option value=""></option>
                        <option ms-attr="{value:el}" ms-for="($index, el) in @days">{{el}}</option>
                    </select>
                    <span class="span-style">号</span>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex ">
                    <select name="everyMonthHour" id="everyMonthHour" :attr="@everyMonth">
                        <option value=""></option>
                        <option ms-attr="{value:el}" ms-for="($index, el) in @hours">{{el}}</option>
                    </select>
                    <span class="span-style">时</span>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex ">
                    <select name="everyMonthMinute" id="everyMonthMinute" :attr="@everyMonth">
                        <option value=""></option>
                        <option ms-attr="{value:el}" ms-for="($index, el) in @minutes">{{el}}</option>
                    </select>
                    <span class="span-style">分</span>
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>说明：</label>
                    <textarea rows="3" name="description" lay-verify="required" maxlength="65535"
                              :attr="@readonly"></textarea>
                </div>
            </div>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="sysQuartzJobEdit_submit" id="sysQuartzJobEdit_submit">提交
        </button>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysQuartzJobEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>