const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.RefreshToken;
  if (!refreshToken) return res.status(403).json({ message: 'Không có Refresh Token' });

  jwt.verify(refreshToken, secretKey, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Refresh Token hết hạn, đăng nhập lại' });

    const newAccessToken = jwt.sign({ userId: decoded.userId }, secretKey, { expiresIn: '15m' });
    res.json({ accessToken: newAccessToken });
  });
};
