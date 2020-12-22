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
<style type="text/css">
    .layui-table-cell {
        height: 34px;
        line-height: 18px;
    }
    /* 子医嘱添加特殊背景色 */
    .sub-order-tr {
        background-color: rgba(242, 242, 242, 0.5);
    }

    /* 医嘱内容 */
    .order-content {
        display: inline-flex;
        align-content: stretch;
    }
    /* 医嘱内容 - 展开/折叠Icon */
    .order-content .icon-box {
        flex: 0 0 25px;
        padding-top: 10px;
    }
    .order-content .icon-box .layui-icon {
        border: 1px solid rgba(51, 171, 159, 1);
        color: rgba(51, 171, 159, 1);
        font-size: 12px;
        padding: 1px;
    }
    .order-content.fold .icon-box .layui-icon-subtraction:before {
        content: "\e624";
    }
    /* 医嘱内容 - 厂家 */
    .order-content .content-manufactor {
        color: #797979;
        line-height: 14px;
        font-size: 12px;
    }
    /* 医嘱内容 - 子医嘱内容缩进 */
    .order-content.sub-order .content {
        padding-left: 55px;
    }
    /** 医嘱内容过长，显示省略号 **/
    .content div {
        width: 355px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .layui-tab-title{
        margin: 0 20px;
        border-bottom: 2px solid #e5e5e5;
    }
    .layui-this{
        color: #33AB9F !important;
    }
    .layui-this:after{
        border-bottom: 2px solid #33AB9F !important;
    }
    .layui-fluid{
        padding-top: 0 !important;
    }
</style>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="patOrderList">
<div class="layui-fluid">
    <div class="layui-card">

        <div class="layui-card-body">
            <!--医嘱页签-->
            <div class="layui-tab layui-tab-brief" lay-filter="patOrderTab">
                <ul class="layui-tab-title">
                    <li lay-id="standingOrder" class="layui-this">透析长期医嘱</li>
                    <li lay-id="medicalRecords">用药记录</li>
                    <li lay-id="templateOrder">模板医嘱</li>
                </ul>
                <div class="layui-tab-content">
                    <div class="layui-tab-item layui-show">
                        <!--工具栏的按钮的div，注意：需要增加权限控制-->
                        <div style="padding-bottom: 10px;">
                            <button :visible="@baseFuncInfo.authorityTag('patOrderList#add')"
                                    class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加医嘱</button>
                            <button :visible="@baseFuncInfo.authorityTag('patOrderList#import')"
                                    class="layui-btn layui-btn-dismain"  onclick="importAdvice()">从组套导入</button>
                            <button :visible="@baseFuncInfo.authorityTag('patOrderList#export')"
                                    class="layui-btn layui-btn-dismain"  onclick="exportAdvice()">导出到组套</button>
                        </div>
                        <!--table定义-->
                        <table id="standingOrder_table" lay-filter="standingOrder_table"></table>
                    </div>
                    <div class="layui-tab-item">
                        <!--工具栏的按钮的div，注意：需要增加权限控制-->
                        <div style="padding-bottom: 10px;">
                            <button :visible="@baseFuncInfo.authorityTag('patOrderList#add')"
                                    class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加医嘱</button>
                            <button :visible="@baseFuncInfo.authorityTag('patOrderList#import')"
                                    class="layui-btn layui-btn-dismain"  onclick="importAdvice()">从组套导入</button>
                            <button :visible="@baseFuncInfo.authorityTag('patOrderList#export')"
                                    class="layui-btn layui-btn-dismain"  onclick="exportAdvice()">导出到组套</button>
                        </div>
                        <!--table定义-->
                        <table id="medicalRecords_table" lay-filter="medicalRecords_table"></table>
                    </div>
                    <div class="layui-tab-item">
                        <!--工具栏的按钮的div，注意：需要增加权限控制-->
                        <div style="padding-bottom: 10px;">
                            <button :visible="@baseFuncInfo.authorityTag('patOrderList#add')"
                                    class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加医嘱</button>
                            <button :visible="@baseFuncInfo.authorityTag('patOrderList#import')"
                                    class="layui-btn layui-btn-dismain"  onclick="importAdvice()">从组套导入</button>
                            <button :visible="@baseFuncInfo.authorityTag('patOrderList#export')"
                                    class="layui-btn layui-btn-dismain"  onclick="exportAdvice()">导出到组套</button>
                        </div>
                        <!--table定义-->
                        <table id="templateOrder_table" lay-filter="templateOrder_table"></table>
                    </div>
                </div>
            </div>

            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="patOrderList_bar">
                {{#  if(baseFuncInfo.authorityTag('patOrderList#edit')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">编辑</a>
                {{#  } }}
                {{# if(baseFuncInfo.authorityTag('patOrderList#add')) { }}
                    {{# if(isEmpty(d.parentOrderId) && d.orderType != '3') { }}
                        <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="addAdvice">添加子医嘱</a>
                    {{# } }}
                {{# } }}
                {{# if(baseFuncInfo.authorityTag('patOrderList#disable') && isEmpty(d.parentOrderId)) { }}
                    {{# if(d.dataStatus === '0') { }}
                        <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="disable">停用</a>
                    {{# } else { }}
                        <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="disable">启用</a>
                    {{# } }}
                {{# } }}
                {{#  if(baseFuncInfo.authorityTag('patOrderList#delete')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="del">删除</a>
                {{#  } }}
            </script>

            <!-- 医嘱内容template -->
            <script type="text/html" id="orderContentTemplet">
                <#-- 子医嘱-->
                {{#  if (d.parentOrderId) { }}
                <div class="order-content sub-order" data-parent-order-id="{{d.parentOrderId}}">
                    <div class="content">
                        {{# if(d.specifications) { }}
                            <div title="{{d.orderContent}}＃{{d.specifications}}">{{d.orderContent}}<span>#</span>{{d.specifications}}</div>
                        {{# } else { }}
                            <div title="{{d.orderContent}}">{{d.orderContent}}</div>
                        {{# } }}
                        {{# if(d.manufactor) { }}
                            <div class="content-manufactor" style="color: #797979;">厂家：{{d.manufactor}}</div>
                        {{# } }}
                    </div>
                </div>
                {{#  } }}

                <#-- 父医嘱-->
                {{#  if (!d.parentOrderId) { }}
                <div class="order-content" data-order-id="{{d.orderId}}">
                    <div class="icon-box" lay-event="toggle-fold-suborder">
                        {{# if(d.subOrderId) { }}
                            <i class="layui-icon layui-icon-subtraction"></i>
                        {{# } }}
                    </div>
                    <div class="content">
                        {{# if(d.specifications) { }}
                            <div title="{{d.orderContent}}＃{{d.specifications}}">{{d.orderContent}}<span>#</span>{{d.specifications}}</div>
                        {{# } else { }}
                            <div title="{{d.orderContent}}">{{d.orderContent}}</div>
                        {{# } }}
                        {{# if(d.manufactor) { }}
                            <div class="content-manufactor" style="color: #797979;">厂家：{{d.manufactor}}</div>
                        {{# } }}
                    </div>
                </div>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/patient/patOrderList.js?t=${currentTimeMillis}"></script>
</body>
</html>