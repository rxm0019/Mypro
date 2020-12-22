/**
 * patVascularRoadList.jsp的js文件，包括列表查询、增加、修改、删除基础操作
 * @author anders
 * @date 2020-08-11
 * @version 1.0
 */
var patVascularRoadList = avalon.define({
    $id: "patVascularRoadList"
    ,baseFuncInfo: baseFuncInfo//底层基本方法
    ,patientId: ''
    ,punctureBtnShow: true  //穿刺方案修改按钮显示
    ,disabled: {disabled: true}  //日期框和下拉列表设置为disabled
    ,doctorMakers: []        //制定人（医生角色）
    ,clickVascularRoadId: ''  //点击血管通路表格  血管通路id
    ,conduitBtnShow: true    //导管概况修改按钮显示
    ,conduitDisabled: {disabled: true}  //导管概况下拉框
    ,readonly: {readonly: true}   //设置只读
    ,punctureShow: false   //显示穿刺方案
    ,conduitShow: false   //显示导管概况
    ,startTime: ''        //穿刺记录开始时间
    ,endTime: ''          // 穿刺记录结束时间
    ,roadBtnShow: true    //通路图修改按钮显示
    ,needle: [1,2,3,4,5,6,7,8,9,10]  //通路图穿刺针
    ,dockerId: ''      //当前登录者是医生，新增时，医生下拉列表默认带出当前登录者
    ,itemList: []   //储存item对象
    ,increaseId: 0 //自增id
    // ,selectId: '' //当前选取的id
    ,cancelTagId: []  //没有保存，点击取消按钮的标签id
    ,locusMarkerPhoto: ''  //点击行的通路图路径
    ,locusMarkerData: ''  //点击行的位点标记json数据
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        patVascularRoadList.patientId = GetQueryString('patientId');
        makers();
        getList();  //查询列表
        avalon.scan();
    });
});

/**
 * 查询列表事件
 */
function getList() {
    var param = {
        patientId: patVascularRoadList.patientId  //患者ID   目前没有整合患者基本信息部分，先固定查询一个患者
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#patVascularRoadList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'patVascularRoadList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            // height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patVascularRoad/listAll.do", // ajax的url必须加上getRootPath()方法
            page: false,
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                // {type: 'radio'},
                {field: 'vascularRoadType', title: '通路类型',sort: false,sortField:'pvr_.vascular_road_type',
                    templet: function (d) {
                        return getSysDictName('ChannelType', d.vascularRoadType);
                    }
                }
                ,{field: 'vascularRoadPlace', title: '通路部位',sort: false,sortField:'pvr_.vascular_road_place',
                    templet: function (d) {
                        return getSysDictName('ChannelPlace', d.vascularRoadPlace);
                    }
                }
                ,{field: 'establishedDate', title: '建立时间',align:'center',sort: false,sortField:'pvr_.established_date'
                    ,templet: function(d){
                    return util.toDateString(d.establishedDate,"yyyy-MM-dd");
                }}
                ,{field: 'activationTime', title: '启用时间',align:'center',sort: false,sortField:'pvr_.activation_time'
                    ,templet: function(d){
                    return util.toDateString(d.activationTime,"yyyy-MM-dd");
                }}
                ,{field: 'dataStatus', title: '使用状态',align: 'center', sort: false,sortField:'pvr_.data_status', width: 80
                    ,templet: function (d) {
                    // var str = d.dataStatus === '0' ? '在用' : '停用';
                    // return getSysDictName('ChannelStatus', d.dataStatus);
                        return d.dataStatus === '0' ? '在用' : '停用';
                }}  // 0-启用，1-停用，2-删除
                ,{field: 'serviceLife', title: '累加使用（天）', align: 'center'}
                ,{field: 'disabledReason', title: '停用原因',align: 'center', style:'line-height: 15px'
                    ,templet: function (d) {   //一个td， 显示两行数据，需要设置layui-table-cell的height:auto
                        var html = '<div>' + util.toDateString(d.disabledDatetime, "yyyy-MM-dd") + '</div><div>' + getSysDictName('ChannelDisabledReason', d.disabledReason) + '</div>';
                        if (d.dataStatus === '0') {
                            html = '';
                        }
                        return html;
                    }
                }
                ,{field: 'locusMarkerPhoto', title: '通路图',align:'center',width: 80
                    ,templet: function(d){
                    var html = '<i class="layui-icon layui-icon-picture" style="cursor: pointer" onclick="showRoadImg(\'' + d.vascularRoadId + '\')"></i>';
                    if (isEmpty(d.locusMarkerPhoto)) {
                        return '';
                    }
                    return html;
                }}
                ,{fixed: 'right',title: '操作',width: 200, align:'center'
                    ,toolbar: '#patVascularRoadList_bar'}
            ]]
            ,done: function () {
                $(".layui-table-view[lay-id='patVascularRoadList_table'] .layui-table-body tr[data-index = '0' ]").click();
            }
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            //查看
            if (layEvent == 'detail') {
                if (isNotEmpty(data.vascularRoadId)) {
                    saveOrEdit(data.vascularRoadId, layEvent, true);
                }
            }else if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.vascularRoadId)){
                    saveOrEdit(data.vascularRoadId, layEvent, false);
                }
            }else if(layEvent === 'enable'){ // 启用  停用
                if (data.dataStatus === '0') {
                    // xq("停用血管通路",['350px','200px'],"tpl-open",tpl_select,dictData);

                    _layerOpen({
                        openInParent: true,
                        url: $.config.server+"/patient/patVascularRoadEnable?id=" + data.vascularRoadId,
                        width:350, //弹框自定义的宽度，方法会自动判断是否超过宽度
                        height:300,  //弹框自定义的高度，方法会自动判断是否超过高度
                        maxmin: false,
                        title:'停用血管通路', //弹框标题
                        done:function(index,iframeWin,layer){
                            /**
                             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
                             * 利用iframeWin可以执行弹框的方法，比如save方法
                             */
                            var ids = iframeWin.save(
                                //成功保存之后的操作，刷新页面
                                function success() {
                                    successToast("保存成功");
                                    var table = layui.table; //获取layui的table模块
                                    table.reload('patVascularRoadList_table'); //重新刷新table
                                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                                }
                            );
                        }
                    });
                } else {
                    layer.confirm('确定启用血管通路？', function(index){

                        layer.close(index);
                        //向服务端发送指令
                        if(isNotEmpty(data.vascularRoadId)){
                            enable(data.vascularRoadId);
                        }
                    });
                }
            }
        }
    });
    //监听行单击事件（双击事件为：rowDouble）
    table.on('row(patVascularRoadList_table)', function(obj){

        /** 判断被点击的元素的第一个类是不是 layui-table-cell 来判断是不是表内单元格 **/
        if(isNotEmpty(event.target.classList) && "layui-table-cell" != event.target.classList[0]){  //阻止按钮栏事件冒泡到行点击事件
            return false;
        }
        var data = obj.data;
        patVascularRoadList.clickVascularRoadId = data.vascularRoadId;
        // patVascularRoadList.locusMarkerPhoto = data.locusMarkerPhoto;
        // patVascularRoadList.locusMarkerData = data.locusMarkerData;
        var type = '';

        //获取选中行的类型是穿刺还是导管
        var typeData = getSysDictByCode('ChannelType');
        typeData.forEach(function (dict, index) {
            if (data.vascularRoadType == dict.value) {
                type =  dict.dictBizCode;
            }
        })

        if (type == '0') {   //穿刺
            // getPunctureInfo(data.vascularRoadId);
            patVascularRoadList.punctureBtnShow = true;
            patVascularRoadList.punctureShow = true;
            patVascularRoadList.conduitShow = false;

            //默认选中穿刺方案tab栏
            layui.use('element', function(){
                var element = layui.element;
                element.tabChange('punctureTab', 'puncturePlan');
            });
        } else if (type == '1') {  //导管
            // getConduitInfo(data.vascularRoadId);
            patVascularRoadList.punctureShow = false;
            patVascularRoadList.conduitBtnShow = true;
            patVascularRoadList.conduitShow = true;
            //默认选中穿刺方案tab栏
            layui.use('element', function(){
                var element = layui.element;
                element.tabChange('punctureTab', 'pipleDetail');
            });
        }
        //标注选中样式
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
    });
}

