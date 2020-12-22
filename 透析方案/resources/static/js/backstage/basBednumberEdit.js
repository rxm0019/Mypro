/**
 * 床位设置-新增、编辑
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/06
 */
var basBednumberEdit = avalon.define({
    $id: "basBednumberEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    regionList:[],//区域列表
    wardList:[],//病区列表
    deviceList:[],//透析机列表
    characteristics:[],//治疗特征
    infectionMark:[],//感染特征
    regionId:'',//区域
    wardId:'',//病区
    codeNo:'',//透析机
    brand:"",//品牌型号
    tmp:[],//所选的透析机的详细信息
    readonly: {readonly: false}, // 设置只读
    disabled:{disabled: false} // 设置只读
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        laydate.render({
            elem: '#createTime'
            ,type: 'date'
        });
        laydate.render({
            elem: '#updateTime'
            ,type: 'date'
        });
        var id=GetQueryString("id");  //接收变量
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        //详情设置只读属性
        if (layEvent === 'detail') {
            basBednumberEdit.readonly = {readonly: true};
            basBednumberEdit.disabled = {disabled: true};
            $('input[type="radio"]').prop('disabled', true);
        }
        basBednumberEdit.wardId=GetQueryString("wardId");//接受病区代码
        basBednumberEdit.codeNo=GetQueryString("codeNo");//接受透析机id
        getWardList(function(data){
            getRegionList(function(data){
                getDeviceList(basBednumberEdit.codeNo,function(data){
                    //获取实体信息
                    getInfo(id,function(data){
                        //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
                        //...
                    });
                });
            });
        });
        //下拉框联动
        form=layui.form;
        form.on('select(wardId)', function(data){
            basBednumberEdit.wardId = data.value;
            basBednumberEdit.regionList=[];
            getRegionList(function(data){
            });
        });
        form.on('select(codeNo)', function(data){
            getDeviceByCodeNo(data.value);
        });
        avalon.scan();
    });
});
//获取病区列表
function getWardList($callback){
    var param = {
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.platform + "/basWardSetting/getLists.do",
        data:param,
        dataType: "json",
        done:function(data){
            basBednumberEdit.wardList = data;
            var form=layui.form; //调用layui的form模块
            form.render();
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}

//获取区域列表
function getRegionList($callback){
    var param = {
        wardSettingId:basBednumberEdit.wardId
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.platform + "/basRegionSetting/getLists.do",
        data:param,
        dataType: "json",
        done:function(data){
            basBednumberEdit.regionList = data;
            var form=layui.form; //调用layui的form模块
            form.render();
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}

//获取透析机列表
function getDeviceList(codeNo,$callback){
    var tmp = baseFuncInfo.getSysDictByCode("DialyzerType");
    var deviceType = '';
    $.each(tmp,function(index, item){
        if(item.value !=""){
            deviceType = item.value;
        }
    })
    var param = {
        deviceType:deviceType,//设备类型为透析机
        codeNo:codeNo
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.logistics + "/bacDevice/getDialyzerLists.do",
        data:param,
        dataType: "json",
        done:function(data){
            basBednumberEdit.deviceList = data;
            var form=layui.form; //调用layui的form模块
            form.render();
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}

//获取所选透析机的详细资料
function getDeviceByCodeNo(data) {
    basBednumberEdit.tmp = basBednumberEdit.deviceList.filter(x=>x.codeNo == data);
    if(basBednumberEdit.tmp !=null && basBednumberEdit.tmp.length>0){
        basBednumberEdit.brand = basBednumberEdit.tmp[0].brand+basBednumberEdit.tmp[0].modelNo;
        //将类似于1,2,3...字符串转为数组
        var characteristicsarr = basBednumberEdit.tmp[0].characteristics.split(',');

        $("[name='characteristics']").each(function () {
                //预设未选中
                this.checked = false;
            for (var i in characteristicsarr) {
                //若与存储的数据相同则选中
                if (characteristicsarr[i] == $(this).attr("value")) {
                    this.checked = true;
                }
            }
            });


        //将类似于1,2,3...字符串转为数组
        var infectionMarkarr = basBednumberEdit.tmp[0].infectionMark.split(',');
        $("[name='infectionMark']").each(function () {
            //预设未选中
            this.checked = false;
            for (var i in infectionMarkarr) {
                //若与存储的数据相同则选中
                if(infectionMarkarr[i] === $(this).attr("value")){
                    this.checked = true;
                }
            }
        });

        layui.form.render();
    }
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
            "bedNumberId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + "/basBednumber/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.createTime=util.toDateString(data.createTime,"yyyy-MM-dd");
                data.updateTime=util.toDateString(data.updateTime,"yyyy-MM-dd");
                data.wardSettingId=basBednumberEdit.wardId;
                layui.form.render();
                getDeviceByCodeNo(data.codeNo);
                form.val('basBednumberEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}
/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(basBednumberEdit_submit)', function(data){
        //检验只能输入正整数
        var numberReg = /^[+]{0,1}(\d+)$/;
        if(isNotEmpty(data.field.orderNo) && !numberReg.test(data.field.orderNo)){
            errorToast("排列顺序只能输入正整数！");
        }else{
            //通过表单验证后
            var field = data.field; //获取提交的字段
            typeof $callback === 'function' && $callback(field); //返回一个回调事件
        }
    });
    $("#basBednumberEdit_submit").trigger('click');
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
        if(param.bedNumberId.length == 0){
            url = $.config.services.platform + "/basBednumber/save.do";
        }else{
            url = $.config.services.platform + "/basBednumber/edit.do";
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



