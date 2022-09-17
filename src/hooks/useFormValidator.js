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

export const useFormValidator = (form) => {
  const [errors, setErrors] = useState({
    name: {
      dirty: false,
      error: false,
      message: "",
    },
    age: {
      dirty: false,
      error: false,
      message: "",
    },
    workExp: {
      dirty: false,
      error: false,
      message: "",
    },
  });

  const validateForm = ({ form, field, errors, forceTouchErrors = true }) => {
    let isValid = true;

    // Create a deep copy of the errors
    let nextErrors = JSON.parse(JSON.stringify(errors));

    // Force validate all the fields
    if (forceTouchErrors) {
      nextErrors = touchErrors(errors);
    }

    const { age, name } = form;
    console.log("field ", field);

    if (nextErrors.name.dirty && (field ? field === "name" : true)) {
      const message = valueValidator({
        key: "Name",
        value: name,
      });
      nextErrors.name.error = !!message;
      nextErrors.name.message = message;
      if (!!message) isValid = false;
    }

    if (nextErrors.age.dirty && (field ? field === "age" : true)) {
      const message = valueValidator({
        key: "Age",
        value: age,
      });
      nextErrors.age.error = !!message;
      nextErrors.age.message = message;
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
