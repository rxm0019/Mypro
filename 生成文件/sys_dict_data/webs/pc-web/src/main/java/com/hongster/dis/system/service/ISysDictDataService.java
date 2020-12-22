package com.hongster.dis.system.service;


import com.github.pagehelper.PageInfo;
import com.hongster.dis.common.model.system.SysDictData;
import com.hongster.dis.common.model.system.SysDictDataExample;
import com.hongster.dis.common.model.system.ext.SysDictDataList;
import com.hongster.dis.common.model.system.ext.SysDictDataEdit;
import org.apache.ibatis.session.RowBounds;

import java.util.List;


/**
 *  服务类实现
 */
public interface ISysDictDataService{


    SysDictData getByPrimaryKey(String id);

    /**
     * 不带分页
     */
    List<SysDictData> selectByExample(SysDictDataExample example);

    /**
     * 带分页
     */
    List<SysDictData> selectByExampleWithRowbounds(SysDictDataExample example, RowBounds rowBounds);

    void updateByPrimaryKey(SysDictData model);

    void updateByPrimaryKeySelective(SysDictData model);

    void deleteByPrimaryKey(String id);

    void deleteByPrimaryKeys(List<String> ids);

    void insert(SysDictData model);

    //查询全部列表
    List<SysDictDataList> listAll(SysDictDataList sysDictDataList);

    //查询列表分页方法
    PageInfo list(SysDictDataList sysDictDataList);

    //获取实体方法
    SysDictDataEdit getInfo(String id);

    //保存实体方法
    int saveOrEdit(SysDictDataEdit sysDictDataEdit);

    //删除方法
    int delete(String[] ids);

}
