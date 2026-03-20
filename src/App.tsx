import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPatients } from "./api/api";
import PatientRow from "./components/PatientRow";

type Patient = {
  id: string;
  name: string;
};

export default function App() {
  const [roleFilter, setRoleFilter] = useState("");

  const { data: patients = [], isLoading } = useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: getPatients,
  });

  if (isLoading) return <p>Loading patients...</p>;

  return (
    <div style={{ padding: "20px" }}>
      {/* 🔥 TITLE */}
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Dialysis Taskboard
      </h1>

      {/* 🔽 ROLE FILTER */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <label style={{ marginRight: "10px" }}>Filter by Role:</label>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ padding: "5px" }}
        >
          <option value="">All</option>
          <option value="nurse">Nurse</option>
          <option value="dietician">Dietician</option>
          <option value="social_worker">Social Worker</option>
        </select>
      </div>

      {/* 🧾 PATIENT LIST */}
      {patients.map((patient) => (
        <PatientRow
          key={patient.id}
          patient={patient}
          roleFilter={roleFilter} // 🔥 pass filter
        />
      ))}
    </div>
  );
}