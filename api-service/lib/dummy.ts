import { JobPostingAttributes } from "./JobPosting";

export const DUMMY_JOB: JobPostingAttributes[] = [
  {
    title: "Java Programmer",
    company: "Microsoft",
    location: "Jakarta",
    publicationDate: new Date(Date.parse("2023-02-03")),
    source: "linkedin",
    url: "/url1",
  },
  {
    title: "Data Engineer",
    company: "Google",
    location: "Dki jakarta",
    publicationDate: new Date(Date.parse("2023-03-03")),
    source: "linkedin",
    url: "/url2",
  },
  {
    title: "Security Analyst",
    company: "Microsoft",
    location: "Bandung",
    publicationDate: new Date(Date.parse("2023-02-09")),
    source: "indeed",
    url: "/url3",
  },
  {
    title: "Programmer php",
    company: "Google",
    location: "Jepang",
    publicationDate: new Date(Date.parse("2023-02-03")),
    source: "linkedin",
    url: "/url4",
  },
];
