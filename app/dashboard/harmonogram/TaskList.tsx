"use client";
import React, { useState, useEffect } from 'react';
import supabase from '@/supabaseClient.js';

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  employee: {
    first_name: string;
    last_name: string;
  };
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const { data, error } = await supabase
          .from('tasks')
          .select(`
          id,
          title,
          description,
          due_date,
          employee: employees (first_name, last_name)
        `);

      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        const formattedTasks = data.map((task: any) => ({
          ...task,
          employee: Array.isArray(task.employee) ? task.employee[0] : task.employee,
        }));
        setTasks(formattedTasks);
      }
      setLoading(false);
    };

    fetchTasks();
  }, []);

  if (loading) return <div className="text-center mt-4 text-gray-700 dark:text-gray-300">Loading tasks...</div>;

  return (
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700 rounded-xl">
          {/* Nagłówek */}
          <thead className="bg-blue-600">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Tytuł</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Treść</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Termin</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Pracownik</th>
          </tr>
          </thead>
          {/* Treść */}
          <tbody>
          {tasks.map((task) => (
              <tr key={task.id} className="bg-white dark:bg-gray-800">
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200 whitespace-normal break-words max-w-xs">{task.title}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200 whitespace-normal break-words max-w-sm">{task.description}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{task.due_date}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{`${task.employee.first_name} ${task.employee.last_name}`}</td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default TaskList;
