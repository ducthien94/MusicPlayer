const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const title = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playlist = $('.playlist')
const cd = $('.cd')
const repeatBtn = $('.btn-repeat')
const prevBtn = $('.btn-prev')
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const currentTime = $('.current-time')
const totalTime = $('.total-time')
const progress = $('#progress')


const app = {
    songs: [
        {
            name: 'Ala ela',
            singer: ' G-Ducky, Ricky Star, Karik',
            imagePath: './assets/images/1.jpg',
            musicPath: './assets/musics/1.mp3'
        },
        {
            name: 'Phải chăng em đã yêu?',
            singer: 'Juky San, RedT',
            imagePath: './assets/images/2.jpg',
            musicPath: './assets/musics/2.mp3'
        },
        {
            name: 'Lỡ say bye là bye',
            singer: 'Lemese, Changg',
            imagePath: './assets/images/3.jpg',
            musicPath: './assets/musics/3.mp3'
        },
        {
            name: 'Chúng ta sau này',
            singer: 'T.R.I',
            imagePath: './assets/images/4.jpg',
            musicPath: './assets/musics/4.mp3'
        },
        {
            name: 'Nàng thơ',
            singer: 'Hoàng Dũng',
            imagePath: './assets/images/5.jpg',
            musicPath: './assets/musics/5.mp3'
        },
        {
            name: 'Níu duyên',
            singer: 'Lê Bảo Bình',
            imagePath: './assets/images/6.jpg',
            musicPath: './assets/musics/6.mp3'
        },
        {
            name: 'Nhớ người hay nhớ',
            singer: 'Khói, Sofia, Châu Đăng Khoa',
            imagePath: './assets/images/7.jpg',
            musicPath: './assets/musics/7.mp3'
        },
        {
            name: 'Tình bạn diệu kì',
            singer: 'Ricky Star, Lăng LD, AMee',
            imagePath: './assets/images/8.jpg',
            musicPath: './assets/musics/8.mp3'
        },
    ],
    currentIndex: 0,
    isRandom: false,
    isPlaying: false,
    isRepeat: false,
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex]
            }
        })
    },
    renderSongs: function () {
        let htmls = this.songs.map((song, index) => {
            return `
                <div data-index="${index}" class="song ${index === this.currentIndex ? 'active' : ''}">
                    <div class="thumb" style="background-image: url('${song.imagePath}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })

        playlist.innerHTML = htmls.join('')
    },
    loadCurrentSong: function () {
        title.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.imagePath})`
        audio.src = this.currentSong.musicPath
    },
    scrollToSongActive: function () {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        })
    },
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lí phóng to/thu nhỏ CD thumb
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
        }

        const cdThumbAnimation = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 25000,
            iterations: Infinity
        })
        cdThumbAnimation.pause()

        //Xử lí play/pause bài hát
        playBtn.onclick = function () {
            this.isPlaying = !this.isPlaying
            if (this.isPlaying) {
                audio.play()
            } else {
                audio.pause()
            }
        }

        //Xử lí khi phát audio
        audio.onplay = function() {
            player.classList.add('playing')
            cdThumbAnimation.play()
        }

        //Xử lí khi dừng audio
        audio.onpause = function() {
            player.classList.remove('playing')
            cdThumbAnimation.pause()
        }

        // Cập nhật thời gian hiên tại của bài hát
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const percentTime = Math.ceil(audio.currentTime / audio.duration * 100)
                progress.value = percentTime
                $('.current-time').textContent = _this.formatTime(audio.currentTime)
                $('.total-time').textContent = _this.formatTime(audio.duration)
            }
        }

        //Xử lý khi tua thời gian
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100 * e.target.value)
            audio.currentTime = seekTime
        }

        // Xử lý next bài hát
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            _this.renderSongs()
            _this.scrollToSongActive()
            audio.play()
        }

        // Xử lý prev bài hát
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong()
            }
            _this.renderSongs()
            _this.scrollToSongActive()
            audio.play()
        }

        //Xử lý bật/tắt random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //Xử lý bật/tắt lặp bài hát
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //Xử lý tự chuyển bài khi kết thúc or phát lại bài hát
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
                // nextBtn.click()
            } else {
                _this.nextSong()
                _this.renderSongs()
                audio.play()
            }
            _this.scrollToSongActive()
        }

        // Xử lý click bài hát nào thì phát bài hát đó
        playlist.onclick = function (e) {
            const songElement = e.target.closest('.song:not(.active)')

            if (songElement) {
                $('.song.active').classList.remove('active')
                songElement.classList.add('active')
                _this.currentIndex = parseInt(songElement.dataset.index)
                _this.loadCurrentSong()
                audio.play()
            }
        }

    },
    nextSong: function () {
        app.currentIndex++
        if (app.currentIndex >= app.songs.length) {
            app.currentIndex = 0
        }
        app.loadCurrentSong()
    },
    prevSong: function () {
        app.currentIndex--
        if (app.currentIndex < 0) {
            app.currentIndex = app.songs.length - 1
        }
        app.loadCurrentSong()
    },
    randomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * app.songs.length)
        } while (newIndex == app.currentIndex)
        app.currentIndex = newIndex
        app.loadCurrentSong()
    },
    activeSong: function () {
        console.log(songs[this.currentIndex])
    },
    formatTime: function (time) {
        return new Date(time * 1000).toISOString().substr(14, 5)
    },
    start: function () {
        //Đinh nghĩa các thuộc tính cho object
        this.defineProperties()

        //Render playlist
        this.renderSongs()

        // Tải bài hát đầu tiên
        this.loadCurrentSong()

        //Lắng nghe & xử lí sự kiện DOM
        this.handleEvents()
    }
}

app.start()
