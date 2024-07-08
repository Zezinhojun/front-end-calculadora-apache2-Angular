import { Observable } from "rxjs";
import { ApiResponse, LoginPayload, RegisterPayload, User } from "../../model/commom.model";

export default interface IAuthService {
  register(payload: RegisterPayload): Observable<ApiResponse<User>>
  login(payload: LoginPayload): Observable<ApiResponse<User>>
  me(): Observable<ApiResponse<User>>
  getUserToken(): string | null
  logout(): void
}
