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
        flex: 0 0 100px;
    }
</style>
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/lib/zTree/v3/css/layuiStyle/layuiStyle.css">
<body ms-controller="basDiagnoseTypeList">
<div id="basDiagnoseTypeList_typeTree"></div>
<div class="layui-fluid">
    <div class="layui-card">
        <div class="layui-card-body">
            <div id="sysMenuList_top" class="pt-5 pb-5 pl-15 pr-15" style="border-bottom: 1px solid #e8ebed;">
                <button class="layui-btn layui-btn-dismain layui-btn-dis-s" style="width: 160px;" :visible="@baseFuncInfo.authorityTag('basDiagnoseTypeList#add')"
                        onclick="onTypeAdd()">添加一级诊断类别</button>
            </div>
        </div>
        <div class="layui-tab layui-tab-brief">
            <ul class="layui-tab-title">
                <li class="layui-this">诊断类别信息</li>
                <li>诊断项目</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show" id="basDiagnoseTypeEdit_div">
                    <div class="layui-form layui-row" lay-filter="basDiagnoseTypeEdit_form" id="basDiagnoseTypeEdit_form">
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
                            <div class="disui-form-flex">
                                <label>ID：</label>
                                <input type="hidden" name="diagnoseTypeId" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
                            <div class="disui-form-flex">
                                <label>parentTypeId：</label>
                                <input type="hidden" name="parentTypeId" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                                <label>上级类别名：</label>
                                <input type="text" name="typeName" maxlength="50" readonly>
                            </div>
                        </div>
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                                <label><span class="edit-verify-span">*</span>类别名称：</label>
                                <input type="text" name="diagnoseTypeName" maxlength="50" lay-verify="required" autocomplete="off">
                            </div>
                        </div>
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                                <label><span class="edit-verify-span">*</span>类别编码：</label>
                                <input type="text" name="diagnoseTypeCode" maxlength="50" lay-verify="required" autocomplete="off">
                            </div>
                        </div>
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                                <label>质控诊断名称：</label>
                                <input type="text" name="diagnoseTypeQcname" maxlength="50"  autocomplete="off">
                            </div>
                        </div>
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                                <label>状态：</label>
                                <div class="layui-input-block">
                                    <input type="radio" name="dataStatus" value="0" title="启用" checked>
                                    <input type="radio" name="dataStatus" value="1" title="停用">
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
                            <button class="layui-btn" lay-submit lay-filter="basDiagnoseTypeEdit_submit" id="basDiagnoseTypeEdit_submit">提交</button>
                        </div>
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 mt-10" :visible="@baseFuncInfo.authorityTag('basDiagnoseTypeList#edit')">
                            <div class="disui-form-flex">
                                <label></label>
                                <button class="layui-btn layui-btn-dismain layui-btn-dis-xs" onclick="onTypeSave()">保存</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="layui-card-body">
                        <!--搜素栏的div-->
                        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
                             id="basDiagnoseDetailList_search" lay-filter="basDiagnoseDetailList_search">
                        </div>

                        <div style="padding: 10px;" id="sysMenuList_tool">
                            <button class="layui-btn layui-btn-dismain" :visible="@baseFuncInfo.authorityTag('basDiagnoseDetailList#add')"
                                    onclick="onDetailAdd()">添加</button>
                            <button class="layui-btn layui-btn-dissub" :visible="@baseFuncInfo.authorityTag('basDiagnoseDetailList#delete')"
                                    onclick="onDetailDelete()">删除</button>
                        </div>
                        <!--table定义-->
                        <table id="basDiagnoseDetailList_table" lay-filter="basDiagnoseDetailList_table"></table>
                        <!--table的工具栏按钮定义，注意：需要增加权限控制-->
                        <script type="text/html" id="basDiagnoseDetailList_bar">
                            {{#  if(baseFuncInfo.authorityTag('basDiagnoseDetailList#detail')){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="detail">详情</a>
                            {{#  } }}
                            {{#  if(baseFuncInfo.authorityTag('basDiagnoseDetailList#edit')){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">编辑</a>
                            {{#  } }}
                            {{#  if(baseFuncInfo.authorityTag('basDiagnoseDetailList#delete')){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="delete">删除</a>
                            {{#  } }}
                        </script>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->

<script type="text/javascript" src="${ctxsta}/static/lib/zTree/v3/js/jquery.ztree.all.min.js"></script>
<script type="text/javascript" src="${ctxsta}/static/js/backstage/basDiagnoseTypeList.js?t=${currentTimeMillis}"></script>
</body>
</html>