"use client"

import { useState } from "react";

const TeamTable = () => {
  const [team, setTeam] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const addMember = () => {
    if (!name || !role) {
      alert("Please enter both name and role.");
      return;
    }

    setTeam([...team, { id: team.length + 1, name, role }]);
    setName(""); // Clear input fields
    setRole("");
  };

  const removeMember = (id) => {
    setTeam(team.filter((member) => member.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Team Management</h1>

      {/* Input Form */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={addMember} style={{ padding: "5px 10px" }}>
          Add Member
        </button>
      </div>

      {/* Team Table */}
      {team.length > 0 ? (
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.map((member) => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>{member.name}</td>
                <td>{member.role}</td>
                <td>
                  <button onClick={() => removeMember(member.id)} style={{ padding: "5px 10px" }}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No team members yet. Add some above!</p>
      )}
    </div>
  );
};

export default TeamTable;
