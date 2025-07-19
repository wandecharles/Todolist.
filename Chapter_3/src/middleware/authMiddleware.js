import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ err: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id || decoded.userId // match your payload key
    if (!req.userId) {
      return res.status(403).json({ err: 'user not allowed' })
    }
    next()
  } catch (err) {
    return res.status(403).json({ err: 'invalid token' })
  }
}

export default authMiddleware
