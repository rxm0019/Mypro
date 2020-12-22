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
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="sysAreaInfoList">

<!--左侧树的div-->
<div id="left_tree"></div>
<div class="layui-fluid">
    <div class="layui-card" style="">

        <div class="layui-card-body">
            <div id="sysMenuList_top" >
                <div class="pt-5 pb-5 pl-15 pr-15" style="border-bottom: 1px solid #e8ebed;"lay-filter="genTableList_form">
                    <button class="layui-btn layui-btn-dismain layui-btn-dis-s" style="width: 120px;" :visible="@baseFuncInfo.authorityTag('sysAreaInfoList#addTop')"
                            onclick="saveOrEdit(1)">添加一级区域</button>
                </div>
            </div>
        </div>

        <div class="layui-tab layui-tab-brief">
            <ul class="layui-tab-title">
                <li class="layui-this">区域信息</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show" id="sysAreaInfoEdit_div">
                    <div class="layui-form" lay-filter="sysAreaInfoEdit_form" id="sysAreaInfoEdit_form" style="padding: 20px 30px 0 0;">
                        <div class="layui-form-item  layui-hide">
                            <label class="layui-form-label">ID</label>
                            <div class="layui-input-inline">
                                <input type="hidden" name="id"  autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item  layui-hide">
                            <label class="layui-form-label">areaSort</label>
                            <div class="layui-input-inline">
                                <input type="hidden" name="areaSort"  autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item  layui-hide">
                            <label class="layui-form-label">areaCode</label>
                            <div class="layui-input-inline">
                                <input type="hidden" name="areaCode"  autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item layui-hide">
                            <label>上级id</label>
                            <div class="layui-input-inline">
                                <input type="text" readonly id="parentId" name="parentId" placeholder="" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item ">
                            <label class="layui-form-label" style="width: 85px;margin-left: -5px;">上级编码</label>
                            <div class="layui-input-inline">
                                <input type="text" readonly id="parentCode" name="parentCode" placeholder="" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label"><span class="edit-verify-span">*</span>区域编码</label>
                            <div class="layui-input-inline">
                                <input type="text" readonly name="areaCode" maxlength="36" lay-verify="required|number"  autocomplete="off" class="layui-input" maxlength="20">
                                <input type="hidden" name="oldAreaCode" id="oldAreaCode">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label"><span class="edit-verify-span">*</span>区域名称</label>
                            <div class="layui-input-inline">
                                <input type="text" name="areaName" maxlength="36" lay-verify="required"  autocomplete="off" class="layui-input" maxlength="20">
                            </div>
                        </div>

                        <div class="layui-form-item layui-hide">
                            <button class="layui-btn" lay-submit lay-filter="sysAreaInfoEdit_submit" id="sysAreaInfoEdit_submit">提交</button>
                        </div>
                        <div class="layui-form-item"></div>
                        <div style=" padding: 15px 15px 15px 15px;">
                            <label class="layui-form-label"></label>
                            <button class="layui-btn layui-btn-dismain layui-btn-dis-xs" onclick="save()">保存</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/lib/zTree/v3/js/jquery.ztree.all.min.js"></script>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysAreaInfoList.js?t=${currentTimeMillis}"></script>
</body>
</html>