/**
 * 显示通路图
 */
function showRoadImg(vascularRoadId) {
    var param = {
        vascularRoadId: vascularRoadId
    }
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis+"/patVascularRoad/getInfo.do",
        data: param,
        dataType: "json",
        done:function(data){
            if (isNotEmpty(data.locusMarkerPhoto)) {
                layui.use(['layer'], function() {
                    layer.photos({
                        photos: {
                            "title": "血管通路图" //相册标题
                            ,"data": [{
                                "src": data.locusMarkerPhoto //原图地址
                            }]
                        }
                        ,shade: 0.5
                        ,closeBtn: 1
                        ,anim: 5
                        ,success:function () {
                            console.log(',,,,,,,,,,,,,,,图片宽高,,,,,,,,,,,,,,',$('#layui-layer-photos').width(), $('#layui-layer-photos').height());
                            var imgWidth = $('#layui-layer-photos').width();
                            var imgHeight = $('#layui-layer-photos').height();

                            var itemList = JSON.parse(data.locusMarkerData);
                            console.log('............itemList............', itemList);

                            itemList.forEach(function (item, i) {
                                var color;
                                var html;
                                if (item.id.indexOf('circleA') > -1) {
                                    color = '#FF784E';
                                } else if (item.id.indexOf('circleV') > -1) {
                                    color = '#4BB2FF';
                                }

                                var left = (item.rationWidthInImg * imgWidth + 86) > imgWidth ? (imgWidth - 86) : (item.rationWidthInImg * imgWidth);
                                var top = (item.ratioHeightInImg * imgHeight + 85) > imgHeight ? (imgHeight - 85) : (item.ratioHeightInImg * imgHeight);

                                //添加标签编辑事件
                                if (item.id.indexOf('circle') > -1) {
                                    html = '<span id="' + item.id + '" class="move active" style="left:' + left + 'px;top:' + item.ratioHeightInImg * imgHeight + 'px;position:absolute;cursor: pointer;transform: rotate(' + item.rotate + 'deg);">' +
                                        '<span class="needle-no" style="background: ' + color+ ';transform: rotate(' + -item.rotate + 'deg);"> '+ item.tagText +
                                        '</span><span style="display: inline-block;border-top: 1px solid;border-color: ' + color + ';width: 60px;padding-bottom: 4px;"></span></span>';
                                } else if (item.id.indexOf('tag') > -1) {
                                    html = '<span id="' + item.id + '" class="move tag-div" style="left:' + item.rationWidthInImg * imgWidth + 'px;top:' + item.ratioHeightInImg * imgHeight + 'px;">' + item.tagText + '</span>';
                                } else if (item.id === 'auxiliary_tool') {   //点击辅助工具
                                    html = '<span id="' + item.id + '" class="move" style="left:' + left + 'px;top:' + top + 'px;position:absolute;cursor: pointer;transform: rotate(' + item.rotate + 'deg);">' +
                                        '<img src="' + $.config.server + '/static/images/auxiliary_tool.png"></span>';
                                }

                                $(html).appendTo('#layui-layer-photos');
                            })
                        }
                    });
                });
            }
        }
    })
}


/**
 * 穿刺方案修改按钮点击
 */
function punctureEdit() {
    patVascularRoadList.punctureBtnShow = false;
    patVascularRoadList.disabled = {disabled: false};
    var punctureId = $('#vascularPunctureId').val();

    var laydate=layui.laydate;
    //制定日期  默认当前日期
    laydate.render({
        elem: '#schemeDate'
        ,type: 'date'
        ,trigger: 'click'
    });

    if (isEmpty(punctureId)) {  //判断是新增穿刺方案还是修改编辑方案
        //新增编辑方案，默认制定时间是当前时间，默认制定人是当前登录者
        $('#schemeDate').val(new Date());
        $('#schemeUserId').val(patVascularRoadList.dockerId);
    }

    var form = layui.form;
    form.render('select');
}

/**
 * 导管概况修改按钮点击
 */
function conduitEdit() {
    patVascularRoadList.conduitBtnShow = false;
    patVascularRoadList.conduitDisabled = {disabled: false};
    patVascularRoadList.readonly = {readonly: false};
    var conduitId = $('#vascularConduitId').val();
    var laydate=layui.laydate;
    //制定日期  默认当前日期
    laydate.render({
        elem: '#conduitSchemeDate'
        ,type: 'date'
        ,trigger: 'click'
    });

    if (isEmpty(conduitId)) {  //判断是新增穿刺方案还是修改编辑方案
        //新增编辑方案，默认制定时间是当前时间，默认制定人是当前登录者
        $('#conduitSchemeDate').val(new Date());
        $('#schemeUserId').val(patVascularRoadList.dockerId);   // 默认带出当前登录者
    }

    var form = layui.form;
    form.render('select');
}

/**
 * 穿刺方案取消按钮点击
 */
function cancelPunctureEdit() {
    patVascularRoadList.punctureBtnShow = true;
    patVascularRoadList.disabled = {disabled: true};
    getPunctureInfo(patVascularRoadList.clickVascularRoadId);
    var form = layui.form;
    form.render('select');
}

/**
 * 导管概况取消按钮点击
 */
function cancelConduitEdit() {
    patVascularRoadList.conduitBtnShow = true;
    patVascularRoadList.conduitDisabled = {disabled: true};
    patVascularRoadList.readonly = {readonly: true};
    getConduitInfo(patVascularRoadList.clickVascularRoadId);
    var form = layui.form;
    form.render('select');
}

/**
 * 获取穿刺方案单个实体
 */
