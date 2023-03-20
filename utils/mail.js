export const generateOTP = () => {
  let OTP = "";
  for (let i = 0; i <= 3; i++) {
    let randomValue = Math.round(Math.random() * 9);
    OTP = OTP + randomValue;
  }
  return OTP;
};

export const createMessage = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Internal server error");
  }
};
