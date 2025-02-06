const { v4: uuidv4 } = require('uuid')
const Url = require('../models/url')
const User = require('../models/user')
const { setUser } = require('../service/auth')
const { getUser } = require("../service/auth")


async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  await User.create({
    name,
    email,
    password,
  });
  return res.render("login");
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
    password,
  });
  if (!user)
    return res.status(401).render("wrongSingle", {
      msgs: "Invalid Username or Password",
    })
  const token = setUser({ _id: user._id, name: user.name, email: user.email });
  res.cookie("uid", token);
  return res.redirect("/");
}

// Delete section
async function handleUrlDelete(req, res) {
  try {
     
    await Url.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (error) {
    res.status(500).send('Error deleting URL');
  }
};

// Profile
async function handleProfile(req, res) {
  const userUid = req.cookies?.uid;
  const user = getUser(userUid);
  if (!user) return res.redirect("/login");
  res.render("profile", { user });
}


async function handleChangePassword(req, res) {
  const userUid = req.cookies?.uid;
  const user = getUser(userUid);

  if (!user) {
    return res.redirect("/login");
  }
  res.render("reset-password", { user });
}

async function handlePasswordUpdate(req, res) {
  const userUid = req.cookies?.uid;
  const { newPassword, confirmPassword } = req.body;

  const user = getUser(userUid);

  if (!user) {
    return res.redirect("/login");
  }

  if (newPassword !== confirmPassword) {
    return res.render("reset-password", {
      error: "Passwords do not match",
      user,
    });
  }

  // Update the password
  await User.findByIdAndUpdate(user._id, { password: newPassword });

  res.redirect("/url/profile"); // Redirect to profile page after successful password change
}

async function handleDeleteAccount(req, res) {
  const userUid = req.cookies?.uid;
  const user = getUser(userUid);

  if (!user) {
    return res.redirect("/login");
  }

  // Delete the user from the database
  await User.findByIdAndDelete(user._id);

  // Clear the user cookie and redirect to the login page
  res.clearCookie("uid");
  res.redirect("/login");
}



module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUrlDelete,
  handleProfile,
  handleChangePassword,
  handlePasswordUpdate,
  handleDeleteAccount,
};