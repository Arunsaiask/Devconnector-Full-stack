import React, { Fragment ,useState} from "react";
import PropTypes from "prop-types";
import { addNewPost } from "../../actions/post";
import { connect } from "react-redux";



function Addpost({ addNewPost}) {
  const [formData, setformData] = useState({
    text: "",
  });

  const { text } = formData;
  

  function onchange(e) {
    return setformData({ ...formData, [e.target.name]: e.target.value });
  }
   
  function onsubmit(e){
    e.preventDefault()
   addNewPost(formData)
   setformData("")
  }
  return (
    <Fragment>
    <section >
      <div className="post-form" onSubmit={onsubmit}>
        <div className="bg-primary p">
          <h3>Say Something...</h3>
        </div>
        <form className="form my-1">
          <textarea
            onChange={onchange}
            name="text"
            cols="30"
            rows="5"
            value={text}
            placeholder="Create a post"
            required
          ></textarea>
          <input type="submit" className="btn btn-dark my-1" value="Submit" />
        </form>
      </div>
      </section>
    </Fragment>
  );
}

Addpost.propTypes = {
  addNewPost: PropTypes.func.isRequired,

};


export default connect(null, { addNewPost })(Addpost);

