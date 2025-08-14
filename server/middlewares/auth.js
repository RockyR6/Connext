// export const protect = async (req, res, next) => {
//     try {
//         const {userId} = await req.auth()
//         if(!userId){
//             return res.json({
//                 success: false,
//                 message: "not authenticated"
//             })
//         }
//         next()
//     } catch (error) {
//         res.json({success:false, message: error.message})
//     }
// }

// middlewares/protect.js
import { requireAuth } from "@clerk/express";

export const protect = requireAuth();
