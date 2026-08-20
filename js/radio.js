(()=>{
  const player=document.querySelector('[data-radio]');
  if(!player||document.querySelector('#signal-soundcloud-widget'))return;
  const playlist='https://soundcloud.com/kelioo/sets/new-shed-ig';
  const toggle=player.querySelector('.radio-toggle');
  const mute=player.querySelector('.radio-mute');
  const status=player.querySelector('.radio-status');
  let widget=null,ready=false,playing=false,muted=false,volume=100;
  const setState=(label,state)=>{status.textContent=label;player.classList.toggle('is-playing',state==='playing');player.classList.toggle('is-off',state==='off');toggle.setAttribute('aria-label',state==='playing'?'Mettre la radio en pause':'Lire la radio')};
  const iframe=document.createElement('iframe');
  iframe.id='signal-soundcloud-widget';iframe.className='soundcloud-widget';iframe.title='Lecteur SoundCloud Signal Music France';iframe.allow='autoplay';
  iframe.src=`https://w.soundcloud.com/player/?url=${encodeURIComponent(playlist)}&auto_play=false&buying=false&sharing=false&download=false&show_artwork=false&show_playcount=false&show_user=false`;
  document.body.append(iframe);
  const initialise=()=>{widget=window.SC.Widget(iframe);widget.bind(window.SC.Widget.Events.READY,()=>{ready=true;setState('RADIO READY','ready');widget.getVolume(value=>{volume=value||100})});widget.bind(window.SC.Widget.Events.PLAY,()=>{playing=true;widget.getCurrentSound(sound=>setState(`PLAYING — ${sound?.title||'SIGNAL RADIO'}`,'playing'))});widget.bind(window.SC.Widget.Events.PAUSE,()=>{playing=false;setState('RADIO READY','ready')});widget.bind(window.SC.Widget.Events.FINISH,()=>{playing=false;setState('RADIO READY','ready')});widget.bind(window.SC.Widget.Events.ERROR,()=>{playing=false;setState('OFF AIR','off')})};
  const api=document.createElement('script');api.src='https://w.soundcloud.com/player/api.js';api.async=true;api.onload=initialise;api.onerror=()=>setState('OFF AIR','off');document.head.append(api);
  toggle.addEventListener('click',()=>{if(!ready||!widget)return;if(playing)widget.pause();else widget.play()});
  mute.addEventListener('click',()=>{if(!ready||!widget)return;muted=!muted;widget.setVolume(muted?0:volume);mute.textContent=muted?'UNMUTE':'MUTE';mute.setAttribute('aria-pressed',String(muted))});
})();
