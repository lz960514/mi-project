import './style/main.less';
import popup from './components/popup/popup';
import video from './components/video/video'

const listItem: any = document.querySelectorAll('.list-wrap li');

for (let i = 0; i < listItem.length; i++) {
    listItem[i].addEventListener('click', function () {
        const url = this.dataset.url;
        const title = this.dataset.title;
        popup({
            width: '880px',
            height: '556px',
            title,
            pos: 'center',
            mask: true,
            content(elem): void {
                video({
                    url,
                    elem,
                    autoPlay: true
                });
            }
        });
    })
}