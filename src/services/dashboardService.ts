import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export function subscribeToAllReports(callback: (reports: any[]) => void) {
  const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(reports);
  });
}

export function subscribeToAllAlerts(callback: (alerts: any[]) => void) {
  const q = query(collection(db, 'alerts'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(alerts);
  });
}

export async function updateReportStatus(reportId: string, status: string) {
  const reportRef = doc(db, 'reports', reportId);
  return updateDoc(reportRef, {
    status,
    updatedAt: serverTimestamp()
  });
}

export async function createAlert(alertData: any) {
  return addDoc(collection(db, 'alerts'), {
    ...alertData,
    isActive: true,
    createdAt: serverTimestamp()
  });
}
