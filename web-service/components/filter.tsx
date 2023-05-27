import { TitleOptions } from "@/lib/constants";
import { QueryInterface } from "@/lib/model";
import React, { FC } from "react";
import Select from "react-select";

export const Filter: FC<{ setQuery: React.Dispatch<QueryInterface>; query: QueryInterface }> = ({
  query,
  setQuery,
}) => {
  return (
    <section className="grid grid-cols-3 gap-x-8 gap-y-4">
      <div className="col-span-3 md:col-span-1">
        <label className="md:text-lg mb-2 text-gray-200 font-semibold">Jenis Pekerjaan</label>
        <Select
          instanceId={"title"}
          isMulti
          className="text-black "
          options={TitleOptions}
          onChange={(e: any) => {
            setQuery({
              ...query,
              title: e.map((x: any) => x.value),
            });
          }}
        />
      </div>
      <div className="col-span-3 md:col-span-1">
        <label className="md:text-lg mb-2 text-gray-200 font-semibold">Lokasi</label>
        <Select
          instanceId={"location"}
          isMulti
          className="text-black "
          options={TitleOptions}
          onChange={(e: any) => {
            setQuery({
              ...query,
              location: e.map((x: any) => x.value),
            });
          }}
        />
      </div>
      <div className="col-span-3 md:col-span-1">
        <label className="md:text-lg mb-2 text-gray-200 font-semibold">Perusahaan</label>
        <Select
          instanceId={"company"}
          isMulti
          className="text-black "
          options={TitleOptions}
          onChange={(e: any) => {
            setQuery({
              ...query,
              company: e.map((x: any) => x.value),
            });
          }}
        />
      </div>
      <div className="col-span-3 md:col-span-1">
        <label className="md:text-lg mb-2 text-gray-200 font-semibold" htmlFor="">
          Dari tanggal
        </label>
        <div className="w-full">
          <input
            className="w-full text-black px-2 py-0.5"
            type="date"
            onChange={(e: any) => {
              console.log(e.target.value);
              setQuery({
                ...query,
                publicationDate: e.target.value,
              });
            }}
          />
        </div>
      </div>
    </section>
  );
};
