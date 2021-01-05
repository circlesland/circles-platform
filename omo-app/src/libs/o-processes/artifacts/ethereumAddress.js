export const ethereumAddress = (key, label, isReadonly) => {
    const artifact = {
        key: key,
        type: "ethereumAddress",
        isReadonly: isReadonly,
        label: label
    };
    const part = {};
    part[key] = artifact;
    return part;
};
