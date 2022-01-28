import React, { Fragment } from "react";
import PropTypes from "prop-types";
import formatDate from "../../util/formatDate"

function ProfileEdu({ experience :{
  company,
  title,
  location,
  from,
  to,
  description
} }) {
  return (
    <Fragment>
      <div>
        <h3 className="text-dark">{company}</h3>
        <p>{formatDate(from)}-{to ? formatDate(to) : 'Now' }</p>
        <p>
          <strong>Position: </strong>{title}
        </p>
        <p>
          <strong>Description: </strong>{description}
        </p>
      </div>
    </Fragment>
  );
}

ProfileEdu.propTypes = {
  experience: PropTypes.object.isRequired,
};

export default ProfileEdu;
