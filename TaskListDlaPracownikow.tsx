"use client";
import Image from 'next/image'
import Link from 'next/link'
import 'reactjs-popup/dist/index.css'
import supabase  from '@/supabaseClient.js'
import React, { useState, useEffect, useCallback } from 'react';
import '@/tabela.css'



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
  employee: {
    first_name: string;
    last_name: string;
  };
}

const TaskListDlaPracownikow: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [userId, setUserId] = useState<string | null>(null); // State for the user ID

  // Fetch logged-in user from Supabase
  const getCurrentUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user:', error);
    } else if (data.user) {
      console.log("Logged in user:", data.user);
      setUserId(data.user.id); // Set the user ID when found
    } else {
      console.log("No logged-in user.");
      setLoading(false);
    }
  };


  useEffect(() => {
    // Fetch tasks from the database
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
          `)
          .eq('employee_id', userId ); ;

      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        // Ensure the 'employee' is not an array and is a single object
        const formattedTasks = data.map((task: any) => ({
          ...task,
          employee: Array.isArray(task.employee) ? task.employee[0] : task.employee, // Grab the first employee if it's an array
        }));
        setTasks(formattedTasks);
      }
      setLoading(false);
    };
    getCurrentUser()
    fetchTasks();
  }, [userId]);

  if (loading) return <div>Loading tasks...</div>;

  return (
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700 rounded-xl">
          <thead className="bg-blue-600">
          <tr>
            <th className="px-4 py-2 text-left text-md font-semibold text-white dark:text-gray-300">Tytuł</th>
            <th className="px-4 py-2 text-left text-md font-semibold text-white dark:text-gray-300">Opis</th>
            <th className="px-4 py-2 text-left text-md font-semibold text-white dark:text-gray-300">Termin</th>
          </tr>
          </thead>
          <tbody>
          {tasks.map((task) => (
              <tr key={task.id} className="bg-white dark:bg-gray-800">
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200 whitespace-normal break-words max-w-xs">{task.title}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200 whitespace-normal break-words max-w-xs">{task.description}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200 whitespace-normal break-words max-w-xs">{task.due_date}</td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default TaskListDlaPracownikow;