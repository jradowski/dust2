"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import TreningUser from '@/TreningUser';
import TreningUserLuzak from '@/TreningUserLuzak';
import WorkScheduleWeeklyDlaPracownikow from '@/WorkScheduleWeeklyDlaPracownikow';
import TaskListDlaPracownikow from '@/TaskListDlaPracownikow';
import  supabase  from '@/supabaseClient'; // Import Supabase Client


type UserType = {
  id: string;
  position: string;
};

const Home: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (user) {
          const { data: employeeData, error: employeeError } = await supabase
            .from('employees')
            .select('position')
            .eq('id', user.id)
            .single();

          if (employeeError) throw employeeError;
          setUser({ id: user.id,  position: employeeData.position });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-fit flex-col gap-10 items-center justify-between p-24">
      
      {/* Conditional rendering based on user position */}
      {user?.position !== 'jezdziec' && (
        <div className="content-center w-full grid grid-cols-1 gap-10 rounded-tl-xl text-xl text-justify mb-10 bg-white border-r-2 border-b-2 border-zinc-200 p-5 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2 dark:border-r-2 dark:border-gray-600">
          <div className="text-center font-bold text-3xl mb-6">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
              Konie dla zalogowanego luzaka
            </h1>
          </div>
          <TreningUserLuzak/>
        </div>
      )}

      {user?.position !== 'luzak' && (
          <div
              className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
            <div className="text-center font-bold text-3xl mb-6">
              <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                Konie dla zalogowanego jeźdźca
              </h1>
            </div>
            <div className="flex flex-col text-xl  p-10 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <TreningUser/>
            </div>
          </div>
      )}

      <div
          className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
        <div className="text-center font-bold text-3xl mb-6">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
            Harmonogram tygodniowy
          </h1>
        </div>
        <div className="flex flex-col text-xl  p-10 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <WorkScheduleWeeklyDlaPracownikow/>
        </div>
      </div>

      <div
          className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
        <div className="text-center font-bold text-3xl mb-6">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
            Lista zadań
          </h1>
        </div>
        <div className="flex flex-col text-xl  p-10 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <TaskListDlaPracownikow/>
        </div>
      </div>
    </main>
  );
};

export default Home;
