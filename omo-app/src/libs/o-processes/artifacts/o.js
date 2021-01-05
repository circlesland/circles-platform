export const o = (key, label, isReadonly, maxAmount) => {
    const artifact = {
        key: key,
        type: "o",
        isReadonly: isReadonly,
        max: maxAmount,
        label: label
    };
    const part = {};
    part[key] = artifact;
    return part;
};
