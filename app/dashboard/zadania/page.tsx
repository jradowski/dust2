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
    <main className="flex min-h-fit flex-col items-center justify-between p-24">
      
      {/* Conditional rendering based on user position */}
      {user?.position !== 'jezdziec' && (
        <div className="content-center ml-8 w-full grid grid-cols-1 gap-10 rounded-tl-xl text-xl text-justify mb-10 bg-white border-r-2 border-b-2 border-zinc-200 p-5 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2 dark:border-r-2 dark:border-gray-600">
          <div>
            <div className="h-12 text-xl text-center font-extrabold">
              Konie dla zalogowanego luzaka:
            </div>
          </div>
          <TreningUserLuzak />
        </div>
      )}

        {user?.position !== 'luzak' && (
        <div className="content-center ml-8 w-full grid grid-cols-1 gap-10 rounded-tl-xl text-xl text-justify mb-10 bg-white border-r-2 border-b-2 border-zinc-200 p-5 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2 dark:border-r-2 dark:border-gray-600">
          <div>
            <div className="h-12 text-xl text-center font-extrabold">
              Konie dla zalogowanego jeźdźca:
            </div>
          </div>
          <TreningUser />
        </div>
      )}

      <div className="content-center ml-8 w-full grid grid-cols-1 gap-10 rounded-tl-xl text-xl text-justify mb-10 bg-white border-r-2 border-b-2 border-zinc-200 p-5 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2 dark:border-r-2 dark:border-gray-600">
        <div>
          <div className="h-12 text-xl text-center font-extrabold">
            Harmonogram tygodniowy dla zalogowanego pracownika:
          </div>
        </div>
        <WorkScheduleWeeklyDlaPracownikow />
      </div>

      <div className="content-center ml-8 w-full grid grid-cols-1 gap-10 rounded-tl-xl text-xl text-justify mb-10 bg-white border-r-2 border-b-2 border-zinc-200 p-5 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2 dark:border-r-2 dark:border-gray-600">
        <div>
          <div className="h-12 text-xl text-center font-extrabold">
            Lista zadań dla uzytkownikow obecnie zalogowanych:
          </div>
        </div>
        <TaskListDlaPracownikow />
      </div>
    </main>
  );
};

export default Home;
