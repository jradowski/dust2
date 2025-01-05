

"use client";
import Image from 'next/image'
import Link from 'next/link'
import 'reactjs-popup/dist/index.css'
import supabase from '@/supabaseClient.js'
import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import '@/Schedule.css';
import '@/tabela.css'

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  position: string;
}

interface ScheduleEntry {
  id: number;
  employee_id: string;
  date: string;
  start_time: string;
  end_time: string;
  employee: Employee;
}

const WorkScheduleWeekly: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>('stajenny');
  const [colors, setColors] = useState<{ [key: string]: string }>({});
  const [showTable, setShowTable] = useState<boolean>(false); // State to control the visibility of the table
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null); // State for the logged-in employee

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*');

      if (error) {
        console.error('Error fetching employees:', error);
      } else {
        setEmployees(data);

        // Assign random colors for each employee
        const newColors: { [key: string]: string } = {};
        data.forEach((employee: Employee) => {
          newColors[employee.id] = getRandomColor();
        });
        setColors(newColors);
      }
    };

    const fetchSchedule = async () => {
      const { data, error } = await supabase
        .from('work_schedule')
        .select(`id, employee_id, date, start_time, end_time, employees:employees(id, first_name, last_name, position)`);

      if (error) {
        console.error('Error fetching schedule:', error);
      } else {
        const formattedData = data.map((entry: any) => ({
          id: entry.id,
          employee_id: entry.employee_id,
          date: entry.date,
          start_time: entry.start_time,
          end_time: entry.end_time,
          employee: entry.employees
        }));
        setSchedule(formattedData);
      }
    };

    // Fetch current logged-in employee data
    const fetchCurrentEmployee = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        if (data?.user) { // Check if the user is logged in
          const { data: employeeData, error: employeeError } = await supabase
            .from('employees')
            .select('*')
            .eq('id', data.user.id) // Assuming user id is the same as employee id
            .single(); // Fetch the current employee's data

          if (employeeError) {
            console.error('Error fetching current employee:', employeeError);
          } else {
            setCurrentEmployee(employeeData);
          }
        }
      }
    };

    fetchEmployees();
    fetchSchedule();
    fetchCurrentEmployee();
  }, []);

  const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    color += letters[Math.floor(Math.random() * 15) + 1]; // First character can't be "0"
    for (let i = 1; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const convertTo24HourFormat = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getEmployeeInSlot = (day: string, time: string): Employee | null => {
    const targetTime = convertTo24HourFormat(time);
    
    const entry = schedule.find(
      (item) => item.date === day && convertTo24HourFormat(item.start_time) <= targetTime && convertTo24HourFormat(item.end_time) > targetTime
    );

    if (entry) {
      const employee = currentEmployee?.id === entry.employee_id ? currentEmployee : null;
      return employee || null;
    }

    return null;
  };

  const createTimeSlots = (startHour: number, endHour: number): string[] => {
    const slots: string[] = [];
    for (let i = startHour; i <= endHour; i++) {
      slots.push(`${i}:00`);
    }
    return slots;
  };

  const hours = createTimeSlots(7, 18);
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const today = new Date();
    today.setDate(today.getDate() + i);
    return today.toISOString().slice(0, 10);
  });

  return (
    <div>
      {/* Render the employee's schedule if they're logged in */}
      
          
        

          {/* Conditionally render the table based on the state */}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700 rounded-xl">
          <thead className="bg-blue-600 text-black dark:text-white">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Godziny</th>
            {daysOfWeek.map((day, index) => (
                <th key={index}>{day}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {hours.map((hour, index) => (
              <tr key={index} className="bg-white dark:bg-gray-800 text-black dark:text-white">
                <td>{hour}</td>
                {daysOfWeek.map((day, dayIndex) => {
                  const employee = getEmployeeInSlot(day, hour);

                  return (
                      <td
                          key={dayIndex}
                          style={{backgroundColor: employee ? colors[employee.id] : 'transparent'}}
                      >
                        {employee ? (
                            <span style={{fontSize: '11px'}}>
                              {employee.first_name} {employee.last_name}
                            </span>
                        ) : (
                            '-'
                        )}
                      </td>
                  );
                })}
              </tr>
          ))}
          </tbody>
        </table>
      </div>


    </div>
  );
};

export default WorkScheduleWeekly;
