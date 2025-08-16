import React from "react";

export default function UserPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {user?.firstName}</h1>
      <p>This is the user dashboard.</p>
    </div>
  );
}
