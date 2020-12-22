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
        .layui-form-item .layui-form-checkbox {
            margin-top: 0px;
        }
        .search-form .layui-form-item .layui-inline .layui-form-radio {
            margin-top: 0;
        }
        .layui-upload-img {
            width: 100%;
            min-height: 165px;
            cursor: pointer;
            margin: 0;

        }
        .img-div {
            margin: 5px;
            border: 1px solid #f6f6f6;
        }
        .img-text {
            font-size: 20px;
            padding: 10px;
        }
        .layui-laypage-prev {
            border: none !important;
        }
        .layui-laypage-next {
            border: none !important;
        }
        .table-me .layui-table-box{
            border-bottom: 1px solid rgb(230, 230, 230) !important;
        }
        .layui-laypage a, .layui-laypage span {
            padding: 0 12px;
            height: 26px;
            line-height: 26px;
        }
        .layui-laypage .layui-laypage-skip {
            height: 26px;
            line-height: 26px;
        }
        .layui-laypage button, .layui-laypage input {
            height: 26px;
            line-height: 26px;
        }
        .layui-laypage .layui-laypage-curr .layui-laypage-em {
             padding: 0;
        }
        .layui-laypage a, .layui-laypage span {
             border: none;
        }
        .layui-laypage select {
             height: 26px;
             padding: 0;
        }
        .layui-laypage {
             margin: 0;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="eduTeachList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--页签定义-->
        <div class="layui-tab" lay-filter="teachTab" style="margin: 10px 0;">
            <ul class="layui-tab-title">
                <li class="layui-this">教育主题</li>
                <li>教育计划</li>
                <li>教育记录</li>
            </ul>
            <div class="layui-tab-content">
                <!--教育主题-->
                <div class="layui-tab-item layui-show">
                    <!--搜素栏的div-->
                    <div class="layui-form layuiadmin-card-header-auto search-form"
                         id="eduTeachTheme_search" lay-filter="eduTeachTheme_search"
                         style="border-bottom: 1px solid #f6f6f6;">

                    </div>
                    <div class="layui-card-body">
                        <!--图文定义-->
                        <div ms-if="@searchTheme=='1'">
                            <div class="layui-row layui-col-space1 demo-list" style="height: calc(80vh - 32px);">
                                <div class="layui-col-sm6 layui-col-md4 layui-col-lg3"
                                     ms-for="($index, el) in @themeList"
                                     :visible="@themeList.length>0" style="" style="text-align: center;display: none;">
                                    <div class="img-div">
                                        <img class="layui-upload-img" id="test-upload-normal-img" onclick="eduTheme(this)"
                                             ms-attr="{src:@el.filePath,eduBaseId:@el.eduBaseId} | attrIdPath(@el.filePath)">
                                        <p class="img-text">{{ el.eduBaseName }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-row" :visible="@themeList.length>0"
                                 style="margin-left: -7px;display: none;">
                                <div id="img-page" style="padding: 7px 0px 0px 0px;"></div>
                            </div>
                        </div>

                        <!--table定义-->
                        <div ms-if="@searchTheme=='2'">
                            <table id="eduTeachThemeList_table" lay-filter="eduTeachThemeList_table"></table>
                        </div>

                    </div>
                </div>

                <!--教育计划-->
                <div class="layui-tab-item">
                    <div class="layui-tab-item layui-show">
                        <!--搜素栏的div-->
                        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
                             id="eduTeachPlan_search" lay-filter="eduTeachPlan_search"
                             style="border-bottom: 1px solid #f6f6f6;">

                        </div>

                        <div class="layui-card-body">

                            <!--工具栏的按钮的div，注意：需要增加权限控制-->
                            <div style="padding-bottom: 10px;" id="eduTeachPlanList_tool">
                                <button :visible="@baseFuncInfo.authorityTag('eduTeachPlanList#addPlan')"
                                        class="layui-btn layui-btn-dismain"  onclick="batchAdd()">制定计划</button>
<#--                                <button :visible="@baseFuncInfo.authorityTag('eduTeachPlanList#wechat')"-->
<#--                                        class="layui-btn layui-btn-dissub"  onclick="sendWeChat()">微信推送</button>-->
                                <button :visible="@baseFuncInfo.authorityTag('eduTeachPlanList#delete')"
                                        class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>
                            </div>

                            <table id="eduTeachPlanList_table" lay-filter="eduTeachPlanList_table"></table>
                        </div>
                    </div>
                </div>

                <!--教育记录-->
                <div class="layui-tab-item">
                    <div class="layui-tab-item layui-show">
                        <!--搜素栏的div-->
                        <div class="layui-form layuiadmin-card-header-auto search-form"
                             id="eduTeachRecord_search" lay-filter="eduTeachRecord_search"
                             style="border-bottom: 1px solid #f6f6f6;">
                        </div>

                        <!--明细定义-->
                        <div ms-if="@searchRecord=='1'">
                            <table id="eduTeachDetailList_table" lay-filter="eduTeachDetailList_table"></table>
                        </div>

                        <!--统计定义-->
                        <div ms-if="@searchRecord=='2'" class="table-me">
                            <table id="eduTeachTotalList_table" lay-filter="eduTeachTotalList_table"></table>

                            <div class="layui-row" :visible="@totalPage"
                                 style="margin-left: -7px;display: none;">
                                <div id="total-page" style="padding: 7px 0px 0px 0px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>

<!--table的工具栏按钮定义，注意：需要增加权限控制-->
<script type="text/html" id="eduTeachThemeList_bar">
    {{#  if(baseFuncInfo.authorityTag('eduTeachThemeList#edu')){ }}
    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="eduTheme">宣教</a>
    {{#  } }}
</script>


<!--table的工具栏按钮定义，注意：需要增加权限控制-->
<script type="text/html" id="eduTeachPlanList_bar">
    {{#  if(baseFuncInfo.authorityTag('eduTeachPlanList#show')){ }}
    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="eduShow">预览</a>
    {{#  } }}
    {{#  if(baseFuncInfo.authorityTag('eduTeachPlanList#edu')){ }}
    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="eduTheme">宣教</a>
    {{#  } }}
    {{#  if(baseFuncInfo.authorityTag('eduTeachPlanList#delete')){ }}
    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="delPlan">删除</a>
    {{#  } }}
</script>

<script type="text/html" id="duTeachDetailList_bar">
    {{#  if(baseFuncInfo.authorityTag('duTeachDetailList#show')){ }}
    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="eduShow">预览</a>
    {{#  } }}
    {{#  if(baseFuncInfo.authorityTag('duTeachDetailList#addTeach')){ }}
    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="addTeach">测评</a>
    {{#  } }}
    {{#  if(baseFuncInfo.authorityTag('duTeachDetailList#showTeach') && d.teachAssess != ""){ }}
    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="showTeach">查看</a>
    {{#  } }}
</script>

</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/education/eduTeachList.js?t=${currentTimeMillis}"></script>
</body>
</html>