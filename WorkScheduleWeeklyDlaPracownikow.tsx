"use client";
import Image from 'next/image'
import Link from 'next/link'
import 'reactjs-popup/dist/index.css'
import supabase  from '@/supabaseClient.js'
import React, { useState, useEffect, useCallback,  FormEvent  } from 'react';
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
    const [selectedPosition, setSelectedPosition] = useState<string>('wszystkie');
    const [colors, setColors] = useState<{ [key: string]: string }>({});

    const [userId, setUserId] = useState<string | null>(null); // State for the user ID

// Pobierz zalogowanego użytkownika z Supabase
    const getCurrentUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.error('Błąd podczas pobierania użytkownika:', error);
        } else if (data.user) {
            console.log("Zalogowany użytkownik:", data.user);
            setUserId(data.user.id);
        } else {
            console.log("Brak zalogowanego użytkownika.");
        }
    };


    useEffect(() => {
        const fetchEmployees = async () => {
            const { data, error } = await supabase
                .from('employees')
                .select('*');

            if (error) {
                console.error('Error fetching employees:', error);
            } else {
                setEmployees(data);

                // Przypisz unikalne kolory dla każdego pracownika
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
                .select(`
            id,
            employee_id,
            date,
            start_time,
            end_time,
            employees:employees(id, first_name, last_name, position)
          `)
                .eq('employee_id', userId );

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
        getCurrentUser();
        fetchEmployees();
        fetchSchedule();
    }, [userId]);

    const getRandomColor = (): string => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        
        // Ensure the first character isn't '0'
        color += letters[Math.floor(Math.random() * 15) + 1]; // First character can't be "0"
        
        for (let i = 1; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)]; // The other characters can be any
        }
      
        return color;
      };

    const filteredEmployees = selectedPosition === 'wszystkie'
        ? employees
        : employees.filter(emp => emp.position === selectedPosition);

    const getEmployeeInSlot = (day: string, time: string): Employee | null => {
        const entry = schedule.find(
            (item) => item.date === day && item.start_time <= time && item.end_time > time
        );
        if (entry) {
            const employee = filteredEmployees.find((emp) => emp.id === entry.employee_id);
            return employee ? employee : null;
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
        <div className="">
            <table >
                <thead>
                <tr>
                    <th>Godziny</th>
                    {daysOfWeek.map((day, index) => (
                        <th key={index}>{day}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {hours.map((hour, index) => (
                    <tr key={index}>
                        <td>{hour}</td>
                        {daysOfWeek.map((day, dayIndex) => {
                            const employee = getEmployeeInSlot(day, hour);

                            return (
                                <td
                                    key={dayIndex}
                                    style={{ backgroundColor: employee ? colors[employee.id] : 'transparent' }}
                                >
                                    {employee ? (
                        <span style={{ fontSize: '12px' }}>
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
    );
};

export default WorkScheduleWeekly;