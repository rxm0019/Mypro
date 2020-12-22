/**
 * 透前评估--通路图弹框
 * @author care
 * @date 2020-08-11
 * @version 1.0
 */
var diaVascularRoadList = avalon.define({
    $id: "diaVascularRoadList"
    , baseFuncInfo: baseFuncInfo//底层基本方法
    , patientId: ''
    , punctureBtnShow: true  //穿刺方案修改按钮显示
    , disabled: {disabled: true}  //日期框和下拉列表设置为disabled
    , doctorMakers: []        //制定人（医生角色）
    , clickVascularRoadId: ''  //点击血管通路表格  血管通路id
    , conduitBtnShow: true    //导管概况修改按钮显示
    , conduitDisabled: {disabled: true}  //导管概况下拉框
    , readonly: {readonly: true}   //设置只读
    , punctureShow: false   //显示穿刺方案
    , conduitShow: false   //显示导管概况
    , startTime: ''        //穿刺记录开始时间
    , endTime: ''          // 穿刺记录结束时间
    , roadBtnShow: true    //通路图修改按钮显示
    , needle: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]  //通路图穿刺针
    , dockerId: ''      //当前登录者是医生，新增时，医生下拉列表默认带出当前登录者
    , itemList: []   //储存item对象
    , increaseId: 0 //自增id
    // ,selectId: '' //当前选取的id
    , cancelTagId: []  //没有保存，点击取消按钮的标签id
    , locusMarkerPhoto: ''  //点击行的通路图路径
    , locusMarkerData: ''  //点击行的位点标记json数据
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        diaVascularRoadList.patientId = GetQueryString('patientId');
        diaVascularRoadList.clickVascularRoadId = GetQueryString('vascularRoadId');
        
        makers();
        getRoadInfo(diaVascularRoadList.clickVascularRoadId);
        avalon.scan();
    });
});

/**
 * 获取制定人（医生角色）
 */
