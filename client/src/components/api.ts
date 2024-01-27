import Axios, { Method } from 'axios';
export const baseUrl = 'http://localhost:3577';

export class APIError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'APIError';
    }
}

export function registerUser({ username, display_name, password }: { username: string; display_name: string; password: string; }) {
    return new API().request({
        endpoint: '/auth/register',
        method: 'POST',
        body: { username, display_name, password },
    });
}

export function fetchPosts({ limit, offset }: { limit: number; offset: number; }) {
    return new API().request({
        endpoint: `/posts/${limit}/${offset}`,
        method: 'GET',
    });
}

export class API {

    accessToken?: string;

    async request({ endpoint, method, body, headers }: {
        endpoint: string;
        method: Method;
        body?: object;
        headers?: object;
      }) {
          try {
              const { data } = await Axios({
                  url: `${baseUrl}${endpoint}`,
                  method,
                  data: body ? body: {},
                  headers: {
                      ...headers,
                      'Content-Type': 'application/json',
                      'x-access-token': `Bearer ${this.accessToken}`,
                  },
                  withCredentials: true,
              });
  
              return data;
          } catch (err: any) {
              err = err.response.data.error;
  
              throw new APIError(
                  `${err.charAt(0).toUpperCase() + err.slice(1)}.`
              );
          }
      }

      async refreshToken() {
        const data = await this.request({
            endpoint: '/auth/refresh',
            method: 'POST',
        });
        this.accessToken = data.accessToken;
        return data;
      }

      async login({ username, password }: { username: string; password: string; }) {
        const data = await this.request({
            endpoint: '/auth/login',
            method: 'POST',
            body: { username, password },
        });
        this.accessToken = data.accessToken;
        return data;
      }

      async createPost({ title, description, content }: { title: string; description: string; content: string; })  {
        return await this.request({
            endpoint: '/posts',
            method: 'POST',
            body: { title, description, content },
        });
      }

      async createComment({ post_id, content }: { post_id: number; content: string; }) {
        return await this.request({
            endpoint: '/posts/comment',
            method: 'POST',
            body: { post_id, content },
        });
      }

    async likePost({ post_id }: { post_id: number; }) {
        return await this.request({
            endpoint: '/posts/like',
            method: 'POST',
            body: { post_id },
        });
    }   

    async logOut() {
        return await this.request({
            endpoint: '/auth/logout',
            method: 'POST',
        });
    }

    async deletePost({ post_id }: { post_id: number; }) {
        return await this.request({
            endpoint: '/posts/' + post_id,
            method: 'DELETE',
        });
    }
}   