function getPunctureInfo(vascularRoadId) {
    var param={
        "vascularRoadId": vascularRoadId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis+"/patVascularPuncture/getInfoByVascularRoadId.do",
        data:param,
        dataType: "json",
        done:function(data){
            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            //初始化表单元素,日期时间选择器
            var util=layui.util;
            if (isNotEmpty(data.schemeDate)) {
                data.schemeDate=util.toDateString(data.schemeDate,"yyyy-MM-dd");
            }
            data.vascularRoadId = vascularRoadId;
            form.val('patVascularPunctureEdit_form', data);
            form.render('select');   //重新载入select select才会有值
        }
    });

}

/**
 * 获取导管概况单个实体
 */
function getConduitInfo(vascularRoadId) {
    var param={
        "vascularRoadId": vascularRoadId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis+"/patVascularConduit/getConduitByVascularRoadId.do",
        data:param,
        dataType: "json",
        done:function(data){
            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            //初始化表单元素,日期时间选择器
            var util=layui.util;
            if (isNotEmpty(data.schemeDate)) {
                data.schemeDate=util.toDateString(data.schemeDate,"yyyy-MM-dd");
            }
            data.vascularRoadId = vascularRoadId;
            form.val('patVascularConduitEdit_form', data);
            form.render('select');   //重新载入select select才会有值
        }
    });
}

/**
 * 获取制定人（医生角色）
 */
function makers() {
    _ajax({
        type: "POST",
        loading: false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getDoctorRoleList.do",
        dataType: "json",
        async: false,
        done: function (data) {
            patVascularRoadList.doctorMakers=data;
            data.forEach(function (item, i) {
                if (item.id == baseFuncInfo.userInfoData.userid) {
                    patVascularRoadList.dockerId = item.id;
                }
            })
            var form = layui.form;
            form.render('select');
        }
    });
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form(formName, $callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(' + formName + ')', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#" + formName).trigger('click');
}


/**
 * 保存穿刺方案
 */
function updatePatVascularPunctureEdit() {
    //对表单验证
    verify_form('patVascularPunctureEdit_submit',function(field){
        //成功验证后
        var param=field; //表单的元素
        var url = $.config.services.dialysis+"/patVascularPuncture/edit.do";

        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data:param,
            dataType: "json",
            done:function(data){
                successToast('保存成功');
                patVascularRoadList.disabled = {disabled: true};
                patVascularRoadList.punctureBtnShow = true;
                var form = layui.form;
                form.render('select');
            }
        });
    });
}

/**
 * 保存导管概况
 */
function updatePatVascularConduitEdit() {
    //对表单验证
    verify_form('patVascularConduitEdit_submit',function(field){
        //成功验证后
        var param=field; //表单的元素
        var url = $.config.services.dialysis+"/patVascularConduit/edit.do";

        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data:param,
            dataType: "json",
            done:function(data){
                successToast('保存成功');
                patVascularRoadList.conduitDisabled = {disabled: true};
                patVascularRoadList.readonly = {readonly: true};
                patVascularRoadList.conduitBtnShow = true;
                var form = layui.form;
                form.render('select');
            }
        });
    });
}

/**
 * 监听tab点击
 */
layui.use('element', function(){
    var element = layui.element;
    //监听Tab切换，以改变地址hash值
    element.on('tab(punctureTab)', function(){
        var tabId = this.getAttribute('lay-id');   //获取选项卡的lay-id

        /** 清空值，查全部 **/
        patVascularRoadList.startTime = '';
        patVascularRoadList.endTime = '';

        patVascularRoadList.roadBtnShow = true;
        if (tabId == 'puncturePlan') {             //穿刺方案
            getPunctureInfo(patVascularRoadList.clickVascularRoadId);
        } else if (tabId == 'pipleDetail') {
            getConduitInfo(patVascularRoadList.clickVascularRoadId);
        }else if (tabId == 'roadPicture') {       //通路图
            getRoadImgInfo();
        }else if (tabId == 'punctureRecord') {    //穿刺记录

            /** 清空日期控件的值，查询全部的记录 **/
            $("#punctureDate_start").val('');
            $("#punctureDate_end").val('');

            //穿刺记录 日期控件
            initDatePicker('#punctureDate_start', true);
            initDatePicker('#punctureDate_end', false);
            getPunctureRecordList(patVascularRoadList.startTime, patVascularRoadList.endTime);
        } else if (tabId == 'bloodFlowRecord') {   //血流量记录
            /** 清空日期控件的值，查询全部的记录 **/
            $("#punctureMonitorDate_start").val('');
            $("#punctureMonitorDate_end").val('');

            //血流量记录 日期控件
            initDatePicker("#punctureMonitorDate_start", true);
            initDatePicker("#punctureMonitorDate_end", false);
            getBloodFlowRecord(patVascularRoadList.startTime, patVascularRoadList.endTime);
        } else if (tabId == 'assistCheck') {       //辅助检查
            /** 清空日期控件的值，查询全部的记录 **/
            $("#assistCheckDate_start").val('');
            $("#assistCheckDate_end").val('');

            //辅助检查 日期控件
            initDatePicker("#assistCheckDate_start", true);
            initDatePicker("#assistCheckDate_end", false);
            getInspectList(patVascularRoadList.startTime, patVascularRoadList.endTime);
        } else if (tabId == 'cure') {              //介入治疗
            /** 清空日期控件的值，查询全部的记录 **/
            $("#therapyDate_start").val('');
            $("#therapyDate_end").val('');

            //辅助检查 日期控件
            initDatePicker("#therapyDate_start", true);
            initDatePicker("#therapyDate_end", false);
            getTherapyList(patVascularRoadList.startTime, patVascularRoadList.endTime);
        }


    });
});

/**
 * 通路图修改按钮点击
 */
function editRoad() {
    patVascularRoadList.roadBtnShow = false;
    $('#imgDiv > span').addClass('move');
    $('#imgDiv').find('a').addClass('rotate');
    $('.tag-div').find('a').removeClass('rotate');  //移除添加到标签上面的rotate类
    $('.tag-div').find('a').addClass('remove');
    changeRoadImg();
}

/**
 * 通路图取消按钮点击
 */
function cancelRoad() {
    patVascularRoadList.roadBtnShow = true;
    if (patVascularRoadList.cancelTagId.length > 0) {
        patVascularRoadList.cancelTagId.forEach(function (item, i) {
            var id;
            if (item.indexOf('circleA') > -1) {   //没有保存，取消的时候，去除标签选中的背景色
                id = $.trim($('#' + item).find('.needle-no').html());
                $('#a' + id).removeClass('currentA');
            } else if (item.indexOf('circleV') > -1) {   //去除V端背景色
                id = $.trim($('#' + item).find('.needle-no').html());
                $('#v' + id).removeClass('currentV');
            } else if (item.indexOf('tag') > -1) {  //去除标签背景色
                $('.text-style').each(function (index, currentValue) {
                    if (item.indexOf(currentValue.id) > -1) {  //没有保存，取消的时候，去除标签选中的背景色
                        $('#' + currentValue.id).removeClass('currentTag');
                    }
                })
            } else if (item === 'auxiliary_tool') {   //去除辅助工具背景色
                $('#tool-img').removeClass('tool-img-selected');
            }
            $('#imgDiv').find('#' + item).remove();
        })
    }
    patVascularRoadList.cancelTagId = [];
    $('#imgDiv > span').removeClass('move');
    $('#imgDiv').find('a').removeClass('rotate');
    $('#imgDiv').find('a').removeClass('remove');
}

