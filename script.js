const baseFrequencyInput = document.getElementById('base-frequency');
const differenceFrequencyInput = document.getElementById('difference-frequency');
const volumeInput = document.getElementById('volume');
const playButton = document.getElementById('play-button');

let initialized=false;
let playing=false;

let audioCtx;
let leftChannel;
let rightChannel;
let gainNode;

let volumeInterval; 
let volume=volumeInput.value;



function initializeOszillator(){
  // Set up audio context and nodes
  audioCtx = new AudioContext();
  leftChannel = audioCtx.createOscillator();
  rightChannel = audioCtx.createOscillator();
  pannerLeft = audioCtx.createPanner();
  pannerRight = audioCtx.createPanner();
  gainNode = audioCtx.createGain();

  // Set the frequency of the oscillators
  calcFeq();
  // Set volume
  gainNode.gain.setValueAtTime(volumeInput.value, audioCtx.currentTime);

  // Set the panning of the channels
  pannerLeft.setPosition(-1, 0, 0); // Pan the left channel to the left speaker
  pannerRight.setPosition(1, 0, 0); // Pan the right channel to the right speaker
  
  console.log("base frequency = " + baseFrequencyInput.value)
  console.log("difference frequency = " + differenceFrequencyInput.value)
  console.log("left channel frequency = " + leftChannel.frequency.value)
  console.log("right channel frequency = " + rightChannel.frequency.value)
  // Connect the nodes
  leftChannel.connect(pannerLeft);
  rightChannel.connect(pannerRight);
  pannerLeft.connect(gainNode);
  pannerRight.connect(gainNode);
  gainNode.connect(audioCtx.destination);


  // Start the oscillators
  leftChannel.start();
  rightChannel.start();
  initialized=true;
}


function stopAudio(){
  if(gainNode.gain.value>0){
    volumeInput.value-=0.01;
    gainNode.gain.setValueAtTime(volumeInput.value, audioCtx.currentTime);
  }
  else{
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    clearInterval(volumeInterval);
    //leftChannel.stop();
    //rightChannel.stop();
    console.log("stoped");
  }
}

function startAudio(){
  if(gainNode.gain.value<parseFloat(volume)){
    volumeInput.value=parseFloat(volumeInput.value)+0.01;
    gainNode.gain.setValueAtTime(volumeInput.value, audioCtx.currentTime);
  }
  else{
    volumeInput.value=parseFloat(volume);
    gainNode.gain.setValueAtTime(volumeInput.value, audioCtx.currentTime);
    clearInterval(volumeInterval);
    console.log("playing");
  }
}

playButton.addEventListener('click', () => {
  if(!initialized){
    initializeOszillator();
  }

  if(Math.abs(parseFloat(volume)-gainNode.gain.value)>0.01 && gainNode.gain.value!=0){
    console.log("clicked while fading in/out");
    return;
  }

  if(playing){
    playing=false;
    playButton.innerHTML="Play";
    volumeInterval = setInterval(stopAudio,10);
    return;
  }
  else{
    if(volume<0.01) volume=0.25;
    playing=true;
    playButton.innerHTML="Stop";
    volumeInterval = setInterval(startAudio,10);
  }
  });


  baseFrequencyInput.addEventListener('input', () => {
    calcFeq();
  });

  differenceFrequencyInput.addEventListener('input', () => {
    calcFeq();
  });

  volumeInput.addEventListener('input', () => {
    setVolume();
  });

  function setVolume(newVolume = volumeInput.value){
    if(newVolume<0)newVolume=0;
    if(newVolume>0.5)newVolume=0.5;
    volume=newVolume;
    volumeInput.value=newVolume;
    gainNode.gain.setValueAtTime(newVolume, audioCtx.currentTime);
    playing=true;
    playButton.innerHTML="Stop";
    if(volume=="0"){
      playing=false;
      playButton.innerHTML="Play";
    }
    console.log("Volume set to "+ volume);
  }

  function toggleLeftSpeaker(button){
    // stop and play left oscillator:
    if(leftChannel.frequency.value==0){
      leftChannel.frequency.setValueAtTime(baseFrequencyInput.value - differenceFrequencyInput.value/2, audioCtx.currentTime);
      button.style.backgroundColor="white";
    }
    else{
      leftChannel.frequency.setValueAtTime(0, audioCtx.currentTime);
      button.style.backgroundColor="gray";
    }
  }

  function toggleRightSpeaker(button){
    // stop and play right oscillator:
    if(rightChannel.frequency.value==0){
      rightChannel.frequency.setValueAtTime(parseFloat(baseFrequencyInput.value) + parseFloat(differenceFrequencyInput.value)/2, audioCtx.currentTime);
      button.style.backgroundColor="white";
    }
    else{
      rightChannel.frequency.setValueAtTime(0, audioCtx.currentTime);
      button.style.backgroundColor="gray";
    }
  }


  function calcFeq(){
    leftChannel.frequency.setValueAtTime(baseFrequencyInput.value - differenceFrequencyInput.value/2, audioCtx.currentTime);
    rightChannel.frequency.setValueAtTime(parseFloat(baseFrequencyInput.value) + parseFloat(differenceFrequencyInput.value)/2, audioCtx.currentTime);
  }

document.addEventListener("keydown", (event) => {
    console.log("you pressed " + event.key);
    if(event.key==="ArrowUp"){
    setVolume(parseFloat(volumeInput.value)+0.05);
    }
    if(event.key==="ArrowDown"){
      setVolume(parseFloat(volumeInput.value)-0.05);
    }
    return;
});