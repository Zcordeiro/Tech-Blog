const router = require('express').Router();
const { Blog, User } = require('../models');

router.get('/', async (req, res) => {

    try {
        const blogData = await Blog.findAll({
            include: [{
                model: User,
                attributes: ['name']
            }]
        });

        const blogs = blogData.map((blog) => blog.get({ plain: true }));

        res.render('homepage', {
            blogs,
            logged_in: req.session.logged_in
        });
    } catch(err) {
        console.error("!!ERROR!! LOOK HERE",err);
        res.status(500).json(err);
    }
});


router.get('/blog/:id', async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['name']
            }]
        });
        const blog = blogData.get({ plain: true });
        console.log(blog);
        res.render('blog', blog);
    } catch (err) {
        res.status(500).json(err);
    }
})


router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }
  
    res.render('login');
  });

module.exports = router;
