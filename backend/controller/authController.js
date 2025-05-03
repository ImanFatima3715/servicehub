const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { token, role } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload(); // email, name, etc.

    // 1. Check if user exists in DB
    // 2. If not, create user with `role`
    // 3. Create session / JWT
    // 4. Send response back

  } catch (error) {
    console.error('Google Login Error:', error);
    return res.status(401).json({ message: 'Invalid Google Token' });
  }
};

exports.googleRegister = async (req, res) => {
  const { token, role } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload(); // email, name, etc.

    // 1. Check if user exists in DB
    // 2. If not, create user with `role`
    // 3. Create session / JWT
    // 4. Send response back

  } catch (error) {
    console.error('Google Login Error:', error);
    return res.status(401).json({ message: 'Invalid Google Token' });
  }
};
