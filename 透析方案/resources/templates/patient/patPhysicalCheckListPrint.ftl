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
        .item-inline{
            display: inline-block;
        }
        .item-row {
            margin: 5px 0;
        }
        .layui-row .layui-col-space1
        {
            margin-left: -20px;
        }
        /*#needPadding{*/
        /*    padding-top: 20px;*/
        /*    margin-left: -20px;*/
        /*}*/
        .layui-tag-box{
            width: 100%;
            margin: 10px 5px;
            padding-left: 20px;
        }
        .layui-tag-box .layui-tag{
          margin-right: 5px;
        }
        .layui-elem-quote{
            background-color: #FFF;
            line-height: 15px;
            padding: 5px;
            padding-left: 10px;
            border-left: 4px solid rgb(0, 150, 136);
        }
    </style>
</head>
<body ms-controller="patPhysicalCheckListPrint">
<div class="layui-card-body" >
    <div class="layui-card">
        <div class="layui-row layui-col-space1">
            <div class="layui-row" style="text-align: center;word-break: break-word;">
                <h2 style="margin: 10px;">{{patPhysicalCheckListPrint.patientName || ''}}体格检查</h2>
            </div>
            <div class="layui-form-item">
                <div class="layui-row layui-col-space1 ">
                    <div class="item-inline" style="width: 240.48px; text-align: left;padding-left: 62px">
                        <label>检查日期：</label>
                        <div class="item-inline">{{patPhysicalCheckListPrint.checkDate}}</div>
                    </div>
                    <div class="item-inline" style="width: 160px; text-align: left;">
                        <label>检查人：</label>
                        <div class="item-inline">{{patPhysicalCheckListPrint.checkUserName}}</div>
                    </div>
                </div>
                <blockquote class="layui-elem-quote">状况描述</blockquote>
                <hr class="layui-bg-green">
                <div >
                    <div class="layui-row ">
                        <div class="item-inline" style="width: 160px; text-align: left;padding-left: 70px">
                            <label>食欲：</label>
                            <div class="item-inline">{{patPhysicalCheckListPrint.appetiteStatus}}</div>
                        </div>
                        <div class="item-inline" style="width: 200px; text-align: left;padding-left: 64px">
                            <label>睡眠：</label>
                            <div class="item-inline">{{patPhysicalCheckListPrint.sleepStatus}}</div>
                        </div>
                        <div class="item-inline" style="width: 160px; text-align: left;">
                            <label>大便：</label>
                            <div class="item-inline">{{patPhysicalCheckListPrint.stoolStatus}}</div>
                        </div>
                    </div>
                    <div class="layui-row ">
                        <div class="item-inline" style="width: 133px; text-align: left;padding-left: 70px">
                            <label>尿量：</label>
                            <div class="item-inline">{{patPhysicalCheckListPrint.urineVolume || ''}}&nbsp;ml/日</div>
                        </div>
                        <div class="item-inline" style="width: 175px; text-align: left;padding-left: 92px">
                            <label>夜尿：</label>
                            <div class="item-inline">{{patPhysicalCheckListPrint.nocturiaTimes || ''}}&nbsp;次/日</div>
                        </div>
                    </div>
                    <div class="layui-row ">
                        <div class="item-inline" style="width: 173px; text-align: left;margin-left: 44px">
                            <label>出血情况：</label>
                            <div class="item-inline">{{patPhysicalCheckListPrint.bleedingStatus}}</div>
                        </div>
                        <div class="item-inline" style="width: 350px; text-align: left;padding-left: 78px;word-break: break-word;">
                            <label>描述：</label>
                            <div class="item-inline">{{patPhysicalCheckListPrint.bleedingDetails}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <blockquote class="layui-elem-quote">体格检查</blockquote>
            <hr class="layui-bg-green" style="padding: 0">
            <fieldset class="layui-elem-field layui-field-title" style="margin: 10px 0px;">
                <legend style="font-size: 9px;padding-left: 40px">基本信息</legend>
            </fieldset>
            <div class="layui-row ">
                <div class="item-inline" style="width: 159px; text-align: left;margin-left: 76px">
                    <label style="margin-left: -18px">收缩压：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.systolicPressure || ''}}&nbsp;mmHg</div>
                </div>
                <div class="item-inline" style="width: 177.48px; text-align: left;padding-left: 45px">
                    <label>舒张压：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.diastolicPressure || ''}}&nbsp;mmHg</div>
                </div>
                <div class="item-inline" style="width: 120px; text-align: left;padding-left: 36px">
                    <label>体重：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.weight || ''}}&nbsp;kg</div>
                </div>
            </div>
            <div class="layui-row">
                <div class="item-inline" style="width: 110px; text-align: left;padding-left: 79px">
                    <label>HR：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.heartRate || ''}}&nbsp;次/分</div>
                </div>
                <div class="item-inline" style="width: 130px; text-align: left;margin-left: 125px">
                    <label>R：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.respire || ''}}&nbsp;次/分</div>
                </div>
                <div class="item-inline" style="width: 135px; text-align: left;padding-left: 71px">
                    <label>T：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.temperature || ''}}&nbsp;℃</div>
                </div>
            </div>
            <div class="layui-row">
                <div class="item-inline" style="width: 120px; text-align: left;padding-left: 45px">
                    <label>一般情况：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.ordinaryStatus}}</div>
                </div>
                <div class="item-inline" style="width: 150px; text-align: left;padding-left: 103px">
                    <label>营养状态：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.nutritionalStatus}}</div>
                </div>
                <div class="item-inline" style="width: 150px; text-align: left;margin-left: 20px;padding-left: 27px">
                    <label>贫血面容：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.anemicFace}}</div>
                </div>
            </div>
            <div class="layui-row">
                <div class="item-inline" style="width: 142px; text-align: left;padding-left: 73px">
                    <label>体位：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.posture}}</div>
                </div>
                <div class="item-inline" style="width: 156px; text-align: left;padding-left: 81px">
                    <label>浮肿：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.dropsyStatus}}</div>
                </div>
                <div class="item-inline" style="width: 180px; text-align: left;padding-left: 17px">
                    <label>浮肿程度：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.dropsyLevel}}</div>
                </div>
            </div>
            <div class="layui-row">
                <div class="item-inline" style="width: 222px; text-align: left;padding-left: 57px">
                    <label>出血点/瘀斑/血肿等：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.hematomaStatus}}</div>
                </div>
                <div class="item-inline" style="width: 300px; text-align: left;padding-left: 18px;word-break: break-word;">
                    <label>描述：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.hematomaRemarks}}</div>
                </div>
            </div>
            <fieldset class="layui-elem-field layui-field-title" style="margin: 10px 0px;">
                <legend style="font-size: 9px;padding-left: 40px">肺部情况</legend>
            </fieldset>
            <div class="layui-row">
                <div class="item-inline" style="width: 188px; text-align: left;padding-left: 56px;word-break: break-word;">
                    <label>呼吸音：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.breathSounds}}</div>
                </div>
                <div class="item-inline" style="width: 175px; text-align:left;padding-left: 8px">
                    <label>胸膜摩擦音：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.pleuralRubSounds}}</div>
                </div>
                <div class="item-inline" style="width: 200px; text-align: left;padding-left: 66px">
                    <label>啰音：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.raleSounds}}</div>
                </div>
            </div>
            <fieldset class="layui-elem-field layui-field-title" style="margin: 10px 0px;">
                <legend style="font-size: 9px;padding-left: 40px">心脏情况</legend>
            </fieldset>
            <div class="layui-row">
                <div class="item-inline" style="width: 132px; text-align: left;padding-left: 74px">
                    <label>心律：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.heartRhythm}}</div>
                </div>
                <div class="item-inline" style="width: 120px; text-align: left;padding-left: 89px">
                    <label >心率：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.pulseRate || ''}}&nbsp;次/分</div>
                </div>
                <div class="item-inline" style="width: 200px; text-align: left;padding-left: 52px">
                    <label >心脏大小：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.cardiacSize}}</div>
                </div>
            </div>
            <div class="layui-row">
                <div class="item-inline" style="width: 136px; text-align: left;padding-left: 26px">
                    <label>心包摩擦音：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.pericardialRubSounds}}</div>
                </div >
                <div class="item-inline" style="width: 104px; text-align: left;">
                    <label>杂音：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.murmurSounds}}</div>
                </div>
                <div class="item-inline" style="width: 128px; text-align: left;padding-left: 18px">
                    <label>附加音：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.extraSounds}}</div>
                </div>
                <div class="item-inline" style="width: 250px; text-align: left;padding-left: 27px">
                    <label>心包积液体征：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.pericardialEffusionSign}}</div>
                </div>
            </div>
            <fieldset class="layui-elem-field layui-field-title" style="margin: 10px 0px;">
                <legend style="font-size: 9px;padding-left: 40px">腹部情况</legend>
            </fieldset>
            <div class="layui-row">
                <div class="item-inline" style="width: 150px; text-align: left;padding-left: 57px">
                    <label>腹水征：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.ascitesSign}}</div>
                </div>
                <div class="item-inline" style="width: 200px; text-align: left;padding-left: 20px">
                    <label>肝颈动脉回流征：</label>
                    <div class="item-inline">{{patPhysicalCheckListPrint.arterialRefluxSign}}</div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/patient/patPhysicalCheckListPrint.js?t=${currentTimeMillis}"></script>
</body>
</html>
