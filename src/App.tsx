import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthScreen from './components/AuthScreen';
import { Shield } from 'lucide-react';
import { subscribeToAllReports, subscribeToAllAlerts, updateReportStatus, createAlert } from './services/dashboardService';

export default function App() {
  const { currentUser, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen />;
  }

  // Ensure only authorities can access
  if (currentUser.role !== 'authority') {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white flex-col gap-4">
        <h2 className="text-xl font-bold text-rose-500">Access Denied</h2>
        <p>You do not have authority privileges.</p>
        <button onClick={logout} className="px-4 py-2 bg-slate-800 rounded">Logout</button>
      </div>
    );
  }

  const [reports, setReports] = React.useState<any[]>([]);
  const [alerts, setAlerts] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    if (currentUser?.role === 'authority') {
      const unsubReports = subscribeToAllReports(setReports);
      const unsubAlerts = subscribeToAllAlerts(setAlerts);
      return () => {
        unsubReports();
        unsubAlerts();
      };
    }
  }, [currentUser]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateReportStatus(id, status);
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleCreateAlert = async () => {
    const title = prompt('Enter alert title:');
    if (!title) return;
    const description = prompt('Enter description:');
    const severity = prompt('Enter severity (critical, warning, safe):', 'warning');
    
    try {
      await createAlert({
        title,
        description,
        severity,
        createdBy: currentUser.uid,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to create alert');
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      <aside className="w-64 border-r border-slate-800 bg-slate-900 p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-8 text-amber-500 font-black text-xl">
          <Shield className="w-6 h-6" /> EvacNOW
        </div>
        <div className="flex flex-col gap-2">
          <div className="px-3 py-2 bg-amber-600/20 text-amber-500 rounded font-semibold cursor-pointer">
            Dashboard
          </div>
        </div>
        <div className="mt-auto">
          <button onClick={logout} className="w-full text-left px-3 py-2 text-slate-400 hover:text-white transition">
            Logout
          </button>
        </div>
      </aside>
      
      <main className="flex-1 overflow-auto p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Authority Dashboard</h1>
            <p className="text-slate-400">Monitor and manage emergency reports.</p>
          </div>
          <button onClick={handleCreateAlert} className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded font-bold">
            + Broadcast Alert
          </button>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-slate-400 font-semibold mb-2">Total Reports</h3>
            <div className="text-3xl font-black text-white">{reports.length}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-slate-400 font-semibold mb-2">Active Alerts</h3>
            <div className="text-3xl font-black text-rose-400">{alerts.filter(a => a.isActive).length}</div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-4">Incoming Reports</h2>
        <div className="space-y-4">
          {reports.length === 0 ? (
            <p className="text-slate-500">No reports found.</p>
          ) : (
            reports.map(report => (
              <div key={report.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-slate-800 px-2 py-1 rounded text-xs font-bold uppercase text-slate-300">
                      {report.severity || 'Unknown'}
                    </span>
                    <span className="text-sm font-semibold text-white">{report.location}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{report.description}</p>
                  <div className="text-xs text-slate-500 mt-2">
                    Reported by {report.reporter || report.citizenId} • {report.status || 'Pending'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleUpdateStatus(report.id, 'Verified')}
                    className="px-3 py-1 bg-emerald-600/20 text-emerald-400 border border-emerald-600/50 hover:bg-emerald-600/30 rounded text-sm font-bold"
                  >
                    Verify
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(report.id, 'Resolved')}
                    className="px-3 py-1 bg-sky-600/20 text-sky-400 border border-sky-600/50 hover:bg-sky-600/30 rounded text-sm font-bold"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
