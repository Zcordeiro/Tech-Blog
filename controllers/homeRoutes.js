const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

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
    } catch (err) {
        console.error("!!ERROR!! LOOK HERE", err);
        res.status(500).json(err);
    }
});


router.get('/blog/:id', withAuth, async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['name']
            }],
            include: [{
                model: Comment,
                attributes: ['comment_data', 'date_added', 'user_id'],
                include: [{
                    model: User,
                    attributes: ['name']
                }],
            }]
        });
        const blog = blogData.get({ plain: true });
        res.render('blog', blog);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);

    }
});


router.get('/profile', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ 
                model: Blog, 
                attributes: ['blog_title', 'blog_content', 'date_added'],
                include: [{
                    model: User,
                    attributes: ['name']
                }]
            }]
        });

        const user = userData.get({ plain: true });
        console.log(user);

        res.render('profile', {
            ...user,
            logged_in: true
        });

    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
        res.redirect('/profile');
        return;
    }

    res.render('login');
});

module.exports = router;
