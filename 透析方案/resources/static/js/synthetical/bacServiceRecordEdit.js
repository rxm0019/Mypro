/**
 * 维护保养记录-新增、编辑
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/13
 */
var bacServiceRecordEdit = avalon.define({
    $id: "bacServiceRecordEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    deviceType:'',//设备类型
    deviceList:[],//设备列表
    serviceType:'',//维护类型
    bacServiceConfigList:[],//维护详情
    readonly: {readonly: false}, // 设置只读
    disabled:{disabled: false}, // 设置只读
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id=GetQueryString("id");  //接收变量id
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        if (layEvent === 'detail') {
            bacServiceRecordEdit.readonly = {readonly: true};
            bacServiceRecordEdit.disabled = {disabled: true};
            $('input[type="radio"]').prop('disabled', true);
        }
        if(layEvent != 'detail'){
            //初始化表单元素,日期时间选择器
            var laydate=layui.laydate;
            laydate.render({
                elem: '#serviceDate'
                ,type: 'date'
                ,trigger: 'click'
            });
        }
        bacServiceRecordEdit.deviceType=GetQueryString("deviceType");  //接收设备类型
        bacServiceRecordEdit.serviceType=GetQueryString("serviceType");  //接收维护类型
        getDeviceList(bacServiceRecordEdit.deviceType,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //获取实体信息
            getInfo(id,function(data){
                //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
                if(isNotEmpty(id)){
                    getList(id);
                }
            });
        });
        //下拉框联动
        form=layui.form;
        form.on('select(deviceType)', function(data){
            bacServiceRecordEdit.deviceType = data.value;
            getDeviceList(data.value,function(data){
                //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
                //...
            });
            getList(id);
        });
        var form=layui.form; //调用layui的form模块
        var util=layui.util;
        var data = {};
        if(isEmpty(id)){
            data = {
                serviceDate:util.toDateString(new Date(),"yyyy-MM-dd")
                ,accendant:baseFuncInfo.userInfoData.username
            }
        }
        form.val('bacServiceRecordEdit_form', data);
        avalon.scan();
    });
});

