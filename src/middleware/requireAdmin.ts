const requireAdmin = (req: any, res: any, next: any) => {
  // Vérifie si l'utilisateur est authentifié et a le rôle d'admin
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next() // Autoriser l'accès à la route suivante
  } else {
    res.redirect('/login/admin') // Sinon on redirige vers la page de connexion si l'utilisateur n'est pas authentifié ou n'a pas le rôle d'admin
  }
}

export default requireAdmin
