import { SessionContext } from "@/contexts/session";
import React, { useContext, useState, useEffect } from "react";
import { login, getProfile, editProfile, deleteAccount, getProfileADMIN, editProfileADMIN, deleteAccountADMIN } from "@/utils/accountInterface";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


export default function AdminProfile() {
    const { session, setSession, logout } = useContext(SessionContext);

    const router = useRouter();
    const { query } = router;
    const username_query = query.username ? decodeURIComponent(query.username as string) : "";

    if (!session) {
        router.push("/login");
    }

    if (session?.user.role !== "ADMIN") {
        router.push("/");
    }
    const [username, setUsername] = useState("");
    const [oldusername, setOldUsername] = useState("");
    const [password, setPassword] = useState("");
    const [profile, setProfile] = useState<User | null>(null);

    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [oldemail, setOldEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [avatar, setAvatar] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setSuccessMessage] = useState<string | null>(null);
    const [updatedAt, setUpdatedAt] = useState<string | null>(null);
    const [createdAt, setCreatedAt] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [userRole, setUserRole] = useState("USER");

    useEffect(() => {
        if (session) {
            if (typeof username_query === 'string') {
                setOldUsername(username_query);
                editProfileADMIN(username_query, session.accessToken, session.refreshToken)
                    .then((profile) => {
                        setProfile(profile);
                        setUsername(profile.username);
                        setFirstName(profile.firstName || "");
                        setLastName(profile.lastName || "");
                        setPhoneNumber(profile.phoneNumber || "");
                        setAvatar(profile.avatar || "");
                        setEmail(profile.email);
                        setOldEmail(profile.email);
                        setUpdatedAt(profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : "Unknown");
                        setCreatedAt(profile.createdAt ? new Date(profile.createdAt).toLocaleString() : "Unknown");
                        setUserRole(profile.role);
                    })
                    .catch((error) => {
                        console.error("Failed to fetch profile:", error);
                        setError(error.message || "Failed to fetch profile");
                    });
            } else {
                console.error("Invalid username query");
            }
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
            var email_in = undefined
            if (email !== oldemail) {
                email_in = email
            }

            editProfileADMIN(oldusername, session.accessToken, session.refreshToken, username, email_in, userRole, avatar, phoneNumber, firstName, lastName, password_in)
                .then((updated_profile) => {
                    setError(null);
                    setSuccessMessage("Profile updated successfully!");
                    if (session.user.username !== username) {
                        //logout();
                        //router.push("/login");
                    }

                    setUpdatedAt(updated_profile.updatedAt ? new Date(updated_profile.updatedAt).toLocaleString() : "Unknown");
                    setCreatedAt(updated_profile.createdAt ? new Date(updated_profile.createdAt).toLocaleString() : "Unknown");
                    setUsername(updated_profile.username);
                    setFirstName(updated_profile.firstName || "");
                    setLastName(updated_profile.lastName || "");
                    setPhoneNumber(updated_profile.phoneNumber || "");
                    setAvatar(updated_profile.avatar || "");
                    setEmail(updated_profile.email);
                    setOldEmail(updated_profile.email);
                    setOldUsername(updated_profile.username);
                    setUserRole(updated_profile.role);

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

            deleteAccountADMIN(oldusername, session.accessToken, session.refreshToken)
                .then(() => {
                    setError(null);
                    setSuccessMessage("Account Deleted successfully!");
                    router.push("/admin-account");
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
    function handelAccountReturn() {
        router.push("/admin-account");
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
            <div className="bg-yellow-600 text-black w-full text-center p-2">
                This is admin sorcery, I sure hope you know what you are doing!
            </div>
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
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Email (current)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                        autoComplete="off"
                    />
                </div>
                <div className="col-span-1 md:col-span-2 flex items-center">
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                        className="mr-2"
                    />
                    <label>Show Password</label>
                </div>
                <div className="col-span-1 md:col-span-2 flex items-center">
                    <label className="mr-2">Role:</label>
                    <Select value={userRole} onValueChange={(value: string) => setUserRole(value)}>
                        <SelectTrigger className="p-2 border border-gray-300 rounded w-24">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USER">User</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                    </Select>
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
                                    Are you sure you want to Delete the account for {oldusername}
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
                    <div className="col-span-1 md:col-span-2 text-red-500 text-center mt-4 p-4">
                        {error}
                        <Button onClick={handelAccountReturn} className="col-span-1 mt-2">
                            Go back to account selection
                        </Button>
                    </div>
                )}
                {message && (
                    <div className="col-span-1 md:col-span-2 text-green-500 text-center mt-4 p-4">
                        {message}
                    </div>
                )}
                {createdAt && (
                    <div className="col-span-1 md:col-span-2 text text-center mt-4 p-4">
                        {"Account created at: " + String(createdAt)}
                    </div>
                )}
                {updatedAt && (
                    <div className="col-span-1 md:col-span-2 text text-center mt-4 p-4">
                        {"Account updated at: " + String(updatedAt)}
                    </div>
                )}
            </div>
        </div>
    );
}