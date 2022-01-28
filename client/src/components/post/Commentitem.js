import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import formatDate from "../../util/formatDate";
import { Link } from "react-router-dom";
import { deleteComment } from "../../actions/post";

function CommentItem({
  post:{name,avatar},
  comment: { text, date,_id, user },
  postId,
  auth,
  deleteComment,
}) {
  return (
    <Fragment>
      <div className="post bg-white p-1 my-1">
        <div>
          <Link to={`/profile/${user}`}>
            <img className="round-img" src={avatar} alt="" />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p className="my-1">{text}</p>
          <p className="post-date">{formatDate(date)}</p>

          {!auth.loading && user === auth.user._id && (
            <button onClick={ ()=> deleteComment(postId,_id)} type="button" className="btn btn-danger">
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>
    </Fragment>
  );
}

CommentItem.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired,
  postId:PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
