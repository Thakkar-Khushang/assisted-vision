let saidText = '';

const speak = (message) => {
  if(speechSynthesis.speaking){
    speechSynthesis.cancel();
  }  
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
  saidText = message;
};

export const drawRect = (detections, ctx) =>{
  // Loop through each prediction
  const prediction = detections[0];
  if(prediction){
  const [x, y, width, height] = prediction['bbox']; 
    const text = prediction['class'];
    if(saidText !== text){
      speak(text);
    }

    // Set styling
    const color = 'green'
    ctx.strokeStyle = 'green'
    ctx.font = '18px Arial';

    // Draw rectangles and text
    ctx.beginPath();   
    ctx.fillStyle = color
    ctx.fillText(text, x, y);
    ctx.rect(x, y, width, height); 
    ctx.stroke();
  }
}
