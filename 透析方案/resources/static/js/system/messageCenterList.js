/**
 * 消息中心
 * @author: hhc
 * @version: 1.0
 * @date: 2020/9/30
 */
var messageCenterList = avalon.define({
    $id: "messageCenterList",
    arrayMessage: [], //存放缓存中的消息字符串
    key: "",//接收消息key
    nMessage: {}, //存放新的消息对象
    onSendUserId: "",//当前选中发送用户
    onReviceUserId: "",//当前选中接收
    userList: [], //左侧用户列表
    read: [],//存放消息
    orderStatus:"", //医嘱状态
    baseFuncInfo: baseFuncInfo//底层基本方法
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        messageCenterList.key = GetQueryString("key");
        //从缓存在取出消息
        messageCenterList.arrayMessage = JSON.parse(getStorage(messageCenterList.key));
        messageCenterList.read = JSON.parse(getStorage(messageCenterList.key));
        //所有的入口事件写在这里...
        getUserList();  //用户列表
        //测试监听新消息
        window.parent.document.addEventListener('newMessage', function (ev) {
            messageCenterList.nMessage = JSON.parse(ev.message); //传过来的message是字符串，需要转换成对象，方便后面存进原来的缓存之中
            messageCenterList.read.push(ev.message);
            messageCenterList.arrayMessage = JSON.parse(getStorage(messageCenterList.key)); //从缓存在取出消息
            if (messageCenterList.userList.length > 0) {
                var isExit = false;
                for (var i = 0; i < messageCenterList.userList.length; i++) {
                    var param = messageCenterList.userList[i];
                    if (param.userIdSend == messageCenterList.nMessage.userIdSend) { //判断左侧列表窗口是否已经存在新消息的发送者，有则不添加
                        isExit = true;
                        addRedDot(messageCenterList.nMessage.userId, messageCenterList.nMessage.userIdSend);
                        break;
                    }
                }
                if (isExit == false) {
                    //添加新发送者左侧用户列表
                    updateUserList(messageCenterList.nMessage);
                }
            } else {
                //添加新发送者左侧用户列表
                updateUserList(messageCenterList.nMessage);
            }
            // 添加当前选中者发送的消息内容
            addMassage(messageCenterList.nMessage.userId, messageCenterList.nMessage.userIdSend);
            addStorage(messageCenterList.key, JSON.stringify(messageCenterList.read)); //将新来的消息先转成字符串再存进缓存
        })
        avalon.scan();
    });
});

/**
 * 新消息来给添加红点
 */
function addRedDot(userId,userIdSend){
    var id = '#s' + userIdSend;
    if(userIdSend != messageCenterList.onSendUserId){
        $(id).css('visibility', 'visible');
    }
}

/**
 * 显示接收到的新消息
 * @param userId
 * @param userIdSend
 */
