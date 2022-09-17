import React, { useState, useEffect } from "react";
import "../App.scss";
import { fixedButtonClass, fixedInputClass } from "../constants/constants";
import { useWorkFormValidator } from "../hooks/useWorkFormValidator";
import { WorkExp } from "../utils/types";
import Image from "./Image";
import axios from "axios";
import {
  convertToBase64,
  ImageURL,
  bucket,
  subFolder,
} from "../constants/constants";

function Work({
  onWorkFormUpdate,
  onCompanyLogoUpdate,
  onRemoveWork,
  workExp,
}: {
  onWorkFormUpdate: any;
  onCompanyLogoUpdate: any;
  onRemoveWork: any;
  workExp: WorkExp;
}) {
  const [form, setForm] = useState(workExp);
  const { errors, validateForm, onBlurField } = useWorkFormValidator(form);
  const [companyLogo, setCompanyLogo] = useState();

  axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
  useEffect(() => {
    axios
      .get(`${ImageURL}${bucket}${subFolder}${workExp.src}`, {
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
          setCompanyLogo(base64);
        };
      });
  }, []);

  const onCompanyLogoChange = async (event: any) => {
    const file = event.target.files[0];
    const convertedFile = await convertToBase64(file);
    const base64 = convertedFile.split(";base64,")[1];
    setCompanyLogo(base64);
    const logo = { id: workExp.id, filename: file.name, image: base64 };
    onCompanyLogoUpdate({ id: workExp.id, logo, event });
  };

  const onUpdateField = (e: any) => {
    const field = e.target.name;
    const nextFormState = {
      ...form,
      [field]: e.target.value,
    };
    const { errors: updatedErrors } = validateForm({
      form: nextFormState,
      errors,
      field,
    });
    setForm(nextFormState);
    const hasError = Object.keys(updatedErrors).some(
      (field) => updatedErrors[field].error === true
    );
    const isEmpty = Object.keys(nextFormState).some(
      (field) => nextFormState[field] === ""
    );
    const isInvalid = hasError || isEmpty;
    console.log({ hasError, isEmpty, isInvalid });
    onWorkFormUpdate(nextFormState, isInvalid);
  };

  const onRemoveWorkButton = (e: any) => {
    e.preventDefault();
    onRemoveWork({ id: workExp.id });
  };

  return (
    <div className=" work-exp-detail">
      <div className="date-field">
        <div className="my-5">
          <label htmlFor="startDate" className="">
            Start Date
          </label>
          <input
            name="startDate"
            onChange={onUpdateField}
            value={form.startDate}
            type="date"
            required
            onBlur={onBlurField}
            className={fixedInputClass}
            placeholder="Enter start date"
          />
          {errors.startDate.dirty && errors.startDate.error ? (
            <p className="formFieldErrorMessage">{errors.startDate.message}</p>
          ) : null}
        </div>
        <div className="my-5">
          <label htmlFor="endDate" className="">
            End Date
          </label>
          <input
            className={
              fixedInputClass +
              `${
                errors.endDate.dirty && errors.endDate.error
                  ? " formFieldError"
                  : ""
              }`
            }
            name="endDate"
            onChange={onUpdateField}
            value={form.endDate}
            type="date"
            required
            min={1}
            onBlur={onBlurField}
            placeholder="Enter end start"
          />
          {errors.endDate.dirty && errors.endDate.error ? (
            <p className="formFieldErrorMessage">{errors.endDate.message}</p>
          ) : null}
        </div>
      </div>
      <div className="job-field">
        <div className="my-5">
          <label htmlFor="company" className="">
            Company
          </label>
          <input
            name="company"
            onChange={onUpdateField}
            value={form.company}
            type="text"
            required
            className={fixedInputClass}
            placeholder="Enter company name"
          />
        </div>

        <div className="my-5">
          <label htmlFor="jobTitle" className="">
            Job Title
          </label>
          <input
            name="jobTitle"
            onChange={onUpdateField}
            value={form.jobTitle}
            type="text"
            required
            className={fixedInputClass}
            placeholder="Enter job title"
          />
        </div>
      </div>
      <div className="my-5">
        <div className="company-logo">
          <label htmlFor="companyLogo" className="">
            Company Logo
          </label>
          <Image
            forLabel={`companyLogo+${workExp.id}`}
            onChange={onCompanyLogoChange}
            src={companyLogo}
          />
        </div>
        <div>
          <label htmlFor="jobDescription" className="">
            Job Description
          </label>
          <textarea
            name="jobDescription"
            onChange={onUpdateField}
            value={form.jobDescription}
            required
            className={fixedInputClass}
            placeholder="Enter job description"
          />
        </div>
      </div>
      <button
        className={fixedButtonClass + " remove-work"}
        onClick={onRemoveWorkButton}
      >
        Remove
      </button>
    </div>
  );
}
export default Work;
