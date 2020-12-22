/**
 * 检查项维护的js文件，包括查询，编辑操作
 * @author: Freya
 * @version: 1.0
 * @date: 2020/09/23
 */
var bacExamineItemsEdit = avalon.define({
    $id: "bacExamineItemsEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    testMainList:getTestMainList(),
    //参考值类别
    categoryList:[
        {"name":"通用","value":"0"}
        ,{"name":"参考值分男与女","value":"1"}
        ,{"name":"参考值分大人与小孩","value":"2"}
        ,{"name":"参考值分大人与小孩且有男女之分","value":"3"}],
    hospitalInspectionList:[],//外送机构关联资料
    layEvent:'', //操作类型
    disabled:{disabled: false}, // 设置只读
    readonly:{readonly: false}, // 设置只读
    infoData :{
        "dangerHigh1":""
        ,"dangerHigh2":""
        ,"dangerHigh3":""
        ,"dangerHigh4":""
        ,"dangerLow1":""
        ,"dangerLow2":""
        ,"dangerLow3":""
        ,"dangerLow4":""
        ,"normalHigh1":""
        ,"normalHigh2":""
        ,"normalHigh3":""
        ,"normalHigh4":""
        ,"normalLow1":""
        ,"normalLow2":""
        ,"normalLow3":""
        ,"normalLow4":""
        }
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //获取检验机构
        bacExamineItemsEdit.hospitalInspectionList=getSysDictByCode("HospitalInspection",true);
        $.each(bacExamineItemsEdit.hospitalInspectionList, function (i, item) {
            if(i<bacExamineItemsEdit.hospitalInspectionList.length){
                if(item.value==""){
                    bacExamineItemsEdit.hospitalInspectionList.splice(i,1);
                }
            }
        });
        var id=GetQueryString("id");  //接收变量
        bacExamineItemsEdit.layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            if (bacExamineItemsEdit.layEvent === 'detail') {
                $('input[type="text"]').prop('readonly', true);
                $('textarea').prop('readonly', true);
                $('input[type="radio"]').prop('disabled', true);
                bacExamineItemsEdit.disabled = {disabled: true};
                bacExamineItemsEdit.readonly = {readonly: true};
            }
        });
        form=layui.form;
        form.on('radio(category)', function(data){
            var value = data.value;
            addItemsHtml(value);
        });
        avalon.scan();
    });
});

