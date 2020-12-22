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
</head>
<style type="text/css">
    .layui-row .disui-form-flex > label {
        flex-basis: 120px;

    }
</style>
<body ms-controller="patDiseaseHistoryEdit">
<div class="layui-fluid">
    <div class="layui-card">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4" style="padding: 10px;">
                <div  style="width: 120px; margin-left: 20px;">病史模板</div>

                <!--搜素栏的div-->
                <div class="layui-row layui-col-space1">
                    <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
                         id="patDiseaseHistoryEdit_search" lay-filter="patDiseaseHistoryEdit_search">
                    </div>
                </div>
                <div class="layui-row layui-col-space1">
                    <div class="layui-card-body">
                        <!--table定义-->
                        <table id="patDiseaseHistoryEdit_table" lay-filter="patDiseaseHistoryEdit_table"></table>
                        <!--工具栏的按钮的div，注意：需要增加权限控制-->
                        <div style="padding-top: 10px;" id="bacContentTemplateList_tool">
                            <button class="layui-btn layui-btn-dismain" onclick="add()">添加</button>
                            <button class="layui-btn layui-btn-dismain" onclick="edit()">修改</button>
                            <button class="layui-btn layui-btn-dismain" onclick="del()">删除</button>

                        </div>
                        <!--table的工具栏按钮定义，注意：需要增加权限控制-->
                        <script type="text/html" id="bacContentTemplateList_bar">
                            {{#  if(baseFuncInfo.authorityTag('bacContentTemplateList#edit')){ }}
                            <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
                            {{#  } }}
                            {{#  if(baseFuncInfo.authorityTag('bacContentTemplateList#del')){ }}
                            <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
                            {{#  } }}
                        </script>
                    </div>
                </div>
            </div>
            <div style="border-right:1px dashed #ccc; width:4px;"></div>
            <div class="layui-col-sm8 layui-col-md8 layui-col-lg8" style="padding: 10px;" ms-if="isShow">
                <div style="width: 120px; margin-left: 40px;"><span class="edit-verify-span">*</span>已选模板</div>
                <div class="layui-form" lay-filter="templateImport_form" id="templateImport_form" style="margin: 10px;">
                    <div class="layui-card"
                         style="margin:0 10px 0 0;height: 470px;border: 1px solid rgba(171, 160, 148, 0.37)">
                        <div style="margin: 10px;">
                            <div class="layui-row layui-col-space1 layui-hide">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">ID</label>

                                        <input type="hidden" name="contentTemplateId" placeholder="请输入"
                                               autocomplete="off"
                                               class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-row layui-col-space1 layui-hide">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"><span
                                                    class="edit-verify-span">*</span>模板类型</label>
                                        <input type="text" name="templateType" id="templateType" maxlength="50"
                                               placeholder="请输入" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-row layui-col-space1">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">模板名称：</label>
                                        <input type="text" name="templateTitle" maxlength="100" lay-verify="required"
                                               placeholder="请输入" autocomplete="off" :attr="@readonly">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-row layui-col-space1">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">模板内容：</label>
                                        <textarea type="text" name="templateContent" maxlength="65535"
                                                  lay-verify="required"
                                                  placeholder="请输入" autocomplete="off" style="height: 370px;" :attr="@readonly">
                            </textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-row layui-col-space1">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12"
                                     style="float: right; padding-bottom: 10px;">
                                    <div class="disui-form-flex layui-hide">
                                        <button class="layui-btn layui-btn-dismain" lay-submit
                                                lay-filter="templateImport_form_commit"
                                                id="templateImport_form_commit">保存
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <#--编辑模式-->
            <div class="layui-col-sm8 layui-col-md8 layui-col-lg8" style="padding: 10px;" ms-if="!isShow">

                <div style="width: 120px; margin-left: 40px;">添加/修改模板</div>
                <div class="layui-form" lay-filter="bacContentTemplateEdit_form" id="bacContentTemplateEdit_form"
                     style="margin: 10px;">
                    <div class="layui-card"
                         style="margin:0 10px 0 0;height: 470px;border: 1px solid rgba(171, 160, 148, 0.37)">
                        <div style="margin: 10px;">
                            <div class="layui-row layui-col-space1 layui-hide">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">ID</label>

                                        <input type="hidden" name="contentTemplateId" placeholder="请输入"
                                               autocomplete="off"
                                               class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-row layui-col-space1 layui-hide">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"><span
                                                    class="edit-verify-span">*</span>模板类型</label>
                                        <input type="text" name="templateType" id="templateType" maxlength="50"
                                               placeholder="请输入" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-row layui-col-space1">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"><span
                                                    class="edit-verify-span">*</span>模板名称：</label>
                                        <input type="text" name="templateTitle" maxlength="100" lay-verify="required"
                                               placeholder="请输入" autocomplete="off" class="layui-input" >
                                    </div>
                                </div>
                            </div>
                            <div class="layui-row layui-col-space1">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"><span
                                                    class="edit-verify-span">*</span>模板内容：</label>
                                        <textarea type="text" name="templateContent" maxlength="65535"
                                                  lay-verify="required"
                                                  placeholder="请输入" autocomplete="off" style="height: 370px;">
                            </textarea>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="layui-row layui-col-space1" style="margin-top: 10px;">
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                                <button class="layui-btn layui-btn-dismain" lay-submit
                                        lay-filter="bacContentTemplateEdit_submit"
                                        id="bacContentTemplateEdit_submit">保存
                                </button>
                                <button class="layui-btn layui-btn-dismain" onclick="cancel()">取消
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>



<script type="text/javascript"
        src="${ctxsta}/static/js/patient/patDiseaseHistoryEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>