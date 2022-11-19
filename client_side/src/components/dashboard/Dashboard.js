import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const Dashboard = ({ auth: { user } }) => {
  return (
    <Fragment>
      {user &&
        <>
          <img src={`/images/` + user.imagePath} height={500} width={300} /><br />
         
          <p className="lead">
            <b>Name:</b>  {user && user.name}
          </p>
          <p className="lead">
            <b>Bio:</b> {user && user.bio}
          </p>
          <button class="btn  view-btn">
            <Link to={"/edit"}>Edit Info</Link>
          </button>

        </>
      }
    </Fragment >
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(Dashboard);
