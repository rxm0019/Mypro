package com.hongster.dis.system.service;


import com.github.pagehelper.PageInfo;
import com.hongster.dis.common.model.system.SysDict;
import com.hongster.dis.common.model.system.SysDictExample;
import com.hongster.dis.common.model.system.ext.SysDictList;
import com.hongster.dis.common.model.system.ext.SysDictEdit;
import org.apache.ibatis.session.RowBounds;

import java.util.List;


/**
 *  服务类实现
 */
public interface ISysDictService{


    SysDict getByPrimaryKey(String id);

    /**
     * 不带分页
     */
    List<SysDict> selectByExample(SysDictExample example);

    /**
     * 带分页
     */
    List<SysDict> selectByExampleWithRowbounds(SysDictExample example, RowBounds rowBounds);

    void updateByPrimaryKey(SysDict model);

    void updateByPrimaryKeySelective(SysDict model);

    void deleteByPrimaryKey(String id);

    void deleteByPrimaryKeys(List<String> ids);

    void insert(SysDict model);

    //查询全部列表
    List<SysDictList> listAll(SysDictList sysDictList);

    //查询列表分页方法
    PageInfo list(SysDictList sysDictList);

    //获取实体方法
    SysDictEdit getInfo(String id);

    //保存实体方法
    int saveOrEdit(SysDictEdit sysDictEdit);

    //删除方法
    int delete(String[] ids);

}
