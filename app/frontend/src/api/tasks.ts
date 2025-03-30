import { TaskFormData } from '../components/TaskModal';

const API_URL = 'http://localhost:8000/api';

export async function createTask(taskData: TaskFormData) {
  const response = await fetch(`${API_URL}/tasks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming you store the token in localStorage
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error('Failed to create task');
  }

  return response.json();
}

export async function getTasks() {
  const response = await fetch(`${API_URL}/tasks/`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return response.json();
}