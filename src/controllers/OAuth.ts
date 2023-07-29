import User from "../models/User";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtPayload } from "../middleware/authentication";
import axios from "axios"
import qs from 'qs';


interface GoogleOauthToken {
    id_token: string; 
    access_token:string;
}


const getGoogleOauthToken = async ({code}: {code:string}): Promise<GoogleOauthToken | undefined> => {
    const url = "https://oauth2.googleapis.com/token"
    const values = {
        code, 
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: "http://localhost:8000/auth/google/callback",
        grant_type: "authorization_code",
    }
    try {
        const data = await axios.post(url, qs.stringify(values), 
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })
        return data.data
    } catch (err) {
        console.log(err);
    }
}


const googleOauthHandler = async (req: Request, res: Response):Promise<void> => {

    const code:any = req.query.code
    
    try {
        if (!code) {
            res.status(400).send("Invalid authorization code")
            return
        }

        const googleOauthToken = await getGoogleOauthToken({code})

        if (!googleOauthToken) {
            res.status(401).send('Google OAuth token not found');
            return;
          }

        const { id_token } = googleOauthToken;

        if (id_token) {
            const googleUser = jwt.decode(id_token) as {
                email?: string,
                name?: string,
                picture?: string,
            }
            try {
                const user = await User.findOneAndUpdate({
                    email: googleUser?.email,
                }, {
                    email: googleUser?.email, 
                    name: googleUser?.name,
                    picture: googleUser?.picture
                }, {
                    upsert: true, 
                    new: true
                })

                const googleToken =  user?.createJWT()
                res.cookie("token", googleToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 24 * 60 * 60 * 1000,
                  });

            } catch(err) {
                console.log(err);
            }
        }
        res.redirect("http://localhost:3000")

    } catch (err) {
        console.log(err);
    }

}

export default googleOauthHandler