/**
 * 获取通路图信息
 *
 */
function getRoadImgInfo() {
    $('#imgDiv span').remove();    //获取通路位点信息   移除添加的标签
    $('.tag-num').removeClass('currentA currentV');  // 改变已选择标签样式
    $('.text-style').removeClass('currentTag');  // 改变已选择标签样式

    if (isNotEmpty(patVascularRoadList.clickVascularRoadId)) {    //获取通路图位点图信息
        var param = {
            vascularRoadId: patVascularRoadList.clickVascularRoadId
        }
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis+"/patVascularRoad/getInfo.do",
            data: param,
            dataType: "json",
            done:function(data){
                if (isNotEmpty(data.locusMarkerPhoto)) {
                    patVascularRoadList.locusMarkerPhoto = data.locusMarkerPhoto;
                    patVascularRoadList.locusMarkerData = data.locusMarkerData;
                    patVascularRoadList.itemList = [];
                    $('#showImgDiv').attr('src', data.locusMarkerPhoto);
                    var imgWidth;
                    var imgHeight;
                    var img = new Image();
                    img.src=$('#showImgDiv').attr("src");
                    img.onload=function(){
                        imgWidth=$('#showImgDiv').width();    //获取图片宽度
                        imgHeight=$('#showImgDiv').height();  //获取图片高度

                        if (isNotEmpty(data.locusMarkerData)) {     //判断位点json是否为空
                            var itemList = JSON.parse(data.locusMarkerData);
                            itemList.forEach(function (item, i) {
                                addTagItem(item.tagText, item.id, item.rationWidthInImg, item.ratioHeightInImg, imgWidth * item.rationWidthInImg, imgHeight * item.ratioHeightInImg, item.rotate)
                            })
                        }
                    }
                } else {
                    $('#showImgDiv').attr('src','');
                }
            }
        });
    }
    changeRoadImg();
}

/**
 * 双击查看大图
 */
function showBigImg() {
    var roadUrl = $('#showImgDiv').attr('src');
    layui.use(['layer'], function() {
        layer.photos({
            photos: {
                "title": "血管通路图" //相册标题
                ,"data": [{
                    "src": roadUrl //原图地址
                }]
            }
            ,shade: 0.5
            ,closeBtn: 1
            ,anim: 5
            ,success:function () {
                // console.log(',,,,,,,,,,,,,,,图片宽高,,,,,,,,,,,,,,',$('#layui-layer-photos').width(), $('#layui-layer-photos').height());
                // var imgWidth = $('#layui-layer-photos').width();
                // var imgHeight = $('#layui-layer-photos').height();
                //
                // var itemList = JSON.parse(rowData.locusMarkerData);
                // console.log('............itemList............', itemList);
                //
                // itemList.forEach(function (item, i) {
                //     var color;
                //     var html;
                //     if (item.id.indexOf('circleA') > -1) {
                //         color = '#FF784E';
                //     } else if (item.id.indexOf('circleV') > -1) {
                //         color = '#4BB2FF';
                //     }
                //
                //     //添加标签编辑事件
                //     if (item.id.indexOf('circle') > -1) {
                //         html = '<span id="' + item.id + '" class="move active" style="left:' + item.rationWidthInImg * imgWidth + 'px;top:' + item.ratioHeightInImg * imgHeight + 'px;position:absolute;cursor: pointer;transform: rotate(' + item.rotate + 'deg);">' +
                //             '<span class="needle-no" style="background: ' + color+ ';transform: rotate(' + -item.rotate + 'deg);"> '+ item.tagText +
                //             '</span><span style="display: inline-block;border-top: 1px solid;border-color: ' + color + ';width: 60px;padding-bottom: 4px;"></span></span>';
                //     } else if (item.id.indexOf('tag') > -1) {
                //         html = '<span id="' + item.id + '" class="move tag-div" style="left:' + item.rationWidthInImg * imgWidth + 'px;top:' + item.ratioHeightInImg * imgHeight + 'px;">' + item.tagText + '</span>';
                //     }
                //
                //     $(html).appendTo('#layui-layer-photos');
                // })
            }
        });
    });
}

