package com.origtek.oas.dialysis.service.patient.impl;

import com.github.pagehelper.PageInfo;
import com.hemodialysis.common.base.AbstractBaseServiceImpl;
import com.hemodialysis.common.exception.ServiceException;
import com.hemodialysis.common.sys.PageEntity;
import com.origtek.oas.dialysis.dao.patient.PatPatientHistoryMapper;
import com.origtek.oas.dialysis.dao.patient.ext.ExtPatPatientHistoryMapper;
import com.origtek.oas.common.model.patient.PatPatientHistory;
import com.origtek.oas.common.model.patient.PatPatientHistoryExample;
import com.origtek.oas.common.model.patient.ext.PatPatientHistoryList;
import com.origtek.oas.common.model.patient.ext.PatPatientHistoryEdit;
import com.origtek.oas.dialysis.service.patient.IPatPatientHistoryService;
import com.hemodialysis.common.util.ToolUtil;
import org.apache.ibatis.session.RowBounds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 *  服务类实现
 */
@Service
public class PatPatientHistoryServiceImpl extends AbstractBaseServiceImpl implements IPatPatientHistoryService {
    private static final Logger logger = LoggerFactory.getLogger(PatPatientHistoryServiceImpl.class);


    @Autowired
    PatPatientHistoryMapper mapper;

    @Autowired
    ExtPatPatientHistoryMapper extPatPatientHistoryMapper;

    //<editor-fold desc="通用的接口">
    @Override
    public PatPatientHistory getByPrimaryKey(String id) {
        return mapper.selectByPrimaryKey(id);
    }

    /**
     * 带分页
     */
    @Override
    public List<PatPatientHistory> selectByExample(PatPatientHistoryExample example) {
        return mapper.selectByExample(example);
    }

    /**
     * 带分页
     */
    @Override
    public List<PatPatientHistory> selectByExampleWithRowbounds(PatPatientHistoryExample example, RowBounds rowBounds) {
        return mapper.selectByExampleWithRowbounds(example, rowBounds);
    }

    @Override
    public void updateByPrimaryKey(PatPatientHistory model) {
/*        if (model.getUpdateDate() == null)
        model.setUpdateDate(new Date().getTime());*/
        mapper.updateByPrimaryKey(model);
    }

    @Override
    public void updateByPrimaryKeySelective(PatPatientHistory model) {
/*        if (model.getUpdateDate() == null)
            model.setUpdateDate(new Date().getTime());*/
        mapper.updateByPrimaryKeySelective(model);
    }

    @Override
    public void deleteByPrimaryKey(String id) {
//        if(!canDel(id))
//            throw new ServiceException("id="+id+"的xx下面有xx不能删除,需要先删除所有xx才能删除");

        mapper.deleteByPrimaryKey(id);
    }

    @Override
    public void deleteByPrimaryKeys(List<String> ids) {
        if (ids != null && ids.size() > 0) {
//            if(!canDel(ids))
//                throw new ServiceException("xx下面有xx不能删除,需要先删除所有xx才能删除");

            PatPatientHistoryExample example = new PatPatientHistoryExample();
            PatPatientHistoryExample.Criteria criteria = example.createCriteria();
            criteria.andPatientHistoryIdIn(ids);
            mapper.deleteByExample(example);

        }
    }

    @Override
    public void insert(PatPatientHistory model) {
/*        if (model.getCreateDate() == null) {
            model.setCreateDate(new Date().getTime());
        }*/
        mapper.insert(model);
    }

    /**
     * 查询全部列表方法
     * @param patPatientHistoryList
     * @return
     */
    @Override
    public List<PatPatientHistoryList> listAll(PatPatientHistoryList patPatientHistoryList) {
        List<PatPatientHistoryList> list=extPatPatientHistoryMapper.list(patPatientHistoryList);
        return list;
    }

    /**
     * 分页查询列表方法
     * @param patPatientHistoryList
     * @return
     */
    @Override
    public PageInfo list(PatPatientHistoryList patPatientHistoryList) {
        List<PatPatientHistoryList> list=extPatPatientHistoryMapper.list(patPatientHistoryList,
                new RowBounds(patPatientHistoryList.getPage().getPageNum(),patPatientHistoryList.getPage().getPageSize()));
        PageInfo pageInfo=new PageInfo(list);
        return pageInfo;
    }

    /**
     * 获取实体方法，可通过查询返回复杂实体到前台
     * 除了返回本记录实体，也可继续返回其他字段
     * @param id
     * @return
     */
    @Override
    public PatPatientHistoryEdit getInfo(String id) {
        PatPatientHistoryEdit patPatientHistoryEdit=new PatPatientHistoryEdit();
        if(ToolUtil.isNotEmpty(id)){
            PatPatientHistory patPatientHistory=mapper.selectByPrimaryKey(id);
            //字段相同时才能复制，排除个别业务字段请百度一下
            BeanUtils.copyProperties(patPatientHistory,patPatientHistoryEdit);
            //此处可继续返回其他字段...
        }
        return patPatientHistoryEdit;
    }

    /**
     * 保存方法
     * @param patPatientHistoryEdit
     * @return
     */
    @Override
    @Transactional
    public int saveOrEdit(PatPatientHistoryEdit patPatientHistoryEdit) {
        int n=0;
        if(ToolUtil.isEmpty(patPatientHistoryEdit.getPatientHistoryId())){
            //id为空，新增操作
            patPatientHistoryEdit.setPatientHistoryId(ToolUtil.getUUID());
            n = mapper.insertSelective(patPatientHistoryEdit);
        }else{
            //id不为空，编辑操作
            n = mapper.updateByPrimaryKeySelective(patPatientHistoryEdit);
        }
        return n;
    }

    /**
     * 删除方法
     * @param ids
     * @return
     */
    @Override
    @Transactional
    public int delete(String[] ids) {
        if(ids!=null&&ids.length>0){
            //物理删除状态
            deleteByPrimaryKeys(Arrays.asList(ids));
        }
        return 0;
    }

}
