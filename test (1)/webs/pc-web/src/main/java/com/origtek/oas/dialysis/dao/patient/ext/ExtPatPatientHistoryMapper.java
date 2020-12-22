package com.origtek.oas.dialysis.dao.patient.ext;

import com.origtek.oas.common.model.patient.ext.PatPatientHistoryList;
import org.apache.ibatis.session.RowBounds;

import java.util.List;

/**
 * 如果需要写sql语句，不要再PatPatientHistoryMapper写，自己建一个ext文件和ext的xml文件，
 * 比如ExtPatPatientHistoryMapper.java和ExtPatPatientHistoryMapper.xml
 */
public interface ExtPatPatientHistoryMapper {

    List<PatPatientHistoryList> list(PatPatientHistoryList patPatientHistoryList);

    List<PatPatientHistoryList> list(PatPatientHistoryList patPatientHistoryList, RowBounds rowBounds);

}