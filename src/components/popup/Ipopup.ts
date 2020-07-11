export default interface Ipopup {
    width?: string;
    height?: string;
    title?: string;
    pos?: string;
    mask?: boolean;
    content?: (content: HTMLElement) => void;
}