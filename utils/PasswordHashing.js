const bcryptjs = require("bcryptjs");

// This function will attach the pre-save hook to the given schema
function PasswordPreSaveHook(userSchema) {
  userSchema.pre("save", async function (next) {
    const user = this;

    if (!user.isModified("password")) return next();

    try {
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(user.password, salt);
      user.password = hash;
      next();
    } catch (error) {
      return next(error);
    }
  });
}

module.exports = PasswordPreSaveHook;