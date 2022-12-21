const baseFrequencyInput = document.getElementById('base-frequency');
const differenceFrequencyInput = document.getElementById('difference-frequency');
const volumeInput = document.getElementById('volume');
const playButton = document.getElementById('play-button');

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
    playButton.innerHTML="Play";
    return;
  }

  // Set up audio context and nodes
  audioCtx = new AudioContext();
  leftChannel = audioCtx.createOscillator();
  rightChannel = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();

  // Set the frequency of the oscillators
  const baseFrequency = 200; // This is the base frequency, in Hz
  const differenceFrequency = 10; // This is the difference between the left and right channel frequencies, in Hz
  leftChannel.frequency.setValueAtTime(baseFrequencyInput.value - differenceFrequencyInput.value, audioCtx.currentTime);
  rightChannel.frequency.setValueAtTime(parseFloat(baseFrequencyInput.value) + parseFloat(differenceFrequencyInput.value), audioCtx.currentTime);
  const pannerLeft = audioCtx.createPanner();
  const pannerRight = audioCtx.createPanner();
  gainNode.gain.setValueAtTime(volumeInput.value, audioCtx.currentTime);

  // Set the panning of the channels
  pannerLeft.pan.setValueAtTime(-1, audioCtx.currentTime); // Pan the left channel to the left speaker
  pannerRight.pan.setValueAtTime(1, audioCtx.currentTime); // Pan the right channel to the right speaker
  
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
  console.log("started");
  playing=true;
  playButton.innerHTML="Stop";
  });