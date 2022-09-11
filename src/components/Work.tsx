import React, { useState } from "react";
import "../App.scss";
import { useWorkFormValidator } from "../hooks/useWorkFormValidator";
import Image from "./Image";

const fixedInputClass =
  "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm";
const fixedButtonClass =
  "group relative py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500";

function Work({
  onWorkFormUpdate,
  onCompanyLogoUpdate,
  onRemoveWork,
  workExp,
  scr,
}: {
  onWorkFormUpdate: any;
  onCompanyLogoUpdate: any;
  onRemoveWork: any;
  workExp: any;
  scr: any;
}) {
  const imagePreviewUrl: any =
    "https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png";
  const [form, setForm] = useState(workExp);


  const { errors, validateForm, onBlurField } = useWorkFormValidator(form);

  const onCompanyLogoChange = (e: any) => {
    console.log('onCompanyLogoChange')
    onCompanyLogoUpdate({id: workExp.id, event: e})
  };

  const onUpdateField = (e: any) => {
    const field = e.target.name;
    const nextFormState = {
      ...form,
      [field]: e.target.value,
    };
    console.log("onUpdateField ", field, errors[field].error);
    const { isValid, errors: updatedErrors } = validateForm({
      form: nextFormState,
      errors,
      field,
    });
    console.log(
      "onUpdateField updatedErrors",
      field,
      updatedErrors[field].error
    );
    console.log("isValid ", isValid);
    if (!errors[field].error) {
      setForm(nextFormState);
    }
  };

  const onRemoveWorkButton = (e: any) => {
    e.preventDefault();
    onRemoveWork({ id: workExp.id });
  };

  return (
    <div className=" work-exp-detail">
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
      </div>
      {errors.endDate.dirty && errors.endDate.error ? (
        <p className="formFieldErrorMessage">{errors.endDate.message}</p>
      ) : null}
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
      <div className="my-5">
        <div className="company-logo">
        <label htmlFor="companyLogo" className="">
            Company Logo
          </label>
          <Image onChange={onCompanyLogoChange} src={scr} />
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
        {" "}
        Remove{" "}
      </button>
    </div>
  );
}
export default Work;
