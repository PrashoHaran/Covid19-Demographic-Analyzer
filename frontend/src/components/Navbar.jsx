import { BookA, BookOpen, LogOut, User } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { getData } from '@/context/userContext'
import axios from 'axios'
import { toast } from 'sonner'

const Navbar = () => {
    const { user, setUser } = getData()
    const accessToken = localStorage.getItem("accessToken")
    console.log(user);

    const logoutHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/user/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (res.data.success) {
                setUser(null)
                toast.success(res.data.message)
                localStorage.clear()
            }
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <nav className='p-6 border-b border-gray-200 bg-transparent'>
            <div className='max-w-7xl mx-auto flex justify-between items-center'>
                {/* logo section  */}
                <Link to="/">
                    <div className='flex gap-2 items-center'>
                        <BookOpen className='h-6 w-6 text-green-800' />
                        <h1 className='font-bold text-xl'><span className='text-green-600'>Covid19-Demographic</span> Analyzer</h1>
                    </div>
                </Link>
                <div className='flex gap-7 items-center'>
                    <ul className='flex gap-7 items-center text-lg font-semibold'>
                        <li>
                            {user ? (
                                <Link to="/compare">Compare</Link>
                            ) : (
                                <span className="text-gray-400 cursor-not-allowed">Compare</span>
                            )}
                        </li>

                        <li>
                            {user ? (
                                <Link to="/analytics">Analytics</Link>
                            ) : (
                                <span className="text-gray-400 cursor-not-allowed">Analytics</span>
                            )}
                        </li>

                        <li>
                            {user ? (
                                <Link to="/countries">About</Link>
                            ) : (
                                <span className="text-gray-400 cursor-not-allowed">Countries</span>
                            )}
                        </li>

                        {
                            user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Avatar>
                                            <AvatarImage src={user?.avatar} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />

                                        <Link to="/profile" className="cursor-not-allowed">
                                            <DropdownMenuItem>
                                                <User /> Profile
                                            </DropdownMenuItem>
                                        </Link>

                                        <DropdownMenuItem>
                                            <BookA /> Notes
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem onClick={logoutHandler}>
                                            <LogOut /> Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link to="/login">
                                    <li className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                        Login
                                    </li>
                                </Link>
                            )
                        }
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
