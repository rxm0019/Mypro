/**
 * 首页
 * Created by huoquan on 2018/8/14.
 */
var indexInfo = avalon.define({
    $id: "indexInfo",
    baseFuncInfo: baseFuncInfo,
    breadcrumbs: [],
});

<!--引入layui的模块方式-->
layui.use(['index', 'element'], function () {
    var element = layui.element;

    avalon.ready(function () {
        //入口事件
        invalid();

        // 触发第一个菜单项点击
        $("#LAY-system-side-menu a[lay-href]").first().trigger("click");

        //获取消息数量
        var read = JSON.parse(getStorage(key)) == null ? [] : JSON.parse(getStorage(key));
        setNoticeNum(read);
        // connect(); // 加截页面时,连接webSocket

        // 页签点击时刷新头部导航栏
        $("#LAY_app_tabsheader").on("click", "li", function () {
            baseFuncInfo.resetBreadcrumbs();
        });
        // 侧边菜单点击时刷新头部导航栏
        $("#LAY-system-side-menu").on("click", "a[lay-href]", function () {
            baseFuncInfo.resetBreadcrumbs();
        });

        avalon.scan();
    });

    layui.element.on('nav(layadmin-system-side-menu)', function (elem) {
        var thisDom = $(elem).parent();
        // 判断是否是一级菜单
        if (thisDom.hasClass("layui-nav-item")) {
            // 判断是否一级菜单被选中
            if (thisDom.hasClass("layui-this")) {
                //去除其余层级菜单的选中
                $(".layui-nav-itemed").removeClass("layui-nav-itemed");
                //为当前菜单添加选中样式
                $(thisDom).addClass("layui-nav-itemed");
            }
        }
    });

});

function invalid() {
    var id = getStorage('KEY_USERID');
    if (id == null) {
        layer.msg('您还没登录，请登陆后再操作', {
            icon: 2
            , shade: 0.01
            , time: 1000
        });
        setTimeout(function () {
            window.location = $.config.server + "/login";
        }, 1500);
    }
}

/**
 * 刷新数据字典事件
 */
function onRefreshDictData() {
    baseFuncInfo.onRefreshDictData();
}

/**
 * 切换归档查询状态事件
 */
function onToggleArchiveQuery() {
    baseFuncInfo.onToggleArchiveQuery();
}

/**
 * 使用手册按钮事件
 */
function onSysUserManual() {
    window.location.href = $.config.server + "/system/sysUserManualList?manunal=Y";
}

/**
 * 登出按钮事件
 */
function onLogout() {
    _ajax({
        type: "GET",
        url: $.config.services.system + "/logout.do",
        dataType: "json",
        done: function (data) {
            baseFuncInfo.onSilenceLogout();
            window.location.href = $.config.server + "/logout.do";
        },
        error: function (e, code) {
            baseFuncInfo.onSilenceLogout();
            window.location.href = $.config.server + "/logout.do";
        }
    });
}


/**
 * 头部导航改变时，重新渲染
 * @param breadcrumbs
 */
function onBreadcrumbsChange(breadcrumbs) {
    var breadcrumbObj = $("#LAY_app .layui-breadcrumb");
    breadcrumbObj.empty();
    $.each(breadcrumbs, function (index, item) {
        if (index != 0) {
            breadcrumbObj.append("<span lay-separator=\"\">/</span>");
        }
        breadcrumbObj.append("<a><cite>" + item + "</cite></a>");
    });
}

/**
 * 获取未读消息数量
 */
function setNoticeNum(read) {
    var noticeArr = [];
    var count = 0;
    if (read.length > 0) {
        for (var i = 0; i < read.length; i++) {
            noticeArr.push(JSON.parse(read[i]))
        }
        for (var i = 0; i < noticeArr.length; i++) {
            var param = noticeArr[i];
            if(param.isRead ==='0' && param.userIdSend != indexInfo.baseFuncInfo.userInfoData.userid){
                count++;
            }
        }
    }
    if(count > 0) {
        if (count > 99) {
            $("#noticeNum").text('99+');
            $("#noticeNum").css({visibility: 'visible'});
        } else {
            $("#noticeNum").text(count);
            $("#noticeNum").css({visibility: 'visible'});
        }
    } else {
        $("#noticeNum").css({visibility: 'hidden'});
    }

}

/**
 * 打开登录切换弹窗
 * @param userId
 */
function openLoginSwitchWin() {
    var userId = baseFuncInfo.userInfoData.userid;
    var url = $.config.server + "/system/loginSwitch?id=" + userId;
    var title = "切换中心";
    _layerOpen({
        url: url,  // 弹框自定义的url，会默认采取type=2
        width: 400, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 370,  // 弹框自定义的高度，方法会自动判断是否超过高度
        title: title, // 弹框标题
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.onLoginSwitch(
                //成功保存之后的操作，刷新页面
                function success(data) {
                    successToast("切换中心成功");
                    baseFuncInfo.onLoginSuccess(data);
                    layer.close(index); // 如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 判断是否为JSON格式
 * @param str
 * @returns {boolean}
 */
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
    return true;
}


