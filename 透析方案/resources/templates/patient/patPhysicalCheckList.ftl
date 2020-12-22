<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <style >
        .layui-fluid {
            padding: 0px 10px !important;
        }
        .layui-card {
            margin-bottom: 10px;
        }
        .layui-elem-field{
            margin: 10px!important;
        }
        .layui-elem-field legend{
            font-size: 14px;
        }
        .layui-elem-quote{
            background-color: #FFF;
            line-height: 15px;
            padding: 5px;
            border-left: 4px solid rgb(0, 150, 136);
        }

        .layui-field-title-separate{
            text-align: center;
            border-style: none;
            background-image: linear-gradient(to right, #ccc 0%, #ccc 60%, transparent 40%);
            background-size: 25px 1px;
            background-repeat: repeat-x;
            margin: 10px 0 !important;
        }
        .layui-field-title-separate legend{
            background-color: white;
        }
        .layui-table-main{
          height: auto!important;
        }
        .layui-border-box{
            height: auto!important;
        }
        .long-lable{
            line-height: 19px!important;
        }
        .col-flex{
            align-items: center;
            display: flex;
        }
        .layui-lable-unit{
            flex-basis: auto!important;
        }
        /*.layui-row .disui-form-flex>label{*/
            /*flex-basis: 150px;*/
        /*}*/
    </style>
    <style media="print" type="text/css">
        .noprint
        {
            display:none;
        }
        .layui-table-cell{
            width: 350px!important;
        }

    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="patPhysicalCheckList">
<div class="layui-fluid">
    <div class="layui-card">
        <div class="layui-card-body" style="padding: 10px;">
            <#--搜索栏-->
            <div class="layui-row layui-col-space1 noprint">
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <label style="text-align: left;flex-basis: auto;">检查日期：</label>
                        <input type="text" name="checkDateRange" id="checkDateRange" placeholder="yyyy-MM-dd" autocomplete="off" >
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <button class="layui-btn layui-btn-dismain"  onclick="search()">查询</button>
                    </div>
                </div>
            </div>
            <hr class="layui-bg-gray">
            <!--table定义-->
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <table id="patPhysicalCheckList_table" lay-filter="patPhysicalCheckList_table"></table>
                    </div>
                </div>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="patPhysicalCheckList_bar">
                {{#  if(baseFuncInfo.authorityTag('patPhysicalCheckList#edit')){ }}
                <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('patPhysicalCheckList#del')){ }}
                <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
                {{#  } }}
            </script>
            <fieldset class="layui-elem-field layui-field-title layui-field-title-separate">
                <legend>选中上方数据进行体格检查</legend>
            </fieldset>
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div class="noprint" style="padding: 0 10px 10px 0;" id="patPhysicalCheckList_tool">
                <button :visible="@baseFuncInfo.authorityTag('patPhysicalCheckList#add')"
                        class="layui-btn layui-btn-dismain" onclick="switchLayEvent('add')">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('patPhysicalCheckList#add')"
                        class="layui-btn layui-btn-dismain"   onclick="switchLayEvent('edit')">修改</button>
                <button :visible="@baseFuncInfo.authorityTag('patPhysicalCheckList#batchDel')"
                        class="layui-btn layui-btn-dissub" onclick="batchDel()">删除</button>
                <button :visible="@baseFuncInfo.authorityTag('patPhysicalCheckList#print')"
                        class="layui-btn layui-btn-dissub" onclick="onPrint()">打印</button>
            </div>
                <div class="layui-form" lay-filter="patPhysicalCheckEdit_form" id="patPhysicalCheckEdit_form">
                    <div  id="editLayEvent" style="text-align: right;display: none"  >
                        <button class="layui-btn layui-btn-dismain" onclick="save()">保存</button>
                        <button class="layui-btn layui-btn-dissub" onclick="switchLayEvent('detail')">取消</button>
                    </div>
                    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
                    <div class="layui-form-item layui-hide">
                        <button class="layui-btn" lay-submit lay-filter="patPhysicalCheckEdit_submit" id="patPhysicalCheckEdit_submit">提交</button>
                    </div>
                    <div class="layui-form-item  layui-hide">
                        <label class="layui-form-label">ID</label>
                        <div class="layui-input-inline">
                            <input type="text" name="physicalCheckId" placeholder="请输入" autocomplete="off">
                        </div>
                    </div>
                    <div class="layui-form-item  layui-hide">
                        <label class="layui-form-label"><span class="edit-verify-span">*</span>患者ID（Ref: pat_patient_info.patient_id）</label>
                        <div class="layui-input-inline">
                            <input type="text" name="patientId" maxlength="35" lay-verify="required" placeholder="请输入" autocomplete="off">
                        </div>
                    </div>
                    <div class="layui-row layui-col-space1">
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex" >
                                <label><span class="edit-verify-span">*</span>检查日期：</label>
                                <input type="text" name="checkDate"  id="checkDate" lay-verify="required" :attr="@disabled" placeholder="yyyy-MM-dd" autocomplete="off" >
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex" >
                                <label><span class="edit-verify-span">*</span>检查人：</label>
                                <select id="checkUserId" name="checkUserId" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.id}" ms-text="@el.userName"
                                             ms-for="($index, el) in checkUserIds"></option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <blockquote class="layui-elem-quote">状况描述</blockquote>
                    <hr class="layui-bg-green">
                    <div class="layui-row layui-col-space1">
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex" >
                                <label>食欲：</label>
                                <select name="appetiteStatus" lay-filter="appetiteStatus" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('AppetiteStatus')"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex" >
                                <label>睡眠：</label>
                                <select name="sleepStatus" lay-filter="sleepStatus" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('SleepStatus')"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex" >
                                <label>大便：</label>
                                <select name="stoolStatus" lay-filter="stoolStatus" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('StoolStatus')"></option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="layui-row layui-col-space1">
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex" >
                                <label>尿量：</label>
                                <input type="text" name="urineVolume" autocomplete="off" lay-verify="number|urineVolume" :attr="@readonly" maxlength="4">
                                <label class="layui-lable-unit">ml/日</label>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex" >
                                <label>夜尿：</label>
                                <input type="text" name="nocturiaTimes" lay-verify="number|nocturiaTimes" autocomplete="off" :attr="@readonly" maxlength="2">
                                <label class="layui-lable-unit">次/日</label>
                            </div>
                        </div>
                    </div>
                    <div class="layui-row layui-col-space1">
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex" >
                                <label>出血情况：</label>
                                <select name="bleedingStatus" id="bleedingStatus" lay-filter="bleedingStatus" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('BleedingStatus')"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm9 layui-col-md9 layui-col-lg9">
                            <div class="disui-form-flex" >
                                <input type="text" name="bleedingDetails" maxlength="100" autocomplete="off" :attr="@readonly">
                            </div>
                        </div>
                    </div>
                    <blockquote class="layui-elem-quote">体格检查</blockquote>
                    <hr class="layui-bg-green">
                    <fieldset class="layui-elem-field layui-field-title">
                        <legend>基本信息</legend>
                    </fieldset>
                    <div class="layui-row layui-col-space1">
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>收缩压：</label>
                                <input type="text" name="systolicPressure" autocomplete="off" lay-verify="number|systolicPressure" :attr="@readonly" maxlength="3">
                                <label class="layui-lable-unit">mmHg</label>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>舒张压：</label>
                                <input type="text" name="diastolicPressure" autocomplete="off" lay-verify="number|diastolicPressure" :attr="@readonly" maxlength="3">
                                <label class="layui-lable-unit">mmHg</label>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>体重：</label>
                                <input type="text" name="weight" autocomplete="off" :attr="@readonly" lay-verify="decimalNumber2" maxlength="6">
                                <label class="layui-lable-unit">kg</label>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>HR：</label>
                                <input type="text" name="heartRate" autocomplete="off" :attr="@readonly" lay-verify="number|heartRate" maxlength="3">
                                <label class="layui-lable-unit">次/分</label>
                            </div>
                        </div>
                    </div>
                    <div class="layui-row layui-col-space1">
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>R：</label>
                                <input type="text" name="respire" autocomplete="off" :attr="@readonly" lay-verify="number|respire" maxlength="3">
                                <label class="layui-lable-unit">次/分</label>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>T：</label>
                                <input type="text" name="temperature" autocomplete="off" :attr="@readonly" lay-verify="decimalNumber1|temperature" maxlength="2">
                                <label class="layui-lable-unit">℃</label>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>一般情况：</label>
                                <select name="ordinaryStatus" lay-filter="ordinaryStatus" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('BodyStatus')"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>营养状态：</label>
                                <select name="nutritionalStatus" lay-filter="nutritionalStatus" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('BodyStatus')"></option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="layui-row layui-col-space1">
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>贫血面容：</label>
                                <select name="anemicFace" lay-filter="anemicFace" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('AnemicFace')"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>体位：</label>
                                <select name="posture" lay-filter="posture" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Posture')"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>浮肿：</label>
                                <select name="dropsyStatus" lay-filter="dropsyStatus" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('DropsyStatus')"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>浮肿程度：</label>
                                <select name="dropsyLevel" lay-filter="dropsyLevel" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('DropsyLevel')"></option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="layui-row layui-col-space1">
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 col-flex">
                            <div class="disui-form-flex">
                                <label class="long-lable">出血点/瘀斑/血肿等：</label>
                                <select name="hematomaStatus" lay-filter="hematomaStatus" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('HematomaStatus')"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm9 layui-col-md9 layui-col-lg9">
                            <div class="disui-form-flex">
                                <input type="text" name="hematomaRemarks" maxlength="1000" autocomplete="off" :attr="@readonly">
                            </div>
                        </div>
                    </div>
                    <fieldset class="layui-elem-field layui-field-title">
                        <legend>肺部情况</legend>
                    </fieldset>
                    <div class="layui-row layui-col-space1">
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>呼吸音：</label>
                                <select name="breathSounds" lay-filter="breathSounds" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('BreathSounds')"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>胸膜摩擦音：</label>
                                <select name="pleuralRubSounds" lay-filter="pleuralRubSounds" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('PleuralRubSounds')"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>啰音：</label>
                                <select name="raleSounds" lay-filter="raleSounds" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('RaleSounds')"></option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <fieldset class="layui-elem-field layui-field-title">
                        <legend>心脏情况</legend>
                    </fieldset>
                    <div class="layui-row layui-col-space1">
                        <div class="layui-col-sm6 layui-col-md6 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>心律：</label>
                                <select name="heartRhythm" lay-filter="heartRhythm" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('HeartRhythm')"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm6 layui-col-md6 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>心率：</label>
                                <input type="text" name="pulseRate" autocomplete="off" :attr="@readonly" lay-verify="number|pulseRate" maxlength="3">
                                <label class="layui-lable-unit">次/分</label>
                            </div>
                        </div>
                        <div class="layui-col-sm6 layui-col-md6 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>心脏大小：</label>
                                <select name="cardiacSize" lay-filter="cardiacSize" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('CardiacSize')"></option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="layui-row layui-col-space1">
                        <div class="layui-col-sm6 layui-col-md6 layui-col-lg3 ">
                            <div class="disui-form-flex">
                                <label>心包摩擦音：</label>
                                <select name="pericardialRubSounds" lay-filter="pericardialRubSounds" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('CardiacSounds')"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm6 layui-col-md6 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>杂音：</label>
                                <select name="murmurSounds" lay-filter="murmurSounds" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('CardiacSounds')"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm6 layui-col-md6 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>附加音：</label>
                                <select name="extraSounds" lay-filter="extraSounds" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('CardiacSounds')"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm6 layui-col-md6 layui-col-lg3 col-flex">
                            <div class="disui-form-flex">
                                <label class="long-lable">心包积液体征：</label>
                                <select name="pericardialEffusionSign" lay-filter="pericardialEffusionSign" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('PericardialEffusionSign')"></option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <fieldset class="layui-elem-field layui-field-title">
                        <legend>腹部情况</legend>
                    </fieldset>
                    <div class="layui-row layui-col-space1">
                        <div class="layui-col-sm6 layui-col-md6 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>腹水征：</label>
                                <select name="ascitesSign" lay-filter="ascitesSign" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('AscitesSign')"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm6 layui-col-md6 layui-col-lg3 col-flex">
                            <div class="disui-form-flex">
                                <label class="long-lable">肝颈动脉回流征：</label>
                                <select name="arterialRefluxSign" lay-filter="arterialRefluxSign" :attr="@disabled">
                                    <option value=""></option>
                                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('ArterialRefluxSign')"></option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/patient/patPhysicalCheckList.js?t=${currentTimeMillis}"></script>
</body>
</html>