package com.hongster.dis.system.dao.ext;

import com.hongster.dis.common.model.system.ext.SysDictDataList;
import org.apache.ibatis.session.RowBounds;

import java.util.List;

/**
 * 如果需要写sql语句，不要再SysDictDataMapper写，自己建一个ext文件和ext的xml文件，
 * 比如ExtSysDictDataMapper.java和ExtSysDictDataMapper.xml
 */
public interface ExtSysDictDataMapper {

    List<SysDictDataList> list(SysDictDataList sysDictDataList);

    List<SysDictDataList> list(SysDictDataList sysDictDataList, RowBounds rowBounds);

}