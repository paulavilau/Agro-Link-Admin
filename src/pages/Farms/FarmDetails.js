//styles
import "../Main.css";
import { useHistory, useParams } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  AuthentificationContext,
  baseUrl,
} from "../../context/authentification.context";
import { PageButtons } from "../../components/PageButtons";
import ButtonMailto from "../../utils/MailButton";

export default function FarmDetails() {
  const [farmers, setFarmers] = useState([]);
  const [isFarmersLoading, setIsFarmersLoading] = useState(false);
  const [farmersError, setFarmersError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [farmDetails, setFarmDetails] = useState({});
  const [farmUsers, setFarmUsers] = useState([]);
  const history = useHistory();
  const { id } = useParams();
  const { token } = useContext(AuthentificationContext);

  const fetchFarmDetails = useCallback(async () => {
    try {
      setIsFarmersLoading(true);
      const url = `${baseUrl}farms/${id}`;
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log(url);
      const response = await fetch(url, options);
      const farmData = await response.json();
      console.log(farmData);

      const countyUrl = `${baseUrl}farms/${id}/county`;
      const countyResponse = await fetch(countyUrl, options);
      const countyData = await countyResponse.json();

      const farmUsersUrl = `${baseUrl}farms/${id}/farmUsers`;
      const farmUsersResponse = await fetch(farmUsersUrl, options);
      const farmUsersData = await farmUsersResponse.json();
      const farmUsersArray = farmUsersData._embedded.farmUsers;
      setFarmUsers(farmUsersArray);
      console.log(farmUsersArray.length);

      setFarmDetails({
        ...farmData,
        county: countyData,
        farmUsers: farmUsersArray,
      });
      setIsFarmersLoading(false);
    } catch (error) {
      setFarmersError(error);
      setIsFarmersLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchFarmDetails();
  }, [fetchFarmDetails]);

  return (
    <>
      <Navbar />
      <div className="container-fluid centered-text" style={{ width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "50%", borderLeft: 1 }}>
            {farmDetails && (
              <>
                <h2 className="display-6 centered-text">{farmDetails.name}</h2>

                {farmDetails.county && (
                  <div>
                    {farmDetails.locality} , {farmDetails.county.name}
                  </div>
                )}
                <div>Adresă: {farmDetails.address}</div>
                <div>{farmDetails.phone}</div>
                <div>
                  Dată înscriere:{" "}
                  {farmDetails.creationDt &&
                    farmDetails.creationDt.toString().split("T")[0]}
                </div>
                <div>
                  Dată validare:{" "}
                  {farmDetails.validationDt &&
                    farmDetails.validationDt.toString().split("T")[0]}
                </div>
                <div>
                  Email contact:{" "}
                  <ButtonMailto
                    label={farmDetails.email}
                    mailto={`mailto:${farmDetails.email}`}
                  />
                </div>
                <br />
                <div>
                  <img
                    alt="imagine ferma"
                    src={farmDetails.image}
                    width="auto"
                    height={300}
                  />
                </div>
                <br />
              </>
            )}
          </div>
          <div style={{ width: "50%" }}>
            <h2 className="display-6 centered-text margin-bottom">
              Utilizatori
            </h2>
            <div
              style={{
                width: "800px",
                margin: "auto",
                paddingRight: 130,
                paddingLeft: 30,
              }}
            >
              <table
                className="table table-hover table-bordered table-striped"
                style={{ marginTop: 100 }}
              >
                <tr>
                  <th>Nume</th>
                  <th>Email</th>
                  <th>Rol</th>
                </tr>
                {farmUsers &&
                  farmUsers.map((user) => {
                    return (
                      <tr
                        key={user.id}
                        style={{
                          backgroundColor: user.role === 1 ? "#ffdee4" : "",
                        }}
                      >
                        <td>
                          <div>{user.name}</div>
                        </td>
                        <td>
                          <div>{user.email}</div>
                        </td>
                        <td>
                          {user.role === 1 ? (
                            <div>Admin</div>
                          ) : (
                            <div>Normal</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </table>
            </div>
          </div>
        </div>
        <h2 className="display-6  centered-text margin-bottom">Descriere</h2>
        <div
          style={{
            paddingTop: 10,
            paddingRight: 100,
            paddingBottom: 100,
            paddingLeft: 100,
          }}
        >
          {farmDetails.description}
        </div>
      </div>
    </>
  );
}
