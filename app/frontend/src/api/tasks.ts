import { TaskFormData } from '../components/TaskModal';

const API_URL = 'http://localhost:8000/api';

export async function createTask(taskData: TaskFormData) {
  console.log("Отправляем данные:", taskData); // 👈 Логируем данные перед отправкой

  const response = await fetch(`${API_URL}/tasks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Ошибка при создании задачи:", errorText); // 👈 Логируем ошибку
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
    console.error("Ошибка при получении задач:", response.status, response.statusText);
    throw new Error('Failed to fetch tasks');
  }

  const data = await response.json();
  console.log("Полученные задачи:", data);
  return data;
}