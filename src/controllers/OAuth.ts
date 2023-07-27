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


const findAndUpdateUser = async (query:any, update:any, options:any) => {
    return User.findOneAndUpdate(query, update, options)
}


const getGoogleOauthToken = async ({code}: {code:string}): Promise<GoogleOauthToken | undefined> => {
    const url = "https://oauth2.googleapis.com/token"
    const values = {
        code, 
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: "http://localhost:5051/auth/google/callback",
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
    if (req.query && req.query.code) {
        const code: string | string[] | undefined = req.query.code
    }
    try {
        if (!code) {
            res.status(400).send("Invalid authorization code")
            return
        }
        const {id_token} = await getGoogleOauthToken({code})

        if (id_token) {
            const googleUser = jwt.decode(id_token) as {
                email?: string,
                name?: string,
                picture?: string,
            }
            try {
                const user = await findAndUpdateUser({
                    email: googleUser?.email,
                }, {
                    email: googleUser?.email, 
                    name: googleUser?.name,
                    picture: googleUser?.picture
                }, {
                    upsert: true, 
                    new: true
                })
                console.log(user);
                // const token = await user.createJWT()
                // res.cookie('token', token, {sameSite: 'none', secure: false}).status(StatusCodes.OK).json(
                //     {user: 
                //         { name: user.getName(),
                //             email:  user.getEmail(),
                //         }, 
                //     loggedIn: true,
                //     token}
                //     )

            } catch(err) {
                console.log(err);
            }
        }
        res.redirect("http://localhost:5173/oauth/todo")

    } catch (err) {
        console.log(err);
    }


}

export default googleOauthHandler
