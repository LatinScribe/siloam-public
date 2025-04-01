// MUST BE AN ADMIN TO USE THIS ENDPOINT
// CAN BE USED TO REGISTER BOTH USERS AND ADMINS

import { hashPassword, generateSalt, verifyToken, attemptRefreshAccess, verifyTokenLocal } from "@/utils/auth";
import { verifyEmail, verifyFirstname, verifyLastname, verifyPassword, verifyPhonenumber, verifyUsername, verifyRole } from "@/utils/verification";
import prisma from "@/utils/db";

import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // api middleware (USE THIS TO REFRESH/GET THE TOKEN DATA)
    // ======== TOKEN HANDLING STARTS HERE ==========
    const { x_refreshToken } = req.headers;
    let payload = null
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

    if (payload.role !== "ADMIN") {
        return res.status(403).json({
            error: "Forbidden",
        });
    }

    // actual api starts

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { username, password, firstName, lastName, email, avatar, phoneNumber, role, output_bool } = req.body;

    let output = output_bool
    // check if user wants output. Default to false!
    if (!output || typeof output !== "boolean") {
        output = false
    }

    // currently only requiring username, password, email, and role
    if (!username || !role || !password || !email) {
        return res.status(400).json({
            error: "Please provide all the required fields",
        });
    }
    if (role !== "USER" && role !== "ADMIN") {
        return res.status(400).json({
            error: "ROLE MUST BE USER or ADMIN",
        });
    }

    try {
        // verify all inputs
        if (!verifyEmail(email)) {
            return res.status(400).json({
                error: "INVALID EMAIL FORMAT",
            });
        }

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

        if (!verifyPassword(password)) {
            return res.status(400).json({
                error: "PASSWORD SHOULD BE AT LEAST 8 Characters, with 1 uppercase, 1 lowercase, 1 number, 1 special char",
            });
        }

        if (!verifyUsername(username)) {
            return res.status(400).json({
                error: "USERNAME SHOULD BE ALPHA-NUMERIC or underscore OF AT LEAST LENGTH 2",
            });
        }

        if (!verifyRole(role)) {
            return res.status(400).json({
                error: "ROLE MUST BE EITHER USER OR ADMIN",
            })
        }

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

        // check for email uniqueness
        const userExists2 = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })
        if (userExists2) {
            return res.status(400).json({
                error: "USER ALREADY EXISTS",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Prisma error!",
        });
    }

    try {

        const salt = await generateSalt()
        console.log("Gengerated salt: " + salt);
        const user = await prisma.user.create({
            data: {
                username,
                password: await hashPassword(password, salt),
                salt: salt,
                firstName,
                lastName,
                email,
                avatar,
                phoneNumber,
                role,
            },
            select: {
                id: true,
                username: true,
                role: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                phoneNumber: true,
                createdAt: true,
            },
        });
        if (output) {
            return res.status(201).json({ user });
        } else {
            return res.status(201).json({ message: "User created sucessfully!" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error creating user! Unsuccessful! Please try again!",
        });
    }
}
