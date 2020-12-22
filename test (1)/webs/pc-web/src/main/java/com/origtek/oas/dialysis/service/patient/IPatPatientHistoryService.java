package com.origtek.oas.dialysis.service.patient;


import com.github.pagehelper.PageInfo;
import com.origtek.oas.common.model.patient.PatPatientHistory;
import com.origtek.oas.common.model.patient.PatPatientHistoryExample;
import com.origtek.oas.common.model.patient.ext.PatPatientHistoryList;
import com.origtek.oas.common.model.patient.ext.PatPatientHistoryEdit;
import org.apache.ibatis.session.RowBounds;

import java.util.List;


/**
 *  服务类实现
 */
public interface IPatPatientHistoryService{


    PatPatientHistory getByPrimaryKey(String id);

    /**
     * 不带分页
     */
    List<PatPatientHistory> selectByExample(PatPatientHistoryExample example);

    /**
     * 带分页
     */
    List<PatPatientHistory> selectByExampleWithRowbounds(PatPatientHistoryExample example, RowBounds rowBounds);

    void updateByPrimaryKey(PatPatientHistory model);

    void updateByPrimaryKeySelective(PatPatientHistory model);

    void deleteByPrimaryKey(String id);

    void deleteByPrimaryKeys(List<String> ids);

    void insert(PatPatientHistory model);

    //查询全部列表
    List<PatPatientHistoryList> listAll(PatPatientHistoryList patPatientHistoryList);

    //查询列表分页方法
    PageInfo list(PatPatientHistoryList patPatientHistoryList);

    //获取实体方法
    PatPatientHistoryEdit getInfo(String id);

    //保存实体方法
    int saveOrEdit(PatPatientHistoryEdit patPatientHistoryEdit);

    //删除方法
    int delete(String[] ids);

}