function addMassage(userId, userIdSend) {
    // $(".chat-main-list").scrollTop($(".chat-main-list")[0].scrollHeight);
    var userId = userId;
    var userIdsend = userIdSend;
        //当消息内容为JSON字符串时就转换成对象
        var message = isJSON(messageCenterList.nMessage.message); //推送消息message体
        //医嘱状态转中文显示
        turnOrderStatus(message.orderStatus);
        //推送消息message体里边的executeOrders（数组类型）{message:"{"executeOrders":[{},{},...{}]}"}
        var executeOrders = message.executeOrders;
        var contentHeader = '【'+'执行医嘱'+ '('+ messageCenterList.orderStatus +')' +'】'+ message.patientName + ' ' + message.patientRecordNo;
    if (isNotEmpty(userId) && isNotEmpty(userIdSend)) {
        if (userIdSend == messageCenterList.onSendUserId) {//发送者
            var textId =  RndNum(6);
            var spanTextId = textId + userIdSend;
            var textSendId = "#" + spanTextId;
            var messageDate = layui.util.toDateString(messageCenterList.nMessage.messageDate, "yyyy-MM-dd HH:mm");
            var html = '<li class="textLeft">' +
                '<div>' +
                '   <span>' + messageCenterList.nMessage.sendName + '</span>' +
                '   <span>' + messageDate + '</span>' +
                '</div>' +
                '<div class="chat-text">' +
                '   <h3>'+ contentHeader + '</h3>'+
                '   <span id="' + spanTextId + '" class="text">' + '</span>';
            if (messageCenterList.nMessage.messageType === 'ExecuteOrder') {  //当文本类型为医嘱时显示查看详情按钮，否则隐藏此按钮
                html += '<button style="float:right " class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue noDetail" onclick="getDetail(\'' + message.patientId + '\',\'' + message.diaRecordId + '\',\'' + message.dialysisDate + '\')">查看详情</button>';
            }
            html += '</div></li>';
            $("#chatList").append(html);
            addText(executeOrders,textSendId);
        } else if (userId == messageCenterList.onSendUserId && userIdSend == messageCenterList.onReviceUserId) {//当前登录者
            var textId =  RndNum(6);
            var spanTextId = textId + userId;
            var textUserId = "#" + spanTextId;
            var messageDate = layui.util.toDateString(messageCenterList.nMessage.messageDate, "yyyy-MM-dd HH:mm");
            var html = ' <li class="textRight">' +
                '                    <div>' +
                '                        <span>' + messageCenterList.nMessage.sendName + '</span>' +
                '                        <span>' + messageDate + '</span>' +
                '                    </div>' +
                '                    <div class="chat-text">' +
                '                        <h3>'+ contentHeader + '</h3>'+
                '                        <span class="text">' + '</span>';
            if (messageCenterList.nMessage.messageType === 'ExecuteOrder') {  //当文本类型为医嘱时显示查看详情按钮，否则隐藏此按钮
                html += '<button style="float:right " class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue noDetail" onclick="getDetail(\'' + message.patientId + '\',\'' + message.diaRecordId + '\',\'' + message.dialysisDate + '\')">查看详情</button>';
            }
            html += '</div></li>';
            $("#chatList").append(html);
            addText(executeOrders,textUserId);
        }
    }
}

/**
 * 清空缓存所有消息
 * @param key
 */
function cleanStorage() {
    layer.confirm('确定要清空所有消息吗？', function (index) {
        layer.close(index); //确定之后关闭弹窗
        removeStorage(messageCenterList.key);//清空当前key的缓存
        messageCenterList.userList = [];
        messageCenterList.read = [];  //清空之前存的消息
        $("#userList").empty();
        $("#chatList").empty();
        var read = [];
        //重置未读消息数量
        parent.setNoticeNum(read);
    });
}

/**
 * 医嘱状态转成中文
 */
function turnOrderStatus(orderStatus) {
    if(orderStatus === $.constant.orderStatus.NOT_COMMIT){
        messageCenterList.orderStatus = '取消提交';
    }else if(orderStatus === $.constant.orderStatus.SUBMITTED){
        messageCenterList.orderStatus = '已提交';
    }else if(orderStatus === $.constant.orderStatus.CHECKED){
        messageCenterList.orderStatus = '已核对';
    }else if(orderStatus === $.constant.orderStatus.EXECUTED){
        messageCenterList.orderStatus = '已执行';
    }else if(orderStatus === $.constant.orderStatus.CANCEL_CHECKED){
        messageCenterList.orderStatus = '已取消核对';
    }else if(orderStatus === $.constant.orderStatus.CANCELLED_EXECUTE){
        messageCenterList.orderStatus = '已取消执行';
    }
    return messageCenterList.orderStatus;
}

/**
 * 窗口显示用户之间对话送消息内容
 * @param userId
 * @param userIdSend
 */
