<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <style>
        .item-inline {
            display: inline-block;
        }

        .item-row {
            margin: 5px 0;
        }

        .layui-row .layui-col-space1 {
            margin-left: -20px;
        }

        /*#needPadding{*/
        /*    padding-top: 20px;*/
        /*    margin-left: -20px;*/
        /*}*/
        .layui-tag-box {
            width: 100%;
            margin: 0px 5px;
            padding-left: 20px;
        }

        .layui-tag-box .layui-tag {
            margin-right: 5px;
        }

        .layui-elem-quote {
            background-color: #FFF;
            line-height: 15px;
            padding: 5px;
            border-left: 4px solid rgb(0, 150, 136);
            padding-right: 0;
        }

        .borderClass {
            border: 1px solid;
        }

        .temp-table {
            width: 780px;
            border-left: 1px solid #666666;
            border-bottom: 1px solid #666666;
        }

        .temp-table tr td {
            height: 30px;
            border-top: 1px solid #666666;
            border-right: 1px solid #666666;
            text-align: center;
            word-break: break-word;
        }
    </style>
</head>
<body ms-controller="patPatientInfoPrint" style="overflow-x: hidden">
<div class="layui-card-body">
    <div class="layui-form">
        <div class="layui-row layui-col-space1" style="padding-left: 30px;padding-right: 20px">
            <div class="layui-row" style="text-align: center;word-break: break-word;">
                <h2 style="margin: 10px;">{{patientInfo.patientName}}基本信息</h2>
            </div>
            <blockquote class="layui-elem-quote">基本信息</blockquote>
            <hr style="height: 1px;background: #76C0BB;padding: 0">
            <fieldset class="layui-elem-field layui-field-title" style="margin: 10px 0px;">
                <legend style="font-size: 14px">个人资料</legend>
            </fieldset>

            <div class="layui-form-item">
                <div style="width: 85%;float: left">
                    <div class="layui-row layui-col-space1 " id="needPadding">
                        <div class="item-inline" style="width: 158px; text-align: left;padding-left: 42px">
                            <label>病历号：</label>
                            <div class="item-inline">{{patientInfo.patientRecordNo}}</div>
                        </div>
                        <div class="item-inline" style="width: 260px; text-align: left;padding-left: 10px">
                            <label>病历编号：</label>
                            <div class="item-inline">{{patientInfo.patientFilesNo}}</div>
                        </div>
                        <div class="item-inline" style="width: 150px; text-align: left;padding-left: 20px">
                            <label>客户类型：</label>
                            <div class="item-inline">{{patientInfo.customerType}}</div>
                        </div>
                    </div>
                    <div class="layui-row layui-col-space1">
                        <div class="item-inline"
                             style="width: 195px; text-align: left;padding-left: 58px;word-break: break-word;">
                            <label>姓名：</label>
                            <div class="item-inline">{{patientInfo.patientName}}</div>
                        </div>
                        <div class="item-inline" style="width: 75px; text-align: left;margin-left: -14px">
                            <label>性别：</label>
                            <div class="item-inline">{{patientInfo.gender}}</div>
                        </div>
                        <div class="item-inline" style="width: 174px; text-align: left;padding-left: 34px">
                            <label>出生日期：</label>
                            <div class="item-inline">{{patientInfo.birthday}}</div>
                        </div>
                        <div class="item-inline" style="width: 90px; text-align: left;margin-left: -4px">
                            <label>年龄：</label>
                            <div class="item-inline">{{patientInfo.age}}</div>
                        </div>
                    </div>
                    <div class="layui-row layui-col-space1">
                        <div class="item-inline" style="width: 270.96px; text-align: left;margin-left: 30px">
                            <label>证件号码：</label>
                            <div class="item-inline">{{patientInfo.idCardNo}}</div>
                        </div>
                        <div class="item-inline"
                             style="width: 212px; text-align: left;word-break: break-word;padding-left: 61px">
                            <label>收入/年：</label>
                            <div class="item-inline">{{patientInfo.incomeStatus}}</div>
                        </div>
                        <div class="item-inline" style="width: 100px; text-align: left;margin-left: -55px">
                            <label>饮酒：</label>
                            <div class="item-inline">{{patientInfo.drinkStatus}}</div>
                        </div>
                    </div>
                </div>
                <div style="width: 55px;float: left;">
                    <div class="layui-row layui-col-space1">
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                                <#--<label style=" flex-basis: 50px;">照片：</label>-->
                                <div style="width: 100%;text-align: left;">
                                    <img ms-attr="{'src': @patientInfo.patientPhoto}" onclick="previewImg()"
                                         onerror="this.src='${ctxsta}/static/images/u6399.png'"
                                         style="width: 71px;height: 71px;">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-row ">
                <div class="item-inline" style="width: 220px; text-align: left;margin-left: 28px">
                    <label style="margin-left: -18px">医保类型：</label>
                    <div class="item-inline">{{patientInfo.insuranceType}}</div>
                </div>
                <div class="item-inline" style="width: 260.48px; text-align: left;padding-left: 100px">
                    <label>社保号：</label>
                    <div class="item-inline">{{patientInfo.socialSecurityNo}}</div>
                </div>
            </div>
            <div class="layui-row">
                <div class="item-inline" style="width: 130px; text-align: left;margin-left: 40px">
                    <label>身高：</label>
                    <div class="item-inline">{{patientInfo.stature}}</div>
                </div>
                <div class="item-inline" style="width: 135px; text-align: left;padding-left: 22px">
                    <label>入院体重：</label>
                    <div class="item-inline">{{patientInfo.admissionWeight}}</div>
                </div>
                <div class="item-inline" style="width: 120px; text-align: left;padding-left: 5px">
                    <label>婚姻状况：</label>
                    <div class="item-inline">{{patientInfo.maritalStatus}}</div>
                </div>
                <div class="item-inline" style="width: 200px; text-align: left;padding-left: 47px">
                    <label>民族：</label>
                    <div class="item-inline">{{patientInfo.ethnicity}}</div>
                </div>
            </div>
            <div class="layui-row">
                <div class="item-inline" style="width: 153px; text-align: left;margin-left: 40px">
                    <label>宗教：</label>
                    <div class="item-inline">{{patientInfo.religion}}</div>
                </div>
                <div class="item-inline" style="width: 150px; text-align: left;">
                    <label>教育程度：</label>
                    <div class="item-inline">{{patientInfo.educationLevel}}</div>
                </div>
                <div class="item-inline" style="width: 110px; text-align: left;padding-left: 20px;width: 139px">
                    <label>职业：</label>
                    <div class="item-inline">{{patientInfo.occupation}}</div>
                </div>
                <div class="item-inline" style="width: 175px; text-align: left;margin-left: -2px">
                    <label>吸烟：</label>
                    <div class="item-inline">{{patientInfo.smokeStatus}}</div>
                </div>
            </div>
            <div class="layui-row">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="item-inline"
                         style="width: 100%; text-align: left;padding-left: 12px;word-break: break-all">
                        <label>特殊要求：</label>
                        <div class="item-inline">{{patientInfo.specialRequirements}}</div>
                    </div>
                </div>
            </div>
            <div class="layui-row">
                <div class="item-inline"
                     style="width: 95%; text-align: left;padding-left: 40px;word-break: break-word;">
                    <label>标签：</label>
                    <div class="item-inline">{{patientInfo.patPatientTagLists}}</div>
                </div>
            </div>
            <fieldset class="layui-elem-field layui-field-title" style="margin: 10px 0px;">
                <legend style="font-size: 14px">家庭住址及联系方式</legend>
            </fieldset>
            <div class="layui-row">
                <div class="item-inline" style="width: 300px; text-align: left;padding-left: 11px">
                    <label>个人手机：</label>
                    <div class="item-inline">{{patientInfo.mobilePhone}}</div>
                </div>
                <div class="item-inline" style="width: 360px; text-align: left;padding-left: 22px">
                    <label>固定电话：</label>
                    <div class="item-inline">{{patientInfo.fixedPhone}}</div>
                </div>
            </div>
            <div class="layui-row">
                <div class="item-inline"
                     style="width: 100%; text-align: left;padding-left: 13px;word-break: break-word;">
                    <label>通信地址：</label>
                    <div class="item-inline">{{patientInfo.contactAddressComplete}}</div>
                </div>
            </div>
            <div class="layui-row">
                <div class="item-inline"
                     style="width: 100%; text-align: left;word-break: break-word;padding-left: 13px">
                    <label>家庭住址：</label>
                    <div class="item-inline">{{patientInfo.homeAddressComplete}}</div>
                </div>
            </div>
            <div class="layui-row">
                <div class="item-inline" style="width: 100%; text-align: left;padding-left: 13px">
                    <label>家庭情况：</label>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <table cellpadding="0" cellspacing="0" class="temp-table" style="margin-top:5px">
                    <thead>
                    <td style="width: 60px">序号</td>
                    <td style="width: 94px">家属姓名</td>
                    <td style="width: 94px">家属手机</td>
                    <td style="width: 94px">关系</td>
                    <td style="width: 94px">生日</td>
                    <td style="width: 94px">收入/年</td>
                    <td style="width: 94px">职业</td>
                    <td style="width: 94px">备注</td>
                    </thead>
                    <tbody>
                    <tr ms-for="($index, el) in @patientInfo.patFamilyMemberLists"
                        :visible="@patientInfo.patFamilyMemberLists.length>0">
                        <td style="width: 60px"> {{$index + 1}}</td>
                        <td style="width: 94px"> {{el.familyMemberName}}</td>
                        <td style="width: 94px">{{el.mobilePhone}}</td>
                        <td style="width: 94px">{{el.relationship}}</td>
                        <td style="width: 94px">{{@el.birthday | date("yyyy-MM-dd")}}</td>
                        <td style="width: 94px">{{el.incomeStatus}}</td>
                        <td style="width: 94px">{{el.occupation}}</td>
                        <td style="width: 94px">{{el.remarks}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <fieldset class="layui-elem-field layui-field-title" style="margin: 10px 0px;">
                <legend style="font-size: 14px">过去透析史</legend>
            </fieldset>
            <div class="layui-row layui-col-space1">
                <table cellpadding="0" cellspacing="0" class="temp-table" style="margin-top:10px">
                    <thead>
                    <td style="width: 60px">序号</td>
                    <td style="width: 188px">透析类型</td>
                    <td style="width: 188px">初始透析时间</td>
                    <td style="width: 188px">初始透析医院</td>
                    </thead>
                    <tbody>
                    <tr ms-for="($index, el) in @patientInfo.patPastDialysisLists"
                        :visible="@patientInfo.patPastDialysisLists.length>0">
                        <td style="width: 60px"> {{$index + 1}}</td>
                        <td style="width: 188px"> {{@baseFuncInfo.getSysDictName('DialysisType',@el.dialysisType)}}</td>
                        <td style="width: 188px"> {{@el.dialysisDateStart | date("yyyy-MM-dd")}}</td>
                        <td style="width: 188px"> {{el.dialysisHospital}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <fieldset class="layui-elem-field layui-field-title" style="margin: 10px 0px;">
                <legend style="font-size: 14px">现在透析史</legend>
            </fieldset>
            <div class="layui-row">
                <div class="item-inline" style="width: 200px; text-align: left;padding-left: 6px">
                    <label style="margin-left: 6px">透析类型：</label>
                    <div class="item-inline">{{patientInfo.dialysisType}}</div>
                </div>
                <div class="item-inline" style="width: 230.48px; text-align: left;margin-left: -43px">
                    <label>首次接收日期：</label>
                    <div class="item-inline">{{patientInfo.firstReceptionDate}}</div>
                </div>
                <div class="item-inline" style="width: 230.48px; text-align: left;padding-left: 47px">
                    <label>首次透析日期：</label>
                    <div class="item-inline">{{patientInfo.firstDialysisDate}}</div>
                </div>
            </div>
            <div class="layui-row">
                <div class="item-inline" style="width: 201px; text-align: left;">
                    <label style="padding-left: 13px">透析次数：</label>
                    <div class="item-inline">{{patientInfo.dialysisTimes}}</div>
                </div>
                <div class="item-inline" style="width: 231.48px; text-align: left;padding-left: 31px">
                    <label style="margin-left: -26px">透析年：</label>
                    <div class="item-inline">{{patientInfo.dialysisYear}}</div>
                </div>
                <div class="item-inline" style="width: 222.48px; text-align: left;margin-left: -8px">
                    <label>透析总频次：</label>
                    <div class="item-inline">{{patientInfo.dialysisTotalFrequency}}</div>
                </div>
            </div>
            <blockquote class="layui-elem-quote">感染状况</blockquote>
            <hr class="layui-bg-green" style="padding: 0">
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="item-inline" style="width: 100%; text-align: left;">
                        <div class="item-inline" style="padding-left: 39px">{{patientInfo.infectionStatus}}</div>
                    </div>
                </div>
            </div>

            <blockquote class="layui-elem-quote">其它信息</blockquote>
            <hr class="layui-bg-green" style="padding: 0">
            <div class="layui-row layui-col-space1">
                <div class="layui-row" style="padding-left: 40px">
                    <div class="item-inline" style="width: 215px; text-align: left;word-break: break-word;">
                        <label>区名：</label>
                        <div class="item-inline">{{patientInfo.hospitalName}}</div>
                    </div>
                    <div class="item-inline"
                         style="width: 160px; text-align: left;margin-left: -60px;word-break: break-word;">
                        <label>初诊医生：</label>
                        <div class="item-inline">{{patientInfo.firstDiagnosisDoctor}}</div>
                    </div>
                    <div class="item-inline"
                         style="width: 160px; text-align: left;margin-left: -20px;word-break: break-word;">
                        <label>主责护士：</label>
                        <div class="item-inline">{{patientInfo.principalNurses}}</div>
                    </div>
                    <div class="item-inline" style="width: 178px; text-align: left;">
                        <label>本中心透析次数：</label>
                        <div class="item-inline">{{patientInfo.dialysisTimes}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/patient/patPatientInfoPrint.js?t=${currentTimeMillis}"></script>
</body>
</html>
