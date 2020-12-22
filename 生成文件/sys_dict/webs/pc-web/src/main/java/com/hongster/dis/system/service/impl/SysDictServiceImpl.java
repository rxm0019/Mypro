package com.hongster.dis.system.service.impl;

import com.github.pagehelper.PageInfo;
import com.hemodialysis.common.base.AbstractBaseServiceImpl;
import com.hemodialysis.common.exception.ServiceException;
import com.hemodialysis.common.sys.PageEntity;
import com.hongster.dis.system.dao.SysDictMapper;
import com.hongster.dis.system.dao.ext.ExtSysDictMapper;
import com.hongster.dis.common.model.system.SysDict;
import com.hongster.dis.common.model.system.SysDictExample;
import com.hongster.dis.common.model.system.ext.SysDictList;
import com.hongster.dis.common.model.system.ext.SysDictEdit;
import com.hongster.dis.system.service.ISysDictService;
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
public class SysDictServiceImpl extends AbstractBaseServiceImpl implements ISysDictService {
    private static final Logger logger = LoggerFactory.getLogger(SysDictServiceImpl.class);


    @Autowired
    SysDictMapper mapper;

    @Autowired
    ExtSysDictMapper extSysDictMapper;

    //<editor-fold desc="通用的接口">
    @Override
    public SysDict getByPrimaryKey(String id) {
        return mapper.selectByPrimaryKey(id);
    }

    /**
     * 带分页
     */
    @Override
    public List<SysDict> selectByExample(SysDictExample example) {
        return mapper.selectByExample(example);
    }

    /**
     * 带分页
     */
    @Override
    public List<SysDict> selectByExampleWithRowbounds(SysDictExample example, RowBounds rowBounds) {
        return mapper.selectByExampleWithRowbounds(example, rowBounds);
    }

    @Override
    public void updateByPrimaryKey(SysDict model) {
/*        if (model.getUpdateDate() == null)
        model.setUpdateDate(new Date().getTime());*/
        mapper.updateByPrimaryKey(model);
    }

    @Override
    public void updateByPrimaryKeySelective(SysDict model) {
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

            SysDictExample example = new SysDictExample();
            SysDictExample.Criteria criteria = example.createCriteria();
            criteria.andIdIn(ids);
            mapper.deleteByExample(example);

        }
    }

    @Override
    public void insert(SysDict model) {
/*        if (model.getCreateDate() == null) {
            model.setCreateDate(new Date().getTime());
        }*/
        mapper.insert(model);
    }

    /**
     * 查询全部列表方法
     * @param sysDictList
     * @return
     */
    @Override
    public List<SysDictList> listAll(SysDictList sysDictList) {
        List<SysDictList> list=extSysDictMapper.list(sysDictList);
        return list;
    }

    /**
     * 分页查询列表方法
     * @param sysDictList
     * @return
     */
    @Override
    public PageInfo list(SysDictList sysDictList) {
        List<SysDictList> list=extSysDictMapper.list(sysDictList,
                new RowBounds(sysDictList.getPage().getPageNum(),sysDictList.getPage().getPageSize()));
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
    public SysDictEdit getInfo(String id) {
        SysDictEdit sysDictEdit=new SysDictEdit();
        if(ToolUtil.isNotEmpty(id)){
            SysDict sysDict=mapper.selectByPrimaryKey(id);
            //字段相同时才能复制，排除个别业务字段请百度一下
            BeanUtils.copyProperties(sysDict,sysDictEdit);
            //此处可继续返回其他字段...
        }
        return sysDictEdit;
    }

    /**
     * 保存方法
     * @param sysDictEdit
     * @return
     */
    @Override
    @Transactional
    public int saveOrEdit(SysDictEdit sysDictEdit) {
        int n=0;
        if(ToolUtil.isEmpty(sysDictEdit.getId())){
            //id为空，新增操作
            sysDictEdit.setId(ToolUtil.getUUID());
            n = mapper.insertSelective(sysDictEdit);
        }else{
            //id不为空，编辑操作
            n = mapper.updateByPrimaryKeySelective(sysDictEdit);
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
