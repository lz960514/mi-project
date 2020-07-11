export default interface Icomponent {
    tempContainer: HTMLElement;
    mask: HTMLElement;
    init: () => void;
    template: () => void;
    handle: () => void;
}