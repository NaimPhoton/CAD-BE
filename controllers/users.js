const {compare, hashPassword} = require("../helpers/bcrypt");
const {signToken, verifyToken} = require("../helpers/jwt");
// const {OAuth2Client} = require("google-auth-library");
// const enumHelper = require("../helpers/enum");
// const passport = require("passport");
// const { decode } = require("jsonwebtoken");

const {User} = require("../models");

class UserController {
  static async login(req, res, next) {
    try {
      const {email, password} = req.body;
      const payload = {
        email,
        password,
      };
      const findUser = await User.findOne({where: {email: payload.email}});

      if (!findUser) {
        throw {status: 401, message: "Invalid email/password"};
      } else if (!compare(payload.password, findUser.password)) {
        throw {status: 401, message: "Invalid email/password"};
      } else {
        const accessToken = signToken({
          id: findUser.id,
          firstName: findUser.firstName,
          lastName: findUser.lastName,
          fullName: findUser.fullName,
          email: findUser.email,
        });

        const result = {
          meta: {
            status: "Success",
            code: 200,
            msg: "Successfully Login",
            data: new Date(),
          },
          data: {
            access_token: accessToken,
          },
          error: null,
        };

        res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  static async register(req, res, next) {
    try {
      const {firstName, lastName, email, password} = req.body;

      const newUser = await User.create(
        {
          firstName,
          lastName,
          fullName: firstName + " " + lastName,
          email,
          password: hashPassword(password),
        },
        {returning: true}
      );

      const result = {
        meta: {
          status: "Success",
          code: 201,
          msg: "Successfully Create New User",
          data: new Date(),
        },
        data: {
          ...newUser?.dataValues,
        },
        error: null,
      };
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async verifyToken(req, res, next) {
    try {
      const {access_token} = req.headers;

      const checkUserByToken = verifyToken(access_token);
      if (!checkUserByToken) {
        throw {
          status: 400,
          message: "Token does not exist",
        };
      }

      const result = {
        meta: {
          status: "Success",
          code: 200,
          msg: "Successfully Get User",
          data: new Date(),
        },
        data: {
          ...checkUserByToken,
        },
        error: null,
      };

      res.status(200).json(result);
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
