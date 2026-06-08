-- myAmast MySQL Database Schema
-- Run this script to create the views for the database

-- Create user view
CREATE OR REPLACE VIEW vw_users AS
SELECT 
    U.id,
    U.first_name as firstName,
    U.last_name as lastName,
    U.ic_number as icNumber,
    U.ic_type_id as icTypeId,
    (SELECT SD.data_text FROM static_data AS SD WHERE SD.data_key ="IC_TYPE" AND SD.data_value = U.ic_type_id) AS icType,
    U.email,
    U.avatar,
    U.gender_id as genderId,
    (SELECT SD.data_text FROM static_data AS SD WHERE SD.data_key ="GENDER" AND SD.data_value = U.gender_id) AS gender,
    U.password,
    U.password_token as passwordToken,
    U.is_email_verified as isEmailVerified,
    U.is_locked_out as isLockedOut,
    U.created_date as createdDate,
    U.created_by_id as createdById,
    (SELECT CONCAT(U2.first_name, " ", U2.last_name) FROM Users U2 WHERE U2.id = U.created_by_id) AS createdBy,
    U.updated_date as updatedDate,
    U.updated_by_id as updatedById,
    U.record_status as recordStatusId,
    (SELECT CONCAT(U3.first_name, " ", U3.last_name) FROM users U3 WHERE  U3.id = U.updated_by_id) AS updatedBy,
    (SELECT SD.data_text FROM static_data AS SD WHERE SD.data_key ="RECORD_STATUS" AND SD.data_value = U.record_status) AS recordStatus
FROM users AS U
ORDER BY
U.first_name, U.last_name;

-- Create user permission view
CREATE OR REPLACE VIEW vw_user_permission AS
SELECT UP.id, SR.id as roleId, 
    SR.role_name as roleName, 
    SR.is_administrator as isAdministrator,
    U.id as userId, 
    CONCAT(U.first_name,' ',U.last_name) as userName, 
    UP.created_date as createdDate, 
    UP.record_status as recordStatusId
FROM system_role as SR
LEFT JOIN user_permission UP ON UP.role_id = SR.id
LEFT JOIN Users as U ON UP.user_id = U.id
ORDER BY U.first_name, U.last_name, SR.role_name;

-- Create navigation menu view
CREATE OR REPLACE VIEW vw_navigation_menus AS
SELECT DISTINCT
    NM.id,
    NM.created_date as createdDate,
    NM.created_by_id as createdById,
    NM.updated_date as updatedDate,
    NM.updated_by_id as updatedById,
    NM.record_status as recordStatusId,
    NM.parent_id as parentId,
    (SELECT NM2.menu_text FROM navigation_menu As NM2 WHERE NM2.id = NM.parent_id) as parentMenu, 
    NM.menu_text as menuText,
    NM.menu_description as menuDescription,
    NM.url,
    NM.icon,
    NM.order_index as orderIndex
FROM navigation_menu AS NM
ORDER BY orderIndex;

-- Create navigation menu roles view
CREATE OR REPLACE VIEW vw_navigation_menu_roles AS
SELECT NMR.menu_id as menuId, 
    NM.menu_text as menuText, 
    NM.parent_id as parentId,
    NM.order_index as orderIndex,
    (SELECT NM2.menu_text FROM navigation_menu As NM2 WHERE NM2.id = NM.parent_id) as parentMenu, 
    NM.url, 
    NM.icon, 
    NMR.role_id as roleId, 
    SR.role_name as roleName,
    NMR.created_by_id as createdBy,
    NMR.created_date as createdDate,
    NMR.record_status as recordStatusId
FROM navigation_menu_role AS NMR
INNER JOIN system_role SR ON NMR.role_id = SR.id
INNER JOIN navigation_menu NM ON NMR.menu_id = NM.id;

-- Create navigation menu users view
CREATE OR REPLACE VIEW vw_navigation_menu_users AS
SELECT DISTINCT
    NMR.menuId, 
    NMR.menuText, 
    NMR.parentId,
    NMR.parentMenu, 
    NMR.roleId, 
    NMR.url, 
    NMR.icon, 
    NMR.orderIndex,
    UP.roleName, 
    UP.userId, 
    UP.userName 
FROM vw_navigation_menu_roles NMR
INNER JOIN vw_user_permission UP ON NMR.roleId = UP.roleId
ORDER BY orderIndex;
