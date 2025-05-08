// Users management functions
async function loadUsers() {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/users/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const users = await response.json();
      renderUsers(users);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load users');
    }
  }
  
  function renderUsers(users) {
    const tableBody = document.getElementById('usersTableBody');
    tableBody.innerHTML = '';
    
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">${user.name}</td>
        <td class="px-6 py-4 whitespace-nowrap">${user.email}</td>
        <td class="px-6 py-4 whitespace-nowrap">${user.noHP}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
              user.role === 'staff' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
            ${user.role}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <button class="edit-user mr-2 text-blue-600 hover:text-blue-900" data-id="${user.id}">Edit</button>
          <button class="delete-user text-red-600 hover:text-red-900" data-id="${user.id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
    
    // Add event listeners to edit buttons
    document.querySelectorAll('.edit-user').forEach(button => {
      button.addEventListener('click', (e) => {
        const userId = e.target.getAttribute('data-id');
        openEditUserModal(userId);
      });
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-user').forEach(button => {
      button.addEventListener('click', (e) => {
        const userId = e.target.getAttribute('data-id');
        deleteUser(userId);
      });
    });
  }
  
  async function openEditUserModal(userId) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch user');
      
      const user = await response.json();
      
      document.getElementById('modalTitle').textContent = 'Edit User';
      document.getElementById('userId').value = user.id;
      document.getElementById('modalName').value = user.name;
      document.getElementById('modalEmail').value = user.email;
      document.getElementById('modalPassword').value = '';
      document.getElementById('modalPhone').value = user.noHP;
      document.getElementById('modalRole').value = user.role;
      
      document.getElementById('userModal').classList.remove('hidden');
    } catch (error) {
      console.error('Error opening edit modal:', error);
      alert('Failed to load user data');
    }
  }
  
  async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        alert('User deleted successfully');
        loadUsers();
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  }
  
  // Modal handling
  document.getElementById('addUserBtn').addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Add New User';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userModal').classList.remove('hidden');
  });
  
  document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('userModal').classList.add('hidden');
  });
  
  document.getElementById('cancelModalBtn').addEventListener('click', () => {
    document.getElementById('userModal').classList.add('hidden');
  });
  
  // Handle form submission
  document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('modalName').value,
      email: document.getElementById('modalEmail').value,
      noHP: document.getElementById('modalPhone').value,
      role: document.getElementById('modalRole').value
    };
    
    const password = document.getElementById('modalPassword').value;
    if (password) formData.password = password;
    
    const userId = document.getElementById('userId').value;
    const url = userId ? `${API_BASE_URL}/user/${userId}` : `${API_BASE_URL}/add-users`;
    const method = userId ? 'PUT' : 'POST';
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        document.getElementById('userModal').classList.add('hidden');
        loadUsers();
        alert(userId ? 'User updated successfully' : 'User created successfully');
      } else {
        throw new Error(userId ? 'Failed to update user' : 'Failed to create user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('An error occurred while saving the user');
    }
  });