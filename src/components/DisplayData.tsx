import { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';

type FirestoreItem = {
  id: string;
  title: string;
  details: string;
  userId?: string;
};

const DisplayData = () => {
  const { user } = useAuth();

  const [documents, setDocuments] = useState<FirestoreItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDetails, setEditDetails] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'documents'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const nextDocuments = snapshot.docs.map((itemDoc) => ({
          id: itemDoc.id,
          ...(itemDoc.data() as DocumentData),
        })) as FirestoreItem[];

        setDocuments(nextDocuments);
      },
      () => setError('Unable to load Firestore documents.')
    );

    return () => unsubscribe();
  }, []);

  const startEditing = (item: FirestoreItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDetails(item.details);
    setError(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDetails('');
  };

  const handleUpdate = async (id: string) => {
    const trimmedTitle = editTitle.trim();
    const trimmedDetails = editDetails.trim();

    if (!trimmedTitle || !trimmedDetails) {
      setError('Title and details are required.');
      return;
    }

    try {
      await updateDoc(doc(db, 'documents', id), {
        title: trimmedTitle,
        details: trimmedDetails,
      });

      cancelEditing();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update document.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'documents', id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete document.');
    }
  };

  if (error) return <p className="auth-error">{error}</p>;

  return (
    <div className="page-shell" style={{ marginTop: '1rem' }}>
      <h3>Saved Documents</h3>

      {documents.length === 0 ? (
        <p>No documents yet.</p>
      ) : (
        <ul>
          {documents.map((documentItem) => {
            const isOwner = user?.uid === documentItem.userId;
            const isEditing = editingId === documentItem.id;

            return (
              <li key={documentItem.id} style={{ marginBottom: '1rem' }}>
                {isEditing ? (
                  <div className="auth-form">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                    />
                    <textarea
                      value={editDetails}
                      onChange={(event) => setEditDetails(event.target.value)}
                      rows={3}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="button" onClick={() => handleUpdate(documentItem.id)}>
                        Save Update
                      </button>
                      <button type="button" onClick={cancelEditing}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <strong>{documentItem.title}</strong>
                    <div>{documentItem.details}</div>

                    {isOwner && (
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button type="button" onClick={() => startEditing(documentItem)}>
                          Edit
                        </button>
                        <button type="button" onClick={() => handleDelete(documentItem.id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DisplayData;