function getMassage(userId, userIdSend) {
    var id ="";
    var id2 = "";
    // 1.
    // var messageArr = [];
    var messageArr2 = [];
    for (var i = 0; i < messageCenterList.arrayMessage.length; i++) {
        messageArr2.push(JSON.parse(messageCenterList.arrayMessage[i])) //将字符串转换成对象
    }
    if(userId == messageCenterList.baseFuncInfo.userInfoData.userid){ //接收者是当前登录用户
        messageCenterList.onReviceUserId = userId;
        id = "#" + userIdSend;
        id2 = '#s' + userIdSend;
    }else if(userIdSend == messageCenterList.baseFuncInfo.userInfoData.userid){//发送者是当前登录用户
        messageCenterList.onReviceUserId = userIdSend;

    }
    if(userId != messageCenterList.baseFuncInfo.userInfoData.userid){ //接收不是当前登录用户
        messageCenterList.onSendUserId = userId;
        id = "#" + userId;
        id2 = '#s' + userId;
    }else if(userIdSend !=  messageCenterList.baseFuncInfo.userInfoData.userid){ //发送者不是当前登录用户
        messageCenterList.onSendUserId = userIdSend;
    }
    $('.style-click').removeClass('onTrick');
    $(id).addClass('onTrick'); //点击后的样式
    $(id2).css('visibility', 'hidden'); //隐藏红点
    // var userId = userId;
    // var userIdsend = userIdSend;
    // 2.从将缓存中的消息按照时间排序
    messageArr2 = messageArr2.sort(function (a, b) {
        return new Date(a.messageDate).getTime() - new Date(b.messageDate).getTime();
    })
    // 3.展示消息内容
    if (messageArr2.length > 0) {
        $("#chatList").empty();
        for (var i = 0; i < messageArr2.length; i++) {
            var param = messageArr2[i];  //推送消息整体
            //当消息内容为JSON字符串时就转换成对象
            var message = isJSON(param.message); //推送消息message体
           //医嘱状态转中文显示
           turnOrderStatus(message.orderStatus);
           //推送消息message体里边的executeOrders（数组类型）{message:"{"executeOrders":[{},{},...{}]}"}
            var executeOrders = message.executeOrders;
            var contentHeader = '【'+'执行医嘱'+ '('+ messageCenterList.orderStatus +')' +'】'+ message.patientName + ' ' + message.patientRecordNo;
            // console.log(executeOrders);
            if (isNotEmpty(param) && param.userIdSend == messageCenterList.onSendUserId && param.userId == messageCenterList.onReviceUserId) {  //显示发送者发送的消息,并且发送者不是当前登录用户,并且接收消息的人是选中的用户
                var textSend =  RndNum(6);
                var spanTextId = textSend + param.userIdSend;
                var textSendId = "#" + spanTextId;
                var messageDate = layui.util.toDateString(param.messageDate, "yyyy-MM-dd HH:mm");
                var html = '<li class="textLeft">' +
                    '<div>' +
                    '   <span>' + param.sendName + '</span>' +
                    '   <span>' + messageDate + '</span>' +
                    '</div>' +
                    '<div class="chat-text">' +
                    '   <h3>'+ contentHeader + '</h3>'+
                    '   <span id="' + spanTextId + '" class="text">'+'</span>';
                if (param.messageType === 'ExecuteOrder') {  //当文本类型为医嘱时显示查看详情按钮，否则隐藏此按钮
                    html += '<button style="float:right " class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue noDetail" onclick="getDetail(\'' + message.patientId + '\',\'' + message.diaRecordId + '\',\'' + message.dialysisDate + '\')">查看详情</button>';
                }
                html += '</div></li>';
                $("#chatList").append(html);
                addText(executeOrders,textSendId);
            } else if (isNotEmpty(param) &&  (param.userId == messageCenterList.onSendUserId && param.userIdSend == messageCenterList.onReviceUserId)) { //当前登录者回复消息,并且回复者是当前登录用户
                var messageDate = layui.util.toDateString(param.messageDate, "yyyy-MM-dd HH:mm");
                var textUser =  RndNum(6);
                var spanTextId = textUser + param.userId;
                var textUserId = "#" + spanTextId;
                var html = ' <li class="textRight">' +
                    '                    <div>' +
                    '                        <span>' + param.sendName + '</span>' +
                    '                        <span>' + messageDate + '</span>' +
                    '                    </div>' +
                    '                    <div class="chat-text">' +
                    '                         <h3>'+ contentHeader + '</h3>'+
                    '                         <span id="' + spanTextId + '" class="text">'+'</span>';
                if (param.messageType === 'ExecuteOrder') {  //当文本类型为医嘱时显示查看详情按钮，否则隐藏此按钮
                    html += '<button style="float:right " class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue noDetail" onclick="getDetail(\'' + message.patientId + '\',\'' + message.diaRecordId + '\',\'' + message.dialysisDate + '\')">查看详情</button>';
                }
                html += '</div></li>';
                $("#chatList").append(html);
                addText(executeOrders,textUserId);
            }
        }
    }
}

