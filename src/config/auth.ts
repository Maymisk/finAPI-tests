console.log(process.env.JWT_SECRET)
export default {
  jwt: {
    secret: "senhasupersecreta123",
    expiresIn: '1d'
  }
}
