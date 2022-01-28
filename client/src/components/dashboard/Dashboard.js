import PropTypes from "prop-types";
import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";
import DashboardActions from "./DashboardActions";
import Experience from "./Experience";
import Education from "./Education";
import { deleteAccount } from "../../actions/profile";
import Spinner from "../layouts/Spinner";

function Dashboard({
  deleteAccount,
  getCurrentProfile,
  auth: { user },
  profile: { loading, profile },
}) {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment >
    <section className="container" > 
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education}/>
          <div className="my-2">
           <button onClick={()=>{
             deleteAccount()
           }} className="btn btn-danger"> <i className="fas fa-user-minus"></i>Delete my Account</button>

          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You don't have a profile, please create your profile</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create profile
          </Link>
        </Fragment>
      )}
      </section>
    </Fragment>
  );
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount:PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile,deleteAccount })(Dashboard);
