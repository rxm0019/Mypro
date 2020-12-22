<#assign ctxsta = request.contextPath />
<#--开发用-->
<#assign currentTimeMillis = .now ? string["yyyyMMddhhmmSSsss"] />
<#--发布需指定版本-->
<#--<#assign currentTimeMillis = "20201023-1604" />-->

<!DOCTYPE html>
<html>
<head>

    <meta charset="utf-8">
    <title>血透智能信息管理系统</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">

    <!--此页面请切勿轻易改动-->
    <!-- 让IE8/9支持媒体查询，从而兼容栅格 -->

    <!--[if lt IE 9]>
    <script src="${ctxsta}/static/lib/html5.min.js"></script>
    <script src="${ctxsta}/static/lib/respond.min.js"></script>
    <![endif]-->
    <!--layui的css-->
    <link  href="${ctxsta}/static/images/favicon.ico" rel="icon" type="image/x-ico"/>
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/layui/css/layui.css" media="all">
    <!--加载项目的公用css-->
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/css/app.css?t=${currentTimeMillis}" />
    <!--加载项目的扩展图标css 参考：https://fly.layui.com/jie/9149/ 访问阿里字体图标库 http://www.iconfont.cn-->
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/css/font/iconfont.css" />


    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/css/dis_layout.css?t=${currentTimeMillis}" />
    <!--引入一个jquery-->
    <script type="text/javascript" src="${ctxsta}/static/lib/jquery/1.12.4/jquery.min.js"></script>
    <!--layui的js-->
    <script type="text/javascript" src="${ctxsta}/static/layuiadmin/layui/layui.js"></script>
    <!--加载公用工具js-->
    <script type="text/javascript" src="${ctxsta}/static/js/base/tool.js?t=${currentTimeMillis}"></script>
    <!--加载avalon-->
    <script type="text/javascript" src="${ctxsta}/static/lib/avalon/dist/avalon.js"></script>
    <!--加载avalon：过滤器-->
    <script type="text/javascript" src="${ctxsta}/static/js/base/filters.js"></script>
    <script type="text/javascript" src="${ctxsta}/static/lib/jquery.cookie/jquery.cookie.js"></script>
    <!--加载项目的公用js-->
    <script type="text/javascript" src="${ctxsta}/static/js/base/app.js?t=${currentTimeMillis}"></script>
    <script>
        $.config.server = '${ctxsta}';

        layui.config({
            base: '${ctxsta}/static/layuiadmin/' //静态资源所在路径
        }).extend({
            index: 'lib/index' //主入口模块
        });
    </script>
</head>
</html>
