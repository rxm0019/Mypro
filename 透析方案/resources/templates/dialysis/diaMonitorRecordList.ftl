<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <style type="text/css">
        .layui-diaMonitorRecordList th .layui-table-cell {
            height: 34px;
            line-height: 18px;
        }
        .layui-diaUnusualRecordList .layui-table-cell {
            height: auto;
        }

        .layui-fluid {
            padding: 0px !important;
            margin: 0px !important;
        }
        .layui-colla-content {
            padding: 0;
        }

        /* 异常情况 */
        .unusual-record-box .layui-table-cell {
            height: auto;
            white-space: normal;
            word-break: break-all;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="diaMonitorRecordList">
<div class="layui-fluid">
    <div class="layui-card">
        <div class="layui-card-body">
            <div class="layui-collapse" lay-filter="orderColla">
                <div class="layui-colla-item">
                    <p class="layui-colla-title">透析参数监测</p>
                    <div class="layui-colla-content layui-show layui-diaMonitorRecordList">
                        <!--工具栏的按钮的div，注意：需要增加权限控制-->
                        <div style="padding: 10px 10px;" id="diaMonitorRecordList_tool" ms-if="!@formReadonly">
                            <button :visible="@baseFuncInfo.authorityTag('diaMonitorRecordList#add')"
                                    class="layui-btn layui-btn-dismain layui-btn-dis-xs" onclick="saveOrEdit()">添加
                            </button>
                        </div>
                        <!--table定义-->
                        <table id="diaMonitorRecordList_table" lay-filter="diaMonitorRecordList_table"></table>
                        <!--table的工具栏按钮定义，注意：需要增加权限控制-->
                        <script type="text/html" id="diaMonitorRecordList_bar">
                            {{#  if(baseFuncInfo.authorityTag('diaMonitorRecordList#detail')){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="detail">详情</a>
                            {{#  } }}

                            {{#  if(baseFuncInfo.authorityTag('diaMonitorRecordList#edit') && !diaMonitorRecordList.formReadonly){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red"
                               lay-event="edit">编辑</a>
                            {{#  } }}
                            {{#  if(baseFuncInfo.authorityTag('diaMonitorRecordList#copy') && !diaMonitorRecordList.formReadonly){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue"
                               lay-event="copy">复制</a>
                            {{#  } }}
                            {{#  if(baseFuncInfo.authorityTag('diaMonitorRecordList#delete') && !diaMonitorRecordList.formReadonly){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black"
                               lay-event="del">删除</a>
                            {{#  } }}
                        </script>
                    </div>
                </div>
            </div>
            <div class="layui-collapse unusual-record-box" lay-filter="orderColla">
                <div class="layui-colla-item">
                    <p class="layui-colla-title">病症监测</p>
                    <div class="layui-colla-content layui-show layui-diaUnusualRecordList">
                        <!--工具栏的按钮的div，注意：需要增加权限控制-->
                        <div style="padding: 10px 10px;" id="diaMonitorRecordList_tool" ms-if="!@formReadonly">
                            <button :visible="@baseFuncInfo.authorityTag('diaUnusualRecordList#add')"
                                    class="layui-btn layui-btn-dismain layui-btn-dis-xs" onclick="addOrEdit()">添加
                            </button>
                        </div>
                        <!--table定义-->
                        <table id="diaUnusualRecordList_table" lay-filter="diaUnusualRecordList_table"></table>
                        <!--table的工具栏按钮定义，注意：需要增加权限控制-->
                        <script type="text/html" id="diaUnusualRecordList_bar" ms-if="!@formReadonly">
                            {{#  if(baseFuncInfo.authorityTag('diaUnusualRecordList#edit')){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red"
                               lay-event="edit">编辑</a>
                            {{#  } }}
                            {{#  if(baseFuncInfo.authorityTag('diaUnusualRecordList#delete')){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="delete">删除</a>
                            {{#  } }}
                        </script>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript"
        src="${ctxsta}/static/js/dialysis/diaMonitorRecordList.js?t=${currentTimeMillis}"></script>
</body>
</html>
