const {compare, hashPassword} = require("../helpers/bcrypt");
const {signToken, verifyToken} = require("../helpers/jwt");
const {ErrorResponse, SuccessResponse} = require("../helpers/response");
// const {OAuth2Client} = require("google-auth-library");
// const enumHelper = require("../helpers/enum");
// const passport = require("passport");
// const { decode } = require("jsonwebtoken");

const {User} = require("../models");

class UserController {
  static async login(req, res, next) {
    try {
      const {email, password} = req.body;
      const findUser = await User.findOne({where: {email}});

      if (!findUser || !compare(password, findUser.password)) {
        throw ErrorResponse(401, "Invalid email/password");
      }

      const accessToken = signToken(findUser, "LOGIN");
      SuccessResponse(res, 200, "Successfully Login", {
        access_token: accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async register(req, res, next) {
    try {
      const {firstName, lastName, password} = req.body;

      const newUser = await User.create(
        {
          ...req.body,
          fullName: firstName + " " + lastName,
          password: hashPassword(password),
        },
        {returning: true}
      );

      SuccessResponse(res, 201, "Successfully Create New User", {
        ...newUser?.dataValues,
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyToken(req, res, next) {
    try {
      const {access_token} = req.headers;

      const checkUserByToken = verifyToken(access_token);
      if (!checkUserByToken) throw ErrorResponse(400, "Token does not exist");

      SuccessResponse(res, 200, "Successfully Get User", {...checkUserByToken});
    } catch (error) {
      next(error);
    }
  }

  //   static async googleLogin(req, res, next) {
  //     try {
  //       const client = new OAuth2Client(process.env.CLIENT_ID);
  //       const {googleToken} = req.body;
  //       const ticket = await client.verifyIdToken({
  //         idToken: googleToken,
  //         audience: process.env.CLIENT_ID,
  //       });

  //       const payload = ticket.getPayload();
  //       const userGoogle = await Users.findOne({
  //         where: {
  //           email: payload.email,
  //         },
  //       });

  //       if (userGoogle) {
  //         const accessToken = signToken({
  //           id: userGoogle.id,
  //           userName: userGoogle.userName,
  //           email: userGoogle.email,
  //         });

  //         const result = {
  //           meta: {
  //             status: "Success",
  //             code: 200,
  //             msg: "Successfully Login",
  //             data: new Date(),
  //           },
  //           data: {
  //             access_token: accessToken,
  //             user: {
  //               id: userGoogle.id,
  //               userName: userGoogle.userName,
  //               email: userGoogle.email,
  //               regisBy: userGoogle.regisBy,
  //               membershipType: userGoogle.membershipType,
  //             },
  //           },
  //           error: null,
  //         };

  //         res.status(200).json(result);
  //       } else {
  //         const newUser = await Users.create({
  //           email: payload.email,
  //           userName:
  //             payload.name ||
  //             payload.email.substring(0, payload.email.indexOf("@")),
  //           password: hashPassword(process.env.GOOGLE_PASS),
  //           regisBy: enumHelper.regisByEnum.GOOGLE,
  //         });

  //         const accessToken = signToken({
  //           id: newUser.id,
  //           userName: newUser.userName,
  //           email: newUser.email,
  //         });

  //         const result = {
  //           meta: {
  //             status: "Success",
  //             code: 200,
  //             msg: "Successfully Login",
  //             data: new Date(),
  //           },
  //           data: {
  //             access_token: accessToken,
  //             user: {
  //               id: newUser.id,
  //               userName: newUser.userName,
  //               email: newUser.email,
  //               regisBy: newUser.regisBy,
  //               membershipType: newUser.membershipType,
  //             },
  //           },
  //           error: null,
  //         };

  //         res.status(200).json(result);
  //       }
  //     } catch (err) {
  //       next(err);
  //     }
  //   }

  //   static async getClientIdGoogle(req, res, next) {
  //     try {
  //       const result = {
  //         meta: {
  //           status: "Success",
  //           code: 200,
  //           msg: "Successfully getClientId",
  //           data: new Date(),
  //         },
  //         data: {
  //           clientId: process.env.CLIENT_ID,
  //         },
  //         error: null,
  //       };
  //       res.status(200).json(result);
  //     } catch (err) {
  //       next(err);
  //     }
  //   }

  //   static async facebookLogin(req, res, next) {
  //     try {
  //       passport.authenticate("facebook-token", (error, user, info) => {
  //         if (error) {
  //           return next(error);
  //         }

  //         if (!user) {
  //           return res
  //             .status(401)
  //             .json({ message: "Autentikasi dengan akun Facebook gagal." });
  //         }

  //         // Di sini Anda dapat menyimpan data pengguna ke database atau melakukan operasi lainnya sesuai kebutuhan
  //         // Contoh sederhana, kembalikan data pengguna sebagai respons
  //         return res.json(user);
  //       })(req, res, next);
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
}

module.exports = UserController;
