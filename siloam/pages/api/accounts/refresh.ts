// This endpoint is used to GENERATE A ACCESS TOKEN FOR THE GIVEN REFRESH TOKEN

import { generateAccessToken, verifyTokenLocal } from "@/utils/auth";

import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    const {refreshToken} = req.body;

    if (!refreshToken) {
        return res.status(400).json({
        error: "Please provide all the required fields",
        });
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }

  // check the refresh token
  let payload = null
  try{
  // handle the refresh token (eventually, we should push the login page again if we get an expired token!!!!)
  payload = verifyTokenLocal(refreshToken);
  } catch (err) {
    console.log(err)
    return res.status(401).json({
      error: "Token Error",
    });
  }
  if (!payload) {
    return res.status(401).json({
      error: "Token Error",
    });
  }

  // set to be a day from now
  const milliseconds_hour = new Date().getTime() + (1 * 60 * 60 * 1000);
  // one_hour_later.setHours(one_hour_later.getHours() + 1)
  const one_hour_later = new Date(milliseconds_hour)

  const Accesstoken = generateAccessToken({ role: payload.role, username: payload.username, expiresAt: one_hour_later});

  // log the tokens
  const now = new Date();
  const access_payload = verifyTokenLocal(Accesstoken)
  if (access_payload === null) {
    throw new Error('Could not verify access token')
  }
  console.log(`Access token created at: ${now} with expiration time: ${new Date(access_payload.expiresAt)}`)

  return res.status(200).json({
    "accessToken": Accesstoken,
  });

}