'use client';
import React from 'react'
import 'reactjs-popup/dist/index.css'
import WorkSchedule from '@/WorkSchedule';
import AddSchedule from '@/AddSchedule';
import WorkScheduleWeekly from '@/WorkScheduleWeekly';
import '@/Schedule.css';
import WorkScheduleWeeklyDlaPracownikow from '@/WorkScheduleWeeklyDlaPracownikow';
import AddTask from '@/AddTask';
import TaskList from '@/TaskList';
import TaskListDlaPracownikow from '@/TaskListDlaPracownikow';
import { UserProvider } from '@/UserContext';
import ProtectedSection from '@/ProtectedSection'; // Jeśli używasz tego komponentu
import { useUser } from '@/UserContext';


export default function page() {

    return (
        <main className="flex min-h-fit flex-col gap-16 text-xl items-center justify-between p-24">
        
        <UserProvider>
            <ProtectedSection requiredRole="wlasciciel_stajni">

                <div
                    className="w-11/12 bg-gradient-to-b grid grid-cols-1 gap-4 from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                        <div
                            className="text-transparent text-center font-bold text-3xl  bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                            Harmonogram pracy
                        </div>


                    <div className="w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                            <h1 className="font-bold text-center text-2xl w-auto">

                            </h1>
                            <WorkSchedule/>
                    </div>

                </div>



                <div
                    className="w-11/12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                    <div>
                        <div
                            className=" text-transparent text-center font-bold text-3xl mb-6 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                            Dodaj godziny pracy dla harmonogramu
                        </div>
                    </div>

                        <div className="w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                            <h1 className="font-bold text-center text-2xl w-auto">

                            </h1>
                            <AddSchedule/>
                        </div>

                </div>



                <div
                    className="w-11/12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                    <div>
                        <div
                            className=" text-transparent text-center font-bold text-3xl mb-6 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                            Harmonogram tygodniowy
                        </div>
                    </div>

                        <div className="w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                            <h1 className="font-bold text-center text-2xl w-auto">

                            </h1>
                            <WorkScheduleWeekly/>
                        </div>
                </div>

                <div
                    className="w-11/12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                    <div>
                        <div
                            className=" text-transparent text-center font-bold text-3xl mb-6 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                            Przypisz zadanie dla pracownika
                        </div>
                    </div>

                        <div className="w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                            <h1 className="font-bold text-center text-2xl w-auto">

                            </h1>
                            <AddTask/>
                        </div>
                </div>

                <div
                    className="w-11/12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                    <div>
                        <div
                            className=" text-transparent text-center font-bold text-3xl mb-6 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                            Lista zadań dla uzytkownikow
                        </div>
                    </div>

                        <div className="w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                            <h1 className="font-bold text-center text-2xl w-auto">

                            </h1>
                            <TaskList/>
                        </div>
                </div>


            </ProtectedSection>
        </UserProvider>
        </main>


    )
}
