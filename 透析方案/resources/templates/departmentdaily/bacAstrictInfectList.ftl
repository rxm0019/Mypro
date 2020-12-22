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
        .u400_div {
            margin-top: 10px;
            width: 99.2%;
            height: calc(100vh - 180px);
            background:  #FFFFFF;
            border:1px solid #EFEFEF;
            border-radius: 8px;
        }

        .u400_div_left{
            height: calc(100vh - 122px);
            margin-right: 10px;
        }
        .u400_div_right{
            height: calc(100vh - 122px);
            margin-right: 10px;
            margin-left: 5px;
            overflow: auto;
        }
        .u400_div_content{
            margin:5%;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="bacAstrictInfectList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="bacAstrictInfectList_search" lay-filter="bacAstrictInfectList_search">
        </div>

        <div class="layui-card-body">
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="u400_div u400_div_left ">
                    <!--工具栏的按钮的div，注意：需要增加权限控制-->
                    <div style="padding: 10px;" id="bacCallbackRecordList_tool">
                        <button :visible="@baseFuncInfo.authorityTag('bacAstrictInfectList#add')"
                                class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                        <button :visible="@baseFuncInfo.authorityTag('bacAstrictInfectList#edit')"
                                class="layui-btn layui-btn-dismain"  onclick="edit()">编辑</button>
                        <button :visible="@baseFuncInfo.authorityTag('bacAstrictInfectList#del')"
                                class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>
                    </div>
                    <!--table定义-->
                    <table id="bacAstrictInfectList_table" lay-filter="bacAstrictInfectList_table"></table>
                </div>
            </div>
            <div class="layui-col-sm9 layui-col-md9 layui-col-lg9">
                <div class="u400_div u400_div_right" >
                    <div class="u400_div_content">
                        <div id="content" lay-verify="content" name="content"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<!--table的工具栏按钮定义，注意：需要增加权限控制-->
<script type="text/html" id="bacAstrictInfectList_bar"></script>
<script type="text/javascript" src="${ctxsta}/static/js/departmentdaily/bacAstrictInfectList.js?t=${currentTimeMillis}"></script>
</body>
</html>