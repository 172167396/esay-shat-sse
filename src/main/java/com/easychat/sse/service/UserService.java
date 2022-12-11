package com.easychat.sse.service;

import com.easychat.sse.model.domain.UserDomain;
import com.easychat.sse.model.dto.*;
import com.easychat.sse.model.entity.UserEntity;
import com.easychat.sse.model.vo.SimpleGroupVO;

import java.util.List;

public interface UserService {
    UserEntity getUserByAccount(String userAccount);
    void login(String account, String password);
    void doRegister(String account, String nickName, String password);
    List<IdTitle> getUserGroups(String userId);
    void initUserGroup(String userId);

    List<SimpleUser> searchUser(String content);

    UserEntity getById(String id);

    SimpleUser getSimpleUserInfo(String id);

    List<IdName> queryUserGroup(String userId);

    void applyFriend(UserEntity user, ApplyFriendArgs applyFriendArgs);

    UserDomain getUserDomainByAccount(String username);

    List<SimpleGroupVO> findMyFriends(String userId, String id);

    String getFirstGroupId(String applyUser);

}
