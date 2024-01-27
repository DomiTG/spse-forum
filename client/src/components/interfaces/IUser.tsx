import { API } from "../api";

export default interface IUser {
    id: number;
    username: string;
    display_name: string;
    account_created: Date;
    is_admin: boolean;
    api: API;
}