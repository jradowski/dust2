
import React from 'react'
import 'reactjs-popup/dist/index.css'
import MessageSender from '@/MessageSender';
import NotePad from '@/NotePad';
import Inbox from '@/Inbox';
import UserList from '@/UserList';
import WorkSchedule from '@/WorkSchedule';
import AddSchedule from '@/AddSchedule';
import WorkScheduleWeekly from '@/WorkScheduleWeekly';
import '@/Schedule.css';
import Komentarze from '@/Komentarze';
import TreningUser from '@/TreningUser';
import TreningUserLuzak from '@/TreningUserLuzak';
import WorkScheduleWeeklyDlaPracownikow from '@/WorkScheduleWeeklyDlaPracownikow';
import AddTask from '@/AddTask';
import TaskList from '@/TaskList';
import TaskListDlaPracownikow from '@/TaskListDlaPracownikow';
import '@/globals.css';
import Notepad from "@/NotePad";

const Home = async () => {

    return (
        <main className="grid grid-cols-1 gap-10 min-h-fit flex-col place-items-center justify-between p-24">


            <div
                className=" w-10/12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                <div
                    className="text-transparent text-center font-bold text-3xl mb-6 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                    <h1>Horse message</h1>
                </div>

                <div>
                    <MessageSender/>
                </div>
            </div>

            <div
                className=" w-2/3 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">


                <div>
                    <div
                        className="text-transparent text-center font-bold text-3xl mb-6 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                        <h1>Skrzynka odbiorcza</h1>
                    </div>

                    <div className="">
                        <Inbox/>
                    </div>

                </div>

            </div>


            <div
                className=" w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                <div>
                    <div
                        className="text-transparent text-center font-bold text-3xl mb-6 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                        <h1>Notes</h1>
                    </div>

                    <div className="">
                        <Notepad/>
                    </div>

                </div>

            </div>


        </main>


    )
}

export default Home;
