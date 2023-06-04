const bulanArr = [
  "januari",
  "februari",
  "maret",
  "april",
  "mei",
  "juni",
  "juli",
  "agustus",
  "september",
  "oktober",
  "november",
  "desember",
];

const convertKarirPostedToDate = (postedDate: string) => {
  const postedDateArr: string[] = postedDate.split(" ");
  // console.log(postedDateArr)
  let date: Date = new Date();

  if (postedDateArr.length != 3) throw new Error("Karir posted date provided is not in the right format");
  const [tanggal, bulan, tahun] = postedDateArr;
  date.setDate(Number(tanggal))
  const bulanId = bulanArr.findIndex((bln) => bln.toUpperCase() === bulan.toUpperCase());
  if(bulanId < 0) throw new Error("Unrecognized month")
  date.setMonth(bulanId)
  date.setFullYear(Number(tahun))
  // console.log(date.toUTCString())
  if (new Date().getTime() - date.getTime() > 2 * 1000 * 3600 * 24 * 30)
    throw new Error("Job posted date exceeds maximum value allowed (2 months).");

  return date;
};

export default convertKarirPostedToDate;
