import React, { useEffect, useState, useRef } from "react";
import {
  RiTruckLine,
  RiArrowDropDownLine,
  HiOutlineShoppingBag,
} from "../../styles/Icons";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import cep from "cep-promise";
import {
  Container,
  LocationInfo,
  SearchWrapper,
  ProfilePicture,
  UserProfile,
  DropDownMenu,
  DropDownItem,
  SearchIcon,
  DropDownContainer,
  SearchBar,
  Row,
  UserInfo,
  MenuWrapper,
  Menu,
  LocationDropDownContainer,
  LocationDropDown,
} from "./styles";
function Header() {
  const [logged, setLogged] = useState(false);
  const [open, setOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const dropdownRef = useRef(null);
  const [locationInfo, setLocationInfo] = useState({});

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/auth/consult`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }).then(async (res) => {
      let data = await res.json();

      switch (res.status) {
        case 200:
          setLogged(!logged);
          setUserData(data);
          break;
      }
    });
  }, []);

  useEffect(() => {
    cep(userData.cep).then((res) => {
      setLocationInfo(res);
    });
  }, [userData]);

  useEffect(() => {
    const pageClick = (e) => {
      if (
        dropdownRef.current !== null &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
        setLocationOpen(false);
      }
    };

    if (open || locationOpen) {
      window.addEventListener("click", pageClick);
    }

    return () => {
      window.removeEventListener("click", pageClick);
    };
  }, [open, locationOpen]);

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.clear();
  }

  const navigate = useNavigate();

  return (
    <Container>
      <img src="/assets/logo.png" width={60} height={60} onClick={() => navigate("/")} />
      <Row>
        <UserInfo>
          {logged ? (
            <>
              <MenuWrapper>
                <LocationInfo>
                  <div>
                    {logged ? (
                      <LocationDropDownContainer locationOpen={locationOpen}>
                        <LocationDropDown>
                          <p>Deliver to</p>
                          <h3>
                            {locationInfo.city} {locationInfo.cep}
                          </h3>
                        </LocationDropDown>
                      </LocationDropDownContainer>
                    ) : (
                      <p>Do login to see this information</p>
                    )}
                  </div>
                  <RiTruckLine size={20} onClick={() => setLocationOpen(!locationOpen)}/>
                </LocationInfo>
                <HiOutlineShoppingBag
                  onClick={() => navigate("/cart")}
                  size={20}
                />
                <Menu
                  buttonWidth={20}
                  isActive={open}
                  toggleButton={() => setOpen(!open)}
                />
              </MenuWrapper>
            </>
          ) : (
            <>
              <div className="userinfo_div" onClick={() => setOpen(!open)}>
                <strong>Login</strong>
                <RiArrowDropDownLine size={20} />
              </div>
            </>
          )}
        </UserInfo>
        <DropDownContainer open={open} ref={dropdownRef}>
          {open && (
            <DropDownMenu key={open}>
              {logged ? (
                <UserProfile>
                  <ProfilePicture
                    picture={`${process.env.REACT_APP_SERVER_URL}/files/${userData.picture}`}
                  />
                  <div className="wrapper">
                    <h3>Hi {userData.name} 👋 </h3>
                    <a href="/login" onClick={() => logout()}>
                      Log out
                    </a>
                  </div>
                </UserProfile>
              ) : (
                <UserProfile>
                  <ProfilePicture picture="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP5IU8GgSurLLlvDn7J82C_uQHCfNHaxEqP7aU2P8xSx5QfhTIZVqHYkT-g7bggRhu92w&usqp=CAU" />
                  <div className="wrapper">
                    <h3>Hi! 👋 </h3>
                    <Link to="/login">Login or register!</Link>
                  </div>
                </UserProfile>
              )}
              <DropDownItem>
                <a>Account</a>
              </DropDownItem>
              <DropDownItem
                className="cart-btn"
                onClick={() => navigate("/cart")}
              >
                <a>Cart</a>
              </DropDownItem>
              <DropDownItem>
                <a>Orders</a>
              </DropDownItem>
              <DropDownItem>
                <a>Security</a>
              </DropDownItem>
              <DropDownItem>
                <a>Privacy</a>
              </DropDownItem>
              <DropDownItem>
                <a>Wishlist</a>
              </DropDownItem>
              <DropDownItem onClick={() => navigate("/product/register")}>
                <a>Sell</a>
              </DropDownItem>
            </DropDownMenu>
          )}
        </DropDownContainer>
      </Row>
    </Container>
  );
}

export default Header;
