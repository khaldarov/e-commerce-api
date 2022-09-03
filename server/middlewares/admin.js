const isAdmin = (num = 403) => {
  return async (req, res, next) => {
    if (!req.session?.user) {
      return res.status(num).redirect("/user/signin");
    }
    if (req.session?.user?.isAdmin !== true) {
      return res.status(403).json({ message: "You are not authorized to access this page!" });
    }

    next();
  };
};

module.exports = isAdmin;
