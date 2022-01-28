import React, { Fragment } from "react";
import PropTypes from "prop-types";
import formatDate from "../../util/formatDate";

const ProfileEducation = ({education:{
    school,degree,from,to,current,description,fieldofstudy
}}) => {
  return (
    <Fragment>
      <div>
        <h3 className="text-dark">{school}</h3>
        <p>{formatDate(from)}-{to ? formatDate(to): "Now"}</p>
        <p>
          <strong>Degree: </strong>{degree}
        </p>
        <p>
          <strong>Stream: </strong> {fieldofstudy}
        </p>
        <p>
          <strong>Description: </strong>{description}
        </p>
      </div>
    </Fragment>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired
};

export default ProfileEducation;
