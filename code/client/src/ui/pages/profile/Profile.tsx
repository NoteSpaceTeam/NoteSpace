import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthService from '@services/auth/useAuthService';
import { User } from '@notespace/shared/src/users/types';
import { formatDate } from '@/utils/utils';
import { useAuth } from '@/contexts/auth/useAuth';
import './Profile.scss';

function Profile() {
  const { id } = useParams();
  const { getUser, deleteUser } = useAuthService();
  const [user, setUser] = useState<User | null>(null);
  const { currentUser, deleteAccount } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    async function fetchUser() {
      const user = await getUser(id!);
      setUser(user);
    }
    fetchUser();
  }, [id, getUser]);

  async function onDeleteAccount() {
    if (!currentUser || currentUser.uid !== user?.id) return;
    await deleteAccount();
    await deleteUser(user.id);
    navigate('/');
  }

  return (
    user && (
      <div className="profile">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>Joined {formatDate(user.createdAt)}</p>
        {currentUser?.uid === user.id && <button onClick={onDeleteAccount}>Delete Account</button>}
      </div>
    )
  );
}

export default Profile;
