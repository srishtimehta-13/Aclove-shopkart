import Customer from "../models/customer.model.js";
import bcrypt from "bcrypt";
import genToken from "../utils/generateToken.js";


const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
}

const toPublicCustomer = (customer) => {
  const customerData = customer.toObject();
  delete customerData.password;
  return customerData;
};

export const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof phone !== "string" ||
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !phone.trim()
    ) {
      return res.status(400).json({ message: "All fields Required" });
    }

    if (password.length <= 6) {
      return res
        .status(400)
        .json({ message: "Password should be greater than 6 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailExists = await Customer.findOne({ email: normalizedEmail });

    if (emailExists) {
      return res.status(409).json({ message: "Customer Already Exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newCustomer = await Customer.create({
          fullName,
          email: normalizedEmail,
          password:hashedPassword,
          phone: phone.trim()
        });

    const token = genToken(newCustomer._id);
    
    res.cookie("token", token, cookieOptions)


    res.status(201).json({
      message: "Customer Registered",
      customer: toPublicCustomer(newCustomer)
    });

  } catch(error)
   {res.status(500).json({ message: "Server crashed", error: error.message });}
};


export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
   

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({ message: "All fileds Required" });
    }

    const customer = await Customer.findOne({
      email: email.trim().toLowerCase()
    }).select("+password");

    if (!customer) {
      return res.status(404).json({ message: "Customer Not Found" });
    }

    const passwordMatched = await bcrypt.compare(password, customer.password);

    if (!passwordMatched) {
      return res.status(401).json({ message: "Password Did not match" });
    }

    const token = genToken(customer._id);
    
    res.cookie("token", token, cookieOptions)
    res.status(200).json({
      message: "Customer Logged In",
      customerData: toPublicCustomer(customer)
    });
  } catch (error) {
    res.status(500).json({ message: "Server crashed", error: error.message });
  }

  
};


export const getMe = (req, res) => {
    if (!req.customer) {
        return res.status(404).json({ message: 'User not found' });
    }
    const authenticatedCustomer = req.customer;
    return res.status(200).json({ authenticatedCustomer });
};

export const logoutCustomer = (req, res) => {
    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};