/**
 * 根据医嘱类别显示不同的格式
 */
function addText(executeOrders,textId) {
    var conten =[];
    for(var j =0; j< executeOrders.length; j++){
        if(executeOrders[j].orderType =='1'){ //医嘱类别：药疗
            conten[j] = (j+1) + '.'+'&emsp;'+
                '(' + executeOrders[j].orderTypeName + ')' +  executeOrders[j].orderContent +
                '#' + executeOrders[j].dosage + executeOrders[j].basicUnit + '&nbsp;'+ 'x' + '&nbsp;' + executeOrders[j].frequencyName + '&nbsp;'+
                'x'+'&nbsp;'+ executeOrders[j].usageDays + '#' + executeOrders[j].channelName + '<br>';
        }else if(executeOrders[j].orderType =='2'){//医嘱类别：诊疗
            var basicUnit = basicUnitIsNull(executeOrders[j].basicUnit); //判断单位是否为空
            var channelName = channelNameIsNull(executeOrders[j].channelName);
            conten[j] = (j+1) + '.'+'&emsp;'+
                '(' + executeOrders[j].orderTypeName + ')' +  executeOrders[j].orderContent +
                '#' + executeOrders[j].dosage + basicUnit + '&nbsp;'+ 'x' + '&nbsp;' + executeOrders[j].frequencyName + '&nbsp;'+
                'x'+'&nbsp;'+ executeOrders[j].usageDays + '#' + channelName + '<br>';
        }else if(executeOrders[j].orderType =='3'){//医嘱类别：检验
            conten[j] = (j+1) + '.'+'&emsp;'+'(' + executeOrders[j].orderTypeName + ')' +  executeOrders[j].orderContent +'<br>';
        }else if(executeOrders[j].orderType =='4'){//医嘱类别：处置
            var basicUnit = basicUnitIsNull(executeOrders[j].basicUnit); //判断单位是否为空
            conten[j] = (j+1) + '.'+'&emsp;'+
                '(' + executeOrders[j].orderTypeName + ')' +  executeOrders[j].orderContent +
                '#' + executeOrders[j].dosage + basicUnit + '&nbsp;'+ 'x' + '&nbsp;' + executeOrders[j].frequencyName + '&nbsp;'+
                'x'+'&nbsp;'+ executeOrders[j].usageDays + '#' + executeOrders[j].channelName + '<br>';
        }else if(executeOrders[j].orderType =='5'){//医嘱类别：其它
            var dosage = dosageIsNull(executeOrders[j].dosage);
            var basicUnit = basicUnitIsNull(executeOrders[j].basicUnit); //判断单位是否为空
            var frequencyNam = frequencyNameIsNull(executeOrders[j].frequencyName); //判断频率名称是否为空
            var usageDays = usageDaysIsNull(executeOrders[j].usageDays);
            var channelName = channelNameIsNull(executeOrders[j].channelName);
            conten[j] = (j+1) + '.'+'&emsp;'+
                '(' + executeOrders[j].orderTypeName + ')' +  executeOrders[j].orderContent +
                '#' + dosage + basicUnit + '&nbsp;'+ 'x' + '&nbsp;' + frequencyNam + '&nbsp;'+
                'x'+'&nbsp;'+ usageDays + '#' + channelName + '<br>';
        }
        $(textId).append(conten[j]);
    }
}

