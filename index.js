const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const Post = require('./models/Post');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const port = process.env.PORT || 3000;

// Middlewares
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// DB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(res => {
  app.listen(port);
  console.log(`Server on port ${port}`);
  console.log('Connected to DB');
})
  .catch(err => console.log(err));

// View engine
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/all-blogs', (req, res) => {
  Post.find()
    .then(result => {
      res.render('all-blogs', {posts: result})
    })
    .catch(err => console.log(err));
});

app.post('/all-blogs', (req, res) => {
  const post = new Post({
    title: req.body.title,
    body: req.body.body
  });

  post.save()
    .then(result => res.redirect('/all-blogs'))
    .catch(err => console.log(err));
});

app.get('/create-post', (req, res) => {
  res.render('create-post');
});

app.get('/post/:id', (req, res) => {
  const id = req.params.id;

  Post.findById(id)
    .then(result => {
      res.render('single-post', {post: result})
    })
    .catch(err => console.log(err));
});

app.put('/post/:id', (req, res) => {

  console.log(req.body);

  const id = req.params.id;
  const data = {
    title: req.body.title,
    body: req.body.body
  }

  Post.findByIdAndUpdate(id, {$set: data})
    .then(result => {
      res.json({redirect: `/post/${id}`});
    })
    .catch(err => console.log(err));
});

app.delete('/post/:id', (req, res) => {
  const id = req.params.id;

  Post.findByIdAndDelete(id)
    .then(result => {
      res.json({redirect: '/all-blogs'});
    })
    .catch(err => console.log(err));
});

app.get('/post/edit/:id', (req, res) => {
  const id = req.params.id;

  Post.findById(id)
    .then(result => {
      res.render('edit-post', {post: result});
    })
    .catch(err => console.log(err));
});

app.get('/about', (req, res) => {
  res.render('about');
});