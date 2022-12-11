package com.easychat.sse.event.handler;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.easychat.sse.enums.MessageType;
import com.easychat.sse.model.domain.SseMessage;
import com.easychat.sse.model.dto.TextMessage;
import com.easychat.sse.model.entity.MsgRecordEntity;
import com.easychat.sse.model.entity.RecentChat;
import com.easychat.sse.service.ChatService;
import com.easychat.sse.service.MessageRecordService;
import com.easychat.sse.utils.IdUtils;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.time.LocalDateTime;

@Component
public class RecordMsgHandler {

    @Resource
    MessageRecordService messageRecordService;
    @Resource
    ChatService chatService;

    @Async
    @EventListener(SseMessage.class)
    public void handle(SseMessage message) {
        if (message instanceof TextMessage) {
            MsgRecordEntity entity = new MsgRecordEntity();
            entity.setId(IdUtils.getId());
            entity.setContent(message.getContent());
            entity.setCreateTime(LocalDateTime.now());
            entity.setMessageType(MessageType.TEXT.getType());
            entity.setSenderId(message.getSender());
            entity.setReceiverId(message.getReceiver());
            entity.setFileId(null);
            RecentChat recentChat = chatService.getOne(Wrappers.<RecentChat>lambdaQuery().eq(RecentChat::getUserId, message.getSender()));
            if (recentChat != null) {
                entity.setBelongRecentId(recentChat.getId());
                messageRecordService.save(entity);
                return;
            }
            String id = chatService.dealRecentChat(message.getSender(), message.getReceiver());
            entity.setBelongRecentId(id);
            messageRecordService.save(entity);
        }
    }
}
