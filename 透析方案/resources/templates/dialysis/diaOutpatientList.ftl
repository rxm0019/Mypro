<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/css/dis_dialysis_layout.css?t=${currentTimeMillis}" />
    <style type="text/css">
        /** 侧边栏 **/
        .patient-layout-side {
            top: 10px;
            height: calc(100vh - 10px - 10px);
        }

        .patient-dropdown-item .right-wrapper .two-item {
            display: flex;
            align-items: center;
            padding-top: 5px;
        }
        .dis-layui-body {
            position: absolute;
            top: 10px;
            left: calc(200px + 10px + 10px);
            width: calc(100% - 200px - 10px - 12px - 10px);
            height: calc(100vh - 10px - 10px);
            float: left;
            overflow: auto;
        }
        .layui-elem-quote{
            background-color: #FFF;
            line-height: 15px;
            padding: 5px;
            margin-top: 10px;
            border-left: 4px solid #33AB9F;
            font-weight: bold;
            color: #33AB9F;
            display: inline-block;
        }
        .layui-form-radio{
            margin: 6px 0 0 0;
        }
        .layui-row .disui-form-flex>label {
            flex-basis: 80px;
        }
        #diaOutpatientDetails_table + div .layui-table-cell {
            height: 34px;
            line-height: 18px;
        }
        /* 子医嘱添加特殊背景色 */
        .sub-order-tr {
            background-color: rgba(242, 242, 242, 0.5);
        }

        /* 医嘱内容 */
        .order-content {
            display: inline-flex;
            align-content: stretch;
        }
        /* 医嘱内容 - 展开/折叠Icon */
        .order-content .icon-box {
            flex: 0 0 25px;
            padding-top: 10px;
        }
        .order-content .icon-box .layui-icon {
            border: 1px solid rgba(51, 171, 159, 1);
            color: rgba(51, 171, 159, 1);
            font-size: 12px;
            padding: 1px;
        }
        .order-content.fold .icon-box .layui-icon-subtraction:before {
            content: "\e624";
        }
        /* 医嘱内容 - 厂家 */
        .order-content .content-manufactor {
            color: #797979;
            line-height: 14px;
            font-size: 12px;
        }
        /* 医嘱内容 - 子医嘱内容缩进 */
        .order-content.sub-order .content {
            padding-left: 55px;
        }
        /** 医嘱内容过长，显示省略号 **/
        .content div {
            width: 355px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="diaOutpatientList">
<div>

    <#-- 侧边栏 -->
    <div class="patient-layout-side layui-card">
        <div class="patient-search layui-form" lay-filter="orderLayout_searchOrder">
            <div class="layui-form-item">
                <div class="layui-input-inline title-line">
                    患者列表
                </div>
            </div>
        </div>

        <#-- 患者列表  ms-visible="@patientList.isShow" -->
        <div class="patient-layout-side-list">
            <div class="layui-side-scroll">
                <div style="position: relative;">
                    <input type="text" id="patName" placeholder="患者姓名或病历号" class="layui-input" style="height: 32px;">
                    <i class="layui-icon layui-icon-search" style="position: absolute;right: 6px;top: 3px;font-size: 24px;" onclick="getPatientList()"></i>
                </div>
                <#-- 显示空提示或错误信息 -->
                <div ms-if="@patientList.errorMsg" class="patient-list-error">{{patientList.errorMsg}}</div>

                <div class="patient-dropdown-item"  ms-for="($index,el) in @patientList.data" onclick="onSelectedPatientInfo(this)"
                     :attr="{'data-patient-id': @el.patientId, 'data-patient-name': @el.patientName, 'data-patient-record-no': @el.patientRecordNo,
                     'data-gender': @el.gender, 'data-age': @el.age, 'data-stature': @el.stature, 'data-dry-weight': @el.dryWeight, 'data-insurance-types': @el.insuranceTypes,
                     'data-social-security-no': @el.socialSecurityNo, 'data-id-card-type': @el.idCardType,'data-id-card-no': @el.idCardNo,
                     'data-contact-address-complete': @el.contactAddressComplete,'data-mobile-phone':@el.mobilePhone, 'data-patient-photo':@el.patientPhoto}">
                    <div class="patient-photo-box">
                        <img ms-attr="{'src': @el.patientPhoto, 'data-gender': @el.gender}" onerror="onPatientPhotoError(this)">
                    </div>
                    <div class="patient-info-box">
                        <div class="patient-info-row">
                            <label class="patient-name">{{el.patientName}}</label>
                            <label class="patient-age">{{el.age}}岁</label>
                            <img class="patient-sex" ms-attr="{'src': '${ctxsta}' + @el.sexPic}">
                        </div>
                        <div class="patient-info-row">
                            <label class="patient-record-no">{{el.patientRecordNo}}</label>
                            <label :visible="@el.infectionStatus != null && @el.infectionStatus != ''" class="infection-status">{{el.infectionStatus}}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="layui-card dis-layui-body" style="margin-bottom: 0;">

        <!-- 处方记录 -->
        <div class="layui-card-body" style="padding: 5px;" ms-if="showPreRecord">
            <blockquote class="layui-elem-quote">处方记录</blockquote>
            <hr style="height: 1px; background: #76C0BB;margin: 0 0 10px;">

            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding-bottom: 10px;position: relative;" id="diaOutpatientList_tool">
                <button :visible="@baseFuncInfo.authorityTag('diaOutpatientList#add')"
                        class="layui-btn layui-btn-dismain"  onclick="addPrescription()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('diaOutpatientList#delete')"
                        class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>
                <button :visible="@baseFuncInfo.authorityTag('diaOutpatientList#uploadReceivables')"
                        class="layui-btn layui-btn-dismain" style="position: absolute;right: 0;" onclick="uploadReceivables()">应收单上传</button>
            </div>
            <!--table定义-->
            <table id="diaOutpatientList_table" lay-filter="diaOutpatientList_table"></table>
        </div>

        <!-- 处方笺 -->
        <div class="layui-card-body layui-form" lay-filter="disPrescriptionEdit_form" id="disPrescriptionEdit_form" style="padding: 5px;height: calc(100% - 10px);" ms-if="showPrePaper">
            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="disPrescriptionEdit_submit" id="disPrescriptionEdit_submit">提交</button>
            </div>
            <div style="width: 100%;position:relative;line-height: 40px;">
                <blockquote class="layui-elem-quote">处方笺</blockquote>
                <div style="position: absolute;right: 0;display: inline-block">
                    <button class="layui-btn layui-btn-dismain layui-btn-sm" onclick="clickPreDetail()">处方明细</button>
                    <button class="layui-btn layui-btn-dismain layui-btn-sm" onclick="printOrder()">打印</button>
                </div>
            </div>
            <hr style="height: 1px; background: #76C0BB;margin: 0 0 10px;">

            <div>
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                        <div class="disui-form-flex">
                            <label>门诊号：</label>
                            <input type="text" name="opcNumber" id="opcNumber" lay-verify="required" ms-attr="{readonly: @sysHospital.isNumber==='Y' || @readonly.readonly ? true : false }">
                        </div>
                    </div>
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                        <div class="disui-form-flex">
                            <label>姓名：</label>
                            <input type="text" :attr="{value:@currentPatient.patientName}" readonly>
                        </div>
                    </div>
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                        <div class="disui-form-flex">
                            <label>性别：</label>
                            <input type="radio" name="gender" ms-attr="{value:el.name,title:el.name,checked:true&&$index==0}"
                                   ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Sex')" disabled>
                        </div>
                    </div>
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                        <div class="disui-form-flex">
                            <label>年龄：</label>
                            <input type="text" :attr="{value:@currentPatient.age+'岁'}" readonly>
                        </div>
                    </div>
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                        <div class="disui-form-flex">
                            <label>身高：</label>
                            <input type="text" :attr="{value:@currentPatient.stature!='' ? @currentPatient.stature+'cm' : ''}" readonly>
                        </div>
                    </div>
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                        <div class="disui-form-flex">
                            <label>干体重：</label>
                            <input type="text" :attr="{value:@currentPatient.dryWeight!='' ? @currentPatient.dryWeight+'kg' : ''}" readonly>
                        </div>
                    </div>
                </div>
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                        <div class="disui-form-flex">
                            <label>医保类型：</label>
                            <input type="text" :attr="{value:@baseFuncInfo.getSysDictName('InsuranceType',@currentPatient.insuranceTypes)}" readonly>
                        </div>
                    </div>
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                        <div class="disui-form-flex">
                            <label>社保号：</label>
                            <input type="text" :attr="{value:@currentPatient.socialSecurityNo}" readonly>
                        </div>
                    </div>
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex">
                            <label>证件号码：</label>
                            <input type="text" :attr="{value:'('+@baseFuncInfo.getSysDictName('IdCardType',@currentPatient.idCardType)+')'+@currentPatient.idCardNo}" readonly>
                        </div>
                    </div>
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex">
                            <label>通信地址：</label>
                            <input type="text" :attr="{value:@currentPatient.contactAddressComplete}" readonly>
                        </div>
                    </div>
                </div>
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                        <div class="disui-form-flex">
                            <label>电话：</label>
                            <input type="text" :attr="{value:@currentPatient.mobilePhone}" readonly>
                        </div>
                    </div>
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                        <div class="disui-form-flex">
                            <label>就诊：</label>
                            <select name="treatmentType" id="treatmentType" class="select" :attr="@disabled">
                                <option value=""></option>
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('TreatmentType')"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex">
                            <label>诊断：</label>
                            <input type="text" id="diagnosis" name="diagnosis" maxlength="65535" :attr="@readonly">
                        </div>
                    </div>
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex">
                            <label>传染病史：</label>
                            <input type="text" id="infection" name="infection" maxlength="65535" :attr="@readonly">
                        </div>
                    </div>
                </div>
                <fieldset class="layui-elem-field layui-field-title" style="margin: 0px;">
                    <legend><b><i style="color: #797979;">Rp</i></b></legend>
                </fieldset>
                <div class="layui-row layui-col-space1" style="width: 100%;margin-bottom: 5px;text-align: right;" ms-if="!@readonly.readonly">
                    <button :visible="@baseFuncInfo.authorityTag('diaOutpatientList#addOrder')"
                            class="layui-btn layui-btn-dismain"  onclick="saveOrEditOrder()">添加医嘱</button>
                    <button :visible="@baseFuncInfo.authorityTag('diaOutpatientList#import')"
                            class="layui-btn layui-btn-dismain"  onclick="importOrder()">从组套导入</button>
                    <button :visible="@baseFuncInfo.authorityTag('diaOutpatientList#export')"
                            class="layui-btn layui-btn-dismain"  onclick="exportOrder()">导出到组套</button>
                </div>
                <#-- 处方医嘱表格 -->
                <table id="diaOutpatientDetails_table" lay-filter="diaOutpatientDetails_table"></table>
            </div>
            <div style="position: fixed;bottom: 15px;right:15px;width: calc(100% - 200px - 10px - 12px - 15px);background: #ffffff;z-index: 9999;">
                <div class="layui-row layui-col-space1">
                    <button class="layui-btn layui-btn-dismain" style="float: right;" onclick="confirmPaper()">确认</button>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3" style="float: right;">
                        <div class="disui-form-flex">
                            <label>开方医生：</label>
                            <select name="establishUserId" id="establishUserId" lay-verify="required" class="select" readonly :attr="@disabled">
                                <option value=""></option>
                                <option ms-attr="{value:el.id}" ms-text="@el.userName"
                                        ms-for="($index, el) in doctors"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3" style="float: right;">
                        <div class="disui-form-flex">
                            <label>开方日期：</label>
                            <input type="text" name="establishDate" id="establishDate" readonly lay-verify="required" :attr="@disabled">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 处方明细记录 -->
        <div class="layui-card-body" style="padding: 5px;" ms-if="showPreDetail">
            <div style="width: 100%;position:relative;line-height: 40px;">
                <blockquote class="layui-elem-quote">处方明细记录</blockquote>
                <div style="position: absolute;right: 0;display: inline-block">
                    <button class="layui-btn layui-btn-dismain layui-btn-sm" onclick="clickPrePaper()">处方笺</button>
                </div>
            </div>
            <hr style="height: 1px; background: #76C0BB;margin: 0 0 10px;">

            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding-bottom: 10px;position: relative;" id="diaOutpatientList_tool" ms-if="!@readonly.readonly">
                <button :visible="@baseFuncInfo.authorityTag('diaOutpatientList#addItem')"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEditItem()">添加</button>
            </div>
            <!--table定义-->
            <table id="diaOutpatientItemList_table" lay-filter="diaOutpatientItemList_table"></table>
        </div>
    </div>
    <!--table的工具栏按钮定义，注意：需要增加权限控制-->
    <script type="text/html" id="diaOutpatientList_bar">
        {{#  if(baseFuncInfo.authorityTag('diaOutpatientList#detail')){ }}
            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="detail">详情</a>
        {{#  } }}
        {{#  if(baseFuncInfo.authorityTag('diaOutpatientList#edit')){ }}
            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">编辑</a>
        {{#  } }}
        {{#  if(baseFuncInfo.authorityTag('diaOutpatientList#delete')){ }}
            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="del">删除</a>
        {{#  } }}
    </script>

    <!--table的工具栏按钮定义，注意：需要增加权限控制-->
    <script type="text/html" id="diaOutpatientDetailsList_bar">
        <#-- 不是详情的时候才显示操作按钮 -->
        {{# if(!diaOutpatientList.readonly.readonly) { }}
            {{#  if(baseFuncInfo.authorityTag('diaOutpatientList#editOrder')){ }}
                {{# if(d.orderType != '3') { }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="editOrder">编辑</a>
                {{# } }}
            {{#  } }}
            {{# if(baseFuncInfo.authorityTag('diaOutpatientList#addOrder')) { }}
                {{# if(isEmpty(d.parentDetailsId) && d.orderType != '3') { }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="addSubOrder">添加子医嘱</a>
                {{# } }}
            {{# } }}
            {{# if(baseFuncInfo.authorityTag('diaOutpatientList#applyForm')) { }}
                {{#if(d.orderType === '3') { }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="applyForm">申请单</a>
                {{# } }}
            {{# } }}
            {{#  if(baseFuncInfo.authorityTag('diaOutpatientList#deleteOrder')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="deleteOrder">删除</a>
            {{#  } }}
        {{# } }}
    </script>

    <!--table的工具栏按钮定义，注意：需要增加权限控制-->
    <script type="text/html" id="diaOutpatientItemList_bar">
        <#-- 不是详情的时候才显示操作按钮 -->
        {{# if(!diaOutpatientList.readonly.readonly) { }}
            {{#  if(baseFuncInfo.authorityTag('diaOutpatientList#editItem')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="editItem">编辑</a>
            {{#  } }}
            {{#  if(baseFuncInfo.authorityTag('diaOutpatientList#deleteItem') && d.sourceType==='Manual'){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="deleteItem">删除</a>
            {{#  } }}
        {{# } }}
    </script>

    <#-- 个人出库复选框 -->
    <script type="text/html" id="selfDrugsTemplet">
        {{# if(!diaOutpatientList.readonly.readonly) { }}
            {{# if(d.selfDrugs === 'Y') {  }}
                <input type="checkbox" lay-skin="primary" lay-filter="selfDrugs" data-id="{{d.detailsId}}" checked>
            {{# } else { }}
                <input type="checkbox" lay-skin="primary" lay-filter="selfDrugs" data-id="{{d.detailsId}}">
            {{# } }}
        {{# } else { }}
            {{# if(d.selfDrugs === 'Y') {  }}
                <input type="checkbox" lay-skin="primary" disabled checked>
            {{# } else { }}
                <input type="checkbox" lay-skin="primary" disabled>
            {{# } }}
        {{# } }}
    </script>

    <!-- 医嘱内容template -->
    <script type="text/html" id="orderContentTemplet">
        <#-- 子医嘱-->
        {{#  if (d.parentOrderId) { }}
        <div class="order-content sub-order" data-parent-order-id="{{d.parentOrderId}}">
            <div class="content">
                {{# if(d.specifications) { }}
                <div title="{{d.orderContent}}＃{{d.specifications}}">{{d.orderContent}}<span>#</span>{{d.specifications}}</div>
                {{# } else { }}
                <div title="{{d.orderContent}}">{{d.orderContent}}</div>
                {{# } }}
                {{# if(d.manufactor) { }}
                <div class="content-manufactor" style="color: #797979;">厂家：{{d.manufactor}}</div>
                {{# } }}
            </div>
        </div>
        {{#  } }}

        <#-- 父医嘱-->
        {{#  if (!d.parentOrderId) { }}
        <div class="order-content" data-order-id="{{d.orderId}}">
            <div class="icon-box" lay-event="toggle-fold-suborder">
                {{# if(d.subOrderId) { }}
                <i class="layui-icon layui-icon-subtraction"></i>
                {{# } }}
            </div>
            <div class="content">
                {{# if(d.specifications) { }}
                <div title="{{d.orderContent}}＃{{d.specifications}}">{{d.orderContent}}<span>#</span>{{d.specifications}}</div>
                {{# } else { }}
                <div title="{{d.orderContent}}">{{d.orderContent}}</div>
                {{# } }}
                {{# if(d.manufactor) { }}
                <div class="content-manufactor" style="color: #797979;">厂家：{{d.manufactor}}</div>
                {{# } }}
            </div>
        </div>
        {{#  } }}
    </script>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaOutpatientList.js?t=${currentTimeMillis}"></script>
</body>
</html>