export const text = (key, label, isReadonly, isOptional) => {
    const artifact = {
        key: key,
        type: "text",
        isReadonly: isReadonly,
        isOptional: isOptional,
        label: label
    };
    const part = {};
    part[key] = artifact;
    return part;
};
