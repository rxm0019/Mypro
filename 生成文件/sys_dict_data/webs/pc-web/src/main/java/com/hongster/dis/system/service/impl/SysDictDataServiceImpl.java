package com.hongster.dis.system.service.impl;

import com.github.pagehelper.PageInfo;
import com.hemodialysis.common.base.AbstractBaseServiceImpl;
import com.hemodialysis.common.exception.ServiceException;
import com.hemodialysis.common.sys.PageEntity;
import com.hongster.dis.system.dao.SysDictDataMapper;
import com.hongster.dis.system.dao.ext.ExtSysDictDataMapper;
import com.hongster.dis.common.model.system.SysDictData;
import com.hongster.dis.common.model.system.SysDictDataExample;
import com.hongster.dis.common.model.system.ext.SysDictDataList;
import com.hongster.dis.common.model.system.ext.SysDictDataEdit;
import com.hongster.dis.system.service.ISysDictDataService;
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
public class SysDictDataServiceImpl extends AbstractBaseServiceImpl implements ISysDictDataService {
    private static final Logger logger = LoggerFactory.getLogger(SysDictDataServiceImpl.class);


    @Autowired
    SysDictDataMapper mapper;

    @Autowired
    ExtSysDictDataMapper extSysDictDataMapper;

    //<editor-fold desc="通用的接口">
    @Override
    public SysDictData getByPrimaryKey(String id) {
        return mapper.selectByPrimaryKey(id);
    }

    /**
     * 带分页
     */
    @Override
    public List<SysDictData> selectByExample(SysDictDataExample example) {
        return mapper.selectByExample(example);
    }

    /**
     * 带分页
     */
    @Override
    public List<SysDictData> selectByExampleWithRowbounds(SysDictDataExample example, RowBounds rowBounds) {
        return mapper.selectByExampleWithRowbounds(example, rowBounds);
    }

    @Override
    public void updateByPrimaryKey(SysDictData model) {
/*        if (model.getUpdateDate() == null)
        model.setUpdateDate(new Date().getTime());*/
        mapper.updateByPrimaryKey(model);
    }

    @Override
    public void updateByPrimaryKeySelective(SysDictData model) {
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

            SysDictDataExample example = new SysDictDataExample();
            SysDictDataExample.Criteria criteria = example.createCriteria();
            criteria.andIdIn(ids);
            mapper.deleteByExample(example);

        }
    }

    @Override
    public void insert(SysDictData model) {
/*        if (model.getCreateDate() == null) {
            model.setCreateDate(new Date().getTime());
        }*/
        mapper.insert(model);
    }

    /**
     * 查询全部列表方法
     * @param sysDictDataList
     * @return
     */
    @Override
    public List<SysDictDataList> listAll(SysDictDataList sysDictDataList) {
        List<SysDictDataList> list=extSysDictDataMapper.list(sysDictDataList);
        return list;
    }

    /**
     * 分页查询列表方法
     * @param sysDictDataList
     * @return
     */
    @Override
    public PageInfo list(SysDictDataList sysDictDataList) {
        List<SysDictDataList> list=extSysDictDataMapper.list(sysDictDataList,
                new RowBounds(sysDictDataList.getPage().getPageNum(),sysDictDataList.getPage().getPageSize()));
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
    public SysDictDataEdit getInfo(String id) {
        SysDictDataEdit sysDictDataEdit=new SysDictDataEdit();
        if(ToolUtil.isNotEmpty(id)){
            SysDictData sysDictData=mapper.selectByPrimaryKey(id);
            //字段相同时才能复制，排除个别业务字段请百度一下
            BeanUtils.copyProperties(sysDictData,sysDictDataEdit);
            //此处可继续返回其他字段...
        }
        return sysDictDataEdit;
    }

    /**
     * 保存方法
     * @param sysDictDataEdit
     * @return
     */
    @Override
    @Transactional
    public int saveOrEdit(SysDictDataEdit sysDictDataEdit) {
        int n=0;
        if(ToolUtil.isEmpty(sysDictDataEdit.getId())){
            //id为空，新增操作
            sysDictDataEdit.setId(ToolUtil.getUUID());
            n = mapper.insertSelective(sysDictDataEdit);
        }else{
            //id不为空，编辑操作
            n = mapper.updateByPrimaryKeySelective(sysDictDataEdit);
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
