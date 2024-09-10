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
    const code = stringOrFirstString(queryParams.code);
    if (code) {
        const supabase = createClient(req, res);
        const {error} = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            res.redirect("/");
        }
    }

    // if one is undefined, then cannot authenticate signup
    res.redirect("/signup/verification-failed");
}