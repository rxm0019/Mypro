package com.hongster.dis.system.service;


import com.github.pagehelper.PageInfo;
import com.hongster.dis.common.model.system.SysHospital;
import com.hongster.dis.common.model.system.SysHospitalExample;
import com.hongster.dis.common.model.system.ext.SysHospitalList;
import com.hongster.dis.common.model.system.ext.SysHospitalEdit;
import org.apache.ibatis.session.RowBounds;

import java.util.List;


/**
 *  服务类实现
 */
public interface ISysHospitalService{


    SysHospital getByPrimaryKey(String id);

    /**
     * 不带分页
     */
    List<SysHospital> selectByExample(SysHospitalExample example);

    /**
     * 带分页
     */
    List<SysHospital> selectByExampleWithRowbounds(SysHospitalExample example, RowBounds rowBounds);

    void updateByPrimaryKey(SysHospital model);

    void updateByPrimaryKeySelective(SysHospital model);

    void deleteByPrimaryKey(String id);

    void deleteByPrimaryKeys(List<String> ids);

    void insert(SysHospital model);

    //查询全部列表
    List<SysHospitalList> listAll(SysHospitalList sysHospitalList);

    //查询列表分页方法
    PageInfo list(SysHospitalList sysHospitalList);

    //获取实体方法
    SysHospitalEdit getInfo(String id);

    //保存实体方法
    int saveOrEdit(SysHospitalEdit sysHospitalEdit);

    //删除方法
    int delete(String[] ids);

}
