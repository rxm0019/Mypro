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
        #LAY-component-grid-mobile .layui-card-body {
            display: flex;
            justify-content: center;
            flex-direction: column;
            text-align: center;
        }
        .layui-elem-quote {
            background-color: #FFF;
            line-height: 20px;
            padding: 5px;
            margin-top: 10px;
            border-left: 4px solid rgba(118, 189, 187, 1);
            margin-left: 15px;
            width: 30%;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="projectIndex">
<div class="layui-fluid" id="LAY-component-grid-mobile">
    <div class="layui-row layui-col-space10">
        <div class="layui-col-xs12">
            <!-- 填充内容 -->
            <div class="layui-card">
                <div class="layui-card-header" style="height: 60px;">搜索</div>
                <div class="layui-card-body" style="height: 150px;">
                    <div style="margin: 15px;">
                        <div class="layui-col-xs2">
                            <div class="layui-card" style="background-color: #007DDB; height: 100px; width: 220px;">

                            </div>
                        </div>
                        <div class="layui-col-xs2">
                            <div class="layui-card" style="background-color: #007DDB; height: 100px; width: 220px;">

                            </div>
                        </div>
                        <div class="layui-col-xs2">
                            <div class="layui-card" style="background-color: #007DDB; height: 100px; width: 220px;">

                            </div>
                        </div>
                        <div class="layui-col-xs2">
                            <div class="layui-card" style="background-color: #007DDB; height: 100px; width: 220px;">

                            </div>
                        </div>
                        <div class="layui-col-xs2">
                            <div class="layui-card" style="background-color: #007DDB; height: 100px; width: 220px;">

                            </div>
                        </div>
                        <div class="layui-col-xs2">
                            <div class="layui-card" style="background-color: #007DDB; height: 100px; width: 220px;">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>





    <div class="layui-row layui-col-space10">
        <div class="layui-col-xs12">
            <!-- 填充内容 -->
            <div class="layui-card">
                <div class="layui-card-body" style="height: 250px;">
                    <div style="margin: 15px;">
                        <div class="layui-col-xs3">
                            <div class="layui-card" style="background-color: #007DDB; height: 100px; width: 220px;">

                            </div>
                        </div>
                        <div class="layui-col-xs3">
                            <div class="layui-card" style="background-color: #007DDB; height: 100px; width: 220px;">

                            </div>
                        </div>
                        <div class="layui-col-xs3">
                            <div class="layui-card" style="background-color: #007DDB; height: 100px; width: 220px;">

                            </div>
                        </div>
                        <div class="layui-col-xs3">
                            <div class="layui-card" style="background-color: #007DDB; height: 100px; width: 220px;">

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space10">
        <div class="layui-col-xs12">
            <div class="layui-col-xs4">
                <!-- 填充内容 -->
                <div class="layui-card">
                    <div class="layui-card-body">
                        <blockquote class="layui-elem-quote">
                            <label style="font-weight: bold; float: left"> 交班记录</label>

                        </blockquote>
                                <div class="layui-tab layui-tab-brief" lay-filter="component-tabs-brief">
                                    <ul class="layui-tab-title">
                                        <li class="layui-this">@我</li>
                                        <li>我@</li>

                                    </ul>
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                            你也可以监听 tab 事件
                                        </div>
                                        <div class="layui-tab-item">内容2</div>
                                    </div>
                                </div>
                    </div>
                </div>
            </div>
            <div class="layui-col-xs8" style="padding-left: 20px;">
                <!-- 填充内容 -->
                <div class="layui-card">
                    <div class="layui-card-body" style="height: 400px;">
                        <blockquote class="layui-elem-quote">
                            <label style="font-weight: bold; float: left"> 患者透析统计（单位：人）</label>
                        </blockquote>

                        <div id="patientDialysisStatistic" style="height: 300px;width:100%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/lib/echarts/4.3.0/echarts.min.js"></script>
<script type="text/javascript" src="${ctxsta}/static/js/system/projectIndex.js?t=${currentTimeMillis}"></script>
</body>
<script>
</script>
</html>