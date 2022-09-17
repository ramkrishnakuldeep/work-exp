import React, { useEffect, useState } from "react";
import "./App.scss";
import Work from "./components/Work";
import uuid from "react-uuid";
import axios from "axios";
import Image from "./components/Image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Input from "./components/Input";
import { CompanyIcon, CompanyIconUpdateParams, WorkExp } from "./utils/types";
import { useFormValidator } from "./hooks/useFormValidator";
import {
  bucket,
  convertToBase64,
  DataURL,
  fixedButtonClass,
  ImageURL,
  personalInfoFields,
  subFolder,
} from "./constants/constants";

function App() {
  const workExpObj = {
    startDate: "",
    endDate: "",
    company: "",
    src: "",
    jobTitle: "",
    jobDescription: "",
  };

  const [workExp, setWorkExp] = useState([{ id: uuid(), ...workExpObj }]);
  const [isDisable, setButtonDisability] = useState(true);
  const [profileImage, setProfileImage] = useState<string>();
  const [companyIcons, setCompanyIcons] = useState<CompanyIcon[]>([]);
  const [form, setForm] = useState({ name: "", age: "", src: "" });

  const { errors, validateForm, onBlurField } = useFormValidator(form);

  axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
  useEffect(() => {
    axios.get(DataURL).then((response: any) => {
      const candidate = response.data[0];
      setWorkExp(candidate.workExp);
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
  }, [form]);

  const getImageFromS3 = (fileName: string) => {
    axios
      .get(`${ImageURL}${bucket}${subFolder}${fileName}`, {
        responseType: "blob",
      })
      .then(async (response: any) => {
        // const baseImage: any = URL.createObjectURL(response.data);
        const reader: any = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = function () {
          var base64data = reader.result;
          const base64 = base64data.split(";base64,")[1];
          console.log(base64);
          setProfileImage(base64);
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

  const onWorkFormUpdate = async (params: WorkExp, isInvalid: boolean) => {
    setButtonDisability(isInvalid);
    const { company, jobDescription, jobTitle, startDate, endDate, id } =
      params;
    console.log("onWorkFormUpdate", {
      company,
      jobDescription,
      jobTitle,
      startDate,
      endDate,
      id,
    });
    const work: WorkExp[] = workExp.map((workExperience: WorkExp) => {
      console.log("workExperience", workExperience);
      if (workExperience.id === id) {
        return {
          ...workExperience,
          company,
          jobDescription,
          jobTitle,
          startDate,
          endDate,
        };
      } else {
        return workExperience;
      }
    });
    setWorkExp(work);
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
      workExp,
    };

    const requestOne = axios.put(DataURL, requestData);
    const requestTwo = axios.put(
      `${ImageURL}${bucket}${subFolder}${form.src}`,
      profileImage
    );

    const otherRequests: any = companyIcons.map((icon: CompanyIcon) => {
      return axios.put(
        `${ImageURL}${bucket}${subFolder}${icon.filename}`,
        icon.image
      );
    });

    axios
      .all([requestOne, requestTwo, ...otherRequests])
      .then(
        axios.spread((...responses) => {
          console.log("response ", responses);
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
  };

  const onCompanyLogoUpdate = async ({
    id,
    logo,
    event,
  }: CompanyIconUpdateParams) => {
    event.preventDefault();
    const tempWorkExp = workExp.map((work) => {
      if (work.id === id) {
        work.src = logo.filename;
      }
      return work;
    });
    const imageArr = [...companyIcons, logo];
    setCompanyIcons(imageArr);
    setWorkExp(tempWorkExp);
  };

  const onRemoveWork = ({ id }: { id: string }) => {
    const tempArray = workExp.filter((work) => work.id !== id);
    setWorkExp(tempArray);
  };
  const onAddWorkExp = (e: any) => {
    e.preventDefault();
    setButtonDisability(true);
    const uniqueObj = { id: uuid(), ...workExpObj };
    const tempArray = [uniqueObj, ...workExp];
    setWorkExp(tempArray);
  };
  return (
    <>
      <Header></Header>
      <form className="mt-8 space-y-6 experience-form" noValidate>
        <div className="-space-y-px personal-details">
          <div className="profile-image">
            <Image
              forLabel="profile-image"
              onChange={onProfileImageChange}
              src={profileImage}
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
          {workExp.map((work, i) => (
            <Work
              key={work.id}
              workExp={work}
              onWorkFormUpdate={onWorkFormUpdate}
              onRemoveWork={onRemoveWork}
              onCompanyLogoUpdate={onCompanyLogoUpdate}
            />
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
      </Footer>
    </>
  );
}

export default App;
