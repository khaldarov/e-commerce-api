const signinCheck = (num = 403) => {
  return async (req, res, next) => {
    if (!req.session?.user) {
      return res.status(num).redirect("/customer/signin");
    }

    next();
  };
};

module.exports = signinCheck;
