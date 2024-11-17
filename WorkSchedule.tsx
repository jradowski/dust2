"use client";
import Image from 'next/image';
import '@/Schedule.css';
import '@/tabela.css';
import Link from 'next/link';
import 'reactjs-popup/dist/index.css';
import supabase from '@/supabaseClient.js';
import React, { useState, useEffect, useCallback } from 'react';

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

const WorkSchedule: React.FC = () => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editEntry) {
      setEditEntry({ ...editEntry, [e.target.name]: e.target.value });
    }
  };

  const updateScheduleEntry = async (entry: ScheduleEntry) => {
    const { error } = await supabase
      .from('work_schedule')
      .update({
        employee_id: entry.employee_id,
        date: entry.date,
        start_time: entry.start_time,
        end_time: entry.end_time,
      })
      .eq('id', entry.id);

    if (error) {
      console.error('Error updating entry:', error);
    } else {
      setSchedule(schedule.map((e) => (e.id === entry.id ? entry : e)));
      setEditEntry(null);
    }
  };
  const handleEdit = (entry: ScheduleEntry) => {
    setEditEntry(entry);
  };

  const deleteScheduleEntry = async (id: number) => {
    const { error } = await supabase
      .from('work_schedule')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting entry:', error);
    } else {
      setSchedule(schedule.filter((entry) => entry.id !== id));
    }
  };

  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', first_name: 'Example', last_name: 'Employee', position: 'jeździec' },
    { id: '2', first_name: 'Example', last_name: 'Employee', position: 'luzak' },
    { id: '3', first_name: 'Example', last_name: 'Employee', position: 'stajenny' },
  ]);
  const [editEntry, setEditEntry] = useState<ScheduleEntry | null>(null);
  const [filters, setFilters] = useState({
    date: '',
    employeeId: '',
    position: '',
    month: '',
  });
  const [showSchedule, setShowSchedule] = useState(false); // Nowy stan do kontrolowania widoczności tabeli

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from('employees').select('*');

      if (error) {
        console.error('Error fetching employees:', error);
      } else {
        setEmployees(data);
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
        `);

      if (error) {
        console.error('Error fetching schedule:', error);
      } else {
        const formattedData = data.map((entry: any) => ({
          id: entry.id,
          employee_id: entry.employee_id,
          date: entry.date,
          start_time: entry.start_time,
          end_time: entry.end_time,
          employee: entry.employees,
        }));
        setSchedule(formattedData);
      }
    };

    fetchEmployees();
    fetchSchedule();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredSchedule = schedule.filter((entry) => {
    const matchesDate = filters.date ? entry.date === filters.date : true;
    const matchesEmployee = filters.employeeId ? entry.employee_id === filters.employeeId : true;
    const matchesPosition = filters.position ? entry.employee.position === filters.position : true;
    const matchesMonth = filters.month ? entry.date.startsWith(filters.month) : true;

    return matchesDate && matchesEmployee && matchesPosition && matchesMonth;
  });

  // Funkcja obsługująca kliknięcie przycisku "Szukaj"
  const handleSearch = () => {
    setShowSchedule(true); // Ustawiamy, aby tabela była widoczna po kliknięciu
  };

  return (
    <div className="flex flex-col columns-1">
      <div className="filter-section">
        <h3 className="text-2xl mb-4">Filtrowanie</h3>
        <h1>Dokładna data:</h1>
        <input
            className="custom-input"
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            placeholder="Data"
        />
        <h1>Miesiąc::</h1>
        <input
            className="custom-input"
            type="month"
            name="month"
            value={filters.month}
            onChange={handleFilterChange}
            placeholder="Miesiąc"
        />
        <h1>Pracownik:</h1>
        <select
            className="custom-select"
            name="employeeId"
            value={filters.employeeId}
            onChange={handleFilterChange}
        >
          <option value="">Wybierz pracownika</option>
          {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {`${employee.first_name} ${employee.last_name}`}
              </option>
          ))}
        </select>
        <h1>Stanowisko:</h1>
        <select
            className="custom-select"
            name="position"
            value={filters.position}
            onChange={handleFilterChange}
        >
          <option value="">Wybierz stanowisko</option>
          <option value="jezdziec">Jeździec</option>
          <option value="stajenny">Stajenny</option>
          <option value="luzak">Luzak</option>
        </select>

        <div>
          <button className="px-6 py-2 w-fit text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white mb-2 mt-2" onClick={handleSearch}>Szukaj</button>
          {/* Przycisk do wyszukiwania */}
        </div>
      </div>

      {showSchedule && ( // Tabela wyświetlana po kliknięciu przycisku "Szukaj"
          <table>
            <thead>
            <tr>
              <th>Data</th>
              <th>Godzina rozpoczęcia</th>
              <th>Godzina zakończenia</th>
              <th>Pracownik</th>
              <th>Stanowisko</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedule.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.date}</td>
                <td>{entry.start_time.slice(0, 5)}</td>
                <td>{entry.end_time.slice(0, 5)}</td>
                <td>{`${entry.employee.first_name} ${entry.employee.last_name}`}</td>
                <td>{entry.employee.position}</td>
                <td>
                  <button className="button-table" onClick={() => handleEdit(entry)}>Edytuj</button>
                  <button className="button-table" onClick={() => deleteScheduleEntry(entry.id)}>Usuń</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editEntry && (
        <div>
          <h3>Edytuj wpis</h3>
          <input
            className="custom-input"
            type="date"
            name="date"
            value={editEntry.date}
            onChange={handleChange}
          />
          <input
            className="custom-input"
            type="time"
            name="start_time"
            value={editEntry.start_time}
            onChange={handleChange}
          />
          <input
            className="custom-input"
            type="time"
            name="end_time"
            value={editEntry.end_time}
            onChange={handleChange}
          />
          <select
            className="custom-select"
            name="employee_id"
            value={editEntry.employee_id}
            onChange={handleChange}
          >
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {`${employee.first_name} ${employee.last_name}`}
              </option>
            ))}
          </select>
          <br></br>
          <button className="px-6 py-2 w-fit text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white" onClick={() => updateScheduleEntry(editEntry)}>Zapisz zmiany</button>
          <button className="custom-button" onClick={() => setEditEntry(null)}>Anuluj</button>
        </div>
      )}
    </div>
  );
};

export default WorkSchedule;
