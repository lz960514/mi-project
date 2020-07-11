import Ipopup from './Ipopup'
import Icomponent from './Icomponent'
// import styles from './popup.less'
const styles = require('./popup.less')

function popup(options: Ipopup) {
    return new Popup(options);
}

class Popup implements Icomponent {
    public tempContainer;
    public mask;
    constructor(private settings: Ipopup) {
        this.settings = Object.assign({
            width: '100%',
            height: '100%',
            title: '',
            pos: 'center',
            mask: true,
            content: function (): void { }
        }, this.settings);
        this.init();
    }

    init(): void {
        this.template();
        this.settings.mask && this.createMask();
        this.handle();
        this.contentCallback();
    }

    template(): void {
        this.tempContainer = document.createElement('div');
        this.tempContainer.className = styles.popup;
        this.tempContainer.style.width = this.settings.width;
        this.tempContainer.style.height = this.settings.height;
        this.tempContainer.innerHTML = `
            <div class="${styles['popup-title']}">
                <h3>${ this.settings.title}</h3>
                <i class="iconfont icon-guanbi"></i>
            </div>
            <div class="${styles['popup-content']}">

            </div>
        `;
        document.body.appendChild(this.tempContainer);
        if (this.settings.pos === 'left') {
            this.tempContainer.style.left = 0;
            this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) + 'px';
        } else if (this.settings.pos === 'right') {
            this.tempContainer.style.right = 0;
            this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) + 'px';
        } else {
            this.tempContainer.style.left = (window.innerWidth - this.tempContainer.offsetWidth) / 2 + 'px';
            this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) / 2 + 'px';
        }
    }

    handle(): void {
        const popupClose = this.tempContainer.querySelector(`.${styles['popup-title']} i`);
        popupClose.addEventListener('click', () => {
            document.body.removeChild(this.tempContainer);
            this.settings.mask && document.body.removeChild(this.mask);
        })
    }

    createMask(): void {
        this.mask = document.createElement('div');
        this.mask.className = styles.mask;
        this.mask.style.width = '100%';
        this.mask.style.height = document.body.offsetHeight + 'px';
        document.body.appendChild(this.mask);
    }

    contentCallback(): void {
        const popupContent = this.tempContainer.querySelector(`.${styles['popup-content']}`);
        this.settings.content(popupContent);
    }
}

export default popup