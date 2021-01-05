export const keyphrase = (key, label, isReadonly) => {
    const artifact = {
        key: key,
        type: "keyphrase",
        isReadonly: isReadonly,
        isOptional: false,
        label: label
    };
    const part = {};
    part[key] = artifact;
    return part;
};
