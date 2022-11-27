require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  findEmail,
  create,
  selectAllUsers,
  activateEmail,
  findByToken,
  updateImgProfile,
} = require("../models/users");
const commonHelper = require("../helper/common");
const authHelper = require("../helper/auth");
const sendEmail = require("../utils/email/sendEmail");
const modelStore = require("../models/store");
const deleteFile = require("../utils/delete");
const { uploadGoogleDrive } = require("../utils/uploadGoogleDrive");
const deleteDrive = require("../utils/deleteDrive");

const UserController = {
  register: async (req, res, next) => {
    try {
      const { email, password, fullname, role, StoreName } = req.body;
      const { rowCount } = await findEmail(email);
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
      const id = uuidv4();
      const token = crypto.randomBytes(30).toString("hex");
      // const token = true

      if (rowCount) {
        return next(createError(403, "Email is already used"));
      }
      const data = {
        id,
        email,
        passwordHash,
        fullname,
        role: role || "buyer",
        verify: token,
      };
      if (data.role === "seller") {
        const dataStore = {
          id: uuidv4(),
          name: StoreName,
          email,
          user_id: id,
          description: null,
          phonenumber: null,
        };
        await modelStore.insert(dataStore);
      }

      await create(data);
      sendEmail({ email, fullname, token });
      commonHelper.response(
        res,
        null,
        201,
        "Success register please check Email to activate account",
        null
      );
    } catch (error) {
      console.log(error);
    }
  },

  ActivateAccount: async (req, res, next) => {
    try {
      const { token } = req.params;
      console.log(token);
      const user = await findByToken("verify", token);

      if (!user.rowCount) {
        res.send(
          `<div>
            <h1>Activation Failed </h1>
            <h3>Token invalid </h3> 
          </div>`
        );
        return;
      }

      console.log(user.rows[0].id);
      await activateEmail(user.rows[0].id);
      res.send(
        `<div>
            <h1>Activation Success </h1>
           <!-- <a href='${process.env.API_FRONTEND}/Login/worker'><button class="btn btn-primary">Login Hire Jobs</button></a> -->

                <a>Please Login</a> 
          </div>`
      );
    } catch (error) {
      console.log(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const {
        rows: [user],
      } = await findEmail(email);
      if (!user) {
        return commonHelper.response(res, null, 403, "Email is invalid");
      } else if (user.verify === "true") {
        const isValidPassword = bcrypt.compareSync(password, user.password);
        console.log(isValidPassword);

        if (!isValidPassword) {
          return commonHelper.response(res, null, 403, "Password is invalid");
        }
        delete user.password;
        const payload = {
          email: user.email,
          role: user.role,
          id: user.id,
        };
        user.token = authHelper.generateToken(payload);
        user.refreshToken = authHelper.generateRefreshToken(payload);

        commonHelper.response(res, user, 201, "login is success");
      }
      if (user.verify !== "true")
        return commonHelper.response(
          res,
          null,
          403,
          "please activation Account!"
        );
    } catch (error) {
      console.log(error);
    }
  },

  selectAll: (req, res, next) => {
    selectAllUsers()
      .then((result) =>
        commonHelper.response(res, result.rows, 200, "get data success")
      )
      .catch((err) => res.send(err));
  },

  profile: async (req, res, next) => {
    const email = req.decoded.email;
    const {
      rows: [user],
    } = await findEmail(email);
    delete user.password;
    commonHelper.response(res, user, 200);
  },

  refreshToken: (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT);
    const payload = {
      email: decoded.email,
      role: decoded.role,
    };
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    };
    console.log(result);
    commonHelper.response(res, result, 200, "RefreshToken success", null);
  },
  updatePhotoProfile: async (req, res, next) => {
    try {
      const email = req.decoded.email;
      const id = req.decoded.id;
      console.log(id);
      const { phonenumber, gender, fullname } = req.body;
      const user = await findEmail(email);
      console.log(!user.rowCount);
      if (!user.rowCount) {
        if (req.files) {
          deleteFile(req.files.image[0].path);
        }
        commonHelper.response(res, null, 404, "Update profile failed");
        return;
      }

      let { image } = user.rows[0];
      console.log(image);

      if (req.files) {
        if (req.files.image) {
          if (user.rows[0].image) {
            let id_drive = user.rows[0].image.split("id=")[1];
            console.log(id_drive);
            await deleteDrive(id_drive);
          }
          console.log(req.files.image);
          image = await uploadGoogleDrive(req.files.image[0]);
          deleteFile(req.files.image[0].path);
        }
      }
      console.log("ini image", image);
      const data = {
        id,
        fullname,
        phonenumber,
        gender,
        image: image.id
          ? `https://drive.google.com/uc?export=view&id=${image.id}`
          : null,
      };
      await updateImgProfile(data);
      commonHelper.response(res, null, 200, "updated Photo");
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = UserController;
