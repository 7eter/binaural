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

playButton.addEventListener('click', () => {
  if(playing){
    leftChannel.stop();
    rightChannel.stop();
    console.log("stoped");
    playing=false;
    return;
  }

  // Set up audio context and nodes
  audioCtx = new AudioContext();
  leftChannel = audioCtx.createOscillator();
  rightChannel = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();
  initialized=true;

  // Set the frequency of the oscillators
  const baseFrequency = 200; // This is the base frequency, in Hz
  const differenceFrequency = 10; // This is the difference between the left and right channel frequencies, in Hz
  leftChannel.frequency.setValueAtTime(baseFrequencyInput.value - differenceFrequencyInput.value, audioCtx.currentTime);
  rightChannel.frequency.setValueAtTime(baseFrequencyInput.value + differenceFrequencyInput.value, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(volumeInput.value, audioCtx.currentTime);

  // Connect the nodes
  leftChannel.connect(gainNode);
  rightChannel.connect(gainNode);
  gainNode.connect(audioCtx.destination);


  // Start the oscillators
  
  leftChannel.start();
  rightChannel.start();
  console.log("started");
  playing=true;
  });