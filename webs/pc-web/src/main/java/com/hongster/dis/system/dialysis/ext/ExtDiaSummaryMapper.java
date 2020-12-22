package com.hongster.dis.system.dialysis.ext;

import com.hongster.dis.common.model.dialysis.ext.DiaSummaryList;
import org.apache.ibatis.session.RowBounds;

import java.util.List;

/**
 * 如果需要写sql语句，不要再DiaSummaryMapper写，自己建一个ext文件和ext的xml文件，
 * 比如ExtDiaSummaryMapper.java和ExtDiaSummaryMapper.xml
 */
public interface ExtDiaSummaryMapper {

    List<DiaSummaryList> list(DiaSummaryList diaSummaryList);

    List<DiaSummaryList> list(DiaSummaryList diaSummaryList, RowBounds rowBounds);

}