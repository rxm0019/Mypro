<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <!--layuiadmin的css-->
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/lib/zTree/v3/css/layuiStyle/layuiStyle.css">
    <style>
        .layui-row .disui-form-flex>label {
            flex: 0 0 110px;
        }
    </style>
</head>

<body ms-controller="sysMenuList">
<div id="sysMenuList_menuTree"></div>
<div class="layui-fluid">
    <div class="layui-card" style="height: -webkit-fill-available;">
        <div class="layui-card-body">
            <div id="sysMenuList_top" class="pt-5 pb-5 pl-15 pr-15" style="border-bottom: 1px solid #e8ebed;">
                <button class="layui-btn layui-btn-dismain layui-btn-dis-s" style="width: 120px;" :visible="@baseFuncInfo.authorityTag('sysMenuList#add')"
                        onclick="onMenuAdd()">添加一级菜单</button>
                <button class="layui-btn layui-btn-dismain layui-btn-dis-s" style="width: 120px;" :visible="@baseFuncInfo.authorityTag('sysMenuList#addWithKeys')"
                        onclick="onMenuAddWithKeys()">自动生成菜单</button>
            </div>
        </div>
        <div class="layui-tab layui-tab-brief">
            <ul class="layui-tab-title">
                <li class="layui-this">菜单信息</li>
                <li>菜单按钮</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show" id="sysMenuEdit_div">
                    <div class="layui-form layui-row" lay-filter="sysMenuEdit_form" id="sysMenuEdit_form">
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
                            <div class="disui-form-flex">
                                <label>ID：</label>
                                <input type="hidden" name="id" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
                            <div class="disui-form-flex">
                                <label>parentId：</label>
                                <input type="hidden" name="parentId" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                                <label><span class="edit-verify-span">*</span>菜单名称：</label>
                                <input type="text" name="menuName" maxlength="50" lay-verify="required" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                                <label><span class="edit-verify-span">*</span>目标地址：</label>
                                <input type="text" name="menuUrl" maxlength="255" lay-verify="required" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                                <label>菜单图标：</label>
                                <input type="text" name="menuIcon" maxlength="50" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                                <label>菜单图标(图片)：</label>
                                <input type="text" name="menuImg" maxlength="50" autocomplete="off" class="layui-input">
                            </div>
                            <div class="disui-form-flex">
                                <label></label>
                                <div class="layui-form-mid layui-word-aux">（当图标与图片共存时，图片优先显示）</div>
                            </div>
                        </div>
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                                <label>是否APP可用：</label>
                                <div class="layui-input-block">
                                    <input type="radio" name="menuApp" value="Y" title="是">
                                    <input type="radio" name="menuApp" value="N" title="否" checked>
                                </div>
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
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                                <label>备注：</label>
                                <textarea name="remark" maxlength="255"></textarea>
                            </div>
                        </div>
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
                            <button class="layui-btn" lay-submit lay-filter="sysMenuEdit_submit" id="sysMenuEdit_submit">提交</button>
                        </div>
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 mt-10" :visible="@baseFuncInfo.authorityTag('sysMenuList#edit')">
                            <div class="disui-form-flex">
                                <label></label>
                                <button class="layui-btn layui-btn-dismain layui-btn-dis-xs" onclick="onMenuSave()">保存</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="layui-card-body">
                        <div style="padding-bottom: 10px;" id="sysMenuList_tool">
                            <button class="layui-btn layui-btn-dismain" :visible="@baseFuncInfo.authorityTag('sysMenuList#addKey')"
                                    onclick="onMenuKeyAdd()">添加</button>
                            <button class="layui-btn layui-btn-dissub" :visible="@baseFuncInfo.authorityTag('sysMenuList#deleteKey')"
                                    onclick="onMenuKeyBatchDelete()">删除</button>
                        </div>
                        <!--table定义-->
                        <table id="sysMenuList_table" lay-filter="sysMenuList_table"></table>
                        <!--table的工具栏按钮定义，注意：需要增加权限控制-->
                        <script type="text/html" id="sysMenuList_bar">
                            {{#  if(baseFuncInfo.authorityTag('sysMenuList#detailKey')){ }}
                                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="detail">详情</a>
                            {{#  } }}
                            {{#  if(baseFuncInfo.authorityTag('sysMenuList#editKey')){ }}
                                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">编辑</a>
                            {{#  } }}
                            {{#  if(baseFuncInfo.authorityTag('sysMenuList#deleteKey')){ }}
                                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="delete">删除</a>
                            {{#  } }}
                        </script>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript" src="${ctxsta}/static/lib/zTree/v3/js/jquery.ztree.all.min.js"></script>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysMenuList.js?t=${currentTimeMillis}"></script>
</body>
</html>
