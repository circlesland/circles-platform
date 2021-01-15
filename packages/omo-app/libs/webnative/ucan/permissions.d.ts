export declare type Permissions = {
    app?: AppInfo;
    fs?: FileSystemPermissions;
};
export declare type AppInfo = {
    name: string;
    creator: string;
};
export declare type FileSystemPermissions = {
    privatePaths: Array<string>;
    publicPaths: Array<string>;
};
