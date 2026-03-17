import { Videos } from "./videos";
import { Auth } from "./auth";

class API {
  auth = new Auth();
  videos = new Videos()
}

export const api = new API();