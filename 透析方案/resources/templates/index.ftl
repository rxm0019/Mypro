<#include "base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>血透智能信息管理系统</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <!--layuiadmin的css-->
    <link href="${ctxsta}/static/images/favicon.ico" rel="icon" type="image/x-ico"/>
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css?v=1">
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/css/font/menufont/iconfont.css"/>
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/css/dis_layout.css?t=${currentTimeMillis}"/>
    <style>
        #LAY_app_tabsheader li:first-child {
            display: none;
        }
    </style>
</head>
<body class="layui-layout-body" ms-controller="indexInfo">

<div id="LAY_app">
    <div class="layui-layout layui-layout-admin">
        <div class="layui-header">
            <!-- 头部区域 -->
            <ul class="layui-nav layui-layout-left">
                <li class="layui-nav-item layadmin-flexible" lay-unselect>
                    <a href="javascript:;" layadmin-event="flexible" title="侧边伸缩">
                        <i class="layui-icon layui-icon-shrink-right" id="LAY_app_flexible"></i>
                    </a>
                </li>
                <li class="layui-nav-item" lay-unselect>
                    <!-- 头部导航 -->
                    <div class="layui-breadcrumb">
                        <a><cite>首页</cite></a>
                    </div>
                </li>
            </ul>
            <ul class="layui-nav layui-layout-right" lay-filter="layadmin-layout-right">
                <!-- 当前中心 -->
                <li class="layui-nav-item layui-hide-xs" lay-unselect
                    style="font-size: 16px; color: rgb(153, 153, 153);">
                    <a href="javascript:;" onclick="openLoginSwitchWin()">
                        <i class="layui-icon layui-icon-location mr-5"></i>
                        <span :text="@baseFuncInfo.userInfoData.loginHospitalName"></span>
                        <span style="color: rgb(251, 123, 123);" :text="@baseFuncInfo.userInfoData.isArchiveQuery ? '(归档)' : ''"></span>
                    </a>
                </li>

                <li class="layui-nav-item" lay-unselect>
                    <a href="javascript:;" onclick="send()" layadmin-event="message" lay-text="消息中心">
                        <i class="layui-icon layui-icon-notice"></i>

                        <span class="layui-badge" id="noticeNum"></span>
                    </a>
                </li>
                <li class="layui-nav-item layui-hide-xs" lay-unselect>
                    <a href="javascript:;" layadmin-event="fullscreen">
                        <i class="layui-icon layui-icon-screen-full"></i>
                    </a>
                </li>
                <li class="layui-nav-item" lay-unselect>
                    <a href="javascript:;" layadmin-event="refresh" title="刷新">
                        <i class="layui-icon layui-icon-refresh-3"></i>
                    </a>
                </li>
                <li class="layui-nav-item mr-15" lay-unselect>
                    <a href="javascript:;">
                        <cite ms-text="'欢迎，'+@baseFuncInfo.userInfoData.username"></cite>
                    </a>
                    <dl class="layui-nav-child">
                        <dd style="text-align: center;"><a
                                    ms-attr="{'lay-href': '${ctxsta}/system/sysUserPwd?id='+@baseFuncInfo.userInfoData.userid}">修改密码</a>
                        </dd>
                        <hr>
                        <dd style="text-align: center;"><a href="javascript:void(0);" onclick="onRefreshDictData()">刷新数据字典</a></dd>
                        <hr>
                        <dd style="text-align: center;"><a href="javascript:void(0);" onclick="onToggleArchiveQuery()" :text="@baseFuncInfo.userInfoData.isArchiveQuery ? '关闭归档查询' : '启用归档查询'"></a></dd>
                        <hr>
                        <dd style="text-align: center;"><a
                                    ms-attr="{'lay-href': '${ctxsta}/system/sysUserManualList?manunal=Y'}">使用手册</a>
                        </dd>
                        <hr>
                        <dd style="text-align: center;"><a href="javascript:void(0);" onclick="onLogout()">退出</a></dd>
                    </dl>
                </li>
            </ul>
        </div>

        <!-- 侧边菜单 -->
        <div class="layui-side layui-side-menu">
            <div class="layui-side-scroll">
                <div class="layui-logo">
                    <div class="layui-logo" lay-href="home/console.html">
                        <img src="${ctxsta}/static/images/dis-logo.png" width="128px" height="56px"/>
                    </div>
                </div>

                <ul class="layui-nav layui-nav-tree" lay-shrink="all" id="LAY-system-side-menu"
                    lay-filter="layadmin-system-side-menu">
                    <li data-name="home" :class="['layui-nav-item',$index==0&&'layui-nav-itemed']"
                        ms-for="($index,el) in @baseFuncInfo.getMenus()">
                        <#--<%--没有二级菜单--%>-->
                        <a ms-if="el.children && el.children.length==0" href="javascript:;"
                           ms-attr="{'lay-href':'${ctxsta}'+@el.menuUrl,'lay-tips':@el.menuName}" lay-direction="2">
                            <i ms-if="@el.menuImg==null||el.menuImg==''"
                               :class="['layui-icon',@el.menuIcon==''?'layui-icon-component':el.menuIcon]"></i>
                            <img class="menu-img" ms-if="@el.menuImg!=null&&el.menuImg!=''"
                                 ms-attr="{src: '${ctxsta}'+@el.menuImg}" onerror="this.style.display='none'">
                            <cite ms-text="@el.menuName"></cite>
                        </a>
                        <#-- <%--有二级菜单--%>-->
                        <a ms-if="el.children && el.children.length>0" href="javascript:;"
                           ms-attr="{'lay-tips':@el.menuName}" lay-direction="2">
                            <i ms-if="@el.menuImg==null||el.menuImg==''"
                               :class="['layui-icon',@el.menuIcon==''?'layui-icon-component':el.menuIcon]"></i>
                            <img class="menu-img" ms-if="@el.menuImg!=null&&el.menuImg!=''"
                                 ms-attr="{src: '${ctxsta}'+@el.menuImg}" onerror="this.style.display='none'">
                            <cite ms-text="@el.menuName"></cite>
                        </a>
                        <#--<%--有二级菜单--%>-->
                        <dl ms-if="el.children && el.children.length>0" class="layui-nav-child">
                            <dd ms-for="($index2,e2) in el.children">
                                <#--<%--没有三级菜单--%>-->
                                <a ms-if="@e2.children && @e2.children.length==0"
                                   ms-attr="{'lay-href': '${ctxsta}'+@e2.menuUrl}">
                                    <i ms-if="@e2.menuImg==null||e2.menuImg==''"
                                       :class="['layui-icon',@e2.menuIcon==''?'':e2.menuIcon]"></i>
                                    <img class="menu-img" ms-if="@e2.menuImg!=null&&e2.menuImg!=''"
                                         ms-attr="{src: '${ctxsta}'+@e2.menuImg}" onerror="this.style.display='none'">
                                    <cite ms-text="@e2.menuName"></cite>
                                </a>
                                <#--<%--有三级菜单--%>-->
                                <a ms-if="@e2.children && @e2.children.length>0" href="javascript:;">
                                    <i ms-if="@e2.menuImg==null||e2.menuImg==''"
                                       :class="['layui-icon',@e2.menuIcon==''?'':e2.menuIcon]"></i>
                                    <img class="menu-img" ms-if="@e2.menuImg!=null&&e2.menuImg!=''"
                                         ms-attr="{src: '${ctxsta}'+@e2.menuImg}" onerror="this.style.display='none'">
                                    <cite ms-text="@e2.menuName"></cite>
                                </a>
                                <dl ms-if="@e2.children && @e2.children.length>0" class="layui-nav-child">
                                    <dd ms-for="($index3,e3) in e2.children">

                                        <#--                                        <a ms-attr="{'lay-href': '${ctxsta}'+@e3.menuUrl}">-->
                                        <#--                                            <i ms-if="@e3.menuImg==null||e3.menuImg==''" :class="['layui-icon',@e3.menuIcon==''?'':e3.menuIcon]" style="left:35px"></i>-->
                                        <#--                                            <img class='menu-img' style="left:35px;" ms-if="@e3.menuImg!=null&&e3.menuImg!=''"-->
                                        <#--                                                 ms-attr="{src: '${ctxsta}'+@e3.menuImg}" onerror="this.style.display='none'">-->
                                        <#--                                            <cite ms-text="@e3.menuName"></cite>-->
                                        <#--                                        </a>-->
                                        <#--<%--没有四级菜单--%>-->
                                        <a ms-if="@e3.children && @e3.children.length==0"
                                           ms-attr="{'lay-href': '${ctxsta}'+@e3.menuUrl}">
                                            <i ms-if="@e3.menuImg==null||e3.menuImg==''"
                                               :class="['layui-icon',@e3.menuIcon==''?'':e3.menuIcon]"></i>
                                            <img class="menu-img" ms-if="@e3.menuImg!=null&&e3.menuImg!=''"
                                                 ms-attr="{src: '${ctxsta}'+@e3.menuImg}"
                                                 onerror="this.style.display='none'">
                                            <cite ms-text="@e3.menuName"></cite>
                                        </a>
                                        <#--<%--有四级菜单--%>-->
                                        <a ms-if="@e3.children && @e3.children.length>0" href="javascript:;">
                                            <i ms-if="@e3.menuImg==null||e3.menuImg==''"
                                               :class="['layui-icon',@e3.menuIcon==''?'':e3.menuIcon]"></i>
                                            <img class="menu-img" ms-if="@e3.menuImg!=null&&e3.menuImg!=''"
                                                 ms-attr="{src: '${ctxsta}'+@e3.menuImg}"
                                                 onerror="this.style.display='none'">
                                            <cite ms-text="@e3.menuName"></cite>
                                        </a>
                                        <dl ms-if="@e3.children && @e3.children.length>0" class="layui-nav-child">
                                            <dd ms-for="($index4,e4) in e3.children">
                                                <a ms-attr="{'lay-href': '${ctxsta}'+@e4.menuUrl}">
                                                    <i ms-if="@e4.menuImg==null||e4.menuImg==''"
                                                       :class="['layui-icon',@e4.menuIcon==''?'':e4.menuIcon]"
                                                       style="left:35px"></i>
                                                    <img class='menu-img' style="left:35px;"
                                                         ms-if="@e4.menuImg!=null&&e4.menuImg!=''"
                                                         ms-attr="{src: '${ctxsta}'+@e4.menuImg}"
                                                         onerror="this.style.display='none'">
                                                    <cite ms-text="@e4.menuName"></cite>
                                                </a>
                                            </dd>
                                        </dl>
                                    </dd>
                                </dl>
                            </dd>
                        </dl>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 页面标签 -->
        <div class="layadmin-pagetabs" id="LAY_app_tabs">
            <div class="layui-icon layadmin-tabs-control layui-icon-prev" layadmin-event="leftPage"></div>
            <div class="layui-icon layadmin-tabs-control layui-icon-next" layadmin-event="rightPage"></div>
            <div class="layui-icon layadmin-tabs-control layui-icon-down">
                <ul class="layui-nav layadmin-tabs-select" lay-filter="layadmin-pagetabs-nav">
                    <li class="layui-nav-item" lay-unselect>
                        <a href="javascript:;"></a>
                        <dl class="layui-nav-child layui-anim-fadein">
                            <dd layadmin-event="closeThisTabs"><a href="javascript:;">关闭当前标签页</a></dd>
                            <dd layadmin-event="closeOtherTabs"><a href="javascript:;">关闭其它标签页</a></dd>
                            <dd layadmin-event="closeAllTabs"><a href="javascript:;">关闭全部标签页</a></dd>
                        </dl>
                    </li>
                </ul>
            </div>
            <div class="layui-tab" lay-unauto lay-allowClose="true" lay-filter="layadmin-layout-tabs">
                <ul class="layui-tab-title" id="LAY_app_tabsheader">
                    <li lay-id="" lay-attr="" class="layui-this">
                        <i class="layui-icon layui-icon-home"></i>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 主体内容 -->
        <div class="layui-body" id="LAY_app_body">
            <div class="layadmin-tabsbody-item layui-show">
<#--                <iframe src="${ctxsta}/patient/diaStatisticsList" frameborder="0" class="layadmin-iframe"></iframe>-->
            </div>
        </div>

        <!-- 辅助元素，一般用于移动设备下遮罩 -->
        <div class="layadmin-body-shade" layadmin-event="shade"></div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/index.js?t=${currentTimeMillis}"></script>
<#--<script src="https://cdn.bootcss.com/sockjs-client/1.5.0/sockjs.min.js"></script>-->
<script type="text/javascript" src="${ctxsta}/static/lib/sockjs.min.js"></script>
<script type="text/javascript" src="${ctxsta}/static/lib/stomp.min.js"></script>
<#--<script src="https://cdn.bootcss.com/stomp.js/2.3.3/stomp.min.js"></script>-->
<script type="text/javascript" src="${ctxsta}/static/js/ReconnetWebsocket.js?t=${currentTimeMillis}"></script>
</body>
</html>



