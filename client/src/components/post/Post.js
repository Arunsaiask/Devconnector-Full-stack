import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { getPost } from "../../actions/post";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layouts/Spinner";
import PostItem from "../posts/PostItem";
import Commentform from "../post/Commentform";
import Commentitem from "../post/Commentitem";

function Post({ getPost, post: { post, loading } }) {
  const params = useParams();
  useEffect(() => {
    getPost(params.id);
  }, [getPost, params.id]);
  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
    <section className="container" >
      <Link to="/posts" className="btn">
        Back To Posts
      </Link>
      <PostItem post={post} />
      <Commentform id={post._id} />
      <div className="comments">
      {post.comments.map((comment) => (
        <Commentitem key={comment.id} comment={comment} post={post} postId={post._id} />
      ))}
      </div>
      </section>
    </Fragment>
  );
}

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPost})(Post);
