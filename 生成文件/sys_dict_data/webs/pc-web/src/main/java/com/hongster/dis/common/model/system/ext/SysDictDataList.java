package com.hongster.dis.common.model.system.ext;

import com.hemodialysis.common.sys.PageEntity;
import com.hongster.dis.common.model.system.SysDictData;
import java.util.Date;

/**
 * 用作SysDictData的列表查询页面的实体
 */
public class SysDictDataList extends SysDictData{
    //统一封装分页、排序的实体
    private PageEntity page;


    public PageEntity getPage() {
        return page;
    }

    public void setPage(PageEntity page) {
        this.page = page;
    }

    
}
