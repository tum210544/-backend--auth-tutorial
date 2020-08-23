const express = require('express')
const app = express()
const mongoose = require('mongoose')
const User = require('./models/user')
mongoose.connect('mongodb://localhost:27017/sportcom_tutorial', {
  useNewUrlParser: true
})

mongoose.connection.on('error', err => {
  console.error('MongoDB error', err)
})

app.use(express.json())
// mock data
const users = [{}]

hashCode = function(s) {
    var h = 0, l = s.length, i = 0;
    if ( l > 0 )
      while (i < l)
        h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
  };

//ถ้ามีusernameนี้แล้ว จะreturn 'this username has been used' กลับไปละไม่สร้างuserเพิ่ม
app.post('/register', async (req, res) => {
  const payload = req.body
  const olduser = await User.find({ username: payload.username})
  if(olduser.length != 0){
    res.json('this username has been used')
  }
  else{
    payload.password = hashCode(payload.password)
    const user = new User(payload)
    await user.save()
    res.status(201).end()
  }
})

//ไว้ดูdbทั้งหมดเฉยๆ
app.get('/users', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

//รับ username กับ password มาถ้าไม่มีusernameนี้หรือมีแต่passwordไม่ถูกจะreturn username or password is wrong กลับไป
app.post('/users/login', async (req, res) => {
  const username = req.body.username
  const password = hashCode(req.body.password)
  const user = await User.find({ username: username, password: password })
  if(user.length == 0){
      res.json('username or password is wrong')
  }
  else{
    res.status(200)
    res.json('login successful')
  }
})


app.listen(9000, () => {
  console.log('Application is running on port 9000')
})