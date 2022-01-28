import React,{Fragment} from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import {getGithubRepos}  from "../../actions/profile"
import { useEffect } from 'react/cjs/react.development';
import Spinner from "../layouts/Spinner"

const ProfileGithub = ({getGithubRepos,repos,username}) => {

    useEffect(()=>{
        getGithubRepos(username)
    },[getGithubRepos,username])
    return (
        <Fragment>
            {repos === null ? <Spinner /> : repos.map((repo,index)=> (
            <div key={repo._id} className="repo bg-white p-1 my-1">
            <div>
              <h4><a href={repo.html_url} target="_blank"
                  rel="noopener noreferrer">{repo.name}</a></h4>
              <p>
              {repo.description}
              </p>
            </div>
            <div>
              <ul>
                <li className="badge badge-primary">{repo.stargazers_count}</li>
                <li className="badge badge-dark">{repo.watchers_count}</li>
                <li className="badge badge-light">{repo.forks_count}</li>
              </ul>
            </div>
           </div>
             ) )}

        </Fragment>
    )
}

ProfileGithub.propTypes = {
getGithubRepos:PropTypes.func.isRequired,
username:PropTypes.string.isRequired,
repos:PropTypes.array.isRequired
}

const mapStateToProps = state =>({
    repos : state.profile.repos
})

export default connect(mapStateToProps,{getGithubRepos})(ProfileGithub);
