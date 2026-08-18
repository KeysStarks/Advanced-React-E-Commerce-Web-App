import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { createUserProfile, deleteUserProfile, fetchUserProfile, updateUserProfile } from '../api/usersApi';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    fetchUserProfile(user.uid)
      .then(async (profile) => {
        if (!profile) {
          // Backfills accounts registered before user profiles existed.
          await createUserProfile(user.uid, user.email ?? '');
          setName('');
          setAddress('');
          return;
        }
        setName(profile.name ?? '');
        setAddress(profile.address ?? '');
      })
      .catch(() => setError('Unable to load your profile.'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserProfile(user.uid, { name: name.trim(), address: address.trim() });
      setSuccess('Profile updated.');
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !user.email) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(user, credential);
      await deleteUserProfile(user.uid);
      await deleteUser(user);
      navigate('/');
    } catch (deleteErr) {
      setDeleteError(
        deleteErr instanceof Error ? deleteErr.message : 'Unable to delete account. Check your password.',
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="page-shell">Loading profile…</p>;

  return (
    <div className="page-shell" style={{ marginTop: '1rem' }}>
      <h2>My Profile</h2>
      <p className="muted-text">Signed in as {user?.email}</p>

      <form onSubmit={handleSave} className="auth-form">
        <label htmlFor="profile-name">Name</label>
        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <label htmlFor="profile-address">Address</label>
        <input
          id="profile-address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Shipping address"
        />
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}
      </form>

      <div className="list-card" style={{ marginTop: '1.5rem' }}>
        <h3>Delete Account</h3>
        <p className="muted-text">
          This permanently deletes your profile data and sign-in. This can't be undone.
        </p>

        {!showDeleteConfirm ? (
          <button className="danger-button" onClick={() => setShowDeleteConfirm(true)}>
            Delete My Account
          </button>
        ) : (
          <div className="auth-form">
            <label htmlFor="delete-password">Confirm your password to continue</label>
            <input
              id="delete-password"
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Password"
            />
            <div className="button-row">
              <button className="danger-button" onClick={handleDeleteAccount} disabled={deleting || !deletePassword}>
                {deleting ? 'Deleting…' : 'Confirm Delete'}
              </button>
              <button type="button" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
            </div>
            {deleteError && <p className="auth-error">{deleteError}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
