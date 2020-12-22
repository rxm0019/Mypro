package com.hongster.dis.system.dialysis;

import com.github.pagehelper.PageInfo;
import com.hongster.dis.web.controller.system.BaseController;
import com.hemodialysis.common.exception.InvalidParamException;
import com.hemodialysis.common.sys.Result;
import com.hongster.dis.common.model.dialysis.DiaSummary;
import com.hongster.dis.common.model.dialysis.DiaSummaryExample;
import com.hongster.dis.common.model.dialysis.ext.DiaSummaryEdit;
import com.hongster.dis.common.model.dialysis.ext.DiaSummaryList;
import com.hongster.dis.system.dialysis.IDiaSummaryService;
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
 * DiaSummary的控制器业务处理页面
 */

@Controller
@RequestMapping(value = "diaSummary")
public class DiaSummaryController extends BaseController{
    public static final Logger logger = LoggerFactory.getLogger(DiaSummaryController.class);

    @Autowired
    private IDiaSummaryService iDiaSummaryService;

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
    @RequestMapping(value = "/diaSummaryList",method = RequestMethod.GET)
    public String diaSummaryList(ModelMap model){
        //此处可返回数据页面预处理...
        return "/dialysis/diaSummaryList";
    }

    /**
     * 编辑页面跳转
     * 原理同上
     * @param model
     * @return
     */
    @RequestMapping(value = "/diaSummaryEdit",method = RequestMethod.GET)
    public String diaSummaryEdit(ModelMap model){
        //此处可返回数据页面预处理...
        return "/dialysis/diaSummaryEdit";
    }

    /**
     * 获取全部列表，通常用于下拉框
     * @param request
     * @param diaSummary
     * @return
     */
    @RequestMapping(value = "/getLists.do", method = RequestMethod.POST)
    @ResponseBody
    public Result getLists(HttpServletRequest request,DiaSummary diaSummary){
        Result result = new Result();
        DiaSummaryExample example = new DiaSummaryExample();
        DiaSummaryExample.Criteria criteria = example.createCriteria();
        List<DiaSummary> list=iDiaSummaryService.selectByExample(example);
        result.setBizData(list);
        return result;
    }

    /**
     * 获取分页列表，用于页面的列表查询
     * @param request
     * @param diaSummaryList
     * @return
     */
    @RequestMapping(value = "/list.do", method = RequestMethod.POST)
    @ResponseBody
    public PageInfo list(HttpServletRequest request,  DiaSummaryList diaSummaryList){
        Result result = new Result();
        PageInfo pageInfo=iDiaSummaryService.list(diaSummaryList);
        return pageInfo;
    }

    /**
     * 获取实体信息
     * @param request
     * @param diaSummaryEdit
     * @return
     */
    @RequestMapping(value = "/getInfo.do", method = RequestMethod.POST)
    @ResponseBody
    public Result getInfo(HttpServletRequest request,  DiaSummaryEdit diaSummaryEdit){
        Result result = new Result();
        if(ToolUtil.isEmpty(diaSummaryEdit.getSummaryId())){
            throw new InvalidParamException(MessageHelper.ID_ISNULL);  //抛出异常
        }
        DiaSummaryEdit diaSummary=iDiaSummaryService.getInfo(diaSummaryEdit.getSummaryId());
        result.setBizData(diaSummary);
        return result;
    }

    /**
     * 保存实体信息
     * @param request
     * @param diaSummaryEdit
     * @return
     */
    @SystemLog("保存实体信息")
    @RequestMapping(value = "/saveOrEdit.do", method = RequestMethod.POST)
    @ResponseBody
    public Result saveOrEdit(HttpServletRequest request,  DiaSummaryEdit diaSummaryEdit){
        Result result = new Result();
        if(diaSummaryEdit==null){
            throw new InvalidParamException(MessageHelper.MODEL_ISNULL);  //抛出异常
        }
        int code=iDiaSummaryService.saveOrEdit(diaSummaryEdit);
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
        int code=iDiaSummaryService.delete(ids);
        result.setBizData(code);
        return result;
    }

    /**
     * 导出excel
     * @param request
     * @param excelConfig excel配置
     * @param diaSummaryList
     * @return
     */
    @SystemLog("导出excel")
    @RequestMapping(value = "/exportExcel.do", method = RequestMethod.POST)
    @ResponseBody
    public Result exportExcel(HttpServletRequest request, String excelConfig,DiaSummaryList diaSummaryList){
        Result result = new Result();
        if(ToolUtil.isEmpty(excelConfig)){
            throw new InvalidParamException("excel配置不能为空,生成excel失败");  //抛出异常
        }
        Gson gson = new Gson();
        List<ExcelDefaultEntity> excelHeads = gson.fromJson(excelConfig,
            new TypeToken<List<ExcelDefaultEntity>>(){}.getType());//把JSON字符串转为对象
        //获取全部结果列表
        List<DiaSummaryList> list=iDiaSummaryService.listAll(diaSummaryList);
        //定义excel的结果变量
        List<Map<String, Object>> excelData = new ArrayList<>();
        if(list!=null&&list.size()>0){
        for (DiaSummaryList dataList:list) {
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
