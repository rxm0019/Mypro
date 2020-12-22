/*
Navicat MySQL Data Transfer

Source Server         : hemodialysis
Source Server Version : 50717
Source Host           : 120.76.219.25:3306
Source Database       : dis_db

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2020-07-24 09:37:11
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for dia_unusual_record
-- ----------------------------
DROP TABLE IF EXISTS `dia_unusual_record`;
CREATE TABLE `dia_unusual_record` (
  `unusual_record_id` varchar(35) NOT NULL COMMENT 'ID	UUID',
  `dia_record_id` varchar(35) NOT NULL COMMENT '透析记录id	Ref:dia_record',
  `unusual_details` varchar(2000) DEFAULT NULL COMMENT '病症及体征',
  `handle_details` varchar(2000) DEFAULT NULL COMMENT '处理详情',
  `create_by_` varchar(32) DEFAULT NULL COMMENT '建立人员（Ref: sys_user_info）',
  `create_time_` datetime DEFAULT NULL COMMENT '建立日期',
  `update_by_` varchar(32) DEFAULT NULL COMMENT '修改人员',
  `update_time_` datetime DEFAULT NULL COMMENT '修改日期',
  `data_status` varchar(2) DEFAULT NULL COMMENT '数据状态（0-启用，1-停用，2-删除）',
  `data_sync` varchar(2) DEFAULT NULL COMMENT '数据同步状态',
  `hospital_no` varchar(32) DEFAULT NULL COMMENT '医院代码（Ref: sys_hospital.hospital_no）',
  PRIMARY KEY (`unusual_record_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
