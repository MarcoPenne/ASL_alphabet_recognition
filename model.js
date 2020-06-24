//import * as tf from './tfjs.js';

let model;
async function init(){

    model = await tf.loadGraphModel('graph_model/model.json');

    document.getElementById("loading").hidden = true;
    // JavaScript

    var video = document.getElementById("video");
    try{
        const s = await navigator.mediaDevices.getUserMedia({video: {width:600, height:600}})
        console.log(s)
        handleVideo(s);
    }
    catch(e){
        console.log(e.toString())
    }
    function handleVideo(stream){
        //window.URL.createObjectURL()
        window.stream = stream;
        video.srcObject = stream;
    }
    function videoError(e){

    }

    const canvas = document.getElementById("canvas");

    // scale the canvas accordingly
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    // draw the video at that frame
    canvas.getContext('2d')
    .drawImage(video, 0, 0, canvas.width, canvas.height);
    // convert it to a usable data URL
    const dataURL = canvas.toDataURL();

}

init()

setInterval(function(){
    var video = document.getElementById("video")
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // scale the canvas accordingly
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    // draw the video at that frame
    canvas.getContext('2d')
    .drawImage(video, 0, 0, canvas.width, canvas.height);
    // convert it to a usable data URL
    const dataURL = canvas.toDataURL();

    
    var img = new Image;
    img.src = dataURL;
    img.onload = () => {
        ctx.drawImage(img, 0, 0);

        tf.engine().startScope()

        var t = tf.browser.fromPixels(img)
        var t = t.resizeBilinear([100,100])
        t = t.expandDims()
        const b = tf.scalar(255);
        t = t.div(b);
        let pred = model.predict(t)
        let index = pred.argMax(1)
        const tensorData = index.dataSync();
        let classnames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'del', 'nothing', 'space']
        let answer = classnames[tensorData[0]] 
        let div = document.getElementById("answer");
        div.textContent = answer;

        tf.engine().endScope()
    }
    
}, 500)