export const ether = (key, label, isReadonly, maxAmount) => {
    const artifact = {
        key: key,
        type: "ether",
        isReadonly: isReadonly,
        max: maxAmount,
        label: label
    };
    const part = {};
    part[key] = artifact;
    return part;
};
