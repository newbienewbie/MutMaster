﻿// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


class MutMasterControl {
    constructor(container) {
        this.mainSection = container.querySelector('.main-controls');
        this.record = this.mainSection.querySelector('.record');
        this.stop = this.mainSection.querySelector('.stop');
        this.resultStatusElement= container.querySelector(".result-status");
        this.resultTextElement= container.querySelector(".result-text");
        this.ttsButton = container.querySelector(".tts");
        this.audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        this.stop.disabled = true;
        this.chunks = [];     // data recorded by mediaRecorder

        this.ttsButton.onclick= e => this._processTts.bind(this).apply();
        this.mediaRecorder = null;

        navigator.mediaDevices.getUserMedia({
            audio: true
        })
        .then(
            stream => {
                this.mediaRecorder = new MediaRecorder(stream, {
                    mimeType: 'audio/webm',
                    codecs: "opus",
                });
                this.record.onclick=this._startRecorder.bind(this);
                this.stop.onclick = this._stopRecorder.bind(this);
                this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data);
                this.mediaRecorder.onstop = e => this._processRecorderData();
            },
            reason => {
                alert(reason);
            }
        )
    }

    changeStatus(str){
        this.resultStatusElement.textContent=str; 
    }

    setResult(result){
        if(result==null){ return null; }
        this.changeStatus( result.RecognitionStatus ); 
        if(result.RecognitionStatus=="Success"){ 
            this.resultTextElement.textContent = result.DisplayText;
        }
        else { 
            console.log("stt fail :",result);
        }
        return result;
    }

    _startRecorder() {
        console.log("recorder started");
        this.chunks=[];   // clear
        this.changeStatus("");
        this.mediaRecorder.start();
        this.record.style.background = "red";
        this.stop.disabled = false;
        this.record.disabled = true;
    }

    _stopRecorder() {
        console.log("recorder stopped");
        this.mediaRecorder.stop();
        this.record.style.background = "";
        this.record.style.color = "";
        this.stop.disabled = true;
        this.record.disabled = false;
    }

    _processRecorderData() {
        var blob = new Blob(this.chunks, {
            'type': 'audio/webm; codecs=opus'
        });
        return audioHelper.decodeAudioBlob(this.audioCtx, blob)
            .then(
                buffer => audioBufferToWav(buffer),
                reason => console.log(reason)
            )
            .then(wav => audioHelper.stt(wav))
            .then(r=> this.setResult(r))
            .then(r=>{
                if(!!r && r.RecognitionStatus == "Success" ){
                    this._processTts(r.DisplayText);
                }
            });
    }

    _processTts(text,font){
        text= !!text? text: this.resultTextElement.textContent;
        if(!text){ alert('no text provided!'); return; }
        var font = !!font? font: "Microsoft Server Speech Text to Speech Voice (zh-CN, Yaoyao, Apollo)";
        return audioHelper.tts(text,font)
            .then(blob=> {
                // console.log(buffer);
                // var blob = new Blob(buffer, { 'type': 'audio/wav; codecs=opus' });
                var audio = document.createElement('audio');
                audio.setAttribute('controls', 'true');
                audio.src = window.URL.createObjectURL(blob);
                audio.autoplay=true;
                return audio;
            })
            .then(audio=>{
                var tip = document.createElement('div');
                tip.textContent= `${text} - ${font}`;
                var container=document.createElement('div');
                container.appendChild(tip);
                container.appendChild(audio);
                document.body.appendChild(container);
            });
    }


}

var audioHelper = { };

audioHelper.decodeAudioBlob= function(audioCtx, blob) {
    return new Promise(function (resolve, reject) {
        var fileReader = new FileReader();
        fileReader.readAsArrayBuffer(blob);
        fileReader.onload = e => audioCtx.decodeAudioData(fileReader.result, resolve, reject);
    });
}

audioHelper.stt=function(audio) {
    console.log("invoking stt service" , audio);
    console.log("how many byte?: " , audio.byteLength)

    var formData = new FormData();
    formData.append("language","zh-CN");
    formData.append("audio",new Blob([audio]),"audio.wav");
    formData.append("contentType","audio/wav; codecs=audio/pcm; samplerate=16000");

    return fetch("/Speech/STT",{
        method:"POST",
        headers:{
        },
        body: formData,
    }).then(r=>r.json());
}

audioHelper.tts=function(text,voiceName='Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)'){
    var params= new URLSearchParams();
    params.append('text',text);
    params.append('voiceName',voiceName)

    return fetch('/Speech/TTS', {
        method: "POST",
        body: params
    })
    .then(r => r.blob())

}



var m =new MutMasterControl(document.querySelector(".wrapper"));