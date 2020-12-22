package com.hongster.dis.system.dao.ext;

import com.hongster.dis.common.model.system.ext.SysHospitalList;
import org.apache.ibatis.session.RowBounds;

import java.util.List;

/**
 * 如果需要写sql语句，不要再SysHospitalMapper写，自己建一个ext文件和ext的xml文件，
 * 比如ExtSysHospitalMapper.java和ExtSysHospitalMapper.xml
 */
public interface ExtSysHospitalMapper {

    List<SysHospitalList> list(SysHospitalList sysHospitalList);

    List<SysHospitalList> list(SysHospitalList sysHospitalList, RowBounds rowBounds);

}