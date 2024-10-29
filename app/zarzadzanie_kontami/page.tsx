import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Kowal from "@/Kowal";
import Szczepienie from "@/Szczepienie";
import Nowy_uz from "@/Nowy_uz"
import Pokaz from "@/Pokaz_konie_admin"
import Przypnij from "@/Przypnij_konia"
import Usun from "@/Usun_user"
import Reset from "@/Reset_hasla"
import '@/globals.css'


export default function page() {
    return (
        <main className=" items-center justify-between p-24">

            <div
                className=" flex flex-col gap-4  text-center lg:w-full  lg:grid-cols-3 lg:text-left mb-10">
                    <Nowy_uz />

            </div>
            <div
                className=" flex flex-col gap-4  text-center lg:w-full  lg:grid-cols-3 lg:text-left mb-10">
                    <Pokaz />

            </div>
            <div
                className=" flex flex-col gap-4  text-center lg:w-full  lg:grid-cols-3 lg:text-left mb-10">
                    <Przypnij />

            </div>
            <div
                className=" flex flex-col gap-4  text-center lg:w-full  lg:grid-cols-3 lg:text-left mb-10">
                    <Usun />

            </div>
            <div
                className=" flex flex-col gap-4  text-center lg:w-full  lg:grid-cols-3 lg:text-left mb-10">
                    <Reset />

            </div>

            
        </main>
    )
}