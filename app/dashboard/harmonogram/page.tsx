'use client';
import React from 'react';
import 'reactjs-popup/dist/index.css';
import WorkSchedule from '@/WorkSchedule';
import AddSchedule from '@/AddSchedule';
import WorkScheduleWeekly from '@/WorkScheduleWeekly';
import '@/Schedule.css';
import AddTask from '@/AddTask';
import TaskList from '@/TaskList';
import { UserProvider } from '@/UserContext';
import ProtectedSection from '@/ProtectedSection';
import { useUser } from '@/UserContext';

export default function page() {
    return (
        <main className="flex flex-col gap-8 min-h-fit items-center justify-between p-4 md:p-24">
            <UserProvider>
                <ProtectedSection requiredRole="wlasciciel_stajni">

                    {/* Harmonogram pracy */}
                    <section className="w-full max-w-4xl bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                        <h2 className="text-transparent text-center font-bold text-xl md:text-3xl bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                            Harmonogram pracy
                        </h2>
                        <div className="mt-4">
                            <WorkSchedule />
                        </div>
                    </section>

                    {/* Dodaj godziny pracy */}
                    <section className="w-full max-w-4xl bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                        <h2 className="text-transparent text-center font-bold text-xl md:text-3xl mb-4 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                            Dodaj godziny pracy dla harmonogramu
                        </h2>
                        <div>
                            <AddSchedule />
                        </div>
                    </section>

                    {/* Harmonogram tygodniowy */}
                    <section className="w-full max-w-4xl bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                        <h2 className="text-transparent text-center font-bold text-xl md:text-3xl mb-4 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                            Harmonogram tygodniowy
                        </h2>
                        <div>
                            <WorkScheduleWeekly />
                        </div>
                    </section>

                    {/* Przypisz zadanie */}
                    <section className="w-full max-w-4xl bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                        <h2 className="text-transparent text-center font-bold text-xl md:text-3xl mb-4 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                            Przypisz zadanie dla pracownika
                        </h2>
                        <div>
                            <AddTask />
                        </div>
                    </section>

                    {/* Lista zadań */}
                    <section className="w-full max-w-4xl bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                        <h2 className="text-transparent text-center font-bold text-xl md:text-3xl mb-4 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                            Lista zadań dla użytkowników
                        </h2>
                        <div>
                            <TaskList />
                        </div>
                    </section>

                </ProtectedSection>
            </UserProvider>
        </main>
    );
}
