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
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<style type="text/css">
    /*.layui-table-cell {*/
    /*    height: 30px;*/
    /*    line-height: 30px;*/
    /*}*/
    .laytable-cell-1-0-6 {
        line-height: 15px;
    }
    .layui-elem-quote{
        background-color: #FFF;
        line-height: 15px;
        padding: 5px;
        margin-top: 10px;
        border-left: 4px solid #76C0BB;
        font-weight: bold;
        color: #76C0BB;
    }
    .layui-elem-field legend{
        font-size: 14px;
    }
    .span-class{
        float: left;
        line-height: 38px;
        margin-left: 5px;
    }
    .layui-row .disui-form-flex>label{
        flex-basis: 120px;
    }
    .box-border {
        border: 1px solid #cccccc;
        border-radius: 10px;
        padding: 10px;
    }
    .tag-title{
        text-align: center;
        height: 30px;
        line-height:30px;
        border-bottom: 1px solid #cccccc;
        color: #000000;
    }
    .num-div{
        height: 45px;
        line-height: 45px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
    }
    .tag-num{
        background: #CCCCCC;
        border-radius: 50%;
        display: inline-block;
        width: 35px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        color: #ffffff;
        cursor: pointer;
    }
    .needle-color{
        position: absolute;
        background: #FF784E;
        width: 18px;
        height: 18px;
        color: #ffffff;
        line-height: 18px;
        text-align: center;
        border-radius: 50%;
        top: 2px;
    }
    .needle-style{
        position: absolute;
        left: 18px;
        top: 20px;
        border-top: 1px #FF784E solid;
        width: 15px;
        /** 旋转30° **/
        transform:rotate(30deg);
        -webkit-transform:rotate(30deg);
        -moz-transform:rotate(30deg);
    }
    #tool-img {
        height: 60px;
        width: 60px;
        cursor: pointer;
    }
    .tool-img-selected {
        background-color: #76C0BB;
        border-radius: 3px;
    }
    .text-style{
        height: 24px;
        line-height: 24px;
        padding: 0 6px;
        border: 1px solid #cccccc;
        text-align: center;
        border-radius: 5px;
        font-size: 12px;
        color: #000000;
        display: inline-block;
        margin-left: 15px;
        margin-bottom: 10px;
        cursor: pointer;
    }
    .layui-fluid{
        padding-top: 0 !important;
    }
    .currentA{
        background: #FF784E;
    }
    .currentV{
        background: #4BB2FF;
    }
    .currentTag{
        background: #76c0bb;
        color: #ffffff;
    }
    .needle-no{
        width: 25px;
        height: 25px;
        background: #FF784E;
        display: inline-block;
        color: #ffffff;
        text-align: center;
        line-height: 25px;
        border-radius: 25px;
    }
    .rotate{
        position: absolute;
        z-index: 2;
        background-image: url('${ctxsta}/static/images/rotate.png');
        background-size: 15px 15px;
        background-repeat: no-repeat;
        border-radius: 50%;
        width: 15px;
        height: 15px;
        left: -15px;
        top: 4px;
    }
    .tag-div{
        position: absolute;
        border: 1px solid rgb(204, 204, 204);
        color: rgb(0, 0, 0);
        border-radius: 7px;
        font-size: 11px;
        padding: 0px 5px;
        background: rgb(255, 255, 255);
        height: 23px;
        line-height: 23px;
        cursor: pointer;
    }
    .move {
        z-index: 2;
    }
    .active{
        z-index: 3;
    }
