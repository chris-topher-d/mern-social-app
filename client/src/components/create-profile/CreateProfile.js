import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      handle: '',
      company: '',
      website: '',
      location: '',
      status: '',
      skills: '',
      githubusername: '',
      bio: '',
      twitter: '',
      facebook: '',
      linkedin: '',
      youtube: '',
      instagram: '',
      errors: {}
    }
  }

  render() {
    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <a href="/dashboard" className="btn btn-light">
                Go Back
              </a>
              <h1 className="display-4 text-center">Create Your Profile</h1>
              <p className="lead text-center">Let's get some information to make your profile stand out</p>
              <small className="d-block pb-3">* = required field</small>
              <form action="add-experience.html">
                <div className="form-group">
                  <input type="text" className="form-control form-control-lg" placeholder="* Profile handle" name="handle" required />
                  <small className="form-text text-muted">A unique handle for your profile URL. Your full name, company name, nickname, etc (This CAN'T be changed later)</small>
                </div>
                <div className="form-group">
                  <select className="form-control form-control-lg" name="status">
                    <option value="0">* Select Professional Status</option>
                    <option value="Developer">Developer</option>
                    <option value="Junior Developer">Junior Developer</option>
                    <option value="Senior Developer">Senior Developer</option>
                    <option value="Manager">Manager</option>
                    <option value="Student or Learning">Student or Learning</option>
                    <option value="Instructor">Instructor or Teacher</option>
                    <option value="Intern">Intern</option>
                    <option value="Other">Other</option>
                  </select>
                  <small className="form-text text-muted">Give us an idea of where you are at in your career</small>
                </div>
                <div className="form-group">
                  <input type="text" className="form-control form-control-lg" placeholder="Company" name="company" />
                  <small className="form-text text-muted">Could be your own company or one you work for</small>
                </div>
                <div className="form-group">
                  <input type="text" className="form-control form-control-lg" placeholder="Website" name="website" />
                  <small className="form-text text-muted">Could be your own or a company website</small>
                </div>
                <div className="form-group">
                  <input type="text" className="form-control form-control-lg" placeholder="Location" name="location" />
                  <small className="form-text text-muted">City & state suggested (eg. Boston, MA)</small>
                </div>
                <div className="form-group">
                  <input type="text" className="form-control form-control-lg" placeholder="Skills" name="skills" />
                  <small className="form-text text-muted">Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)</small>
                </div>
                <div className="form-group">
                  <input type="text" className="form-control form-control-lg" placeholder="Github Username" name="githubusername" />
                  <small className="form-text text-muted">If you want your latest repos and a Github link, include your username</small>
                </div>
                <div className="form-group">
                  <textarea className="form-control form-control-lg" placeholder="A short bio of yourself" name="bio"></textarea>
                  <small className="form-text text-muted">Tell us a little about yourself</small>
                </div>

                <div className="mb-3">
                  <button type="button" className="btn btn-light">Add Social Network Links</button>
                  <span className="text-muted">Optional</span>
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fab fa-twitter"></i>
                    </span>
                  </div>
                  <input type="text" className="form-control form-control-lg" placeholder="Twitter Profile URL" name="twitter" />
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fab fa-facebook"></i>
                    </span>
                  </div>
                  <input type="text" className="form-control form-control-lg" placeholder="Facebook Page URL" name="facebook" />
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fab fa-linkedin"></i>
                    </span>
                  </div>
                  <input type="text" className="form-control form-control-lg" placeholder="Linkedin Profile URL" name="linkedin" />
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fab fa-youtube"></i>
                    </span>
                  </div>
                  <input type="text" className="form-control form-control-lg" placeholder="YouTube Channel URL" name="youtube" />
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fab fa-instagram"></i>
                    </span>
                  </div>
                  <input type="text" className="form-control form-control-lg" placeholder="Instagram Page URL" name="instagram" />
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes= {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(mapStateToProps)(CreateProfile);
