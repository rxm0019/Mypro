<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <style>

        /*聊天窗口*/
        .layui-card{
            height:511px;
            width:100%;
        }

        /*用户列表窗口*/
        .chat-user-list{
            width: 199px;
            height: 501px;
            float: left;
            background-color:#FFFFFFf;
            overflow-x:hidden;
            border-right: solid rgb(242,242,242) 1px;
        }

        /*消息内容列表窗口*/
        .chat-main-list{
            width: 592px;
            height: 475px;
            float: right;
            background-color:#FFFFFFf;
            overflow-x:hidden;
        }
        .chat-user-list ul li {
            list-style: none;
            height: 50px;
            border-radius: 5px;
            margin: 5px;
            padding: 5px;
            line-height: 50px;
            margin: 5px 0px;
            cursor: pointer;
        }

        /*用户列表div.span*/
        .span{
            display: inline-block;
        }
        /* 用户名和时间区域*/
        .chat-user-list ul li .user_span{
            float: left;
            display: inline-block;
            width: 100px;
            margin: 0 0 0 10px;
        }
        /*用户列表-用户名*/
        .user_span .user_name{
            float: left;
            display: inline-block;
            width: 60px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap
        }
        /*用户列表-时间*/
        .user_span .sendTime{
            float: right;
        }

        .chat-user-list ul li:hover{
            background-color:rgb(199,199,199);
        }
        /*聊天内容列表*/
        .chat-main-list ul li{
            list-style: none;
            height: auto;
            width: 460px;
            margin-bottom: 10px;
        }
        .chat-text .text{
            display: inline-block;
            width: 430px;
            word-wrap:break-word;
            word-break:normal;
        }

        .chat-main-list ul span{
            margin: 5px;
        }

        /*左边消息*/
        .chat-main-list .textLeft{
            margin-left: 10px;
            float: left;
        }

        /*右边消息*/
        .chat-main-list ul .textRight{
            float: right;
            margin-right: 10px;
            text-align: right;
        }

        .chat-main-list ul .textRight .chat-text {
            text-align: left;
        }

        /*清空按钮*/
        .removeMe{
            position: fixed;
            bottom: 20px;
            right: 30px;
            cursor: pointer;
        }

        /*聊天消息文本内容*/
        .chat-text{
            padding: 3px;
            margin-top: 3px;
            background-color: rgb(118,192,187);
            border-radius: 5px;
            width: 440px;
            height: auto;
            color: #FFFFFF;
            display: inline-block;
        }

        /*背景头像*/
        .img{
            float: left;
            width: 50px;
            height: 50px;
            border-radius: 100%;
            background-color: #1E9FFF;
            color: #FFFFFF;
            line-height: 50px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            display: inline-block;
        }
        .onTrick{
            background-color:rgb(199,199,199,0.5);
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="messageCenterList">
<div class="layui-fluid">
    <div class="layui-card">
        <div class="chat-user-list">
            <ul id="userList">
            </ul>
        </div>
        <div class="chat-main-list">
            <ul id="chatList">
            </ul>
            <div class="removeMe">
                <button id="clean" class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" type="button" value="清空所有消息" onclick="cleanStorage()">清空</button>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/system/messageCenterList.js?t=${currentTimeMillis}"></script>
</body>
</html>