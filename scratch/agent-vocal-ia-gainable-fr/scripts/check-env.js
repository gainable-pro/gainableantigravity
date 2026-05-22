import dotenv from 'dotenv';
dotenv.config();
console.log("PORT:", process.env.PORT);
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 15) + "..." : "undefined");
