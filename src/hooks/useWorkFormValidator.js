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
export const endDateValidator = ({ key, value, startDate }) => {
  if (!value) {
    return `${key} is required`;
  } else if (startDate > value) {
    return `${key} must be greater than 'Start date'`;
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

  const validateForm = ({ form, field, errors, forceTouchErrors = false }) => {
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
      const message = valueValidator({
        key: "Start date",
        value: startDate,
      });
      nextErrors.startDate.error = !!message;
      nextErrors.startDate.message = message;
      if (!!message) isValid = false;
    }

    if (nextErrors.endDate.dirty && (field ? field === "endDate" : true)) {
      console.log("endDate ", endDate);
      console.log("startDate ", startDate);
      const endDateMessage = endDateValidator({
        key: "End date",
        value: endDate,
        startDate: startDate,
      });
      nextErrors.endDate.error = !!endDateMessage;
      nextErrors.endDate.message = endDateMessage;
      if (!!endDateMessage) isValid = false;
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
