import React from "react";
import "../image.scss";
const Image = ({ onChange, src }: { onChange: any; src: string }) => {
  return (
    <div className="image-upload">
      <input id="file-upload" type="file" accept="image/*" onChange={onChange} />
      <label htmlFor="file-upload" className="custom-file-upload">
        <div className="display-image">
            <img src={src} alt="profile" />
        </div>
      </label>
    </div>
  );
};

export default Image;
