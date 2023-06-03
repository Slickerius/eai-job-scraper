const convertLinkedInPostedToDate = (postedDate: string) => {
  const postedDateArr: string[] = postedDate.split(' ');
  let date: Date;
  
  if (postedDateArr.length != 3)
    throw new Error('LinkedIn posted date provided is not in the right format');
  
  const magnitude: number = parseInt(postedDateArr[0]);
  const unit: string = postedDateArr[1];
  
  if (unit.startsWith('hour')) 
    date = new Date(new Date().getTime() - magnitude * 1000 * 3600);
  else if (unit.startsWith('day'))
    date = new Date(new Date().getTime() - magnitude * 1000 * 3600 * 24);
  else if (unit.startsWith('month'))
    date = new Date(new Date().getTime() - magnitude * 1000 * 3600 * 24 * 30);
  else
    date = new Date();

  if (new Date().getTime() - date.getTime() > 2 * 1000 * 3600 * 24 * 30) 
    throw new Error('Job posted date exceeds maximum value allowed (2 months).');

  return date;
};

export default convertLinkedInPostedToDate;