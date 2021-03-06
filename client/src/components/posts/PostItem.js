import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import formatDate from "../../util/formatDate";
import {likePost,unlikePost,deletePost} from "../../actions/post"

// import Spinner from "../layouts/Spinner"

function postItem({likePost,unlikePost,deletePost,
  post: { _id, user, text, name, avatar, date, likes, comments },
  auth,
}) {
  return (
    <Fragment>
      <div className="posts">
        <div className="post bg-white p-1 my-1">
          <div>
            <Link to={`/profile/${_id}`}>
              <img className="round-img" src={avatar} alt="" />
              <h4>{name}</h4>
            </Link>
          </div>
          <div>
            <p className="my-1">{text}</p>
            <p className="post-date">{formatDate(date)}</p>
            <button onClick={e=>likePost(_id)} type="button" className="btn btn-light">
              <i className="fas fa-thumbs-up"></i>
              {likes.length>0 && <span>{''}{likes.length}</span>}
              
            </button>
            <button onClick={e=>unlikePost(_id)} type="button" className="btn btn-light">
              <i className="fas fa-thumbs-down"></i>
            </button>

            <Link to={`/post/${_id}`} className="btn btn-primary">
              Discussion {""}{" "}
              {comments.length > 0 && (
                <span className="comment-count">{''} {comments.length}</span>
              )}
            </Link>
            {!auth.loading && user === auth.user._id && (
              <button onClick={e=>deletePost(_id)} type="button" className="btn btn-danger">
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

postItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps,{likePost,unlikePost,deletePost})(postItem);