//获取设备列表
function getDeviceList(deviceType,$callback){
    var param = {
        deviceType:deviceType
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.logistics + "/bacDevice/getLists.do",
        data:param,
        dataType: "json",
        done:function(data){
            bacServiceRecordEdit.deviceList = data;
            var form=layui.form; //调用layui的form模块
            form.render();
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
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
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    }else{
        //编辑
        var param={
            "serviceRecordId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/bacServiceRecord/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.serviceDate = isNotEmpty(data.serviceDate) ? util.toDateString(data.serviceDate, "yyyy-MM-dd") : "";
                data.createTime = isNotEmpty(data.createTime) ? util.toDateString(data.createTime, "yyyy-MM-dd") : "";
                data.updateTime = isNotEmpty(data.updateTime) ? util.toDateString(data.updateTime, "yyyy-MM-dd") : "";
                bacServiceRecordEdit.serviceType=data.serviceType;
                data.deviceType=bacServiceRecordEdit.deviceType;
                form.val('bacServiceRecordEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

/**
 * 查询维护、年检详情列表事件
 */
function getList(id) {
    bacServiceRecordEdit.bacServiceConfigList = [];
    var param = {
        deviceType:bacServiceRecordEdit.deviceType,
        serviceType:bacServiceRecordEdit.serviceType,
        serviceRecordId:id
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#bacServiceConfigList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacServiceConfigList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/bacServiceConfig/listAll.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page:false,
            // limit: Number.MAX_VALUE, // 数据表格默认全部显示
            cols: [[//表头
                {field: 'serviceItem', title: '维护项目',align:'center'}
                ,{field: 'detailsItem', title: '具体项目',align:'center'}
                ,{field: 'checkRule', title: '检查说明',align:'center',width:90}
                ,{field: 'checkResult', title: '检查结果',align:'center',width:90
                    ,templet: function (d) {
                        bacServiceRecordEdit.bacServiceConfigList.push(d);
                        console.log(d);
                        var html = '';
                        if(bacServiceRecordEdit.serviceType == "0"){
                            if(d.checkResult == '1'){
                                html +='<div style="width: 100%;float: left"><input type="radio" name="checkResult'+d.serviceConfigId+'" value="0" title="未检查" /></div>'
                                html +='<div style="width: 100%;float: left"><input type="radio" name="checkResult'+d.serviceConfigId+'" value="1"  checked="checked" title="已检查" /></div>'
                            }else{
                                html +='<div style="width: 100%;float: left"><input type="radio" name="checkResult'+d.serviceConfigId+'" value="0" checked="checked" title="未检查" /></div>'
                                html +='<div style="width: 100%;float: left"><input type="radio" name="checkResult'+d.serviceConfigId+'" value="1"  title="已检查" /></div>'
                            }
                        }else{
                            if(d.checkResult == '1'){
                                html =  '<input type="checkbox" name="checkResult'+d.serviceConfigId+'" style="width: 60px" lay-skin="primary"  checked="checked">'
                            }else{
                                html =  '<input type="checkbox" name="checkResult'+d.serviceConfigId+'" style="width: 60px" lay-skin="primary">'
                            }
                        }
                        return html;
                    }
                }
                ,{field: 'remarks', title: '备注', edit: 'text',width:120}
            ]],
            done: function (res, curr, count) {
                //内容相同合并单元格
                merge(res);
                
                //由于layui 设置了超出隐藏，所以这里改变下，以兼容操作按钮的下拉菜单
                $("[lay-id=bacServiceConfigList_table]  td[data-field=checkResult] > .layui-table-cell").css('overflow', 'visible');
            }
        },
    });
    //监听单元格编辑
    table.on('edit(bacServiceConfigList_table)', function(obj){
        debugger
        var value = obj.value //得到修改后的值
            ,data = obj.data //得到所在行所有键值
            ,field = obj.field; //得到字段
        $.each(bacServiceRecordEdit.bacServiceConfigList,function(index, item){
            if(item.serviceConfigId==data.serviceConfigId){
                item.remarks=value;
            }
        })
    });
}

/**
 * 动态表格单元格合并
 */
function merge(res) {
    var data = res.bizData;
    var mergeIndex = 0;//定位需要添加合并属性的行数
    var mark = 1; //这里涉及到简单的运算，mark是计算每次需要合并的格子数
    var columsName = ['serviceItem'];//需要合并的列名称
    var columsIndex = [0];//需要合并的列索引值

    for (var k = 0; k < columsName.length; k++) { //这里循环所有要合并的列
        var trArr = $(".layui-table-body>.layui-table").find("tr");//所有行
        for (var i = 1; i < data.length; i++) { //这里循环表格当前的数据
            var tdCurArr = trArr.eq(i).find("td").eq(columsIndex[k]);//获取当前行的当前列
            var tdPreArr = trArr.eq(mergeIndex).find("td").eq(columsIndex[k]);//获取相同列的第一列

            if (data[i][columsName[k]] === data[i-1][columsName[k]]) { //后一行的值与前一行的值做比较，相同就需要合并
                mark += 1;
                tdPreArr.each(function () {//相同列的第一列增加rowspan属性
                    $(this).attr("rowspan", mark);
                });
                tdCurArr.each(function () {//当前行隐藏
                    $(this).css("display", "none");
                });
            }else {
                mergeIndex = i;
                mark = 1;//一旦前后两行的值不一样了，那么需要合并的格子数mark就需要重新计算
            }
        }
        mergeIndex = 0;
        mark = 1;
    }
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(bacServiceRecordEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段

        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacServiceRecordEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        var tmp = [];
        
        $.each(bacServiceRecordEdit.bacServiceConfigList,function(index, item){
            //检查结果赋值
            
            var checkResult = '';
            var Name = "checkResult"+item.serviceConfigId
            if(bacServiceRecordEdit.serviceType == "0"){
                $("input:radio[name='" + Name + "']").each(function () {
                    if ($(this).is(":checked")) {
                        checkResult = $(this).attr("value");
                    }
                });
            }else{
                $("input:checkbox[name='" + Name + "']").each(function () {
                    if ($(this).is(":checked")) {
                        checkResult = 1;
                    }else{
                        checkResult = 0;
                    }
                });
            }
            tmp.push({
                serviceConfigId:item.serviceConfigId,
                checkResult:checkResult,
                remarks:item.remarks
            })
        })
        field["bacServiceDetailsListStr"] = JSON.stringify(tmp);
        field.serviceType=bacServiceRecordEdit.serviceType;
        //成功验证后
        var param=field; //表单的元素
        //可以继续添加需要上传的参数
        //判断是否存在主键ID，不存在执行新增否则为编辑
        var url = '';
        if(param.serviceRecordId.length == 0){
            url = $.config.services.logistics + "/bacServiceRecord/save.do";
        }else{
            url = $.config.services.logistics + "/bacServiceRecord/edit.do";
        }
        _ajax({
            type: "POST",
            url: url,
            contentType: "application/json; charset=utf-8", //此设置后台可接受复杂参数，后台接收需要@RequestBody标签
            data:JSON.stringify(param), //此设置后台可接受复杂参数
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



