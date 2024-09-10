import type { EmailOtpType } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import createClient from "@/utils/supabase/api";
import { stringOrFirstString } from "@/utils/helper";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.status(405).appendHeader("Allow", "GET").end();
        return;
    }

    const queryParams = req.query;
    const token_hash = stringOrFirstString(queryParams.token_hash); // do this, since in TypeScript, there are either: string, strnigp[], or undefined
    const type = stringOrFirstString(queryParams.type);

    // both exist
    if (token_hash && type) {
        const supabase = createClient(req, res);
        const {error} = await supabase.auth.verifyOtp({
            type: type as EmailOtpType,
            token_hash
        }); // i assume that when supabase sets response header to set access token and refresh token here
        if (error) {
            console.log(error);
        } else {
            res.redirect("/"); // redirect to home page
        }
    }

    // if one is undefined, then cannot authenticate signup
    res.redirect("/signup/verification-failed");
}