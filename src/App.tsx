import React, { useEffect, useState } from "react";
import "./App.scss";
import Work from "./components/Work";
import uuid from "react-uuid";
import axios from "axios";
import Image from "./components/Image";

const fixedInputClass =
  "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm";
const fixedButtonClass =
  "group relative py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10";

function App() {
  const workExpObj = {
    startDate: "",
    endDate: "",
    company: "",
    companyLogo: "",
    jobTitle: "",
    jobDescription: "",
  };

  const imagePreviewUrl: any =
    "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true";

  const [name, setName] = useState("");
  const [scr, setSrc] = useState(imagePreviewUrl);
  const [logoSrc, setLogoSrc] = useState([]);
  const [profile, setProfile] = useState();
  const [workExp, setWorkExp] = useState([{ id: uuid(), ...workExpObj }]);
  const [age, setAge] = useState("");

  axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

  useEffect(() => {
    axios
      .get(
        "https://jws0h21c9c.execute-api.us-west-2.amazonaws.com/default/candidates-function"
      )
      .then((response:any) => {
        const candidate = response.data.Items[0];
        console.log("candidate ", candidate);
        setName(candidate.name)
        setAge(candidate.age)
        setWorkExp(candidate.workExp)
      });
  }, []);

  const onNameChange = (e: any) => {
    setName(e.target.value);
  };
  const onAgeChange = (e: any) => {
    setAge(e.target.value);
  };

  const convertToBase64 = (file: any, callback: any) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
        callback(reader.result)
      };
    });
  };

  const onWorkFormUpdate = (e: any) => {};
  const onProfileImageChange = async (e: any) => {
    e.preventDefault();
    const file = e.target.files[0];

    

    const convertedFile = await convertToBase64(file, (scr: any) => {
      setSrc(scr);
      setProfile(file.name);
    });
    const requestData = {
      image: convertedFile,
      imageName: file.name,
    };
    await axios
      .post(
        "https://auwqyf1mel.execute-api.us-west-2.amazonaws.com/prod/file-upload",
        requestData
      )
      .then((response) => {
        console.log("response ", response);
      })
      .catch((error) => {
        console.log("error ", error);
      });
  };

  const onCompanyLogoUpdate = async ({id, event}: any) => {
    console.log('onCompanyLogoUpdate ')
    event.preventDefault();
    const file = event.target.files[0];
    
    const convertedFile = await convertToBase64(file, (scr: any) => {
      const tempArray: any = [...logoSrc, {id, scr }]
      const selectedWork = workExp.map((work) => { 
        if (work.id === id) {
          work.companyLogo = file.name
        }

        return work
      });

      console.log('selectedWork ', selectedWork)
      setLogoSrc(tempArray);
      setWorkExp(selectedWork);
    });
  }

  const onRemoveWork = ({ id }: { id: any }) => {
    const tempArray = workExp.filter((work) => work.id !== id);
    setWorkExp(tempArray);
  };
  const onAddWorkExp = (e: any) => {
    e.preventDefault();
    const uniqueObj = { id: uuid(), ...workExpObj };
    console.log("form submitted ✅", workExp.length);
    const tempArray = [...workExp, uniqueObj];
    setWorkExp(tempArray);
    console.log("form submitted 222 ✅", workExp.length);
  };
  return (
    <form className="mt-8 space-y-6 experience-form" noValidate>
      <div className="-space-y-px personal-details">
        <div className="profile-image">
          <Image onChange={onProfileImageChange} src={scr} />
        </div>
        <div>
          <div className="my-5">
            <label htmlFor="name" className="">
              Name
            </label>
            <input
              id="name"
              onChange={onNameChange}
              value={name}
              type="text"
              required
              className={fixedInputClass}
              placeholder="Enter Name"
            />
          </div>

          <div className="my-5">
            <label htmlFor="age" className="">
              Age
            </label>
            <input
              id="age"
              onChange={onAgeChange}
              value={age}
              type="number"
              required
              min={1}
              className={fixedInputClass}
              placeholder="Enter Age"
            />
          </div>
        </div>
      </div>
      <div className="add-work">
        <span> Work Experience </span>
        <button
          className={fixedButtonClass}
          formNoValidate
          onClick={onAddWorkExp}
        >
          {" "}
          Add{" "}
        </button>
      </div>
      <div className="-space-y-px work-exp">
        {workExp.map((work, i) => (
          <Work
            key={work.id}
            workExp={work}
            scr={logoSrc[work.id]}
            onWorkFormUpdate={onWorkFormUpdate}
            onRemoveWork={onRemoveWork}
            onCompanyLogoUpdate={onCompanyLogoUpdate}
          />
        ))}
      </div>
      <div className="action">
        <button className={fixedButtonClass}> Clear </button>
        <button className={fixedButtonClass} type="submit">
          {" "}
          Save{" "}
        </button>
      </div>
    </form>
  );
}

export default App;
