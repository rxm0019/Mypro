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
<body ms-controller="bacWaterUseList">
<div class="layui-fluid">
    <div class="layui-card">
        <div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
            <ul class="layui-tab-title">
                <li class="layui-this">水机每日登记</li>
                <li>污水每日登记</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show">
                    <!--搜素栏的div-->
                    <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
                         id="bacWaterUseList_search" lay-filter="bacWaterUseList_search">
                    </div>

                    <div class="layui-card-body">
                        <!--工具栏的按钮的div，注意：需要增加权限控制-->
                        <div style="padding: 10px;" id="bacWaterUseList_tool">
                            <button :visible="@baseFuncInfo.authorityTag('bacWaterUseList#add')"
                                    class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                            <button :visible="@baseFuncInfo.authorityTag('bacWaterUseList#delete')"
                                    class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>
                            <button :visible="@baseFuncInfo.authorityTag('bacWaterUseList#export')"
                                    class="layui-btn layui-btn-dissub" onclick="exportWaterUseExcel()">导出</button>
                        </div>
                        <!--table定义-->
                        <table id="bacWaterUseList_table" lay-filter="bacWaterUseList_table"></table>
                        <!--table的工具栏按钮定义，注意：需要增加权限控制-->
                        <script type="text/html" id="bacWaterUseList_bar">
                            {{#  if(baseFuncInfo.authorityTag('bacWaterUseList#detail')){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-blue " lay-event="detail">详情</a>
                            {{#  } }}
                            {{#  if(baseFuncInfo.authorityTag('bacWaterUseList#edit')){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="edit">编辑</a>
                            {{#  } }}
                            {{#  if(baseFuncInfo.authorityTag('bacWaterUseList#delete')){ }}
                            <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="delete">删除</a>
                            {{#  } }}
                        </script>
                    </div>
                </div>
                <div class="layui-tab-item">
                    <!--搜素栏的div-->
                    <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
                         id="bacSewageList_search" lay-filter="bacSewageList_search">
                    </div>

                    <div class="layui-card-body">
                        <!--工具栏的按钮的div，注意：需要增加权限控制-->
                        <div style="padding: 10px;" id="bacSewageList_tool">
                            <button :visible="@baseFuncInfo.authorityTag('bacSewageList#add')"
                                    class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                            <button :visible="@baseFuncInfo.authorityTag('bacSewageList#delete')"
                                    class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>
                            <button :visible="@baseFuncInfo.authorityTag('bacSewageList#export')"
                                    class="layui-btn layui-btn-dissub" onclick="exportSewageExcel()">导出</button>
                        </div>
                        <!--table定义-->
                        <table id="bacSewageList_table" lay-filter="bacSewageList_table"></table>
                        <!--table的工具栏按钮定义，注意：需要增加权限控制-->
                        <script type="text/html" id="bacSewageList_bar">
                            {{#  if(baseFuncInfo.authorityTag('bacSewageList#check')){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-blue " lay-event="check">核对</a>
                            {{#  } }}
                            {{#  if(baseFuncInfo.authorityTag('bacSewageList#edit')){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="edit">编辑</a>
                            {{#  } }}
                            {{#  if(baseFuncInfo.authorityTag('bacSewageList#delete')){ }}
                            <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="delete">删除</a>
                            {{#  } }}
                        </script>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/synthetical/bacWaterUseList.js?t=${currentTimeMillis}"></script>
</body>
</html>