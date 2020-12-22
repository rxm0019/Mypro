package com.hongster.dis.system.dao.ext;

import com.hongster.dis.common.model.system.ext.SysDictList;
import org.apache.ibatis.session.RowBounds;

import java.util.List;

/**
 * 如果需要写sql语句，不要再SysDictMapper写，自己建一个ext文件和ext的xml文件，
 * 比如ExtSysDictMapper.java和ExtSysDictMapper.xml
 */
public interface ExtSysDictMapper {

    List<SysDictList> list(SysDictList sysDictList);

    List<SysDictList> list(SysDictList sysDictList, RowBounds rowBounds);

}