//添加标签
function addTagItem(tagText, id, rationWidthInImg, ratioHeightInImg, left, top, rotate) {
    var increaseId = id;
    var imgWidth = $('#imgDiv').find('img').width();
    var imgHeight = $('#imgDiv').find('img').height();
    var left = isNotEmpty(left) ? left : 20; //初始化定位
    var top = isNotEmpty(top) ? top : 10;
    var color = '';
    var html;

    if (increaseId.indexOf('circleA') > -1) {
        color = '#FF784E';
    } else if (increaseId.indexOf('circleV') > -1) {
        color = '#4BB2FF';
    } else {
        color = '#ffffff';
    }

    //添加标签编辑事件
    if (increaseId.indexOf('circle') > -1) {   //点击a端或v端
        html = '<span id="' + increaseId + '" class="move" style="left:' + left + 'px;top:' + top + 'px;position:absolute;cursor: pointer;">' + '<span class="needle-no" style="background: ' + color+ '"> '+ tagText +
            '</span><a class="rotate"></a><span style="display: inline-block;border-top: 1px solid;border-color: ' + color + ';width: 60px;padding-bottom: 4px;"></span></span>';
    } else if (increaseId.indexOf('tag') > -1) {   //点击标签
        var spanId = increaseId.slice(4);
        html = '<span id="' + increaseId + '" class="move tag-div" style="left:' + left + 'px;top:' + top + 'px;position:absolute;cursor: pointer;"><span style="min-width: 20px;min-height: 20px;display: inline-block;" ondblclick="dbClick(this)" onblur="spanBlur(this)" id="'+spanId+'">' + tagText + '</span><a class="remove"></a></span>';
    } else if (increaseId === 'auxiliary_tool') {   //点击辅助工具
        html = '<span id="' + increaseId + '" class="move" style="left:' + left + 'px;top:' + top + 'px;position:absolute;cursor: pointer;"><a class="rotate"></a>' +
            '<img src="' + $.config.server + '/static/images/auxiliary_tool.png"></span>';
    }

    $(html).appendTo("#imgDiv");
    if (isNotEmpty(ratioHeightInImg) && isNotEmpty(rationWidthInImg)) {  //宽高比例不为空， 则是初始化数据库数据
        $('#imgDiv > span').removeClass('move');    //移除移动class
        $('#imgDiv').find('a').removeClass('rotate');  //移除旋转class
        $('#imgDiv').find('a').removeClass('remove');  //移除旋转class
        $('#' + increaseId).css("transform","rotate("+rotate+"deg)");    //标签旋转
        $('#' + increaseId + ' .needle-no').css("transform","rotate("+ (-rotate) +"deg)");   //文字不旋转


        if (id.indexOf('circleA') > -1) {   //初始化数据库的json，添加标签选中的背景色
            $('#a' + tagText).addClass('currentA');
        } else if (id.indexOf('circleV') > -1) {
            $('#v' + tagText).addClass('currentV');
        } else if (id.indexOf('tag') > -1) {
            // $('.text-style').each(function (index, currentValue) {
            //     if (id.indexOf(currentValue.id) > -1) {  //没有保存，取消的时候，去除标签选中的背景色
            //         $('#' + currentValue.id).addClass('currentTag');
            //     }
            // })
        } else if (id === 'auxiliary_tool') {
            $('#tool-img').addClass('tool-img-selected');
        }
    }
    // var id = $(this).data("id");
    // var src = $(this).find("img").attr("src");


    var widthOrg = $('#imgDiv').find("#" + increaseId).width();
    var heightOrg = $('#imgDiv').find("#" + increaseId).height();
    console.log('标签容器宽高',widthOrg,heightOrg);
    console.log('图片宽高：',imgWidth, imgHeight);
    var data = {
        id: increaseId,
        width: widthOrg,
        height: heightOrg,
        tx: 0, //move触摸点
        ty: 0,
        rx: 0, //rotate触摸点
        ry: 0,
        left: left,
        top: top,
        anglePre: 0, //角度
        angleNext: 0,
        rotate: rotate || 0, //计算得出真正的旋转角度
        ox: left + widthOrg / 2, //圆心坐标
        oy: top + heightOrg / 2,
        ratioHeightInImg: top / imgHeight, //标签的left与图片宽度的比例
        rationWidthInImg: left / imgWidth,  //标签的top与图片高度的比例
        tagText: tagText,      //标签内容
        r: Math.sqrt(widthOrg * widthOrg + heightOrg * heightOrg) / 2 //对角线的半
    }
    patVascularRoadList.itemList[patVascularRoadList.itemList.length] = data;
    var item = {};
    var selectId = '';

    $('#imgDiv').on('mousedown', '.rotate', function (e) {
        e.preventDefault();
        e.stopPropagation();
        selectId = $(this).parent().attr('id');
        patVascularRoadList.selectId = selectId;
        console.log(selectId, patVascularRoadList.itemList);
        patVascularRoadList.itemList.forEach(function (currentValue) {
            if (selectId === currentValue.id) {
                item = currentValue;
            }
        })
        console.log('...........',selectId, e.clientX, e.clientY);
        // e.preventDefault();
        item.rx = e.clientX;
        item.ry = e.clientY;
        item.anglePre = getAngle(item.ox, item.oy, e.clientX, e.clientY);
        $(document).on('mousemove', function (e) {
            e.preventDefault();
            item.angleNext = getAngle(item.ox, item.oy, e.clientX, e.clientY);
            item.rotate += item.angleNext - item.anglePre;
            console.log('>>>>>item.rotate>>>>>',item.rotate);
            $('#' + selectId).css("transform","rotate("+item.rotate+"deg)");    //标签旋转
            var rotateAngle = -item.rotate;
            $('#' + selectId + ' .needle-no').css("transform","rotate("+rotateAngle+"deg)");   //文字不旋转
            // $(this).parent().css({
            //     rotate: patVascularRoadList.item.rotate
            // })
            item.anglePre = item.angleNext;
        });
        $(document).on('mouseup', function (e) {
            $(document).off('mousemove');
        })
    });

    // $('#imgDiv').on('drag', '.rotate', function (e) {
    //     console.log('...........', e.offsetX, e.offsetY);
    //     e.preventDefault();
    //
    //     item.angleNext = getAngle(item.ox, item.oy, e.offsetX, e.offsetY);
    //     item.rotate += item.angleNext - item.anglePre;
    //     console.log('>>>>>item.rotate>>>>>',item.rotate);
    //     $(this).parent().css("transform","rotate("+item.rotate+"deg)");
    //     // $(this).parent().css({
    //     //     rotate: patVascularRoadList.item.rotate
    //     // })
    //     item.anglePre = item.angleNext;
    // })

    $('#imgDiv').on('mousedown', '.move',  function (e) {
        var max_left = $(this).offsetParent().outerWidth() - $(this).outerWidth() - 1,   //小数会自动取整，减1 防止标签换行
            max_top = $(this).offsetParent().outerHeight() - $(this).outerHeight();
        console.log('父级宽度，' + $(this).offsetParent().outerWidth(), '父级高度，' + $(this).offsetParent().outerHeight());
        console.log('标签宽度，' + $(this).outerWidth(), '标签高度，' + $(this).outerHeight());
        console.log('最大宽度，' + max_left, '最大高度，' + max_top);
        selectId = $(this).attr('id');
        $(".move").removeClass('active');
        $('#' + selectId).addClass('active');
        console.log('.....移动的id....',selectId);
        patVascularRoadList.itemList.forEach(function (currentValue) {
            if (selectId == currentValue.id) {
                item = currentValue;
            }
        })
        var ele_x = e.clientX,
            ele_y = e.clientY;
        item.tx = e.clientX;
        item.ty = e.clientY;
        console.log('点击的坐标', ele_x, ele_y, '页面坐标：', e.clientX, e.clientY);
        $(document).on('mousemove', function (e) {
            e.preventDefault();
            console.log('移动后的坐标', e.offsetX, e.offsetY);
            var left = e.clientX - item.tx + item.left,
                top = e.clientY - item.ty + item.top;
            left = left < 0 ? 0 : left;
            top = top < 0 ? 0 : top;
            left = left > max_left ? max_left : left;
            top = top > max_top ? max_top : top;
            item.left = left;
            item.top = top;
            console.log('距离left：',left, '距离top：', top);
            $('#' + selectId).css({
                left: left,
                top: top
            })
            // 重新赋值
            item.rationWidthInImg = item.left / imgWidth;
            item.ratioHeightInImg = item.top / imgHeight;
            console.log('............标签与图片宽高比例............：', item.rationWidthInImg, item.ratioHeightInImg);
            item.ox = +item.left + item.width / 2;
            item.oy = +item.top + item.height / 2;
            item.tx = e.clientX;
            item.ty = e.clientY;
            console.log('............移动后的list数据............：', patVascularRoadList.itemList);
        });
        $(document).on('mouseup', function (e) {
            $(document).off('mousemove');
        })

    })


    $('#imgDiv').on('click', '.remove',  function (e) {
        selectId = $(this).parent().attr('id');
        $('#' + selectId).remove();
        var itemList = patVascularRoadList.itemList;
        itemList.forEach(function (currentValue, i) {   //移除要删除的元素
            if (selectId == currentValue.id) {
                itemList.splice(i, 1);
            }
        });
    });


    // $('#imgDiv').on('dragstart', '.move .needle-no', function (e) {
    //     selectId = $(this).parent().attr('id');
    //
    //     patVascularRoadList.itemList.forEach(function (currentValue) {
    //         if (selectId == currentValue.id) {
    //             item = currentValue
    //         }
    //     })
    //     item.tx = e.offsetX;
    //     item.ty = e.offsetY;
    // })
    // $('#imgDiv').on('drag', '.move .needle-no', function (e) {
    //     item._tx = e.offsetX - item.tx;
    //     item._ty = e.offsetY - item.ty;
    //     item.left += item._tx;
    //     item.top += item._ty;
    //     $(this).parent().css({
    //         left: item.left,
    //         top: item.top
    //     })
    //     // 重新赋值
    //     item.ox = +item.left + item.width / 2;
    //     item.oy = +item.top + item.height / 2;
    //     item.tx = e.offsetX;
    //     item.ty = e.offsetY;
    // })
    console.log('............移动后的list数据............：', patVascularRoadList.itemList);
}

