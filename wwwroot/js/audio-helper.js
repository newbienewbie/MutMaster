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
