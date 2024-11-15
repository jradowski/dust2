"use client";
import Image from 'next/image'
import Link from 'next/link'
import 'reactjs-popup/dist/index.css'
import supabase from '@/supabaseClient.js'
import React, { useState } from 'react'
import '@/globals.css';


const SignUp: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {

                }
            }

        })
        if (error) {
            console.error('Error signing up:', error.message)
        } else {
            console.log('User signed up:', data.user)
            onNavigate('login')
        }
    }

    return (
        <div className="flex items-center justify-center mt-6">
            <div className="flex flex-col mt-6 p-5 font-sans text-center font-semibold justify-center w-fit  text-2xl sm:text-xl rounded-2xl bg-gray-400 drop-shadow-md text-black dark:bg-zinc-800 dark:drop-shadow-md  dark:text-white">

                <div className="w-11/12">
                    <h1 className="lg:text-3xl sm:text-xl font-bold leading-10">Załóż konto w Stable Assistant</h1>
                </div>
                <div className="text-left leading-10">
                    <form onSubmit={handleSignUp}>
                        <label>
                            Email:
                            <input
                                className="custom-input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        <br/>
                        <label>
                            Hasło:
                            <input
                                className="custom-input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <br/>
                        <div className="flex flex-row gap-4 mt-6 ">
                            <button type="submit" className="custom-button dark:text-white dark:bg-gray-700">Załóż konto
                            </button>
                        </div>
                        <br></br>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default SignUp