/**
 * 双击修改标签文字
 */
function dbClick(obj) {
    if (patVascularRoadList.roadBtnShow) {    //没有点击修改，不能进行编辑
        return false;
    }
    $(obj).attr('contenteditable', 'true');   //设置span可编辑
}

/**
 * span标签保存
 * @param obj
 * @returns {boolean}
 */
function spanBlur(obj) {
    if (patVascularRoadList.roadBtnShow) {    //没有点击修改，不能进行编辑
        return false;
    }
    var id = 'tag-' + $(obj).attr('id');
    var tagText = $(obj).text();
    $(obj).removeAttr('contenteditable');    //设置span不可编辑
    var itemList = patVascularRoadList.itemList;
    itemList.forEach(function (currentValue, i) {   //移除itemList中删除的元素
        if (id == currentValue.id) {
            currentValue.tagText = tagText;
        }
    });
    patVascularRoadList.itemList = itemList;
}

/**
 * 获取旋转角度
 * @param px
 * @param py
 * @param mx
 * @param my
 * @returns {number}
 */
function getAngle(px, py, mx, my) {
    console.log(px, py, mx, my)
    var x = px - mx;
    var y = py - my;
    var angle = Math.atan2(y, x) * 360 / Math.PI;
    return angle;
}


/**
 * A端按钮点击
 */
function aClick(obj) {
    if (patVascularRoadList.roadBtnShow) {    //默认不可以点击
        return false;
    }

    if (isEmpty($('#showImgDiv').attr('src'))) {
        warningToast('请选择图片');
        return false;
    }

    var value = $(obj).attr('value');
    var id = 'circleA-'+value;
    if ($(obj).hasClass('currentA')) {    //判断是否已点击此标签
        $(obj).removeClass('currentA');

        var itemList = patVascularRoadList.itemList;
        itemList.forEach(function (currentValue, i) {   //移除itemList中删除的元素
            if (id == currentValue.id) {
                itemList.splice(i, 1);
            }
        });
        patVascularRoadList.itemList = itemList;
        console.log('>>>>>>>>>>>>>>>>>>>', patVascularRoadList.itemList);
        $('#' + id).remove();    //移除此标签
    } else {
        $(obj).addClass('currentA');
        // patVascularRoadList.increaseId = id;
        addTagItem(value, id);        //添加标签
        patVascularRoadList.cancelTagId.push(id);
    }
}

/**
 * V端按钮点击
 */
function vClick(obj) {
    if (patVascularRoadList.roadBtnShow) {    //默认不可以点击
        return false;
    }

    if (isEmpty($('#showImgDiv').attr('src'))) {
        warningToast('请选择图片');
        return false;
    }

    var value = $(obj).attr('value');
    var id = 'circleV-' + value;
    if ($(obj).hasClass('currentV')) {    //判断是否已点击此标签
        $(obj).removeClass('currentV');

        var itemList = patVascularRoadList.itemList;
        itemList.forEach(function (currentValue, i) {
            if (id == currentValue.id) {
                itemList.splice(i, 1);
            }
        });
        patVascularRoadList.itemList = itemList;
        console.log('>>>>>>>>>>>>>>>>>>>', patVascularRoadList.itemList);
        $('#'  + id).remove();    //移除此标签
    } else {
        $(obj).addClass('currentV');
        // patVascularRoadList.increaseId = id;
        addTagItem(value, id);                //添加标签
        patVascularRoadList.cancelTagId.push(id);
    }
}

/**
 * 标签点击
 */
function tagClick(obj) {
    if (patVascularRoadList.roadBtnShow) {    //默认不可以点击
        return false;
    }

    if (isEmpty($('#showImgDiv').attr('src'))) {
        warningToast('请选择图片');
        return false;
    }

    var value = $(obj).html();
    var id = 'tag-' + guid();
    // if ($(obj).hasClass('currentTag')) {          //判断是否已点击此标签
    //     $(obj).removeClass('currentTag');
    //
    //     var itemList = patVascularRoadList.itemList;
    //     itemList.forEach(function (currentValue, i) {
    //         if (id == currentValue.id) {
    //             itemList.splice(i, 1);
    //         }
    //     });
    //     patVascularRoadList.itemList = itemList;
    //     console.log('>>>>>>>>>>>>>>>>>>>', patVascularRoadList.itemList);
    //     $('#' + id).remove();              //移除此标签
    // } else {
    //     $(obj).addClass('currentTag');
        addTagItem(value, id);           //添加标签
        patVascularRoadList.cancelTagId.push(id);
    // }
}

/**
 * 辅助工具点击
 */
function toolClick() {
    if (patVascularRoadList.roadBtnShow) {    //默认不可以点击
        return false;
    }

    var id = 'auxiliary_tool';    //定义辅助工具id

    if ($('#tool-img').hasClass('tool-img-selected')) {   //判断辅助工具是否有呗选中
        $('#tool-img').removeClass('tool-img-selected');

        var itemList = patVascularRoadList.itemList;
        itemList.forEach(function (currentValue, i) {    //删除辅助工具数据，并从页面上移除辅助工具图标
            if (id === currentValue.id) {
                itemList.splice(i, 1);
            }
        });
        patVascularRoadList.itemList = itemList;
        $('#' + id).remove();              //移除此标签
    } else {
        $('#tool-img').addClass('tool-img-selected');

        addTagItem('', id);
        patVascularRoadList.cancelTagId.push(id);
    }
}

/**
 * 更换背景图
 */
//图片上传
function changeRoadImg() {
    uploadImgObj = _layuiUploadImg({
        elem: '#changeRoadImg'
        , url: $.config.services.dialysis + '/patVascularRoad/uploadImage.do'
        , accept: 'images'
        , method: 'post'
        , multiple: false
        , number: 1
        , acceptMime: 'image/*'
        , done: function (res) {
            console.log('>>>>res>>>>>', res);
            //...上传成功后的事件
            $('#imgDiv span').remove();    //更换图片， 移除添加的标签
            patVascularRoadList.itemList = [];   //更换图片  清空要保存的数据
            patVascularRoadList.cancelTagId = [];  //更换背景，清空标签数组
            $('.tag-num').removeClass('currentA currentV');  //更换图片， 改变已选择标签样式
            $('.text-style').removeClass('currentTag');  //更换图片， 改变已选择标签样式
            $('#tool-img').removeClass('tool-img-selected');

            //预读本地文件示例
            $('#showImgDiv').attr('src', res.bizData.filePath); //图片链接（base64）
            patVascularRoadList.locusMarkerPhoto = res.bizData.filePath;
        }
    });
}

