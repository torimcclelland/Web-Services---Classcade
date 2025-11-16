import React, { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import PieChartBox from "../components/PieChartBox";
import BarChartBox from "../components/BarChartBox";
import api from "../api";
import { useProject } from "../context/ProjectContext";

import StatsStyle from "../styles/StatsStyle";

const Stats = () => {
  const { selectedProject } = useProject();
  const user = JSON.parse(localStorage.getItem("user"));

  const [timeData, setTimeData] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [memberStats, setMemberStats] = useState({ total: 0, percent: 0 });

  useEffect(() => {
    if (!selectedProject?._id) return;

    const fetchStats = async () => {
      try {
        const timeRes = await api.get(
          `/api/time-tracking/${selectedProject._id}`
        );
        const memRes = await api.get(
          `/api/project/${selectedProject._id}/members`
        );

        setTimeData(timeRes.data);
        setMembers(memRes.data);
      } catch (err) {
        console.error("Stats load error:", err);
      }
    };

    fetchStats();
  }, [selectedProject]);

  const timeByUser = members.map((m) => {
    const totalMins = timeData
      .filter((e) => e.user._id === m._id)
      .reduce((sum, e) => sum + e.minutes, 0);

    return { name: m.firstName, time: totalMins, userId: m._id };
  });

  const totalProjectMinutes = timeByUser.reduce((a, b) => a + b.time, 0);
  const formatHours = (mins) => (mins / 60).toFixed(2);

  useEffect(() => {
    if (!selectedMember) {
      setMemberStats({ total: 0, percent: 0 });
      return;
    }

    const row = timeByUser.find((x) => x.userId === selectedMember);
    const total = row?.time || 0;
    const percent = totalProjectMinutes
      ? ((total / totalProjectMinutes) * 100).toFixed(1)
      : 0;

    setMemberStats({ total, percent });
  }, [selectedMember, timeData]);

  return (
    <MainLayout>
      <h1 style={StatsStyle.title}>Project Stats</h1>

      <div style={StatsStyle.chartsWrapper}>
        <div style={StatsStyle.chartBox}>
          <PieChartBox data={timeByUser} />
        </div>
        <div style={StatsStyle.chartBox}>
          <BarChartBox data={timeByUser} />
        </div>
      </div>

      <div style={StatsStyle.card}>
        <label
          style={{ fontWeight: 600, marginBottom: "8px", display: "block" }}
        >
          Select Member:
        </label>

        <select
          style={StatsStyle.select}
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
        >
          <option value="">-- Select --</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.firstName} {m.lastName}
            </option>
          ))}
        </select>

        <p style={StatsStyle.summaryText}>
          Total time logged:{" "}
          <strong>{formatHours(memberStats.total)} hrs</strong>
        </p>

        <p style={StatsStyle.summaryText}>
          Contribution: <strong>{memberStats.percent}%</strong>
        </p>
      </div>

      <div style={StatsStyle.tableWrapper}>
        <h3 style={{ marginBottom: "1rem" }}>Time Log</h3>
        <table style={StatsStyle.table}>
          <thead>
            <tr>
              <th style={StatsStyle.th}>User</th>
              <th style={StatsStyle.th}>Task</th>
              <th style={StatsStyle.th}>Minutes</th>
              <th style={StatsStyle.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {timeData.map((e) => (
              <tr key={e._id}>
                <td style={StatsStyle.td}>
                  {e.user.firstName} {e.user.lastName}
                </td>
                <td style={StatsStyle.td}>{e.task?.name}</td>
                <td style={StatsStyle.td}>{e.minutes}</td>
                <td style={StatsStyle.td}>
                  {new Date(e.entryDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default Stats;
