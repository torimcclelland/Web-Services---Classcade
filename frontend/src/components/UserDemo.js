import React, { useState } from "react";
import api from "../api";

export default function UserDemo() {
  const [user, setUser] = useState({});
  const [id, setId] = useState("");

  const getUser = async () => {
    const res = await api.get(`/api/user/${id}`);
    setUser(res.data);
  };

  const createUser = async () => {
    const res = await api.post("/api/user/createuser", {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      username: "johndoe",
      password: "12345678",
    });
    alert(`User created with ID: ${res.data._id}`);
  };

  return (
    <div>
      <h2>User Demo</h2>
      <input
        placeholder="User ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={getUser}>Get User</button>
      <button onClick={createUser}>Create Sample User</button>

      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}