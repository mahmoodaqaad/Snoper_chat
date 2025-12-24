const db = require("../Config/db");

const searchAll = (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Search query is required" });

    const searchQuery = `%${query}%`;

    // Search users
    const sqlUsers = "SELECT id, name, profilePhoto FROM users WHERE name LIKE ? LIMIT 5";

    // Search posts
    const sqlPosts = "SELECT postId, title, images FROM posts WHERE title LIKE ? LIMIT 5";

    db.query(sqlUsers, [searchQuery], (err, users) => {
        if (err) return res.status(500).json({ message: "Error searching users", error: err });

        db.query(sqlPosts, [searchQuery], (err, posts) => {
            if (err) return res.status(500).json({ message: "Error searching posts", error: err });

            // Process post images (parsing JSON)
            const processedPosts = posts.map(post => ({
                ...post,
                images: post.images ? JSON.parse(post.images) : []
            }));

            return res.json({
                users: users,
                posts: processedPosts
            });
        });
    });
};

module.exports = { searchAll };
