export const inviteCredits = (key, label, isReadonly) => {
    const artifact = {
        key: key,
        type: "inviteCredits",
        isReadonly: isReadonly,
        label: label
    };
    const part = {};
    part[key] = artifact;
    return part;
};
