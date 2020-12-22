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
    <style>
        .layui-layedit {
            border-width: 1px;
            border-style: solid;
            border-radius: 2px;
            width: 100%;
        }

        p {
            line-height: 35px;
        }

        .layui-card .layui-table-view {
            margin-top: 14px;
        }

        .layui-table-box tbody tr td:nth-child(2) div {
            text-align: left !important;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="bacDocTmplList">
<div class="layui-card" style="height: 713px;margin: 10px;margin-top: 0;margin-right: 8px" id="docTmplCard">
    <div class="layui-form">
        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
            <div class="layui-card" style="margin-top: 10px;margin-left:10px;border: 1px;text-align: left">
                <button class="layui-btn layui-btn-dismain"
                        :visible="@baseFuncInfo.authorityTag('bacDocTmpl#add')"
                        onclick="edit(1)">添加
                </button>
                <button class="layui-btn layui-btn-dismain"
                        :visible="@baseFuncInfo.authorityTag('bacDocTmpl#edit')"
                        onclick="edit(2)">编辑
                </button>
                <button class="layui-btn layui-btn-dissub"
                        :visible="@baseFuncInfo.authorityTag('bacDocTmpl#delete')"
                        onclick="batchDel()">删除
                </button>
                <table id="bacDoc_Tmpl" lay-filter="bacDoc_Tmpl"
                       style="height: inherit;border: 1px solid rgb(204, 204, 204);border-radius: 7px;margin-top: 10px">
                </table>
            </div>
        </div>
        <div class="layui-col-sm9 layui-col-md9 layui-col-lg9">
            <div style="text-align: right;margin-top: 10px;float: right;display: inline-block;padding-right: 10px">
                <button class="layui-btn layui-btn-dismain"
                        :visible="@baseFuncInfo.authorityTag('bacDocTmpl#print')"
                        onclick="printModel()">打印
                </button>
            </div>
            <div class="layui-card" style="margin-top: 50px;overflow-y: auto;height: 615px;padding: 20px"
                 id="showPatientModel">
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript"
        src="${ctxsta}/static/js/backstage/bacDocTmplList.js?t=${currentTimeMillis}"></script>
</body>
</html>