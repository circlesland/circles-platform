export interface Entry {
    fissionName: string;
    circlesSafe: string;
    firstName: string;
    lastName: string;
    //avatarUrl: string;
}

export interface Directory
{
    [fissionName: string]: Entry;
}
