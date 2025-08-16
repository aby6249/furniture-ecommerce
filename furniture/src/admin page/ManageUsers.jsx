import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      if (!Array.isArray(res.data)) {
        throw new Error("Unexpected data format");
      }
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users.", error);
    }
  };

  
  
  const toggleBlock = async (id, isBlocked) => {
    try {
      await axios.patch(`http://localhost:3000/users/${id}`, {
        isBlocked: !isBlocked,
      });
      toast.success(isBlocked ? "User unblocked" : "User blocked");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update block status",error);
    }
  };



  const toggleDelete = async (id, isDeleted) => {
    try {
      await axios.patch(`http://localhost:3000/users/${id}`, {
        isDeleted: !isDeleted,
      });
      toast.info(isDeleted ? "User restored" : "User marked as deleted");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update delete status",error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Deleted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user.id !== "001") 
            .map((user) => (
              <tr key={user.id} style={{ opacity: user.isDeleted ? 0.5 : 1 }}>
                <td>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.email}</td>
                <td>{user.isBlocked ? "Blocked" : "Active"}</td>
                <td>{user.isDeleted ? "Yes" : "No"}</td>
                <td>
                  <button
                    onClick={() => toggleBlock(user.id, user.isBlocked)}
                    disabled={user.isDeleted}
                    className="block-button"
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => toggleDelete(user.id, user.isDeleted)}
                    className={user.isDeleted ? "restore-button" : "delete-button"}
                  >
                    {user.isDeleted ? "Restore" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
