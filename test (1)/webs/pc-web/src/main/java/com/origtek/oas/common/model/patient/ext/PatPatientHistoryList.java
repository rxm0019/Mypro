package com.origtek.oas.common.model.patient.ext;

import com.hemodialysis.common.sys.PageEntity;
import com.origtek.oas.common.model.patient.PatPatientHistory;
import java.util.Date;

/**
 * 用作PatPatientHistory的列表查询页面的实体
 */
public class PatPatientHistoryList extends PatPatientHistory{
    //统一封装分页、排序的实体
    private PageEntity page;
    //updateTime-开始
    private Date updateTime_begin;
    //updateTime-结束
    private Date updateTime_end;


    public PageEntity getPage() {
        return page;
    }

    public void setPage(PageEntity page) {
        this.page = page;
    }
    public Date getUpdateTime_begin() {
        return updateTime_begin;
    }

    public void setUpdateTime_begin(Date updateTime_begin) {
        this.updateTime_begin = updateTime_begin;
    }

    public Date getUpdateTime_end() {
        return updateTime_end;
    }

    public void setUpdateTime_end(Date updateTime_end) {
        this.updateTime_end = updateTime_end;
    }

    
}
