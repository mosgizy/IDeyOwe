

const authUser = (request, accessToken, refreshToken, profile, done) => {
  // console.log(profile)
  return done(null, profile);
}

module.exports = authUser