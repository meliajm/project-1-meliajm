package com.revature.daos;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import com.revature.models.userRole;
import com.revature.utils.ConnectionUtility;

public class UserRoleDAO implements IUserRoleDAO {
	
	@Override
	public userRole findByID(int id) {
		try(Connection conn = ConnectionUtility.getConnection()) {
			String sql = "SELECT * FROM users u JOIN user_roles ur ON u.user_role_id = ur.user_role_id WHERE u.user_id " + id+";";
			Statement statement = conn.createStatement();
			ResultSet result = statement.executeQuery(sql);
			if (result.next()) {
				userRole ur = new userRole();
				ur.setUserRoleID(result.getInt("user_role_id")); 
				ur.setUserRole(result.getString("user_role"));
				return ur;
			} else {
				return null;
			}
		} catch(SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

}
