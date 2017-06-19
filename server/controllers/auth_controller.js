// const co = require('co');
const User = require('../models/user');

module.exports = {
  authenticate(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.status(403).send('username not found');
        } else if (user.password !== password) {
          res.status(401).send('password is incorrect');
        } else {
          res.send(user.apiRepr());
        }
      })
      .catch(next);
  },
};

// module.exports = {
//   authenticate: co(function * (req, res, next) {
//     try {
//       const username = req.body.username;
//       const password = req.body.password;
//       const user = yield User.findOne({ username });
//       if (!user) {
//         res.status(403).send('username not found');
//       } else if (user.password !== password) {
//         res.status(401).send('password is incorrect');
//       } else {
//         res.send(user.apiRepr());
//       }
//     } catch (err) {
//       next(err);
//     }
//   })
// };
