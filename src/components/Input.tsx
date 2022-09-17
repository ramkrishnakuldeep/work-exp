import { fixedInputClass } from "../constants/constants";

export default function Input({
    handleChange,
    onBlurField,
    value,
    labelText,
    labelFor,
    id,
    name,
    type,
    placeholder,
    customClass
}: any){
    return(
        <div className="my-5">
            <label htmlFor={labelFor} className="sr-only">
              {labelText}
            </label>
            <input
              onChange={handleChange}
              onBlur={onBlurField}
              value={value}
              id={id}
              name={name}
              type={type}
              required
              className={fixedInputClass+customClass}
              placeholder={placeholder}
            />
          </div>
    )
}