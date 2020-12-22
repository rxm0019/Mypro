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
<body ms-controller="bacServiceRecordList">
<div class="layui-fluid">
    <div class="layui-card">
        <div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
            <ul class="layui-tab-title">
                <li class="layui-this">维护检查记录</li>
                <li>年检记录</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show">
                    <!--搜素栏的div-->
                    <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
                         id="bacServiceRecordList_search" lay-filter="bacServiceRecordList_search">
                    </div>

                    <div class="layui-card-body">
                        <!--工具栏的按钮的div，注意：需要增加权限控制-->
                        <div style="padding: 10px;" id="bacServiceRecordList_tool">
                            <button :visible="@baseFuncInfo.authorityTag('bacServiceRecordList#add')"
                                    class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                            <button :visible="@baseFuncInfo.authorityTag('bacServiceRecordList#delete')"
                                    class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>
                            <button :visible="@baseFuncInfo.authorityTag('bacServiceRecordList#export')"
                                    class="layui-btn layui-btn-dissub" onclick="exportRecordExcel()">导出</button>
                        </div>
                        <!--table定义-->
                        <table id="bacServiceRecordList_table" lay-filter="bacServiceRecordList_table"></table>
                        <!--table的工具栏按钮定义，注意：需要增加权限控制-->
                        <script type="text/html" id="bacServiceRecordList_bar">
                            {{#  if(baseFuncInfo.authorityTag('bacServiceRecordList#detail')){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-blue " lay-event="detail">详情</a>
                            {{#  } }}
                            {{#  if(baseFuncInfo.authorityTag('bacServiceRecordList#edit')){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="edit">编辑</a>
                            {{#  } }}
                            {{#  if(baseFuncInfo.authorityTag('bacServiceRecordList#delete')){ }}
                            <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="delete">删除</a>
                            {{#  } }}
                        </script>
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="layui-form-item" style="margin-bottom: 0px; height: 40px;">
                        <div class="layui-inline" style="height: 35px">
                            <label class="layui-form-label">年检日期:</label>
                            <div class="layui-input-block"><div class="layui-input-inline">
                                    <input type="text" name="yearServiceDate_begin" placeholder="yyyy-MM-dd" id="yearServiceDate_begin" class="layui-input" >
                                </div>
                                <div class="layui-form-mid layui-word-aux"> - </div>
                                <div class="layui-input-inline">
                                    <input type="text" name="yearServiceDate_end" placeholder="yyyy-MM-dd" id="yearServiceDate_end" class="layui-input" >
                                </div>
                            </div>
                        </div>
                        <div class="layui-inline" style="width:330px;">
                            <label class="layui-form-label" style="width: 120px">设备名称或编码：</label>
                            <div class="layui-input-inline">
                                <input type="text" name="deviceId" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach " lay-submit="" lay-filter="bacServiceYearRecordList_search_search" onclick="getYearRecordList()">   搜 索   </button>
                        </div>
                    </div>
                    <div class="layui-card-body">
                        <!--工具栏的按钮的div，注意：需要增加权限控制-->
                        <div style="padding: 10px;" id="bacServiceYearRecordList_tool">
                            <button :visible="@baseFuncInfo.authorityTag('bacServiceYearRecordList#add')"
                                    class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                            <button :visible="@baseFuncInfo.authorityTag('bacServiceYearRecordList#delete')"
                                    class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>
                            <button :visible="@baseFuncInfo.authorityTag('bacServiceYearRecordList#export')"
                                    class="layui-btn layui-btn-dissub" onclick="exportYearRecordExcel()">导出</button>
                        </div>
                        <!--table定义-->
                        <table id="bacServiceYearRecordList_table" lay-filter="bacServiceYearRecordList_table"></table>
                        <!--table的工具栏按钮定义，注意：需要增加权限控制-->
                        <script type="text/html" id="bacServiceYearRecordList_bar">
                            {{#  if(baseFuncInfo.authorityTag('bacServiceYearRecordList#detail')){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-blue " lay-event="detail">详情</a>
                            {{#  } }}
                            {{#  if(baseFuncInfo.authorityTag('bacServiceYearRecordList#edit')){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="edit">编辑</a>
                            {{#  } }}
                            {{#  if(baseFuncInfo.authorityTag('bacServiceYearRecordList#delete')){ }}
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
<script type="text/javascript" src="${ctxsta}/static/js/synthetical/bacServiceRecordList.js?t=${currentTimeMillis}"></script>
</body>
</html>