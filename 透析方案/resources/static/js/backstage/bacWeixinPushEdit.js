/**
 * 微信推送管理
 * @author anders
 * @date 2020-09-30
 * @version 1.0
 */
var bacWeixinPushEdit = avalon.define({
    $id: "bacWeixinPushEdit",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,pushType: ''         //推送模块
    ,pushModule: $.constant.PushModule
    ,healthThemeList: []    //健康教育主题
    ,noticeList: []         //公告主题
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var pushType=GetQueryString("pushType");  //接收变量
        bacWeixinPushEdit.pushType = isEmpty(pushType) ? '' : pushType;
        getPatientInfoList();
        if (pushType === $.constant.PushModule.HEALTHEDUCATION) {
            monitorSustainTypeRadio();
            getHealthTheme();
            $('#eduBaseId').attr('lay-verify','required');
        } else if (pushType === $.constant.PushModule.PATIENTSCHEDUL) {
            var laydate=layui.laydate;
            laydate.render({
                elem: '#dateStart'
                ,type: 'date'
                ,value: new Date()
            });
            laydate.render({
                elem: '#dateEnd'
                ,type: 'date'
                ,value: getNextMonth(new Date())
            });
            $('#dateStart').attr('lay-verify','required');
            $('#dateEnd').attr('lay-verify','required');
        } else if (pushType === $.constant.PushModule.NOTICE) {
            getNotice();
            $('#noticeId').attr('lay-verify','required');
        }
        avalon.scan();
    });
});

/**
 * 监听患者类型单选
 */
function monitorSustainTypeRadio() {
    layui.use('form', function () {
        var form = layui.form;
        form.on('radio(sustainType)', function(data){
            var value = data.value;
            if (value === '0') {   //新患者
                getPatientInfoList('0');
            } else if (value === '1') {   //维持性患者
                getPatientInfoList('1');
            } else {    //全部患者
                getPatientInfoList();
            }
        });

    });
}


/**
 * 患者列表
 */
function getPatientInfoList(sustainType) {
    var param={
        sustainType: sustainType
    };
    //可以继续添加需要上传的参数
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.platform+"/bacWeixinPush/getPatientInfoList.do",
        data:param,
        dataType: "json",
        done:function(data){
            var arr = [];
            data.forEach(function (item, i) {
                var node = {};
                node.name = item.patientName + '(' + item.patientRecordNo + ')';
                node.value = item.patientId;
                arr.push(node);
            })

            var formSelects=layui.formSelects; //调用layui的form模块
            //以下方式则重新渲染所有的已存在多选
            //渲染下拉多选
            formSelects.data('patientId', 'local', {
                arr:arr
            });
        }
    });
}

/**
 * 获取健康教育主题
 */
function getHealthTheme() {
    var param={}; //表单的元素
    //可以继续添加需要上传的参数
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.platform+"/bacWeixinPush/getHealthThemeList.do",
        data:param,
        dataType: "json",
        done:function(data){
            var form = layui.form; //调用layui的form模块
            bacWeixinPushEdit.healthThemeList = data;
            form.render();
        }
    });
}

/**
 * 获取公告主题
 */
function getNotice() {
    var param = {};
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.platform+"/bacWeixinPush/getNoticeList.do",
        data:param,
        dataType: "json",
        done:function(data){
            var form = layui.form; //调用layui的form模块
            bacWeixinPushEdit.noticeList = data;
            form.render();
        }
    });
}

/**
 * 预览
 */
function previewTheme() {
    var pushType = bacWeixinPushEdit.pushType;
    var url = '';
    var title = '';
    if (pushType === $.constant.PushModule.HEALTHEDUCATION) {   //健康教育预览
        if (isEmpty($('#eduBaseId').val())) {
            warningToast('请选择教育主题');
            return false;
        }
        title = '健康教育查看';
        url = $.config.server + '/backstage/bacWeixinPushShow?pushType=' + pushType + '&relationId=' + $('#eduBaseId').val();
    } else if (pushType === $.constant.PushModule.PATIENTSCHEDUL) {  //患者排班预览
        title = '患者排班查看';
        var patientIdStr = '';
        layui.use('formSelects', function () {
            var formSelects = layui.formSelects;
            patientIdStr = formSelects.value('patientId', 'valStr');
        });
        if (isEmpty(patientIdStr)) {
            warningToast('请选择患者');
            return false;
        }
        url = $.config.server + '/backstage/bacWeixinPushShow?pushType=' + pushType + '&patientIdStr=' + patientIdStr;
    } else if (pushType === $.constant.PushModule.NOTICE) {  //公告预览
        if (isEmpty($('#noticeId').val())) {
            warningToast('请选择公告主题');
            return false;
        }
        title = '公告查看';
        url = $.config.server + '/backstage/bacWeixinPushShow?pushType=' + pushType + '&relationId=' + $('#noticeId').val();
    }

    _layerOpen({
        openInParent: true,
        url:url,  //弹框自定义的url，会默认采取type=2
        width:1000, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:600,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        btn:[],
        done:function(index,iframeWin,layer){

        }
    });
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(bacWeixinPushEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacWeixinPushEdit_submit").trigger('click');
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
        param.pushType = bacWeixinPushEdit.pushType;
        layui.use('formSelects', function () {
            var formSelects = layui.formSelects;
            param.patientIds = formSelects.value('patientId', 'val');
        });
        if (bacWeixinPushEdit.pushType === $.constant.PushModule.HEALTHEDUCATION) {
            param.relationName = $("#eduBaseId option:selected").text();
            param.relationId = $('#eduBaseId').val();
        } else if (bacWeixinPushEdit.pushType === $.constant.PushModule.NOTICE) {
            param.relationName = $("#noticeId option:selected").text();
            param.relationId = $('#noticeId').val();
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + "/bacWeixinPush/weChatPush.do",
            data:{jsonData: JSON.stringify(param)},
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



