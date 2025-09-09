import { Server } from "socket.io";

const PORT = 3005;

const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("new_comment", (comment, postId) => {
    if (postId) {
      socket.to(`blog-${postId}`).emit("new_comment", comment);
    } else {
      socket.broadcast.emit("new_comment", comment);
    }

    console.log(comment);
  });

  socket.on("delete_comment", (comment) => {
    if (comment?.postId) {
      socket.to(`blog-${comment?.postId}`).emit("delete_comment", comment);
    } else {
      socket.broadcast.emit("delete_comment", comment);
    }
  });

  socket.on("like", (like) => {
    if (like.commentId) {
      socket.to(`comment-${like.commentId}`).emit("like", like);
    } else {
      socket.broadcast.emit("like", like);
    }
  });

  socket.on("unlike", (unlike) => {
    if (unlike.commentId) {
      socket.to(`comment-${unlike.commentId}`).emit("unlike", unlike);
    } else {
      socket.broadcast.emit("unlike", unlike);
    }
  });

  socket.on("blog_like", (like) => {
    if (like.postId) {
      socket.to(`blog-${like.postId}`).emit("blog_like", like);
    } else {
      socket.broadcast.emit("blog_like", like);
    }
  });

  socket.on("blog_unlike", (unlike) => {
    if (unlike.postId) {
      socket.to(`blog-${unlike.postId}`).emit("unlike", unlike);
    } else {
      socket.broadcast.emit("blog_unlike", unlike);
    }
  });

  socket.on("blog:save-post", (saved_post) => {
    if (saved_post?.postId) {
      socket.to(`blog-${saved_post.postId}`).emit("blog:save-post", saved_post);
    } else {
      socket.broadcast.emit("blog:save-post", saved_post);
    }
  });

  socket.on("blog:delete-post", (saved_post) => {
    if (saved_post?.postId) {
      socket
        .to(`blog-${saved_post.postId}`)
        .emit("blog:delete-post", saved_post);
    } else {
      socket.broadcast.emit("blog:delete-post", saved_post);
    }
  });

  socket.on("join_blog", (blogId) => {
    socket.join(`blog-${blogId}`);
    console.log(`user join room: ${blogId}`);
  });

  socket.on("leave_blog", (blogId) => {
    socket.leave(`blog-${blogId}`);
    console.log(`user left room: ${blogId}`);
  });

  socket.on("profile:update", (profile_data) => {
    io.emit("profile:update", profile_data); // Now this will work
  });

  socket.on("profile:following", (following) => {
    io.emit("profile:following", following);
  });

  socket.on("profile:follower", (follower) => {
    io.emit("profile:follower", follower);
  });

  socket.on("profile:unfollow", (unfollow) => {
    io.emit("profile:unfollow", unfollow);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

io.listen(PORT, () => {
  console.log(`WebSocket Server is running on port ${PORT}`);
});