// function changeRoadImg() {
//     layui.use('upload', function(){
//         var $ = layui.jquery
//             ,upload = layui.upload;
//
//         //普通图片上传
//         upload.render({
//             elem: '#changeRoadImg'
//             ,url: $.config.services.system + '/system/uploadFile.do'
//             ,auto: false
//             ,multiple: false
//             ,bindAction: '#saveRoadImg'
//             ,choose: function (obj) {
//                 $('#imgDiv span').remove();    //更换图片， 移除添加的标签
//                 patVascularRoadList.itemList = [];   //更换图片  清空要保存的数据
//                 patVascularRoadList.cancelTagId = [];  //更换背景，清空标签数组
//                 $('.tag-num').removeClass('currentA currentV');  //更换图片， 改变已选择标签样式
//                 $('.text-style').removeClass('currentTag');  //更换图片， 改变已选择标签样式
//                 //预读本地文件示例，不支持ie8
//                 obj.preview(function(index, file, result){
//                     $('#showImgDiv').attr('src', result); //图片链接（base64）
//                 });
//             }
//             ,done: function(res){
//                 //如果上传失败
//                 console.log('---------',res);
//
//                 //上传成功，进行记录保存
//                 if (res.rtnCode == RtnCode.OK) {
//
//                 }
//             }
//             ,error: function(){
//
//             }
//         });
//     });
// }

/**
 * 通路图保存按钮点击
 */
function saveRoadImg() {
    var param = {
        vascularRoadId:  patVascularRoadList.clickVascularRoadId,
        locusMarkerData: JSON.stringify(patVascularRoadList.itemList),
        locusMarkerPhoto: patVascularRoadList.locusMarkerPhoto
    }
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        // url: $.config.services.dialysis+"/patVascularRoad/saveOrEdit.do",
        url: $.config.services.dialysis+"/patVascularRoad/saveRoadImg.do",
        data:param,
        dataType: "json",
        done:function(data){
            successToast('保存成功');
            patVascularRoadList.roadBtnShow = true;
            patVascularRoadList.cancelTagId = [];  //保存后，清空 (取消操作) 要删除的标签
            // $('#imgDiv > span').removeClass('move');
            // $('#imgDiv').find('a').removeClass('rotate');
            getRoadImgInfo();
        }
    });
}

/**
 * 查看历史
 */
function viewHistory() {
    _layerOpen({
        openInParent: true,
        url: $.config.server + "/patient/patVascularLocusHisList?vascularRoadId=" + patVascularRoadList.clickVascularRoadId,  //弹框自定义的url，会默认采取type=2
        width: 900, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 600,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: '历史通路图', //弹框标题
        btn:[],
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success(data) {
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 初始化搜索日期
 */
function initDatePicker(inputId, isStart) {
    var laydate = layui.laydate;
    var util = layui.util;
    laydate.render({
        elem: inputId
        ,type: 'date'
        ,trigger: 'click'
        ,done: function (value) {
            if (isStart) {   //开始时间
                patVascularRoadList.startTime = isNotEmpty(value) ? (value + ' 00:00:00') : value;
            } else {
                patVascularRoadList.endTime = isNotEmpty(value) ? (value + ' 23:59:59') : value;
            }
        }
    });
}

/**
 * 判断开始日期是否大于结束日期
 * 如果结束日期为空，则默认今天日期
 */
function startGreaterEnd() {
    var flag = true;
    var util = layui.util;
    if (isNotEmpty(patVascularRoadList.endTime) && patVascularRoadList.startTime > patVascularRoadList.endTime) {
        warningToast('开始时间不能大于结束时间');
        flag = false;
    }
    return flag;
}

/**
 * 穿刺记录查询按钮点击
 */
function searchPuncture() {
    startGreaterEnd();
    getPunctureRecordList(patVascularRoadList.startTime, patVascularRoadList.endTime);
}

/**
 * 血流量记录查询按钮点击
 */
function searchBlood() {
    if (startGreaterEnd()) {
        getBloodFlowRecord(patVascularRoadList.startTime, patVascularRoadList.endTime);
    }
}

/**
 * 获取血流量记录
 */
function getBloodFlowRecord(startTime, endTime) {
    var param = {
        patientId: patVascularRoadList.patientId,  //患者ID   目前没有整合患者基本信息部分，先固定查询一个患者
        startTime: startTime,
        endTime: endTime
    };
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/patVascularRoad/getBloodFlowRecord.do",
        data:param,
        dataType: "json",
        done:function(data){
            var dateArr = [];
            var numArr = [];
            data.forEach(function (item, i) {
                dateArr.push(item.checkDate);
                numArr.push(item.avgBooldFlow);
            })
            punctureBloodLineChart(dateArr, numArr);
        }
    });
}

/**
 * 血流量折线图
 * @param dateArr
 * @param numArr
 */
function punctureBloodLineChart(dateArr, numArr) {
    var myechart = echarts.init(document.getElementById('bloodFlowChart'));
    myechart.setOption({
        xAxis: {
            type: 'category',
            data: dateArr,
            name: '监测日期'
        },
        yAxis: {
            type: 'value',
            name: '实际平均血流量(ml/min)'
        },
        series: [{
            data: numArr,
            type: 'line',
            itemStyle : { normal: {label : {show: true}}}   //每个顶点显示数值
        }]
    }, true);
}

/**
 * 获取穿刺记录列表
 * @param startTime
 * @param endTime
 */
function getPunctureRecordList(startTime, endTime) {
    var param = {
        patientId: patVascularRoadList.patientId,  //患者ID   目前没有整合患者基本信息部分，先固定查询一个患者
        startTime: startTime,
        endTime: endTime
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#patPunctureList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'patPunctureList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            // height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patVascularRoad/getPunctureRecordList.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'dialysisDate', title: '穿刺时间',
                    templet: function (d) {
                        return util.toDateString(d.dialysisDate,"yyyy-MM-dd");
                    }
                }
                ,{field: 'puncturePointA', title: '动脉端（A）', align:'center'
                    ,templet: function (d) {
                        return getSysDictName('PointA', d.puncturePointA);
                    }
                }
                ,{field: 'puncturePointV', title: '静脉端（V）',align:'center'
                    ,templet: function(d){
                        return getSysDictName('PointV', d.puncturePointV);
                    }
                }
            ]]
        }
    });
}

/**
 * 获取辅助检查列表
 * @param startTime
 * @param endTime
 */
