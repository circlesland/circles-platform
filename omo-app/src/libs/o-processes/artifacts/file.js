export const file = (key, label, isReadonly, isOptional) => {
    const artifact = {
        key: key,
        type: "file",
        isReadonly: isReadonly,
        isOptional: isOptional,
        label: label
    };
    const part = {};
    part[key] = artifact;
    return part;
};
