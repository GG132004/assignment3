import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { update } from '../../actions/auth'

const EditProfile = ({
    loading,
    auth: { user },
    update
}) => {
    const [formData, setFormData] = useState({
        name: user && user.name,
        bio: user && user.bio
    });
    const [file, setFile] = useState()
    const { name, bio } = formData;
    const fileSelected = event => {
        const file = event.target.files[0]
        setFile(file)
    }


    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        update(formData, file);
    };


    return (
        <Fragment>
            <p className="lead">
                <i className="fas fa-user" /> Edit Info
            </p>
            <form className="form" onSubmit={onSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <textarea
                        type="text"
                        placeholder="bio"
                        name="bio"
                        value={bio}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <input onChange={fileSelected} type="file" required accept="image/*" ></input>
                </div>
                <input type="submit" className="btn btn-primary" value="Update" />
            </form>
            <p className="my-1">
                <Link to="/dashboard">Go back</Link>
            </p>
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { setAlert,update })(EditProfile);

