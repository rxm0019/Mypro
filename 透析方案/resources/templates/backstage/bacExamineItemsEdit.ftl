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
    .layui-card-body .layui-table {
        margin: 5px 0;
    }
    .layui-table-cell {
        height: 20px;
        line-height: 20px;
        position: relative;
        box-sizing: border-box;
        padding: 0px 3px;
    }
    .layui-table td, .layui-table th {
        min-height: 20px;
        line-height: 20px;
        padding: 1px 1px;
    }
</style>
<body ms-controller="bacExamineItemsEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="bacExamineItemsEdit_form" id="bacExamineItemsEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">ID</label>
            <div class="layui-input-inline">
                <input type="hidden" name="examineItemsId" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-row layui-col-xs6 layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>检验总类：</label>
                    <select name="testMainId" :attr="@disabled" lay-verify="required">
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in testMainList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>检查项编码：</label>
                    <input type="text" name="examineItemsNo" maxlength="50" lay-verify="required" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>检查项名称：</label>
                    <input type="text" name="examineItemsName" maxlength="50" lay-verify="required" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>单位：</label>
                    <select name="unit" :attr="@disabled">
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('ExamineItemUnit')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>检查项类型：</label>
                    <select name="sampleType" lay-verify="required" :attr="@disabled">
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('SampleType')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>当前状态：</label>
                    <input type="radio" name="dataStatus" ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                           ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('sys_status')">
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-xs6 layui-col-space1" style="padding-left: 20px">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" id="bacExamineItemsRList"></div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>类别：</label>
                    <input type="radio" lay-filter="category" name="category" ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                           ms-for="($index, el) in categoryList">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" style="padding-left: 20px" id="bacExamineItemsList"></div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>应用范围：</label>
                    <input type="text" maxlength="200" name="scopeOfApplication">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>备注：</label>
                    <textarea name="remarks" maxlength="10000"></textarea>
                </div>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="bacExamineItemsEdit_submit" id="bacExamineItemsEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacExamineItemsEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>
