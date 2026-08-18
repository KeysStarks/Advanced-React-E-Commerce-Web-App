import { useEffect, useState, type FormEvent } from 'react';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';

type FirestoreItem = {
  id: string;
  title: string;
  details: string;
  userId?: string;
  createdAt?: { seconds: number } | null;
};

const FirestoreForm = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [documents, setDocuments] = useState<FirestoreItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'documents'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const nextDocuments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as DocumentData),
        })) as FirestoreItem[];

        setDocuments(nextDocuments);
      },
      () => {
        setError('Unable to load Firestore documents.');
      },
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setError('You must be logged in to add a document.');
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedDetails = details.trim();

    if (!trimmedTitle || !trimmedDetails) {
      setError('Title and details are required.');
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await addDoc(collection(db, 'documents'), {
        title: trimmedTitle,
        details: trimmedDetails,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      setTitle('');
      setDetails('');
      setSuccess('Document added to Firestore.');
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Something went wrong while saving.',
      );
    }
  };

  return (
    <div className="page-shell">
      <h2>Add a Firestore Document</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Document title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <textarea
          placeholder="Document details"
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          rows={4}
        />
        <button type="submit">Save to Firestore</button>
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}
      </form>

      <div style={{ marginTop: '1rem' }}>
        <h3>Saved Documents</h3>
        {documents.length === 0 ? (
          <p>No documents yet.</p>
        ) : (
          <ul>
            {documents.map((document) => (
              <li key={document.id}>
                <strong>{document.title}</strong>
                <div>{document.details}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FirestoreForm;
