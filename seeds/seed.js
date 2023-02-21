const sequelize = require('../config/connection');
const { User, Blog, Comment } = require('../models');

const userData = require('./userData.json');
const blogData = require('./blogData.json');
const commentData = require('./comment.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    for (const blogPost of blogData) {
        await Blog.create({
            ...blogPost,
            user_id: users[Math.floor(Math.random() * users.length)].id
        })
    }

    for (const comment of commentData) {
        await Comment.create({
            ...comment,
            user_id: users[Math.floor(Math.random() * users.length)].id,
            blog_id: Math.floor(Math.random() * blogData.length)
        })
    }

    // Seed not working. Tables not created under the correct name. START HERE!!!!

    process.exit(0);    
};

seedDatabase();