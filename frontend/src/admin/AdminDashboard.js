import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#ef4444', '#facc15', '#10b981']; // Rejected, Pending, Accepted

const AdoptionStatusChart = ({ data }) => {
  if (!data || data.length === 0) return <p>No adoption data</p>;

  return (
    <div className="bg-white p-4 rounded-xl shadow col-span-1 md:col-span-2 mt-6">
      <h2 className="text-lg font-semibold mb-4">Adoption Status Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="_id"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={entry._id} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};


const AdminDashboard = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/admin/report-summary');
        setReport(res.data);
      } catch (err) {
        console.error('Failed to load report', err);
      }
    };
    fetchReport();
  }, []);

  if (!report) return <p>Loading report...</p>;

  const { adoptions, users, animals } = report;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-6">Overview of pets, donations, adoptions and users.</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Adoptions" data={adoptions} />
        <Card title="Users" data={users} />
        <Card title="Animals" data={animals} />
      </div>
      <AdoptionStatusChart data={adoptions.statusBreakdown} />

    </div>
  );
};

const Card = ({ title, data }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <p>Total: <strong>{data.total}</strong></p>
    <p>This Year: <strong>{data.year}</strong></p>
    <p>This Month: <strong>{data.month}</strong></p>
  </div>
);

export default AdminDashboard;