</style>
<body ms-controller="diaVascularRoadList">
<div class="layui-fluid">
    <div class="layui-card">
        <div class="layui-card-body" style="padding: 10px 30px">

            <!-- 血管通路监察与监测-穿刺方案 -->
            <div class="layui-row layui-col-space1">
                <div class="layui-tab" lay-filter="punctureTab">
                    <ul class="layui-tab-title" style="margin: 0 10px;">
                        <li lay-id="roadPicture" class="layui-this">通路图</li>
                        <li lay-id="punctureRecord">穿刺记录</li>
                        <li lay-id="bloodFlowRecord">血流量记录</li>

                    </ul>
                    <div class="layui-tab-content">
                        <!-- 通路图 -->
                        <div class="layui-tab-item layui-show">
                            <div class="layui-row layui-col-space1">
                                <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                                    <div class="layui-inline" style="margin-bottom: 0;width: 100%;">
                                        <div class="layui-input-inline">
                                            <button class="layui-btn layui-btn-dismain" ms-if="roadBtnShow" onclick="editRoad()">修改</button>
                                            <button class="layui-btn layui-btn-dismain" ms-if="!roadBtnShow" id="changeRoadImg">更换背景图</button>
                                        </div>
                                        <div class="layui-input-inline" style="margin-left: 20px;" ms-if="roadBtnShow">
                                            <button class="layui-btn layui-btn-dismain"  onclick="viewHistory()">查看历史</button>
                                        </div>
                                        <div class="layui-input-inline" style="position: absolute; right: 100px;" ms-if="!roadBtnShow">
                                            <button class="layui-btn layui-btn-dismain" id="saveRoadImg" onclick="saveRoadImg()">保存</button>
                                        </div>
                                        <div class="layui-input-inline" style="position: absolute; right: 20px;" ms-if="!roadBtnShow">
                                            <button class="layui-btn layui-btn-dismain"  onclick="cancelRoad()">取消</button>
                                        </div>
                                    </div>
                                    <div style="width: 100%;position: relative;" id="imgDiv">
                                        <img style="width: 100%;" id="showImgDiv" ondblclick="showBigImg(this)">
                                    </div>

                                </div>
