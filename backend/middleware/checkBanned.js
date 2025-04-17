// middleware/checkBanned.js

const checkBanned = (req, res, next) => {
    if (req.user && req.user.isBanned) {
      return res.status(403).json({ message: 'Jūs esate užblokuotas ir negalite atlikti šio veiksmo.' });
    }
    next(); // Jeigu naudotojas nėra užblokuotas, pereina prie kito middleware
  };
  
  module.exports = checkBanned;
  