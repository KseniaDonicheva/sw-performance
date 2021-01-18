import express from 'express'
import fs from 'fs'
import staticModule from 'static-module'
import path from 'path'

const __dirname = path.resolve()
const router = express.Router()

const PAGES = [
  { path: '/', page: 'pages/home.html' },
  { path: '/content1', page: 'pages/content1.html' },
]

PAGES.forEach(({ path, page }) => {
  
  router.get(path, (req,res, next) => {
    res.render(page)
  });
 
})

router.use('/views', express.static(__dirname + '/views/', { maxAge: '0' })) // define path for partial caching - default '1y' changed to 0 to deactivate http caching, otherwise the cache changes from sw are surpressed

router.get('/sw.js', (req,res) => {
  res.set('Content-Type', 'application/javascript') //MIME type
  // const input = fs.createReadStream(`${__dirname}/sw.js`)
  const input = fs.createReadStream('sw.js')
  const toCache = [
    './views/partials/header.html',
    './views/partials/footer.html',
    './views/partials/offline.html',
    './views/bs/bootstrap.min.css',
    './views/bs/bootstrap.min.js',
    './views/bs/popper.min.js',
    './views/bs/jquery-3.3.1.slim.min.js',
  ]

 input.pipe(staticModule({   //static module is available inside js
      'static-to-cache':() => JSON.stringify(toCache, null, '  ')
 }))
 .pipe(res)
})

//Default caching headers
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache')
  next()
})

export default router
