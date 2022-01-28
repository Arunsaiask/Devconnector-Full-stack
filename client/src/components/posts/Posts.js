import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PostItem from "./PostItem";
import Spinner from "../layouts/Spinner";
import { getPosts } from "../../actions/post";
import Addpost from "./Addpost";

function Posts({ post: { posts, loading }, getPosts, auth }) {
  useEffect(() => {
    getPosts();
  }, [getPosts]);
  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <section className="container">
        <h1 className="large text-primary">Posts</h1>
        <Addpost />
        <p className="lead">
          <i className="fas fa-user"></i> Welcome to the community!
        </p>
        <div className="posts">
          {posts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))}
        </div>
      </section>
    </Fragment>
  );
}

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  auth: state.auth,
});

export default connect(mapStateToProps, { getPosts })(Posts);