function getInspectList(startTime, endTime) {
    var param = {
        patientId: patVascularRoadList.patientId,  //患者ID   目前没有整合患者基本信息部分，先固定查询一个患者
        inspectDate_start: startTime,
        inspectDate_end: endTime
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#patVascularInspect_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'patVascularInspect_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            // height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patVascularInspect/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'inspectDate', title: '检查时间',
                    templet: function (d) {
                        return util.toDateString(d.inspectDate,"yyyy-MM-dd");
                    }
                }
                ,{field: 'inspectType', title: '检查类型', align:'center'
                    ,templet: function (d) {
                        return getSysDictName('ChannelMonitorType', d.inspectType);
                    }
                }
                ,{field: 'inspectPlace', title: '检查部位',align:'center'
                    ,templet: function (d) {
                        return getSysDictName('InspectPlace', d.inspectPlace);
                    }
                }
                ,{field: 'inspectResult', title: '检查结果',align:'center'}
                ,{field: 'remarks', title: '备注说明',align:'center'}
                ,{field: 'remarks', title: '图片',align:'center'
                    ,templet: function(d){
                        if (d.inspectImages.length > 0) {
                            return '<i class="layui-icon layui-icon-picture" style="cursor: pointer" onclick="showInspectImg(\'' + d.LAY_TABLE_INDEX + '\')"></i>';
                        }
                        return '';
                    }
                }
                ,{field: 'inspectName', title: '记录人',align:'center'}
                ,{fixed: 'right',title: '操作',width: 250, align:'center',toolbar: '#patVascularInspectList_bar'}
            ]]
            ,done: function () {

            }
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            //查看
            if (layEvent == 'detail') {
                if (isNotEmpty(data.vascularInspectId)) {
                    inspectSaveOrEdit(data.vascularInspectId, layEvent, true);
                }
            }else if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.vascularInspectId)){
                    inspectSaveOrEdit(data.vascularInspectId, layEvent, false);
                }
            }else if(layEvent === 'del'){ // 删除
                layer.confirm('确定删除此记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.vascularInspectId)){
                        var ids=[];
                        ids.push(data.vascularInspectId);
                        inspectDel(ids);
                    }
                });
            }
        }
    });
}

/**
 * 获取辅助检查的图片
 */
function showInspectImg(index) {
    var tableData = layui.table.cache['patVascularInspect_table'];
    var rowData = tableData[index];

   var imagesData = [];
   rowData.inspectImages.forEach(function (item, i) {
       var node = {
           src: item.filePath,
           alt: item.fileTitle
       }
       imagesData.push(node);
   });
   parent.imagesPreview(imagesData, 0);
}

/**
 * 辅助检查查询按钮点击
 */
function searchAssistCheck() {
    startGreaterEnd();
    getInspectList(patVascularRoadList.startTime, patVascularRoadList.endTime);
}

/**
 * 介入治疗查询按钮点击
 */
function searchTherapy() {
    startGreaterEnd();
    getTherapyList(patVascularRoadList.startTime, patVascularRoadList.endTime);
}

/**
 * 获取介入治疗列表
 * @param startTime
 * @param endTime
 */
function getTherapyList(startTime, endTime) {
    var param = {
        patientId: patVascularRoadList.patientId,  //患者ID   目前没有整合患者基本信息部分，先固定查询一个患者
        therapyDate_start: startTime,
        therapyDate_end: endTime
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#patVascularTherapy_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'patVascularTherapy_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            // height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patVascularTherapy/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'therapyDatetime', title: '治疗时间',
                    templet: function (d) {
                        return util.toDateString(d.therapyDatetime,"yyyy-MM-dd HH:mm");
                    }
                }
                ,{field: 'therapyLocale', title: '治疗地点', align:'center'}
                ,{field: 'diseaseDiagnosis', title: '诊断',align:'center'}
                ,{field: 'operationName', title: '手术名称',align:'center'}
                ,{field: '', title: '附件',align:'center'
                    ,templet: function(d){
                        if (d.therapyFiles.length > 0) {
                            return '<i class="layui-icon layui-icon-file"></i>';
                        }
                        return '';
                    }
                }
                ,{field: 'recordUserName', title: '记录人',align:'center'}
                ,{fixed: 'right',title: '操作',width: 250, align:'center',toolbar: '#patVascularTherapyList_bar'}
            ]]
            ,done: function () {

            }
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            //查看
            if (layEvent == 'detail') {
                if (isNotEmpty(data.vascularTherapyId)) {
                    therapySaveOrEdit(data.vascularTherapyId, layEvent, true);
                }
            }else if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.vascularTherapyId)){
                    therapySaveOrEdit(data.vascularTherapyId, layEvent, false);
                }
            }else if(layEvent === 'del'){ // 删除
                layer.confirm('确定删除此记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.vascularTherapyId)){
                        var ids=[];
                        ids.push(data.vascularTherapyId);
                        therapyDel(ids);
                    }
                });
            }
        }
    });
}

/**
 * 删除辅助检查
 */
function inspectDel(ids) {
    var param={
        "ids":ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patVascularInspect/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('patVascularInspect_table'); //重新刷新table
        }
    });
}

/**
 * 辅助检查添加
 */
function inspectSaveOrEdit(id, layEvent, readonly) {
    var url="";
    var title="";
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server+"/patient/patVascularInspectEdit?patientId=" + patVascularRoadList.patientId;
    }else{  //编辑
        title=readonly ? "详情" : "编辑";
        url=$.config.server+"/patient/patVascularInspectEdit?id="+id + "&layEvent=" + layEvent;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url:url,  //弹框自定义的url，会默认采取type=2
        width:1000, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:500,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        readonly: readonly,   //true - 查看详情  false - 编辑
        done:function(index,iframeWin,layer){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('patVascularInspect_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 介入治疗添加
 */
function therapySaveOrEdit(id, layEvent, readonly) {
    var url="";
    var title="";
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server+"/patient/patVascularTherapyEdit?patientId=" + patVascularRoadList.patientId;
    }else{  //编辑
        title=readonly ? "详情" : "编辑";
        url=$.config.server+"/patient/patVascularTherapyEdit?id="+id + "&layEvent=" + layEvent;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url:url,  //弹框自定义的url，会默认采取type=2
        width:800, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:600,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        readonly: readonly,   //true - 查看详情  false - 编辑
        done:function(index,iframeWin,layer){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('patVascularTherapy_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 删除介入治疗
 */
function therapyDel(ids) {
    var param={
        "ids":ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patVascularTherapy/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('patVascularTherapy_table'); //重新刷新table
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(id, layEvent, readonly) {
    var url="";
    var title="";
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server+"/patient/patVascularRoadEdit?patientId=" + patVascularRoadList.patientId;
    }else{  //编辑
        title=readonly ? "详情" : "编辑";
        url=$.config.server+"/patient/patVascularRoadEdit?id="+id + "&layEvent=" + layEvent + "&patientId=" + patVascularRoadList.patientId;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url:url,  //弹框自定义的url，会默认采取type=2
        width:850, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:450,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        readonly: readonly,   //true - 查看详情  false - 编辑
        done:function(index,iframeWin,layer){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('patVascularRoadList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 启用停用
 *
 */
function enable(id){
    var param={
        "vascularRoadId": id,
        "dataStatus": '0'   //设置为启用
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis+"/patVascularRoad/enable.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("启用成功");
            var table = layui.table; //获取layui的table模块
            table.reload('patVascularRoadList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('patVascularRoadList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.vascularRoadId);
            });
            del(ids);
        });
    }
}
