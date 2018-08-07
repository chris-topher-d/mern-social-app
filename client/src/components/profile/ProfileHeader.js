import React, { Component } from 'react';
import isEmpty from '../../validation/isEmpty';

class ProfileHeader extends Component {
  render() {
    const { profile } = this.props;

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3">
            <div className="row">
              <div className="col-4 col-md-3 m-auto">
                <img className="rounded-circle" src={profile.user.avatar} alt="User Avatar" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="display-4 text-center">{profile.user.name}</h1>
              <p className="lead text-center">{profile.status} {!isEmpty(profile.company) ? (<span>at {profile.company}</span>) : null}</p>
              {!isEmpty(profile.location) ? (<p>{profile.location}</p>) : null}

              <p>
                {!isEmpty(profile.website) ? (
                  <a className="text-white p-2" href={`//${profile.website}`} target='_blank'>
                    <i className="fas fa-globe fa-2x"></i>
                  </a>
                ) : null}

                {!isEmpty(profile.social && profile.social.twitter) ? (
                  <a className="text-white p-2" href={profile.social.twitter} target='_blank'>
                    <i className="fab fa-twitter fa-2x"></i>
                  </a>
                ) : null}

                {!isEmpty(profile.social && profile.social.facebook) ? (
                  <a className="text-white p-2" href={profile.social.facebook} target='_blank'>
                    <i className="fab fa-facebook fa-2x"></i>
                  </a>
                ) : null}

                {!isEmpty(profile.social && profile.social.linkedin) ? (
                  <a className="text-white p-2" href={profile.social.linkedin} target='_blank'>
                    <i className="fab fa-linkedin fa-2x"></i>
                  </a>
                ) : null}

                {!isEmpty(profile.social && profile.social.youtube) ? (
                  <a className="text-white p-2" href={profile.social.youtube} target='_blank'>
                    <i className="fab fa-youtube fa-2x"></i>
                  </a>
                ) : null}

                {!isEmpty(profile.social && profile.social.instagram) ? (
                  <a className="text-white p-2" href={profile.social.instagram} target='_blank'>
                    <i className="fab fa-instagram fa-2x"></i>
                  </a>
                ) : null}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileHeader;