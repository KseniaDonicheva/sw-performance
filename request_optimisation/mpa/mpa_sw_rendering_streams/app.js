import express from 'express';
import nunjucks from 'nunjucks';
import router from './router.js';

const PORT = 3000

const app = express()
app.set('view engine', 'html')

nunjucks.configure(['views/'], {
  autoescape: false,
  express: app
})

app.use(router)

app.listen(PORT, () => {
  console.log(`started on port ${PORT}`)
})

