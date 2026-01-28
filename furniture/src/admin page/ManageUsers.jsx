import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ManageUsers.css";


const BASE_URL = "http://127.0.0.1:8000/api/admin";

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.access || user?.token;

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

 
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/`, {
        headers: getAuthHeaders(),
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const toggleBlock = async (id, isActive) => {
    try {
      await axios.patch(
        `${BASE_URL}/users/${id}/`,
        { is_active: !isActive },
        { headers: getAuthHeaders() }
      );

      toast.success(isActive ? "User blocked" : "User unblocked");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status");
    }
  };

  
  const softDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.patch(
        `${BASE_URL}/users/${id}/`,
        { is_active: false },
        { headers: getAuthHeaders() }
      );

      toast.success("User deleted (soft delete)");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              style={{ opacity: user.is_active ? 1 : 0.5 }}
            >
              <td>{user.id}</td>
              <td>
                {user.first_name} {user.second_name}
              </td>
              <td>{user.email}</td>
              <td>{user.is_active ? "Active" : "Blocked"}</td>

              <td>
                <button
                  className="block-button"
                  onClick={() => toggleBlock(user.id, user.is_active)}
                >
                  {user.is_active ? "Block" : "Unblock"}
                </button>

                <button
                  className="delete-button"
                  onClick={() => softDeleteUser(user.id)}
                  disabled={!user.is_active}
                >
                  Delete
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
