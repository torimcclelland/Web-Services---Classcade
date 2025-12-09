import React, { useEffect, useMemo, useState } from "react";
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
  const [tasks, setTasks] = useState([]);

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
        const tasksRes = await api.get(`/api/task/${selectedProject._id}`);

        setTimeData(timeRes.data);
        setMembers(memRes.data);
        setTasks(tasksRes.data || []);
      } catch (err) {
        console.error("Stats load error:", err);
      }
    };

    fetchStats();
  }, [selectedProject]);

  const timeByUser = useMemo(() => {
    return members.map((m) => {
      const totalMins = timeData
        .filter((e) => e.user._id === m._id)
        .reduce((sum, e) => sum + e.minutes, 0);

      return { name: m.firstName, time: totalMins, userId: m._id };
    });
  }, [members, timeData]);

  const totalProjectMinutes = timeByUser.reduce((a, b) => a + b.time, 0);
  const formatHours = (mins) => (mins / 60).toFixed(2);

  const taskStats = (() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Done").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const notStarted = tasks.filter((t) => t.status === "Not Started").length;
    const underReview = tasks.filter((t) => t.status === "Under Review").length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      if (Number.isNaN(due.getTime())) return false;
      return due < today && t.status !== "Done";
    }).length;

    const upcoming = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      if (Number.isNaN(due.getTime())) return false;
      const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7 && t.status !== "Done";
    }).length;

    const priorityCounts = tasks.reduce(
      (acc, t) => {
        const p = t.priority || "Medium";
        acc[p] = (acc[p] || 0) + 1;
        return acc;
      },
      { High: 0, Medium: 0, Low: 0 }
    );

    return {
      total,
      completed,
      inProgress,
      notStarted,
      underReview,
      overdue,
      upcoming,
      priorityCounts,
      completionPct: total ? Math.round((completed / total) * 100) : 0,
    };
  })();

  const priorityStatusMatrix = (() => {
    const statuses = ["Not Started", "In Progress", "Under Review", "Done"];
    const priorities = ["High", "Medium", "Low"];
    const matrix = {};
    statuses.forEach((s) => {
      matrix[s] = {};
      priorities.forEach((p) => (matrix[s][p] = 0));
    });
    tasks.forEach((t) => {
      const s = statuses.includes(t.status) ? t.status : "Not Started";
      const p = priorities.includes(t.priority) ? t.priority : "Medium";
      matrix[s][p] += 1;
    });
    return { matrix, statuses, priorities };
  })();

  const memberLoad = (() => {
    const list = members.map((m) => {
      const assigned = tasks.filter(
        (t) => (t.assignedTo?._id || t.assignedTo)?.toString() === m._id
      );
      const total = assigned.length;
      const completed = assigned.filter((t) => t.status === "Done").length;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const overdue = assigned.filter((t) => {
        if (!t.dueDate || t.status === "Done") return false;
        const due = new Date(t.dueDate);
        if (Number.isNaN(due.getTime())) return false;
        return due < today;
      }).length;
      return {
        id: m._id,
        name:
          `${m.firstName || ""} ${m.lastName || ""}`.trim() ||
          m.username ||
          m.email ||
          "Member",
        total,
        completed,
        overdue,
      };
    });
    return list.sort((a, b) => b.total - a.total);
  })();

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
  }, [selectedMember, timeByUser, totalProjectMinutes]);

  return (
    <MainLayout>
      <h1 style={StatsStyle.title}>Project Stats</h1>

      {timeData.length === 0 ? (
        <div style={StatsStyle.emptyState}>
          <h2 style={StatsStyle.emptyTitle}>
            You haven't yet tracked any time
          </h2>
          <p style={StatsStyle.emptyText}>
            Add tasks and record their time to see stats populated here!
          </p>
        </div>
      ) : (
        <>
          <div style={StatsStyle.metricsGrid}>
            <div style={StatsStyle.metricCard}>
              <div style={StatsStyle.metricLabel}>Completion</div>
              <div style={StatsStyle.metricValue}>
                {taskStats.completionPct}%
              </div>
              <div style={StatsStyle.metricSub}>
                Done: {taskStats.completed} / {taskStats.total || 0}
              </div>
            </div>
            <div style={StatsStyle.metricCard}>
              <div style={StatsStyle.metricLabel}>Due Soon (7d)</div>
              <div style={StatsStyle.metricValue}>{taskStats.upcoming}</div>
              <div style={StatsStyle.metricSub}>
                Overdue: {taskStats.overdue}
              </div>
            </div>
            <div style={StatsStyle.metricCard}>
              <div style={StatsStyle.metricLabel}>Priority Mix</div>
              <div style={StatsStyle.metricChips}>
                <span
                  style={{
                    ...StatsStyle.metricChip,
                    backgroundColor: "#fee2e2",
                    color: "#b91c1c",
                  }}
                >
                  High: {taskStats.priorityCounts.High || 0}
                </span>
                <span
                  style={{
                    ...StatsStyle.metricChip,
                    backgroundColor: "#fef3c7",
                    color: "#92400e",
                  }}
                >
                  Med: {taskStats.priorityCounts.Medium || 0}
                </span>
                <span
                  style={{
                    ...StatsStyle.metricChip,
                    backgroundColor: "#d1fae5",
                    color: "#065f46",
                  }}
                >
                  Low: {taskStats.priorityCounts.Low || 0}
                </span>
              </div>
            </div>
            <div style={StatsStyle.metricCard}>
              <div style={StatsStyle.metricLabel}>Status Spread</div>
              <div style={StatsStyle.metricSub}>
                Not Started: {taskStats.notStarted}
              </div>
              <div style={StatsStyle.metricSub}>
                In Progress: {taskStats.inProgress}
              </div>
              <div style={StatsStyle.metricSub}>
                Under Review: {taskStats.underReview}
              </div>
            </div>
          </div>

          <div style={StatsStyle.splitGrid}>
            <div style={StatsStyle.metricCard}>
              <div style={StatsStyle.sectionTitle}>Priority vs Status</div>
              <div style={StatsStyle.matrix}>
                <div style={StatsStyle.matrixHeader}>
                  <div />
                  {priorityStatusMatrix.priorities.map((p) => (
                    <div key={p}>{p}</div>
                  ))}
                </div>
                {priorityStatusMatrix.statuses.map((s) => (
                  <div key={s} style={StatsStyle.matrixRow}>
                    <div style={StatsStyle.matrixLabel}>{s}</div>
                    {priorityStatusMatrix.priorities.map((p) => (
                      <div key={p} style={StatsStyle.matrixCell}>
                        {priorityStatusMatrix.matrix[s][p]}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div style={StatsStyle.metricCard}>
              <div style={StatsStyle.sectionTitle}>Team Workload</div>
              <div style={StatsStyle.memberGrid}>
                {memberLoad.map((m) => (
                  <div key={m.id} style={StatsStyle.memberCard}>
                    <div style={StatsStyle.memberName}>{m.name}</div>
                    <div style={StatsStyle.memberStats}>
                      <span>Total: {m.total}</span>
                      <span>Done: {m.completed}</span>
                      <span style={{ color: "#b91c1c" }}>
                        Overdue: {m.overdue}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={StatsStyle.chartsWrapper}>
            <div style={StatsStyle.chartBox}>
              <div style={StatsStyle.sectionTitle}>Time by member (share)</div>
              <PieChartBox data={timeByUser} />
            </div>
            <div style={StatsStyle.chartBox}>
              <div style={StatsStyle.sectionTitle}>
                Time by member (minutes)
              </div>
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
        </>
      )}
    </MainLayout>
  );
};

export default Stats;