<#--                                <div class="layui-col-sm1 layui-col-md1 layui-col-lg1"></div>-->
                                <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                                    <fieldset class="layui-elem-field layui-field-title">
                                        <legend>快速标记</legend>
                                    </fieldset>
                                    <div style="border: 1px solid #cccccc;margin: 10px;">
                                        <div class="tag-title">
                                            <div style="position: relative; width: 100px;display: inline-block;">
                                                <div class="needle-color">1</div>
                                                <div class="needle-style"></div>
                                                <span>A端</span>
                                            </div>
                                        </div>
                                        <div class="num-div">
                                            <div class="tag-num" ms-for="($index, value) in needle" ms-attr="{value:value,id:'a'+value}" onclick="aClick(this)">{{value}}</div>
                                        </div>
                                    </div>
                                    <div style="border: 1px solid #cccccc;margin: 10px;">
                                        <div class="tag-title">
                                            <div style="position: relative; width: 100px;display: inline-block;">
                                                <div class="needle-color" style="background: #4BB2FF">1</div>
                                                <div class="needle-style" style="border-top: 1px #4BB2FF solid;"></div>
                                                <span>V端</span>
                                            </div>
                                        </div>
                                        <div class="num-div">
                                            <div class="tag-num" ms-for="($index, value) in needle" ms-attr="{value:value,id:'v'+value}" onclick="vClick(this)">{{value}}</div>
                                        </div>
                                    </div>
                                    <div style="border: 1px solid #cccccc;margin: 10px;">
                                        <div class="tag-title">标签</div>
                                        <div style="padding: 10px 0;">
                                            <div class="text-style" onclick="tagClick(this)" data-id="puncture-angle" id="puncture-angle">穿刺角度</div>
                                            <div class="text-style" onclick="tagClick(this)" data-id="back-up" id="back-up">手背朝上</div>
                                            <div class="text-style" onclick="tagClick(this)" data-id="palm-up" id="palm-up">手掌朝上</div>
                                            <div class="text-style" onclick="tagClick(this)" data-id="a-side" id="a-side">A端</div>
                                            <div class="text-style" onclick="tagClick(this)" data-id="v-side" id="v-side">V端</div>
                                            <div class="text-style" onclick="tagClick(this)" data-id="a-side-direction" id="a-side-direction">A端进针方向</div>
                                            <div class="text-style" onclick="tagClick(this)" data-id="v-side-direction" id="v-side-direction">V端进针方向</div>
                                            <div class="text-style" onclick="tagClick(this)" data-id="custom" id="custom">自定义</div>
                                        </div>
                                    </div>
                                    <div style="border: 1px solid #cccccc;margin: 10px;">
                                        <div class="tag-title">辅助工具</div>
                                        <div style="padding: 10px;">
                                            <img id="tool-img" src="${ctxsta}/static/images/auxiliary_tool.png" onclick="toolClick()">
                                            <div style="font-size: 12px; color: #000000;display: inline-block;width: calc(100% - 70px); float: right;">说明：中心点对准穿刺点，直线与血管平行，时钟刻度为进针方位，用A端/V端进针方位的箭头指示</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 穿刺记录 -->
                        <div class="layui-tab-item">
                            <div class="layui-form-item">
                                <div class="layui-inline">
                                    <label class="layui-form-label">穿刺日期：</label>
                                    <div class="layui-input-block">
                                        <div class="layui-input-inline">
                                            <input type="text" id="punctureDate_start" readonly class="layui-input">
                                        </div>
                                        <div class="layui-form-mid layui-word-aux"> - </div>
                                        <div class="layui-input-inline">
                                            <input type="text" id="punctureDate_end" readonly class="layui-input">
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-inline">
                                    <div class="layui-input-block">
                                        <div class="layui-input-inline">
                                            <button class="layui-btn layui-btn-dismain"  onclick="searchPuncture()">查询</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table id="patPunctureList_table" lay-filter="patPunctureList_table"></table>
                        </div>
                        <!-- 血流量记录 -->
                        <div class="layui-tab-item">
                            <div class="layui-form-item">
                                <div class="layui-inline">
                                    <label class="layui-form-label">监测日期：</label>
                                    <div class="layui-input-block">
                                        <div class="layui-input-inline">
                                            <input type="text" id="punctureMonitorDate_start" readonly class="layui-input">
                                        </div>
                                        <div class="layui-form-mid layui-word-aux"> - </div>
                                        <div class="layui-input-inline">
                                            <input type="text" id="punctureMonitorDate_end" readonly class="layui-input">
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-inline">
                                    <div class="layui-input-block">
                                        <div class="layui-input-inline">
                                            <button class="layui-btn layui-btn-dismain "  onclick="searchBlood()">查询</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="bloodFlowChart" style="height: 400px;width:100%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!--table的工具栏按钮定义，注意：需要增加权限控制 血管通路列表-->
            <script type="text/html" id="patVascularRoadList_bar">
                {{#  if(baseFuncInfo.authorityTag('patVascularRoadList#detail')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('patVascularRoadList#edit')){ }}
                    {{# if(d.dataStatus === '1') { }}
                        <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" style="visibility: hidden">编辑</a>
                    {{# } else { }}
                        <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">编辑</a>
                    {{# } }}
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('patVascularRoadList#enable')){ }}
                    {{# if(d.dataStatus === '1') {  }}
                        <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="enable">启用</a>
                    {{# } else { }}
                        <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="enable">停用</a>
                    {{# } }}
                {{#  } }}
            </script>

            <!--table的工具栏按钮定义，注意：需要增加权限控制 辅助检查列表-->
            <script type="text/html" id="patVascularInspectList_bar">
                {{#  if(baseFuncInfo.authorityTag('patVascularRoadList#inspectDetail')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('patVascularRoadList#inspectEdit')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">编辑</a>
                {{# } }}
                {{#  if(baseFuncInfo.authorityTag('patVascularRoadList#inspectDel')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="del">删除</a>
                {{# } }}
            </script>

            <!--table的工具栏按钮定义，注意：需要增加权限控制 辅助检查列表-->
            <script type="text/html" id="patVascularTherapyList_bar">
                {{#  if(baseFuncInfo.authorityTag('patVascularRoadList#therapyDetail')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('patVascularRoadList#therapyEdit')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">编辑</a>
                {{# } }}
                {{#  if(baseFuncInfo.authorityTag('patVascularRoadList#therapyDel')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="del">删除</a>
                {{# } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/lib/echarts/4.3.0/echarts.min.js"></script>
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaVascularRoadList.js?t=${currentTimeMillis}"></script>
</body>
</html>