//获取检验总类列表
function getTestMainList() {
    var dicts=[];
    var param = {
    };
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/basTestMain/getLists.do",
        data:param,
        dataType: "json",
        async:false,
        done: function(data){
            if(data != null && data.length>0){
                for(var i=0;i<data.length;i++){
                    dicts.push({value:data[i].testMainId,name:data[i].testName});
                }
            }
        }
    });
    return dicts;
}

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getInfo(id,$callback){
    if(isEmpty(id)){
        //新增
        $.each(bacExamineItemsEdit.hospitalInspectionList, function (index, item) {
            item.examineItemsRid = "";
            item.dictDataId = item.value;
            item.examineItemsNo = "";
            item.examineItemsName = "";
        });
        addItemsRHtml();
        addItemsHtml('0');
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    }else{
        //编辑
        var param={
            "examineItemsId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + "/bacExamineItems/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                var tmp = getSysDictByCode("HospitalInspection",true);
                $.each(tmp, function (index, item) {
                    $.each(data.bacExamineItemsRList, function (indexR, itemR) {
                        if(item.value == itemR.dictDataId){
                            itemR.name = item.name;
                        }
                    });
                });
                bacExamineItemsEdit.hospitalInspectionList = data.bacExamineItemsRList;
                bacExamineItemsEdit.infoData = data
                if(bacExamineItemsEdit.hospitalInspectionList.length==0){//判断是否原数据中是否有相关联的外送单位，如果没有，相当于重新新增。
                    //获取检验机构
                    bacExamineItemsEdit.hospitalInspectionList=getSysDictByCode("HospitalInspection",true);
                    $.each(bacExamineItemsEdit.hospitalInspectionList, function (i, item) {
                        if(i<bacExamineItemsEdit.hospitalInspectionList.length){
                            if(item.value==""){
                                bacExamineItemsEdit.hospitalInspectionList.splice(i,1);
                            }
                        }
                    });
                    //新增
                    $.each(bacExamineItemsEdit.hospitalInspectionList, function (index, item) {
                        item.examineItemsRid = "";
                        item.dictDataId = item.value;
                        item.examineItemsNo = "";
                        item.examineItemsName = "";
                    });
                }
                addItemsRHtml();
                addItemsHtml(data.category);
                form.val('bacExamineItemsEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

/**
 * 送检机构的关联项目编码、名称
 */
function addItemsRHtml() {
    var form=layui.form; //调用layui的form模块
    var html = '';
    html +='<table cellspacing="0" cellpadding="0" border="0" class="layui-table">' +
        '<tbody>' +
        '<tr style="height: 31px;">' +
            '<td align="center" style="text-align:left;">' +
                '<div class="layui-table-cell">'+"外送单位名称"+'</div>' +
            '</td>' +
            '<td align="center" style="text-align:center;">' +
                '<div class="layui-table-cell">' +"外送单位检查项编码" + '</div>' +
            '</td>' +
            '<td align="center" style="text-align:center;">' +
                '<div class="layui-table-cell">' +"外送单位检查项名称" + '</div>' +
            '</td>' +
        '</tr>'
    $.each(bacExamineItemsEdit.hospitalInspectionList, function (index, item) {
        html +='<tr ms-for="($index,el) in hospitalInspectionList">'+
            '<td align="center" style="text-align:center;" class="layui-hide">'+
                '<div class="layui-table-cell">'+ item.dictDataId+ '</div>'+
            '</td>'+
            '<td align="center" style="text-align:center;">'+
                '<div class="layui-table-cell">'+item.name+ '</div>'+
            '</td>'+
            '<td align="center" style="text-align:center;">'+
                '<div class="disui-form-flex " >'+
                    '<input type="text" value="'+item.examineItemsNo+'" name="'+"examineItemsNo"+index+'" :attr='+bacExamineItemsEdit.readonly+' onchange="getExamineItems('+index+')">'+
                '</div>'+
            '</td>'+
            '<td align="center" style="text-align:center;">'+
                '<div class="disui-form-flex " >'+
                    '<input type="text" value="'+item.examineItemsName+'" name="'+"examineItemsName"+index+'" :attr='+bacExamineItemsEdit.readonly+' onchange="getExamineItems('+index+')">'+
                '</div>'+
            '</td>'+
        '</tr>'
    });
    html +='</tbody>' +
        '</table>'
    $('#bacExamineItemsRList').html(html);
    form.render();
}

/**
 * 给送检单位的编码与名称赋值
 */
function getExamineItems(index) {
    var no = "examineItemsNo"+index;
    var name = "examineItemsName"+index;
    bacExamineItemsEdit.hospitalInspectionList[index].examineItemsNo = $("input[name=" + no + "]").val();
    bacExamineItemsEdit.hospitalInspectionList[index].examineItemsName = $("input[name=" + name + "]").val();
}

/**
 * 不同类别显示不同的参考值
 */
function addItemsHtml(value) {
    var form=layui.form; //调用layui的form模块
    var html = '';
    html +='<table cellspacing="0" cellpadding="0" border="0" class="layui-table">' +
        '<tbody>' +
        '<tr>' +
            '<td align="center" style="text-align:center;" rowspan="2">' +
                '<div class="layui-table-cell">' +"类别"+'</div>' +
            '</td>' +
            '<td align="center" style="text-align:center;" colspan="2">' +
                '<div class="layui-table-cell">' +"正常值"+ '</div>' +
            '</td>' +
            '<td align="center" style="text-align:center;" colspan="2">' +
                '<div class="layui-table-cell">' +"危险值"+ '</div>' +
            '</td>' +
        '</tr>' +
        '<tr>' +
            '<td align="center" style="text-align:center;">' +
                '<div class="layui-table-cell">' +"低"+ '</div>' +
            '</td>' +
            '<td align="center" style="text-align:center;">' +
                '<div class="layui-table-cell">' +"高"+'</div>' +
            '</td>' +
            '<td align="center" style="text-align:center;">' +
                '<div class="layui-table-cell">' +"低"+ '</div>' +
            '</td>' +
            '<td align="center" style="text-align:center;">' +
                '<div class="layui-table-cell">' +"高" + '</div>' +
            '</td>' +
        '</tr>'+
        '<tr>'
        if(value == '0'){//通用
            html +='<td align="center" style="text-align:center;">' +
                '<div class="layui-table-cell">' +"参考值" + '</div>' +
                '</td>'
        }else if(value == '1'){//参考值分男与女
            html +='<td align="center" style="text-align:center;">' +
                '<div class="layui-table-cell">' +"男"+ '</div>' +
                '</td>'
        }else if(value == '2'){//参考值分大人与小孩
            html +='<td align="center" style="text-align:center;">' +
                '<div class="layui-table-cell">' +"大人"+ '</div>' +
                '</td>'
        }else if(value == '3'){//参考值分大人与小孩且有男女之分
            html +='<td align="center" style="text-align:center;">' +
                '<div class="layui-table-cell">' +"大人（男）" + '</div>' +
                '</td>'
        }
        html +='<td align="center" style="text-align:center;">' +
                '<div class="disui-form-flex " >' +
                    '<input type="text" name="normalLow1" value="'+ bacExamineItemsEdit.infoData.normalLow1 +'" :attr="@readonly">' +
                '</div>' +
            '</td>' +
            '<td align="center" style="text-align:center;">' +
                '<div class="disui-form-flex " >' +
                    '<input type="text" name="normalHigh1" value="'+ bacExamineItemsEdit.infoData.normalHigh1 +'"  :attr="@readonly">' +
                '</div>' +
            '</td>' +
            '<td align="center" style="text-align:center;">' +
                '<div class="disui-form-flex " >' +
                    '<input type="text" name="dangerLow1" value="'+ bacExamineItemsEdit.infoData.dangerLow1 +'" :attr="@readonly">' +
                '</div>' +
            '</td>' +
            '<td align="center" style="text-align:center;">' +
                '<div class="disui-form-flex " >' +
                    '<input type="text" name="dangerHigh1" value="'+ bacExamineItemsEdit.infoData.dangerHigh1 +'" :attr="@readonly">' +
                '</div>' +
            '</td>' +
        '</tr>'
    if(value != '0'){//通用类型不显示该行
        html +='<tr>'
        if(value == '1'){//参考值分男与女
            html +='<td align="center" style="text-align:center;">' +
                '<div class="layui-table-cell">' +"女" + '</div>' +
                '</td>'
        }else if(value == '2'){//参考值分大人与小孩
            html +='<td align="center" style="text-align:center;">' +
                '<div class="layui-table-cell">' +"小孩" + '</div>' +
                '</td>'
        }else if(value == '3'){//参考值分大人与小孩且有男女之分
            html +='<td align="center" style="text-align:center;">' +
                '<div class="layui-table-cell">' +"大人（女）"+ '</div>' +
                '</td>'
        }
        html+='<td align="center" style="text-align:center;">' +
            '<div class="disui-form-flex " >' +
            '<input type="text" name="normalLow2" value="'+ bacExamineItemsEdit.infoData.normalLow2 +'" :attr="@readonly">' +
            '</div>' +
            '</td>' +
            '<td align="center" style="text-align:center;">' +
            '<div class="disui-form-flex " >' +
            '<input type="text" name="normalHigh2" value="'+ bacExamineItemsEdit.infoData.normalHigh2 +'" :attr="@readonly">' +
            '</div>' +
            '</td>' +
            '<td align="center" style="text-align:center;">' +
            '<div class="disui-form-flex " >' +
            '<input type="text" name="dangerLow2" value="'+ bacExamineItemsEdit.infoData.dangerLow2 +'" :attr="@readonly">' +
            '</div>' +
            '</td>' +
            '<td align="center" style="text-align:center;">' +
            '<div class="disui-form-flex " >' +
            '<input type="text" name="dangerHigh2" value="'+ bacExamineItemsEdit.infoData.dangerHigh2 +'" :attr="@readonly">' +
            '</div>' +
            '</td>' +
            '</tr>'
    }
    if(value == '3'){//参考值分大人与小孩且有男女之分
        html +=
            '<tr>' +
                '<td align="center" style="text-align:center;">' +
                    '<div class="layui-table-cell">' +"小孩（男）" +'</div>' +
                '</td>' +
                '<td align="center" style="text-align:center;">' +
                    '<div class="disui-form-flex " >' +
                        '<input type="text" name="normalLow3" value="'+ bacExamineItemsEdit.infoData.normalLow3 +'" :attr="@readonly">' +
                    '</div>' +
                '</td>' +
                '<td align="center" style="text-align:center;">' +
                    '<div class="disui-form-flex " >' +
                        '<input type="text" name="normalHigh3" value="'+ bacExamineItemsEdit.infoData.normalHigh3 +'" :attr="@readonly">' +
                    '</div>' +
                '</td>' +
                '<td align="center" style="text-align:center;">' +
                    '<div class="disui-form-flex " >' +
                        '<input type="text" name="dangerLow3" value="'+ bacExamineItemsEdit.infoData.dangerLow3 +'" :attr="@readonly">' +
                    '</div>' +
                '</td>' +
                '<td align="center" style="text-align:center;">' +
                    '<div class="disui-form-flex " >' +
                        '<input type="text" name="dangerHigh3" value="'+ bacExamineItemsEdit.infoData.dangerHigh3 +'" :attr="@readonly">' +
                    '</div>' +
                '</td>' +
            '</tr>' +
            '<tr>' +
                '<td align="center" style="text-align:center;">' +
                    '<div class="layui-table-cell">' +"小孩（女）"+ '</div>' +
                '</td>' +
                '<td align="center" style="text-align:center;">' +
                    '<div class="disui-form-flex " >' +
                        '<input type="text" name="normalLow4" value="'+ bacExamineItemsEdit.infoData.normalLow4 +'" :attr="@readonly">' +
                    '</div>' +
                '</td>' +
                '<td align="center" style="text-align:center;">' +
                    '<div class="disui-form-flex " >' +
                        '<input type="text" name="normalHigh4" value="'+ bacExamineItemsEdit.infoData.normalHigh4 +'" :attr="@readonly">' +
                    '</div>' +
                '</td>' +
                '<td align="center" style="text-align:center;">' +
                    '<div class="disui-form-flex " >' +
                        '<input type="text" name="dangerLow4" value="'+ bacExamineItemsEdit.infoData.dangerLow4 +'" :attr="@readonly">' +
                    '</div>' +
                '</td>' +
                '<td align="center" style="text-align:center;">' +
                    '<div class="disui-form-flex " >' +
                        '<input type="text" name="dangerHigh4" value="'+ bacExamineItemsEdit.infoData.dangerHigh4 +'" :attr="@readonly">' +
                    '</div>' +
                '</td>' +
            '</tr>'
    }
    html +='</tbody>' +
            '</table>'
    $('#bacExamineItemsList').html(html);
    form.render();
}
/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(bacExamineItemsEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        dis_verify_form(field,$callback)
        // typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacExamineItemsEdit_submit").trigger('click');
}

function dis_verify_form(field,$callback) {
    var errMsg = [];
    if(isNotEmpty(field.normalLow1) && !isNumber(field.normalLow1)){
        errMsg.push("第一行正常低值不是数值类型");
    }
    if(isNotEmpty(field.normalHigh1) && !isNumber(field.normalHigh1)){
        errMsg.push("第一行正常高值不是数值类型");
    }
    if(isNotEmpty(field.dangerLow1) && !isNumber(field.dangerLow1)){
        errMsg.push("第一行危险低值不是数值类型");
    }
    if(isNotEmpty(field.dangerHigh1) && !isNumber(field.dangerHigh1)){
        errMsg.push("第一行危险高值不是数值类型");
    }
    if(isNotEmpty(field.normalLow2) && !isNumber(field.normalLow2)){
        errMsg.push("第二行正常低值不是数值类型");
    }
    if(isNotEmpty(field.normalHigh2) && !isNumber(field.normalHigh2)){
        errMsg.push("第二行正常高值不是数值类型");
    }
    if(isNotEmpty(field.dangerLow2) && !isNumber(field.dangerLow2)){
        errMsg.push("第二行危险低值不是数值类型");
    }
    if(isNotEmpty(field.dangerHigh2) && !isNumber(field.dangerHigh2)){
        errMsg.push("第二行危险高值不是数值类型");
    }
    if(isNotEmpty(field.normalLow3) && !isNumber(field.normalLow3)){
        errMsg.push("第三行正常低值不是数值类型");
    }
    if(isNotEmpty(field.normalHigh3) && !isNumber(field.normalHigh3)){
        errMsg.push("第三行正常高值不是数值类型");
    }
    if(isNotEmpty(field.dangerLow3) && !isNumber(field.dangerLow3)){
        errMsg.push("第三行危险低值不是数值类型");
    }
    if(isNotEmpty(field.dangerHigh3) && !isNumber(field.dangerHigh3)){
        errMsg.push("第三行危险高值不是数值类型");
    }
    if(isNotEmpty(field.normalLow4) && !isNumber(field.normalLow4)){
        errMsg.push("第四行正常低值不是数值类型");
    }
    if(isNotEmpty(field.normalHigh4) && !isNumber(field.normalHigh4)){
        errMsg.push("第四行正常高值不是数值类型");
    }
    if(isNotEmpty(field.dangerLow4) && !isNumber(field.dangerLow4)){
        errMsg.push("第四行危险低值不是数值类型");
    }
    if(isNotEmpty(field.dangerHigh4) && !isNumber(field.dangerHigh4)){
        errMsg.push("第四行危险高值不是数值类型");
    }
    if(errMsg.length > 0){
        errorToast(errMsg.toString());
        return false;
    }
    typeof $callback === 'function' && $callback(field); //返回一个回调事件
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field; //表单的元素
        //判断是否存在主键ID，不存在执行新增否则为编辑
        var url = '';
        if(param.examineItemsId.length == 0){
            url = $.config.services.platform + "/bacExamineItems/save.do";
        }else{
            url = $.config.services.platform + "/bacExamineItems/edit.do";
        }
        //可以继续添加需要上传的参数
        var tmp = [];
        $.each(bacExamineItemsEdit.hospitalInspectionList, function (index, item) {
            tmp.push({
                examineItemsRid:item.examineItemsRid,
                dictDataId:item.dictDataId,
                examineItemsNo:item.examineItemsNo,
                examineItemsName:item.examineItemsName,
            })
        });
        console.log(bacExamineItemsEdit.hospitalInspectionList);
        param.bacExamineItemsRList = tmp;
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            contentType: "application/json; charset=utf-8", //此设置后台可接受复杂参数，后台接收需要@RequestBody标签
            data:JSON.stringify(param), //此设置后台可接受复杂参数
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



