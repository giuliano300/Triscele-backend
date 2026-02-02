export interface JwtPayload {
  sub: string;     // l'ID dell'utente (MongoDB _id)
  email: string;   // l'email dell'utente
  role: string;    // admin o client
  iat?: number;    // issued at (opzionale)
  exp?: number;    // expiration (opzionale)
}
