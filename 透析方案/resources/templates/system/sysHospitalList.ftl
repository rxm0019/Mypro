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
<body ms-controller="sysHospitalList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="sysHospitalList_search" lay-filter="sysHospitalList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 15px 15px 15px 15px" id="sysHospitalList_tool">
                <button :visible="@baseFuncInfo.authorityTag('sysHospitalList#add')"
                        class="layui-btn layui-btn-dismain layui-btn-dis-xs" onclick="onHospitalAdd()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('sysHospitalList#delete')"
                        class="layui-btn layui-btn-dissub layui-btn-dis-xs" onclick="onHospitalBatchDelete()">删除</button>

            </div>
            <!--table定义-->
            <table id="sysHospitalList_table" lay-filter="sysHospitalList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="sysHospitalList_bar">
                {{#  if(baseFuncInfo.authorityTag('sysHospitalList#detail')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs" lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('sysHospitalList#print')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="print">处方笺打印</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('sysHospitalList#edit')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('sysHospitalList#delete') && baseFuncInfo.userInfoData.loginHospitalNo != d.hospitalNo){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="delete">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/system/sysHospitalList.js?t=${currentTimeMillis}"></script>
</body>
</html>