function makers() {
    _ajax({
        type: "POST",
        loading: false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getDoctorRoleList.do",
        dataType: "json",
        done: function (data) {
            diaVascularRoadList.doctorMakers = data;
            data.forEach(function (item, i) {
                if (item.id == baseFuncInfo.userInfoData.userid) {
                    diaVascularRoadList.dockerId = item.id;
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
function verify_form(formName, $callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(' + formName + ')', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#" + formName).trigger('click');
}


/**
 * 监听tab点击
 */
layui.use('element', function () {
    var element = layui.element;
    //监听Tab切换，以改变地址hash值
    element.on('tab(punctureTab)', function () {
        var tabId = this.getAttribute('lay-id');   //获取选项卡的lay-id

        /** 清空值，查全部 **/
        diaVascularRoadList.startTime = '';
        diaVascularRoadList.endTime = '';

        diaVascularRoadList.roadBtnShow = true;
        if (tabId == 'roadPicture') {       //通路图
            getRoadInfo(diaVascularRoadList.clickVascularRoadId);
        } else if (tabId == 'punctureRecord') {    //穿刺记录
            /** 清空日期控件的值，查询全部的记录 **/
            $("#punctureDate_start").val('');
            $("#punctureDate_end").val('');

            //穿刺记录 日期控件
            initDatePicker('#punctureDate_start', true);
            initDatePicker('#punctureDate_end', false);
            getPunctureRecordList(diaVascularRoadList.startTime, diaVascularRoadList.endTime);
        } else if (tabId == 'bloodFlowRecord') {   //血流量记录
            /** 清空日期控件的值，查询全部的记录 **/
            $("#punctureMonitorDate_start").val('');
            $("#punctureMonitorDate_end").val('');

            //血流量记录 日期控件
            initDatePicker("#punctureMonitorDate_start", true);
            initDatePicker("#punctureMonitorDate_end", false);
            getBloodFlowRecord(diaVascularRoadList.startTime, diaVascularRoadList.endTime);
        }


    });
});

/**
 * 通路图修改按钮点击
 */
function editRoad() {
    diaVascularRoadList.roadBtnShow = false;
    $('#imgDiv > span').addClass('move');
    $('#imgDiv').find('a').addClass('rotate');
    changeRoadImg();
}

/**
 * 通路图取消按钮点击
 */
function cancelRoad() {
    diaVascularRoadList.roadBtnShow = true;
    if (diaVascularRoadList.cancelTagId.length > 0) {
        diaVascularRoadList.cancelTagId.forEach(function (item, i) {
            var id;
            if (item.indexOf('circleA') > -1) {   //没有保存，取消的时候，去除标签选中的背景色
                id = $.trim($('#' + item).find('.needle-no').html());
                $('#a' + id).removeClass('currentA');
            } else if (item.indexOf('circleV') > -1) {
                id = $.trim($('#' + item).find('.needle-no').html());
                $('#v' + id).removeClass('currentV');
            } else if (item.indexOf('tag') > -1) {
                $('.text-style').each(function (index, currentValue) {
                    if (item.indexOf(currentValue.id) > -1) {  //没有保存，取消的时候，去除标签选中的背景色
                        $('#' + currentValue.id).removeClass('currentTag');
                    }
                })
            }
            $('#imgDiv').find('#' + item).remove();
        })
    }
    diaVascularRoadList.cancelTagId = [];
    $('#imgDiv > span').removeClass('move');
    $('#imgDiv').find('a').removeClass('rotate');
}

/**
 *  获取通路信息
 * @param vascularRoadId
 */
function getRoadInfo(vascularRoadId) {
    if (isNotEmpty(vascularRoadId)) {
        var param = {
            "vascularRoadId": vascularRoadId
        };
        _ajax({
            type: "POST",
            loading: false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patVascularRoad/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                if(isNotEmpty(data)){
                    diaVascularRoadList.clickVascularRoadId = data.vascularRoadId;
                    diaVascularRoadList.locusMarkerPhoto = data.locusMarkerPhoto;
                    diaVascularRoadList.locusMarkerData = data.locusMarkerData;
                    getRoadImgInfo()
                }
            }
        });
    }
}

/**
 * 获取通路图信息
 *
 */
function getRoadImgInfo() {
    $('#imgDiv span').remove();    //获取通路位点信息   移除添加的标签
    $('.tag-num').removeClass('currentA currentV');  // 改变已选择标签样式
    $('.text-style').removeClass('currentTag');  // 改变已选择标签样式

    if (isNotEmpty(diaVascularRoadList.locusMarkerPhoto)) {
        $('#showImgDiv').attr('src', diaVascularRoadList.locusMarkerPhoto);
        var imgWidth;
        var imgHeight;
        var img = new Image();
        img.src = $('#showImgDiv').attr("src");
        img.onload = function () {
            imgWidth = $('#showImgDiv').width();    //获取图片宽度
            imgHeight = $('#showImgDiv').height();  //获取图片高度

            if (isNotEmpty(diaVascularRoadList.locusMarkerData)) {     //判断位点json是否为空
                var itemList = JSON.parse(diaVascularRoadList.locusMarkerData);
                itemList.forEach(function (item, i) {
                    addTagItem(item.tagText, item.id, item.rationWidthInImg, item.ratioHeightInImg, imgWidth * item.rationWidthInImg, imgHeight * item.ratioHeightInImg, item.rotate)
                })
            }
        }
    } else {
        $('#showImgDiv').attr('src', '');
    }
    changeRoadImg();
}

/**
 * 双击查看大图
 */
function showBigImg() {
    var roadUrl = $('#showImgDiv').attr('src');
    layui.use(['layer'], function () {
        layer.photos({
            photos: {
                "title": "血管通路图" //相册标题
                , "data": [{
                    "src": roadUrl //原图地址
                }]
            }
            , shade: 0.5
            , closeBtn: 1
            , anim: 5
            , success: function () {

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
    diaVascularRoadList.itemList[diaVascularRoadList.itemList.length] = data;
    var item = {};
    var selectId = '';

    $('#imgDiv').on('mousedown', '.rotate', function (e) {
        e.preventDefault();
        e.stopPropagation();
        selectId = $(this).parent().attr('id');
        diaVascularRoadList.selectId = selectId;
        console.log(selectId, diaVascularRoadList.itemList);
        diaVascularRoadList.itemList.forEach(function (currentValue) {
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
        diaVascularRoadList.itemList.forEach(function (currentValue) {
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
            console.log('............移动后的list数据............：', diaVascularRoadList.itemList);
        });
        $(document).on('mouseup', function (e) {
            $(document).off('mousemove');
        })

    })


    $('#imgDiv').on('click', '.remove',  function (e) {
        selectId = $(this).parent().attr('id');
        $('#' + selectId).remove();
        var itemList = diaVascularRoadList.itemList;
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
    console.log('............移动后的list数据............：', diaVascularRoadList.itemList);
}

/**
 * 双击修改标签文字
 */
function dbClick(obj) {
    if (diaVascularRoadList.roadBtnShow) {    //没有点击修改，不能进行编辑
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
    if (diaVascularRoadList.roadBtnShow) {    //没有点击修改，不能进行编辑
        return false;
    }
    var id = 'tag-' + $(obj).attr('id');
    var tagText = $(obj).text();
    $(obj).removeAttr('contenteditable');    //设置span不可编辑
    var itemList = diaVascularRoadList.itemList;
    itemList.forEach(function (currentValue, i) {   //移除itemList中删除的元素
        if (id == currentValue.id) {
            currentValue.tagText = tagText;
        }
    });
    diaVascularRoadList.itemList = itemList;
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
    if (diaVascularRoadList.roadBtnShow) {    //默认不可以点击
        return false;
    }

    if (isEmpty($('#showImgDiv').attr('src'))) {
        warningToast('请选择图片');
        return false;
    }

    var value = $(obj).attr('value');
    var id = 'circleA-' + value;
    if ($(obj).hasClass('currentA')) {    //判断是否已点击此标签
        $(obj).removeClass('currentA');

        var itemList = diaVascularRoadList.itemList;
        itemList.forEach(function (currentValue, i) {   //移除itemList中删除的元素
            if (id == currentValue.id) {
                itemList.splice(i, 1);
            }
        });
        diaVascularRoadList.itemList = itemList;
        console.log('>>>>>>>>>>>>>>>>>>>', diaVascularRoadList.itemList);
        $('#' + id).remove();    //移除此标签
    } else {
        $(obj).addClass('currentA');
        // diaVascularRoadList.increaseId = id;
        addTagItem(value, id);        //添加标签
        diaVascularRoadList.cancelTagId.push(id);
    }
}

/**
 * V端按钮点击
 */
function vClick(obj) {
    if (diaVascularRoadList.roadBtnShow) {    //默认不可以点击
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

        var itemList = diaVascularRoadList.itemList;
        itemList.forEach(function (currentValue, i) {
            if (id == currentValue.id) {
                itemList.splice(i, 1);
            }
        });
        diaVascularRoadList.itemList = itemList;
        console.log('>>>>>>>>>>>>>>>>>>>', diaVascularRoadList.itemList);
        $('#' + id).remove();    //移除此标签
    } else {
        $(obj).addClass('currentV');
        // diaVascularRoadList.increaseId = id;
        addTagItem(value, id);                //添加标签
        diaVascularRoadList.cancelTagId.push(id);
    }
}

/**
 * 标签点击
 */
function tagClick(obj) {
    if (diaVascularRoadList.roadBtnShow) {    //默认不可以点击
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
    diaVascularRoadList.cancelTagId.push(id);
    // }
}

/**
 * 辅助工具点击
 */
function toolClick() {
    debugger
    if (diaVascularRoadList.roadBtnShow) {    //默认不可以点击
        return false;
    }

    var id = 'auxiliary_tool';    //定义辅助工具id

    if ($('#tool-img').hasClass('tool-img-selected')) {   //判断辅助工具是否有呗选中
        $('#tool-img').removeClass('tool-img-selected');

        var itemList = diaVascularRoadList.itemList;
        itemList.forEach(function (currentValue, i) {    //删除辅助工具数据，并从页面上移除辅助工具图标
            if (id === currentValue.id) {
                itemList.splice(i, 1);
            }
        });
        diaVascularRoadList.itemList = itemList;
        $('#' + id).remove();              //移除此标签
    } else {
        $('#tool-img').addClass('tool-img-selected');

        addTagItem('', id);
        diaVascularRoadList.cancelTagId.push(id);
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
            diaVascularRoadList.itemList = [];   //更换图片  清空要保存的数据
            diaVascularRoadList.cancelTagId = [];  //更换背景，清空标签数组
            $('.tag-num').removeClass('currentA currentV');  //更换图片， 改变已选择标签样式
            $('.text-style').removeClass('currentTag');  //更换图片， 改变已选择标签样式

            //预读本地文件示例
            $('#showImgDiv').attr('src', res.bizData.filePath); //图片链接（base64）
            diaVascularRoadList.locusMarkerPhoto = res.bizData.filePath;
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
//                 diaVascularRoadList.itemList = [];   //更换图片  清空要保存的数据
//                 diaVascularRoadList.cancelTagId = [];  //更换背景，清空标签数组
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
        vascularRoadId: diaVascularRoadList.clickVascularRoadId,
        locusMarkerData: JSON.stringify(diaVascularRoadList.itemList),
        locusMarkerPhoto: diaVascularRoadList.locusMarkerPhoto
    }
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        // url: $.config.services.dialysis+"/patVascularRoad/saveOrEdit.do",
        url: $.config.services.dialysis + "/patVascularRoad/saveRoadImg.do",
        data: param,
        dataType: "json",
        done: function (data) {
            successToast('保存成功');
            diaVascularRoadList.roadBtnShow = true;
            diaVascularRoadList.cancelTagId = [];  //保存后，清空 (取消操作) 要删除的标签
            $('#imgDiv > span').removeClass('move');
            $('#imgDiv').find('a').removeClass('rotate');
        }
    });
}

/**
 * 查看历史
 */
function viewHistory() {
    _layerOpen({
        openInParent: true,
        url: $.config.server + "/dialysis/diaVascularLocusHisList?vascularRoadId=" + diaVascularRoadList.clickVascularRoadId,  //弹框自定义的url，会默认采取type=2
        width: 900, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 600,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: '历史通路图', //弹框标题
        btn: [],
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
        , type: 'date'
        , trigger: 'click'
        , done: function (value) {
            if (isStart) {   //开始时间
                diaVascularRoadList.startTime = isNotEmpty(value) ? (value + ' 00:00:00') : value;
            } else {
                diaVascularRoadList.endTime = isNotEmpty(value) ? (value + ' 23:59:59') : value;
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
    if (isNotEmpty(diaVascularRoadList.endTime) && diaVascularRoadList.startTime > diaVascularRoadList.endTime) {
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
    getPunctureRecordList(diaVascularRoadList.startTime, diaVascularRoadList.endTime);
}

/**
 * 血流量记录查询按钮点击
 */
function searchBlood() {
    if (startGreaterEnd()) {
        getBloodFlowRecord(diaVascularRoadList.startTime, diaVascularRoadList.endTime);
    }
}

/**
 * 获取血流量记录
 */
function getBloodFlowRecord(startTime, endTime) {
    var param = {
        patientId: diaVascularRoadList.patientId,  //患者ID   目前没有整合患者基本信息部分，先固定查询一个患者
        startTime: startTime,
        endTime: endTime
    };
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/patVascularRoad/getBloodFlowRecord.do",
        data: param,
        dataType: "json",
        done: function (data) {
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
            itemStyle: {normal: {label: {show: true}}}   //每个顶点显示数值
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
        patientId: diaVascularRoadList.patientId,  //患者ID   目前没有整合患者基本信息部分，先固定查询一个患者
        startTime: startTime,
        endTime: endTime
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#patPunctureList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patPunctureList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            // height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patVascularRoad/getPunctureRecordList.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {
                    field: 'dialysisDate', title: '穿刺时间',
                    templet: function (d) {
                        return util.toDateString(d.dialysisDate, "yyyy-MM-dd");
                    }
                }
                , {
                    field: 'puncturePointA', title: '动脉端（A）', align: 'center'
                    // ,templet: function (d) {
                    //     return getSysDictName('PuncturePointA', d.puncturePointA);
                    // }
                }
                , {
                    field: 'puncturePointV', title: '静脉端（V）', align: 'center'
                    // ,templet: function(d){
                    //     return getSysDictName('PuncturePointV', d.puncturePointV);
                    // }
                }
            ]]
            , done: function (obj) {
            }
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(id, layEvent, readonly) {
    var url = "";
    var title = "";
    if (isEmpty(id)) {  //id为空,新增操作
        title = "新增";
        url = $.config.server + "/dialysis/diaVascularRoadEdit?patientId=" + diaVascularRoadList.patientId;
    } else {  //编辑
        title = readonly ? "详情" : "编辑";
        url = $.config.server + "/dialysis/diaVascularRoadEdit?id=" + id + "&layEvent=" + layEvent + "&patientId=" + diaVascularRoadList.patientId;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 850, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 450,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        readonly: readonly,   //true - 查看详情  false - 编辑
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('diaVascularRoadList_table'); //重新刷新table
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
function enable(id) {
    var param = {
        "vascularRoadId": id,
        "dataStatus": '0'   //设置为启用
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patVascularRoad/enable.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("启用成功");
            var table = layui.table; //获取layui的table模块
            table.reload('diaVascularRoadList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('diaVascularRoadList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确定删除所选记录吗？', function (index) {
            layer.close(index);
            var ids = [];
            $.each(data, function (i, item) {
                ids.push(item.vascularRoadId);
            });
            del(ids);
        });
    }
}
