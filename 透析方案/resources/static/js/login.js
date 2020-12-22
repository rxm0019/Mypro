/**
 * 用户登录
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/31
 */
var login = avalon.define({
    $id: "login",
    loginBanners: []
});

layui.config({
    base: $.config.server + '/static/layuiadmin/', //静态资源所在路径
    version: true //一般用于更新组件缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', "carousel"], function () {
    //加载完模块需要做的初始化动作
    var form = layui.form;
    //刷新表单
    form.render();

    //加载cookie，如果不为空
    var hospitalNo = $.cookie('hospitalNo') || "";
    var username = $.cookie('username') || "";
    var encodePassword = $.cookie('password') || "";
    var password = isNotEmpty(encodePassword) ? $.base64.decode(encodePassword) : "";
    var remember = isNotEmpty(username) && isNotEmpty(password);
    form.val('loginForm', {
        hospitalNo: hospitalNo,
        username: username,
        password: password,
        remember: remember
    });

    // 初始化登录背景图
    initLoginBanners();

    //定义提交事件
    form.on('submit(LAY-user-login-submit)', function (obj) {
        var field = obj.field; //获取提交的字段
        loginfunc(field);
    });
    $('#LAY-user-hospital-no').keydown(function (event) {
        if (event.keyCode == 13) {
            $('#LAY-user-login-username').focus();
        }
    });
    $('#LAY-user-login-username').keydown(function (event) {
        if (event.keyCode == 13) {
            $('#LAY-user-login-password').focus();
        }
    });
    $('#LAY-user-login-password').keydown(function (event) {
        if (event.keyCode == 13) {
            $("#LAY-user-login-vercode").focus();
        }
    });
    $('#LAY-user-login-vercode').keydown(function (event) {
        if (event.keyCode == 13) {
            $("#LAY-user-login-button").click();
        }
    });

    // 刷新验证码
    getVerifiCode();
});

/**
 * 初始化登录背景图
 */
function initLoginBanners() {
    if (loginBanners && loginBanners.length > 0) {
        // 若有配置登录背景，则显示配置
        login.loginBanners = loginBanners;
    } else {
        // 若无配置登录背景，则显示默认背景图
        var defaultLoginBanner = $.config.server +"/static/images/login-banner-1.jpg";
        login.loginBanners = [defaultLoginBanner];
    }

    // 渲染轮播
    layui.carousel.render({
        elem: '.layadmin-user-login-carousel',
        width: '100%', //设置容器宽度
        arrow: 'none'
    });
}

/**
 * 登陆事件
 */
function loginfunc(field) {
    var encodePassword = $.base64.encode(field.password);
    var data = {
        hospitalNo: field.hospitalNo,
        username: field.username,
        password: encodePassword,
        vercode: field.vercode
    };

    // 静默登出方法
    baseFuncInfo.onSilenceLogout();

    //请求登入接口
    _ajax({
        type: "POST",
        url: $.config.services.system + "/clearAndLogin.do",
        data: data,
        dataType: "json",
        success: function(res){
            if (res.rtnCode != RtnCode.OK.code) {
                getVerifiCode();
               }
                },
        done: function (data) {
            //请求成功后，保存cookie（无论是否勾选记住密码，都保存上一次的中心代码）
            $.cookie('hospitalNo', field.hospitalNo, {expires: 7}); //存储cookie--username
            if (field.remember == "1") {
                //记住密码
                $.cookie('username', field.username, {expires: 7}); //存储cookie--username
                $.cookie('password', encodePassword, {expires: 7}); //存储cookie--password
            } else {
                //清除cookie
                $.cookie('username', "", {expires: -1}); //清除cookie--username
                $.cookie('password', "", {expires: -1}); //清除cookie--password
            }

            // 登录成功
            baseFuncInfo.onLoginSuccess(data);
        }
    });
}

/**
 * 刷新验证码
 */
function getVerifiCode() {
    $("#captchaPic").prop('src', $.config.services.system  + '/getVerifiCode.do?a=' + new Date().getTime());
}
