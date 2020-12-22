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
        /* 患者列表控件 */
        .patient-search-layout {
            position: fixed;
            left: 10px;
            width: 250px;
            height: calc(100vh - 60px);
            /*z-index: 998;*/
            overflow-x: hidden;
            float: left;
            border: 1px solid rgba(171, 160, 148, 0.37);
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
        }
        .patient-search-layout .patient-list-error {
            text-align: center;
            padding: 50px 10px;
            color: #999;
        }
        .patient-search-layout .layui-side-scroll {
            width: 100%;
            height: calc(100vh - 150px);
        }

        /** 患者下拉选项 **/
        .patient-search-dropdown-item {
            display: flex;
            display: -webkit-flex;
            font-size: 14px;
            line-height: 20px;
            border-bottom: 1px solid #e6e6e6;
            cursor: pointer;
            box-sizing: border-box;
        }
        .patient-search-dropdown-item:hover {
            background-color: rgba(229, 241, 241, 0.5);
        }
        .patient-search-dropdown-item.selected {
            background-color: rgba(229, 241, 241, 1);
        }
        .patient-search-dropdown-item .left-wrapper{
            display: flex;
            align-items: center;
            justify-content: center;
            width:30%;
        }
        .patient-search-dropdown-item .left-wrapper > img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }
        .patient-search-dropdown-item .right-wrapper {
            width: 70%;
            display: flex;
            flex-direction: column;
            flex: 1;
            box-sizing: border-box;
            padding: 10px;
        }
        .patient-search-dropdown-item .right-wrapper > div {
            width: 100%;
            height: 50%;
        }
        .patient-search-dropdown-item .right-wrapper .one-item {
            display: flex;
            flex: 1;
            align-items: center;
        }
        .patient-search-dropdown-item .right-wrapper .two-item {
            display: flex;
            align-items: center;
        }
        .patient-search-dropdown-item .patient-age {
            display: flex;
            align-items: center
        }
        .patient-search-dropdown-item .patient-infection-status {
            margin-left:3px;
            height: 15px;
            line-height: 16px;
            padding: 0 6px;
            font-size: 12px;
        }
        .title-header{
            text-align: center;
            padding: 5px 0px;
        }
        .title-header-line{
            margin: 5px 30%;
            border-bottom: 4px solid #5FB878;
        }
        .title-header-input{
            border-color: rgba(171, 160, 148, 0.37) !important;
        }
    </style>
</head>
<body ms-controller="eduPatient">
<div class="layui-fluid">
    <div class="layui-form">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12">
                <div class="disui-form-flex" >
                    <label>宣教护士：</label>
                    <select name="userId" lay-filter="userId">
                    <option value="">全部</option>
                    <option  ms-attr="{value:el.id}" ms-text="@el.userName"
                             ms-for="($index, el) in @nurseList"></option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <#-- 患者列表 -->
    <div class="layui-card patient-search-layout" style="margin-left: 25%;">
        <div class="title-header">
            <h2>患者列表</h2>
            <div class="title-header-line"></div>
            <div class="layui-card-body">
                <div class="layui-form">
                    <div class="layui-row layui-col-space1 demo-list">
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex" >
                                <input type="text" class="title-header-input" name="patientName" id="patientName" maxlength="20"
                                       placeholder="搜索姓名/病历号" autocomplete="off"  >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <#-- 患者列表数据 -->
        <div class="layui-side-scroll">
        <#-- 显示空提示或错误信息 -->
            <div ms-if="@patientList.errorMsg" class="patient-list-error">{{patientList.errorMsg}}</div>

            <div class="patient-search-dropdown-item"  ms-for="($index,el) in @patientList.data" onclick="onSelectedPatientInfo(this)"
                 :attr="{'data-patient-id': @el.patientId}">
                <div class="left-wrapper" >
                    <img src="${ctxsta}/static/images/u6399.png">
                </div>
                <div class="right-wrapper ">
                    <div class="one-item">
                        <div class="layui-col-xs6">
                            <div class="grid-demo grid-demo-bg1">{{el.patientName}}</div>
                        </div>
                        <div class="layui-col-xs6">
                            <div class="patient-age">
                                <span>{{el.age}}岁</span>
                                <img class="before-upload" src="${ctxsta}/static/svg/male.svg">
                            </div>
                        </div>
                    </div>
                    <div class="two-item">
                        <div class="layui-col-xs9">
                            <div class="grid-demo grid-demo-bg1">{{el.patientRecordNo}}</div>
                        </div>
                        <div class="layui-col-xs4" ms-visible="@el.infectionStatus != null && @el.infectionStatus != ''">
                            <div class="layui-btn layui-btn-warm layui-btn-radius layui-btn-xs patient-infection-status">
                                {{el.infectionStatus}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>
<script type="text/javascript" src="${ctxsta}/static/js/education/eduPatient.js?t=${currentTimeMillis}"></script>
</body>
</html>