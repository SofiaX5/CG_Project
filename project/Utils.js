
export function setAppearanceColor(appearance, color) {
    appearance.setAmbient(color[0] * 0.5, color[1] * 0.5, color[2] * 0.5, 1);
    appearance.setDiffuse(color[0], color[1], color[2], 1);
    appearance.setSpecular(0.1, 0.1, 0.1, 1);
    appearance.setShininess(10.0);
}

export function setAppearanceColor(appearance, color) {
    appearance.setAmbient(color[0] * 0.5, color[1] * 0.5, color[2] * 0.5, 1);
    appearance.setDiffuse(color[0], color[1], color[2], 1);
    appearance.setSpecular(0.1, 0.1, 0.1, 1);
    appearance.setShininess(10.0);
}