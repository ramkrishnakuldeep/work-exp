export type WorkExp = {
    id: string;
    startDate: string;
    endDate: string;
    company: string;
    src: string;
    jobTitle: string;
    jobDescription: string;
};

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
