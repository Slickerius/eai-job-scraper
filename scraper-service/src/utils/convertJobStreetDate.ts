const convertJobStreetPostedToDate = (postedDate: string) => {
  const postedDateArr: string[] = postedDate.split(' ');
  let date: Date;
  
  if (postedDateArr.length != 4)
    throw new Error('JobStreet posted date provided is not in the right format');
  
  const magnitude: number = parseInt(postedDateArr[0]);
  const unit: string = postedDateArr[1];
  
  if (unit === 'jam') 
    date = new Date(new Date().getTime() - magnitude * 1000 * 3600);
  else if (unit === 'hari')
    date = new Date(new Date().getTime() - magnitude * 1000 * 3600 * 24);
  else if (unit === 'bulan')
    date = new Date(new Date().getTime() - magnitude * 1000 * 3600 * 24 * 30);
  else
    date = new Date();

  if (new Date().getTime() - date.getTime() > 2 * 1000 * 3600 * 24 * 30)
    throw new Error('Job posted date exceeds maximum value allowed (2 months).');
    
  return date;
};

export default convertJobStreetPostedToDate;