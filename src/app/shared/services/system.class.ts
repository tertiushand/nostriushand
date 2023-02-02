import { iUserInfo, Themes } from "./system.interface";

export class UserInfo {
    pubkey?: string;
    theme: Themes;

    constructor(
        user: iUserInfo
    ) {
        this.pubkey = user.pubkey;
        this.theme = user.theme?user.theme:Themes.default;
    }
}