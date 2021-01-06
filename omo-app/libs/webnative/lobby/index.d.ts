/**
 * Create a user account.
 */
export declare function createAccount(userProps: {
    email: string;
    username: string;
}): Promise<{
    success: boolean;
}>;
/**
 * Check if a username is available.
 */
export declare function isUsernameAvailable(username: string): Promise<boolean>;
/**
 * Check if a username is valid.
 */
export declare function isUsernameValid(username: string): boolean;
