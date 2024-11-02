"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import 'reactjs-popup/dist/index.css'
import supabase from '@/supabaseClient.js';



let fetchData = async () => {
    let { data, error } = await supabase
        .from('horse')
        .select('*')
        .eq('nr_boksu', 1)
        .single()

    return data
};
let fetchData2 = async () => {
    let { data, error } = await supabase
        .from('horse')
        .select('*')
        .eq('nr_boksu', 2)
        .single()

    return data
};
let fetchData3 = async () => {
    let { data, error } = await supabase
        .from('horse')
        .select('*')
        .eq('nr_boksu', 3)
        .single()

    return data
};
let fetchData4 = async () => {
    let { data, error } = await supabase
        .from('horse')
        .select('*')
        .eq('nr_boksu', 4)
        .single()

    return data
};
let fetchData5 = async () => {
    let { data, error } = await supabase
        .from('horse')
        .select('*')
        .eq('nr_boksu', 5)
        .single()

    return data
};

export default async function page() {
    const data = await fetchData()
    const data2 = await fetchData2()
    const data3 = await fetchData3()
    const data4 = await fetchData4()
    const data5 = await fetchData5()
    const zdj= data.image_url ? data.image_url : "/Kolorado.jpg";
    return (
        <main className=" min-h-full p-24">


            <div
                className=" text-center mb-0 w-11/12 p-12 rounded-tl-xl lg:text-left bg-white border-r-2 border-b-2 border-zinc-20 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2 dark:border-r-2 dark:border-gray-600  ">

                <h2 className="w-full text-center text-3xl font-bold">Konie w boksach</h2>
                <hr className="border-t-2 mb-2 mt-2 border-zinc-200 dark:border-gray-600 w-100%"/>

                <div className="flex flex-row gap-5">
                    <Link href="/dashboard/boxes/Box1">
                        <div
                            className="group rounded-tl-xl  text-3xl text-justify mx-2 bg-white border-r-2 border-b-2 border-zinc-200 p-5 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2 dark:border-r-2 dark:border-gray-600 drop-shadow-xl  "
                        >
                            <div className="m-2">
                                <Image
                                    className="rounded-2xl aspect-square object-cover border-2  dark:border-gray-900"
                                    src={zdj}
                                    alt="Kolorado KG"
                                    width={400}
                                    height={100}
                                />
                            </div>


                            <h2 className="text-center mb-3 text-2xl font-semibold">
                                {data.imie}
                            </h2>
                        </div>
                    </Link>

                    <Link href="/dashboard/boxes/Box2">
                        <div
                            className="group rounded-tl-xl  text-3xl text-justify mx-2 bg-white border-r-2 border-b-2 border-zinc-200 p-5 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2 dark:border-r-2 dark:border-gray-600 drop-shadow-xl  "
                        >
                            <div>
                                <Image
                                    className="rounded-2xl aspect-square object-cover border-2  dark:border-gray-900"
                                    src={zdj}
                                    alt="Kolorado KG"
                                    width={400}
                                    height={100}
                                />
                            </div>

                            <h2 className="text-center mb-3 text-2xl font-semibold">
                                {data2.imie}
                            </h2>
                        </div>
                    </Link>


                    <Link href="/dashboard/boxes/Box3">
                        <div
                            className="group rounded-tl-xl  text-3xl text-justify mx-2 bg-white border-r-2 border-b-2 border-zinc-200 p-5 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2 dark:border-r-2 dark:border-gray-600 drop-shadow-xl  "
                        >

                            <div>
                                <Image
                                    className="rounded-2xl aspect-square object-cover border-2  dark:border-gray-900"
                                    src={zdj}
                                    alt="Kolorado KG"
                                    width={400}
                                    height={100}
                                />
                            </div>

                            <h2 className="text-center mb-3 text-2xl font-semibold">
                                {data3.imie}
                            </h2>
                        </div>
                    </Link>

                    <Link href="/dashboard/boxes/Box4">
                        <div
                            className="group rounded-tl-xl  text-3xl text-justify mx-2 bg-white border-r-2 border-b-2 border-zinc-200 p-5 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2 dark:border-r-2 dark:border-gray-600  drop-shadow-xl "
                        >
                            <div>
                                <Image
                                    className="rounded-2xl aspect-square object-cover border-2  dark:border-gray-900"
                                    src={zdj}
                                    alt="Kolorado KG"
                                    width={400}
                                    height={100}
                                />
                            </div>

                            <h2 className="text-center mb-3 text-2xl font-semibold">
                                {data4.imie}
                            </h2>
                        </div>
                    </Link>

                    <Link href="/dashboard/boxes/Box5">
                        <div
                            className="group rounded-tl-xl  text-3xl text-justify mx-2 bg-white border-r-2 border-b-2 border-zinc-200 p-5 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2 dark:border-r-2 dark:border-gray-600 drop-shadow-xl  "
                        >
                            <div>
                                <Image
                                    className="rounded-2xl aspect-square object-cover border-2  dark:border-gray-900"
                                    src={zdj}
                                    alt="Kolorado KG"
                                    width={400}
                                    height={100}
                                />
                            </div>

                            <h2 className="text-center mb-3 text-2xl font-semibold">
                                {data5.imie}
                            </h2>
                        </div>
                    </Link>
                </div>

            </div>
        </main>

    );
};