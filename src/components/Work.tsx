import React, { useState, useEffect, useContext } from "react";
import "../App.scss";
import { fixedButtonClass, fixedInputClass } from "../constants/constants";
import { useWorkFormValidator } from "../hooks/useWorkFormValidator";
import { WorkExp, WorkExpForm } from "../utils/types";
import Image from "./Image";
import axios from "axios";
import {
  convertToBase64,
  ImageURL,
  bucket,
  subFolder,
} from "../constants/constants";
import { Map } from "immutable";

import { FormContext } from "../App";

function Work({ workExp }: { workExp: WorkExp }) {
  const { src, ...workExpForm } = workExp;
  const [form, setForm] = useState<WorkExpForm>(workExpForm);
  const { errors, validateForm, onBlurField } = useWorkFormValidator(form);
  const [companyLogo, setCompanyLogo] = useState();
  const { workExp: workExpData, setWorkExp } = useContext(FormContext);
  const { isDisable, setButtonDisability } = useContext(FormContext);
  const { companyLogos, setCompanyLogos } = useContext(FormContext);

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
          setCompanyLogo(base64);
        };
      });
  }, []);

  const onCompanyLogoChange = async (event: any) => {
    const file = event.target.files[0];
    const { id } = workExp;
    const base64 = await convertToBase64(file);
    const image = base64.split(";base64,")[1];
    setCompanyLogo(image);
    const newWork = workExpData.set(workExp.id, { ...workExp, src: file.name });
    setWorkExp(newWork);
    if (companyLogos) {
      const tempMap = companyLogos.set(id, {
        id,
        filename: file.name,
        image,
      });
      setCompanyLogos(tempMap);
    } else {
      setCompanyLogos(Map({ [id]: { id, filename: file.name, image } }));
    }
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
    const isEmpty = Object.keys(nextFormState).some((field) => {
      console.log(field, nextFormState[field]);
      return nextFormState[field] === "";
    });
    const isValid = !hasError && !isEmpty;
    console.log({ hasError, isEmpty, isValid });
    onWorkFormUpdate(nextFormState, isValid);
  };

  const onWorkFormUpdate = async (params: WorkExpForm, isValid: boolean) => {
    const { id, src } = workExp;
    setButtonDisability(!isValid);
    const newWork = workExpData.set(workExp.id, { ...params, src, id });
    setWorkExp(newWork);
  };

  const onRemoveWorkButton = (e: any) => {
    e.preventDefault();
    const tempArray = workExpData.delete(workExp.id);
    setWorkExp(tempArray);
    const logoMap = companyLogos?.delete(workExp.id);
    setCompanyLogos(logoMap);
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
