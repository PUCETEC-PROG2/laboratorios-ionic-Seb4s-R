export interface Repository {
  name: string;
  avatarUrl: string;
  description: string;
  language: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}