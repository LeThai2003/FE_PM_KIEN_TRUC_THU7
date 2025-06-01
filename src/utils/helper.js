export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export const validateOTP = (otp) => {
  const regex = /^[0-9]{8}$/;
  return regex.test(otp);
}

export const getNameInitials = (name) => {
  if(!name) return "";

  let words = name.split(" ");
  let initials = "";

  if(words.length > 2)
  {
      words = words.slice(words.length - 2, words.length);

  }
  
  for(let i = 0; i < words.length; i++)
  {
      initials += words[i][0];
  }

  return initials.toLocaleUpperCase(); 
}