import { Dispatch, SetStateAction } from "react";
import { Map } from "immutable";

export interface WorkExpForm  {
    id: string;
    startDate: string;
    endDate: string;
    company: string;
    jobTitle: string;
    jobDescription: string;
}
export interface WorkExp extends WorkExpForm {
    src: string;
};

export interface FormContextInterface {
    workExp: Map<string, WorkExp>;
    setWorkExp: Dispatch<SetStateAction<Map<string, WorkExp>>>;
    companyLogos: Map<string, CompanyIcon> | undefined;
    setCompanyLogos: Dispatch<SetStateAction<Map<string, CompanyIcon> | undefined>>;
    isDisable: boolean,
    setButtonDisability: Dispatch<SetStateAction<boolean>>;
}

export interface CandidateResponse extends PersonalInfo {
    workExp: Map<string, WorkExp>;
}

export type CompanyIcon = {
    id: string;
    filename: string;
    image: string;
};

export type CompanyIconUpdateParams = {
    id: string,
    logo: CompanyIcon,
    event: any;
}

export type PersonalInfo = {
    name: string;
    age: number;
    src: string;
}
