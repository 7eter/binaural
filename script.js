const baseFrequencyInput = document.getElementById('base-frequency');
const differenceFrequencyInput = document.getElementById('difference-frequency');
const volumeInput = document.getElementById('volume');
const playButton = document.getElementById('play-button');

let playing=false;

let audioCtx;
let leftChannel;
let rightChannel;
let gainNode;


let volumeInterval; 
let volume=volumeInput.value;

function stopAudio(){
  if(gainNode.gain.value>0){
    volumeInput.value-=0.01;
    gainNode.gain.setValueAtTime(volumeInput.value, audioCtx.currentTime);
  }
  else{
    clearInterval(volumeInterval);
    //leftChannel.stop();
    //rightChannel.stop();
    console.log("stoped");
  }
}

function startAudio(){
  if(gainNode.gain.value<volume){
    volumeInput.value+=0.01;
    gainNode.gain.setValueAtTime(volumeInput.value, audioCtx.currentTime);
  }
  else{
    clearInterval(volumeInterval);
    console.log("playing");
  }
}

playButton.addEventListener('click', () => {
  if(playing){
    playing=false;
    playButton.innerHTML="Play";
    volumeInterval = setInterval(stopAudio,10);
    return;
  }

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
  volumeInterval = setInterval(startAudio,10);
  console.log("started");
  playing=true;
  playButton.innerHTML="Stop";
  });


  baseFrequencyInput.addEventListener('input', () => {
    calcFeq();
  });

  differenceFrequencyInput.addEventListener('input', () => {
    calcFeq()
  });

  volumeInput.addEventListener('input', () => {
    gainNode.gain.setValueAtTime(volumeInput.value, audioCtx.currentTime);
    volume=volumeInput.value;
  });

  function calcFeq(){
    leftChannel.frequency.setValueAtTime(baseFrequencyInput.value - differenceFrequencyInput.value/2, audioCtx.currentTime);
    rightChannel.frequency.setValueAtTime(parseFloat(baseFrequencyInput.value) + parseFloat(differenceFrequencyInput.value)/2, audioCtx.currentTime);
  }