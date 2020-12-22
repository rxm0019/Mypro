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
<body ms-controller="sysLoginBannerList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="sysLoginBannerList_search" lay-filter="sysLoginBannerList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="sysLoginBannerList_tool">

                <button :visible="@baseFuncInfo.authorityTag('sysLoginBannerList#add')"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('sysLoginBannerList#delete')"
                        class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>
            </div>
            <!--table定义-->
            <table id="sysLoginBannerList_table" lay-filter="sysLoginBannerList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="sysLoginBannerList_bar">
                {{#  if(baseFuncInfo.authorityTag('sysLoginBannerList#detail')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-blue " lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('sysLoginBannerList#edit')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('sysLoginBannerList#delete')){ }}
                <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="del">删除</a>
                {{#  } }}
            </script>
            <#--图片检视-->
            <div style="height:300px;width: 70%;position: absolute; bottom: 145px;
    left: 90px;border: 1px solid rgb(204, 204, 204);border-radius: 7px;" class="layui-card "
                 id="imgView" ms-if="!imgShow">
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/system/sysLoginBannerList.js?t=${currentTimeMillis}"></script>
</body>
</html>