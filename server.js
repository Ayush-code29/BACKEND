import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv';
const app = express()
configDotenv();
app.use(cors());
const port = process.env.PORT || 3000
console.log(port)
app.get('/api/jokes',(req,res)=>{
    res.send([
        {
            id:1,
            joke:"First joke"
        },
        {
            id:2,
            joke:"Second joke"
        }
    ])
})
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get("/twitter",(req,res)=>{
    res.send("YOU ARE ON TWITTER")
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
