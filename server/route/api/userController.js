const express = require('express');
const router = express.Router();


const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const {  uploadFile } = require("../../middleWare/s3")
const { auth } = require("../../middleWare/auth")

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require('../../models/user');


router.post('/update',auth, upload.single('image'), async (req, res) => {
  const file = req.file
  const result = await uploadFile(file)
  await unlinkFile(file.path)
  console.log(result.key)

  const newUser = {
    name: req.body.name,
    bio: req.body.bio,
    imagePath: result.Key,
  };
  await User.findOneAndUpdate({ _id: req.user._id }, newUser, {
    runValidators: true,
    context: "query",
  });

  return res.status(200).json({
    success: true
  });

})


router.get("/user", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).json(user);
});


router.get('/all', async (req, res) => {
  const user = await User.find().populate();
  //console.log(user);
  res.send(user)
})

router.post("/signup", upload.single('image'), async (req, res) => {
    let emailNotRegistered = await validateEmail(req.body.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "Email already registered" }],
      });
    }
    const file = req.file
    const result = await uploadFile(file)
    await unlinkFile(file.path)
    console.log(result.key)

    bcrypt.hash(req.body.password, 12, (error, hash) => {
      if (error) {
        console.log(error);
        res.status(500).json();
      } else {
        const newUser = User({
          name: req.body.name,
          email: req.body.email,
          password: hash,
          bio: req.body.bio,
          imagePath: result.key,
        });
        newUser
          .save()
          .then((user) => {
            res.status(200).json({
              success: true,
              token: generateToken(user),
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json();
          });
      }
    });
  }
);

router.post('/login', async (req, res) => {
  await User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user)
        res.status(404).json({
          success: false,
          errors: [{ msg: "no user with that email found" }],
        });
      else {
        bcrypt.compare(req.body.password, user.password, (error, match) => {
          if (error)
            res.status(500).json({
              success: false,
            });
          else if (match)
            res.status(200).json({
              success: true,
              token: generateToken(user),
            });
          else
            res.status(403).json({
              success: false,
              errors: [{ msg: "password do not match" }],
            });
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json();
    });
})
function generateToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      imagePath: user.imagePath,
    },
    "my-token-secret",
    { expiresIn: "24h" }
  );
}
const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

module.exports = router;
