<#assign ctxsta = request.contextPath />
<#assign currentTimeMillis = .now ? string["yyyyMMddhhmmSSsss"] />

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta charset="utf-8">
    <meta name="renderer" content="webkit|ie-comp|ie-stand">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    <meta http-equiv="Cache-Control" content="no-siteapp" />
    <title>血透智能信息管理系统</title>

    <!--layui的css-->
    <link  href="${ctxsta}/static/images/favicon.ico" rel="icon" type="image/x-ico"/>
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/layui/css/layui.css" media="all">
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/login.css" media="all">
    <!--引入一个jquery-->
    <script type="text/javascript" src="${ctxsta}/static/lib/jquery/1.12.4/jquery.min.js"></script>
    <!--layui的js-->
    <script type="text/javascript" src="${ctxsta}/static/layuiadmin/layui/layui.js"></script>
    <!--加载avalon-->
    <script type="text/javascript" src="${ctxsta}/static/lib/avalon/dist/avalon.js"></script>
    <!--加载公用工具js-->
    <script type="text/javascript" src="${ctxsta}/static/js/base/tool.js"></script>
    <!--加载项目的公用js-->
    <script type="text/javascript" src="${ctxsta}/static/js/base/app.js?t=${currentTimeMillis}"></script>
    <script type="text/javascript" src="${ctxsta}/static/lib/jquery.cookie/jquery.cookie.js"></script>
    <script type="text/javascript" src="${ctxsta}/static/lib/jquery.base64/jquery.base64.js"></script>

    <script>
        $.config.server = '${ctxsta}';
        var loginBanners = JSON.parse('${loginBannerImgs}');
    </script>
</head>

<body ms-controller="login">
<div id="LAY-user-login">
    <div class="layadmin-user-login-header">
        <img class="logo" src="/web/static/images/dis-logo.png">
    </div>
    <div class="layadmin-user-login-body">
        <!-- 背景轮播 -->
        <div class="layadmin-user-login-carousel layui-carousel">
            <div carousel-item>
                <div ms-for="($index, el) in @loginBanners" ms-css="{backgroundImage: 'url(' + el + ')'}"></div>
            </div>
        </div>
        <div class="layadmin-user-login-box layui-form" lay-filter="loginForm">
            <div class="login-title">欢迎登录</div>
            <div class="layui-form-item">
                <label class="layadmin-user-login-icon layui-icon" for="LAY-user-hospital-no">
                    <img src="${ctxsta}/static/images/icon-hospital.png" alt="">
                </label>
                <input type="text" name="hospitalNo" id="LAY-user-hospital-no" lay-verify="required" placeholder="请输入中心代码" class="layui-input with-icon">
            </div>
            <div class="layui-form-item">
                <label class="layadmin-user-login-icon layui-icon" for="LAY-user-login-username">
                    <img src="${ctxsta}/static/images/icon-user.png" alt="">
                </label>
                <input type="text" name="username" id="LAY-user-login-username" lay-verify="required" placeholder="请输入用户名" class="layui-input with-icon">
            </div>
            <div class="layui-form-item">
                <label class="layadmin-user-login-icon layui-icon" for="LAY-user-login-password">
                    <img src="${ctxsta}/static/images/icon-pwd.png" alt="">
                </label>
                <input type="password" name="password" id="LAY-user-login-password" lay-verify="required" placeholder="请输入密码" class="layui-input with-icon">
            </div>
            <div class="layui-form-item">
                <input type="text" name="vercode" id="LAY-user-login-vercode" lay-verify="required" placeholder="请输入验证码" class="layui-input input-vercode">
                <img id="captchaPic" title="点击刷新验证码" class="vercode-img" onclick="getVerifiCode()">
                <a class="vercode-switch" href="javascript: void(0);" onclick="getVerifiCode()">换一换</a>
            </div>
            <div class="layui-form-item">
                <input type="checkbox" name="remember" lay-skin="primary" title="记住密码" value="1">
            </div>
            <div class="layui-form-item">
                <button class="layui-btn layui-btn-fluid" id="LAY-user-login-button" lay-submit lay-filter="LAY-user-login-submit">登 录</button>
            </div>
        </div>
    </div>
    <div class="layadmin-user-login-footer">
        <p>©广东弘斯特医疗信息科技有限公司 粤ICP备*******号-*</p>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/login.js?t=${currentTimeMillis}"></script>
</body>
</html>
