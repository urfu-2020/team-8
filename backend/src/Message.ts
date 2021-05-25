import {User} from "./db"

export type Message = {
    text: string,
    from: User
    to: User
    time: string
  }