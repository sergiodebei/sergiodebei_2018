/*
 |--------------------------------------------------------------------------
 | Shared code
 |--------------------------------------------------------------------------
 |
 | Use this file to put bits of code that don't belong anywhere else naturally.
 | Before putting code here, try and figure out how that same code could fit
 | into a conditioner module to be used and loaded only when needed!
 |
 */

const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

export function getDevice(device) {
    if (viewportWidth < 768) {
        device = 'mobile';
    } else if (viewportWidth < 992) {
        device = 'tablet';
    } else if (viewportWidth < 1200) {
        device = 'desktop';
    } else if (viewportWidth < 1400) {
        device = 'desktop_big';
    } else if (viewportWidth < 1600) {
        device = 'desktop_extra_big';
    } else if (viewportWidth < 1800) {
        device = 'desktop_1600';
    } else {
        device = 'desktop_1800';
    }
    document.body.classList.add(device);
    return device;
}
