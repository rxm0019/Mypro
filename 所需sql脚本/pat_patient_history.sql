/*
Navicat MySQL Data Transfer

Source Server         : hemodialysis
Source Server Version : 50717
Source Host           : 120.76.219.25:3306
Source Database       : dis_db

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2020-07-24 10:02:28
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for pat_patient_history
-- ----------------------------
DROP TABLE IF EXISTS `pat_patient_history`;
CREATE TABLE `pat_patient_history` (
  `patient_history_id` varchar(35) NOT NULL COMMENT '基本信息历史ID',
  `patient_id` varchar(35) NOT NULL COMMENT '患者ID（Ref: pat_patient_info.patient_id）',
  `customer_type` varchar(50) DEFAULT NULL COMMENT '客户类型（选项来自数据字典“客户类型(CustomerType)”，单选）',
  `dialysis_total_frequency` varchar(50) DEFAULT NULL COMMENT '透析总频次（选项来自数据字典“透析频次(DialysisFrequency)”，单选）',
  `dry_weight` decimal(5,2) DEFAULT NULL COMMENT '干体重（取值范围(0, 200]，可输入两位小数）',
  `dry_weight_adjust` decimal(5,2) DEFAULT NULL COMMENT '干体重调整值（取值范围[-200, 200]，可输入两位小数。正数表示上调，负数表示下调。）',
  `additional_weight` decimal(5,2) DEFAULT NULL COMMENT '附加体重（取值范围[-200, 200]，可输入两位小数。正数表示上调，负数表示下调。）',
  `infection_status` varchar(1000) DEFAULT NULL COMMENT '感染状况（选项来自数据字典“感染状况(InfectionStatus)”，多选）',
  `create_by_` varchar(32) DEFAULT NULL COMMENT '创建人员 Ref: sys_user.id ',
  `create_time_` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by_` varchar(32) DEFAULT NULL COMMENT '修改人员 Ref: sys_user.id',
  `update_time_` datetime DEFAULT NULL COMMENT '修改时间',
  `data_status` varchar(2) DEFAULT NULL COMMENT '数据状态 0-启用，1-停用，2-删除',
  `data_sync` varchar(2) DEFAULT NULL COMMENT '数据同步状态 0-未同步，1-已同步',
  `hospital_no` varchar(32) DEFAULT NULL COMMENT '医院代码 Ref: sys_hospital.hospital_no',
  PRIMARY KEY (`patient_history_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
