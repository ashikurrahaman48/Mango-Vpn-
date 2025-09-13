// pages/admin/users.tsx
import React, { useState, useEffect } from 'react';
import type { AdminUser, AdminRole } from '../../types/admin';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Add password to the state type for the creation form
  const [currentUser, setCurrentUser] = useState<(Partial<AdminUser> & { password?: string }) | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // NOTE: In a real app, you'd add authorization headers here
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user: Partial<AdminUser> | null = null) => {
    // Initialize with an empty password and default role for new users
    setCurrentUser(user ? { ...user } : { email: '', password: '', role: 'viewer', isActive: true });
    setIsModalOpen(true);
  };
  
  const handleSaveUser = async () => {
    if (!currentUser) return;

    const method = currentUser.id ? 'PUT' : 'POST';
    const endpoint = currentUser.id ? `/api/users?id=${currentUser.id}` : '/api/users';
    
    // For new users, ensure password is not empty
    if (!currentUser.id && (!currentUser.password || currentUser.password.length < 6)) {
        alert("A password is required and must be at least 6 characters long for new users.");
        return;
    }

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setCurrentUser(null);
        fetchUsers(); // Refresh the list
      } else {
        const errorData = await res.json();
        alert(`Failed to save user: ${errorData.message}`);
        console.error("Failed to save user", errorData);
      }
    } catch (error) {
      alert("An error occurred while saving the user.");
      console.error("Error saving user:", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            fetchUsers();
        } else {
            const errorData = await res.json();
            alert(`Failed to delete user: ${errorData.message || 'Permission denied'}`);
        }
      } catch (error) {
        alert("An error occurred while deleting the user.");
        console.error("Failed to delete user:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">User Management</h1>
        <button onClick={() => handleOpenModal()} className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-focus)] text-[var(--color-primary-content)] font-bold py-2 px-4 rounded-lg transition-colors">
          Add User
        </button>
      </div>

      <div className="bg-[var(--color-bg-secondary)] rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[var(--color-bg-tertiary)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-bg-tertiary)]">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-4">Loading users...</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)] capitalize">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(user)} className="text-[var(--color-accent)] hover:text-[var(--color-primary)] mr-4">Edit</button>
                    <button onClick={() => handleDeleteUser(user.id)} className="text-[var(--color-error)] hover:text-red-400">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-secondary)] rounded-lg shadow-xl w-full max-w-md p-6 border border-[var(--color-bg-tertiary)]">
            <h2 className="text-2xl font-bold mb-4">{currentUser.id ? 'Edit User' : 'Add User'}</h2>
            
            <div className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Email Address</label>
                    <input id="email" type="email" placeholder="user@example.com" value={currentUser.email} onChange={e => setCurrentUser({...currentUser, email: e.target.value})} className="w-full bg-[var(--color-bg-tertiary)] p-2 rounded focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] border-transparent"/>
                </div>
                
                {!currentUser.id && (
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Password</label>
                        <input 
                            id="password"
                            type="password" 
                            placeholder="Min. 6 characters" 
                            value={currentUser.password || ''}
                            onChange={e => setCurrentUser({...currentUser, password: e.target.value})}
                            className="w-full bg-[var(--color-bg-tertiary)] p-2 rounded focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] border-transparent"
                        />
                    </div>
                )}
                
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Role</label>
                    <select id="role" value={currentUser.role} onChange={e => setCurrentUser({...currentUser, role: e.target.value as AdminRole | 'user'})} className="w-full bg-[var(--color-bg-tertiary)] p-2 rounded focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] border-transparent">
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="administrator">Administrator</option>
                        <option value="user">VPN User</option>
                    </select>
                </div>

                <div className="pt-2">
                    <label className="flex items-center space-x-3">
                        <input type="checkbox" checked={currentUser.isActive} onChange={e => setCurrentUser({...currentUser, isActive: e.target.checked})} className="form-checkbox h-5 w-5 text-[var(--color-primary)] bg-[var(--color-bg-tertiary)] border-[var(--color-bg-tertiary)]/50 rounded focus:ring-[var(--color-primary)]"/>
                        <span className="text-[var(--color-text-secondary)]">User is Active</span>
                    </label>
                </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="bg-[var(--color-bg-tertiary)] hover:bg-opacity-70 text-[var(--color-text-primary)] font-bold py-2 px-4 rounded-lg">Cancel</button>
              <button onClick={handleSaveUser} className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-focus)] text-[var(--color-primary-content)] font-bold py-2 px-4 rounded-lg">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
