(() => {
 'use strict';
 const video=document.querySelector('#brandFilmVideo'),player=document.querySelector('#brandFilmPlayer');
 if(!video||!player)return;
 const q=id=>document.getElementById(id),toggle=q('brandFilmToggle'),restart=q('brandFilmRestart'),seek=q('brandFilmSeek'),fullscreen=q('brandFilmFullscreen'),fallback=q('brandFilmFallback');
 let active=false,seeking=false;
 const time=value=>{const s=Math.max(0,Math.floor(value||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
 function update(){const duration=Number.isFinite(video.duration)?video.duration:15;seek.max=String(duration);if(!seeking)seek.value=String(video.currentTime||0);q('brandFilmTime').textContent=time(video.currentTime)+' / '+time(duration);toggle.textContent=video.ended?'↻ 다시 재생':video.paused?'▶ 재생':'Ⅱ 일시정지';toggle.setAttribute('aria-label',video.ended?'브랜드 영상 다시 재생':video.paused?'브랜드 영상 재생':'브랜드 영상 일시정지');const full=document.fullscreenElement===player;fullscreen.textContent=full?'전체화면 해제 ⛶':'전체화면 ⛶';fullscreen.setAttribute('aria-label',full?'브랜드 영상 전체화면 해제':'브랜드 영상 전체화면')}
 function play(fromStart=false){if(!active||window.deckEditor?.active)return;if(fromStart||video.ended)video.currentTime=0;video.muted=true;fallback.hidden=true;const promise=video.play();if(promise)promise.catch(()=>{if(active&&!window.deckEditor?.active)fallback.hidden=false});update()}
 function flip(){if(video.paused||video.ended)play();else video.pause()}
 window.brandFilm={setActive(value){const entering=value&&!active;active=value;video.autoplay=value&&!window.deckEditor?.active;if(entering)play(true);else if(!value){video.pause();fallback.hidden=true;if(document.fullscreenElement===player)document.exitFullscreen().catch(()=>{})}update()},editModeChanged(editing){if(editing){video.pause();fallback.hidden=true}else if(active)play();update()}};
 toggle.addEventListener('click',flip);video.addEventListener('click',flip);fallback.addEventListener('click',()=>play());restart.addEventListener('click',()=>play(true));
 for(const name of ['play','pause','ended','loadedmetadata','timeupdate','durationchange'])video.addEventListener(name,()=>{if(name==='play'&&!active){video.pause();return}if(name==='play')fallback.hidden=true;update()});
 seek.addEventListener('input',event=>{seeking=true;video.currentTime=+event.target.value;update()});seek.addEventListener('change',()=>{seeking=false;update()});seek.addEventListener('keydown',event=>event.stopPropagation());
 fullscreen.addEventListener('click',()=>{if(document.fullscreenElement===player)document.exitFullscreen().catch(()=>{});else player.requestFullscreen?.().catch(()=>{})});
 document.addEventListener('fullscreenchange',update);document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause()});
 document.addEventListener('keydown',event=>{if(!active||document.querySelector('dialog[open]')||!['Enter',' '].includes(event.key)||event.target.closest('button,a,input,select,textarea,[contenteditable="true"]'))return;event.preventDefault();if(!event.repeat)flip()});
 update();
 // app.js initializes the route before this optional player module loads.
 window.brandFilm.setActive(!video.closest('.slide').hidden);
})();