/**
 * 查看详情
 */
function getDetail(patientId,diaRecordId,dialysisDate) {
    var toDialysisDate = layui.util.toDateString(parseInt(dialysisDate), 'yyyy-MM-dd');
    var index = parent.layer.getFrameIndex(window.name);
    baseFuncInfo.openDialysisLayoutPage({
        pageHref: "/dialysis/diaExecuteOrderList",
        patientId: patientId, // 患者ID
        diaRecordId: diaRecordId, // 透析记录ID
        query: {
            dialysisDate: toDialysisDate, // 透析日期
        }
    });
    parent.layer.close(index);
}

/**
 * 判断医嘱 单次剂量是否为空
 */
function dosageIsNull(str) {
    if (isNotEmpty(str)){
        return str;
    } else {
        return "";
    }
}

/**
 * 判断医嘱 单位是否为空
 */
function basicUnitIsNull(str) {
    if(isNotEmpty(str)){
        return str;
    }else{
        return "";
    }
}

/**
 * 判断医嘱 频率名称是否为空
 */
function frequencyNameIsNull(str) {
    if(isNotEmpty(str)){
        return str;
    }else {
        return "";
    }
}

/**
 * 判断医嘱 天数是否为空
 */
function usageDaysIsNull(str){
    if(isNotEmpty(str)){
        return str;
    } else{
        return "";
    }
}

/**
 * 判断医嘱 途径名称是否为空
 */
function channelNameIsNull(str) {
    if(isNotEmpty(str)){
        return str;
    }else{
        return "";
    }
}

/**
 * 产生随机数
 */
function RndNum(n){
    var rnd="";
    for(var i=0;i< n;i++){
        rnd += Math.floor(Math.random()*10);
    }
    return rnd;
}

/**
 * 按照id分组
 * @param arr
 * @returns {Array}
 */
function groupById(arr) {
    var result = [];
    var ids = [];
    // 1.假如：arr = [{id:1},{id:1},{id:2},{id:3}...{}]
    //遍历所有消息只取出不同的发送者id
    for (var i = 0; i < arr.length; i++) {
            if (chkIDS(ids,arr[i]) == -1) { //没有找到就丢进去
                ids.push(arr[i].userIdSend + '_' + arr[i].userId);
            }
    }
    for (var j = 0; j < ids.length; j++) { //3.最终结果:result =[[{id:1},{id:1}],[{id:2}],[{id:3}]]
        var temp = [];
        //根据发送者id将消息分组，相同id的消息放在同一组
        for (var k = 0; k < arr.length; k++) {
            if (ids[j].indexOf(arr[k].userIdSend) != -1 && ids[j].indexOf(arr[k].userId) != -1) {
                temp.push(arr[k]);
            }
        }
        result.push(temp);
    }
    return result;
}

/**
 * 分组标识
 * @param ids
 * @param obj
 * @returns {number}
 */
function chkIDS(ids,obj){
    var ret=-1;
    for(var j=0;j<ids.length;j++) {
        if (ids[j].indexOf(obj.userIdSend) != -1 && ids[j].indexOf(obj.userId) != -1) { //没有找到就丢进去
            ret=0;
        }
    }
    return ret;
}

/**
 * 判断是否为JSON格式
 * @param str
 * @returns {boolean}
 */
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            // JSON.parse(str);
            // return true;
            return JSON.parse(str);
        } catch (e) {
            console.log(e);
            return false;
        }
    }else {
        return str;
    }
    // return true;
}

