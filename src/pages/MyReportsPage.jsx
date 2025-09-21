import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

export default function MyReportsPage() {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyReports = async () => {
      if (!currentUser) return;
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch('http://localhost:5000/reports/my-reports', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Could not fetch your reports.");
        const data = await response.json();
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMyReports();
  }, [currentUser]);

  const getStatusChip = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-6">My Submitted Reports</h2>
      {reports.length === 0 ? (
        <div className="text-center text-muted bg-white p-8 rounded-lg border">
          <p>You haven't submitted any reports yet.</p>
          <Link to="/report" className="text-cyansoft-400 hover:underline mt-2 inline-block">Submit your first report</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white rounded-lg p-4 border shadow-sm flex justify-between items-center">
              <div>
                <p className="font-bold">{report.hazardType}</p>
                <p className="text-sm text-muted mt-1">{report.description}</p>
                <p className="text-xs text-gray-400 mt-2">Submitted on: {new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
              <div>{getStatusChip(report.status)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}