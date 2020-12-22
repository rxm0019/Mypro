package com.hongster.dis.system.controller;

import com.github.pagehelper.PageInfo;
import com.hongster.dis.web.controller.system.BaseController;
import com.hemodialysis.common.exception.InvalidParamException;
import com.hemodialysis.common.sys.Result;
import com.hongster.dis.common.model.system.SysDict;
import com.hongster.dis.common.model.system.SysDictExample;
import com.hongster.dis.common.model.system.ext.SysDictEdit;
import com.hongster.dis.common.model.system.ext.SysDictList;
import com.hongster.dis.system.service.ISysDictService;
import com.hemodialysis.common.util.ConvertToMap;
import com.hemodialysis.common.util.MessageHelper;
import com.hemodialysis.common.util.ToolUtil;
import com.hongster.dis.web.util.easypoi.ExcelDefaultEntity;
import com.hongster.dis.web.commons.aop.SystemLog;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by on 18-8-24 下午6:13
 * SysDict的控制器业务处理页面
 */

@Controller
@RequestMapping(value = "sysDict")
public class SysDictController extends BaseController{
    public static final Logger logger = LoggerFactory.getLogger(SysDictController.class);

    @Autowired
    private ISysDictService iSysDictService;

    /**
     * 列表页面跳转
     * 此处跳转可以利用freemarker语法处理某些逻辑预先生成需要的页面数据，最常用的是比如填充下拉框（数据由数据库获取）等
     * 然后将数据以变量形式返回页面 比如：model.addAttribute("mylist",data);
     * 前台页面变量遍历： <#if mylist??><#list mylist as col><option value="${col.getId()}">${col.getName()}</option></#list></#if>
     * 最后返回页面，比如 return "/test/testEdit"
     * 以后都推荐这样的做法更效率并且安全，逐渐替代以前在页面用ajax请求的方式
     * @param model
     * @return
     */
    @RequestMapping(value = "/sysDictList",method = RequestMethod.GET)
    public String sysDictList(ModelMap model){
        //此处可返回数据页面预处理...
        return "/system/sysDictList";
    }

    /**
     * 编辑页面跳转
     * 原理同上
     * @param model
     * @return
     */
    @RequestMapping(value = "/sysDictEdit",method = RequestMethod.GET)
    public String sysDictEdit(ModelMap model){
        //此处可返回数据页面预处理...
        return "/system/sysDictEdit";
    }

    /**
     * 获取全部列表，通常用于下拉框
     * @param request
     * @param sysDict
     * @return
     */
    @RequestMapping(value = "/getLists.do", method = RequestMethod.POST)
    @ResponseBody
    public Result getLists(HttpServletRequest request,SysDict sysDict){
        Result result = new Result();
        SysDictExample example = new SysDictExample();
        SysDictExample.Criteria criteria = example.createCriteria();
        List<SysDict> list=iSysDictService.selectByExample(example);
        result.setBizData(list);
        return result;
    }

    /**
     * 获取分页列表，用于页面的列表查询
     * @param request
     * @param sysDictList
     * @return
     */
    @RequestMapping(value = "/list.do", method = RequestMethod.POST)
    @ResponseBody
    public PageInfo list(HttpServletRequest request,  SysDictList sysDictList){
        Result result = new Result();
        PageInfo pageInfo=iSysDictService.list(sysDictList);
        return pageInfo;
    }

    /**
     * 获取实体信息
     * @param request
     * @param sysDictEdit
     * @return
     */
    @RequestMapping(value = "/getInfo.do", method = RequestMethod.POST)
    @ResponseBody
    public Result getInfo(HttpServletRequest request,  SysDictEdit sysDictEdit){
        Result result = new Result();
        if(ToolUtil.isEmpty(sysDictEdit.getId())){
            throw new InvalidParamException(MessageHelper.ID_ISNULL);  //抛出异常
        }
        SysDictEdit sysDict=iSysDictService.getInfo(sysDictEdit.getId());
        result.setBizData(sysDict);
        return result;
    }

    /**
     * 保存实体信息
     * @param request
     * @param sysDictEdit
     * @return
     */
    @SystemLog("保存实体信息")
    @RequestMapping(value = "/saveOrEdit.do", method = RequestMethod.POST)
    @ResponseBody
    public Result saveOrEdit(HttpServletRequest request,  SysDictEdit sysDictEdit){
        Result result = new Result();
        if(sysDictEdit==null){
            throw new InvalidParamException(MessageHelper.MODEL_ISNULL);  //抛出异常
        }
        int code=iSysDictService.saveOrEdit(sysDictEdit);
        result.setBizData(code);
        return result;
    }

    /**
     * 删除实体信息
     * @param request
     * @param ids
     * @return
     */
    @SystemLog("删除实体信息")
    @RequestMapping(value = "/delete.do", method = RequestMethod.POST)
    @ResponseBody
    public Result delete(HttpServletRequest request,@RequestParam("ids[]") String[] ids){
        Result result = new Result();
        if(ids!=null&&ids.length==0){
            throw new InvalidParamException(MessageHelper.ID_ISNULL);  //抛出异常
        }
        int code=iSysDictService.delete(ids);
        result.setBizData(code);
        return result;
    }

    /**
     * 导出excel
     * @param request
     * @param excelConfig excel配置
     * @param sysDictList
     * @return
     */
    @SystemLog("导出excel")
    @RequestMapping(value = "/exportExcel.do", method = RequestMethod.POST)
    @ResponseBody
    public Result exportExcel(HttpServletRequest request, String excelConfig,SysDictList sysDictList){
        Result result = new Result();
        if(ToolUtil.isEmpty(excelConfig)){
            throw new InvalidParamException("excel配置不能为空,生成excel失败");  //抛出异常
        }
        Gson gson = new Gson();
        List<ExcelDefaultEntity> excelHeads = gson.fromJson(excelConfig,
            new TypeToken<List<ExcelDefaultEntity>>(){}.getType());//把JSON字符串转为对象
        //获取全部结果列表
        List<SysDictList> list=iSysDictService.listAll(sysDictList);
        //定义excel的结果变量
        List<Map<String, Object>> excelData = new ArrayList<>();
        if(list!=null&&list.size()>0){
        for (SysDictList dataList:list) {
            //此处可对结果转化、过滤等处理，最后将对象转化map填充excel
            Map<String,Object> map=ConvertToMap.ObjToMap(dataList);
            //可对map进行赋值等处理
            excelData.add(map);
            }
        }
        //临时生成excel文件
        String savePath=saveExcel(excelHeads,excelData);
        if(ToolUtil.isEmpty(savePath)){
        throw new InvalidParamException("系统发生异常,生成excel失败");  //抛出异常
        }
        //返回excel下载地址
        result.setBizData(savePath);
        return result;
    }
}
