const cleanObj = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else {
        cleanObj(obj[key]);
      }
    }
  }
};

const mongoSanitize = () => (req, res, next) => {
  cleanObj(req.body);
  cleanObj(req.query);
  cleanObj(req.params);
  next();
};

module.exports = mongoSanitize;
