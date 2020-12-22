var stompClient = null;
var host = "";//http://192.168.1.88:8094";
var id = baseFuncInfo.userInfoData.userid;
var key = id + '_message';

function setConnected(connected) {
    // document.getElementById('connect').disabled = connected;
    // document.getElementById('disconnect').disabled = !connected;
    //  document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
    // $('#response').html();
}

function connect() {
    var socket = new SockJS(host + '/bullet');   //建立连接对象

    var headers={
        token:"admin_token",
        userId: id
    };
    stompClient = Stomp.over(socket);  //获取STMOP子协议的WebSocket客户端对象
    stompClient.debug = null;
    stompClient.onclose = function (evnt) {
        console.log('websocket服务关闭了');
        //heartCheck.start();
    };
    // stompClient..disconnect = function (evnt) {
    //     console.log('websocket disconnect');
    //     //heartCheck.start();
    // };
    stompClient.heartbeat.outgoing = 20000; //若使用STOMP 1.1 版本，默认开启了心跳检测机制（默认值都是10000ms）
    stompClient.heartbeat.incoming = 0; //客户端不从服务端接收心跳包
    stompClient.connect(headers, connectCallback ,errorCallback);
}

function disconnect() {  //断开连接
    if (stompClient != null) {
        stompClient.disconnect(JSON.stringify({userId: id}));
    }
    setConnected(false);
    console.log("Disconnected");
}

function send() {
    chanageToRead();
    var read = [];
    setNoticeNum(read); //重置消息数量
    // var name = id;//$('#name').val();
    // var message =  baseFuncInfo.userInfoData.username + '在前端发送群消息测试';//$('#messgae').val();
    // stompClient.send("/sendMsgByAll", {}, JSON.stringify({userId:name,message:message}));
    //stompClient.send("/sendMsgByUser", {}, JSON.stringify({userId:name,message:message}));
    var url = $.config.server + "/system/messageCenterList?key=" + key;
    _layerOpen({
        url: url,
        width: 820,
        height: 600,
        btn: [],
    });
    return false;
}

/**
 * 改变消息isRead的值(将未读消息变成已读)
 */
function chanageToRead() {
    var message = [];
    var messageArr = [];
    var read = [];
    if(JSON.parse(getStorage(key)) != null) {
        message = JSON.parse(getStorage(key));//取出key的值 ,message =  ["{}","{}","{}"]
        if (message.length > 0) {
            for (var i = 0; i < message.length; i++) {
                messageArr.push(JSON.parse(message[i]));//将字符串转成对象
            }
            for (var i = 0; i < messageArr.length; i++) {
                messageArr[i].isRead = '1'; //改变当前key缓存里isRead的值
            }
            for (var i = 0; i < messageArr.length; i++) {
                read.push(JSON.stringify(messageArr[i])); //对象转成字符串
            }
            addStorage(key, JSON.stringify(read));  //覆盖当前key的value
        }
    }
}

function showResponse(message) {
    //前端把消息数据存起来，可再弹窗清单显示
    var read = JSON.parse(getStorage(key)) == null ? [] : JSON.parse(getStorage(key));

    if (isNotEmpty(message) && !isJSON(message)) {
        message = JSON.parse(message);
    }
    read.push(message);
    addStorage(key, JSON.stringify(read));
    setNoticeNum(read);
    var nw = newMessage;  //新消息监听事件
    nw.message = message;
    window.document.dispatchEvent(nw);
    //removeStorage(key);
    // console.log(read,read.length);
    // successToast(read.length+ ',' +message,3000);
}

//從服務器拉取未讀消息
function pullUnreadMessage(userId) {
    $.ajax({
        url: $.config.services.system + "/bullet/pullUnreadMessage",
        type: "POST",
        dataType: "json",
        async: true,
        data: {
            "userId": userId
        },
        success: function (data) {
            //console.log(data);
            console.log("從服務器拉取未讀消息: " + data.length);
            if (data.length > 0) {
                //前端把消息数据存起来，可再弹窗清单显示
                var read = JSON.parse(getStorage(key)) == null ? [] : JSON.parse(getStorage(key));
                $.each(data, function (i) {
                    var message = data[i];
                    //console.log(message);
                    if (isNotEmpty(message) && !isJSON(message)) {
                        message = JSON.parse(message);
                    }
                    read.push(message);
                })
                addStorage(key, JSON.stringify(read));
                setNoticeNum(read);
            }
        }
    });
}

function connectCallback (frame) {  //连接成功时的回调函数
    setConnected(true);
    console.log('Connected:' + frame);
    //連接成功後，主動拉取未讀消息
    pullUnreadMessage(id);
    //订阅userId消息
    stompClient.subscribe('/user/' + id + '/single', function (response) {
        //console.log(response);
        showResponse(response.body);
    });
    //订阅修改推送状态消息
    stompClient.subscribe('/topic/group', function (response) {
        var nw = pushStatusEvent;  //新消息监听事件
        nw.message = response.body;
        window.document.dispatchEvent(nw);
    });
    //订阅群消息
    // stompClient.subscribe('/topic/group', function(response) {
    //     console.log(response);
    //     showResponse(response.body);
    // });
}

function errorCallback(){//连接失败时的回调函数，此函数重新调用连接方法，形成循环，直到连接成功
    //连接关闭启动定时任务 五秒后在创建
    heartCheck.start();
}

//定时器 只执行一次的那种 只是为了限制重连频率 = =
var heartCheck = {
    timeout: 5000, //重连时间
    timeoutObj: null,
    start: function(){
        this.timeoutObj = setTimeout(function(){
            connect(); //这里重新创建 websocket 对象并赋值
        }, this.timeout)
    }
}

connect(); // 加截页面时,连接webSocket
