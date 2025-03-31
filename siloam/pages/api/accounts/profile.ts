// THIS ENDPOINT TO BE USED BY LOGGED IN USERS TO EDIT THEIR PROFILE
// CAN BE USED BY USERS AND ADMINS
// EXAMPLE OF A LOGGED IN PROTECTED PATH

import prisma from "@/utils/db";
import { verifyToken, attemptRefreshAccess, verifyTokenLocal, hashPassword } from "@/utils/auth";
import { verifyFirstname, verifyLastname, verifyPassword, verifyPhonenumber, verifyUsername } from "@/utils/verification";
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

        // api middleware (USE THIS TO REFRESH/GET THE TOKEN DATA)
    // ======== TOKEN HANDLING STARTS HERE ==========
    const { x_refreshToken } = req.headers;
    var payload = null
    try {
        // attempt to verify the provided access token!!
        payload = verifyToken(req.headers.authorization);
    } catch (err) {
        // this happens if we can't succesfully verify the access token!!
        try {
            // attempt to refresh access token using refresh token
            console.log(err)
            let new_accessToken
            if (x_refreshToken) {
                new_accessToken = attemptRefreshAccess(x_refreshToken);
            } else {
                // no Refresh token, so we have Token Error
                return res.status(401).json({
                    error: "Token Error",
                });
            }
            if (!new_accessToken) {
                // new access token not generated!
                return res.status(401).json({
                    error: "Token Error",
                });
            }
            // set the payload to be correct using new access token
            payload = verifyTokenLocal(new_accessToken)

            if (!payload) {
                // new access token not generated!
                return res.status(401).json({
                    error: "Token Error",
                });
            }
        } catch (err) {
            // refresh token went wrong somewhere, push token error
            console.log(err)
            return res.status(401).json({
                error: "Token Error",
            });
        }
    }
    if (!payload) {
        // access token verification failed
        try {
            // attempt to refresh access token with refresh token
            let new_accessToken
            if (x_refreshToken) {
                new_accessToken = attemptRefreshAccess(x_refreshToken);
            } else {
                // no Refresh token, so we have Token Error
                return res.status(401).json({
                    error: "Token Error",
                });
            }
            if (!new_accessToken) {
                // new access token not generated!
                return res.status(401).json({
                    error: "Token Error",
                });
            }
            // set the payload to be correct using new access token
            payload = verifyTokenLocal(new_accessToken)

            if (!payload) {
                // new access token not generated!
                return res.status(401).json({
                    error: "Token Error",
                });
            }
        } catch (err) {
            console.log(err)
            return res.status(401).json({
                error: "Token Error",
            });
        }
    }

    // if we get here, assume that payload is correct!
    // ========== TOKEN HANDLING ENDS HERE ==========

    // actual api starts
    if (req.method === "GET") {
        // Retrieve the profile of the logged in user
        try {

            const user = await prisma.user.findUnique({
                where: {
                    username: payload.username,
                }, select: {
                    username: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true,
                    phoneNumber: true,
                    createdAt: true,
                    updatedAt: true,
                    deleted: true,
                    role: true,
                },
            })
            if (!user) {
                return res.status(200).json({
                    message: "Requested user could not be found",
                });
            }

            if (user.deleted) {
                return res.status(401).json({
                    error: "User has been deleted! Please contact Support!",
                });
            }
            res.status(200).json({ user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "ERROR RETRIEVING PROFILE. PLEASE TRY AGAIN OR CONTACT SUPPORT!",
            });
        }


    } else if (req.method === "PUT") {
        // edit profile of currently logged in user
        // cannot edit email or role!
        // returns the newly modified profile
        const { username, password, firstName, lastName, avatar, phoneNumber } = req.body;
        try {
            // Mofify the account to have the provided info

            // verify all inputs

            if (firstName && !verifyFirstname(firstName)) {
                return res.status(400).json({
                    error: "FIRSTNAME SHOULD BE ALPHABETICAL CHARACTERS of at least length 2",
                });
            }

            if (lastName && !verifyLastname(lastName)) {
                return res.status(400).json({
                    error: "LASTNAME SHOULD BE ALPHABETICAL CHARACTERS of at least length 2",
                });
            }

            if (phoneNumber && !verifyPhonenumber(phoneNumber)) {
                return res.status(400).json({
                    error: "INVALID PHONENUMBER FORMAT",
                });
            }

            if (password && !verifyPassword(password)) {
                return res.status(400).json({
                    error: "PASSWORD SHOULD BE AT LEAST 8 Characters, with 1 uppercase, 1 lowercase, 1 number, 1 special char",
                });
            }

            if (username && !verifyUsername(username)) {
                return res.status(400).json({
                    error: "USERNAME SHOULD BE ALPHA-NUMERIC or underscore OF AT LEAST LENGTH 2",
                });
            }

            const user = await prisma.user.findUnique({
                where: {
                    username: payload.username,
                },
            })

            if (!user) {
                return res.status(400).json({
                    error: "Requested user could not be found",
                });
            }

            if (user.deleted) {
                return res.status(401).json({
                    error: "User has been deleted! Please contact Support!",
                });
            }

            const salt = user.salt

            var new_password = undefined
            if (password) {
                new_password = await hashPassword(password, salt)
            }

            if (password && new_password === undefined) {
                throw new Error("New password creation error")
            }

            if (username) {
                // check if user already exists
                const userExists = await prisma.user.findUnique({
                    where: {
                        username: username,
                    },
                })
                if (userExists) {
                    return res.status(400).json({
                        error: "USER ALREADY EXISTS",
                    });
                }
            }

            // if (email) {
            //     // check for email uniqueness
            //     const userExists2 = await prisma.user.findUnique({
            //         where: {
            //             email: email,
            //         },
            //     })
            //     if (userExists2) {
            //         return res.status(400).json({
            //             error: "USER ALREADY EXISTS",
            //         });
            //     }
            // }

            const updated_user = await prisma.user.update({
                where: {
                    username: payload.username,
                },
                data: {
                    username,
                    password: new_password,
                    salt: salt,
                    firstName,
                    lastName,
                    avatar,
                    phoneNumber,
                },
                select: {
                    username: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true,
                    phoneNumber: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    deleted: true,
                },
            });
            return res.status(201).json({ updated_user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "ERROR MODIFIYING PROFILE. PLEASE TRY AGAIN OR CONTACT SUPPORT!",
            });
        }
    } else if (req.method === "DELETE") {
        // only delete their own account
        try {

            const user = await prisma.user.findUnique({
                where: {
                    username: payload.username,
                },
            })
            if (!user) {
                return res.status(400).json({
                    message: "Requested user could not be found! This is not expected, please contact support!",
                });
            }

            if (user.deleted) {
                return res.status(200).json({
                    error: "User has already been deleted! Please contact Support!",
                });
            }

            // await prisma.user.delete({
            //     where: {
            //         username: username,
            //     },
            // });

            const updated_user = await prisma.user.update({
                where: {
                    username: payload.username,
                },
                data: {
                    deleted: true,
                },
                select: {
                    username: true,
                },
            });
            return res.status(200).json({ message: "Account deleted successfully" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Error logging in! Unsuccessful! Please try again!",
            });
        }
    }
    // placeholder return
    res.status(405).json({ error: "Method not allowed" });
}