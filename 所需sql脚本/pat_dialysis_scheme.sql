/*
Navicat MySQL Data Transfer

Source Server         : hemodialysis
Source Server Version : 50717
Source Host           : 120.76.219.25:3306
Source Database       : dis_db

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2020-07-24 09:33:42
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for pat_dialysis_scheme
-- ----------------------------
DROP TABLE IF EXISTS `pat_dialysis_scheme`;
CREATE TABLE `pat_dialysis_scheme` (
  `dialysis_scheme_id` varchar(35) NOT NULL COMMENT '透析方案ID (hospital_no + UUID)',
  `patient_id` varchar(35) CHARACTER SET utf8 NOT NULL COMMENT '患者ID (Ref: pat_patient_info.patient_id)',
  `dialysis_mode` varchar(50) NOT NULL COMMENT '透析方式	选项来自数据字典“透析方式(DialysisMode)”，单选',
  `dialysis_frequency` varchar(50) NOT NULL COMMENT '透析频次	选项来自数据字典“透析频次(DialysisFrequency)”，单选',
  `scheme_date` date DEFAULT NULL COMMENT '制定时间',
  `scheme_user_id` varchar(32) DEFAULT NULL COMMENT '制定人	Ref: sys_user_info.user_id',
  `dialyzer` varchar(50) DEFAULT NULL COMMENT '透析器	选项来自数据字典“透析器(Dialyzer)”，单选',
  `irrigator` varchar(50) DEFAULT NULL COMMENT '灌流器	选项来自数据字典“灌流器(Irrigator)”，单选',
  `hemofilter` varchar(50) DEFAULT NULL COMMENT '血滤器	选项来自数据字典“透析器(Dialyzer)”，单选',
  `dialysis_hours` decimal(5,2) DEFAULT NULL COMMENT '透析时长	取值范围(0, 24]，可输入两位小数',
  `blood_flow` decimal(5,0) DEFAULT NULL COMMENT '血流量	取值范围(0, 10000]，整数',
  `anticoagulant` varchar(50) DEFAULT NULL COMMENT '抗凝剂	选项来自数据字典“抗凝剂(Anticoagulant)”，单选',
  `first_dosage` decimal(7,2) DEFAULT NULL COMMENT '首推剂量	取值范围(0, 10000]，可输入两位小数',
  `first_dosage_unit` varchar(50) DEFAULT NULL COMMENT '首推剂量单位	选项来自数据字典“肝素单位(HeparinUnit)”，单选',
  `keep_dosage` decimal(7,2) DEFAULT NULL COMMENT '维持剂量	取值范围(0, 10000]，可输入两位小数',
  `keep_dosage_unit` varchar(50) DEFAULT NULL COMMENT '维持剂量单位	选项来自数据字典“肝素单位(HeparinUnit)”，单选',
  `total_dosage` decimal(7,2) DEFAULT NULL COMMENT '总剂量	取值范围(0, 10000]，可输入两位小数',
  `total_dosage_unit` varchar(50) DEFAULT NULL COMMENT '总剂量单位	选项来自数据字典“肝素单位(HeparinUnit)”，单选',
  `substitute_mode` varchar(50) DEFAULT NULL COMMENT '置换方式	选项来自数据字典“透析置换方式(SubstituteMode)”，单选',
  `replacement_fluid_total` decimal(5,2) DEFAULT NULL COMMENT '置换液总量	取值范围(0, 100]，可输入两位小数',
  `replacement_fluid_flow_rate` decimal(5,0) DEFAULT NULL COMMENT '置换液流速	取值范围(0, 10000]，整数',
  `replacement_fluid_flow` decimal(5,0) DEFAULT NULL COMMENT '透析液流量	取值范围(0, 10000]，整数',
  `dialysate_temperature` decimal(5,2) DEFAULT NULL COMMENT '透析液温度	取值范围[35, 42]，可输入两位小数',
  `dialysate_concentration_k` decimal(7,2) DEFAULT NULL COMMENT '透析液浓度-K	取值范围(0, 10000]，整数可输入两位小数',
  `dialysate_concentration_ca` decimal(7,2) DEFAULT NULL COMMENT '透析液浓度-Ca	取值范围(0, 10000]，整数可输入两位小数',
  `dialysate_concentration_na` decimal(7,2) DEFAULT NULL COMMENT '透析液浓度-Na	取值范围(0, 10000]，整数可输入两位小数',
  `dialysate_concentration_hco3` decimal(7,2) DEFAULT NULL COMMENT '透析液浓度-HCO3	取值范围(0, 10000]，整数可输入两位小数',
  `remarks` text COMMENT '备注',
  `create_by_` varchar(32) DEFAULT NULL COMMENT '创建人员	Ref: sys_user_info',
  `create_time_` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by_` varchar(32) DEFAULT NULL COMMENT '修改人员	Ref: sys_user_info',
  `update_time_` datetime DEFAULT NULL COMMENT '修改时间',
  `data_status` varchar(2) DEFAULT NULL COMMENT '数据状态	0-启用，1-停用，2-删除',
  `data_sync` varchar(2) DEFAULT NULL COMMENT '数据同步状态	0-未同步，1-已同步',
  `hospital_no` varchar(32) DEFAULT NULL COMMENT '医院代码	Ref: sys_hospital.hospital_no',
  PRIMARY KEY (`dialysis_scheme_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
