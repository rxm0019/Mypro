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
    tbody .laytable-cell-1-0-6 {
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
    .remove{
        position: absolute;
        z-index: 2;
        background-image: url('${ctxsta}/static/images/remove.png');
        background-size: 15px 15px;
        background-repeat: no-repeat;
        border-radius: 50%;
        width: 15px;
        height: 15px;
        left: -12px;
        top: -8px;
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
    #tool-img {
        height: 60px;
        width: 60px;
        cursor: pointer;
    }
    .tool-img-selected {
        background-color: #76C0BB;
        border-radius: 3px;
    }
</style>
<body ms-controller="patVascularRoadList">
<div class="layui-fluid">
    <div class="layui-card">
        <div class="layui-card-body" style="padding: 10px">

            <!-- 血管通路表格 -->
            <div class="layui-row layui-col-space1">
                <blockquote class="layui-elem-quote">血管通路建立</blockquote>
                <hr style="height: 1px; background: #76C0BB">
                <!--工具栏的按钮的div，注意：需要增加权限控制-->
                <div style="padding-bottom: 10px;" id="patVascularRoadList_tool">
                    <button :visible="@baseFuncInfo.authorityTag('patVascularRoadList#add')"
                            class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                </div>
                <!--table定义-->
                <table id="patVascularRoadList_table" lay-filter="patVascularRoadList_table"></table>
            </div>

            <!-- 分隔线 -->
            <hr style="height: 1px; margin: 20px 10px;background-color: #76C0BB !important;" ms-if="punctureShow || conduitShow">

            <!-- 血管通路监察与监测-穿刺方案 -->
            <div class="layui-row layui-col-space1">
                <div class="layui-tab" lay-filter="punctureTab" ms-if="punctureShow || conduitShow">
                    <ul class="layui-tab-title" style="margin: 0 10px;">
                        <li lay-id="puncturePlan" ms-if="punctureShow">穿刺方案</li>
                        <li lay-id="pipleDetail" ms-if="conduitShow">导管概况</li>
                        <li lay-id="roadPicture">通路图</li>
                        <li lay-id="punctureRecord" ms-if="punctureShow">穿刺记录</li>
                        <li lay-id="bloodFlowRecord">血流量记录</li>
                        <li lay-id="assistCheck">辅助检查</li>
                        <li lay-id="cure">介入治疗</li>
                    </ul>
                    <div class="layui-tab-content">
                        <!-- 穿刺方案 -->
                        <div class="layui-tab-item" ms-if="punctureShow">
                            <!--工具栏的按钮的div，注意：需要增加权限控制-->
                            <div style="margin-bottom: 10px;width: 100%;position:relative; height: 40px;"
                                 id="patVascularPunctureEdit_tool">
                                <button :visible="@baseFuncInfo.authorityTag('patVascularRoadList#punctureEdit')"
                                        ms-if="punctureBtnShow"
                                        class="layui-btn layui-btn-dismain" id="punctureEdit"
                                        onclick="punctureEdit()">修改
                                </button>
                                <button class="layui-btn layui-btn-dismain" ms-if="!punctureBtnShow" :visible="@baseFuncInfo.authorityTag('patVascularRoadList#punctureSave')" onclick="updatePatVascularPunctureEdit()" style="position:absolute;right: 90px;">保存</button>
                                <button class="layui-btn layui-btn-dismain" onclick="cancelPunctureEdit()" ms-if="!punctureBtnShow"
                                        style="position:absolute;right: 10px;">取消
                                </button>
                            </div>
                            <div class="layui-form" lay-filter="patVascularPunctureEdit_form" id="patVascularPunctureEdit_form">
                                <div class="box-border">
                                    <div class="layui-form-item  layui-hide">
                                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                            <div class="disui-form-flex">
                                                <input type="hidden" name="vascularPunctureId" id="vascularPunctureId" autocomplete="off">
                                            </div>
                                        </div>
                                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                            <div class="disui-form-flex">
                                                <input type="hidden" name="vascularRoadId" id="vascularRoadId" autocomplete="off">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-row layui-col-space1">
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>制定时间：</label>
                                                <input type="text" name="schemeDate" id="schemeDate" readonly lay-verify="required"
                                                       placeholder="yyyy-MM-dd"
                                                       autocomplete="off" :attr="@disabled">
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>制定人：</label>
                                                <select name="schemeUserId" id="schemeUserId"  class="select" lay-verify="required" :attr="@disabled">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.id}" ms-text="@el.userName"
                                                            ms-for="($index, el) in doctorMakers"></option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <#-- 动脉端 -->
                                    <div class="layui-row layui-col-space1">
                                        <fieldset class="layui-elem-field layui-field-title" style="margin: 10px 0;">
                                            <legend>动脉端（A）</legend>
                                        </fieldset>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>穿刺方式：</label>
                                                <select name="arteryWay" id="arteryWay" lay-verify="required" class="select" :attr="@disabled">
                                                    <option value=""></option>
                                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('PunctureWay')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>穿刺针类型：</label>
                                                <select name="arteryNeedleType" id="arteryNeedleType" lay-verify="required" class="select" :attr="@disabled">
                                                    <option value=""></option>
                                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('PunctureNeedleType')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>穿刺针型号：</label>
                                                <select name="arteryNeedleNum" id="arteryNeedleNum" lay-verify="required" class="select" :attr="@disabled">
                                                    <option value=""></option>
                                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('PunctureNeedleNum')"></option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <#-- 静脉端 -->
                                    <div class="layui-row layui-col-space1">
                                        <fieldset class="layui-elem-field layui-field-title" style="margin: 10px 0;">
                                            <legend>静脉端（V）</legend>
                                        </fieldset>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>穿刺方式：</label>
                                                <select name="veinWay" id="veinWay" lay-verify="required" class="select" :attr="@disabled">
                                                    <option value=""></option>
                                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('PunctureWay')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>穿刺针类型：</label>
                                                <select name="veinNeedleType" id="veinNeedleType" lay-verify="required" class="select" :attr="@disabled">
                                                    <option value=""></option>
                                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('PunctureNeedleType')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>穿刺针型号：</label>
                                                <select name="veinNeedleNum" id="veinNeedleNum" lay-verify="required" class="select" :attr="@disabled">
                                                    <option value=""></option>
                                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('PunctureNeedleNum')"></option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
                                <div class="layui-form-item layui-hide">
                                    <button class="layui-btn" lay-submit lay-filter="patVascularPunctureEdit_submit" id="patVascularPunctureEdit_submit">提交</button>
                                </div>
                            </div>
                        </div>
                        <!-- 导管概况 -->
                        <div class="layui-tab-item" ms-if="conduitShow">
                            <!--工具栏的按钮的div，注意：需要增加权限控制-->
                            <div style="margin-bottom: 10px;width: 100%;position:relative; height: 40px;"
                                 id="patVascularConduitEdit_tool">
                                <button :visible="@baseFuncInfo.authorityTag('patVascularRoadList#conduitEdit')"
                                        ms-if="conduitBtnShow"
                                        class="layui-btn layui-btn-dismain" id="conduitEdit"
                                        onclick="conduitEdit()">修改
                                </button>
                                <button class="layui-btn layui-btn-dismain" :visible="@baseFuncInfo.authorityTag('patVascularRoadList#conduitSave')" ms-if="!conduitBtnShow" onclick="updatePatVascularConduitEdit()" style="position:absolute;right: 90px;">保存</button>
                                <button class="layui-btn layui-btn-dismain" onclick="cancelConduitEdit()" ms-if="!conduitBtnShow"
                                        style="position:absolute;right: 10px;">取消
                                </button>
                            </div>
                            <div class="layui-form" lay-filter="patVascularConduitEdit_form" id="patVascularConduitEdit_form">
                                <div class="box-border">
                                    <div class="layui-form-item  layui-hide">
                                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                            <div class="disui-form-flex">
                                                <input type="hidden" name="vascularConduitId" id="vascularConduitId" autocomplete="off">
                                            </div>
                                        </div>
                                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                            <div class="disui-form-flex">
                                                <input type="hidden" name="vascularRoadId" autocomplete="off">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-row layui-col-space1">
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>制定时间：</label>
                                                <input type="text" name="schemeDate" id="conduitSchemeDate" readonly lay-verify="required"
                                                       placeholder="yyyy-MM-dd"
                                                       autocomplete="off" :attr="@conduitDisabled">
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>制定人：</label>
                                                <select name="schemeUserId" id="schemeUserId" lay-verify="required" class="select" :attr="@conduitDisabled">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.id}" ms-text="@el.userName"
                                                            ms-for="($index, el) in doctorMakers"></option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="layui-row layui-col-space1">
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>导管外置长度：</label>
                                                <input type="text" name="externalLength" maxlength="5" id="externalLength" lay-verify="required|number" :attr="@readonly" placeholder="请输入">
                                                <span class="span-class">cm</span>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>动脉端(A)：</label>
                                                <select name="arteryStatus" id="arteryStatus" lay-verify="required" class="select" :attr="@conduitDisabled">
                                                    <option value=""></option>
                                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('ConduitStatus')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>静脉端(V)：</label>
                                                <select name="veinStatus" id="veinStatus" lay-verify="required" class="select" :attr="@conduitDisabled">
                                                    <option value=""></option>
                                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('ConduitStatus')"></option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="layui-row layui-col-space1">
                                        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>封管方式：</label>
                                                <select name="sealingPipe" id="sealingPipe" lay-verify="required" class="select" :attr="@conduitDisabled">
                                                    <option value=""></option>
                                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('SealingPipe')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>管腔容量：</label>
                                                <span class="span-class">A</span>
                                                <input type="text" name="arteryVolume" maxlength="5" id="arteryVolume" lay-verify="required|number" :attr="@readonly">
                                                <span class="span-class">ml / V </span>
                                                <input type="text" name="veinVolume" id="veinVolume" maxlength="5" lay-verify="required|number" :attr="@readonly">
                                                <span class="span-class">ml</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
                                <div class="layui-form-item layui-hide">
                                    <button class="layui-btn" lay-submit lay-filter="patVascularConduitEdit_submit" id="patVascularConduitEdit_submit">提交</button>
                                </div>
                            </div>
                        </div>
                        <!-- 通路图 -->
                        <div class="layui-tab-item">
                            <div class="layui-row layui-col-space1">
                                <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" style="padding-right: 20px;">
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
                                            <div style="font-size: 12px; color: #000000;display: inline-block;width: calc(100% - 90px); float: right;">说明：中心点对准穿刺点，直线与血管平行，时钟刻度为进针方位，用A端/V端进针方位的箭头指示</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 穿刺记录 -->
                        <div class="layui-tab-item" ms-if="punctureShow">
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
                        <!-- 辅助检查 -->
                        <div class="layui-tab-item">
                            <div class="layui-form-item">
                                <div class="layui-inline">
                                    <label class="layui-form-label">检查日期：</label>
                                    <div class="layui-input-block">
                                        <div class="layui-input-inline">
                                            <input type="text" id="assistCheckDate_start" readonly class="layui-input">
                                        </div>
                                        <div class="layui-form-mid layui-word-aux"> - </div>
                                        <div class="layui-input-inline">
                                            <input type="text" id="assistCheckDate_end" readonly class="layui-input">
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-inline">
                                    <div class="layui-input-block">
                                        <div class="layui-input-inline">
                                            <button class="layui-btn layui-btn-dismain"  onclick="searchAssistCheck()">查询</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="padding-left: 15px;margin-bottom: 5px;">
                                <button :visible="@baseFuncInfo.authorityTag('patVascularRoadList#inspectAdd')" class="layui-btn layui-btn-dismain" id="inspectAdd" onclick="inspectSaveOrEdit()">添加</button>
                            </div>
                            <table id="patVascularInspect_table" lay-filter="patVascularInspect_table"></table>
                        </div>
                        <!-- 介入治疗 -->
                        <div class="layui-tab-item">
                            <div class="layui-form-item">
                                <div class="layui-inline">
                                    <label class="layui-form-label">治疗日期：</label>
                                    <div class="layui-input-block">
                                        <div class="layui-input-inline">
                                            <input type="text" id="therapyDate_start" readonly class="layui-input">
                                        </div>
                                        <div class="layui-form-mid layui-word-aux"> - </div>
                                        <div class="layui-input-inline">
                                            <input type="text" id="therapyDate_end" readonly class="layui-input">
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-inline">
                                    <div class="layui-input-block">
                                        <div class="layui-input-inline">
                                            <button class="layui-btn layui-btn-dismain"  onclick="searchTherapy()">查询</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="padding-left: 15px;margin-bottom: 5px;">
                                <button :visible="@baseFuncInfo.authorityTag('patVascularRoadList#therapyAdd')" class="layui-btn layui-btn-dismain" id="therapyAdd" onclick="therapySaveOrEdit()">添加</button>
                            </div>
                            <table id="patVascularTherapy_table" lay-filter="patVascularTherapy_table"></table>
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
<script type="text/javascript" src="${ctxsta}/static/js/patient/patVascularRoadList.js?t=${currentTimeMillis}"></script>
</body>
</html>