let $recentChatUl = $("#recent-chat ul");
!(function (e) {
    let socket = e.socket, host = location.host,
        socketUrl = `ws://${host}/connect`;
    if (socket && socket.isClosed !== undefined && !socket.isClosed) {
        return;
    }
    socket = new WebSocket(socketUrl);
    //打开事件
    socket.onopen = function () {
        //获得消息事件
        socket.onmessage = function (msg) {
            if (msg.data) {
                let msgJson = JSON.parse(msg.data);
                onReceiveMsg(msgJson);
            }
        };
        //发生了错误事件
        socket.onerror = function () {
            console.log("websocket发生了错误");
        }
    }
    socket.onclose = function (e) {
        socket.isClosed = true;
    }
    e.socket = socket;
})(window);


function onReceiveMsg(msgJson) {
    console.log(msgJson);
    let senderLi = $recentChatUl.find(`li#${msgJson.sender}`);
    if (senderLi?.length < 1) {
        switch (msgJson.messageType) {
            case "TEXT":
                insertTextMsg(msgJson);
                break;
            case "NOTICE":
        }
        return;
    }
    showMsg(senderLi, msgJson);
}


function showMsg(senderLi, msgJson) {
    //消息数+1
    let notReadSpan = senderLi.find(".notRead");
    if (notReadSpan.hasClass("hide")) {
        notReadSpan.removeClass("hide");
        notReadSpan.text("1");
    } else {
        let num = notReadSpan.text();
        if (num + 1 > 99) num = 99;
        notReadSpan.text(num === 99 ? "99+" : num);
    }
    //改变消息预览
    senderLi.find(".short-desc").text(msgJson.content);
    //右侧iframe添加消息
    let chatMain = $(`iframe[data-id=${msgJson.sender}`).contents().find(".chat");
    if (chatMain?.length < 1) return;
    chatMain.append(`<div class="bubble you">${msgJson.content}</div>`);
    chatMain.get(0).scrollTop = chatMain.get(0).scrollHeight;
}

function insertTextMsg(e) {
    let senderName = $(`dd[data-id=${e.sender}]`).find(".friendName").text();
    let $chatLineTpl = $(`<li class="chat-line" id="${e.sender}">
                                <div class="${e.type}">
                                    <div class="notice-msg relative">
                                        <div class="sys-notice ${e.type === 'NOTICE' || '' ? 'show' : 'displayNone'}">
                                        </div>
                                        <div class="new-apply ${e.type === 'NEW_FRIEND' ? 'show' : 'displayNone'}">
                                        </div>
                                        <div class="recent-chat ${e.type === 'PERSONAL' ? 'show' : 'displayNone'}">
                                            <img class="chat-avatar" src="${e.senderAvatar ?? ''}">
                                        </div>
                                        <p class="nickName overflowEllips">${senderName}</p>
                                        <p class="chatDate">${e?.createTime}</p>
                                        <span class="notRead">1</span>
                                        <p class="short-desc overflowEllips" title="${e.content}">${e.content}</p>
                                    </div>
                                </div>
                            </li>`);
    $chatLineTpl.data("id", e.sender);
    $chatLineTpl.data("type", e?.type);
    $recentChatUl.prepend($chatLineTpl);
}