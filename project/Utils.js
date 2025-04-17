
export function setAppearanceColor1(appearance, color) {
    appearance.setAmbient(color[0] * 0.5, color[1] * 0.5, color[2] * 0.5, 1);
    appearance.setDiffuse(color[0], color[1], color[2], 1);
    appearance.setSpecular(0.1, 0.1, 0.1, 1);
    appearance.setShininess(10.0);
}

export function setAppearanceColor2(appearance, color) {
    appearance.setAmbient(color[0] * 0.5, color[1] * 0.5, color[2] * 0.5, 1);
    appearance.setDiffuse(color[0], color[1], color[2], 1);
    appearance.setSpecular(0.1, 0.1, 0.1, 1);
    appearance.setShininess(10.0);
}


// Forest functions
export function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomOrient() {
    let num = getRandomInt(0, 1);
    if (num == 0) return "x";
    return "z";
}

export function getRandomColorLeaf() {
    const r = getRandomFloat(0.1, 0.15);
    const g = getRandomFloat(0.3, 0.6);
    const b = getRandomFloat(0.1, 0.2);
    return [r, g, b];
}