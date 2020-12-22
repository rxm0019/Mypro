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
    <style type="text/css">
        /*.layui-btn-dis-seach {*/
        /*    display: none;*/
        /*}*/
        /*.search-form .layui-form-item .layui-inline .layui-form-label {*/
        /*    display: none;*/
        /*}*/

        /*.layui-row .disui-form-flex > label {*/
        /*    flex-basis: 80px;*/

        /*}*/
    </style>
</head>
<body ms-controller="bacContentTemplateList">
<div class="layui-row" style="margin: 20px;">
    <div class="layui-col-sm5 layui-col-md5 layui-col-lg5">
        <div style="margin-left: 10px;">病史模板</div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <input type="text" id="templateTitle" maxlength="100" placeholder="模板名称">
                <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach" style="width: 50px;"
                        onclick="searchList()">
                    <i class="layui-icon layui-icon-search"></i>
                </button>
            </div>
        </div>
        <div class="layui-row">
            <!--table定义-->
            <table id="bacContentTemplateList_table" lay-filter="bacContentTemplateList_table"></table>
        </div>

    </div>
    <div class="layui-col-sm7 layui-col-md7 layui-col-lg7">
        <div style="width: 120px; margin-left: 30px;" ms-if="isShow"><span class="edit-verify-span">*</span>已选模板</div>
        <div style="width: 120px; margin-left: 30px;" ms-if="!isShow">添加/修改模板</div>
        <div class="layui-form" lay-filter="templateImport_form" id="templateImport_form" style="margin: 10px;">
            <div class="layui-card"
                 style="margin:0 10px 0 0;border: 1px solid rgba(171, 160, 148, 0.37)">
                <div style="margin: 10px;">
                    <div class="layui-row layui-hide">
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                                <label class="layui-form-label">ID</label>
                                <input type="hidden" name="contentTemplateId" placeholder="请输入">
                            </div>
                        </div>
                    </div>
                    <div class="layui-row layui-hide">
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                                <label class="layui-form-label"><span ms-if="!isShow" class="edit-verify-span">*</span>模板类型</label>
                                <input type="text" name="templateType" id="templateType" maxlength="50"
                                       placeholder="请输入">
                            </div>
                        </div>
                    </div>
                    <div class="layui-row">
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                                <label class="layui-form-label"><span ms-if="!isShow" class="edit-verify-span">*</span>模板名称：</label>
                                <input type="text" name="templateTitle" lay-verify="fieldRequired" data-field-name="模板名称" maxlength="100"
                                       placeholder="请输入" :attr="@readonly">
                            </div>
                        </div>
                    </div>
                    <div class="layui-row">
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                                <label class="layui-form-label"><span ms-if="!isShow" class="edit-verify-span">*</span>模板内容：</label>
                                <input type="hidden">
                            </div>
                            <div class="disui-form-flex">
                                    <textarea type="text" name="templateContent" maxlength="5000"
                                              lay-verify="fieldRequired" data-field-name="模板内容" rows="20"
                                              placeholder="请输入" :attr="@readonly">
                            </textarea>
                            </div>
                        </div>
                    </div>
                    <div class="layui-row layui-col-space1">
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12"
                             style="float: right; padding-bottom: 10px;">
                            <div class="disui-form-flex layui-hide">
                                <button class="layui-btn layui-btn-dismain" lay-submit
                                        lay-filter="templateImport_form_submit"
                                        id="templateImport_form_submit">模板提交
                                </button>
                            </div>
                            <div class="disui-form-flex layui-hide">
                                <button class="layui-btn layui-btn-dismain" lay-submit
                                        lay-filter="templateImport_form_commit"
                                        id="templateImport_form_commit">模板导入
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="layui-col-sm5 layui-col-md5 layui-col-lg5">
            <div class="disui-form-flex">
                <button class="layui-btn layui-btn-dismain" ms-if="isShow" onclick="add()">添加</button>
                <button class="layui-btn layui-btn-dismain" ms-if="isShow" onclick="edit()">修改</button>
                <button class="layui-btn layui-btn-dismain" ms-if="isShow" onclick="del()">删除</button>
            </div>
        </div>
        <div class="layui-col-sm7 layui-col-md7 layui-col-lg7">
            <div class="disui-form-flex">
                <button class="layui-btn layui-btn-dismain" ms-if="!isShow" onclick="saveTemplateInfo()">保存</button>
                <button class="layui-btn layui-btn-dismain" ms-if="!isShow" onclick="cancel()">取消
                </button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/backstage/bacContentTemplateList.js?t=${currentTimeMillis}"></script>
</body>
</html>