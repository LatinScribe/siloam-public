import { SessionContext } from "@/contexts/session";
import React, { useContext, useState, useEffect } from "react";
import { login, getProfile, editProfile, deleteAccount } from "@/utils/accountInterface";
import { useRouter } from "next/router";
import { Button } from "../ui/button";
import { Session, User } from "@/utils/types";
import { API_URL } from "@/utils/dataInterface";
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
import { Sheet } from "lucide-react";
import { Input } from "../ui/input";

export default function ProfilePage() {
    const { session, setSession, logout } = useContext(SessionContext);

    const router = useRouter();

    if (!session) {
        router.push("/login");
    }
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [profile, setProfile] = useState<User | null>(null);

    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [avatar, setAvatar] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setSuccessMessage] = useState<string | null>(null);
    const [updatedAt, setUpdatedAt] = useState<string | null>(null);
    const [createdAt, setCreatedAt] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (session) {
            getProfile(session.accessToken, session.refreshToken)
                .then((profile) => {
                    setProfile(profile);
                    setUsername(profile.username);
                    setFirstName(profile.firstName || "");
                    setLastName(profile.lastName || "");
                    setPhoneNumber(profile.phoneNumber || "");
                    setAvatar(profile.avatar || "");
                    setEmail(profile.email);
                    setUpdatedAt(profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : "Unknown");
                    setCreatedAt(profile.createdAt ? new Date(profile.createdAt).toLocaleString() : "Unknown");
                })
                .catch((error) => console.error("Failed to fetch profile:", error));
        }
    }, [session]);

    function handelProfileChange() {
        if (session?.accessToken && session?.refreshToken) {
            var username_in = undefined
            if (session.user.username !== username) {
                username_in = username;
            }

            var password_in = undefined
            if (password !== "") {
                password_in = password
            }

            editProfile(session.accessToken, session.refreshToken, avatar, phoneNumber, firstName, lastName, username_in, password_in)
                .then((updated_profile) => {
                    setError(null);
                    setSuccessMessage("Profile updated successfully!");
                    if (session.user.username !== username) {
                        logout();
                        router.push("/login");
                    }

                    setUpdatedAt(updated_profile.updatedAt ? new Date(updated_profile.updatedAt).toLocaleString() : "Unknown");
                    setCreatedAt(updated_profile.createdAt ? new Date(updated_profile.createdAt).toLocaleString() : "Unknown");
                })
                .catch((error) => {
                    // handle token error
                    if (error === "Token Error") {
                        logout();
                        router.push("/login");
                    }
                    console.error("Registration failed:", error);
                    setError(error.message || "Registration failed");
                });

        } else {
            setError("Session tokens are missing");
        }
    }

    function handelDeleteAccount() {
        if (session?.accessToken && session?.refreshToken) {
            var username_in = undefined
            if (session.user.username !== username) {
                username_in = username;
            }

            var password_in = undefined
            if (password !== "") {
                password_in = password
            }

            deleteAccount(session.accessToken, session.refreshToken)
                .then(() => {
                    setError(null);
                    setSuccessMessage("Account Deleted successfully!");
                    logout();
                    router.push("/");
                })
                .catch((error) => {
                    // handle token error
                    if (error === "Token Error") {
                        logout();
                        router.push("/login");
                    }
                    console.error("Registration failed:", error);
                    setError(error.message || "Registration failed");
                });

        } else {
            setError("Session tokens are missing");
        }
    }

    // from https://gist.github.com/amirhp-com/ffaa19639912f587e67aaabe26b5c728
    // you can try: https://henrytchen.com/images/Profile3_compressed.jpg
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
        <div className="flex flex-col items-center justify-center h-screen text-textcolor">
            {(avatar && isValid(avatar)) ? (
                <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
                    <img src={avatar} alt="Profile Avatar" className="w-24 h-24 rounded-full object-cover" />
                </div>
            ) : (
                <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
                    <img src={API_URL + "/no-avatar.png"} alt="No Avatar" className="w-24 h-24 rounded-full object-cover" />
                </div>
            )}

            <h1 className="text-3xl font-semibold p-4">Profile</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg p-4">
                <Input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />
                <Input
                    type="text"
                    placeholder="New Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                    autoComplete="off"
                />
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Choose new Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                    autoComplete="off"
                />
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                    autoComplete="off"
                />
                <Input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                    autoComplete="off"
                />
                <Input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                    autoComplete="off"
                />
                <Input
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                    autoComplete="off"
                />
                <Input
                    type="text"
                    placeholder="Avatar (URL)"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                    autoComplete="off"
                />
                <div className="relative" data-tooltip-target="tooltip-default">
                    <Input
                        type="text"
                        placeholder="Email (current)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full cursor-not-allowed"
                        autoComplete="off"
                        disabled
                    />
                    <div id="tooltip-default" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                        Tooltip content
                        <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 tooltip">
                    </div>
                </div>
                <div className="col-span-1 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                    <input
                        type="checkbox"
                        checked={showPassword}
                        // onChange={() => setShowPassword(!showPassword)}
                        className="mr-2 cursor-pointer"
                    />
                    <label className="cursor-pointer">Show Password</label>
                </div>
                <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">

                    <Button onClick={handelProfileChange} className="col-span-1">
                        Edit profile
                    </Button>

                    <AlertDialog >
                        <AlertDialogTrigger asChild>
                            <Button>
                                Delete Account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-background">
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Confirm Delete
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {session?.user?.username}, are you sure you want to Delete your account?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handelDeleteAccount} className="bg-destructive">
                                    Delete Account
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>
                {error && (
                    <div className="col-span-1 md:col-span-2 text-red-500 text-center mt-4">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="col-span-1 md:col-span-2 text-green-500 text-center mt-4">
                        {message}
                    </div>
                )}

                {createdAt && (
                    <div className="col-span-1 md:col-span-2 text text-center mt-4">
                        {
                            "Account created at: " + String(createdAt)}
                    </div>
                )}

                {updatedAt && (
                    <div className="col-span-1 md:col-span-2 text text-center mt-4">
                        {"Account updated at: " + String(updatedAt)}
                    </div>
                )}
            </div>
        </div>
    );
}