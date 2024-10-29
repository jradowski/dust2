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

export default function page() {
    return (
        <main className=" items-center justify-between p-24">

            <div
                className=" flex flex-col gap-4  text-center lg:w-full  lg:grid-cols-3 lg:text-left">
                    <Nowy_uz />

            </div>
            <div
                className=" flex flex-col gap-4  text-center lg:w-full  lg:grid-cols-3 lg:text-left">
                    <Pokaz />

            </div>
            <div
                className=" flex flex-col gap-4  text-center lg:w-full  lg:grid-cols-3 lg:text-left">
                    <Przypnij />

            </div>
            <div
                className=" flex flex-col gap-4  text-center lg:w-full  lg:grid-cols-3 lg:text-left">
                    <Usun />

            </div>
            <div
                className=" flex flex-col gap-4  text-center lg:w-full  lg:grid-cols-3 lg:text-left">
                    <Reset />

            </div>

            
        </main>
    )
}