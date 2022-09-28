import React from "react";
import {
  FaFacebookF,
  FaDiscord,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
} from "react-icons/fa";

const SocialShare = [
  { Social: <FaTwitter />, link: "https://twitter.com/Rugged_Rebels" },
  { Social: <FaInstagram />, link: "https://www.instagram.com/ruggedrebellionnft" },
  { Social: <FaDiscord />, link: "https://dsc.gg/ruggedrebellion" },
  { Social: <FaFacebookF />, link: "https://www.facebook.com/" },
  { Social: <FaLinkedinIn />, link: "https://linkedin.com/" },
  { Social: <FaPinterestP />, link: "https://www.pinterest.com/" },
];

const Social = () => {
  return (
    <div className="nav social-icons justify-content-center text-sm-center justify-content-md-end">
      {SocialShare.map((val, i) => (
        <a key={i} href={`${val.link}`} rel="noreferrer" target="_blank">
          {val.Social}
        </a>
      ))}
    </div>
  );
};

export default Social;
