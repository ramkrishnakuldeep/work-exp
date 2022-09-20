import React, { useEffect, useState, createContext, useMemo } from "react";
import "./App.scss";
import Work from "./components/Work";
import uuid from "react-uuid";
import axios from "axios";
import Image from "./components/Image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Input from "./components/Input";
import {
  CompanyIcon,
  WorkExp,
  FormContextInterface,
  CandidateResponse,
} from "./utils/types";
import { useFormValidator } from "./hooks/useFormValidator";
import {
  bucket,
  convertToBase64,
  DataURL,
  fixedButtonClass,
  ImageURL,
  personalInfoFields,
  subFolder,
  workExpObj,
  formObj,
} from "./constants/constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Map } from "immutable";

export const FormContext = createContext<FormContextInterface>({
  isDisable: true,
  setButtonDisability: () => {},
  companyLogos: undefined,
  workExp: Map(),
  setWorkExp: () => {},
  setCompanyLogos: () => {},
});

function App() {
  const ID = uuid();
  const initWorkExpMap = { [ID]: { ...workExpObj, id: ID } };
  const [workExp, setWorkExp] = useState<Map<string, WorkExp>>(
    Map(Object.entries(initWorkExpMap))
  );
  const [isDisable, setButtonDisability] = useState(true);
  const [profileImage, setProfileImage] = useState<string>();
  const [profile, setProfile] = useState<string>();
  const [companyLogos, setCompanyLogos] = useState<Map<string, CompanyIcon>>();
  const [form, setForm] = useState(formObj);

  const value = useMemo(
    () => ({
      workExp,
      companyLogos,
      setWorkExp,
      setCompanyLogos,
      isDisable,
      setButtonDisability,
    }),
    [workExp, companyLogos, isDisable]
  );

  const { errors, validateForm, onBlurField } = useFormValidator(form);

  axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
  useEffect(() => {
    axios.get(DataURL).then((response: any) => {
      const candidate: CandidateResponse = response.data[0];
      setWorkExp(Map(candidate.workExp));
      setForm({
        name: candidate.name,
        age: candidate.age,
        src: candidate.src,
      });
      getImageFromS3(candidate.src);
    });
  }, []);

  useEffect(() => {
    setButtonDisability(errors.age.error || errors.name.error);
  }, [errors, form]);

  const getImageFromS3 = (fileName: string) => {
    axios
      .get(`${ImageURL}${bucket}${subFolder}${fileName}`, {
        responseType: "blob",
      })
      .then(async (response: any) => {
        const reader: any = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = function () {
          var base64data = reader.result;
          const base64 = base64data.split(";base64,")[1];
          setProfile(base64);
        };
      });
  };

  const onUpdateField = (e: any) => {
    const field = e.target.name;
    const nextFormState = {
      ...form,
      [field]: e.target.value,
    };
    validateForm({
      form: nextFormState,
      errors,
      field,
    });
    setForm(nextFormState);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    console.log({ isDisable });
    if (isDisable) {
      return;
    }
    const requestData = {
      candidates_experience: "kuldeep",
      candidates_years_of_experience: "kuldeep_tcs",
      name: form.name,
      age: form.age,
      src: form.src,
      workExp: workExp,
    };

    const requestOne = axios.put(DataURL, requestData);
    const imageBucket = `${ImageURL}${bucket}${subFolder}`;
    let requestTwo;
    if (profileImage) {
      requestTwo = axios.put(`${imageBucket}${form.src}`, profileImage);
    }

    const otherRequests: any = companyLogos
      ? companyLogos.map((icon: CompanyIcon) => {
          return axios.put(`${imageBucket}${icon.filename}`, icon.image);
        })
      : [];

    axios
      .all([requestOne, requestTwo, ...otherRequests])
      .then(
        axios.spread((...responses) => {
          console.log("response ", responses);
          toast.success("Data successfully updated !", {
            position: toast.POSITION.TOP_RIGHT,
          });
        })
      )
      .catch((errors) => {
        // react on errors.
      });
  };
  const onProfileImageChange = async (e: any) => {
    e.preventDefault();
    const file = e.target.files[0];
    const nextFormState = { ...form, src: file.name };
    setForm(nextFormState);
    const convertedFile: string = await convertToBase64(file);
    const base64 = convertedFile.split(";base64,")[1];
    setProfileImage(base64);
    setProfile(base64);
  };

  const onAddWorkExp = (e: any) => {
    e.preventDefault();
    setButtonDisability(true);
    const id = uuid();
    setWorkExp(workExp.set(id, { ...workExpObj, id }));
  };
  return (
    <FormContext.Provider value={value}>
      <Header></Header>
      <form className="mt-8 space-y-6 experience-form" noValidate>
        <div className="-space-y-px personal-details">
          <div className="profile-image">
            <Image
              forLabel="profile-image"
              onChange={onProfileImageChange}
              src={profile}
            />
          </div>
          <div>
            {personalInfoFields.map((field) => {
              return (
                <Input
                  key={field.id}
                  handleChange={onUpdateField}
                  onBlurField={onBlurField}
                  value={form[field.name]}
                  {...field}
                />
              );
            })}
          </div>
        </div>
        <div className="add-work">
          <span> Work Experience </span>
          <button
            className={fixedButtonClass}
            formNoValidate
            onClick={onAddWorkExp}
          >
            Add Work Experience
          </button>
        </div>
        <div className="-space-y-px work-exp">
          {Array.from(workExp.values()).map((work, i) => (
            <Work key={work.id} workExp={work} />
          ))}
        </div>
      </form>
      <Footer>
        <button className={fixedButtonClass}> Clear </button>
        <button
          className={fixedButtonClass}
          type="submit"
          disabled={isDisable}
          onClick={onSubmit}
        >
          Save
        </button>
        <ToastContainer />
      </Footer>
    </FormContext.Provider>
  );
}

export default App;
