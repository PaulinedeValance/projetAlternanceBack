import { Request, Response } from 'express'

export const logout = (req: Request, res: Response, next: any) => {
  req.logout(err => {
    if (err) {
      return next(err)
    }
    req.session.destroy(err => {
      if (err) {
        return next(err)
      }
      res.redirect('/login/admin')
    })
  })
}

export default { logout }
