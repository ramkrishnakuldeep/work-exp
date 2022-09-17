export const personalInfoFields = [
  {
    labelText: "Name",
    labelFor: "name",
    id: "name",
    name: "name",
    type: "text",
    className: "",
    placeholder: "Enter Name",
  },
  {
    labelText: "Age",
    labelFor: "age",
    id: "age",
    name: "age",
    type: "number",
    className: "",
    placeholder: "Enter Age",
  },
];

export const convertToBase64 = (file: any): Promise<any> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
  });
};
export const ImageURL =
  "https://lhlhawt55i.execute-api.us-west-2.amazonaws.com/v1/s3?key=";
export const DataURL =
  "https://d0hzzp14n7.execute-api.us-west-2.amazonaws.com/default/candidates-function";
export const bucket = "years-of-experience-file-upload/";
export const subFolder = "images/";

export const fixedInputClass =
  "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm";
export const fixedButtonClass =
  "group relative py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500";
