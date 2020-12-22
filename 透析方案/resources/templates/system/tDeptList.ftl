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
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/lib/zTree/v3/css/layuiStyle/layuiStyle.css">
<body ms-controller="tDeptList">
<!--左侧树的div-->
<div id="left_tree"></div>
<div class="layui-fluid">
    <div class="layui-card" style="height: -webkit-fill-available;">
        <div class="layui-card-body">
            <div id="sysMenuList_top">
                <button class="layui-btn" :visible="@baseFuncInfo.authorityTag('tDeptList#addFirstOrg')"
                        onclick="saveOrEdit(1)">添加一级部门
                </button>
            </div>
        </div>
        <div class="layui-tab layui-tab-brief">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show">
                    <div class="layui-form" lay-filter="tDeptList_form" id="tDeptList_form"
                         style="padding: 20px 10px 10px 0;">
                        <div class="layui-form-item  layui-hide">
                            <label class="layui-form-label">ID</label>
                            <div class="layui-input-inline">
                                <input type="hidden" name="uuid" placeholder="请输入" autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label"><span class="edit-verify-span">*</span>编号</label>
                            <div class="layui-input-inline">
                                <input type="input" name="deptCode" maxlength="20" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label"><span class="edit-verify-span">*</span>名称</label>
                            <div class="layui-input-inline">
                                <input type="input" name="deptName" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                            <button class="layui-btn layui-hide" lay-submit lay-filter="tDeptList_submit" id="tDeptList_submit">
                                提交
                            </button>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label"></label>
                            <button class="layui-btn" onclick="save()" :visible="@baseFuncInfo.authorityTag('tDeptList#save')">保存</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/lib/zTree/v3/js/jquery.ztree.all.min.js"></script>
<script type="text/javascript" src="${ctxsta}/static/js/system/tDeptList.js?t=${currentTimeMillis}"></script>
</body>
</html>