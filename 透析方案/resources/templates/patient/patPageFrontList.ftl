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
</head>
<!--layuiadmin的css-->
<style>
    .layui-elem-quote {
        width: 109px;
        text-align: center;
        background-color: white;
    }
</style>
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="patPageFrontList">
<div class="layui-fluid" style="padding-top: 0px !important">
    <div class="layui-card">
        <div style="padding: 5px">
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <blockquote class="layui-elem-quote">
                            <label style="color: rgba(118, 189, 187, 1); font-weight: bold;">干体重</label>
                        </blockquote>
                        <button :visible="@baseFuncInfo.authorityTag('patPageFrontList#add')"
                                class="layui-btn layui-btn-dismain" style="margin-left: 15px;margin-top: 10px"
                                onclick="saveOrEdit(id,'DryWeight')">添加
                        </button>
                    </div>
                </div>
                <hr class="layui-bg-green">
                <!--干体重table定义-->
                <table id="patPageFrontList_dryWeight" lay-filter="patPageFrontList_dryWeight">
                </table>
                <!--table的工具栏按钮定义，注意：需要增加权限控制 辅助检查列表-->
                <script type="text/html" id="patPageFrontBar">
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#update')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="update">修改</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#delete')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="delete">删除</a>
                    {{#  } }}
                </script>
            </div>
        </div>
        <div style="padding: 5px">
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <blockquote class="layui-elem-quote">
                            <label style="color: rgba(118, 189, 187, 1); font-weight: bold;">血管通路</label>
                        </blockquote>
                        <button :visible="@baseFuncInfo.authorityTag('patPageFrontList#add')"
                                class="layui-btn layui-btn-dismain" style="margin-left: 15px;margin-top: 10px"
                                onclick="saveOrEdit(id,'VascularRoad')">添加
                        </button>
                    </div>
                </div>
                <hr class="layui-bg-green">
                <!--血管通路-->
                <table id="patPageFrontList_vascularRoad" lay-filter="patPageFrontList_vascularRoad" style="height: inherit;border: 1px solid rgb(204, 204, 204);border-radius: 7px;margin-top: 10px">
                </table>
                <!--table的工具栏按钮定义，注意：需要增加权限控制 辅助检查列表-->
                <script type="text/html" id="patPageFrontBar">
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#update')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="update">修改</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#delete')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="delete">删除</a>
                    {{#  } }}
                </script>
            </div>
        </div>
        <div style="padding: 5px">
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <blockquote class="layui-elem-quote">
                            <label style="color: rgba(118, 189, 187, 1); font-weight: bold;">抗凝剂</label>
                        </blockquote>
                        <button :visible="@baseFuncInfo.authorityTag('patPageFrontList#add')"
                                class="layui-btn layui-btn-dismain" style="margin-left: 15px;margin-top: 10px"
                                onclick="saveOrEdit(id,'Anticoagulant')">添加
                        </button>
                    </div>
                </div>
                <hr class="layui-bg-green">
                <!--抗凝剂-->
                <table id="patPageFrontList_anticoagulant" lay-filter="patPageFrontList_anticoagulant" style="height: inherit;border: 1px solid rgb(204, 204, 204);border-radius: 7px;margin-top: 10px">
                </table>
                <!--table的工具栏按钮定义，注意：需要增加权限控制 辅助检查列表-->
                <script type="text/html" id="patPageFrontBar">
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#update')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="update">修改</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#delete')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="delete">删除</a>
                    {{#  } }}
                </script>
            </div>
        </div>
        <div style="padding: 5px">
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <blockquote class="layui-elem-quote">
                            <label style="color: rgba(118, 189, 187, 1); font-weight: bold;">传染病</label>
                        </blockquote>
                        <button :visible="@baseFuncInfo.authorityTag('patPageFrontList#add')"
                                class="layui-btn layui-btn-dismain" style="margin-left: 15px;margin-top: 10px"
                                onclick="saveOrEdit(id,'Infectious')">添加
                        </button>
                    </div>
                </div>
                <hr class="layui-bg-green">
                <!--传染病-->
                <table id="patPageFrontList_infectious" lay-filter="patPageFrontList_infectious" style="height: inherit;border: 1px solid rgb(204, 204, 204);border-radius: 7px;margin-top: 10px">
                </table>
                <!--table的工具栏按钮定义，注意：需要增加权限控制 辅助检查列表-->
                <script type="text/html" id="patPageFrontBar">
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#update')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="update">修改</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#delete')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="delete">删除</a>
                    {{#  } }}
                </script>
            </div>
        </div>
        <div style="padding: 5px">
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <blockquote class="layui-elem-quote">
                            <label style="color: rgba(118, 189, 187, 1); font-weight: bold;">肿瘤</label>
                        </blockquote>
                        <button :visible="@baseFuncInfo.authorityTag('patPageFrontList#add')"
                                class="layui-btn layui-btn-dismain" style="margin-left: 15px;margin-top: 10px"
                                onclick="saveOrEdit(id,'Tumour')">添加
                        </button>
                    </div>
                </div>
                <hr class="layui-bg-green">
                <!--肿瘤-->
                <table id="patPageFrontList_tumour" lay-filter="patPageFrontList_tumour" style="height: inherit;border: 1px solid rgb(204, 204, 204);border-radius: 7px;margin-top: 10px">
                </table>
                <!--table的工具栏按钮定义，注意：需要增加权限控制 辅助检查列表-->
                <script type="text/html" id="patPageFrontBar">
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#update')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="update">修改</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#delete')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="delete">删除</a>
                    {{#  } }}
                </script>
            </div>
        </div>
        <div style="padding:5px">
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <blockquote class="layui-elem-quote">
                            <label style="color: rgba(118, 189, 187, 1); font-weight: bold;">过敏</label>
                        </blockquote>
                        <button :visible="@baseFuncInfo.authorityTag('patPageFrontList#add')"
                                class="layui-btn layui-btn-dismain" style="margin-left: 15px;margin-top: 10px"
                                onclick="saveOrEdit(id,'Allergy')">添加
                        </button>
                    </div>
                </div>
                <hr class="layui-bg-green">
                <!--过敏-->
                <table id="patPageFrontList_allergy" lay-filter="patPageFrontList_allergy" style="height: inherit;border: 1px solid rgb(204, 204, 204);border-radius: 7px;margin-top: 10px">
                </table>
                <!--table的工具栏按钮定义，注意：需要增加权限控制 辅助检查列表-->
                <script type="text/html" id="patPageFrontBar">
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#update')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="update">修改</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#delete')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="delete">删除</a>
                    {{#  } }}
                </script>
            </div>
        </div>
        <div style="padding: 5px">
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <blockquote class="layui-elem-quote">
                            <label style="color: rgba(118, 189, 187, 1); font-weight: bold;">治疗频率</label>
                        </blockquote>
                        <button :visible="@baseFuncInfo.authorityTag('patPageFrontList#add')"
                                class="layui-btn layui-btn-dismain" style="margin-left: 15px;margin-top: 10px"
                                onclick="saveOrEdit(id,'DialysisFrequency')">添加
                        </button>
                    </div>
                </div>
                <hr class="layui-bg-green">
                <!--治疗频率-->
                <table id="patPageFrontList_dialysisFrequency" lay-filter="patPageFrontList_dialysisFrequency" style="height: inherit;border: 1px solid rgb(204, 204, 204);border-radius: 7px;margin-top: 10px">
                </table>
                <!--table的工具栏按钮定义，注意：需要增加权限控制 辅助检查列表-->
                <script type="text/html" id="patPageFrontBar">
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#update')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="update">修改</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#delete')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="delete">删除</a>
                    {{#  } }}
                </script>
            </div>
        </div>
        <div style="padding: 5px">
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <blockquote class="layui-elem-quote">
                            <label style="color: rgba(118, 189, 187, 1); font-weight: bold;">治疗方式</label>
                        </blockquote>
                        <button :visible="@baseFuncInfo.authorityTag('patPageFrontList#add')"
                                class="layui-btn layui-btn-dismain" style="margin-left: 15px;margin-top: 10px"
                                onclick="saveOrEdit(id,'DialysisMode')">添加
                        </button>
                    </div>
                </div>
                <hr class="layui-bg-green">
                <!--治疗方式-->
                <table id="patPageFrontList_dialysisMode" lay-filter="patPageFrontList_dialysisMode" style="height: inherit;border: 1px solid rgb(204, 204, 204);border-radius: 7px;margin-top: 10px">
                </table>
                <!--table的工具栏按钮定义，注意：需要增加权限控制 辅助检查列表-->
                <script type="text/html" id="patPageFrontBar">
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#update')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="update">修改</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#delete')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="delete">删除</a>
                    {{#  } }}
                </script>
            </div>
        </div>
        <div style="padding: 5px">
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <blockquote class="layui-elem-quote">
                            <label style="color: rgba(118, 189, 187, 1); font-weight: bold;">透析液钙浓度</label>
                        </blockquote>
                        <button :visible="@baseFuncInfo.authorityTag('patPageFrontList#add')"
                                class="layui-btn layui-btn-dismain" style="margin-left: 15px;margin-top: 10px"
                                onclick="saveOrEdit(id,'ConcentrationCa')">添加
                        </button>
                    </div>
                </div>
                <hr class="layui-bg-green">
                <!--治疗方式-->
                <table id="patPageFrontList_concentrationCa" lay-filter="patPageFrontList_concentrationCa" style="height: inherit;border: 1px solid rgb(204, 204, 204);border-radius: 7px;margin-top: 10px">
                </table>
                <!--table的工具栏按钮定义，注意：需要增加权限控制 辅助检查列表-->
                <script type="text/html" id="patPageFrontBar">
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#update')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="update">修改</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('patPageFrontList#delete')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="delete">删除</a>
                    {{#  } }}
                </script>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/patient/patPageFrontList.js?t=${currentTimeMillis}"></script>
</body>
</html>