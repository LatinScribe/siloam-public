import Link from "next/link";
import { SessionContext } from "@/contexts/session";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { CodeIcon, FaceIcon, MixIcon, Pencil2Icon, PersonIcon } from "@radix-ui/react-icons";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch";
import { Label } from "./ui/label";
import { MenuIcon, MoonIcon } from "lucide-react";
import { useReward } from 'react-rewards';

export default function NavBar() {
    const { session, logout } = useContext(SessionContext);
    const { theme, setTheme } = useTheme();

    const { reward, isAnimating } = useReward('rewardId', 'confetti');

    useEffect(() => {
        console.log('aaaa')
        console.log(session);
    }, []);

    let isValid = function (urlTocheck = "", defaultValue = false) {
        var image = new Image();
        image.src = urlTocheck;
        if (image.width == 0) {
            return defaultValue;
        } else {
            return true;
        }
    }

    return (
        <div>
            <nav className="flex justify-between p-4 align-center items-center">
                <div className="hidden md:flex space-x-4 items-center">
                    <Link href="/" className="font-bold flex gap-1 items-center hover:text-gray-300" id='rewardId' onClick={reward}>
                        <MixIcon />
                        Siloam
                    </Link>
                    <Link href="/describe-image" className="hover:text-gray-300">
                        Describe Image
                    </Link>
                    <Link href="/generate-image-link" className="hover:text-gray-300">
                        Generate Image Link
                    </Link>
                    <Link href="/describe-image-legacy" className="hover:text-gray-300">
                        Describe Image *Legacy*
                    </Link>
                </div>
                <div className="flex md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button>
                                <MenuIcon />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="bg-background gap-3 flex flex-col">
                            <SheetHeader>
                                <SheetTitle>Siloam</SheetTitle>
                            </SheetHeader>
                            <ul className="space-y-4">
                                <li>
                                    <Link href="/" className="font-bold hover:text-gray-300">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/describe-image" className="hover:text-gray-300">
                                        Describe Image
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/generate-image-link" className="hover:text-gray-300">
                                        Generate Image Link
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/describe-image-legacy" className="hover:text-gray-300">
                                        Describe Image *Legacy*
                                    </Link>
                                </li>
                            </ul>
                        </SheetContent>
                    </Sheet>
                </div>
                <ul className="flex space-x-4 items-center">
                    <li>
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="theme-switch" className='flex items-center'>
                                <MoonIcon className='h-4' />
                                Dark Mode
                            </Label>
                            <Switch
                                id="theme-switch"
                                checked={theme === "dark"}
                                onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
                                className="bg-primary"
                            />
                        </div>
                    </li>
                    {session ? (
                        <li>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button className="flex items-center space-x-1">
                                        {(session?.user?.avatar && isValid(session.user.avatar)) ? (
                                            <div className="flex justify-center items-center">
                                                <img src={session.user.avatar} alt="Profile Avatar" className="w-7 h-7 rounded-full object-cover" />
                                            </div>
                                        ) : (
                                            <PersonIcon />
                                        )}
                                        <div className='hidden sm:block'>{session?.user?.username}</div>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="bg-background gap-3 flex flex-col">
                                    <SheetHeader>
                                        <SheetTitle>User Menu</SheetTitle>
                                        <SheetDescription>
                                            All of your user options in one place.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <ul className="space-y-4">
                                        <li>
                                            <Link href="/my-templates" className="flex items-center space-x-2">
                                                <CodeIcon />
                                                <span>My Templates</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/my-blogs" className="flex items-center space-x-2">
                                                <Pencil2Icon />
                                                <span>My Blogs</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/profile" className="flex items-center space-x-2">
                                                <PersonIcon />
                                                <span>Manage Profile</span>
                                            </Link>
                                        </li>
                                        {session?.user?.role === "ADMIN" && (
                                            <>
                                                <li>
                                                    <Link href="/admin-content" className="flex items-center space-x-2 text-primary">
                                                        <FaceIcon />
                                                        <span>(Admin) Moderation</span>
                                                    </Link>
                                                </li>

                                                <li>
                                                    <Link href="/admin-account" className="flex items-center space-x-2 text-primary">
                                                        <FaceIcon />
                                                        <span>(Admin) User Management</span>
                                                    </Link>
                                                </li>
                                            </>
                                        )}
                                        <li>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button>
                                                        Logout
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="bg-background">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Confirm Logout
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            {session?.user?.username}, are you sure you want to logout?
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction onClick={logout} className="bg-destructive">
                                                            Logout
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </li>
                                    </ul>
                                </SheetContent>
                            </Sheet>
                        </li>
                    ) : (
                        <li className="flex flex-col sm:flex-row sm:space-x-2">
                            <Link href="/register">
                                <Button className="w-full sm:w-auto">
                                    Signup
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button className="w-full sm:w-auto">
                                    Login
                                </Button>
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
}
