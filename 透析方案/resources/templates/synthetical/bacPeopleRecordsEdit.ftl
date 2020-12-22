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
        .layui-row .disui-form-flex>label{
            flex-basis: 120px;

        }
        .layui-form-radio{
            padding-right: 0px;
        }

        /*时间控件参考样式*/
        .layui-laydate-content td.laydate-selected {
            background-color: #e5f1f1;
        }
        .layui-laydate .layui-this {
            background-color: #72c0bb !important;
        }

    </style>
</head>
<body ms-controller="bacPeopleRecordsEdit">
<div class="layui-card-body" style="padding: 15px;">
<div class="layui-form" lay-filter="bacPeopleRecordsEdit_form" id="bacPeopleRecordsEdit_form" style="padding: 10px 10px 0 0;">


    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2 layui-hide">
            <div class="disui-form-flex " >
                <label>ID</label>
                <input type="hidden" name="peopleRecordsId"  autocomplete="off" />
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2 layui-hide">
            <div class="disui-form-flex " >
                <label>人员类型：</label>
                <input type="text" name="peopleType" :attr = {value:peopletype}   autocomplete="off">
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
            <div class="disui-form-flex" >
                <label><span class="edit-verify-span">*</span>姓名：</label>
                <input type="text" name="name" autocomplete="off" :attr="@readonly" >
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2" :visible ='@nurse'>
            <div class="disui-form-flex" >
                <label>性别：</label>
                <input type="radio" name="sex" ms-attr="{value:el.value,title:el.name,checked:true&&$index==0,disabled:disabledVal}"
                       ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Sex')">
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
            <div class="disui-form-flex" >
                <label>出生年月：</label>
                <input type="text" name="birthday"  id="birthday"  autocomplete="off" :attr="@disabled"  >
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
            <div class="disui-form-flex " >
                <label>籍贯：</label>
                <input type="text" name="birthplace"   autocomplete="off" :attr="@readonly" >
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
            <div class="disui-form-flex " >
                <label>入职日期：</label>
                <input type="text" name="hiredate"  id="hiredate"  autocomplete="off" :attr="@disabled"  >
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2" :visible ='@nurse || @doctor'>
            <div class="disui-form-flex " >
                <label>职称：</label>
                <select name="title" :attr="@disabled">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Title')"></option>
                </select>
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2" :visible ='@nurse || @doctor'>
            <div class="disui-form-flex " >
                <label>门店头衔：</label>
                <select name="storeTitle" :attr="@disabled">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('StoreTitle')"></option>
                </select>
            </div>
        </div>


        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2" :visible = '@admin'>
            <div class="disui-form-flex " >
                <label>职位：</label>
                <select name="position" :attr="@disabled">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Position')"></option>
                </select>
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2" :visible = '@admin'>
            <div class="disui-form-flex " >
                <label>学历：</label>
                <select name="education" :attr="@disabled">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('EducationLevel')"></option>
                </select>
            </div>
        </div>



        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2" :visible ='@nurse || @doctor'>
            <div class="disui-form-flex " >
                <label>临床年资：</label>
                <input type="text" name="clinicalYear"   autocomplete="off" :attr="@readonly"  >
            </div>
        </div>


        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2" :visible ='@nurse || @doctor'>
            <div class="disui-form-flex " >
                <label>血透年资：</label>
                <input type="text" name="hemodialysisYear"  autocomplete="off" :attr="@readonly" >
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2" :visible ='@nurse'>
            <div class="disui-form-flex " >
                <label>实际归属门店：</label>
                <input type="text" name="affiliation"   autocomplete="off" :attr="@readonly" >
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2" :visible = '@doctor'>
            <div class="disui-form-flex " >
                <label>证件类型：</label>
                <select name="idcardType" :attr="@disabled">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('IdCardType')"></option>
                </select>
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2" :visible = '@doctor'>
            <div class="disui-form-flex " >
                <label>证件号码：</label>
                <input type="text" name="idcardNo"  autocomplete="off" :attr="@readonly">
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2" :visible = '@nurse'>
            <div class="disui-form-flex " >
                <label>考核次数：</label>
                <input type="number" name="examine"    autocomplete="off" :attr="@readonly">
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2" :visible = '@nurse'>
            <div class="disui-form-flex " >
                <label>是否为带教：</label>
                <input type="radio"  name="teaching" ms-attr="{value:el.value,title:el.name,checked:true&&$index==0,disabled:disabledVal}"
                       ms-for="($index, el) in @myFun.whetherFun()" >
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2" :visible = '@nurse'>
            <div class="disui-form-flex " >
                <label>是否有进修证：</label>

                <input type="radio"  name="learnCard" ms-attr="{value:el.value,title:el.name,checked:true&&$index==0,disabled:disabledVal}"
                       ms-for="($index, el) in @myFun.whetherFun()" >
            </div>
        </div>

        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2" :visible = '@nurse'>
            <div class="disui-form-flex " >
                <label>人才分类：</label>
                <select name="talentsClass" :attr="@disabled">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('talentsClass')"></option>
                </select>
            </div>
        </div>



        <div class="layui-col-sm6 layui-col-md4 layui-col-lg6">
            <div class="disui-form-flex " >
                <label>状态：</label>
                <input type="radio"  name="dataStatus" ms-attr="{value:el.value,title:el.name,checked:true&&$index==0,disabled:disabledVal}"
                       ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('sys_status')" >
            </div>
        </div>

    </div>

        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="bacPeopleRecordsEdit_submit" id="bacPeopleRecordsEdit_submit">提交</button>
        </div>
</div>
    </div>
<script type="text/javascript" src="${ctxsta}/static/js/synthetical/bacPeopleRecordsEdit.js?t=${currentTimeMillis}"></script>
</body>


</html>