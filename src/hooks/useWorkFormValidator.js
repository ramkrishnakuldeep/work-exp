import { useState } from "react";

const touchErrors = (errors) => {
  return Object.entries(errors).reduce((acc, [field, fieldError]) => {
    acc[field] = {
      ...fieldError,
      dirty: true,
    };
    return acc;
  }, {});
};

export const valueValidator = ({ key, value }) => {
  if (!value) {
    return `${key} is required`;
  }
  return "";
};

export const dateValidator = ({ endDate, startDate }) => {
  if (startDate && endDate) {
    if (endDate < startDate) {
      return `End date must be greater than 'Start date'`;
    }
  }
  return "";
};

export const useWorkFormValidator = (form) => {
  const [errors, setErrors] = useState({
    startDate: {
      dirty: false,
      error: false,
      message: "",
    },
    endDate: {
      dirty: false,
      error: false,
      message: "",
    },
    jobTitle: {
      dirty: false,
      error: false,
      message: "",
    },
    jobDescription: {
      dirty: false,
      error: false,
      message: "",
    },
    company: {
      dirty: false,
      error: false,
      message: "",
    },
  });

  const validateForm = ({ form, field, errors, forceTouchErrors = true }) => {
    let isValid = true;

    // Create a deep copy of the errors
    let nextErrors = JSON.parse(JSON.stringify(errors));
    console.log("dirty ", nextErrors[field].dirty);

    // Force validate all the fields
    if (forceTouchErrors) {
      nextErrors = touchErrors(errors);
    }

    const { startDate, endDate, jobTitle, jobDescription, company } = form;
    console.log("field ", field);

    if (nextErrors.startDate.dirty && (field ? field === "startDate" : true)) {
      const startDateMessage = dateValidator({
        startDate: startDate,
        endDate: endDate,
      });

      nextErrors.startDate.error = !!startDateMessage;
      nextErrors.startDate.message = startDateMessage;
      if (!!startDateMessage) isValid = false;
      nextErrors.endDate.error = !!startDateMessage;
      nextErrors.endDate.message = startDateMessage;
      if (!!startDateMessage) isValid = false;
    }

    if (nextErrors.endDate.dirty && (field ? field === "endDate" : true)) {
      const endDateMessage = dateValidator({
        startDate: startDate,
        endDate: endDate,
      });

      nextErrors.endDate.error = !!endDateMessage;
      nextErrors.endDate.message = endDateMessage;
      if (!!endDateMessage) isValid = false;
      nextErrors.startDate.error = !!endDateMessage;
      nextErrors.startDate.message = endDateMessage;
      if (!!endDateMessage) isValid = false;
    }

    if (nextErrors.jobTitle.dirty && (field ? field === "jobTitle" : true)) {
      const message = valueValidator({
        key: "Job title",
        value: jobTitle,
      });
      nextErrors.jobTitle.error = !!message;
      nextErrors.jobTitle.message = message;
      if (!!message) isValid = false;
    }

    if (
      nextErrors.jobDescription.dirty &&
      (field ? field === "jobDescription" : true)
    ) {
      const message = valueValidator({
        key: "Job description",
        value: jobDescription,
      });
      nextErrors.jobDescription.error = !!message;
      nextErrors.jobDescription.message = message;
      if (!!message) isValid = false;
    }

    if (nextErrors.company.dirty && (field ? field === "company" : true)) {
      const message = valueValidator({
        key: "Company",
        value: company,
      });
      nextErrors.company.error = !!message;
      nextErrors.company.message = message;
      if (!!message) isValid = false;
    }

    console.log("nextErrors", JSON.parse(JSON.stringify(nextErrors)));
    setErrors(nextErrors);

    return {
      isValid,
      errors: nextErrors,
    };
  };

  const onBlurField = (e) => {
    const field = e.target.name;
    const fieldError = errors[field];
    if (fieldError.dirty) return;

    const updatedErrors = {
      ...errors,
      [field]: {
        ...errors[field],
        dirty: true,
      },
    };

    validateForm({ form, field, errors: updatedErrors });
  };

  return {
    validateForm,
    onBlurField,
    errors,
  };
};
