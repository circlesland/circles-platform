export const choice = (key, label, choices) => {
    const artifact = {
        key: key,
        type: "choice",
        isReadonly: false,
        label: label,
        choices: choices
    };
    const part = {};
    part[key] = artifact;
    return part;
};
