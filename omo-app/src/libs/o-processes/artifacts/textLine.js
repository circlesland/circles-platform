export const textLine = (key, label, isReadonly, isOptional) => {
    const artifact = {
        key: key,
        type: "string",
        isReadonly: isReadonly,
        isOptional: isOptional,
        label: label
    };
    const part = {};
    part[key] = artifact;
    return part;
};
