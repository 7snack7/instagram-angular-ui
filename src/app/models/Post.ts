import {Comment} from "./Comment";

export interface Post {
  id?: number;
  title: string;
  caption: string;
  location: string;
  image?: File;
  likes?: number;
  usersLikes?: string[];
  comments?: Comment[];
  username?: string;
}
