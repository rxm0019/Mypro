package com.hongster.dis.system.dialysis.impl;

import com.github.pagehelper.PageInfo;
import com.hemodialysis.common.base.AbstractBaseServiceImpl;
import com.hemodialysis.common.exception.ServiceException;
import com.hemodialysis.common.sys.PageEntity;
import com.hongster.dis.system.dialysis.DiaSummaryMapper;
import com.hongster.dis.system.dialysis.ext.ExtDiaSummaryMapper;
import com.hongster.dis.common.model.dialysis.DiaSummary;
import com.hongster.dis.common.model.dialysis.DiaSummaryExample;
import com.hongster.dis.common.model.dialysis.ext.DiaSummaryList;
import com.hongster.dis.common.model.dialysis.ext.DiaSummaryEdit;
import com.hongster.dis.system.dialysis.IDiaSummaryService;
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
public class DiaSummaryServiceImpl extends AbstractBaseServiceImpl implements IDiaSummaryService {
    private static final Logger logger = LoggerFactory.getLogger(DiaSummaryServiceImpl.class);


    @Autowired
    DiaSummaryMapper mapper;

    @Autowired
    ExtDiaSummaryMapper extDiaSummaryMapper;

    //<editor-fold desc="通用的接口">
    @Override
    public DiaSummary getByPrimaryKey(String id) {
        return mapper.selectByPrimaryKey(id);
    }

    /**
     * 带分页
     */
    @Override
    public List<DiaSummary> selectByExample(DiaSummaryExample example) {
        return mapper.selectByExample(example);
    }

    /**
     * 带分页
     */
    @Override
    public List<DiaSummary> selectByExampleWithRowbounds(DiaSummaryExample example, RowBounds rowBounds) {
        return mapper.selectByExampleWithRowbounds(example, rowBounds);
    }

    @Override
    public void updateByPrimaryKey(DiaSummary model) {
/*        if (model.getUpdateDate() == null)
        model.setUpdateDate(new Date().getTime());*/
        mapper.updateByPrimaryKey(model);
    }

    @Override
    public void updateByPrimaryKeySelective(DiaSummary model) {
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

            DiaSummaryExample example = new DiaSummaryExample();
            DiaSummaryExample.Criteria criteria = example.createCriteria();
            criteria.andSummaryIdIn(ids);
            mapper.deleteByExample(example);

        }
    }

    @Override
    public void insert(DiaSummary model) {
/*        if (model.getCreateDate() == null) {
            model.setCreateDate(new Date().getTime());
        }*/
        mapper.insert(model);
    }

    /**
     * 查询全部列表方法
     * @param diaSummaryList
     * @return
     */
    @Override
    public List<DiaSummaryList> listAll(DiaSummaryList diaSummaryList) {
        List<DiaSummaryList> list=extDiaSummaryMapper.list(diaSummaryList);
        return list;
    }

    /**
     * 分页查询列表方法
     * @param diaSummaryList
     * @return
     */
    @Override
    public PageInfo list(DiaSummaryList diaSummaryList) {
        List<DiaSummaryList> list=extDiaSummaryMapper.list(diaSummaryList,
                new RowBounds(diaSummaryList.getPage().getPageNum(),diaSummaryList.getPage().getPageSize()));
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
    public DiaSummaryEdit getInfo(String id) {
        DiaSummaryEdit diaSummaryEdit=new DiaSummaryEdit();
        if(ToolUtil.isNotEmpty(id)){
            DiaSummary diaSummary=mapper.selectByPrimaryKey(id);
            //字段相同时才能复制，排除个别业务字段请百度一下
            BeanUtils.copyProperties(diaSummary,diaSummaryEdit);
            //此处可继续返回其他字段...
        }
        return diaSummaryEdit;
    }

    /**
     * 保存方法
     * @param diaSummaryEdit
     * @return
     */
    @Override
    @Transactional
    public int saveOrEdit(DiaSummaryEdit diaSummaryEdit) {
        int n=0;
        if(ToolUtil.isEmpty(diaSummaryEdit.getSummaryId())){
            //id为空，新增操作
            diaSummaryEdit.setSummaryId(ToolUtil.getUUID());
            n = mapper.insertSelective(diaSummaryEdit);
        }else{
            //id不为空，编辑操作
            n = mapper.updateByPrimaryKeySelective(diaSummaryEdit);
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
