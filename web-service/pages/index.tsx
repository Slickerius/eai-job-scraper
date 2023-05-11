import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { DefaultQuery, JobPostingAttributes, QueryInterface } from "@/lib/model";
import { Filter } from "@/components/filter";
import { DUMMY_JOB } from "@/lib/dummy";
import { Card } from "@/components/card";
import { queryBuilder } from "@/lib/queryBuilder";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [query, setQuery] = useState<QueryInterface>(DefaultQuery);
  const [data, setData] = useState<JobPostingAttributes[]>([]);
  useEffect(() => {
    onSearch();
  }, []);
  useEffect(() => {
    console.log(query);
  }, [query]);
  const onSearch = async () => {
    try {
      const result = await fetch(`/api${queryBuilder(query)}`, {
        method: "GET",
      });
      const resultData = await result.json();
      console.log(resultData);
      setData(resultData);
    } catch (error) {
      console.log("EROR");
      console.error(error);
    }
  };
  return (
    <>
      <Head>
        <title>Job Scrapper IAP</title>
        <meta name="description" content="Job Scrapper Tugas Kelompok IAP" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <nav className="px-8 z-10 md:px-16 py-4 w-full flex items-center justify-between bg-gray-800 border-gray-400 border-b text-white fixed left-0 top-0">
        <h1 className="md:text-xl font-bold">Tugas Kelompok IAP</h1>
        <div className="md:flex gap-x-4 hidden">
          <a>Job Scrapper</a>
          <a href="#footer">Author</a>
        </div>
      </nav>
      <main id="search" className="bg-gray-900 text-white min-h-screen w-full p-8 md:p-16 md:pt-8 mt-10">
        <Filter setQuery={setQuery} query={query} />
        <div className="w-full flex items-center justify-center my-10">
          <div
            onClick={onSearch}
            className="rounded-lg border-2 border-gray-200 cursor-pointer text-gray-200 px-6 py-3 font-bold text-xl"
          >
            Cari Pekerjaan
          </div>
        </div>
        <div className="text-gray-300 font-medium  text-sm mb-2">{`Ditemukan ${data.length} Pekerjaan Terkait`}</div>
        {data.length > 0 && (
          <section>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {data.map((x, idx) => (
                <Card {...x} key={x.id} />
              ))}
            </div>
          </section>
        )}
      </main>
      <footer id="footer" className="w-full bg-gray-800 text-white p-8 md:p-16 pb-10">
        <ul className="list-disc">
          <li>Faris Haidar Zuhdi (2006597336)</li>
          <li>Zidan Kharisma Adidarma (2006463881)</li>
        </ul>
      </footer>
    </>
  );
}
