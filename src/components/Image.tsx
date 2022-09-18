import React from "react";
import "../image.scss";
const Image = ({
  forLabel,
  onChange,
  src,
}: {
  forLabel: string;
  onChange: any;
  src: any;
}) => {
  return (
    <div className="image-upload">
      <input
        id={forLabel}
        type="file"
        accept="image/jpeg"
        onChange={onChange}
      />
      <label htmlFor={forLabel} className="custom-file-upload">
        <div className="display-image">
          <img src={`data:image/jpeg;base64,${src}`} alt="profile" />
        </div>
      </label>
    </div>
  );
};

export default Image;
