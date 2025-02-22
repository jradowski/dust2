"use client";
import Image from 'next/image'
import Link from 'next/link'
import 'reactjs-popup/dist/index.css'
import supabase  from '@/supabaseClient.js'
import React, { useState, useEffect, useCallback,  FormEvent  } from 'react';
import '@/tabela.css'


interface Employee {
    id: string;
    first_name: string;
    last_name: string;
    position: string;
}

const AddSchedule: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>(''); // Zmieniamy typ na `string`
    const [startTime, setStartTime] = useState<string>('07:00');
    const [endTime, setEndTime] = useState<string>('18:00');
    const [dates, setDates] = useState<string[]>([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            const { data, error } = await supabase
                .from('employees')
                .select('*');

            if (error) {
                console.error('Error fetching employees:', error);
            } else {
                setEmployees(data);
            }
        };

        fetchEmployees();
    }, []);

    const handleAddSchedule = async () => {
        for (const date of dates) {
            const { error } = await supabase
                .from('work_schedule')
                .insert({
                    employee_id: selectedEmployee,
                    date: date,
                    start_time: startTime,
                    end_time: endTime,
                });

            if (error) {
                console.error('Error adding schedule entry:', error);
            }
        }

        // Wyczyść formularz po dodaniu
        setSelectedEmployee('');
        setDates([]);
        setStartTime('07:00');
        setEndTime('18:00');
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (dates.includes(value)) {
            setDates(dates.filter(date => date !== value));
        } else {
            setDates([...dates, value]);
        }
    };

    return (
        <div>
            <label>
                Wybierz pracownika:
                <select
                    className="custom-select"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                    <option value="">wybierz pracownika</option>
                    {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                            {employee.first_name} {employee.last_name}
                        </option>
                    ))}
                </select>
            </label>
            <br/>
            <label>
                Czas_rozpoczęcia:
                <input
                    className="custom-input"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
            </label>
            <br/>
            <label>
                Czas_zakończenia:
                <input
                    className="custom-input"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />
            </label>
            <br/>
            <h3>Wybierz daty:</h3>
            <input type="date" className="custom-input" onChange={handleDateChange} />
            <br />
            <h4>Wybrane daty:</h4>
            <ul>
                {dates.map(date => (
                    <li key={date}>{date}</li>
                ))}
            </ul>
            <button className="px-6 py-2 w-fit text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white mt-2 mb-2" onClick={handleAddSchedule}>Dodaj</button>
        </div>
    );
};

export default AddSchedule;
