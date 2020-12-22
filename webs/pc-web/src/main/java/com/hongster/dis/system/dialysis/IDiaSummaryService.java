package com.hongster.dis.system.dialysis;


import com.github.pagehelper.PageInfo;
import com.hongster.dis.common.model.dialysis.DiaSummary;
import com.hongster.dis.common.model.dialysis.DiaSummaryExample;
import com.hongster.dis.common.model.dialysis.ext.DiaSummaryList;
import com.hongster.dis.common.model.dialysis.ext.DiaSummaryEdit;
import org.apache.ibatis.session.RowBounds;

import java.util.List;


/**
 *  服务类实现
 */
public interface IDiaSummaryService{


    DiaSummary getByPrimaryKey(String id);

    /**
     * 不带分页
     */
    List<DiaSummary> selectByExample(DiaSummaryExample example);

    /**
     * 带分页
     */
    List<DiaSummary> selectByExampleWithRowbounds(DiaSummaryExample example, RowBounds rowBounds);

    void updateByPrimaryKey(DiaSummary model);

    void updateByPrimaryKeySelective(DiaSummary model);

    void deleteByPrimaryKey(String id);

    void deleteByPrimaryKeys(List<String> ids);

    void insert(DiaSummary model);

    //查询全部列表
    List<DiaSummaryList> listAll(DiaSummaryList diaSummaryList);

    //查询列表分页方法
    PageInfo list(DiaSummaryList diaSummaryList);

    //获取实体方法
    DiaSummaryEdit getInfo(String id);

    //保存实体方法
    int saveOrEdit(DiaSummaryEdit diaSummaryEdit);

    //删除方法
    int delete(String[] ids);

}
