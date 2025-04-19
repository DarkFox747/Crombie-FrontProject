export {}

// Create a type for the roles
export type Roles = 'admin' | 'profesor' | 'alumno' |'professor'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}