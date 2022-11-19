import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import api from "../../utils/api";
const Dashboard = ({ auth: { user } }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/all");
      setData(response.data);
       console.log(response.data)
    }
    fetchData();
  }, []);

  return (
    <Fragment>
      {user &&
        <> 
          <div class="row">
            {data.map(item => (
              item._id !== user._id &&
              <div class="col-sm-12 col-md-6 col-lg-3 my-3">
                <div class="card p-2">
                  <img
                    class="card-img-top mx-auto"
                    src={`/images/` + item.imagePath}
                  />
                  <div class="card-body d-flex flex-column">
                    <div class="ratings mt-auto mb-3">
                      <p class="card-text">
                        <b>{item.name}</b>
                      </p>
                      <h5 class="card-title">
                        <a href="#">{item.bio}</a>
                      </h5>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      }
    </Fragment >
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(Dashboard);
