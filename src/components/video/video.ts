const styles = require('./video.less')
import Ivideo from './Ivideo'
import Icomponent from './Icomponent'
import { formtTime } from './tools'

function video(options: Ivideo) {
    return new Video(options);
}

class Video implements Icomponent {
    public tempContainer;
    public timer;
    constructor(private settings: Ivideo) {
        this.settings = Object.assign({
            width: '100%',
            height: '100%',
            autoPlay: false
        }, this.settings);
        this.init();
    }

    init(): void {
        this.template();
        this.handle();
    }

    template(): void {
        this.tempContainer = document.createElement('div');
        this.tempContainer.className = styles.video;
        this.tempContainer.style.width = this.settings.width;
        this.tempContainer.style.height = this.settings.height;
        this.tempContainer.innerHTML = `
            <video class="${styles['video-content']}" src="${this.settings.url}"></video>
            <div class="${styles['video-controls']}">
                <div class="${styles['video-progress']}">
                    <div class="${styles['video-progress-now']}"></div>
                    <div class="${styles['video-progress-suc']}"></div>
                    <div class="${styles['video-progress-bar']}"></div>
                </div>

                <div class="${styles['video-play']}">
                    <i class="iconfont icon-bofang"></i>
                </div>

                <div class="${styles['video-time']}">
                    <span>00:00</span>/<span>00:00</span>                   
                </div>

                <div class="${styles['video-full']}">
                    <i class="iconfont icon-quanpingzuidahua"></i>
                </div>

                <div class="${styles['video-volume']}">
                    <i class="iconfont icon-yinliang"></i>
                    <div class="${styles['video-volprogress']}">
                        <div class="${styles['video-volprogress-now']}"></div>
                        <div class="${styles['video-volprogress-bar']}"></div>
                    </div>
                </div>  
            </div>
        `;

        if (typeof this.settings.elem === 'object') {
            this.settings.elem.appendChild(this.tempContainer);
        } else {
            document.querySelector(`${this.settings.elem}`).appendChild(this.tempContainer);
        }
    }

    handle(): void {
        const videoContent: HTMLVideoElement = document.querySelector(`.${styles['video-content']}`);
        const videoControls = document.querySelector(`.${styles['video-controls']}`);
        const videoPlay = this.tempContainer.querySelector(`.${styles['video-play']} i`);
        const videoTimes = this.tempContainer.querySelectorAll(`.${styles['video-time']} span`);
        const videoFull = this.tempContainer.querySelector(`.${styles['video-full']} i`);
        const videoProgress = this.tempContainer.querySelector(`.${styles['video-progress']}`);
        const videoVoProgress = this.tempContainer.querySelectorAll(`.${styles['video-volprogress']} div`);
        const videoVolume = this.tempContainer.querySelector(`.${styles['video-volume']} i`);

        videoContent.volume = 0.5;
        if (this.settings.autoPlay) {
            this.timer = setInterval(playing, 1000);
            videoContent.play();
        }

        this.tempContainer.addEventListener('mouseenter', function () {
            videoControls['style'].bottom = 0;
        })

        this.tempContainer.addEventListener('mouseleave', function () {
            videoControls['style'].bottom = '-60px';
        })

        videoContent.addEventListener('canplay', () => {
            videoTimes[1].innerHTML = formtTime(videoContent['duration']);
        })
        videoContent.addEventListener('play', () => {
            videoPlay.className = 'iconfont icon-zanting';
            this.timer = setInterval(() => {
                playing();
            }, 1000)
        })
        videoContent.addEventListener('pause', () => {
            videoPlay.className = 'iconfont icon-bofang';
            clearInterval(this.timer);
        })
        videoPlay.addEventListener('click', () => {
            if (videoContent['paused']) {
                videoContent['play']();
            } else {
                videoContent['pause']();
            }
        })

        videoFull.addEventListener('click', () => {
            videoContent.requestFullscreen();
        })

        videoProgress.querySelectorAll(`div`)[2].addEventListener('mousedown', function (ev: MouseEvent) {
            const downX = ev.pageX;
            const downL = this.offsetLeft;
            // console.log(ev);
            document.onmousemove = (ev: MouseEvent) => {
                let scale = (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth;
                if (scale < 0) {
                    scale = 0;
                } else if (scale > 1) {
                    scale = 1;
                }

                videoProgress.querySelectorAll(`div`)[0].style.width = scale * 100 + '%';
                videoProgress.querySelectorAll(`div`)[1].style.width = scale * 100 + '%';
                this.style.left = scale * 100 + '%';
                videoContent.currentTime = scale * videoContent.duration;
            }

            document.onmouseup = () => {
                document.onmousemove = document.onmouseup = null;
            }

            ev.preventDefault();
        })


        // 音量控制
        videoVoProgress[1].addEventListener('mousedown', function (ev: MouseEvent) {
            const downX = ev.pageX;
            const downL = this.offsetLeft;
            // console.log(ev);
            document.onmousemove = (ev: MouseEvent) => {
                let scale = (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth;
                if (scale < 0) {
                    scale = 0;
                } else if (scale > 1) {
                    scale = 1;
                }

                if (scale === 0) {
                    videoVolume.classList.remove('icon-yinliang');
                    videoVolume.classList.add('icon-yinliang-guan');
                } else if (scale > 0) {
                    videoVolume.classList.remove('icon-yinliang-guan');
                    videoVolume.classList.add('icon-yinliang');
                }

                videoVoProgress[0].style.width = scale * 100 + '%';
                this.style.left = scale * 100 + '%';
                videoContent.volume = scale;
            }

            document.onmouseup = () => {
                document.onmousemove = document.onmouseup = null;
            }

            ev.preventDefault();
        })

        videoVolume.addEventListener('click', () => {
            if (videoContent.volume > 0) {
                videoContent.volume = 0;
                videoVoProgress[0].style.width = '0%';
                videoVoProgress[1].style.left = '0%';
                videoVolume.classList.remove('icon-yinliang');
                videoVolume.classList.add('icon-yinliang-guan');
            } else if (videoContent.volume === 0) {
                videoContent.volume = 0.5;
                videoVoProgress[0].style.width = '50%';
                videoVoProgress[1].style.left = '50%';
                videoVolume.classList.remove('icon-yinliang-guan');
                videoVolume.classList.add('icon-yinliang');
            }
        })

        document.addEventListener('keydown', (ev: KeyboardEvent) => {
            if (ev.keyCode === 32) {
                if (videoContent['paused']) {
                    videoContent['play']();
                } else {
                    videoContent['pause']();
                }
            }
        })

        function playing(): void {
            const scale = videoContent.currentTime / videoContent.duration;
            const scaleSuc = videoContent.buffered.end(0) / videoContent.duration;
            videoTimes[0].innerHTML = formtTime(videoContent['currentTime']);
            videoProgress.querySelectorAll(`div`)[0].style.width = scale * 100 + '%';
            videoProgress.querySelectorAll(`div`)[1].style.width = scaleSuc * 100 + '%';
            videoProgress.querySelectorAll(`div`)[2].style.left = scale * 100 + '%';
        }
    }
}

export default video