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
DROP TABLE IF EXISTS pat_disease_history
CREATE TABLE pat_disease_history(
  `disease_history_id` varchar(50) NOT NULL COMMENT '病史ID',
  `patient_id` varchar(50) DEFAULT NUL COMMENT '患者ID（Ref: pat_patient_info.patient_id）',
  `record_date` date(50) DEFAULT NULL COMMENT '记录日期',
 `record_user_id` varchar(50) NOT NULL COMMENT '记录人Ref: sys_user_info.user_id',
 `allergic_drug_status` varchar(50) NOT NULL COMMENT '过敏药物  - 状态Y-有，N-无，U-不详,
 `allergic_drug_details` varchar(50) DEFAULT NULL COMMENT '过敏药物 - 详情 选项来自数据字典“过敏药物(AllergicDrug)”，多选'',
 `allergic_history` varchar(50) DEFAULT NULL COMMENT '过敏史',
 `present_history` varchar(50) DEFAULT NULL COMMENT '现病史',
 `cardio_vascular_history` varchar(50) DEFAULT NULL COMMENT '心血管疾病史',
 `hypertension_history` varchar(50) DEFAULT NULL COMMENT '高血压病史',
 `brain_vascular_history` varchar(50) DEFAULT NULL COMMENT '脑血管疾病史',
 `diabetes_history` varchar(50) DEFAULT NULL COMMENT '糖尿病史',

 `hepatitis_history` varchar(50) DEFAULT NULL COMMENT '肝炎病史',
 `other_history` varchar(50) DEFAULT NULL COMMENT '其他疾病',
 `family_history` varchar(50) DEFAULT NULL COMMENT '家族史',



  `create_by_` varchar(32) DEFAULT NULL COMMENT '创建人员 Ref: sys_user.id ',
  `create_time_` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by_` varchar(32) DEFAULT NULL COMMENT '修改人员 Ref: sys_user.id',
  `update_time_` datetime DEFAULT NULL COMMENT '修改时间',
  `data_status` varchar(2) DEFAULT NULL COMMENT '数据状态 0-启用，1-停用，2-删除',
  `data_sync` varchar(2) DEFAULT NULL COMMENT '数据同步状态 0-未同步，1-已同步',
  `hospital_no` varchar(32) DEFAULT NULL COMMENT '医院代码 Ref: sys_hospital.hospital_no',
  PRIMARY KEY (`disease_history_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