/**
 * 获取用户列表用于显示
 */
function getUserList() {
    var temp2 = []; //存放接收消息对象
    if (messageCenterList.arrayMessage == null) {
        return false;
    }
    if (messageCenterList.arrayMessage.length > 0) {
        for (var i = 0; i < messageCenterList.arrayMessage.length; i++) {
            if (isJSON(messageCenterList.arrayMessage[i])) {
                temp2.push(JSON.parse(messageCenterList.arrayMessage[i])); //将字符串转换为对象
            }
        }
    }
    if (temp2.length > 0) {
        var result = groupById(temp2); //按照id将用户分组
        var temp = []; //存放发送者最后一次发送的消息对象
        for (var i = 0; i < result.length; i++) {
            var max = result[i][0];
            for (var j = 0; j < result[i].length - 1; j++) { //在每个用户分组遍历寻找最大时间
                max = new Date(max.messageDate).getTime() < new Date(result[i][j + 1].messageDate).getTime() ? result[i][j + 1] : max;  //根据用户发送消息的时间，取出用户最后一次发送消息的时间
            }
            temp.push(max);
        }
        for (var i = 0; i < temp.length; i++) {
            updateUserList(temp[i]);
        }
    }
}

/**
 * 显示，更新发送者用户列表
 * @param param
 * @param count
 * @returns {boolean}
 */
function updateUserList(param) {
    if (param == null) {
        return false;
    }
    messageCenterList.userList.push(param); //存放用户消息列表，用于判断新消息来时用户列表中是否已经存在该用户
    if (param.userIdSend != messageCenterList.baseFuncInfo.userInfoData.userid) { //发送者不是当前登录用户，接收者是当前登录用户
        var str = param.sendName;
        var sn = str.substring(str.length - 2); //截取字符串后两位(取用户名后两位)
        var html = '<li class="style-click" id="' + param.userIdSend + '" onclick="getMassage(\'' + param.userId + '\',\'' + param.userIdSend + '\')">' +
            '                    <div class="">' +
            '                        <div class="img">' + sn + '</div>' +
            '                        <div class="user_span">' +
            '                            <span class="user_name">' + param.sendName + '</span>' +
            '                            <span class="sendTime">' + layui.util.toDateString(param.messageDate, "HH:mm") + '</span>' +
            '                        </div>' +
            '                        <div class="notice" style="float: right">' +
            '                            <span id="' + 's' + param.userIdSend + '" class="layui-badge-dot"></span>' +
            '                        </div>' +
            '                    </div>' +
            '</li>'
        //layui-badge layui-badge-dot
        $("#userList").append(html);
        $("#"+'s'+param.userIdSend).css("visibility","hidden");
    }else if(param.userIdSend == messageCenterList.baseFuncInfo.userInfoData.userid){//发送者是当前登录用户，接受者是别人
        var str = param.username;
        var sn = str.substring(str.length - 2); //截取字符串后两位(取用户名后两位)
        var html = '<li class="style-click" id="' + param.userId + '" onclick="getMassage(\'' + param.userId + '\',\'' + param.userIdSend + '\')">' +
                '                    <div class="">' +
                '                        <div class="img">' + sn + '</div>' +
                '                        <div class="user_span">' +
                '                            <span class="user_name">' + param.username + '</span>' +
                '                            <span class="sendTime">' + layui.util.toDateString(param.messageDate, "HH:mm") + '</span>' +
                '                        </div>' +
                '                        <div class="notice" style="float: right">' +
                '                            <span id="' + 's' + param.userId + '" class="layui-badge-dot"></span>' +
                '                        </div>' +
                '                    </div>' +
                '</li>'
        //layui-badge layui-badge-dot
        $("#userList").append(html);
        $("#"+'s'+param.userId).css("visibility","hidden");
    }
}
