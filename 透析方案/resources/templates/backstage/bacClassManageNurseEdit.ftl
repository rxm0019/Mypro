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
        /* layui 时间选择器 不要秒的选项 */
        .layui-laydate-content>.layui-laydate-list {
            padding-bottom: 0px;
            overflow: hidden;
        }
        .layui-laydate-content>.layui-laydate-list>li{
            width:50%
        }

        .merge-box .scrollbox .merge-list {
            padding-bottom: 5px;
        }
    </style>
</head>
<body ms-controller="bacClassManageNurseEdit">
<div class="layui-card-body">
    <div class="layui-form" lay-filter="bacClassManageNurseEdit_form" id="bacClassManageNurseEdit_form" style="padding: 20px 50px 0 50px;">
        <div class="layui-row layui-col-space1 demo-list">
            <div class="layui-form-item  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="classManageId"  autocomplete="off" >
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>班种名称：</label>
                    <input type="text" name="className" maxlength="50"   autocomplete="off"  >
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>班种属性：</label>
                    <select name="classAttr" id="classAttr"  class="select" lay-filter="classAttr">
                        <option value="1">出勤</option>
                        <option value="2">休息</option>
                        <option value="3">加班</option>
                        <option value="0">缺勤</option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" id="partTime">
                <div class="disui-form-flex" >
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>时段：</label>
                    <input type="text" name="classPart" id="classPart" lay-verify-msg="请选择时段" lay-verify="required" placeholder="HH:mm"  autocomplete="off"  >
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">工时/小时：</label>
                    <input type="text" name="classWorked" readonly autocomplete="off" ms-duplex="@classWorked" >
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">备注：</label>
                    <textarea name="remarks" maxlength="500" style="margin: 3px;min-height: 100px;" class="layui-textarea"></textarea>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">状态：</label>
                    <div class="layui-input-block">
                        <input type="radio" name="dataStatus" value="0" title="启用" checked>
                        <input type="radio" name="dataStatus" value="1" title="禁用">
                    </div>
                </div>
            </div>
            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="bacClassManageNurseEdit_submit" id="bacClassManageNurseEdit_submit">提交</button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacClassManageNurseEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>