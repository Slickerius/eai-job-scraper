import { JobPostingAttributes } from "@/lib/model";
import { FC } from "react";

export const Card: FC<JobPostingAttributes> = ({ company, location, source, title, url, publicationDate }) => {
  return (
    <a href={url} target="_blank" className="rounded-lg bg-gray-700 border border-gray-600 px-4 py-2 text-sm block">
      <div>
        <h4 className="text-lg">{title}</h4>
        <h6 className="">{company}</h6>
        <div className="border-b border-gray-600 w-full" />
        <p>
          Lokasi : <span>{location}</span>
        </p>
        <p>
          Sumber : <span>{source}</span>
        </p>
        {publicationDate && (
          <p>
            Tanggal Publikasi : <span>{new Date(publicationDate).toLocaleDateString()}</span>
          </p>
        )}
      </div>
    </a>
  );
};
