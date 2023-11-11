const User = require("../models/userModel");


const getAllPharmacistInfo = async ()=>{
    const pharmacists = await User.find({ role: "pharmacist" })
      .select("firstName lastName email role pharmacy")
      .exec();
    return pharmacists

}

const getPharmacistInfo = async (pharmacistId)=>{
    const pharmacist = await User.findById(pharmacistId)
    .select("firstName lastName email role pharmacy")
    .exec();
    return pharmacist
}
module.exports = {
    getAllPharmacistInfo,
    getPharmacistInfo
}