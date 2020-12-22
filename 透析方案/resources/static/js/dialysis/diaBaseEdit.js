/**
 * 透析治疗--透析信息--编辑患者标签
 * @author Care
 * @date 2020-09-02
 * @version 1.0
 */
var diaBaseEdit = avalon.define({
    $id: "diaBaseEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientTagList: [],//患者标签
    patientId: '',
});

layui.use(['index','inputTags'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate = layui.laydate;
        laydate.render({
            elem: '#createTime'
            , type: 'date'
        });
        laydate.render({
            elem: '#updateTime'
            , type: 'date'
        });
        var id = GetQueryString("patientId");  //接收变量
        diaBaseEdit.patientId = id;
        getTagAndColor();
        //获取实体信息
        getInfo(id, function (data) {
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });
        avalon.scan();
    });
});

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(id) {

    if (isEmpty(id)) {

    } else {
        //编辑
        var param = {
            "patientId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/diaBase/getPatientTag.do",
            data: param,
            dataType: "json",
            done: function (data) {
                var patPatientTagList = [];
                var obj={};
                $.each(data, function (index, item) {
                   // patPatientTagList.push(item.tagContent);
                    item.tagColors = getSysDictBizCode("PatientTagsColor", item.tagColor);
                    patPatientTagList.push(item);
                })
                var inputTags = layui.inputTags;
                inputTags.render({
                    elem:'#inputTags',//定义输入框input对象
                    content: patPatientTagList,//默认标签
                    aldaBtn: false,//是否开启获取所有数据的按钮
                    done: function(value){ //回车后的回调
                        console.log(value)
                    }
                })
                var list = [];
                $.each(data, function (index, item) {
                    var obj = {tagContent: item.tagContent,tagColor: item.tagColor};
                    list.push(obj);
                })
                diaBaseEdit.patientTagList = list;
            }
        });
    }
}

/**
 * 添加标签
 */
/**
 * 添加标签
 * @param type
 * @param name
 */
function addPatientTags(type,name,dictBizCode){
    var arr =[];
    if (type == 1) {
        // 先判断是否有重复数据
        if(judgeDuplicate(name)){
            return false;
        }
        var obj = {tagContent:name, tagColor:dictBizCode};
        diaBaseEdit.patientTagList.push(obj);
        // arr.push(name);
        var tagColors = getSysDictBizCode("PatientTagsColor", dictBizCode);
        arr.push({tagContent: name, tagColors: tagColors});
    } else {
        // 先判断是否有重复数据
        if(judgeDuplicate($("#customPatientTagsId").val())){
            return false;
        }
        var tagColor = $('input[name=tagColor]:checked')[0].value;
        var obj = {tagContent:$("#customPatientTagsId").val(),tagColor:tagColor}
        diaBaseEdit.patientTagList.push(obj);
        if (isEmpty($("#customPatientTagsId").val())) {
            errorToast("请输入自定义标签",500);
            return false;
        }
        // arr.push($("#customPatientTagsId").val());
        var tagColors = getSysDictBizCode("PatientTagsColor", tagColor);
        arr.push({tagContent: $("#customPatientTagsId").val(), tagColors: tagColors});

        $("#customPatientTagsId").val("");
    }
    // var dropdown = layui.dropdown;
    // dropdown.hide("[lay-filter='test8']");
    var inputTags = layui.inputTags;
    inputTags.render({
        elem:'#inputTags',//定义输入框input对象
        content: arr,
        aldaBtn: false,//是否开启获取所有数据的按钮
        done: function(value){ //回车后的回调
            console.log(value)
        }
    })
}

function getTagAndColor(){
    // 常用标签赋值
    var tagData = baseFuncInfo.getSysDictByCode('PatientTags');
    var html = ''
    $.each(tagData,function(index, item){
        var borderColor = getSysDictBizCode("PatientTagsColor", item.dictBizCode);
        html+= '<div class="layui-tag" style="border: 1px solid ' +borderColor+ ';color: '+borderColor+'" onclick="addPatientTags(1,\''+ item.name +'\',\''+ item.dictBizCode +'\')"> '+item.name+'</div>'
    })
    $("#patientTagsId").html(html);
    // 标签颜色赋值
    var colorData = baseFuncInfo.getSysDictByCode('PatientTagsColor');
    var html = ''
    $.each(colorData,function(index, item){
        if(index === 0){
            html += '<input type="radio" data-color="'+item.dictBizCode+'" style="color: '+item.dictBizCode+'" checked lay-verify="radio" lay-verify-msg="标签颜色"  name="tagColor" value = '+item.value+' title = '+item.name+'>'
        } else{
            html += '<input type="radio" data-color="'+item.dictBizCode+'" style="color: '+item.dictBizCode+'" lay-verify="radio" lay-verify-msg="标签颜色"  name="tagColor" value = '+item.value+' title = '+item.name+'>'
        }
    })
    $('#patientTagsColorId').html(html);
    layui.form.render('radio');
    //根据值设置不同颜色
    $('input[name=tagColor]').each(function(){
        var color = $(this).data("color");
        $(this).next().css("color",color);
        $(this).next().find(".layui-icon").css("color",color);
    });
}

// 判断标签列表是否有重复数据
function judgeDuplicate(name) {
    var flag = false;
    var data = diaBaseEdit.patientTagList;
    $.each(data, function (index, item) {
        if (item.tagContent === name) {
            flag = true;
            return false;
        }
    })
    if(flag){
        layer.msg("请勿添加重复标签", {
            icon: 2
            ,shade: 0.01
            ,time: 1000
        });
    }
    return flag;
}

// 删除标签
$('#tags').on('click','.close',function(){
    var tagContent = $(this).parent('span').find('em').text();
    var data = diaBaseEdit.patientTagList;
    $.each(data, function(index, item){
        if(item.tagContent === tagContent){
            data.splice(index,1);
            return false;
        }
    })
    diaBaseEdit.patientTagList = data;
})


/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(tagMaintainEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#tagMaintainEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        var param = field; //表单的元素
        param.patPatientTagEdit = JSON.stringify(diaBaseEdit.patientTagList);        //可以继续添加需要上传的参数
        param.patientId = diaBaseEdit.patientId;
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/diaBase/savePatientTag.do",
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



