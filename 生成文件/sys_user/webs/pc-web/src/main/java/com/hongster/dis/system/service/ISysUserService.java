package com.hongster.dis.system.service;


import com.github.pagehelper.PageInfo;
import com.hongster.dis.common.model.system.SysUser;
import com.hongster.dis.common.model.system.SysUserExample;
import com.hongster.dis.common.model.system.ext.SysUserList;
import com.hongster.dis.common.model.system.ext.SysUserEdit;
import org.apache.ibatis.session.RowBounds;

import java.util.List;


/**
 *  服务类实现
 */
public interface ISysUserService{


    SysUser getByPrimaryKey(String id);

    /**
     * 不带分页
     */
    List<SysUser> selectByExample(SysUserExample example);

    /**
     * 带分页
     */
    List<SysUser> selectByExampleWithRowbounds(SysUserExample example, RowBounds rowBounds);

    void updateByPrimaryKey(SysUser model);

    void updateByPrimaryKeySelective(SysUser model);

    void deleteByPrimaryKey(String id);

    void deleteByPrimaryKeys(List<String> ids);

    void insert(SysUser model);

    //查询全部列表
    List<SysUserList> listAll(SysUserList sysUserList);

    //查询列表分页方法
    PageInfo list(SysUserList sysUserList);

    //获取实体方法
    SysUserEdit getInfo(String id);

    //保存实体方法
    int saveOrEdit(SysUserEdit sysUserEdit);

    //删除方法
    int delete(String[] ids);

}
