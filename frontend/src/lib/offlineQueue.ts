// Offline IndexedDB Queue for intermittent internet connectivity in Tier 2/3 coaching institutes
export interface QueuedSubmission {
  id: string;
  type: 'omr_scan' | 'manual_attendance' | 'review_fix';
  payload: any;
  timestamp: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number;
}

const DB_NAME = 'intelliprivart_offline_db';
const STORE_NAME = 'submission_queue';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in current environment'));
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function enqueueOfflineAction(type: QueuedSubmission['type'], payload: any): Promise<QueuedSubmission> {
  const item: QueuedSubmission = {
    id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type,
    payload,
    timestamp: Date.now(),
    status: 'pending',
    retryCount: 0,
  };

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.add(item);
      req.onsuccess = () => resolve(item);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    // Fallback to localStorage if indexedDB fails
    const local = JSON.parse(localStorage.getItem('offline_queue') || '[]');
    local.push(item);
    localStorage.setItem('offline_queue', JSON.stringify(local));
    return item;
  }
}

export async function getPendingOfflineActions(): Promise<QueuedSubmission[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    return JSON.parse(localStorage.getItem('offline_queue') || '[]');
  }
}

export async function removeOfflineAction(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    const local = JSON.parse(localStorage.getItem('offline_queue') || '[]').filter((x: any) => x.id !== id);
    localStorage.setItem('offline_queue', JSON.stringify(local));
  }
}
