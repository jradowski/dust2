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
            <div
                className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                <div
                    className="text-transparent text-center font-bold text-2xl mb-6 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                    <h1>Załóż konto w Stable Assistant</h1>
                </div>
                <div className="flex flex-col text-xl mt-6 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
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
                                <button type="submit" className="px-6 py-2 w-fit text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white">
                                    Załóż konto
                                </button>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SignUp