const bcrypt = require("bcrypt");
const { createToken } = require("../utils/jwt");
const { userTokenName } = require("../config/app-config");

const UserTypes = {
  doctor: require("../models/doctorModel"),
  pharmacist: require("../models/pharmacistModel"),
  patient: require("../models/patientModel"),
};

const register = async (
  firstName,
  lastName,
  username,
  email,
  password,
  role,
  profileInfo
) => {
  const model = UserTypes[role];
  const existing = await model
    .findOne({ email })
    .collation({ locale: "en", strength: 2 });
  if (existing) {
    throw new Error("Email is already exist");
  }

  const createdUser = await model.create({
    firstName,
    lastName,
    username,
    email,
    password,
    role,
    ...profileInfo,
  });
  let user = bsonToJson(createdUser);
  user = removePassword(user);
  const token = createSession(user);

  return Object.assign(token, user);
};

const createSession = ({ _id, email, role }) => {
  const payload = { _id, email, role };

  return { [userTokenName]: createToken(payload) };
};

const bsonToJson = (data) => {
  return JSON.parse(JSON.stringify(data));
};
const removePassword = (data) => {
  const { password, __v, ...userData } = data;
  return userData;
};

module.exports = {
  register,
};
