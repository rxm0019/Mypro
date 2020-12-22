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
<body ms-controller="diaPrescriptionItemList">
<div class="layui-fluid" style=" padding: 0 !important;">
    <div class="layui-card">

        <div class="layui-card-body">
            <div class="layui-form">
                <div class="layui-row">
                    <div class="disui-form-flex">
                        <label>查询模式：</label>
                        <div class="layui-input-block">
                            <input type="radio" name="queryMode" lay-filter="queryMode" value="0" title="分类" checked="">
                            <input type="radio" name="queryMode" lay-filter="queryMode" value="1" title="汇总">
                        </div>
                    </div>
                </div>
            </div>
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding-bottom: 10px;padding-left: 20px;" id="diaPrescriptionItemList_tool" ms-if="queryMode=='0'">
                <button :visible="@baseFuncInfo.authorityTag('diaPrescriptionItemList#add') && @showBtn"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
            </div>
            <!--table定义-->
            <table id="diaPrescriptionItemList_table" lay-filter="diaPrescriptionItemList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="diaPrescriptionItemList_bar">
                {{#  if(baseFuncInfo.authorityTag('diaPrescriptionItemList#edit') && diaPrescriptionItemList.showBtn){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('diaPrescriptionItemList#delete') && diaPrescriptionItemList.showBtn){ }}
                    {{# if(d.sourceType === 'Manual') { }}
                        <#-- 手动添加的处方才显示删除按钮 -->
                        <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="delete">删除</a>
                    {{# } else { }}
                        <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" style="visibility: hidden">删除</a>
                    {{# } }}
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaPrescriptionItemList.js?t=${currentTimeMillis}"></script>
</body>
</html>