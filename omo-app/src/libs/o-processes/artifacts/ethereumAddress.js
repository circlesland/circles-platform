export const ethereumAddress = (key, label, isReadonly, enableAutocomplete) => {
    const artifact = {
        key: key,
        type: "ethereumAddress",
        isReadonly: isReadonly,
        enableAutocomplete: enableAutocomplete,
        label: label
    };
    const part = {};
    part[key] = artifact;
    return part;
};
