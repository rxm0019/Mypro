package com.hongster.dis.system.dao;

import com.hongster.dis.common.model.system.SysHospital;
import com.hongster.dis.common.model.system.SysHospitalExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

public interface SysHospitalMapper {
    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sys_hospital
     *
     * @mbg.generated
     */
    long countByExample(SysHospitalExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sys_hospital
     *
     * @mbg.generated
     */
    int deleteByExample(SysHospitalExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sys_hospital
     *
     * @mbg.generated
     */
    int deleteByPrimaryKey(String hospitalId);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sys_hospital
     *
     * @mbg.generated
     */
    int insert(SysHospital record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sys_hospital
     *
     * @mbg.generated
     */
    int insertSelective(SysHospital record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sys_hospital
     *
     * @mbg.generated
     */
    List<SysHospital> selectByExampleWithRowbounds(SysHospitalExample example, RowBounds rowBounds);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sys_hospital
     *
     * @mbg.generated
     */
    List<SysHospital> selectByExample(SysHospitalExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sys_hospital
     *
     * @mbg.generated
     */
    SysHospital selectByPrimaryKey(String hospitalId);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sys_hospital
     *
     * @mbg.generated
     */
    int updateByExampleSelective(@Param("record") SysHospital record, @Param("example") SysHospitalExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sys_hospital
     *
     * @mbg.generated
     */
    int updateByExample(@Param("record") SysHospital record, @Param("example") SysHospitalExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sys_hospital
     *
     * @mbg.generated
     */
    int updateByPrimaryKeySelective(SysHospital record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table sys_hospital
     *
     * @mbg.generated
     */
    int updateByPrimaryKey(SysHospital record);
}