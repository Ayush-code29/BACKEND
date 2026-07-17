import express from 'express'
import cors from "cors";
const app = express()
app.use(cors());
const port = process.env.PORT || 3000
console.log(port)
app.get('/api/jokes',(req,res)=>{
  const jokes = [
    {
      id:1,
      "joke":"This is joke 1",
    },
    {
      id:2,
      joke:"This is joke 2"
    }
  ]
  res.send(jokes)
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