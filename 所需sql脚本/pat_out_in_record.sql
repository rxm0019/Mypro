/*
Navicat MySQL Data Transfer

Source Server         : hemodialysis
Source Server Version : 50717
Source Host           : 120.76.219.25:3306
Source Database       : dis_db

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2020-07-24 09:33:57
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for pat_out_in_record
-- ----------------------------
DROP TABLE IF EXISTS `pat_out_in_record`;
CREATE TABLE `pat_out_in_record` (
  `out_in_id` varchar(35) NOT NULL COMMENT 'ID	UUID',
  `patient_id` varchar(35) DEFAULT NULL COMMENT '患者ID	Ref: pat_patient_info.patient_id',
  `out_in_type` varchar(2) NOT NULL COMMENT '转归类型	0-转出，1-转入',
  `out_in_reason` varchar(50) DEFAULT NULL COMMENT '转入转出原因 (选项来自数据字典“转入原因(InReason)”或“转出原因(OutReason)”，单选)',
  `out_in_datetime` date NOT NULL COMMENT '转归日期',
  `doctor_remarks` text COMMENT '医生备注',
  `nurse_remarks` text COMMENT '护士备注',
  `operate_remarks` text COMMENT '运营备注',
  `remarks` text COMMENT '记录备注',
  `create_by_` varchar(32) DEFAULT NULL COMMENT '创建人员 Ref: sys_user.id',
  `create_time_` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by_` varchar(32) DEFAULT NULL COMMENT '修改人员 Ref: sys_user.id',
  `update_time_` datetime DEFAULT NULL COMMENT '修改时间',
  `data_status` varchar(1) DEFAULT NULL COMMENT '数据状态 0-启用，1-停用，2-删除',
  `data_sync` varchar(1) DEFAULT NULL COMMENT '数据同步状态 0-未同步，1-已同步',
  `hospital_no` varchar(3) DEFAULT NULL COMMENT '医院代码 Ref: sys_hospital.hospital_no',
  PRIMARY KEY (`out_in_id`),
  UNIQUE KEY `out_in_datetime` (`out_in_datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
