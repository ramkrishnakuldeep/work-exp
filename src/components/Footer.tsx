import React from "react";
import "../image.scss";
const Footer = (props: any) => {
  return (
    <footer className="py-2 bg-white md:py-4 action">
        {props.children}
    </footer>
  );
};

export default Footer;
